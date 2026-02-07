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
      leftWall: createWallGeometry(trackData, width, 'left'),
      rightWall: createWallGeometry(trackData, width, 'right'),
    }
  }, [trackId])

  return (
    <>
      <mesh geometry={leftWall}>
        <meshStandardMaterial
          color="#a0d0ff"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.05}
          side={DoubleSide}
        />
      </mesh>
      <mesh geometry={rightWall}>
        <meshStandardMaterial
          color="#a0d0ff"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.05}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
}
