import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import type { AIRacerState } from '../../../types/game'
import { getTrackPoints } from '../../../data/trackPaths'
import { generateTrackData, getTrackPosition } from '../../../systems/trackGenerator'
import { LEVELS } from '../../../constants/levels'
import { SledModel } from './SledModel'

interface AISledProps {
  racer: AIRacerState
  trackId: string
}

export function AISled({ racer, trackId }: AISledProps) {
  const groupRef = useRef<Group>(null)

  const trackData = useMemo(() => {
    const points = getTrackPoints(trackId)
    return generateTrackData(points)
  }, [trackId])

  const width = useMemo(() => {
    const level = LEVELS.find((l) => l.trackIds.includes(trackId))
    return level?.trackWidth ?? 3.0
  }, [trackId])

  const smoothPos = useRef(new Vector3())

  useFrame(() => {
    if (!groupRef.current) return

    const { position, tangent } = getTrackPosition(
      trackData,
      racer.progress,
      racer.lateralOffset,
      width,
    )

    smoothPos.current.lerp(position, 0.12)
    groupRef.current.position.copy(smoothPos.current)

    const lookTarget = new Vector3().copy(position).add(tangent)
    groupRef.current.lookAt(lookTarget)
  })

  return (
    <group ref={groupRef}>
      <SledModel color={racer.color} accentColor={racer.color} scale={0.95} />
    </group>
  )
}
