/**
 * Cache Service
 * Multi-layer caching with memory, localStorage, and Redis support
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  persist?: boolean; // Whether to persist to localStorage
  compress?: boolean; // Whether to compress data
  tags?: string[]; // Tags for cache invalidation
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl?: number;
  tags?: string[];
  compressed?: boolean;
  accessCount: number;
  lastAccessed: number;
}

class CacheService {
  private readonly memoryCache: Map<string, CacheEntry> = new Map()
  private readonly maxMemorySize = 100 // Max items in memory cache
  private readonly defaultTtl = 30 * 60 * 1000 // 30 minutes

  constructor() {
    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60 * 1000) // Every minute

    // Load persistent cache on startup
    this.loadPersistedCache()
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = this.defaultTtl,
      persist = false,
      compress = false,
      tags = [],
    } = options

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
      compressed: compress,
      accessCount: 0,
      lastAccessed: Date.now(),
    }

    // Add to memory cache
    this.memoryCache.set(key, entry)

    // Evict oldest entries if cache is full
    this.evictOldest()

    // Persist if requested
    if (persist) {
      this.persistToStorage(key, entry)
    }
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    // Check memory cache first
    let entry = this.memoryCache.get(key)

    if (!entry) {
      // Try loading from persistent storage
      entry = this.loadFromStorage(key)
      if (entry) {
        this.memoryCache.set(key, entry)
      }
    }

    if (!entry) {
      return null
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(key)
      return null
    }

    // Update access statistics
    entry.accessCount++
    entry.lastAccessed = Date.now()

    return entry.data as T
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.get(key)
    return entry !== null
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    const memoryDeleted = this.memoryCache.delete(key)
    const storageDeleted = this.deleteFromStorage(key)

    return memoryDeleted || storageDeleted
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear()
    this.clearStorage()
  }

  /**
   * Clear cache by tags
   */
  clearByTag(tag: string): void {
    // Clear from memory
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags?.includes(tag)) {
        this.memoryCache.delete(key)
      }
    }

    // Clear from storage
    this.clearStorageByTag(tag)
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memorySize: number;
    hitRate: number;
    totalAccesses: number;
    expiredCount: number;
    } {
    let totalAccesses = 0
    let expiredCount = 0

    for (const entry of this.memoryCache.values()) {
      totalAccesses += entry.accessCount
      if (this.isExpired(entry)) {
        expiredCount++
      }
    }

    return {
      memorySize: this.memoryCache.size,
      hitRate: totalAccesses > 0 ? (totalAccesses - expiredCount) / totalAccesses : 0,
      totalAccesses,
      expiredCount,
    }
  }

  /**
   * Warm up cache with predefined data
   */
  async warmup(keys: string[], dataFetcher: (key: string) => Promise<any>): Promise<void> {
    const promises = keys.map(async (key) => {
      if (!this.has(key)) {
        try {
          const data = await dataFetcher(key)
          this.set(key, data, { persist: true })
        } catch (error) {
          console.error(`Failed to warm up cache for key ${key}:`, error)
        }
      }
    })

    await Promise.all(promises)
  }

  /**
   * Preload data into cache
   */
  preload<T>(key: string, dataLoader: () => Promise<T>, options?: CacheOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      // Check if already in cache
      const cached = this.get<T>(key)
      if (cached !== null) {
        resolve(cached)
        return
      }

      // Load data
      dataLoader()
        .then(data => {
          this.set(key, data, options)
          resolve(data)
        })
        .catch(reject)
    })
  }

  /**
   * Create a cache key from parameters
   */
  createKey(...parts: (string | number)[]): string {
    return parts.join(':')
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) {return false}
    return Date.now() - entry.timestamp > entry.ttl
  }

  /**
   * Evict oldest entries from memory cache
   */
  private evictOldest(): void {
    if (this.memoryCache.size <= this.maxMemorySize) {
      return
    }

    // Sort by last accessed time and remove oldest
    const entries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)

    const toRemove = entries.slice(0, entries.length - this.maxMemorySize)

    toRemove.forEach(([key]) => {
      this.memoryCache.delete(key)
    })
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key)
      }
    }
  }

  /**
   * Persist to localStorage
   */
  private persistToStorage(key: string, entry: CacheEntry): void {
    try {
      const storageKey = `cache:${key}`
      const serialized = JSON.stringify(entry)
      localStorage.setItem(storageKey, serialized)
    } catch (error) {
      console.error('Failed to persist cache entry:', error)
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(key: string): CacheEntry | null {
    try {
      const storageKey = `cache:${key}`
      const serialized = localStorage.getItem(storageKey)

      if (!serialized) {
        return null
      }

      const entry = JSON.parse(serialized) as CacheEntry

      // Check if expired
      if (this.isExpired(entry)) {
        localStorage.removeItem(storageKey)
        return null
      }

      return entry
    } catch (error) {
      console.error('Failed to load cache entry from storage:', error)
      return null
    }
  }

  /**
   * Delete from localStorage
   */
  private deleteFromStorage(key: string): boolean {
    try {
      const storageKey = `cache:${key}`
      localStorage.removeItem(storageKey)
      return true
    } catch (error) {
      console.error('Failed to delete cache entry from storage:', error)
      return false
    }
  }

  /**
   * Clear all localStorage cache entries
   */
  private clearStorage(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear storage cache:', error)
    }
  }

  /**
   * Clear storage entries by tag
   */
  private clearStorageByTag(tag: string): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          const serialized = localStorage.getItem(key)
          if (serialized) {
            try {
              const entry = JSON.parse(serialized) as CacheEntry
              if (entry.tags?.includes(tag)) {
                localStorage.removeItem(key)
              }
            } catch {
              // Invalid entry, remove it
              localStorage.removeItem(key)
            }
          }
        }
      })
    } catch (error) {
      console.error('Failed to clear storage cache by tag:', error)
    }
  }

  /**
   * Load persisted cache on startup
   */
  private loadPersistedCache(): void {
    try {
      const keys = Object.keys(localStorage)
      let loadedCount = 0

      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          const entry = this.loadFromStorage(key.replace('cache:', ''))
          if (entry) {
            this.memoryCache.set(key.replace('cache:', ''), entry)
            loadedCount++
          }
        }
      })

      console.log(`Loaded ${loadedCount} cached entries from storage`)
    } catch (error) {
      console.error('Failed to load persisted cache:', error)
    }
  }
}

// Create singleton instance
const cacheService = new CacheService()

export default cacheService
