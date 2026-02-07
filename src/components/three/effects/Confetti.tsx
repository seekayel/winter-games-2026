import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three'

export function Confetti() {
  const pointsRef = useRef<Points>(null)

  const { geometry, material } = useMemo(() => {
    const count = 300
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 10 + 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))

    const mat = new PointsMaterial({
      size: 0.1,
      color: '#ffdd44',
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    })

    return { geometry: geo, material: mat }
  }, [])

  useFrame((_, delta) => {
    const posAttr = geometry.getAttribute('position')
    const positions = posAttr.array as Float32Array

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += (Math.random() - 0.5) * delta * 2
      positions[i * 3 + 1] -= delta * 3
      positions[i * 3 + 2] += (Math.random() - 0.5) * delta * 2

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 10 + Math.random() * 5
      }
    }
    posAttr.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
