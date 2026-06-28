import { Component } from 'react';

/**
 * ErrorBoundary — Catches unhandled React rendering errors and displays
 * a recovery UI instead of a blank white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          fontFamily: 'var(--font-mono, monospace)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '500px', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: '3px solid currentColor',
              borderRadius: '8px',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
