import { useEffect, useState } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import { COUNTDOWN_DURATION } from '../../constants/physics'
import { playCountdownBeep } from '../../systems/audio'

export function Countdown() {
  const { setRacePhase, setRaceStartTime } = useGameStore()
  const [count, setCount] = useState(COUNTDOWN_DURATION)

  useEffect(() => {
    if (count <= 0) {
      playCountdownBeep(true)
      setRaceStartTime(Date.now())
      setRacePhase('sprint')
      return
    }

    playCountdownBeep(false)
    const timer = setTimeout(() => setCount(count - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, setRacePhase, setRaceStartTime])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        {count > 0 ? (
          <div
            key={count}
            className="text-9xl font-black text-white drop-shadow-2xl animate-bounce"
          >
            {count}
          </div>
        ) : (
          <div className="text-7xl font-black text-green-300 drop-shadow-2xl">GO!</div>
        )}
      </div>
    </div>
  )
}
