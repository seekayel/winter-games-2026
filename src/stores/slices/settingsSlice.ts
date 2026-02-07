import type { StateCreator } from 'zustand'

export interface SettingsSlice {
  musicVolume: number
  setMusicVolume: (volume: number) => void
  sfxVolume: number
  setSfxVolume: (volume: number) => void
  showTutorial: boolean
  setShowTutorial: (show: boolean) => void
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  musicVolume: 0.7,
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  sfxVolume: 1.0,
  setSfxVolume: (volume) => set({ sfxVolume: volume }),
  showTutorial: true,
  setShowTutorial: (show) => set({ showTutorial: show }),
})
