import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px 5%', textAlign: 'center' }}>
          <h2>Algo salió mal</h2>
          <p>Recarga la página o contáctanos por WhatsApp.</p>
          <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
