import React, { ErrorInfo } from 'react';

export interface AppError {
  name: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: string;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

export interface ErrorReportingService {
  report: (error: AppError) => void;
  setUser: (userId: string) => void;
  clearUser: () => void;
}

// Simple in-memory error reporting (replace with Sentry, LogRocket, etc. in production)
class SimpleErrorReporter implements ErrorReportingService {
  private userId?: string;
  private errors: AppError[] = [];

  setUser(userId: string) {
    this.userId = userId;
  }

  clearUser() {
    this.userId = undefined;
  }

  report(error: AppError) {
    const errorWithUser: AppError = {
      ...error,
      userId: this.userId,
    };

    // Store in memory (in production, send to external service)
    this.errors.push(errorWithUser);

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Reported');
      console.error('Error:', errorWithUser);
      console.groupEnd();
    }

    // In production, you would send to your error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      this.sendToMonitoringService(errorWithUser);
    }
  }

  private sendToMonitoringService(error: AppError) {
    // Replace with actual service integration (Sentry, LogRocket, etc.)
    try {
      // Example endpoint - replace with your actual error reporting endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      }).catch(() => {
        // Silently fail if error reporting fails
      });
    } catch {
      // Silently fail if error reporting fails
    }
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }
}

export const errorReporter = new SimpleErrorReporter();

export function createAppError(
  error: Error | string,
  context?: string,
  additionalInfo?: Record<string, any>
): AppError {
  if (typeof error === 'string') {
    return {
      name: 'ApplicationError',
      message: error,
      timestamp: new Date(),
      context,
      additionalInfo,
    };
  }

  return {
    name: error.name || 'UnknownError',
    message: error.message || 'An unknown error occurred',
    stack: error.stack,
    timestamp: new Date(),
    context,
    additionalInfo,
  };
}

export function handleReactError(error: Error, errorInfo: ErrorInfo, context?: string) {
  const appError = createAppError(error, context || 'React Component', {
    componentStack: errorInfo.componentStack,
    errorBoundary: true,
  });

  errorReporter.report(appError);
}

export function handleAsyncError(
  error: Error | unknown,
  context?: string,
  additionalInfo?: Record<string, any>
) {
  const appError = createAppError(
    error instanceof Error ? error : new Error(String(error)),
    context || 'Async Operation',
    {
      ...additionalInfo,
      isAsync: true,
    }
  );

  errorReporter.report(appError);
}

export function handleNetworkError(
  error: Error | unknown,
  url?: string,
  method?: string,
  additionalInfo?: Record<string, any>
) {
  const appError = createAppError(
    error instanceof Error ? error : new Error(String(error)),
    'Network Request',
    {
      url,
      method,
      ...additionalInfo,
      isNetwork: true,
    }
  );

  errorReporter.report(appError);
}

// Utility function to wrap async functions with error handling
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleAsyncError(error, context, { args });
      throw error; // Re-throw to allow caller to handle
    }
  };
}

// Utility function to create safe async wrappers that don't throw
export function safeAsync<T>(
  promise: Promise<T>,
  context?: string,
  fallback?: T
): Promise<T | undefined> {
  return promise.catch((error) => {
    handleAsyncError(error, context);
    return fallback;
  });
}

// Hook for error handling in components
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error | string, context?: string) => {
    const appError = createAppError(error, context);
    errorReporter.report(appError);
  }, []);

  const handleAsyncError = React.useCallback((
    error: Error | unknown,
    context?: string,
    additionalInfo?: Record<string, any>
  ) => {
    handleAsyncError(error, context, additionalInfo);
  }, []);

  return {
    handleError,
    handleAsyncError,
    errorReporter,
  };
}