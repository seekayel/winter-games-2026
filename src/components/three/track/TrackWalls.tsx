import { useMemo } from 'react'
import { DoubleSide } from 'three'
import { getTrackPoints } from '../../../data/trackPaths'
import { generateTrackData, createWallGeometry } from '../../../systems/trackGenerator'
import { LEVELS } from '../../../constants/levels'

interface TrackWallsProps {
  trackId: string
}

export function TrackWalls({ trackId }: TrackWallsProps) {
  const { leftWall, rightWall } = useMemo(() => {
    const points = getTrackPoints(trackId)
    const level = LEVELS.find((l) => l.trackIds.includes(trackId))
    const width = level?.trackWidth ?? 3.0
    const trackData = generateTrackData(points)

    return {
      leftWall: createWallGeometry(trackData, width, 'left', 0.8),
      rightWall: createWallGeometry(trackData, width, 'right', 0.8),
    }
  }, [trackId])

  return (
    <>
      <mesh geometry={leftWall}>
        <meshToonMaterial
          color="#ff4466"
          transparent
          opacity={0.75}
          side={DoubleSide}
        />
      </mesh>
      <mesh geometry={rightWall}>
        <meshToonMaterial
          color="#4488ff"
          transparent
          opacity={0.75}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
}
