import { useGameStore } from '../../stores/useGameStore'

export function RaceHUD() {
  const currentSpeed = useGameStore((s) => s.currentSpeed)
  const playerPosition = useGameStore((s) => s.playerPosition)
  const raceElapsedTime = useGameStore((s) => s.raceElapsedTime)
  const playerProgress = useGameStore((s) => s.playerProgress)
  const racePhase = useGameStore((s) => s.racePhase)

  const positionLabel = ['1st', '2nd', '3rd', '4th'][playerPosition - 1] ?? `${playerPosition}th`
  const positionColors = [
    'text-yellow-300',
    'text-gray-300',
    'text-amber-500',
    'text-ice-400',
  ]

  return (
    <div className="absolute inset-x-0 top-0 p-4 pointer-events-none">
      <div className="flex items-start justify-between max-w-2xl mx-auto">
        {/* Position */}
        <div className="bg-black/40 backdrop-blur rounded-xl px-4 py-2">
          <div className="text-xs text-ice-300 uppercase tracking-wider">Position</div>
          <div className={`text-3xl font-black ${positionColors[playerPosition - 1]}`}>
            {positionLabel}
          </div>
        </div>

        {/* Timer */}
        <div className="bg-black/40 backdrop-blur rounded-xl px-4 py-2 text-center">
          <div className="text-xs text-ice-300 uppercase tracking-wider">Time</div>
          <div className="text-2xl font-mono font-bold text-white">
            {raceElapsedTime.toFixed(1)}s
          </div>
        </div>

        {/* Speed */}
        <div className="bg-black/40 backdrop-blur rounded-xl px-4 py-2 text-right">
          <div className="text-xs text-ice-300 uppercase tracking-wider">Speed</div>
          <div className="text-2xl font-bold text-white">
            {Math.round(currentSpeed * 3.6)}
            <span className="text-sm text-ice-400 ml-1">km/h</span>
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="fixed bottom-4 left-4 right-4 pointer-events-none">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ice-400 to-ice-300 rounded-full transition-all duration-100"
              style={{ width: `${Math.min(100, playerProgress * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-ice-400 mt-1">
            <span>Start</span>
            {racePhase === 'finished' && (
              <span className="text-yellow-300 font-bold">FINISHED!</span>
            )}
            <span>Finish</span>
          </div>
        </div>
      </div>
    </div>
  )
}
