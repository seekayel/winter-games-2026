import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export function JumpCamera() {
  const { camera } = useThree()

  useEffect(() => {
    // Slightly angled view for jump
    camera.position.set(5, 4, 5)
    camera.lookAt(0, 1, 0)
  }, [camera])

  return null
}
