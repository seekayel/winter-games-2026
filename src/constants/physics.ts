// Sprint phase
export const SPRINT_DURATION = 5 // seconds
export const SPRINT_MIN_SPEED = 0.4 // 40% guaranteed minimum
export const SPRINT_DECAY_RATE = 0.15 // speed decays if not tapping
export const SPRINT_TAP_BOOST = 0.08 // each correct alternating tap adds this

// Jump phase
export const JUMP_WINDOW_DURATION = 3 // seconds before auto-jump
export const JUMP_SWEET_SPOT_DURATION = 0.6 // seconds of green zone
export const JUMP_PERFECT_BONUS = 1.0 // 100% bonus for perfect
export const JUMP_GOOD_BONUS = 0.6 // 60% bonus for good
export const JUMP_MISS_BONUS = 0.2 // 20% bonus even for miss

// Driving phase
export const BASE_GRAVITY_SPEED = 15 // m/s base speed on flat
export const GRAVITY_SLOPE_FACTOR = 30 // speed gain per unit downslope
export const STEERING_SENSITIVITY = 2.0 // lateral offset change per second
export const WALL_CONTACT_THRESHOLD = 0.9 // |lateralOffset| > this = wall hit
export const WALL_SPEED_PENALTY = 0.7 // multiply speed by this on wall contact
export const WALL_BOUNCE_FACTOR = 0.3 // bounce back from wall
export const MAX_SPEED = 45 // m/s cap
export const MIN_SPEED = 5 // m/s minimum (never stop)
export const SPEED_SLED_FACTOR = 0.05 // per sled speed stat point
export const ACCEL_SLED_FACTOR = 0.05 // per sled accel stat point
export const HANDLING_SLED_FACTOR = 0.1 // per sled handling stat point
export const CURVE_DRIFT_FACTOR = 0.006 // lateral drift on curves (player must counter-steer)

// Race
export const COUNTDOWN_DURATION = 3 // 3-2-1-GO
export const TRACK_SAMPLE_COUNT = 500 // spline sample resolution

// Rewards
export const REWARDS = {
  1: { dollars: 50, stars: 3 },
  2: { dollars: 30, stars: 2 },
  3: { dollars: 15, stars: 1 },
  4: { dollars: 5, stars: 0 },
} as const

export const WINS_TO_UNLOCK = 2 // first-place finishes needed to unlock next level
