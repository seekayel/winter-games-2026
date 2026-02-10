import { useMemo } from 'react'

interface SprintHUDProps {
  sprintSpeed: number // 0-1
  sprintProgress: number // 0-0.08
  lastKey: string | null
  timeRemaining: number // seconds
}

function getZone(progress: number): { label: string; color: string; glow: string; idx: number } {
  if (progress >= 0.065) return { label: 'PERFECT', color: '#ff2d78', glow: '#ff2d78', idx: 3 }
  if (progress >= 0.045) return { label: 'GREAT', color: '#ffe13a', glow: '#ffe13a', idx: 2 }
  if (progress >= 0.025) return { label: 'GOOD', color: '#3affb0', glow: '#3affb0', idx: 1 }
  return { label: 'OK', color: '#7ad0ff', glow: '#7ad0ff', idx: 0 }
}

const ZONE_COLORS = [
  { label: 'OK', from: '#4a90d9', to: '#7ad0ff' },
  { label: 'GOOD', from: '#00c97b', to: '#3affb0' },
  { label: 'GREAT', from: '#e5c200', to: '#ffe13a' },
  { label: 'PERFECT', from: '#e0005c', to: '#ff2d78' },
]

export function SprintHUD({ sprintSpeed, sprintProgress, lastKey, timeRemaining }: SprintHUDProps) {
  const zone = useMemo(() => getZone(sprintProgress), [sprintProgress])
  const pct = Math.round(sprintSpeed * 100)
  const progressNorm = Math.min(sprintProgress / 0.08, 1) // normalize to 0-1

  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ fontFamily: "'Baloo 2', 'Segoe UI', sans-serif" }}>
      {/* ── Top: SPRINT! Title ── */}
      <div className="absolute top-6 inset-x-0 flex flex-col items-center gap-1">
        <div
          className="relative text-5xl font-black tracking-wider"
          style={{
            color: '#fff',
            textShadow: `0 0 20px ${zone.glow}, 0 0 40px ${zone.glow}66, 0 2px 0 #003355, 0 4px 8px rgba(0,0,0,0.4)`,
            letterSpacing: '0.15em',
          }}
        >
          SPRINT!
        </div>
        <div
          className="text-sm font-bold tracking-wide"
          style={{
            color: 'rgba(200, 230, 255, 0.85)',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          TAP{' '}
          <span style={{ color: '#ffe13a' }}>&larr;</span>
          {' '}AND{' '}
          <span style={{ color: '#ffe13a' }}>&rarr;</span>
          {' '}ALTERNATELY!
        </div>
      </div>

      {/* ── Bottom Panel: Frosted glass container ── */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center px-4">
        <div
          className="relative w-full max-w-lg rounded-3xl overflow-hidden px-6 py-5"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 40, 80, 0.65) 0%, rgba(0, 60, 110, 0.55) 100%)',
            backdropFilter: 'blur(16px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
            border: '2px solid rgba(120, 200, 255, 0.25)',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.12),
              0 8px 32px rgba(0,0,0,0.35),
              0 0 60px ${zone.glow}18
            `,
          }}
        >
          {/* Frost edge highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(180,220,255,0.3), transparent)' }}
          />

          {/* ── Timer ── */}
          <div className="flex justify-between items-center mb-3">
            <div
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'rgba(160, 210, 255, 0.7)' }}
            >
              Time
            </div>
            <div
              className="text-lg font-black tabular-nums"
              style={{
                color: timeRemaining <= 1.5 ? '#ff5c8a' : '#fff',
                textShadow: timeRemaining <= 1.5 ? '0 0 12px #ff2d78' : '0 0 8px rgba(120,200,255,0.3)',
                transition: 'color 0.2s, text-shadow 0.2s',
              }}
            >
              {timeRemaining.toFixed(1)}s
            </div>
          </div>

          {/* ── Power Meter ── */}
          <div className="relative mb-4">
            <div className="flex justify-between items-end mb-1.5">
              <div
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(160, 210, 255, 0.7)' }}
              >
                Power
              </div>
              <div
                className="text-2xl font-black tabular-nums"
                style={{
                  color: '#fff',
                  textShadow: `0 0 12px ${zone.glow}88`,
                }}
              >
                {pct}%
              </div>
            </div>

            {/* Bar track */}
            <div
              className="relative h-7 rounded-full overflow-hidden"
              style={{
                background: 'rgba(0, 20, 40, 0.5)',
                border: '1px solid rgba(100, 180, 255, 0.15)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {/* Filled portion */}
              <div
                className="absolute top-0 left-0 bottom-0 rounded-full"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${ZONE_COLORS[zone.idx].from}, ${ZONE_COLORS[zone.idx].to})`,
                  boxShadow: `0 0 16px ${zone.glow}66, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  transition: 'width 0.06s linear, background 0.3s ease',
                }}
              />

              {/* Shine overlay */}
              <div
                className="absolute top-0 left-0 right-0 h-1/2 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                }}
              />

              {/* Tick marks */}
              {[25, 50, 75].map((tick) => (
                <div
                  key={tick}
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${tick}%`,
                    background: 'rgba(150, 200, 255, 0.15)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Zone Tracker ── */}
          <div className="mb-4">
            <div
              className="text-xs font-bold uppercase tracking-widest mb-1.5"
              style={{ color: 'rgba(160, 210, 255, 0.7)' }}
            >
              Distance Zone
            </div>

            <div className="relative">
              {/* Zone bar */}
              <div
                className="relative h-5 rounded-full overflow-hidden flex"
                style={{
                  background: 'rgba(0, 20, 40, 0.5)',
                  border: '1px solid rgba(100, 180, 255, 0.15)',
                }}
              >
                {ZONE_COLORS.map((z, i) => {
                  const segWidth = i === 0 ? 31.25 : i === 1 ? 25 : i === 2 ? 25 : 18.75
                  return (
                    <div
                      key={z.label}
                      className="relative h-full flex items-center justify-center text-xs font-black"
                      style={{
                        width: `${segWidth}%`,
                        background: zone.idx >= i
                          ? `linear-gradient(90deg, ${z.from}88, ${z.to}88)`
                          : `linear-gradient(90deg, ${z.from}22, ${z.to}22)`,
                        color: zone.idx >= i ? '#fff' : 'rgba(150,200,255,0.3)',
                        textShadow: zone.idx >= i ? `0 0 6px ${z.to}` : 'none',
                        transition: 'background 0.3s ease, color 0.3s ease',
                        borderRight: i < 3 ? '1px solid rgba(100,180,255,0.1)' : 'none',
                      }}
                    >
                      {z.label}
                    </div>
                  )
                })}

                {/* Progress marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5"
                  style={{
                    left: `${progressNorm * 100}%`,
                    background: '#fff',
                    boxShadow: '0 0 8px #fff, 0 0 16px rgba(255,255,255,0.5)',
                    transition: 'left 0.06s linear',
                  }}
                />
              </div>

              {/* Active zone label */}
              <div className="flex justify-center mt-1.5">
                <span
                  className="text-sm font-black tracking-wider"
                  style={{
                    color: zone.color,
                    textShadow: `0 0 10px ${zone.glow}88`,
                  }}
                >
                  {zone.label}
                </span>
              </div>
            </div>
          </div>

          {/* ── Arrow Keys ── */}
          <div className="flex justify-center gap-5">
            <ArrowKey direction="left" active={lastKey === 'ArrowLeft'} glowColor={zone.glow} />
            <ArrowKey direction="right" active={lastKey === 'ArrowRight'} glowColor={zone.glow} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ArrowKey({ direction, active, glowColor }: { direction: 'left' | 'right'; active: boolean; glowColor: string }) {
  const arrow = direction === 'left' ? '\u2190' : '\u2192'

  return (
    <div
      className="relative flex items-center justify-center rounded-2xl text-2xl font-black"
      style={{
        width: 64,
        height: 52,
        background: active
          ? `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)`
          : 'rgba(0, 25, 50, 0.4)',
        border: active
          ? `2px solid ${glowColor}aa`
          : '2px solid rgba(100, 180, 255, 0.15)',
        boxShadow: active
          ? `0 0 20px ${glowColor}44, inset 0 0 12px ${glowColor}22, 0 4px 12px rgba(0,0,0,0.3)`
          : 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
        color: active ? '#fff' : 'rgba(150, 200, 255, 0.5)',
        textShadow: active ? `0 0 12px ${glowColor}` : 'none',
        transform: active ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
        transition: 'all 0.06s ease-out',
      }}
    >
      {arrow}
      {/* Key cap shine */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
