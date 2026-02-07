import { useGameStore } from './stores/useGameStore'
import { MainMenu } from './components/ui/MainMenu'
import { PlayerSetup } from './components/ui/PlayerSetup'
import { LevelSelect } from './components/ui/LevelSelect'
import { TrackSelect } from './components/ui/TrackSelect'
import { SledShop } from './components/ui/SledShop'
import { RaceScreen } from './components/ui/RaceScreen'
import { RaceResults } from './components/ui/RaceResults'
import { LevelUnlocked } from './components/ui/LevelUnlocked'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { Tutorial } from './components/ui/Tutorial'

export default function App() {
  const currentScreen = useGameStore((s) => s.currentScreen)

  const screens: Record<string, React.ReactNode> = {
    'main-menu': <MainMenu />,
    'player-setup': <PlayerSetup />,
    'level-select': <LevelSelect />,
    'track-select': <TrackSelect />,
    'sled-shop': <SledShop />,
    'racing': <RaceScreen />,
    'race-results': <RaceResults />,
    'level-unlocked': <LevelUnlocked />,
  }

  return (
    <ErrorBoundary>
      <div className="w-full h-full relative">
        {screens[currentScreen] ?? <MainMenu />}
        {currentScreen === 'main-menu' && <Tutorial />}
      </div>
    </ErrorBoundary>
  )
}
