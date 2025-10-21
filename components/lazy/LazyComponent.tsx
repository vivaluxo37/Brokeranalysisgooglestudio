/**
 * Lazy Component Wrapper
 * Provides enhanced lazy loading with error boundaries and loading states
 */

import React, { Suspense, ComponentType, ReactNode, useEffect, useState } from 'react'

import { ComponentErrorBoundary } from '../error'

interface LazyComponentProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  delay?: number;
  preload?: boolean;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  [key: string]: any;
}

interface LazyComponentState {
  Component: ComponentType<any> | null;
  error: Error | null;
  isLoading: boolean;
  shouldRender: boolean;
}

class LazyComponentWrapper extends React.Component<LazyComponentProps, LazyComponentState> {
  private loadPromise: Promise<ComponentType<any>> | null = null
  private timeoutId: NodeJS.Timeout | null = null

  constructor(props: LazyComponentProps) {
    super(props)

    this.state = {
      Component: null,
      error: null,
      isLoading: false,
      shouldRender: false,
    }
  }

  componentDidMount() {
    if (this.props.preload) {
      this.loadComponent()
    }
  }

  componentDidUpdate(prevProps: LazyComponentProps) {
    if (!prevProps.preload && this.props.preload) {
      this.loadComponent()
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  private readonly loadComponent = async (): Promise<void> => {
    if (this.state.Component || this.state.error || this.loadPromise) {
      return
    }

    this.setState({ isLoading: true })

    try {
      this.loadPromise = this.props.loader().then(module => module.default)

      const Component = await this.loadPromise

      this.setState({
        Component,
        error: null,
        isLoading: false,
      })

      this.props.onLoad?.()

      // Add delay before rendering for smoother UX
      if (this.props.delay && this.props.delay > 0) {
        this.timeoutId = setTimeout(() => {
          this.setState({ shouldRender: true })
        }, this.props.delay)
      } else {
        this.setState({ shouldRender: true })
      }

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load component')

      this.setState({
        Component: null,
        error: err,
        isLoading: false,
      })

      this.props.onError?.(err)
    } finally {
      this.loadPromise = null
    }
  }

  private readonly retryLoad = (): void => {
    this.setState({
      Component: null,
      error: null,
      isLoading: false,
      shouldRender: false,
    }, () => {
      this.loadComponent()
    })
  }

  render() {
    const { Component, error, isLoading, shouldRender } = this.state
    const {
      fallback,
      errorFallback,
      loader,
      preload,
      delay,
      onError,
      onLoad,
      ...restProps
    } = this.props

    // If component is loaded and ready to render
    if (Component && shouldRender) {
      return (
        <ComponentErrorBoundary
          onError={(err) => {
            console.error('Error in lazy component:', err)
            this.props.onError?.(err)
          }}
        >
          <Component {...restProps} />
        </ComponentErrorBoundary>
      )
    }

    // If there's an error
    if (error) {
      if (errorFallback) {
        return <>{errorFallback}</>
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
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

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to Load Component
          </h3>

          <p className="text-gray-600 mb-4">
            {error.message || 'An error occurred while loading this component.'}
          </p>

          <button
            onClick={this.retryLoad}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    // Show loading state
    if (isLoading || (preload && !Component)) {
      if (fallback) {
        return <>{fallback}</>
      }

      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="text-gray-600 text-sm">Loading component...</p>
          </div>
        </div>
      )
    }

    // Default fallback for when not preloaded
    return (
      <div
        className="lazy-component-placeholder"
        onMouseEnter={this.loadComponent}
        onFocus={this.loadComponent}
        onClick={this.loadComponent}
        style={{ cursor: 'pointer' }}
      >
        {fallback || (
          <div className="flex items-center justify-center p-8 text-center">
            <p className="text-gray-500 text-sm">
              Click to load component
            </p>
          </div>
        )}
      </div>
    )
  }
}

// HOC for creating lazy components
export function createLazyComponent<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  options?: {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    delay?: number;
    preload?: boolean;
    displayName?: string;
  },
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = (props: React.ComponentProps<T>) => (
    <LazyComponentWrapper
      loader={loader}
      {...options}
      {...props}
    />
  )

  LazyComponent.displayName = options?.displayName || 'LazyComponent'

  return LazyComponent
}

// Hook for lazy loading
export function useLazyComponent<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
) {
  const [component, setComponent] = useState<ComponentType<any> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const load = React.useCallback(async () => {
    if (component || loading) {return}

    setLoading(true)
    setError(null)

    try {
      const module = await loader()
      setComponent(module.default)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'))
    } finally {
      setLoading(false)
    }
  }, [loader, component, loading])

  const reset = React.useCallback(() => {
    setComponent(null)
    setLoading(false)
    setError(null)
  }, [])

  return {
    component,
    loading,
    error,
    load,
    reset,
  }
}

// Intersection Observer based lazy loading
export function IntersectionLazyComponent({
  loader,
  children,
  rootMargin = '50px',
  ...props
}: LazyComponentProps & {
  rootMargin?: string;
  children?: ReactNode;
}) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const elementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) {return}

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, hasLoaded])

  return (
    <div ref={elementRef} {...props}>
      {isVisible && (
        <LazyComponentWrapper
          loader={loader}
          {...props}
        />
      )}
      {!isVisible && children}
    </div>
  )
}

// Preload multiple components
export function preloadComponents(loaders: Array<{ name: string; loader: () => Promise<{ default: ComponentType<any> }> }>) {
  const promises = loaders.map(async ({ name, loader }) => {
    try {
      const module = await loader()
      return { name, component: module.default, error: null }
    } catch (error) {
      console.error(`Failed to preload component ${name}:`, error)
      return { name, component: null, error }
    }
  })

  return Promise.all(promises)
}

// Default export
export default LazyComponentWrapper
