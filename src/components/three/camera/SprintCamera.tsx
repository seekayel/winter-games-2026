import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export function SprintCamera() {
  const { camera } = useThree()

  useEffect(() => {
    // Side view for sprint phase
    camera.position.set(8, 3, 2)
    camera.lookAt(0, 1, 0)
  }, [camera])

  return null
}
