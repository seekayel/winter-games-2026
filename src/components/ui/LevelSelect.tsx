import { useGameStore } from '../../stores/useGameStore'
import { LEVELS } from '../../constants/levels'
import { Button } from './common/Button'
import { CoinDisplay } from './common/CoinDisplay'
import { WINS_TO_UNLOCK } from '../../constants/physics'

export function LevelSelect() {
  const {
    unlockedLevels,
    completedTracks,
    sponsorDollars,
    setSelectedLevel,
    setScreen,
  } = useGameStore()

  const handleSelectLevel = (level: number) => {
    setSelectedLevel(level)
    setScreen('track-select')
  }

  return (
    <div className="flex flex-col items-center h-full px-4 py-8 overflow-y-auto">
      <div className="flex items-center justify-between w-full max-w-lg mb-6">
        <Button variant="secondary" size="sm" onClick={() => setScreen('main-menu')}>
          Back
        </Button>
        <h2 className="text-2xl font-bold text-white">Choose Level</h2>
        <CoinDisplay amount={sponsorDollars} size="sm" />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-lg">
        {LEVELS.map((levelDef) => {
          const isUnlocked = unlockedLevels.includes(levelDef.level)
          const firstPlaceCount = levelDef.trackIds.filter(
            (id) => completedTracks[id]?.bestPlacement === 1,
          ).length
          const totalStars = levelDef.trackIds.reduce(
            (sum, id) => sum + (completedTracks[id]?.stars ?? 0),
            0,
          )

          return (
            <button
              key={levelDef.level}
              onClick={() => isUnlocked && handleSelectLevel(levelDef.level)}
              disabled={!isUnlocked}
              className={`relative p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                isUnlocked
                  ? 'bg-ice-800/50 border-ice-500/30 hover:border-ice-400/60 hover:bg-ice-700/50'
                  : 'bg-ice-950/50 border-ice-800/30 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ice-400 uppercase tracking-wider">
                      Level {levelDef.level}
                    </span>
                    {!isUnlocked && (
                      <span className="text-xs bg-ice-900 text-ice-500 px-2 py-0.5 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{levelDef.name}</h3>
                  <p className="text-sm text-ice-300 mt-1">{levelDef.description}</p>
                </div>
                {isUnlocked && (
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-yellow-300 text-lg">
                      {'★'.repeat(totalStars)}
                      {'☆'.repeat(9 - totalStars)}
                    </div>
                    <div className="text-xs text-ice-400 mt-1">
                      {firstPlaceCount}/{WINS_TO_UNLOCK} wins
                    </div>
                  </div>
                )}
              </div>

              {/* Track cities preview */}
              <div className="flex gap-2 mt-3">
                {levelDef.trackIds.map((trackId) => {
                  const completion = completedTracks[trackId]
                  return (
                    <span
                      key={trackId}
                      className={`text-xs px-2 py-1 rounded-full ${
                        completion?.bestPlacement === 1
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : completion
                            ? 'bg-ice-700/50 text-ice-300'
                            : 'bg-ice-900/50 text-ice-500'
                      }`}
                    >
                      {trackId
                        .split('-')
                        .map((w) => w[0].toUpperCase() + w.slice(1))
                        .join(' ')}
                    </span>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
