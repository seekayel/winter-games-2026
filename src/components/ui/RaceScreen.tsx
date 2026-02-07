import { useGameStore } from '../../stores/useGameStore'
import { GameScene } from '../three/GameScene'
import { RaceHUD } from './RaceHUD'
import { SprintMeter } from './SprintMeter'
import { JumpIndicator } from './JumpIndicator'
import { Countdown } from './Countdown'

export function RaceScreen() {
  const racePhase = useGameStore((s) => s.racePhase)

  return (
    <div className="w-full h-full relative">
      <GameScene />

      {/* Overlay UI based on race phase */}
      {racePhase === 'countdown' && <Countdown />}
      {racePhase === 'sprint' && <SprintMeter />}
      {racePhase === 'jump' && <JumpIndicator />}
      {(racePhase === 'driving' || racePhase === 'finished') && <RaceHUD />}
    </div>
  )
}
