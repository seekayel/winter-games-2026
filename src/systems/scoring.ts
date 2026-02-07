import type { RaceResult, AIRacerState } from '../types/game'
import { REWARDS } from '../constants/physics'

export function calculateRaceResults(
  playerName: string,
  playerFinishTime: number,
  aiRacers: AIRacerState[],
): RaceResult[] {
  // Combine player and AI results
  const allFinishers: { name: string; isPlayer: boolean; time: number }[] = [
    { name: playerName || 'Player', isPlayer: true, time: playerFinishTime },
    ...aiRacers.map((ai) => ({
      name: ai.name,
      isPlayer: false,
      time: ai.finished ? ai.finishTime : playerFinishTime + 10, // Unfinished AI gets penalty time
    })),
  ]

  // Sort by time
  allFinishers.sort((a, b) => a.time - b.time)

  return allFinishers.map((finisher, idx) => {
    const placement = idx + 1
    const reward = REWARDS[placement as keyof typeof REWARDS] ?? { dollars: 0, stars: 0 }

    return {
      racerName: finisher.name,
      isPlayer: finisher.isPlayer,
      finishTime: finisher.time,
      placement,
      sponsorDollars: finisher.isPlayer ? reward.dollars : 0,
      stars: finisher.isPlayer ? reward.stars : 0,
    }
  })
}
