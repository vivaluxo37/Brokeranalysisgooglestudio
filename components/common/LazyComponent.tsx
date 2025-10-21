/**
 * Lazy Component Loader
 *
 * Uses IntersectionObserver to defer loading of heavy components
 * until they are about to enter the viewport.
 */

import React, { useState, useRef, useEffect, ReactNode, ComponentType } from 'react'

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = null,
  rootMargin = '50px',
  threshold = 0.1,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) {return}

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.unobserve(element)
        }
      },
      {
        rootMargin,
        threshold,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold, hasLoaded])

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

/**
 * Higher-order component for lazy loading React components
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: ReactNode;
    rootMargin?: string;
    threshold?: number;
  } = {},
) {
  const LazyWrappedComponent = (props: P) => (
    <LazyComponent {...options}>
      <Component {...props} />
    </LazyComponent>
  )

  LazyWrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`

  return LazyWrappedComponent
}

/**
 * Hook for lazy loading components with more control
 */
export function useLazyLoad(options: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) {return}

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.unobserve(element)
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1,
      },
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [options.rootMargin, options.threshold, hasLoaded])

  return {
    elementRef,
    isVisible,
    hasLoaded,
  }
}

export default LazyComponent
