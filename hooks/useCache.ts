/**
 * Cache Hook
 * React hook for using the cache service with state management
 */

import { useState, useEffect, useCallback } from 'react'

import { cacheService, type CacheOptions } from '../services/data/cacheService'

interface UseCacheOptions<T> extends CacheOptions {
  key: string;
  fallback?: T;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
}

interface UseCacheResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isValidating: boolean;
  mutate: (data?: T | Promise<T>, options?: { revalidate?: boolean }) => Promise<T | undefined>;
  revalidate: () => Promise<T | undefined>;
  reset: () => void;
}

export function useCache<T = any>(
  loader: () => Promise<T>,
  options: UseCacheOptions<T>,
): UseCacheResult<T> {
  const {
    key,
    fallback,
    ttl,
    persist,
    compress,
    tags,
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    refreshInterval,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Load data from cache or fetch fresh
  const loadData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      // Try to get from cache first
      const cached = cacheService.get<T>(key)
      if (cached !== null) {
        setData(cached)
        setError(null)
        return cached
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      const freshData = await loader()
      cacheService.set(key, freshData, { ttl, persist, compress, tags })
      setData(freshData)
      return freshData
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load data')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [key, loader, ttl, persist, compress, tags])

  // Revalidate data
  const revalidate = useCallback(async () => {
    setIsValidating(true)
    try {
      const freshData = await loader()
      cacheService.set(key, freshData, { ttl, persist, compress, tags })
      setData(freshData)
      return freshData
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to revalidate data')
      setError(error)
      throw error
    } finally {
      setIsValidating(false)
    }
  }, [key, loader, ttl, persist, compress, tags])

  // Mutate data
  const mutate = useCallback(async (
    newData?: T | Promise<T>,
    options: { revalidate?: boolean } = {},
  ) => {
    if (newData !== undefined) {
      try {
        const resolvedData = newData instanceof Promise ? await newData : newData
        cacheService.set(key, resolvedData, { ttl, persist, compress, tags })
        setData(resolvedData)

        if (options.revalidate) {
          await revalidate()
        }

        return resolvedData
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to mutate data')
        setError(error)
        throw error
      }
    } else {
      return revalidate()
    }
  }, [key, ttl, persist, compress, tags, revalidate])

  // Reset cache
  const reset = useCallback(() => {
    cacheService.delete(key)
    setData(null)
    setError(null)
  }, [key])

  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) {return}

    const handleFocus = () => {
      revalidate()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [revalidateOnFocus, revalidate])

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) {return}

    const handleOnline = () => {
      revalidate()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [revalidateOnReconnect, revalidate])

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) {return}

    const interval = setInterval(() => {
      revalidate()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, revalidate])

  return {
    data: data || (fallback as T) || null,
    isLoading,
    error,
    isValidating,
    mutate,
    revalidate,
    reset,
  }
}

// Hook for prefetching data
export function usePrefetch() {
  const prefetch = useCallback(<T>(
    key: string,
    loader: () => Promise<T>,
    options?: CacheOptions,
  ) => {
    // Don't await - fire and forget
    cacheService.preload(key, loader, options).catch(console.error)
  }, [])

  return { prefetch }
}

// Hook for cache invalidation
export function useCacheInvalidation() {
  const invalidate = useCallback((key: string) => {
    cacheService.delete(key)
  }, [])

  const invalidateByTag = useCallback((tag: string) => {
    cacheService.clearByTag(tag)
  }, [])

  const invalidateAll = useCallback(() => {
    cacheService.clear()
  }, [])

  return {
    invalidate,
    invalidateByTag,
    invalidateAll,
  }
}

// Hook for cache statistics
export function useCacheStats() {
  const [stats, setStats] = useState(() => cacheService.getStats())

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheService.getStats())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return stats
}

export default useCache
