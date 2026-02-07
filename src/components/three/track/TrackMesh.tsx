import { useMemo } from 'react'
import { getTrackPoints } from '../../../data/trackPaths'
import { generateTrackData, createTrackGeometry } from '../../../systems/trackGenerator'
import { LEVELS } from '../../../constants/levels'

interface TrackMeshProps {
  trackId: string
}

export function TrackMesh({ trackId }: TrackMeshProps) {
  const geometry = useMemo(() => {
    const points = getTrackPoints(trackId)
    const level = LEVELS.find((l) => l.trackIds.includes(trackId))
    const width = level?.trackWidth ?? 3.0
    const trackData = generateTrackData(points)
    return createTrackGeometry(trackData, width)
  }, [trackId])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color="#c8e0f0"
        metalness={0.3}
        roughness={0.1}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}
