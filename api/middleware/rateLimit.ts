import type { VercelRequest } from '@vercel/node';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create rate limiters for different endpoints
const chatLimiter = new RateLimiterMemory({
  points: 30, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
});

const generalLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
});

const authLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 300, // Per 300 seconds (5 minutes)
});

const calculatorLimiter = new RateLimiterMemory({
  points: 50, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
});

export interface RateLimitResult {
  success: boolean;
  remainingPoints: number;
  msBeforeNext: number;
}

export async function checkRateLimit(
  request: VercelRequest,
  type: 'chat' | 'general' | 'auth' | 'calculator' = 'general'
): Promise<RateLimitResult> {
  const ip = (request.headers['x-forwarded-for'] as string) || 
            (request.headers['x-real-ip'] as string) || 
            'unknown';
  const userId = (request.headers['x-user-id'] as string) || ip;

  const limiter = type === 'chat' ? chatLimiter :
                   type === 'auth' ? authLimiter :
                   type === 'calculator' ? calculatorLimiter : generalLimiter;

  try {
    await limiter.consume(userId);
    return {
      success: true,
      remainingPoints: await limiter.getPoints(userId),
      msBeforeNext: 0
    };
  } catch (rejRes: any) {
    return {
      success: false,
      remainingPoints: rejRes.remainingPoints || 0,
      msBeforeNext: rejRes.msBeforeNext || 1000
    };
  }
}

export function createRateLimitResponse(remainingPoints: number, msBeforeNext: number) {
  const response = {
    error: 'Too many requests',
    message: 'Rate limit exceeded',
    retryAfter: Math.ceil(msBeforeNext / 1000)
  };

  return {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': remainingPoints.toString(),
      'X-RateLimit-Reset': Math.ceil((Date.now() + msBeforeNext) / 1000).toString(),
      'Retry-After': Math.ceil(msBeforeNext / 1000).toString()
    },
    body: JSON.stringify(response)
  };
}