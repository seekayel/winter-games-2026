import { useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import {
  SPRINT_DURATION,
  SPRINT_MIN_SPEED,
  SPRINT_DECAY_RATE,
  SPRINT_TAP_BOOST,
} from '../../constants/physics'
import { playSprintTap } from '../../systems/audio'

export function SprintMeter() {
  const { sprintSpeed, setSprintSpeed, setRacePhase } = useGameStore()
  const lastKeyRef = useRef<string | null>(null)
  const startTimeRef = useRef(Date.now())
  const animFrameRef = useRef<number>(0)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        if (e.key !== lastKeyRef.current) {
          lastKeyRef.current = e.key
          setSprintSpeed(Math.min(1, sprintSpeed + SPRINT_TAP_BOOST))
          playSprintTap()
        }
      }
    },
    [sprintSpeed, setSprintSpeed],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Decay + timer
  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      if (elapsed >= SPRINT_DURATION) {
        const finalSpeed = Math.max(SPRINT_MIN_SPEED, useGameStore.getState().sprintSpeed)
        setSprintSpeed(finalSpeed)
        setRacePhase('jump')
        return
      }
      const current = useGameStore.getState().sprintSpeed
      setSprintSpeed(Math.max(0, current - SPRINT_DECAY_RATE * (1 / 60)))
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [setSprintSpeed, setRacePhase])

  const displaySpeed = Math.max(sprintSpeed, 0)
  const pct = displaySpeed * 100

  const barColor =
    pct > 80 ? 'from-green-400 to-green-300' : pct > 50 ? 'from-yellow-400 to-yellow-300' : 'from-red-400 to-orange-400'

  return (
    <div className="absolute inset-x-0 bottom-0 p-8 pointer-events-none">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white mb-1">SPRINT!</div>
          <div className="text-ice-300 text-sm">
            Tap <span className="font-bold text-white">LEFT</span> and{' '}
            <span className="font-bold text-white">RIGHT</span> arrow keys!
          </div>
        </div>

        {/* Speed meter */}
        <div className="relative h-8 bg-black/40 rounded-full overflow-hidden backdrop-blur">
          <div
            className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-75`}
            style={{ width: `${pct}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow">
            {Math.round(pct)}%
          </div>
        </div>

        {/* Arrow indicators */}
        <div className="flex justify-center gap-8 mt-4">
          <div
            className={`text-4xl transition-transform duration-75 ${
              lastKeyRef.current === 'ArrowLeft' ? 'scale-125 text-white' : 'text-ice-500'
            }`}
          >
            ←
          </div>
          <div
            className={`text-4xl transition-transform duration-75 ${
              lastKeyRef.current === 'ArrowRight' ? 'scale-125 text-white' : 'text-ice-500'
            }`}
          >
            →
          </div>
        </div>
      </div>
    </div>
  )
}
