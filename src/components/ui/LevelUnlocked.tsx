import { useGameStore } from '../../stores/useGameStore'
import { getLevel } from '../../constants/levels'
import { Button } from './common/Button'

export function LevelUnlocked() {
  const { selectedLevel, setScreen, setSelectedLevel } = useGameStore()
  const nextLevel = selectedLevel + 1
  const levelDef = getLevel(nextLevel)

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="bg-ice-900/70 rounded-2xl border-2 border-yellow-500/30 p-8 max-w-md w-full backdrop-blur text-center">
        {/* Celebration */}
        <div className="text-6xl mb-4">
          {['🏆', '⭐', '🎉', '❄️', '🏅'][nextLevel - 1] ?? '🏆'}
        </div>

        <h2 className="text-3xl font-black text-yellow-300 mb-2">Level Unlocked!</h2>

        <div className="bg-ice-800/50 rounded-xl p-4 mb-6">
          <div className="text-xs text-ice-400 uppercase tracking-wider">Level {nextLevel}</div>
          <div className="text-2xl font-bold text-white">{levelDef.name}</div>
          <p className="text-sm text-ice-300 mt-1">{levelDef.description}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setScreen('level-select')}>
            Back to Levels
          </Button>
          <Button
            variant="gold"
            className="flex-1"
            onClick={() => {
              setSelectedLevel(nextLevel)
              setScreen('track-select')
            }}
          >
            Try It!
          </Button>
        </div>
      </div>
    </div>
  )
}
