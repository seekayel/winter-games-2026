import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createRaceSlice, type RaceSlice } from './slices/raceSlice'
import { createProgressSlice, type ProgressSlice } from './slices/progressSlice'
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice'
import { STORAGE_KEY, STORAGE_VERSION, storage, TRANSIENT_KEYS } from './persistence'

export type GameStore = RaceSlice & ProgressSlice & SettingsSlice

export const useGameStore = create<GameStore>()(
  persist(
    (...a) => ({
      ...createRaceSlice(...a),
      ...createProgressSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => storage),
      partialize: (state) => {
        const persisted: Record<string, unknown> = {}
        const stateObj = state as unknown as Record<string, unknown>
        for (const key of Object.keys(stateObj)) {
          if (
            !TRANSIENT_KEYS.includes(key as (typeof TRANSIENT_KEYS)[number]) &&
            typeof stateObj[key] !== 'function'
          ) {
            persisted[key] = stateObj[key]
          }
        }
        return persisted as Partial<GameStore>
      },
    },
  ),
)
