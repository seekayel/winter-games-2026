import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three'
import { useGameStore } from '../../../stores/useGameStore'

export function IceParticles() {
  const pointsRef = useRef<Points>(null)
  const currentSpeed = useGameStore((s) => s.currentSpeed)

  const { geometry, material } = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = Math.random() * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      velocities[i * 3] = (Math.random() - 0.5) * 0.5
      velocities[i * 3 + 1] = Math.random() * 0.3
      velocities[i * 3 + 2] = Math.random() * 2
    }

    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geo.userData.velocities = velocities

    const mat = new PointsMaterial({
      size: 0.03,
      color: '#ffffff',
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    return { geometry: geo, material: mat }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const posAttr = geometry.getAttribute('position')
    const positions = posAttr.array as Float32Array
    const velocities = geometry.userData.velocities as Float32Array
    const speedFactor = Math.min(1, currentSpeed / 20)

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += velocities[i * 3] * delta * speedFactor
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * speedFactor
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * speedFactor * 3

      // Reset particles that drift too far
      if (positions[i * 3 + 2] > 4) {
        positions[i * 3] = (Math.random() - 0.5) * 4
        positions[i * 3 + 1] = Math.random() * 1
        positions[i * 3 + 2] = -4
      }
    }
    posAttr.needsUpdate = true
    material.opacity = 0.3 + speedFactor * 0.4
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
