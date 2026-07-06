import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'
import './AppErrorBoundary.css'

type State = { error?: Error }

export default class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = {}

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Voyanta UI error:', error, info)
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children

    return (
      <main className="app-error-page">
        <section className="panel center">
          <p className="eyebrow">Something went wrong</p>
          <h1>We could not display this page.</h1>
          <p>Please refresh the page. Your account and saved vacations are still safe.</p>
          <button onClick={() => window.location.reload()}>Refresh Voyanta</button>
        </section>
      </main>
    )
  }
}
