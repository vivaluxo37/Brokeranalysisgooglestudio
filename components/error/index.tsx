/**
 * Error Boundary Components Index
 * Centralized exports for all error boundary components
 */

import React from 'react'

// Main error boundary
export { default as ErrorBoundary, withErrorBoundary, useErrorReporting } from './ErrorBoundary'

// Specialized error boundaries
export { default as RouteErrorBoundary } from './RouteErrorBoundary'
export { default as ComponentErrorBoundary, withComponentErrorBoundary } from './ComponentErrorBoundary'
export { default as AsyncErrorBoundary, useAsyncError } from './AsyncErrorBoundary'

// Re-export types
export type { ErrorBoundaryProps } from './ErrorBoundary'
export type { RouteErrorBoundaryProps } from './RouteErrorBoundary'
export type { ComponentErrorBoundaryProps } from './ComponentErrorBoundary'
export type { AsyncErrorBoundaryProps, AsyncErrorBoundaryState } from './AsyncErrorBoundary'

// Utility functions
export const createErrorBoundary = (options?: {
  fallback?: React.ComponentType<any>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
}) => {
  return (props: { children: React.ReactNode }) => (
    <ErrorBoundary {...options}>
      {props.children}
    </ErrorBoundary>
  )
}

// Error context for sharing error state
export const ErrorContext = React.createContext<{
  reportError: (error: Error, context?: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
    }>({
      reportError: () => {},
      clearErrors: () => {},
      hasErrors: false,
    })

// Provider component for error context
export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = React.useState<Set<string>>(new Set())

  const reportError = React.useCallback((error: Error, context?: string) => {
    const errorKey = `${error.message}-${context || 'no-context'}`
    setErrors(prev => new Set(prev).add(errorKey))

    console.error(`Reported error${context ? ` (${context})` : ''}:`, error)
  }, [])

  const clearErrors = React.useCallback(() => {
    setErrors(new Set())
  }, [])

  const value = {
    reportError,
    clearErrors,
    hasErrors: errors.size > 0,
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

// Hook for using error context
export const useErrorContext = () => {
  const context = React.useContext(ErrorContext)
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider')
  }
  return context
}
