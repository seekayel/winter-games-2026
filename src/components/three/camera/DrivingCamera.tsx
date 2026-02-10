import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, PerspectiveCamera } from 'three'
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
  const initialized = useRef(false)

  useFrame(() => {
    const progress = useGameStore.getState().playerProgress
    const lateralOffset = useGameStore.getState().playerLateralOffset
    const currentSpeed = useGameStore.getState().currentSpeed

    const { position: sledPos, tangent, normal } = getTrackPosition(
      trackData,
      progress,
      lateralOffset,
      width,
    )

    // Chase camera: behind and above the sled (Mario Kart style - closer and higher)
    const camTarget = new Vector3()
      .copy(sledPos)
      .addScaledVector(tangent, -3.5) // behind
      .addScaledVector(normal, 3.0) // above

    // Look-at point: slightly ahead of the sled
    const lookTarget = new Vector3()
      .copy(sledPos)
      .addScaledVector(tangent, 6)
      .addScaledVector(normal, 0.3)

    // Initialize camera position immediately on first frame (no lerp from origin)
    if (!initialized.current) {
      smoothCamPos.current.copy(camTarget)
      smoothLookAt.current.copy(lookTarget)
      initialized.current = true
    }

    // Responsive smooth follow - faster lerp for tighter tracking
    const posAlpha = 0.12
    const lookAlpha = 0.15
    smoothCamPos.current.lerp(camTarget, posAlpha)
    smoothLookAt.current.lerp(lookTarget, lookAlpha)

    // Ensure camera is always above the sled
    const minHeight = sledPos.y + 1.5
    if (smoothCamPos.current.y < minHeight) {
      smoothCamPos.current.y = minHeight
    }

    camera.position.copy(smoothCamPos.current)
    camera.lookAt(smoothLookAt.current)

    // Dynamic FOV for speed sensation
    if (camera instanceof PerspectiveCamera) {
      const speedFactor = Math.max(0, (currentSpeed - 15) / 30)
      camera.fov = 60 + speedFactor * 15
      camera.updateProjectionMatrix()
    }
  })

  return null
}
