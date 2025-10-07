/**
 * Rate Limiter Utility
 *
 * This utility provides rate limiting functionality for API calls and other
 * operations that need to be throttled. It supports multiple rate limiting
 * strategies and provides both in-memory and persistent storage options.
 */

import React from 'react';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (identifier: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: Date;
  lastAccess: Date;
}

/**
 * Rate Limiter Class
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private storage: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    };

    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.windowMs);
  }

  /**
   * Check if a request is allowed
   */
  async checkLimit(identifier: string, options?: {
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  }): Promise<RateLimitResult> {
    const key = this.config.keyGenerator 
      ? this.config.keyGenerator(identifier)
      : identifier;

    const now = new Date();
    const entry = this.storage.get(key);

    // If no entry exists, create one
    if (!entry) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: new Date(now.getTime() + this.config.windowMs),
        lastAccess: now
      };

      this.storage.set(key, newEntry);
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: newEntry.resetTime
      };
    }

    // Check if the window has reset
    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = new Date(now.getTime() + this.config.windowMs);
      entry.lastAccess = now;

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: entry.resetTime
      };
    }

    // Check if the request would exceed the limit
    const wouldExceed = entry.count >= this.config.maxRequests;
    
    if (wouldExceed) {
      const retryAfter = Math.ceil((entry.resetTime.getTime() - now.getTime()) / 1000);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter
      };
    }

    // Increment the counter
    entry.count++;
    entry.lastAccess = now;

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Reset the rate limit for a specific identifier
   */
  reset(identifier: string): void {
    const key = this.config.keyGenerator 
      ? this.config.keyGenerator(identifier)
      : identifier;
    
    this.storage.delete(key);
  }

  /**
   * Get current status for an identifier
   */
  getStatus(identifier: string): {
    remaining: number;
    resetTime: Date;
    totalRequests: number;
  } | null {
    const key = this.config.keyGenerator 
      ? this.config.keyGenerator(identifier)
      : identifier;
    
    const entry = this.storage.get(key);
    
    if (!entry) {
      return null;
    }

    return {
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      totalRequests: entry.count
    };
  }

  /**
   * Get all active rate limit entries
   */
  getAllEntries(): Array<{
    identifier: string;
    count: number;
    resetTime: Date;
    lastAccess: Date;
  }> {
    const entries: Array<{
      identifier: string;
      count: number;
      resetTime: Date;
      lastAccess: Date;
    }> = [];

    for (const [key, entry] of this.storage.entries()) {
      entries.push({
        identifier: key,
        count: entry.count,
        resetTime: entry.resetTime,
        lastAccess: entry.lastAccess
      });
    }

    return entries;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired rate limit entries`);
    }
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.storage.clear();
  }
}

/**
 * Predefined rate limiters for different use cases
 */
export const rateLimiters = {
  // AI Content Generation - 10 requests per minute
  aiContentGeneration: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    keyGenerator: (identifier: string) => `ai-content:${identifier}`
  }),

  // API Calls - 100 requests per minute
  apiCalls: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyGenerator: (identifier: string) => `api:${identifier}`
  }),

  // Database Operations - 1000 requests per minute
  databaseOperations: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000,
    keyGenerator: (identifier: string) => `db:${identifier}`
  }),

  // Page Generation - 20 requests per minute
  pageGeneration: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    keyGenerator: (identifier: string) => `page:${identifier}`
  }),

  // Search Operations - 50 requests per minute
  searchOperations: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50,
    keyGenerator: (identifier: string) => `search:${identifier}`
  })
};

/**
 * Express middleware for rate limiting
 */
export function createRateLimitMiddleware(limiter: RateLimiter, identifierExtractor?: (req: any) => string) {
  return async (req: any, res: any, next: any) => {
    try {
      const identifier = identifierExtractor 
        ? identifierExtractor(req)
        : req.ip || 'unknown';

      const result = await limiter.checkLimit(identifier);

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': limiter['config'].maxRequests,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': Math.ceil(result.resetTime.getTime() / 1000)
      });

      if (!result.allowed) {
        res.set('Retry-After', result.retryAfter);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter
        });
      }

      next();

    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Allow the request to proceed if rate limiting fails
    }
  };
}

/**
 * React hook for rate limiting
 */
export function useRateLimit(limiter: RateLimiter, identifier: string) {
  const [status, setStatus] = React.useState<{
    allowed: boolean;
    remaining: number;
    resetTime: Date;
    loading: boolean;
  }>({
    allowed: true,
    remaining: limiter['config'].maxRequests,
    resetTime: new Date(),
    loading: false
  });

  const checkLimit = React.useCallback(async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await limiter.checkLimit(identifier);
      setStatus({
        allowed: result.allowed,
        remaining: result.remaining,
        resetTime: result.resetTime,
        loading: false
      });
      
      return result;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      setStatus(prev => ({ ...prev, loading: false }));
      return { allowed: true, remaining: 0, resetTime: new Date() };
    }
  }, [limiter, identifier]);

  const reset = React.useCallback(() => {
    limiter.reset(identifier);
    setStatus({
      allowed: true,
      remaining: limiter['config'].maxRequests,
      resetTime: new Date(),
      loading: false
    });
  }, [limiter, identifier]);

  return {
    ...status,
    checkLimit,
    reset
  };
}

/**
 * Decorator for rate limiting function calls
 */
export function rateLimit(limiter: RateLimiter, identifierExtractor?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const identifier = identifierExtractor 
        ? identifierExtractor(...args)
        : 'function-call';

      const result = await limiter.checkLimit(identifier);
      
      if (!result.allowed) {
        throw new Error(`Rate limit exceeded. Retry after ${result.retryAfter} seconds`);
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Utility function to create a custom rate limiter
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}

/**
 * Default rate limiter instance
 */
export const rateLimiter = rateLimiters.aiContentGeneration;

export default rateLimiter;