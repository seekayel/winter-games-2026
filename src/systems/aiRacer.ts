import type { AIRacerState } from '../types/game'
import { getTrackSlope, generateTrackData } from './trackGenerator'
import { getTrackPoints } from '../data/trackPaths'
import {
  GRAVITY_SLOPE_FACTOR,
  MAX_SPEED,
  MIN_SPEED,
} from '../constants/physics'

const AI_NAMES = [
  'Frosty McSpeed',
  'Arctic Arrow',
  'Blizzard Bob',
  'Penguin Pete',
  'Ice Dash',
  'Snow Rocket',
  'Glacier Girl',
  'Polar Express',
  'Chill Factor',
  'Winter Wind',
  'Frost Bite',
  'Snowball Sam',
]

const AI_COLORS = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22']

export function createAIRacers(skillRange: [number, number]): AIRacerState[] {
  const shuffledNames = [...AI_NAMES].sort(() => Math.random() - 0.5)
  const racers: AIRacerState[] = []

  for (let i = 0; i < 3; i++) {
    const skill = skillRange[0] + (i / 2) * (skillRange[1] - skillRange[0])
    racers.push({
      id: `ai-${i}`,
      name: shuffledNames[i],
      color: AI_COLORS[i % AI_COLORS.length],
      progress: 0,
      lateralOffset: (Math.random() - 0.5) * 0.6,
      speed: 5 + skill * 10,
      finished: false,
      finishTime: 0,
    })
  }

  return racers
}

export function updateAIRacers(
  racers: AIRacerState[],
  trackId: string,
  skillRange: [number, number],
  playerProgress: number,
  dt: number,
  elapsedTime: number,
): AIRacerState[] {
  const trackData = generateTrackData(getTrackPoints(trackId))

  return racers.map((racer, idx) => {
    if (racer.finished) return racer

    const skill = skillRange[0] + (idx / 2) * (skillRange[1] - skillRange[0])

    // Base speed from slope
    const slope = getTrackSlope(trackData, racer.progress)
    const gravityAccel = GRAVITY_SLOPE_FACTOR * slope
    let speed = racer.speed + gravityAccel * dt

    // Skill factor
    speed = Math.max(MIN_SPEED, speed)
    speed *= skill

    // Speed variation for "alive" feel
    speed *= 1 + Math.sin(elapsedTime * (1.5 + idx * 0.3)) * 0.05

    // Rubber-banding
    const progressDiff = playerProgress - racer.progress
    if (progressDiff > 0.05) {
      // Player is ahead, AI catches up
      speed *= 1 + progressDiff * 0.8
    } else if (progressDiff < -0.05) {
      // AI is ahead, slow down slightly
      speed *= 1 + progressDiff * 0.3
    }

    speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed))

    // Progress
    const progressDelta = (speed * dt) / trackData.totalLength
    const newProgress = Math.min(1, racer.progress + progressDelta)

    // Lateral weaving
    const lateralOffset =
      Math.sin(elapsedTime * (0.8 + idx * 0.2) + idx * 2) * 0.3

    const finished = newProgress >= 1

    return {
      ...racer,
      progress: newProgress,
      lateralOffset,
      speed,
      finished,
      finishTime: finished && !racer.finished ? elapsedTime : racer.finishTime,
    }
  })
}
