/**
 * Component Error Boundary
 * Lightweight error boundary for individual components
 */

import React from 'react'

import { Button } from '../ui/button'

import ErrorBoundary from './ErrorBoundary'

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
  showMessage?: boolean;
}

interface ComponentFallbackProps {
  error: Error;
  onRetry: () => void;
  showMessage?: boolean;
}

const ComponentFallback: React.FC<ComponentFallbackProps> = ({
  error,
  onRetry,
  showMessage = true,
}) => {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <div className="flex items-start space-x-3">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Content */}
        <div className="flex-1 min-w-0">
          {showMessage && (
            <>
              <h3 className="text-sm font-medium text-red-800">
                Component Error
              </h3>
              <p className="text-sm text-red-700 mt-1">
                This component encountered an error and could not be displayed.
              </p>
            </>
          )}

          {/* Retry Button */}
          <div className="mt-3">
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>

          {/* Development Details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-3">
              <summary className="text-xs text-red-600 cursor-pointer">
                Error Details
              </summary>
              <pre className="mt-1 text-xs text-red-800 bg-red-100 p-2 rounded overflow-auto max-h-32">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

const SilentFallback: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="p-2 text-center text-gray-500 text-sm">
    <button
      onClick={onRetry}
      className="text-blue-600 hover:text-blue-800 underline"
      title="Retry loading component"
    >
      Reload component
    </button>
  </div>
)

export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({
  children,
  fallback,
  onError,
  showMessage = true,
}) => {
  return (
    <ErrorBoundary
      fallback={fallback || (showMessage ? ComponentFallback : SilentFallback)}
      maxRetries={3}
      enableRetry={true}
      onError={(error, errorInfo, errorId) => {
        console.error('Component error:', { error, errorInfo, errorId })
        onError?.(error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// HOC for easy component wrapping
export function withComponentErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    onError?: (error: Error) => void;
    showMessage?: boolean;
  },
) {
  const WrappedComponent = (props: P) => (
    <ComponentErrorBoundary {...options}>
      <Component {...props} />
    </ComponentErrorBoundary>
  )

  WrappedComponent.displayName = `withComponentErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

export default ComponentErrorBoundary
