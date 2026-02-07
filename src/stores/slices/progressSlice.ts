import type { StateCreator } from 'zustand'
import type { TrackCompletion } from '../../types/game'

export interface ProgressSlice {
  playerName: string
  setPlayerName: (name: string) => void
  sponsorDollars: number
  addSponsorDollars: (amount: number) => void
  spendSponsorDollars: (amount: number) => boolean
  unlockedLevels: number[]
  unlockLevel: (level: number) => void
  ownedSleds: string[]
  buySled: (sledId: string) => void
  selectedSledId: string
  selectSled: (sledId: string) => void
  completedTracks: Record<string, TrackCompletion>
  completeTrack: (trackId: string, time: number, placement: number, stars: number) => void
  getFirstPlaceCount: (level: number, trackIds: string[]) => number
}

export const createProgressSlice: StateCreator<ProgressSlice, [], [], ProgressSlice> = (
  set,
  get,
) => ({
  playerName: '',
  setPlayerName: (name) => set({ playerName: name }),

  sponsorDollars: 0,
  addSponsorDollars: (amount) =>
    set((state) => ({ sponsorDollars: state.sponsorDollars + amount })),
  spendSponsorDollars: (amount) => {
    const state = get()
    if (state.sponsorDollars >= amount) {
      set({ sponsorDollars: state.sponsorDollars - amount })
      return true
    }
    return false
  },

  unlockedLevels: [1],
  unlockLevel: (level) =>
    set((state) => ({
      unlockedLevels: state.unlockedLevels.includes(level)
        ? state.unlockedLevels
        : [...state.unlockedLevels, level],
    })),

  ownedSleds: ['starter'],
  buySled: (sledId) =>
    set((state) => ({
      ownedSleds: state.ownedSleds.includes(sledId)
        ? state.ownedSleds
        : [...state.ownedSleds, sledId],
    })),

  selectedSledId: 'starter',
  selectSled: (sledId) => set({ selectedSledId: sledId }),

  completedTracks: {},
  completeTrack: (trackId, time, placement, stars) =>
    set((state) => {
      const existing = state.completedTracks[trackId]
      return {
        completedTracks: {
          ...state.completedTracks,
          [trackId]: {
            bestTime: existing ? Math.min(existing.bestTime, time) : time,
            bestPlacement: existing ? Math.min(existing.bestPlacement, placement) : placement,
            stars: existing ? Math.max(existing.stars, stars) : stars,
            timesPlayed: existing ? existing.timesPlayed + 1 : 1,
          },
        },
      }
    }),

  getFirstPlaceCount: (_level, trackIds) => {
    const state = get()
    return trackIds.filter((id) => state.completedTracks[id]?.bestPlacement === 1).length
  },
})
