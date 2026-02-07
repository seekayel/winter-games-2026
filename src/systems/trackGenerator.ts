import { Vector3, CatmullRomCurve3, BufferGeometry, Float32BufferAttribute } from 'three'
import { TRACK_SAMPLE_COUNT } from '../constants/physics'
import type { TrackGeometryData } from '../types/track'

export function generateTrackData(controlPoints: Vector3[]): TrackGeometryData {
  const curve = new CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.5)
  const points = curve.getSpacedPoints(TRACK_SAMPLE_COUNT)
  const totalLength = curve.getLength()

  const tangents: Vector3[] = []
  const normals: Vector3[] = []
  const binormals: Vector3[] = []

  for (let i = 0; i < points.length; i++) {
    const t = i / (points.length - 1)
    const tangent = curve.getTangentAt(t).normalize()
    tangents.push(tangent)

    // Use world up as reference, then cross to get binormal
    const up = new Vector3(0, 1, 0)
    const binormal = new Vector3().crossVectors(tangent, up).normalize()

    // Handle degenerate case (tangent parallel to up)
    if (binormal.length() < 0.001) {
      binormal.set(1, 0, 0)
    }

    const normal = new Vector3().crossVectors(binormal, tangent).normalize()

    normals.push(normal)
    binormals.push(binormal)
  }

  return { trackPoints: points, tangents, normals, binormals, totalLength }
}

export function createTrackGeometry(
  trackData: TrackGeometryData,
  width: number,
): BufferGeometry {
  const { trackPoints, normals, binormals } = trackData
  const crossSectionRes = 12 // points across the U-shape
  const halfWidth = width / 2

  const vertices: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const normalAttrs: number[] = []

  // Generate cross-section at each track point
  for (let i = 0; i < trackPoints.length; i++) {
    const center = trackPoints[i]
    const normal = normals[i]
    const binormal = binormals[i]
    const v = i / (trackPoints.length - 1)

    for (let j = 0; j <= crossSectionRes; j++) {
      const t = j / crossSectionRes // 0 to 1 across width
      const x = (t - 0.5) * 2 // -1 to 1

      // Parabolic U-shape: y = k * x^2
      const k = 0.3
      const localX = x * halfWidth
      const localY = k * x * x * halfWidth

      // Position in world space
      const pos = new Vector3()
        .copy(center)
        .addScaledVector(binormal, localX)
        .addScaledVector(normal, localY)

      vertices.push(pos.x, pos.y, pos.z)
      uvs.push(t, v * 10)

      // Surface normal for the parabola
      const dydx = 2 * k * x
      const surfaceNormal = new Vector3()
        .copy(normal)
        .addScaledVector(binormal, -dydx)
        .normalize()
      normalAttrs.push(surfaceNormal.x, surfaceNormal.y, surfaceNormal.z)
    }
  }

  // Generate indices
  const vertsPerRow = crossSectionRes + 1
  for (let i = 0; i < trackPoints.length - 1; i++) {
    for (let j = 0; j < crossSectionRes; j++) {
      const a = i * vertsPerRow + j
      const b = a + 1
      const c = (i + 1) * vertsPerRow + j
      const d = c + 1

      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(normalAttrs, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)

  return geo
}

export function createWallGeometry(
  trackData: TrackGeometryData,
  width: number,
  side: 'left' | 'right',
  wallHeight: number = 0.5,
): BufferGeometry {
  const { trackPoints, normals, binormals } = trackData
  const halfWidth = width / 2
  const sign = side === 'left' ? -1 : 1
  const k = 0.3

  const vertices: number[] = []
  const wallNormals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i < trackPoints.length; i++) {
    const center = trackPoints[i]
    const normal = normals[i]
    const binormal = binormals[i]
    const v = i / (trackPoints.length - 1)

    const localX = sign * halfWidth
    const baseY = k * 1 * 1 * halfWidth // x=1 (edge) height

    // Bottom of wall
    const bottom = new Vector3()
      .copy(center)
      .addScaledVector(binormal, localX)
      .addScaledVector(normal, baseY)

    // Top of wall
    const top = new Vector3().copy(bottom).addScaledVector(normal, wallHeight)

    vertices.push(bottom.x, bottom.y, bottom.z)
    vertices.push(top.x, top.y, top.z)

    const wallNormal = new Vector3().copy(binormal).multiplyScalar(-sign)
    wallNormals.push(wallNormal.x, wallNormal.y, wallNormal.z)
    wallNormals.push(wallNormal.x, wallNormal.y, wallNormal.z)

    uvs.push(0, v * 10)
    uvs.push(1, v * 10)
  }

  for (let i = 0; i < trackPoints.length - 1; i++) {
    const a = i * 2
    const b = a + 1
    const c = (i + 1) * 2
    const d = c + 1

    if (side === 'left') {
      indices.push(a, b, c)
      indices.push(b, d, c)
    } else {
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(wallNormals, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)

  return geo
}

// Get position on track at a given progress (0-1) and lateral offset (-1 to 1)
export function getTrackPosition(
  trackData: TrackGeometryData,
  progress: number,
  lateralOffset: number,
  width: number,
): { position: Vector3; tangent: Vector3; normal: Vector3; binormal: Vector3 } {
  const clampedProgress = Math.max(0, Math.min(1, progress))
  const idx = clampedProgress * (trackData.trackPoints.length - 1)
  const i = Math.floor(idx)
  const frac = idx - i
  const next = Math.min(i + 1, trackData.trackPoints.length - 1)

  const center = new Vector3().lerpVectors(trackData.trackPoints[i], trackData.trackPoints[next], frac)
  const tangent = new Vector3().lerpVectors(trackData.tangents[i], trackData.tangents[next], frac).normalize()
  const normal = new Vector3().lerpVectors(trackData.normals[i], trackData.normals[next], frac).normalize()
  const binormal = new Vector3().lerpVectors(trackData.binormals[i], trackData.binormals[next], frac).normalize()

  const halfWidth = width / 2
  const x = lateralOffset
  const k = 0.3
  const localX = x * halfWidth
  const localY = k * x * x * halfWidth

  const position = new Vector3()
    .copy(center)
    .addScaledVector(binormal, localX)
    .addScaledVector(normal, localY)

  // Raise sled a bit above track surface
  position.addScaledVector(normal, 0.15)

  return { position, tangent, normal, binormal }
}

// Get slope at a given progress point (positive = downhill)
export function getTrackSlope(trackData: TrackGeometryData, progress: number): number {
  const clampedProgress = Math.max(0, Math.min(1, progress))
  const idx = clampedProgress * (trackData.trackPoints.length - 1)
  const i = Math.floor(idx)
  const next = Math.min(i + 1, trackData.trackPoints.length - 1)

  const tangent = new Vector3().lerpVectors(trackData.tangents[i], trackData.tangents[next], 0.5)
  // Slope is how much tangent points downward
  return -tangent.y
}
