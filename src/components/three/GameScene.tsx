import { Canvas } from '@react-three/fiber'
import { useGameStore } from '../../stores/useGameStore'
import { SprintScene } from './sprint/SprintScene'
import { TrackEnvironment } from './track/TrackEnvironment'
import { TrackMesh } from './track/TrackMesh'
import { TrackWalls } from './track/TrackWalls'
import { TrackDecorations } from './track/TrackDecorations'
import { FinishLine } from './track/FinishLine'
import { PlayerSled } from './sled/PlayerSled'
import { AISled } from './sled/AISled'
import { SprintCamera } from './camera/SprintCamera'
import { DrivingCamera } from './camera/DrivingCamera'
import { IceParticles } from './effects/IceParticles'
import { SpeedLines } from './effects/SpeedLines'
import { RaceManager } from '../../systems/RaceManager'

export function GameScene() {
  const racePhase = useGameStore((s) => s.racePhase)
  const selectedTrackId = useGameStore((s) => s.selectedTrackId)
  const aiRacers = useGameStore((s) => s.aiRacers)

  const isSprintOrJump = racePhase === 'countdown' || racePhase === 'sprint' || racePhase === 'jump'
  const isDriving = racePhase === 'driving' || racePhase === 'finished'

  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 1000 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true }}
    >
      <TrackEnvironment />
      <RaceManager />

      {isSprintOrJump && (
        <>
          <SprintScene />
          <SprintCamera />
        </>
      )}

      {isDriving && selectedTrackId && (
        <>
          <TrackMesh trackId={selectedTrackId} />
          <TrackWalls trackId={selectedTrackId} />
          <TrackDecorations trackId={selectedTrackId} />
          <FinishLine trackId={selectedTrackId} />
          <PlayerSled trackId={selectedTrackId} />
          {aiRacers.map((racer) => (
            <AISled key={racer.id} racer={racer} trackId={selectedTrackId} />
          ))}
          <DrivingCamera trackId={selectedTrackId} />
          <IceParticles />
          <SpeedLines />
        </>
      )}
    </Canvas>
  )
}
