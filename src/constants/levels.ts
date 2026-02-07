export interface LevelDef {
  level: number
  name: string
  trackIds: string[]
  trackWidth: number
  aiSkillRange: [number, number]
  description: string
}

export const LEVELS: LevelDef[] = [
  {
    level: 1,
    name: 'Rookie',
    trackIds: ['lake-placid', 'calgary', 'vancouver'],
    trackWidth: 3.0,
    aiSkillRange: [0.7, 0.8],
    description: 'Wide tracks, gentle curves. Perfect for beginners!',
  },
  {
    level: 2,
    name: 'Amateur',
    trackIds: ['nagano', 'salt-lake-city', 'turin'],
    trackWidth: 2.5,
    aiSkillRange: [0.8, 0.85],
    description: 'Tighter turns and faster speeds. You can do it!',
  },
  {
    level: 3,
    name: 'Pro',
    trackIds: ['oslo', 'innsbruck', 'lillehammer'],
    trackWidth: 2.0,
    aiSkillRange: [0.85, 0.9],
    description: 'Challenging tracks for skilled racers.',
  },
  {
    level: 4,
    name: 'Champion',
    trackIds: ['chamonix', 'st-moritz', 'cortina'],
    trackWidth: 1.8,
    aiSkillRange: [0.9, 0.95],
    description: 'Only the bravest dare race here!',
  },
  {
    level: 5,
    name: 'Legend',
    trackIds: ['beijing', 'sochi', 'pyeongchang'],
    trackWidth: 1.5,
    aiSkillRange: [0.95, 0.99],
    description: 'The ultimate challenge. Become a legend!',
  },
]

export function getLevel(level: number): LevelDef {
  return LEVELS.find((l) => l.level === level) ?? LEVELS[0]
}
