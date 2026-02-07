import { useGameStore } from '../../stores/useGameStore'
import { Button } from './common/Button'
import { CoinDisplay } from './common/CoinDisplay'

export function RaceResults() {
  const {
    raceResults,
    setScreen,
  } = useGameStore()

  const playerResult = raceResults.find((r) => r.isPlayer)
  const sortedResults = [...raceResults].sort((a, b) => a.placement - b.placement)

  const podiumColors = ['text-yellow-300', 'text-gray-300', 'text-amber-500', 'text-ice-400']
  const podiumBg = [
    'bg-yellow-500/20 border-yellow-500/30',
    'bg-gray-500/20 border-gray-500/30',
    'bg-amber-500/20 border-amber-500/30',
    'bg-ice-800/20 border-ice-700/30',
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="bg-ice-900/70 rounded-2xl border-2 border-ice-500/20 p-6 max-w-md w-full backdrop-blur">
        <h2 className="text-3xl font-black text-center text-white mb-1">Race Complete!</h2>

        {playerResult && (
          <div className="text-center mb-4">
            <div className={`text-5xl font-black ${podiumColors[playerResult.placement - 1]}`}>
              {playerResult.placement === 1
                ? '1st'
                : playerResult.placement === 2
                  ? '2nd'
                  : playerResult.placement === 3
                    ? '3rd'
                    : '4th'}
            </div>
            {playerResult.placement === 1 && (
              <div className="text-yellow-300 text-lg">Champion!</div>
            )}
          </div>
        )}

        {/* Results table */}
        <div className="space-y-2 mb-6">
          {sortedResults.map((result) => (
            <div
              key={result.racerName}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                podiumBg[result.placement - 1]
              } ${result.isPlayer ? 'ring-2 ring-ice-400' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${podiumColors[result.placement - 1]}`}>
                  {result.placement}
                </span>
                <span className={`font-medium ${result.isPlayer ? 'text-white' : 'text-ice-300'}`}>
                  {result.racerName}
                  {result.isPlayer && (
                    <span className="text-xs text-ice-400 ml-1">(You)</span>
                  )}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-ice-300">{result.finishTime.toFixed(1)}s</div>
                {result.isPlayer && result.sponsorDollars > 0 && (
                  <div className="text-xs text-yellow-300">+${result.sponsorDollars}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Earnings */}
        {playerResult && (
          <div className="text-center mb-4">
            <div className="text-ice-300 text-sm">Earned</div>
            <CoinDisplay amount={playerResult.sponsorDollars} size="lg" />
            {playerResult.stars > 0 && (
              <div className="text-yellow-300 text-lg mt-1">
                {'★'.repeat(playerResult.stars)}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setScreen('level-select')}>
            Levels
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              useGameStore.getState().resetRace()
              setScreen('racing')
            }}
          >
            Race Again
          </Button>
        </div>
      </div>
    </div>
  )
}
