/**
 * Error Components Index
 * Exports all error boundary components
 */

export { default as AuthErrorBoundary } from './AuthErrorBoundary';
export { default as ContextErrorBoundary } from './ContextErrorBoundary';

// Create simple wrapper components for the missing exports
import React, { Component, ErrorInfo, ReactNode } from 'react';
import AuthErrorBoundary from './AuthErrorBoundary';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// General Error Boundary
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route Error Boundary
export class RouteErrorBoundary extends ErrorBoundary {}

// Component Error Boundary  
export class ComponentErrorBoundary extends ErrorBoundary {}

// Error Provider Context
const ErrorContext = React.createContext<{
  error: Error | null;
  setError: (error: Error | null) => void;
}>({
  error: null,
  setError: () => {},
});

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = React.useState<Error | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => React.useContext(ErrorContext);
