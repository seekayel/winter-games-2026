import type { StateStorage } from 'zustand/middleware'

export const STORAGE_KEY = 'winter-games-2026-save'
export const STORAGE_VERSION = 1

export const storage: StateStorage = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    return str ?? null
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value)
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
  },
}

// Fields that should NOT be persisted (transient race state)
export const TRANSIENT_KEYS = [
  'currentScreen',
  'racePhase',
  'sprintSpeed',
  'jumpTimingScore',
  'currentSpeed',
  'steeringInput',
  'playerProgress',
  'playerLateralOffset',
  'playerPosition',
  'aiRacers',
  'raceStartTime',
  'raceElapsedTime',
  'playerFinishTime',
  'raceResults',
  'selectedLevel',
  'selectedTrackId',
] as const
