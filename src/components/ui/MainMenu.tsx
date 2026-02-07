import { useGameStore } from '../../stores/useGameStore'
import { Button } from './common/Button'
import { CoinDisplay } from './common/CoinDisplay'

export function MainMenu() {
  const { playerName, sponsorDollars, setScreen } = useGameStore()

  const hasName = playerName.trim().length > 0

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      {/* Snowflake decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 animate-pulse"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              fontSize: `${12 + (i % 3) * 8}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          >
            *
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="relative mb-8">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-ice-200 to-ice-400 drop-shadow-lg tracking-tight">
          BOBSLED
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-ice-300 -mt-1 tracking-widest">
          RACING 2026
        </h2>
        <div className="mt-2 text-ice-400/70 text-sm tracking-wider uppercase">
          Winter Games Edition
        </div>
      </div>

      {/* Player greeting */}
      {hasName && (
        <div className="mb-6 text-ice-200">
          <span className="text-ice-400">Welcome back,</span>{' '}
          <span className="font-bold text-white">{playerName}</span>!
          <div className="mt-1">
            <CoinDisplay amount={sponsorDollars} />
          </div>
        </div>
      )}

      {/* Menu buttons */}
      <div className="flex flex-col gap-3 w-64">
        {hasName ? (
          <>
            <Button variant="gold" size="lg" onClick={() => setScreen('level-select')}>
              Race!
            </Button>
            <Button variant="primary" onClick={() => setScreen('sled-shop')}>
              Sled Shop
            </Button>
            <Button variant="secondary" onClick={() => setScreen('player-setup')}>
              Change Name
            </Button>
          </>
        ) : (
          <Button variant="gold" size="lg" onClick={() => setScreen('player-setup')}>
            Start Racing!
          </Button>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-ice-600 text-xs">
        Use Arrow Keys to steer, Space to jump
      </div>
    </div>
  )
}
