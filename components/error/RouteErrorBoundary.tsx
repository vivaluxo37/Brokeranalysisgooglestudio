/**
 * Route Error Boundary
 * Specialized error boundary for handling route-level errors
 */

import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from '../ui/button'

import ErrorBoundary from './ErrorBoundary'

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const RouteFallback: React.FC<{ error: Error; errorId: string; onRetry: () => void }> = ({
  error,
  errorId,
  onRetry,
}) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Navigation Error Icon */}
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Navigation Error
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-6">
          We encountered an error while loading this page. This might be due to
          an invalid URL or a temporary issue with the page content.
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6 p-4 bg-red-50 rounded border border-red-200">
            <summary className="cursor-pointer font-medium text-red-800 mb-2">
              Error Details
            </summary>
            <div className="text-sm text-red-700">
              <div className="mb-2">
                <strong>Error ID:</strong> {errorId}
              </div>
              <div className="mb-2">
                <strong>Message:</strong> {error.message}
              </div>
              <div>
                <strong>Current URL:</strong> {window.location.pathname}
              </div>
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full"
            variant="default"
          >
            Try Loading Again
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              Home
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-medium text-gray-900 mb-2">Still having trouble?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Try these options:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Clear your browser cache and cookies</li>
            <li>• Check if the URL is correct</li>
            <li>• Contact support with Error ID: {errorId}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  children,
  fallbackPath = '/',
}) => {
  return (
    <ErrorBoundary
      fallback={RouteFallback}
      maxRetries={2}
      enableRetry={true}
      onError={(error, errorInfo, errorId) => {
        console.error('Route error:', { error, errorInfo, errorId, path: window.location.pathname })

        // Optionally redirect to fallback path after certain errors
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          setTimeout(() => {
            window.location.href = fallbackPath
          }, 3000)
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default RouteErrorBoundary
