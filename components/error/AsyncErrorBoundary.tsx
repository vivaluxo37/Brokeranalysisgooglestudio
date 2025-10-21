/**
 * Async Error Boundary
 * Specialized error boundary for async operations and data fetching
 */

import React, { Component, ReactNode } from 'react'

import ErrorBoundary from './ErrorBoundary'

interface AsyncErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, context: string) => void;
  context?: string;
  maxRetries?: number;
}

class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  private readonly retryTimeouts: NodeJS.Timeout[] = []

  constructor(props: AsyncErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<AsyncErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { context, onError } = this.props

    console.error(`Async Error Boundary${context ? ` (${context})` : ''}:`, error)
    console.error('Component Stack:', errorInfo.componentStack)

    if (onError) {
      onError(error, context || 'Unknown')
    }

    // Send to monitoring with async context
    this.sendAsyncError(error, errorInfo, context)
  }

  componentWillUnmount() {
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout))
  }

  private sendAsyncError(error: Error, errorInfo: React.ErrorInfo, context?: string): void {
    try {
      const errorData = {
        type: 'async',
        context: context || 'Unknown',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        retryCount: this.state.retryCount,
      }

      console.warn('Async error data:', errorData)
    } catch (monitoringError) {
      console.error('Failed to send async error:', monitoringError)
    }
  }

  private readonly handleRetry = (): void => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        retryCount: prevState.retryCount + 1,
      }))

      const timeout = setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
        })
      }, 1000 * 2 ** retryCount) // Exponential backoff

      this.retryTimeouts.push(timeout)
    }
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallback, context } = this.props

    if (hasError && error) {
      if (fallback) {
        return <>{fallback}</>
      }

      // Default async error UI
      return (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            {/* Loading/Error Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                {context ? `${context} Error` : 'Async Operation Failed'}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {error.message || 'An asynchronous operation failed to complete.'}
              </p>

              {this.state.retryCount < (this.props.maxRetries || 3) && (
                <button
                  onClick={this.handleRetry}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Retry {this.state.retryCount > 0 && `(${this.state.retryCount}/${this.props.maxRetries || 3})`}
                </button>
              )}
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="text-xs text-blue-600 cursor-pointer">
                Debug Info
              </summary>
              <pre className="mt-2 text-xs text-blue-800 bg-blue-100 p-2 rounded overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return <>{children}</>
  }
}

// Hook for handling async errors in function components
export function useAsyncError(context?: string) {
  const [error, setError] = React.useState<Error | null>(null)
  const [retryCount, setRetryCount] = React.useState(0)

  const resetError = React.useCallback(() => {
    setError(null)
    setRetryCount(0)
  }, [])

  const captureError = React.useCallback((err: unknown) => {
    const error = err instanceof Error ? err : new Error(String(err))
    setError(error)

    console.error(`Async Error${context ? ` (${context})` : ''}:`, error)

    // Send to monitoring
    try {
      const errorData = {
        type: 'async-hook',
        context: context || 'Unknown',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        retryCount,
      }

      console.warn('Hook async error:', errorData)
    } catch (monitoringError) {
      console.error('Failed to send hook error:', monitoringError)
    }
  }, [context, retryCount])

  const retry = React.useCallback(() => {
    setRetryCount(prev => prev + 1)
    resetError()
  }, [resetError])

  return {
    error,
    hasError: !!error,
    captureError,
    resetError,
    retry,
    retryCount,
  }
}

export default AsyncErrorBoundary
