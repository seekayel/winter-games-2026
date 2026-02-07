import { useState } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import { Button } from './common/Button'

export function PlayerSetup() {
  const { playerName, setPlayerName, setScreen } = useGameStore()
  const [name, setName] = useState(playerName)

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (trimmed.length > 0) {
      setPlayerName(trimmed)
      setScreen('level-select')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="bg-ice-900/50 rounded-2xl border-2 border-ice-500/20 p-8 max-w-sm w-full backdrop-blur">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">What's Your Name?</h2>
        <p className="text-ice-300 text-sm mb-6 text-center">
          Every champion needs a name!
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter your name..."
          autoFocus
          className="w-full px-4 py-3 rounded-xl bg-ice-950/50 border-2 border-ice-500/30 text-white text-lg text-center placeholder-ice-600 focus:outline-none focus:border-ice-400 transition-colors"
        />

        <div className="mt-4 text-center text-ice-500 text-xs">
          {name.length}/20 characters
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setScreen('main-menu')}
          >
            Back
          </Button>
          <Button
            variant="gold"
            className="flex-1"
            onClick={handleSubmit}
            disabled={name.trim().length === 0}
          >
            Let's Go!
          </Button>
        </div>
      </div>
    </div>
  )
}
