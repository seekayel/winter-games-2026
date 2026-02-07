import { useRef } from 'react'
import { Group } from 'three'

interface SledModelProps {
  color: string
  accentColor: string
  scale?: number
}

// Procedural sled built from Three.js primitives
export function SledModel({ color, accentColor, scale = 1 }: SledModelProps) {
  const groupRef = useRef<Group>(null)

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main body - elongated capsule shape */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.2, 1.4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Nose - rounded front */}
      <mesh position={[0, 0.18, -0.7]} castShadow>
        <sphereGeometry args={[0.25, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.3, -0.1]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.6]} />
        <meshStandardMaterial color={accentColor} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.38, -0.4]}>
        <boxGeometry args={[0.35, 0.1, 0.02]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Runners (blades) */}
      <mesh position={[-0.2, 0.02, 0]} castShadow>
        <boxGeometry args={[0.03, 0.04, 1.5]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.2, 0.02, 0]} castShadow>
        <boxGeometry args={[0.03, 0.04, 1.5]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Stripe decoration */}
      <mesh position={[0, 0.26, 0.2]}>
        <boxGeometry args={[0.52, 0.02, 0.3]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}
