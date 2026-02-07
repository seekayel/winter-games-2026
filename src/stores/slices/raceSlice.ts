import type { StateCreator } from 'zustand'
import type { Screen, RacePhase, AIRacerState, RaceResult } from '../../types/game'

export interface RaceSlice {
  // Navigation
  currentScreen: Screen
  setScreen: (screen: Screen) => void

  // Race selection
  selectedLevel: number
  selectedTrackId: string | null
  setSelectedLevel: (level: number) => void
  setSelectedTrackId: (trackId: string | null) => void

  // Race state
  racePhase: RacePhase
  setRacePhase: (phase: RacePhase) => void
  sprintSpeed: number
  setSprintSpeed: (speed: number) => void
  jumpTimingScore: number
  setJumpTimingScore: (score: number) => void
  currentSpeed: number
  setCurrentSpeed: (speed: number) => void
  steeringInput: number
  setSteeringInput: (input: number) => void
  playerProgress: number
  setPlayerProgress: (progress: number) => void
  playerLateralOffset: number
  setPlayerLateralOffset: (offset: number) => void
  playerPosition: number
  setPlayerPosition: (position: number) => void

  // AI
  aiRacers: AIRacerState[]
  setAIRacers: (racers: AIRacerState[]) => void
  updateAIRacer: (id: string, updates: Partial<AIRacerState>) => void

  // Timing
  raceStartTime: number
  setRaceStartTime: (time: number) => void
  raceElapsedTime: number
  setRaceElapsedTime: (time: number) => void
  playerFinishTime: number
  setPlayerFinishTime: (time: number) => void

  // Results
  raceResults: RaceResult[]
  setRaceResults: (results: RaceResult[]) => void

  // Reset
  resetRace: () => void
}

const initialRaceState = {
  currentScreen: 'main-menu' as Screen,
  selectedLevel: 1,
  selectedTrackId: null as string | null,
  racePhase: 'countdown' as RacePhase,
  sprintSpeed: 0,
  jumpTimingScore: 0,
  currentSpeed: 0,
  steeringInput: 0,
  playerProgress: 0,
  playerLateralOffset: 0,
  playerPosition: 1,
  aiRacers: [] as AIRacerState[],
  raceStartTime: 0,
  raceElapsedTime: 0,
  playerFinishTime: 0,
  raceResults: [] as RaceResult[],
}

export const createRaceSlice: StateCreator<RaceSlice, [], [], RaceSlice> = (set) => ({
  ...initialRaceState,

  setScreen: (screen) => set({ currentScreen: screen }),
  setSelectedLevel: (level) => set({ selectedLevel: level }),
  setSelectedTrackId: (trackId) => set({ selectedTrackId: trackId }),
  setRacePhase: (phase) => set({ racePhase: phase }),
  setSprintSpeed: (speed) => set({ sprintSpeed: speed }),
  setJumpTimingScore: (score) => set({ jumpTimingScore: score }),
  setCurrentSpeed: (speed) => set({ currentSpeed: speed }),
  setSteeringInput: (input) => set({ steeringInput: input }),
  setPlayerProgress: (progress) => set({ playerProgress: progress }),
  setPlayerLateralOffset: (offset) => set({ playerLateralOffset: offset }),
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setAIRacers: (racers) => set({ aiRacers: racers }),
  updateAIRacer: (id, updates) =>
    set((state) => ({
      aiRacers: state.aiRacers.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  setRaceStartTime: (time) => set({ raceStartTime: time }),
  setRaceElapsedTime: (time) => set({ raceElapsedTime: time }),
  setPlayerFinishTime: (time) => set({ playerFinishTime: time }),
  setRaceResults: (results) => set({ raceResults: results }),
  resetRace: () =>
    set({
      racePhase: 'countdown',
      sprintSpeed: 0,
      jumpTimingScore: 0,
      currentSpeed: 0,
      steeringInput: 0,
      playerProgress: 0,
      playerLateralOffset: 0,
      playerPosition: 1,
      aiRacers: [],
      raceStartTime: 0,
      raceElapsedTime: 0,
      playerFinishTime: 0,
      raceResults: [],
    }),
})
