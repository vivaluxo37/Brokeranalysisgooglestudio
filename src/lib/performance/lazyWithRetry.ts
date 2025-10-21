import { lazy } from 'react'

interface LazyRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error, retryCount: number) => void;
}

/**
 * A wrapper around React.lazy that adds retry functionality
 * for better resilience when loading chunks over poor networks
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  chunkName?: string,
  options: LazyRetryOptions = {},
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
  } = options

  return lazy(async () => {
    let retryCount = 0

    while (retryCount < maxRetries) {
      try {
        const module = await factory()
        return module
      } catch (error) {
        retryCount++

        if (onError) {
          onError(error as Error, retryCount)
        }

        // Log retry attempt
        console.warn(
          `Failed to load chunk${chunkName ? ` "${chunkName}"` : ''}, ` +
          `retrying (${retryCount}/${maxRetries})...`,
          error,
        )

        // If this was the last attempt, throw the error
        if (retryCount >= maxRetries) {
          console.error(
            `Failed to load chunk${chunkName ? ` "${chunkName}"` : ''} after ${maxRetries} attempts`,
            error,
          )
          throw error
        }

        // Wait before retrying with exponential backoff
        await new Promise(resolve =>
          setTimeout(resolve, retryDelay * 2 ** (retryCount - 1)),
        )
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error(`Failed to load chunk after ${maxRetries} retries`)
  })
}

/**
 * Preloads a chunk for better performance
 * Useful for preloading critical chunks on hover or before navigation
 */
export function preloadChunk<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): Promise<{ default: T }> {
  return factory()
}

/**
 * Creates a preloader function for a lazy component
 */
export function createPreloader<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  let preloadPromise: Promise<{ default: T }> | null = null

  return () => {
    if (!preloadPromise) {
      preloadPromise = factory()
    }
    return preloadPromise
  }
}
