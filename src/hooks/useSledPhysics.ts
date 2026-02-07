import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../stores/useGameStore'
import { getSled } from '../constants/sleds'
import { getTrackPoints } from '../data/trackPaths'
import { generateTrackData, getTrackSlope } from '../systems/trackGenerator'
import {
  BASE_GRAVITY_SPEED,
  GRAVITY_SLOPE_FACTOR,
  STEERING_SENSITIVITY,
  WALL_CONTACT_THRESHOLD,
  WALL_SPEED_PENALTY,
  WALL_BOUNCE_FACTOR,
  MAX_SPEED,
  MIN_SPEED,
  SPEED_SLED_FACTOR,
  HANDLING_SLED_FACTOR,
} from '../constants/physics'
import { useKeyboard } from './useKeyboard'
import { playWallHit, playFinishCross } from '../systems/audio'

export function useSledPhysics(trackId: string) {
  const keys = useKeyboard()
  const speedRef = useRef(0)
  const initialized = useRef(false)
  const wallHitCooldown = useRef(0)

  const trackData = useMemo(() => {
    const points = getTrackPoints(trackId)
    return generateTrackData(points)
  }, [trackId])

  useFrame((_, delta) => {
    const state = useGameStore.getState()
    if (state.racePhase !== 'driving') return

    // Initialize speed from sprint + jump
    if (!initialized.current) {
      const sprintBonus = state.sprintSpeed * 15
      const jumpBonus = state.jumpTimingScore * 5
      speedRef.current = BASE_GRAVITY_SPEED * 0.5 + sprintBonus + jumpBonus
      initialized.current = true
    }

    const sled = getSled(state.selectedSledId)
    const dt = Math.min(delta, 0.05) // Cap delta to prevent physics explosion

    // Get slope at current position
    const slope = getTrackSlope(trackData, state.playerProgress)

    // Speed from gravity + slope
    const gravityAccel = GRAVITY_SLOPE_FACTOR * slope
    const sledSpeedBonus = 1 + sled.speed * SPEED_SLED_FACTOR

    speedRef.current += gravityAccel * dt
    speedRef.current *= sledSpeedBonus

    // Air drag
    speedRef.current *= 1 - 0.01 * dt

    // Clamp speed
    speedRef.current = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speedRef.current))

    // Steering
    let steer = 0
    if (keys.current.has('ArrowLeft')) steer -= 1
    if (keys.current.has('ArrowRight')) steer += 1

    const handlingFactor = 1 + sled.handling * HANDLING_SLED_FACTOR
    let lateralOffset = state.playerLateralOffset + steer * STEERING_SENSITIVITY * handlingFactor * dt

    // Wall collision
    wallHitCooldown.current = Math.max(0, wallHitCooldown.current - dt)
    if (Math.abs(lateralOffset) > WALL_CONTACT_THRESHOLD) {
      speedRef.current *= WALL_SPEED_PENALTY
      lateralOffset = Math.sign(lateralOffset) * (WALL_CONTACT_THRESHOLD - WALL_BOUNCE_FACTOR * dt)
      if (wallHitCooldown.current <= 0) {
        playWallHit()
        wallHitCooldown.current = 0.3
      }
    }

    lateralOffset = Math.max(-1, Math.min(1, lateralOffset))

    // Progress along track
    const progressDelta = (speedRef.current * dt) / trackData.totalLength
    const newProgress = state.playerProgress + progressDelta

    // Update store
    state.setCurrentSpeed(speedRef.current)
    state.setPlayerLateralOffset(lateralOffset)
    state.setPlayerProgress(newProgress)
    state.setSteeringInput(steer)

    // Update race time
    if (state.raceStartTime > 0) {
      state.setRaceElapsedTime((Date.now() - state.raceStartTime) / 1000)
    }

    // Check finish
    if (newProgress >= 1 && state.racePhase === 'driving') {
      state.setPlayerProgress(1)
      state.setPlayerFinishTime(state.raceElapsedTime)
      state.setRacePhase('finished')
      playFinishCross()
    }
  })
}
