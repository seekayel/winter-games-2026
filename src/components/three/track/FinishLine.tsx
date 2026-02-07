import { useMemo } from 'react'
import { getTrackPoints } from '../../../data/trackPaths'
import { generateTrackData, getTrackPosition } from '../../../systems/trackGenerator'
import { LEVELS } from '../../../constants/levels'

interface FinishLineProps {
  trackId: string
}

export function FinishLine({ trackId }: FinishLineProps) {
  const { position, rotation } = useMemo(() => {
    const points = getTrackPoints(trackId)
    const level = LEVELS.find((l) => l.trackIds.includes(trackId))
    const width = level?.trackWidth ?? 3.0
    const trackData = generateTrackData(points)

    // Place at 95% of track (just before end)
    const { position, tangent } = getTrackPosition(trackData, 0.95, 0, width)

    const angle = Math.atan2(tangent.x, tangent.z)

    return {
      position: [position.x, position.y + 0.5, position.z] as [number, number, number],
      rotation: [0, angle, 0] as [number, number, number],
    }
  }, [trackId])

  return (
    <group position={position} rotation={rotation}>
      {/* Checkered banner */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[6, 0.8, 0.1]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Checkered pattern using small cubes */}
      {Array.from({ length: 12 }).map((_, i) =>
        Array.from({ length: 2 }).map((_, j) => (
          <mesh
            key={`${i}-${j}`}
            position={[
              -2.75 + i * 0.5,
              0.8 + j * 0.4,
              0.06,
            ]}
          >
            <boxGeometry args={[0.25, 0.2, 0.02]} />
            <meshStandardMaterial
              color={(i + j) % 2 === 0 ? '#ffffff' : '#000000'}
            />
          </mesh>
        )),
      )}

      {/* Poles */}
      <mesh position={[-3, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.5]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>
      <mesh position={[3, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.5]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>
    </group>
  )
}
