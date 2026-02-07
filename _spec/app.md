# Winter Games 2026 - Bobsled Racing Game

## Context

Build a kid-friendly (ages 5-10) bobsled racing game from scratch in an empty repo. Players race down ice tracks named after Winter Olympics host cities, compete against AI racers across 5 difficulty levels, earn Sponsor Dollars, and buy better sleds. The game is fully static (no server), hosted on GitHub Pages, with all progress stored in localStorage.

---

## Tech Stack

- **Runtime/Package Manager**: Bun
- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **3D Rendering**: React Three Fiber + Three.js + @react-three/drei
- **State Management**: Zustand (with `persist` middleware for localStorage)
- **Deployment**: GitHub Actions → GitHub Pages

---

## Game Design Summary

### Three Racing Phases
1. **Sprint Start** - Tap left/right arrow keys alternately to build speed. Visual: side-view of runners pushing the sled. Speed meter fills up. Minimum 40% speed guaranteed (kids never get stuck).
2. **Jump Into Sled** - Timing mini-game: press Space when indicator is in the green zone. Generous sweet spot (0.6s window). Auto-jump after 3s. Even a miss gives 20% bonus.
3. **Driving** - POV/chase camera behind the sled. Steer with arrow keys. Spline-follower physics (not full rigid body) for predictable, kid-friendly controls. Wall hits slow you down but never crash you out.

### 5 Difficulty Levels (3 tracks each = 15 total)
| Level | Name | Tracks | Track Width | AI Skill |
|-------|------|--------|-------------|----------|
| 1 | Rookie | Lake Placid, Calgary, Vancouver | 3.0m (wide) | 0.70-0.80 |
| 2 | Amateur | Nagano, Salt Lake City, Turin | 2.5m | 0.80-0.85 |
| 3 | Pro | Oslo, Innsbruck, Lillehammer | 2.0m | 0.85-0.90 |
| 4 | Champion | Chamonix, St. Moritz, Cortina d'Ampezzo | 1.8m | 0.90-0.95 |
| 5 | Legend | Beijing, Sochi, PyeongChang | 1.5m (narrow) | 0.95-0.99 |

### Progression & Economy
- 4 racers per race (player + 3 AI). AI uses rubber-banding to keep races exciting.
- 1st place = 50 Sponsor Dollars + 3 stars, 2nd = 30 SD + 2 stars, 3rd = 15 SD + 1 star, 4th = 5 SD
- Unlock next level by winning 1st place on 2 of 3 tracks in current level
- 6 sleds available: Starter (free) → Legend ($1,500), with meaningful stat differences

### Driving Physics: Spline-Follower Model
Instead of full rigid-body physics (which causes clipping/flying off track), the sled follows a CatmullRom spline with:
- `progress` (0→1 along track), `lateralOffset` (-1→+1 across width), `speed` (from gravity + slope)
- Steering adjusts lateral offset; wall contact at |offset| > 0.9 applies speed penalty
- Guarantees sled always stays on track and always finishes

---

## Project Structure

```
winter-games-2026/
├── .github/workflows/deploy.yml
├── public/
├── src/
│   ├── main.tsx, App.tsx, index.css
│   ├── types/          # game.ts, track.ts, sled.ts
│   ├── constants/      # tracks.ts, sleds.ts, levels.ts, physics.ts
│   ├── stores/
│   │   ├── useGameStore.ts          # Combined Zustand store
│   │   ├── slices/                  # raceSlice, progressSlice, settingsSlice
│   │   └── persistence.ts
│   ├── hooks/
│   │   ├── useKeyboard.ts           # Key state tracking
│   │   ├── useSprintMeter.ts        # Sprint tap-speed logic
│   │   ├── useJumpTiming.ts         # Jump timing window
│   │   └── useSledPhysics.ts        # Driving phase spline-follower
│   ├── components/
│   │   ├── ui/                      # Tailwind HTML layer
│   │   │   ├── MainMenu.tsx, LevelSelect.tsx, TrackSelect.tsx
│   │   │   ├── SledShop.tsx, PlayerSetup.tsx
│   │   │   ├── RaceHUD.tsx, SprintMeter.tsx, JumpIndicator.tsx
│   │   │   ├── Countdown.tsx, RaceResults.tsx, LevelUnlocked.tsx
│   │   │   └── common/  (Button, Modal, ProgressBar, CoinDisplay)
│   │   └── three/                   # React Three Fiber 3D layer
│   │       ├── GameScene.tsx         # Top-level Canvas + scene
│   │       ├── track/    (TrackMesh, TrackWalls, TrackEnvironment, FinishLine)
│   │       ├── sled/     (PlayerSled, AISled, SledModel)
│   │       ├── camera/   (SprintCamera, JumpCamera, DrivingCamera)
│   │       ├── effects/  (IceParticles, SpeedLines, Confetti)
│   │       └── sprint/   (SprintScene, RunnerModel, StartingBlock)
│   ├── systems/
│   │   ├── trackGenerator.ts        # CatmullRom → BufferGeometry
│   │   ├── aiRacer.ts               # AI path-following + rubber-banding
│   │   ├── raceManager.ts           # Race lifecycle
│   │   └── scoring.ts               # Placement, rewards
│   ├── data/
│   │   └── trackPaths/              # 15 track files (control points per city)
│   └── utils/          # math.ts, time.ts, storage.ts
├── index.html, package.json, vite.config.ts, tsconfig.json
```

---

## Implementation Phases

### Phase 1: Project Scaffolding & Main Menu
- `bun create vite . --template react-ts` (or temp dir + move)
- Install deps: `three @react-three/fiber @react-three/drei zustand tailwindcss @tailwindcss/vite @types/three`
- Configure `vite.config.ts` with `base: '/winter-games-2026/'`, React + Tailwind plugins
- Set up Tailwind v4: `@import "tailwindcss"` in index.css
- Create directory structure and type definitions
- Build Zustand store skeleton with persist middleware
- Build `App.tsx` as screen router (no React Router needed)
- Build MainMenu, PlayerSetup, Button components
- Use `/frontend-design` skill for game theme/visual design
- Create `.github/workflows/deploy.yml` for GitHub Pages
- **Verify**: `bun run dev` serves the menu; push deploys to Pages

### Phase 2: Navigation & Progression UI
- Define all constants: sled definitions, level metadata
- Implement progressSlice fully (localStorage persistence)
- Build LevelSelect (5 level cards, locked/unlocked states)
- Build TrackSelect (3 track cards per level)
- Build SledShop (buy/equip flow, stat bars)
- Wire full menu navigation flow
- **Verify**: Can navigate all menus, buy sleds, see lock states

### Phase 3: Track Generation & 3D Scene
- Implement `trackGenerator.ts`: CatmullRomCurve3 → U-shaped track BufferGeometry
- Create first track data: Lake Placid (gentle curves, wide)
- Build TrackMesh with ice material (high metalness, low roughness, white-blue)
- Build TrackWalls (semi-transparent glass-like barriers)
- Build TrackEnvironment (sky dome, directional light, snow ground)
- Build FinishLine
- Build GameScene (R3F Canvas wrapper)
- **Verify**: Selecting Lake Placid shows a rendered 3D ice track

### Phase 4: Sprint & Jump Phases
- Build SprintScene, RunnerModel, SledModel (all from Three.js primitives, no GLTF)
- Implement useKeyboard hook (tracks held keys via refs)
- Implement useSprintMeter (alternating tap detection, speed decay, threshold)
- Build SprintMeter UI (animated fill bar, color transitions)
- Build Countdown overlay (3-2-1-GO)
- Implement useJumpTiming (timing window, score calculation)
- Build JumpIndicator UI (sliding indicator, sweet spot zone)
- Build SprintCamera (side view) and JumpCamera (cinematic transition)
- **Verify**: Can start race, tap to sprint, time the jump, see scores

### Phase 5: Driving Phase
- Implement useSledPhysics (spline-follower: progress, lateralOffset, speed from slope)
- Build PlayerSled (visual sled positioned on track via spline)
- Build DrivingCamera (chase cam with smooth follow, banking on turns)
- Implement wall collision detection + speed penalty
- Build RaceHUD (speedometer, position, timer)
- Implement race finish detection
- Connect sprint speed + jump bonus → initial driving speed
- Create remaining Level 1 tracks: Calgary, Vancouver
- Add IceParticles and SpeedLines effects
- **Verify**: Complete race from sprint through finish on all Level 1 tracks

### Phase 6: AI Racers & Results
- Implement aiRacer.ts (path following, speed variation, rubber-banding)
- Build AISled component (distinct colors per racer)
- Implement position calculation (live 1st/2nd/3rd/4th tracking)
- Implement scoring.ts (placement, time, Sponsor Dollar rewards)
- Build RaceResults screen (podium, times, rewards animation)
- Wire rewards into progressSlice (dollars, completion, stars)
- Implement level unlock logic (2 of 3 first-place wins)
- Build LevelUnlocked celebration modal + Confetti effect
- AI names pool: fun kid-friendly names ("Frosty McSpeed", "Arctic Arrow", etc.)
- **Verify**: Full game loop works - race AI, finish, earn dollars, unlock Level 2

### Phase 7: All Tracks & Difficulty Tuning
- Create track data for all 12 remaining tracks (Levels 2-5)
- Progressively harder: tighter curves, narrower widths, more elevation change, spirals (Level 5)
- Tune AI difficulty scaling per level
- Tune sled stats to feel meaningfully different
- Balance economy (players can afford Glacier Elite by Level 5, Legend requires grinding)
- Vary track environments (different sky/lighting per city)
- **Verify**: Play through all 5 levels, difficulty feels progressive and fair

### Phase 8: Polish & Audio
- Add sound effects via Web Audio API (sprint taps, jump whoosh, ice ambient, wall hits, victory fanfare)
- Add tutorial tooltips for first race
- Performance optimization (geometry LOD, instancing)
- Error boundaries around 3D scene
- Meta tags, favicon, Open Graph image
- Cross-browser testing
- **Verify**: Full end-to-end playthrough, deployed to GitHub Pages

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Physics model | Spline-follower (not rigid body) | Predictable for kids; sled never clips/flies off track |
| 3D models | Procedural (Three.js primitives) | No asset pipeline, instant loading, no GLTF files |
| State management | Zustand with persist | Lightweight, no boilerplate, built-in localStorage |
| Routing | Screen state in Zustand (no React Router) | Single-page game, no URL navigation needed |
| Tailwind setup | v4 with @tailwindcss/vite | Zero-config, no tailwind.config.js needed |
| AI approach | Path-following + rubber-banding | Keeps races competitive without cheating |
| Camera | Chase cam with damped follow | Best feel for kids; smooth, never disorienting |

---

## Zustand Store Design

### Combined store: `useGameStore.ts`
Three slices merged with `persist` middleware (key: `winter-games-2026-save`):

**raceSlice** - Transient (NOT persisted):
- `currentScreen`, `racePhase`, `sprintSpeed`, `sprintTapCount`
- `jumpTimingScore`, `currentSpeed`, `steeringInput`, `playerProgress`, `playerPosition`
- `aiRacers[]`, `raceStartTime`, `raceElapsedTime`, `raceResults`
- `selectedLevel`, `selectedTrackId`, `selectedSledId`

**progressSlice** - Persisted:
- `playerName`, `sponsorDollars`
- `unlockedLevels[]` (starts with [1])
- `ownedSleds[]` (starts with ['starter'])
- `completedTracks{}` (trackId → { bestTime, bestPlacement, stars, timesPlayed })

**settingsSlice** - Persisted:
- `musicVolume`, `sfxVolume`, `showTutorial`

### localStorage Schema
Single key: `winter-games-2026-save`
```json
{ "_version": 1, "playerName": "", "sponsorDollars": 0,
  "unlockedLevels": [1], "ownedSleds": ["starter"],
  "selectedSledId": "starter", "completedTracks": {},
  "musicVolume": 0.7, "sfxVolume": 1.0, "showTutorial": true }
```

---

## Sled Definitions

| Sled | Price | Speed | Accel | Handling | Braking | Variant |
|------|-------|-------|-------|----------|---------|---------|
| The Rookie | Free | 3 | 3 | 5 | 3 | basic |
| Swift Runner | $100 | 5 | 4 | 5 | 4 | sport |
| Thunderbolt | $250 | 7 | 5 | 6 | 5 | sport |
| Avalanche | $500 | 8 | 7 | 7 | 6 | pro |
| Glacier Elite | $800 | 9 | 8 | 8 | 8 | elite |
| The Legend | $1,500 | 10 | 9 | 10 | 9 | legendary |

---

## Track Generation System

`trackGenerator.ts` converts an array of Vector3 control points into renderable geometry:
1. Create `CatmullRomCurve3` from control points
2. Sample 500 points along the curve
3. At each sample, compute Frenet frame (tangent, normal, binormal)
4. Generate U-shaped cross-section (parabolic: `y = k * x^2`) at each sample
5. Stitch into triangle-strip `BufferGeometry`
6. Generate wall geometries at edges
7. Apply ice material: `MeshStandardMaterial` with metalness 0.3, roughness 0.1, white-blue tint

---

## AI Racer System

3 AI competitors per race. Each AI:
- Follows pre-computed optimal racing line (slightly offset from center)
- Speed governed by same slope formula as player, multiplied by `skillLevel`
- Sinusoidal speed variation for "alive" feel
- Rubber-banding: slows down if too far ahead, catches up if too far behind
- Kid-friendly names from pool ("Frosty McSpeed", "Penguin Pete", "Blizzard Bob", etc.)

---

## GitHub Actions Deployment

`.github/workflows/deploy.yml`:
- Triggers on push to `main`
- Uses `oven-sh/setup-bun@v2`
- Runs `bun install --frozen-lockfile`, `bun run build`
- Deploys `dist/` via `actions/deploy-pages@v4`
- Requires GitHub Pages source set to "GitHub Actions" in repo settings

---

## Verification Plan

1. `bun run dev` launches at localhost with hot reload
2. `bun run build` produces static files in `dist/`
3. Push to `main` triggers deploy to GitHub Pages
4. Full game loop: Sprint → Jump → Drive → Finish → Results → earn dollars → buy sled → unlock next level
5. Persistence: refresh browser mid-progression, verify localStorage restores state
6. All 15 tracks playable across 5 difficulty levels
