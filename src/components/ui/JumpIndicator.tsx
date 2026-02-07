import { useEffect, useRef, useState, useCallback } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import { playJumpWhoosh } from '../../systems/audio'
import {
  JUMP_WINDOW_DURATION,
  JUMP_SWEET_SPOT_DURATION,
  JUMP_PERFECT_BONUS,
  JUMP_GOOD_BONUS,
  JUMP_MISS_BONUS,
} from '../../constants/physics'

export function JumpIndicator() {
  const { setJumpTimingScore, setRacePhase } = useGameStore()
  const [indicatorPos, setIndicatorPos] = useState(0) // 0 to 1
  const [jumped, setJumped] = useState(false)
  const startTimeRef = useRef(Date.now())
  const animRef = useRef<number>(0)

  // Sweet spot is centered at 0.5, width is JUMP_SWEET_SPOT_DURATION / JUMP_WINDOW_DURATION
  const sweetSpotWidth = JUMP_SWEET_SPOT_DURATION / JUMP_WINDOW_DURATION
  const sweetSpotStart = 0.5 - sweetSpotWidth / 2
  const sweetSpotEnd = 0.5 + sweetSpotWidth / 2

  const doJump = useCallback(
    (pos: number) => {
      if (jumped) return
      setJumped(true)

      let score: number
      let label: string
      if (pos >= sweetSpotStart && pos <= sweetSpotEnd) {
        // How close to center
        const distFromCenter = Math.abs(pos - 0.5) / (sweetSpotWidth / 2)
        if (distFromCenter < 0.3) {
          score = JUMP_PERFECT_BONUS
          label = 'PERFECT!'
        } else {
          score = JUMP_GOOD_BONUS
          label = 'GOOD!'
        }
      } else {
        score = JUMP_MISS_BONUS
        label = 'OK'
      }

      setJumpTimingScore(score)
      playJumpWhoosh()

      // Show result briefly then move to driving
      setTimeout(() => {
        setRacePhase('driving')
      }, 800)

      // Store label for display
      setResultLabel(label)
    },
    [jumped, sweetSpotStart, sweetSpotEnd, sweetSpotWidth, setJumpTimingScore, setRacePhase],
  )

  const [resultLabel, setResultLabel] = useState<string | null>(null)

  // Animate indicator
  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const pos = elapsed / JUMP_WINDOW_DURATION

      if (pos >= 1) {
        doJump(pos)
        return
      }

      setIndicatorPos(pos)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [doJump])

  // Space key to jump
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        doJump(indicatorPos)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [indicatorPos, doJump])

  return (
    <div className="absolute inset-x-0 bottom-0 p-8 pointer-events-none">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          {resultLabel ? (
            <div
              className={`text-4xl font-black ${
                resultLabel === 'PERFECT!'
                  ? 'text-green-300'
                  : resultLabel === 'GOOD!'
                    ? 'text-yellow-300'
                    : 'text-ice-300'
              }`}
            >
              {resultLabel}
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-white mb-1">JUMP!</div>
              <div className="text-ice-300 text-sm">
                Press <span className="font-bold text-white">SPACE</span> in the green zone!
              </div>
            </>
          )}
        </div>

        {/* Timing bar */}
        <div className="relative h-10 bg-black/40 rounded-full overflow-hidden backdrop-blur">
          {/* Sweet spot zone */}
          <div
            className="absolute top-0 bottom-0 bg-green-500/30 border-x-2 border-green-400"
            style={{
              left: `${sweetSpotStart * 100}%`,
              width: `${sweetSpotWidth * 100}%`,
            }}
          />

          {/* Indicator */}
          {!jumped && (
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-lg shadow-white/50"
              style={{ left: `${indicatorPos * 100}%` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
