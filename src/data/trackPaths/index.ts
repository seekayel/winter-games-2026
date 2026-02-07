import { Vector3 } from 'three'
import { LAKE_PLACID_POINTS } from './lake-placid'
import { CALGARY_POINTS } from './calgary'
import { VANCOUVER_POINTS } from './vancouver'
import { NAGANO_POINTS } from './nagano'
import { SALT_LAKE_CITY_POINTS } from './salt-lake-city'
import { TURIN_POINTS } from './turin'
import { OSLO_POINTS } from './oslo'
import { INNSBRUCK_POINTS } from './innsbruck'
import { LILLEHAMMER_POINTS } from './lillehammer'
import { CHAMONIX_POINTS } from './chamonix'
import { ST_MORITZ_POINTS } from './st-moritz'
import { CORTINA_POINTS } from './cortina'
import { BEIJING_POINTS } from './beijing'
import { SOCHI_POINTS } from './sochi'
import { PYEONGCHANG_POINTS } from './pyeongchang'

// Track control points indexed by track ID
const TRACK_POINTS: Record<string, Vector3[]> = {
  'lake-placid': LAKE_PLACID_POINTS,
  calgary: CALGARY_POINTS,
  vancouver: VANCOUVER_POINTS,
  nagano: NAGANO_POINTS,
  'salt-lake-city': SALT_LAKE_CITY_POINTS,
  turin: TURIN_POINTS,
  oslo: OSLO_POINTS,
  innsbruck: INNSBRUCK_POINTS,
  lillehammer: LILLEHAMMER_POINTS,
  chamonix: CHAMONIX_POINTS,
  'st-moritz': ST_MORITZ_POINTS,
  cortina: CORTINA_POINTS,
  beijing: BEIJING_POINTS,
  sochi: SOCHI_POINTS,
  pyeongchang: PYEONGCHANG_POINTS,
}

export function getTrackPoints(trackId: string): Vector3[] {
  return TRACK_POINTS[trackId] ?? TRACK_POINTS['lake-placid']
}
