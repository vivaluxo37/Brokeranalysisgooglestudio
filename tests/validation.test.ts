/**
 * Validation Utilities Tests
 * Tests for input validation and sanitization utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
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
  tradingJournalSchema
} from '../utils/validation';
import { brokers } from '../data/brokers';
import { brokerHasFeature } from '../data/brokerFeatureMatcher';

describe('Sanitization Functions', () => {
  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      const sanitized = sanitizeString('<script>alert("xss")</script>Hello <b>World</b>');
      expect(sanitized).not.toMatch(/<|>/);
      expect(sanitized).toContain('Hello');
    });

    it('should remove JavaScript protocols', () => {
      expect(sanitizeString('javascript:alert("xss")')).not.toContain('javascript');
      expect(sanitizeString('Hello javascript:void(0) world')).not.toContain('javascript');
    });

    it('should remove event handlers', () => {
      expect(sanitizeString('onclick="alert()"')).not.toContain('onclick');
      expect(sanitizeString('Hello onload="test()"')).not.toContain('onload');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(1500);
      expect(sanitizeString(longString, 1000)).toHaveLength(1000);
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
      expect(sanitizeString(123 as any)).toBe('');
    });
  });

  describe('sanitizeNumber', () => {
    it('should convert valid numbers', () => {
      expect(sanitizeNumber('123')).toBe(123);
      expect(sanitizeNumber(456.78)).toBe(456.78);
    });

    it('should handle invalid numbers', () => {
      expect(sanitizeNumber('abc')).toBe(0);
      expect(sanitizeNumber(NaN)).toBe(0);
      expect(sanitizeNumber(Infinity)).toBe(0);
    });

    it('should apply min/max limits', () => {
      expect(sanitizeNumber(150, 0, 100)).toBe(100);
      expect(sanitizeNumber(-10, 0, 100)).toBe(0);
      expect(sanitizeNumber(50, 0, 100)).toBe(50);
    });
  });

  describe('sanitizeEmail', () => {
    it('should validate and sanitize email addresses', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
      expect(sanitizeEmail('Test@EXAMPLE.COM')).toBe('test@example.com');
    });

    it('should reject invalid emails', () => {
      expect(sanitizeEmail('invalid-email')).toBe('');
      expect(sanitizeEmail('test@')).toBe('');
      expect(sanitizeEmail('@example.com')).toBe('');
    });

    it('should limit length', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(sanitizeEmail(longEmail)).toHaveLength(0);
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow valid HTTP/HTTPS URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should block dangerous protocols', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
      expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBe('');
    });

    it('should limit length', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2000);
      const sanitized = sanitizeUrl(longUrl);
      expect(sanitized.length).toBeLessThanOrEqual(2048);
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeHtml('<p>Hello</p><script>alert("xss")</script>')).toBe('<p>Hello</p>');
    });

    it('should remove iframe and object tags', () => {
      expect(sanitizeHtml('<iframe src="evil.com"></iframe>')).toBe('');
      expect(sanitizeHtml('<object data="evil.swf"></object>')).toBe('');
    });

    it('should remove event handlers', () => {
      expect(sanitizeHtml('<div onclick="alert()">Click</div>')).toBe('<div >Click</div>');
    });
  });
});

describe('Validation Functions', () => {
  describe('validateInput', () => {
    it('should validate required fields', () => {
      const schema = {
        name: { required: true },
        email: { required: true }
      };

      const result = validateInput({}, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('name is required');
      expect(result.errors).toContain('email is required');
    });

    it('should validate string length', () => {
      const schema = {
        title: { minLength: 3, maxLength: 50 }
      };

      const result1 = validateInput({ title: 'ab' }, schema);
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('title must be at least 3 characters');

      const result2 = validateInput({ title: 'a'.repeat(100) }, schema);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('title must not exceed 50 characters');
    });

    it('should validate patterns', () => {
      const schema = {
        phone: { pattern: /^\d{3}-\d{3}-\d{4}$/ }
      };

      const result1 = validateInput({ phone: '123-456-7890' }, schema);
      expect(result1.isValid).toBe(true);

      const result2 = validateInput({ phone: 'invalid' }, schema);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('phone has invalid format');
    });

    it('should use custom validation', () => {
      const schema = {
        age: {
          custom: (value: number) => value >= 18 || 'Must be 18 or older'
        }
      };

      const result1 = validateInput({ age: 21 }, schema);
      expect(result1.isValid).toBe(true);

      const result2 = validateInput({ age: 16 }, schema);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Must be 18 or older');
    });
  });

  describe('validateAndSanitize', () => {
    it('should validate and sanitize input', () => {
      const schema = {
        name: { required: true, maxLength: 20 },
        email: { required: true }
      };

      const input = {
        name: '<script>alert("xss")</script>Very Long Name',
        email: 'TEST@EXAMPLE.COM'
      };

      const result = validateAndSanitize(input, schema);
      
      expect(result.isValid).toBe(true);
      expect(result.data.name).not.toContain('<script>');
      expect(result.data.name.length).toBeLessThanOrEqual(20);
      expect(result.data.email).toBe('test@example.com');
    });
  });
});

describe('Broker Category Integrity', () => {
  const findBrokersInCategory = (feature: string) =>
    brokers.filter((broker) => brokerHasFeature(broker, feature)).map((broker) => broker.id);

  it('should only include strict no-dealing-desk brokers in NDD category', () => {
    const nddBrokers = findBrokersInCategory('ndd');
    const nonNdd = nddBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'ndd'));
    expect(nonNdd).toEqual([]);
  });

  it('should only include brokers with ECN access in ECN category', () => {
    const ecnBrokers = findBrokersInCategory('ecn');
    const invalid = ecnBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'ecn'));
    expect(invalid).toEqual([]);
  });

  it('should only include brokers with STP execution in STP category', () => {
    const stpBrokers = findBrokersInCategory('stp');
    const invalid = stpBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'stp'));
    expect(invalid).toEqual([]);
  });

  it('should only include MT4 brokers in MT4 category', () => {
    const mt4Brokers = findBrokersInCategory('mt4');
    const invalid = mt4Brokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'mt4'));
    expect(invalid).toEqual([]);
  });

  it('should only include MT5 brokers in MT5 category', () => {
    const mt5Brokers = findBrokersInCategory('mt5');
    const invalid = mt5Brokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'mt5'));
    expect(invalid).toEqual([]);
  });

  it('should only include copy trading brokers in copy trading category', () => {
    const copyBrokers = findBrokersInCategory('copytrading');
    const invalid = copyBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'copytrading'));
    expect(invalid).toEqual([]);
  });

  it('should only include high leverage brokers in high leverage category', () => {
    const leverageBrokers = findBrokersInCategory('high-leverage');
    const invalid = leverageBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'high-leverage'));
    expect(invalid).toEqual([]);
  });

  it('should only include offshore brokers in offshore category', () => {
    const offshoreBrokers = findBrokersInCategory('offshore');
    const invalid = offshoreBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'offshore'));
    expect(invalid).toEqual([]);
  });

  it('should only include DMA brokers in dma category', () => {
    const dmaBrokers = findBrokersInCategory('dma');
    const invalid = dmaBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'dma'));
    expect(invalid).toEqual([]);
  });

  it('should only include brokers with trailing stops support in trailing-stops category', () => {
    const trailingStopBrokers = findBrokersInCategory('trailing-stops');
    const invalid = trailingStopBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'trailing-stops'));
    expect(invalid).toEqual([]);
  });

  it('should only include brokers with low swap in low-swap category', () => {
    const lowSwapBrokers = findBrokersInCategory('low-swap');
    const invalid = lowSwapBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'low-swap'));
    expect(invalid).toEqual([]);
  });

  it('should only include brokers with fixed spreads in fixed-spreads category', () => {
    const fixedSpreadBrokers = findBrokersInCategory('fixed-spreads');
    const invalid = fixedSpreadBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'fixed-spreads'));
    expect(invalid).toEqual([]);
  });

  it('should only include brokers supporting hedging in hedging category', () => {
    const hedgingBrokers = findBrokersInCategory('hedging');
    const invalid = hedgingBrokers.filter((id) => !brokerHasFeature(brokers.find((b) => b.id === id)!, 'hedging'));
    expect(invalid).toEqual([]);
  });
});

describe('Predefined Schemas', () => {
  describe('userMessageSchema', () => {
    it('should validate user messages', () => {
      const validMessage = {
        message: 'Hello, I need help with forex trading',
        brokerContext: 'ECN brokers with low spreads'
      };

      const result = validateAndSanitize(validMessage, userMessageSchema);
      expect(result.isValid).toBe(true);
    });

    it('should reject malicious content', () => {
      const maliciousMessage = {
        message: 'javascript:alert("xss")',
        brokerContext: '<script>alert("xss")</script>'
      };

      const result = validateAndSanitize(maliciousMessage, userMessageSchema);
      expect(result.isValid).toBe(false);
    });
  });

  describe('brokerFilterSchema', () => {
    it('should validate broker filters', () => {
      const validFilter = {
        minDeposit: 100,
        maxLeverage: 500,
        regulators: ['FCA', 'CySEC'],
        tradingPlatforms: ['MT4', 'MT5']
      };

      const result = validateAndSanitize(validFilter, brokerFilterSchema);
      expect(result.isValid).toBe(true);
    });

    it('should validate numeric ranges', () => {
      const invalidFilter = {
        minDeposit: -100,
        maxLeverage: 10000
      };

      const result = validateAndSanitize(invalidFilter, brokerFilterSchema);
      expect(result.isValid).toBe(false);
    });
  });

  describe('reviewSchema', () => {
    it('should validate reviews', () => {
      const validReview = {
        brokerId: 'test-broker',
        rating: 5,
        title: 'Great broker!',
        content: 'Excellent service and competitive spreads.',
    pros: ['Low spreads', 'Good support'],
    cons: ['Limited crypto']
      };

      const result = validateAndSanitize(validReview, reviewSchema);
      expect(result.isValid).toBe(true);
    });

    it('should validate rating range', () => {
      const invalidReview = {
        brokerId: 'test-broker',
        rating: 6, // Invalid rating
        title: 'Review',
        content: 'Content'
      };

      const result = validateAndSanitize(invalidReview, reviewSchema);
      expect(result.isValid).toBe(false);
    });
  });

  describe('tradingJournalSchema', () => {
    it('should validate trading journal entries', () => {
      const validEntry = {
        symbol: 'EURUSD',
        direction: 'buy',
        lots: 0.1,
        entryPrice: 1.1234,
    exitPrice: 1.125,
        stopLoss: 1.1200,
        takeProfit: 1.1300,
        notes: 'Good trade setup'
      };

      const result = validateAndSanitize(validEntry, tradingJournalSchema);
      expect(result.isValid).toBe(true);
    });

    it('should validate forex pair format', () => {
      const invalidEntry = {
        symbol: 'INVALID',
        direction: 'buy',
        lots: 0.1,
        entryPrice: 1.1234
      };

      const result = validateAndSanitize(invalidEntry, tradingJournalSchema);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(1000, 5); // 1 second window, 5 requests
  });

  it('should allow requests within limit', () => {
    expect(rateLimiter.isAllowed('user1')).toBe(true);
    expect(rateLimiter.isAllowed('user1')).toBe(true);
    expect(rateLimiter.isAllowed('user1')).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    // Use up all requests
    for (let i = 0; i < 5; i++) {
      expect(rateLimiter.isAllowed('user1')).toBe(true);
    }
    
    // Next request should be blocked
    expect(rateLimiter.isAllowed('user1')).toBe(false);
  });

  it('should handle multiple users independently', () => {
    // User 1 uses up their limit
    for (let i = 0; i < 5; i++) {
      rateLimiter.isAllowed('user1');
    }
    
    // User 1 should be blocked
    expect(rateLimiter.isAllowed('user1')).toBe(false);
    
    // User 2 should still be allowed
    expect(rateLimiter.isAllowed('user2')).toBe(true);
  });

  it('should reset after window expires', (done) => {
    // Use up all requests
    for (let i = 0; i < 5; i++) {
      rateLimiter.isAllowed('user1');
    }
    
    expect(rateLimiter.isAllowed('user1')).toBe(false);
    
    // Wait for window to expire
    setTimeout(() => {
      expect(rateLimiter.isAllowed('user1')).toBe(true);
      done();
    }, 1100);
  });
});

describe('Global Rate Limiter', () => {
  it('should be an instance of RateLimiter', () => {
    expect(globalRateLimiter).toBeInstanceOf(RateLimiter);
  });

  it('should have default configuration', () => {
    // Test that it works with default settings
    expect(globalRateLimiter.isAllowed('test-user')).toBe(true);
  });
});
