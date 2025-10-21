/**
 * Comprehensive Input Validation and Sanitization Utilities
 * Provides validation schemas and sanitization functions for all user inputs
 */

// Basic sanitization functions
export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') {return ''}

  const sanitized = input
    .trim()
    .substring(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/[<>]/g, '')

  return sanitized.replace(/\s+/g, ' ')
}

export const sanitizeNumber = (input: any, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
  const num = Number(input)
  if (isNaN(num) || !isFinite(num)) {return min}
  return Math.max(min, Math.min(max, num))
}

export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {return ''}

  const sanitized = email.trim().toLowerCase().substring(0, 254)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(sanitized) ? sanitized : ''
}

export const sanitizeUrl = (url: string): string => {
  if (typeof url !== 'string') {return ''}

  const sanitized = url.trim()

  // Only allow http, https protocols
  if (!sanitized.match(/^https?:\/\//)) {
    return ''
  }

  // Remove any javascript or data protocols
  if (sanitized.match(/^(javascript|data):/)) {
    return ''
  }

  return sanitized.substring(0, 2048)
}

export const sanitizeHtml = (html: string): string => {
  if (typeof html !== 'string') {return ''}

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .substring(0, 10000)
}

// Validation schemas
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// Common validation schemas
export const userMessageSchema: ValidationSchema = {
  message: {
    required: true,
    minLength: 1,
    maxLength: 2000,
    pattern: /^[^<>]*$/,
    custom: (value: string) => {
      if (value.includes('javascript:') || value.includes('onload=')) {
        return 'Message contains invalid content'
      }
      return true
    },
  },
}

export const brokerFilterSchema: ValidationSchema = {
  minDeposit: {
    required: false,
    custom: (value: any) => {
      const num = Number(value)
      return (!isNaN(num) && num >= 0 && num <= 100000) || 'Invalid minimum deposit'
    },
  },
  maxLeverage: {
    required: false,
    custom: (value: any) => {
      const num = Number(value)
      return (!isNaN(num) && num >= 1 && num <= 5000) || 'Invalid leverage'
    },
  },
  regulators: {
    required: false,
    custom: (value: any) => {
      if (!Array.isArray(value)) {return 'Regulators must be an array'}
      if (value.length > 10) {return 'Too many regulators selected'}
      return value.every((reg: string) => typeof reg === 'string' && reg.length <= 100) ||
             'Invalid regulator format'
    },
  },
  tradingPlatforms: {
    required: false,
    custom: (value: any) => {
      if (!Array.isArray(value)) {return 'Platforms must be an array'}
      if (value.length > 10) {return 'Too many platforms selected'}
      return value.every((platform: string) => typeof platform === 'string' && platform.length <= 100) ||
             'Invalid platform format'
    },
  },
}

export const reviewSchema: ValidationSchema = {
  brokerId: {
    required: true,
    pattern: /^[a-zA-Z0-9_-]{1,50}$/,
    custom: (value: string) => {
      // Additional validation for broker ID
      return !value.includes('..') && !value.includes('/') || 'Invalid broker ID'
    },
  },
  rating: {
    required: true,
    custom: (value: any) => {
      const num = Number(value)
      return (num >= 1 && num <= 5 && Number.isInteger(num)) || 'Rating must be between 1 and 5'
    },
  },
  title: {
    required: true,
    minLength: 3,
    maxLength: 200,
    pattern: /^[^<>]*$/,
  },
  content: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    pattern: /^[^<>]*$/,
  },
  pros: {
    required: false,
    custom: (value: any) => {
      if (!Array.isArray(value)) {return 'Pros must be an array'}
      return value.length <= 5 &&
             value.every((pro: string) => typeof pro === 'string' && pro.length <= 200) ||
             'Invalid pros format'
    },
  },
  cons: {
    required: false,
    custom: (value: any) => {
      if (!Array.isArray(value)) {return 'Cons must be an array'}
      return value.length <= 5 &&
             value.every((con: string) => typeof con === 'string' && con.length <= 200) ||
             'Invalid cons format'
    },
  },
}

export const tradingJournalSchema: ValidationSchema = {
  symbol: {
    required: true,
    minLength: 1,
    maxLength: 20,
    pattern: /^[A-Z]{6}$/,
    custom: (value: string) => {
      // Validate forex pair format
      const forexPairs = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']
      const base = value.substring(0, 3)
      const quote = value.substring(3, 6)
      return (forexPairs.includes(base) && forexPairs.includes(quote)) || 'Invalid forex pair'
    },
  },
  direction: {
    required: true,
    custom: (value: string) => ['buy', 'sell'].includes(value.toLowerCase()) || 'Direction must be buy or sell',
  },
  lots: {
    required: true,
    custom: (value: any) => {
      const num = Number(value)
      if (Number.isNaN(num) || !Number.isFinite(num)) {
        return 'Invalid lot size'
      }
      const precision = Math.round(num * 100) / 100
      return (
        num > 0 &&
        num <= 100 &&
        Math.abs(num - precision) < Number.EPSILON * 100
      ) || 'Invalid lot size'
    },
  },
  entryPrice: {
    required: true,
    custom: (value: any) => {
      const num = Number(value)
      return (!isNaN(num) && num > 0 && num <= 1000000) || 'Invalid entry price'
    },
  },
  exitPrice: {
    required: false,
    custom: (value: any) => {
      if (value === null || value === undefined) {return true}
      const num = Number(value)
      return (!isNaN(num) && num > 0 && num <= 1000000) || 'Invalid exit price'
    },
  },
  stopLoss: {
    required: false,
    custom: (value: any) => {
      if (value === null || value === undefined) {return true}
      const num = Number(value)
      return (!isNaN(num) && num > 0) || 'Invalid stop loss'
    },
  },
  takeProfit: {
    required: false,
    custom: (value: any) => {
      if (value === null || value === undefined) {return true}
      const num = Number(value)
      return (!isNaN(num) && num > 0) || 'Invalid take profit'
    },
  },
  notes: {
    required: false,
    maxLength: 1000,
    custom: (value: string) => !value || /^[^<>]*$/.test(value) || 'Notes contain invalid characters',
  },
}

// Validation function
export const validateInput = (data: any, schema: ValidationSchema): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    // Check if required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`)
      continue
    }

    // Skip validation if field is not provided and not required
    if (value === undefined || value === null || value === '') {
      continue
    }

    // Type-specific validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`)
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`)
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} has invalid format`)
      }
    }

    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value)
      if (customResult !== true) {
        errors.push(typeof customResult === 'string' ? customResult : `${field} is invalid`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Sanitization function
export const sanitizeInput = (data: any, schema: ValidationSchema): any => {
  const sanitized: any = {}

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    if (value === undefined || value === null) {
      sanitized[field] = value
      continue
    }

    // Apply appropriate sanitization based on field name and type
    if (field.includes('email') || field.includes('Email')) {
      sanitized[field] = sanitizeEmail(String(value))
    } else if (field.includes('url') || field.includes('Url') || field.includes('website')) {
      sanitized[field] = sanitizeUrl(String(value))
    } else if (field.includes('html') || field.includes('content')) {
      sanitized[field] = sanitizeHtml(String(value))
    } else if (typeof value === 'number' || field.includes('Price') || field.includes('Amount') || field.includes('lots')) {
      sanitized[field] = sanitizeNumber(value)
    } else if (typeof value === 'string') {
      const maxLength = rules.maxLength || 1000
      sanitized[field] = sanitizeString(String(value), maxLength)
    } else if (Array.isArray(value)) {
      sanitized[field] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item, 500) : item,
      )
    } else {
      sanitized[field] = value
    }
  }

  return sanitized
}

// Combined validation and sanitization
export const validateAndSanitize = (data: any, schema: ValidationSchema): {
  isValid: boolean;
  errors: string[];
  data: any;
} => {
  // First sanitize the data
  const sanitizedData = sanitizeInput(data, schema)

  // Then validate the sanitized data
  const validation = validateInput(sanitizedData, schema)

  return {
    ...validation,
    data: sanitizedData,
  }
}

// Rate limiting helper
export class RateLimiter {
  private readonly requests: Map<string, number[]> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests

    // Clean up old entries periodically
    setInterval(() => this.cleanup(), this.windowMs)
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [])
    }

    const timestamps = this.requests.get(identifier)!

    // Remove old timestamps
    const recentTimestamps = timestamps.filter(time => time > windowStart)
    this.requests.set(identifier, recentTimestamps)

    // Check if under limit
    if (recentTimestamps.length < this.maxRequests) {
      recentTimestamps.push(now)
      return true
    }

    return false
  }

  private cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.windowMs

    for (const [identifier, timestamps] of this.requests.entries()) {
      const recentTimestamps = timestamps.filter(time => time > windowStart)
      if (recentTimestamps.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, recentTimestamps)
      }
    }
  }
}

// Create a global rate limiter instance
export const globalRateLimiter = new RateLimiter(15 * 60 * 1000, 100) // 15 minutes, 100 requests

export default {
  sanitizeString,
  sanitizeNumber,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeHtml,
  validateInput,
  sanitizeInput,
  validateAndSanitize,
  RateLimiter,
  globalRateLimiter,
  userMessageSchema,
  brokerFilterSchema,
  reviewSchema,
  tradingJournalSchema,
}
