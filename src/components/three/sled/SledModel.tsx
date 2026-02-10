import { useRef } from 'react'
import { Group } from 'three'

interface SledModelProps {
  color: string
  accentColor: string
  scale?: number
}

// Mario Kart style cartoon bobsled
export function SledModel({ color, accentColor, scale = 1 }: SledModelProps) {
  const groupRef = useRef<Group>(null)

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main body - rounded capsule shape */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.9, 8, 16]} />
        <meshToonMaterial color={color} />
      </mesh>

      {/* Nose - big rounded front */}
      <mesh position={[0, 0.25, -0.75]} castShadow>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshToonMaterial color={color} />
      </mesh>

      {/* Cockpit - recessed area */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.38, 0.12, 0.55]} />
        <meshToonMaterial color={accentColor} />
      </mesh>

      {/* Windshield - big cartoon dome */}
      <mesh position={[0, 0.42, -0.35]}>
        <sphereGeometry args={[0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshToonMaterial color="#66ddff" />
      </mesh>

      {/* Chunky runners (blades) - thicker for cartoon look */}
      <mesh position={[-0.22, 0.04, 0]} castShadow>
        <capsuleGeometry args={[0.04, 1.3, 4, 8]} />
        <meshToonMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[0.22, 0.04, 0]} castShadow>
        <capsuleGeometry args={[0.04, 1.3, 4, 8]} />
        <meshToonMaterial color="#e0e0e0" />
      </mesh>

      {/* Racing stripe */}
      <mesh position={[0, 0.35, 0.15]}>
        <boxGeometry args={[0.55, 0.02, 0.35]} />
        <meshToonMaterial color={accentColor} />
      </mesh>

      {/* Tail fin - sporty cartoon touch */}
      <mesh position={[0, 0.35, 0.55]} castShadow>
        <boxGeometry args={[0.08, 0.18, 0.15]} />
        <meshToonMaterial color={accentColor} />
      </mesh>

      {/* Cartoon driver head */}
      <mesh position={[0, 0.55, 0.05]}>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshToonMaterial color="#ffcc88" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 0.6, 0.02]}>
        <sphereGeometry args={[0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0.56, -0.1]}>
        <boxGeometry args={[0.18, 0.06, 0.04]} />
        <meshToonMaterial color="#333333" />
      </mesh>

      {/* Number circle on side */}
      <mesh position={[0.29, 0.22, -0.1]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.29, 0.22, -0.1]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}
