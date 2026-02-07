import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGameStore } from '../../../stores/useGameStore'
import { getTrackPoints } from '../../../data/trackPaths'
import { generateTrackData, getTrackPosition } from '../../../systems/trackGenerator'
import { LEVELS } from '../../../constants/levels'

interface DrivingCameraProps {
  trackId: string
}

export function DrivingCamera({ trackId }: DrivingCameraProps) {
  const { camera } = useThree()

  const trackData = useMemo(() => {
    const points = getTrackPoints(trackId)
    return generateTrackData(points)
  }, [trackId])

  const width = useMemo(() => {
    const level = LEVELS.find((l) => l.trackIds.includes(trackId))
    return level?.trackWidth ?? 3.0
  }, [trackId])

  const smoothCamPos = useRef(new Vector3())
  const smoothLookAt = useRef(new Vector3())

  useFrame(() => {
    const progress = useGameStore.getState().playerProgress
    const lateralOffset = useGameStore.getState().playerLateralOffset

    const { position: sledPos, tangent, normal } = getTrackPosition(
      trackData,
      progress,
      lateralOffset,
      width,
    )

    // Chase camera: behind and above the sled
    const camTarget = new Vector3()
      .copy(sledPos)
      .addScaledVector(tangent, -4) // behind
      .addScaledVector(normal, 2.5) // above

    // Look-at point: ahead of the sled
    const lookTarget = new Vector3()
      .copy(sledPos)
      .addScaledVector(tangent, 8)
      .addScaledVector(normal, 0.5)

    // Smooth follow
    smoothCamPos.current.lerp(camTarget, 0.08)
    smoothLookAt.current.lerp(lookTarget, 0.1)

    camera.position.copy(smoothCamPos.current)
    camera.lookAt(smoothLookAt.current)
  })

  return null
}
