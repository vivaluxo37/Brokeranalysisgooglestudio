import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary specifically for authentication-related errors
 * Provides graceful degradation when authentication services fail
 */
class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Log the error for debugging
    console.error('Authentication Error Boundary caught an error:', error);

    // Check if it's a Clerk-related error
    const isClerkError = error.message.includes('clerk') ||
                        error.message.includes('ChunkLoadError') ||
                        error.message.includes('publishableKey');

    if (isClerkError) {
      console.warn('🔐 Clerk authentication failed, using fallback mode');
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log detailed error information
    console.error('AuthErrorBoundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // In development, you might want to report this to an error tracking service
    if (import.meta.env.DEV) {
      console.warn('🚨 Authentication error in development mode');
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Authentication Unavailable
            </h2>
            <p className="text-gray-600 text-center mb-4">
              We're having trouble with the authentication service. You can continue using the site without signing in.
            </p>
            <div className="space-y-2">
              <details className="bg-gray-50 rounded p-3">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Technical Details
                </summary>
                <p className="text-xs text-gray-500 mt-2">
                  {this.state.error?.message}
                </p>
              </details>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;