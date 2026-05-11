import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-sans, sans-serif)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#FEF2F2', padding: '2rem', borderRadius: '12px', border: '1px solid #FECACA', maxWidth: '500px', width: '100%' }}>
            <svg style={{ margin: '0 auto 1rem' }} width="48" height="48" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 style={{ color: '#991B1B', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Something went wrong.</h2>
            <p style={{ color: '#B91C1C', fontSize: '0.875rem', marginBottom: '1.5rem' }}>We apologize for the inconvenience. An unexpected error has occurred.</p>
            <button 
              onClick={() => window.location.href = '/'} 
              style={{ padding: '0.5rem 1.5rem', background: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
            >
              Return Home
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: '1.5rem', textAlign: 'left', background: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '0.75rem', color: '#333', overflowX: 'auto', border: '1px solid #E5E7EB' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#DC2626', marginBottom: '0.5rem' }}>Error Details</summary>
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
