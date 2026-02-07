import { useGameStore } from '../../stores/useGameStore'
import { getLevel } from '../../constants/levels'
import { TRACK_METADATA } from '../../constants/tracks'
import { Button } from './common/Button'
import { CoinDisplay } from './common/CoinDisplay'

export function TrackSelect() {
  const {
    selectedLevel,
    completedTracks,
    sponsorDollars,
    setSelectedTrackId,
    setScreen,
    resetRace,
  } = useGameStore()

  const levelDef = getLevel(selectedLevel)

  const handleSelectTrack = (trackId: string) => {
    resetRace()
    setSelectedTrackId(trackId)
    setScreen('racing')
  }

  return (
    <div className="flex flex-col items-center h-full px-4 py-8 overflow-y-auto">
      <div className="flex items-center justify-between w-full max-w-lg mb-6">
        <Button variant="secondary" size="sm" onClick={() => setScreen('level-select')}>
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Level {selectedLevel}: {levelDef.name}
          </h2>
          <p className="text-xs text-ice-400">Track width: {levelDef.trackWidth}m</p>
        </div>
        <CoinDisplay amount={sponsorDollars} size="sm" />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-lg">
        {levelDef.trackIds.map((trackId) => {
          const meta = TRACK_METADATA[trackId]
          const completion = completedTracks[trackId]

          return (
            <button
              key={trackId}
              onClick={() => handleSelectTrack(trackId)}
              className="p-5 rounded-xl bg-ice-800/50 border-2 border-ice-500/20 hover:border-ice-400/50 hover:bg-ice-700/50 text-left transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{meta?.city ?? trackId}</h3>
                  <p className="text-sm text-ice-400">{meta?.country ?? ''}</p>
                </div>
                <div className="text-right">
                  {completion ? (
                    <>
                      <div className="text-yellow-300">
                        {'★'.repeat(completion.stars)}
                        {'☆'.repeat(3 - completion.stars)}
                      </div>
                      <div className="text-xs text-ice-400 mt-1">
                        Best: {completion.bestTime.toFixed(1)}s
                      </div>
                      <div className="text-xs text-ice-400">
                        Place: {completion.bestPlacement}
                        {['st', 'nd', 'rd', 'th'][Math.min(completion.bestPlacement - 1, 3)]}
                      </div>
                    </>
                  ) : (
                    <span className="text-ice-500 text-sm">Not raced</span>
                  )}
                </div>
              </div>

              {meta?.description && (
                <p className="text-xs text-ice-300/70 mt-2">{meta.description}</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
