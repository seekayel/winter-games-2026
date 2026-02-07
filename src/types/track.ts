import { Vector3 } from 'three'

export interface TrackData {
  id: string
  name: string
  city: string
  country: string
  level: number
  width: number
  controlPoints: Vector3[]
}

export interface TrackGeometryData {
  trackPoints: Vector3[]
  tangents: Vector3[]
  normals: Vector3[]
  binormals: Vector3[]
  totalLength: number
}
