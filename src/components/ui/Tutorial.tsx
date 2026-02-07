import { useState } from 'react'
import { useGameStore } from '../../stores/useGameStore'
import { Button } from './common/Button'

export function Tutorial() {
  const { showTutorial, setShowTutorial } = useGameStore()
  const [step, setStep] = useState(0)

  if (!showTutorial) return null

  const steps = [
    {
      title: 'Welcome to Bobsled Racing!',
      text: 'Race your bobsled down icy Olympic tracks and become a champion!',
    },
    {
      title: 'Sprint Start',
      text: 'Tap the LEFT and RIGHT arrow keys as fast as you can to build speed!',
    },
    {
      title: 'Jump Into the Sled',
      text: 'Press SPACE when the marker is in the green zone for a speed boost!',
    },
    {
      title: 'Steer Down the Track',
      text: 'Use LEFT and RIGHT arrows to steer. Avoid the walls - they slow you down!',
    },
    {
      title: 'Win Races, Earn Dollars',
      text: 'Finish in 1st place to earn Sponsor Dollars and unlock new levels and sleds!',
    },
  ]

  const currentStep = steps[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-gradient-to-b from-ice-800 to-ice-950 rounded-2xl border-2 border-ice-400/30 shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="text-xs text-ice-400 mb-1">
          {step + 1} of {steps.length}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
        <p className="text-ice-300 mb-6">{currentStep.text}</p>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => {
              setShowTutorial(false)
            }}
          >
            Skip
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1)
              } else {
                setShowTutorial(false)
              }
            }}
          >
            {step < steps.length - 1 ? 'Next' : 'Got it!'}
          </Button>
        </div>
      </div>
    </div>
  )
}
