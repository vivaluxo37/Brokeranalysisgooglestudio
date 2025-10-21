const isDevelopment = (): boolean => {
  return ['NODE_ENV', 'MODE', 'VITE_MODE'].some(key => getEnv(key) === 'development')
}
// Fallback helper to safely access environment variables in browser/SSR
const getEnvValue = (keys: string[], fallback: string): string => {
  for (const key of keys) {
    const value = getEnv(key)
    if (value) {
      return value
    }
  }
  return fallback
}
/**
 * Comprehensive Error Boundary Component
 * Catches and handles React errors gracefully with detailed reporting
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'

const getEnv = (key: string, fallback?: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env && Object.prototype.hasOwnProperty.call(process.env, key)) {
    return process.env[key]
  }

  const importMeta = (globalThis as typeof globalThis & { import?: unknown }).import as { meta?: { env?: Record<string, string> } } | undefined
  const metaEnv = importMeta?.meta?.env ?? ((import.meta as { env?: Record<string, string> })?.env)
  if (metaEnv && Object.prototype.hasOwnProperty.call(metaEnv, key)) {
    return metaEnv[key]
  }

  return fallback
}

import { Button } from '../ui/Button'

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; errorId: string; onRetry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  enableRetry?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private readonly retryTimeouts: NodeJS.Timeout[] = []

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundary.generateErrorId(),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })

    // Log error details
    this.logError(error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo, this.state.errorId)
      } catch (handlerError) {
        console.error('Error in error boundary handler:', handlerError)
      }
    }

    // Send error to monitoring service
    this.sendErrorToMonitoring(error, errorInfo)
  }

  componentWillUnmount() {
    // Clean up any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout))
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private static generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private logError(error: Error, errorInfo: ErrorInfo): void {
    console.group(`🚨 React Error Boundary - ${this.state.errorId}`)
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Component Stack:', errorInfo.componentStack)
    console.error('Error Stack:', error.stack)

    // Add additional context
    console.log('User Agent:', navigator.userAgent)
    console.log('URL:', window.location.href)
    console.log('Timestamp:', new Date().toISOString())

    console.groupEnd()
  }

  private sendErrorToMonitoring(error: Error, errorInfo: ErrorInfo): void {
    try {
      // In a real app, you would send this to a monitoring service
      const errorData = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.state.retryCount,
        buildVersion: getEnvValue(['REACT_APP_VERSION', 'VITE_APP_VERSION'], 'unknown'),
      }

      // Example: Send to console for now (replace with actual monitoring service)
      console.warn('Error monitoring data:', errorData)

      // You could integrate with services like:
      // - Sentry
      // - LogRocket
      // - Bugsnag
      // - Custom error tracking endpoint

      // Example Sentry integration (if available):
      // if (window.Sentry) {
      //   window.Sentry.captureException(error, {
      //     contexts: {
      //       react: {
      //         componentStack: errorInfo.componentStack
      //       }
      //     },
      //     tags: {
      //       errorBoundary: true,
      //       errorId: this.state.errorId
      //     }
      //   });
      // }

    } catch (monitoringError) {
      console.error('Failed to send error to monitoring service:', monitoringError)
    }
  }

  private readonly handleRetry = (): void => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      // Increment retry count
      this.setState(prevState => ({
        retryCount: prevState.retryCount + 1,
      }))

      // Clear error state after a short delay
      const timeout = setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: this.generateErrorId(),
        })
      }, 1000)

      this.retryTimeouts.push(timeout)
    }
  }

  private readonly handleReload = (): void => {
    window.location.reload()
  }

  private readonly handleGoHome = (): void => {
    window.location.href = '/'
  }

  render() {
    const { hasError, error, errorId } = this.state
    const {
      children,
      fallback: Fallback,
      showErrorDetails = isDevelopment(),
      enableRetry = true,
    } = this.props

    if (hasError && error) {
      // Use custom fallback if provided
      if (Fallback) {
        return (
          <Fallback
            error={error}
            errorId={errorId}
            onRetry={this.handleRetry}
          />
        )
      }

      // Default error boundary UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>

            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened.
              {enableRetry && ' You can try again or refresh the page.'}
            </p>

            {/* Error Details (Development Only) */}
            {showErrorDetails && (
              <details className="text-left mb-6 p-3 bg-gray-50 rounded border">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <strong>Error ID:</strong> {errorId}
                  </div>
                  <div>
                    <strong>Message:</strong> {error.message}
                  </div>
                  <div>
                    <strong>Retry Count:</strong> {this.state.retryCount}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs bg-white p-2 rounded border">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {enableRetry && this.state.retryCount < (this.props.maxRetries || 3) && (
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  Try Again
                  {this.state.retryCount > 0 && ` (${this.state.retryCount}/${this.props.maxRetries || 3})`}
                </Button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  Reload Page
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  Go Home
                </Button>
              </div>
            </div>

            {/* Support Info */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <p>
                If this problem persists, please contact support
                and reference Error ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{errorId}</code>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Hook for reporting errors manually
export function useErrorReporting() {
  const reportError = React.useCallback((error: Error, context?: Record<string, any>) => {
    const errorId = ErrorBoundary.generateErrorId()

    console.group(`🚨 Manual Error Report - ${errorId}`)
    console.error('Error:', error)
    if (context) {
      console.log('Context:', context)
    }
    console.groupEnd()

    // Send to monitoring service
    try {
      const errorData = {
        errorId,
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        manualReport: true,
      }

      console.warn('Manual error report:', errorData)
    } catch (monitoringError) {
      console.error('Failed to send manual error report:', monitoringError)
    }

    return errorId
  }, [])

  return { reportError }
}
