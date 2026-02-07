import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../stores/useGameStore'
import { getLevel } from '../constants/levels'
import { createAIRacers, updateAIRacers } from './aiRacer'
import { calculateRaceResults } from './scoring'
import { WINS_TO_UNLOCK } from '../constants/physics'
import { playVictoryFanfare } from './audio'

export function RaceManager() {
  const racePhase = useGameStore((s) => s.racePhase)
  const selectedTrackId = useGameStore((s) => s.selectedTrackId)
  const selectedLevel = useGameStore((s) => s.selectedLevel)
  const aiInitialized = useRef(false)
  const resultsCalculated = useRef(false)

  // Initialize AI racers when entering sprint phase
  useEffect(() => {
    if (racePhase === 'sprint' && !aiInitialized.current && selectedTrackId) {
      const levelDef = getLevel(selectedLevel)
      const racers = createAIRacers(levelDef.aiSkillRange)
      useGameStore.getState().setAIRacers(racers)
      aiInitialized.current = true
      resultsCalculated.current = false
    }

    if (racePhase === 'countdown') {
      aiInitialized.current = false
      resultsCalculated.current = false
    }
  }, [racePhase, selectedTrackId, selectedLevel])

  // Update AI racers during driving phase
  useFrame((_, delta) => {
    const state = useGameStore.getState()
    if (state.racePhase !== 'driving' && state.racePhase !== 'finished') return
    if (!selectedTrackId) return

    const levelDef = getLevel(selectedLevel)
    const dt = Math.min(delta, 0.05)
    const elapsed = state.raceElapsedTime

    // Update AI
    if (state.aiRacers.length > 0) {
      // Give AI a starting speed boost based on sprint phase timing
      const updatedRacers = updateAIRacers(
        state.aiRacers,
        selectedTrackId,
        levelDef.aiSkillRange,
        state.playerProgress,
        dt,
        elapsed,
      )
      state.setAIRacers(updatedRacers)
    }

    // Calculate positions
    if (state.aiRacers.length > 0) {
      const allProgress = [
        { id: 'player', progress: state.playerProgress },
        ...state.aiRacers.map((r) => ({ id: r.id, progress: r.progress })),
      ]
      allProgress.sort((a, b) => b.progress - a.progress)
      const playerPos = allProgress.findIndex((p) => p.id === 'player') + 1
      state.setPlayerPosition(playerPos)
    }

    // When player finishes and all AI finish (or timeout), calculate results
    if (state.racePhase === 'finished' && !resultsCalculated.current) {
      const allAIFinished = state.aiRacers.every((r) => r.finished)
      const timeout = elapsed - state.playerFinishTime > 5

      if (allAIFinished || timeout) {
        resultsCalculated.current = true

        const results = calculateRaceResults(
          state.playerName,
          state.playerFinishTime,
          state.aiRacers,
        )

        state.setRaceResults(results)

        // Apply rewards
        const playerResult = results.find((r) => r.isPlayer)
        if (playerResult && playerResult.placement === 1) {
          playVictoryFanfare()
        }
        if (playerResult) {
          state.addSponsorDollars(playerResult.sponsorDollars)
          state.completeTrack(
            selectedTrackId,
            playerResult.finishTime,
            playerResult.placement,
            playerResult.stars,
          )

          // Check for level unlock
          const firstPlaceCount = levelDef.trackIds.filter(
            (id) => {
              const track = useGameStore.getState().completedTracks[id]
              return track?.bestPlacement === 1
            },
          ).length

          if (firstPlaceCount >= WINS_TO_UNLOCK && selectedLevel < 5) {
            const nextLevel = selectedLevel + 1
            if (!useGameStore.getState().unlockedLevels.includes(nextLevel)) {
              state.unlockLevel(nextLevel)
              // Show unlock screen after a delay
              setTimeout(() => {
                useGameStore.getState().setScreen('level-unlocked')
              }, 3000)
              // Show results first
              setTimeout(() => {
                useGameStore.getState().setScreen('race-results')
              }, 2000)
              return
            }
          }

          // Show results after delay
          setTimeout(() => {
            useGameStore.getState().setScreen('race-results')
          }, 2000)
        }
      }
    }
  })

  return null
}
