import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={styles.wrapper}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre style={styles.errorDetail}>
                {this.state.error.toString()}
              </pre>
            )}
            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={() => window.location.reload()}>
                Refresh Page
              </button>
              <button style={styles.btnSecondary} onClick={this.handleReset}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: '1rem',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1.25rem',
    padding: '2.5rem 2rem',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
  },
  icon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
  },
  title: {
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
  },
  message: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  errorDetail: {
    background: 'rgba(255,80,80,0.1)',
    border: '1px solid rgba(255,80,80,0.3)',
    borderRadius: '0.5rem',
    color: '#ff8080',
    fontSize: '0.75rem',
    padding: '0.75rem',
    textAlign: 'left',
    overflowX: 'auto',
    marginBottom: '1.5rem',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: '#fff',
    border: 'none',
    borderRadius: '0.625rem',
    padding: '0.6rem 1.4rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '0.625rem',
    padding: '0.6rem 1.4rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
};

export default ErrorBoundary;
