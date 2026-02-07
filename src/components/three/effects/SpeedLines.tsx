import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial } from 'three'
import { useGameStore } from '../../../stores/useGameStore'

export function SpeedLines() {
  const linesRef = useRef<LineSegments>(null)
  const currentSpeed = useGameStore((s) => s.currentSpeed)

  const { geometry, material } = useMemo(() => {
    const count = 40
    const positions = new Float32Array(count * 6) // 2 points per line, 3 coords each

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 6
      const y = Math.random() * 3
      const z = (Math.random() - 0.5) * 10

      // Line start
      positions[i * 6] = x
      positions[i * 6 + 1] = y
      positions[i * 6 + 2] = z

      // Line end (slightly behind)
      positions[i * 6 + 3] = x
      positions[i * 6 + 4] = y
      positions[i * 6 + 5] = z + 0.5
    }

    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))

    const mat = new LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0,
    })

    return { geometry: geo, material: mat }
  }, [])

  useFrame(() => {
    const speedFactor = Math.max(0, (currentSpeed - 15) / 30)
    material.opacity = speedFactor * 0.3
  })

  return <lineSegments ref={linesRef} geometry={geometry} material={material} />
}
