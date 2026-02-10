import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { useGameStore } from '../../../stores/useGameStore'
import { getSled } from '../../../constants/sleds'
import { getTrackPoints } from '../../../data/trackPaths'
import { generateTrackData, getTrackPosition } from '../../../systems/trackGenerator'
import { LEVELS } from '../../../constants/levels'
import { SledModel } from './SledModel'
import { useSledPhysics } from '../../../hooks/useSledPhysics'

interface PlayerSledProps {
  trackId: string
}

export function PlayerSled({ trackId }: PlayerSledProps) {
  const groupRef = useRef<Group>(null)
  const selectedSledId = useGameStore((s) => s.selectedSledId)
  const sled = getSled(selectedSledId)

  const trackData = useMemo(() => {
    const points = getTrackPoints(trackId)
    return generateTrackData(points)
  }, [trackId])

  const width = useMemo(() => {
    const level = LEVELS.find((l) => l.trackIds.includes(trackId))
    return level?.trackWidth ?? 3.0
  }, [trackId])

  // Run physics
  useSledPhysics(trackId)

  const smoothPos = useRef(new Vector3())
  const smoothRoll = useRef(0)

  useFrame(() => {
    if (!groupRef.current) return

    const progress = useGameStore.getState().playerProgress
    const lateralOffset = useGameStore.getState().playerLateralOffset
    const steeringInput = useGameStore.getState().steeringInput

    const { position, tangent } = getTrackPosition(
      trackData,
      progress,
      lateralOffset,
      width,
    )

    // Smooth interpolation
    smoothPos.current.lerp(position, 0.15)
    groupRef.current.position.copy(smoothPos.current)

    // Orient sled along track
    const lookTarget = new Vector3().copy(position).add(tangent)
    groupRef.current.lookAt(lookTarget)

    // Bank/tilt into turns for Mario Kart feel
    const targetRoll = -steeringInput * 0.2
    smoothRoll.current += (targetRoll - smoothRoll.current) * 0.15
    groupRef.current.rotation.z = smoothRoll.current
  })

  return (
    <group ref={groupRef}>
      <SledModel color={sled.color} accentColor={sled.accentColor} />
    </group>
  )
}
