import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { Button } from './common/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center h-full px-4 text-center">
          <div className="bg-ice-900/70 rounded-2xl border-2 border-red-500/30 p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Oops!</h2>
            <p className="text-ice-300 mb-4">
              Something went wrong with the game. Don't worry, your progress is saved!
            </p>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
            >
              Restart Game
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
