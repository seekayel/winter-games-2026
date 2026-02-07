import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { useGameStore } from '../../../stores/useGameStore'

// Sprint scene: side-view of runners pushing a sled
export function SprintScene() {
  const groupRef = useRef<Group>(null)
  const sprintSpeed = useGameStore((s) => s.sprintSpeed)
  const racePhase = useGameStore((s) => s.racePhase)

  // Animate runners based on sprint speed
  useFrame(() => {
    if (!groupRef.current) return
    if (racePhase === 'sprint') {
      // Bob animation based on speed
      const bob = Math.sin(Date.now() * 0.015 * (1 + sprintSpeed * 3)) * 0.05
      groupRef.current.position.y = bob
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Starting block */}
      <mesh position={[0, 0.1, 2]}>
        <boxGeometry args={[1.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Ice track floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 10]} />
        <meshStandardMaterial color="#d0e8f8" metalness={0.3} roughness={0.1} />
      </mesh>

      {/* Sled body */}
      <group position={[0, 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.2, 1.2]} />
          <meshStandardMaterial color="#4488cc" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Runners */}
        <mesh position={[-0.2, -0.12, 0]}>
          <boxGeometry args={[0.03, 0.04, 1.3]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.2, -0.12, 0]}>
          <boxGeometry args={[0.03, 0.04, 1.3]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Runner figures (simplified stick figures) */}
      <RunnerFigure position={[-0.3, 0, 0.8]} speed={sprintSpeed} offset={0} />
      <RunnerFigure position={[0.3, 0, 0.8]} speed={sprintSpeed} offset={Math.PI} />
    </group>
  )
}

function RunnerFigure({
  position,
  speed,
  offset,
}: {
  position: [number, number, number]
  speed: number
  offset: number
}) {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    // Running bob + lean forward
    const phase = Date.now() * 0.01 * (1 + speed * 3) + offset
    groupRef.current.rotation.x = -0.2 - speed * 0.3
    groupRef.current.rotation.z = Math.sin(phase) * 0.05
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffcc99" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.15]} />
        <meshStandardMaterial color="#2266aa" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.06, 0.6, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.06, 0.6, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.15, 1.15, 0]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.06, 0.35, 0.06]} />
        <meshStandardMaterial color="#2266aa" />
      </mesh>
      <mesh position={[0.15, 1.15, 0]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.06, 0.35, 0.06]} />
        <meshStandardMaterial color="#2266aa" />
      </mesh>
    </group>
  )
}
