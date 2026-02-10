import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { useGameStore } from '../../../stores/useGameStore'

// Sprint scene: side-view of runners pushing a sled - cartoon style
export function SprintScene() {
  const groupRef = useRef<Group>(null)
  const sprintSpeed = useGameStore((s) => s.sprintSpeed)
  const racePhase = useGameStore((s) => s.racePhase)

  // Animate runners based on sprint speed
  useFrame(() => {
    if (!groupRef.current) return
    if (racePhase === 'sprint') {
      const bob = Math.sin(Date.now() * 0.015 * (1 + sprintSpeed * 3)) * 0.05
      groupRef.current.position.y = bob
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Starting block - cartoon style */}
      <mesh position={[0, 0.12, 2]}>
        <boxGeometry args={[1.8, 0.25, 0.5]} />
        <meshToonMaterial color="#ff6644" />
      </mesh>

      {/* Ice track floor - bright cartoon ice */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 12]} />
        <meshToonMaterial color="#88ccff" />
      </mesh>

      {/* Track edge stripes */}
      <mesh position={[-2.3, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 12]} />
        <meshToonMaterial color="#ff4466" />
      </mesh>
      <mesh position={[2.3, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 12]} />
        <meshToonMaterial color="#4488ff" />
      </mesh>

      {/* Cartoon sled body */}
      <group position={[0, 0.25, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.25, 0.8, 8, 12]} />
          <meshToonMaterial color="#4488cc" />
        </mesh>
        {/* Runners */}
        <mesh position={[-0.2, -0.12, 0]}>
          <capsuleGeometry args={[0.03, 1.1, 4, 8]} />
          <meshToonMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[0.2, -0.12, 0]}>
          <capsuleGeometry args={[0.03, 1.1, 4, 8]} />
          <meshToonMaterial color="#e0e0e0" />
        </mesh>
      </group>

      {/* Cartoon runner figures */}
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
    const phase = Date.now() * 0.01 * (1 + speed * 3) + offset
    groupRef.current.rotation.x = -0.2 - speed * 0.3
    groupRef.current.rotation.z = Math.sin(phase) * 0.05
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Head - bigger for cartoon */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshToonMaterial color="#ffcc88" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 1.56, 0]}>
        <sphereGeometry args={[0.15, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshToonMaterial color="#2266cc" />
      </mesh>
      {/* Body - rounder */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.1, 0.3, 6, 8]} />
        <meshToonMaterial color="#2266cc" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.06, 0.6, 0]}>
        <capsuleGeometry args={[0.05, 0.35, 4, 6]} />
        <meshToonMaterial color="#224488" />
      </mesh>
      <mesh position={[0.06, 0.6, 0]}>
        <capsuleGeometry args={[0.05, 0.35, 4, 6]} />
        <meshToonMaterial color="#224488" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.15, 1.15, 0]} rotation={[0.5, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.25, 4, 6]} />
        <meshToonMaterial color="#2266cc" />
      </mesh>
      <mesh position={[0.15, 1.15, 0]} rotation={[-0.5, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.25, 4, 6]} />
        <meshToonMaterial color="#2266cc" />
      </mesh>
    </group>
  )
}
