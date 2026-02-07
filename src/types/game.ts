export type Screen =
  | 'main-menu'
  | 'player-setup'
  | 'level-select'
  | 'track-select'
  | 'sled-shop'
  | 'racing'
  | 'race-results'
  | 'level-unlocked'

export type RacePhase =
  | 'countdown'
  | 'sprint'
  | 'jump'
  | 'driving'
  | 'finished'

export interface RaceResult {
  racerName: string
  isPlayer: boolean
  finishTime: number
  placement: number
  sponsorDollars: number
  stars: number
}

export interface AIRacerState {
  id: string
  name: string
  color: string
  progress: number
  lateralOffset: number
  speed: number
  finished: boolean
  finishTime: number
}

export interface TrackCompletion {
  bestTime: number
  bestPlacement: number
  stars: number
  timesPlayed: number
}
