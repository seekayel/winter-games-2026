import { useMemo } from 'react'
import { Vector3 } from 'three'
import { getTrackPoints } from '../../../data/trackPaths'
import { generateTrackData } from '../../../systems/trackGenerator'

interface TrackDecorationsProps {
  trackId: string
}

export function TrackDecorations({ trackId }: TrackDecorationsProps) {
  const decorations = useMemo(() => {
    const points = getTrackPoints(trackId)
    const trackData = generateTrackData(points)
    const trees: { pos: [number, number, number]; scale: number; variant: number }[] = []
    const flags: { pos: [number, number, number]; rotation: number }[] = []

    // Seed random for consistent placement
    let seed = trackId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    const treeInterval = 20
    for (let i = 0; i < trackData.trackPoints.length; i += treeInterval) {
      const center = trackData.trackPoints[i]
      const binormal = trackData.binormals[i]

      // Trees on both sides
      for (const side of [-1, 1]) {
        if (rand() > 0.7) continue // skip some for variety
        const offset = 4 + rand() * 8
        const pos = new Vector3()
          .copy(center)
          .addScaledVector(binormal, side * offset)
        pos.y -= 1
        trees.push({
          pos: [pos.x, pos.y, pos.z],
          scale: 0.6 + rand() * 0.8,
          variant: Math.floor(rand() * 3),
        })
      }

      // Occasional flag/banner
      if (i % 60 === 0 && rand() > 0.4) {
        const tangent = trackData.tangents[i]
        const flagPos = new Vector3()
          .copy(center)
          .addScaledVector(binormal, (rand() > 0.5 ? 1 : -1) * 3)
        flagPos.y += 0.5
        flags.push({
          pos: [flagPos.x, flagPos.y, flagPos.z],
          rotation: Math.atan2(tangent.x, tangent.z),
        })
      }
    }

    return { trees, flags }
  }, [trackId])

  return (
    <group>
      {decorations.trees.map((tree, i) => (
        <CartoonTree key={`t${i}`} position={tree.pos} scale={tree.scale} variant={tree.variant} />
      ))}
      {decorations.flags.map((flag, i) => (
        <RaceFlag key={`f${i}`} position={flag.pos} rotation={flag.rotation} />
      ))}
    </group>
  )
}

const TREE_COLORS = [
  ['#228B22', '#2E8B57', '#3CB371'],
  ['#1a7a1a', '#258f3c', '#30a050'],
  ['#2d6b2d', '#3a8f4a', '#48b058'],
]

function CartoonTree({
  position,
  scale,
  variant,
}: {
  position: [number, number, number]
  scale: number
  variant: number
}) {
  const colors = TREE_COLORS[variant % TREE_COLORS.length]

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 6]} />
        <meshToonMaterial color="#8B5A2B" />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.9, 1.4, 7]} />
        <meshToonMaterial color={colors[0]} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.65, 1.1, 7]} />
        <meshToonMaterial color={colors[1]} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <coneGeometry args={[0.4, 0.7, 7]} />
        <meshToonMaterial color={colors[2]} />
      </mesh>
      {/* Snow on top */}
      <mesh position={[0, 3.0, 0]}>
        <coneGeometry args={[0.3, 0.25, 7]} />
        <meshToonMaterial color="#eef4ff" />
      </mesh>
    </group>
  )
}

const FLAG_COLORS = ['#ff3344', '#ffcc00', '#3388ff', '#ff8800', '#44dd55']

function RaceFlag({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: number
}) {
  const color = FLAG_COLORS[Math.floor(Math.abs(position[0] * 100)) % FLAG_COLORS.length]

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Pole */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 6]} />
        <meshToonMaterial color="#dddddd" />
      </mesh>
      {/* Flag */}
      <mesh position={[0.3, 2.2, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshToonMaterial color={color} side={2} />
      </mesh>
    </group>
  )
}
