import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  contextName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

/**
 * Generic error boundary for context-related errors
 * Provides detailed information about which context failed and why
 */
class ContextErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Limit error logging to prevent console spam
    if (this.state.retryCount < 3) {
      console.error(`ContextErrorBoundary${this.props.contextName ? ` (${this.props.contextName})` : ''}:`, {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      });

      // Check for common context errors
      if (error.message.includes('useContext') && error.message.includes('null')) {
        console.warn('🚨 useContext null error detected. Component is likely rendered outside its provider.');
        console.info('Check that:', {
          '1. Component is wrapped in required providers': '✓',
          '2. Providers are in correct order': '✓',
          '3. No conditional provider rendering': '✓',
          'ContextName': this.props.contextName || 'Unknown',
        });
      }
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private handleRetry = () => {
    const { retryCount } = this.state;

    // Prevent infinite retry loops
    if (retryCount >= 3) {
      console.warn('Max retry attempts reached for ContextErrorBoundary');
      return;
    }

    // Exponential backoff for retries
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);

    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }, delay);
  };

  render() {
    const { hasError, error, retryCount } = this.state;

    if (hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI for context errors
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Component Error
            </h2>
            <p className="text-gray-600 text-center mb-4">
              A component failed to render properly. This might be due to a missing context provider.
            </p>

            {import.meta.env.DEV && (
              <details className="bg-red-50 rounded p-3 mb-4">
                <summary className="text-sm font-medium text-red-700 cursor-pointer">
                  Error Details (Development)
                </summary>
                <div className="text-xs text-red-600 mt-2 font-mono">
                  <p className="mb-2">
                    <strong>Error:</strong> {error?.message}
                  </p>
                  {this.props.contextName && (
                    <p className="mb-2">
                      <strong>Context:</strong> {this.props.contextName}
                    </p>
                  )}
                  <p className="mb-2">
                    <strong>Retry Count:</strong> {retryCount}/3
                  </p>
                </div>
              </details>
            )}

            <div className="space-y-2">
              <button
                onClick={this.handleRetry}
                disabled={retryCount >= 3}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {retryCount >= 3 ? 'Max Retries Reached' : `Try Again (${retryCount + 1}/3)`}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ContextErrorBoundary;