/**
 * Cache Service Tests
 * Tests for the multi-layer caching service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import cacheService, { type CacheOptions } from '../services/data/cacheService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('Basic Operations', () => {
    it('should set and get values', () => {
      cacheService.set('test-key', 'test-value');
      expect(cacheService.get('test-key')).toBe('test-value');
    });

    it('should handle different data types', () => {
      const testValues = [
        'string',
        123,
        { object: 'value' },
        [1, 2, 3],
        true,
        null
      ];

      testValues.forEach((value, index) => {
        const key = `test-${index}`;
        cacheService.set(key, value);
        expect(cacheService.get(key)).toEqual(value);
      });
    });

    it('should return null for non-existent keys', () => {
      expect(cacheService.get('non-existent')).toBeNull();
    });

    it('should delete values', () => {
      cacheService.set('test-key', 'test-value');
      expect(cacheService.get('test-key')).toBe('test-value');
      
      cacheService.delete('test-key');
      expect(cacheService.get('test-key')).toBeNull();
    });

    it('should clear all values', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      
      cacheService.clear();
      
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire entries after TTL', (done) => {
      cacheService.set('test-key', 'test-value', { ttl: 100 });
      
      expect(cacheService.get('test-key')).toBe('test-value');
      
      setTimeout(() => {
        expect(cacheService.get('test-key')).toBeNull();
        done();
      }, 150);
    });

    it('should not expire entries before TTL', () => {
      cacheService.set('test-key', 'test-value', { ttl: 5000 });
      
      expect(cacheService.get('test-key')).toBe('test-value');
    });

    it('should handle default TTL', () => {
      cacheService.set('test-key', 'test-value');
      
      // Should have default TTL (30 minutes)
      expect(cacheService.get('test-key')).toBe('test-value');
    });
  });

  describe('Persistence', () => {
    it('should persist values to localStorage', () => {
      cacheService.set('test-key', 'test-value', { persist: true });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cache:test-key',
        expect.stringContaining('test-value')
      );
    });

    it('should load persisted values on startup', () => {
      // Simulate pre-existing cache data
      const cachedData = {
        data: 'persisted-value',
        timestamp: Date.now(),
        ttl: 999999999 // Far future
      };
      
      localStorageMock.setItem('cache:test-key', JSON.stringify(cachedData));
      
      // Create new cache service instance
      const newCacheService = (cacheService as any).constructor();
      
      expect(newCacheService.get('test-key')).toBe('persisted-value');
    });

    it('should not persist values when persist is false', () => {
      cacheService.set('test-key', 'test-value', { persist: false });
      
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should delete from localStorage', () => {
      cacheService.set('test-key', 'test-value', { persist: true });
      cacheService.delete('test-key');
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cache:test-key');
    });
  });

  describe('Tag-based Invalidation', () => {
    it('should clear entries by tag', () => {
      cacheService.set('key1', 'value1', { tags: ['tag1'] });
      cacheService.set('key2', 'value2', { tags: ['tag1', 'tag2'] });
      cacheService.set('key3', 'value3', { tags: ['tag2'] });
      
      cacheService.clearByTag('tag1');
      
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
      expect(cacheService.get('key3')).toBe('value3'); // Should still exist
    });

    it('should handle entries without tags', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2', { tags: ['tag1'] });
      
      cacheService.clearByTag('tag1');
      
      expect(cacheService.get('key1')).toBe('value1'); // Should still exist
      expect(cacheService.get('key2')).toBeNull();
    });
  });

  describe('Statistics', () => {
    it('should return cache statistics', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      
      // Access key1 multiple times
      cacheService.get('key1');
      cacheService.get('key1');
      
      const stats = cacheService.getStats();
      
      expect(stats.memorySize).toBe(2);
      expect(stats.totalAccesses).toBeGreaterThan(0);
      expect(stats.hitRate).toBeGreaterThanOrEqual(0);
      expect(stats.hitRate).toBeLessThanOrEqual(1);
    });

    it('should track access counts', () => {
      cacheService.set('test-key', 'test-value');
      
      cacheService.get('test-key');
      cacheService.get('test-key');
      cacheService.get('test-key');
      
      const stats = cacheService.getStats();
      expect(stats.totalAccesses).toBeGreaterThan(2);
    });
  });

  describe('Cache Key Generation', () => {
    it('should create cache keys from parameters', () => {
      const key1 = cacheService.createKey('users', '123', 'profile');
      const key2 = cacheService.createKey('users', '456', 'profile');
      
      expect(key1).toBe('users:123:profile');
      expect(key2).toBe('users:456:profile');
      expect(key1).not.toBe(key2);
    });

    it('should handle numbers in key generation', () => {
      const key = cacheService.createKey('api', 'users', 123, 'details');
      expect(key).toBe('api:users:123:details');
    });
  });

  describe('Preload Functionality', () => {
    it('should preload data into cache', async () => {
      const mockDataLoader = vi.fn().mockResolvedValue('preloaded-value');
      
      const result = await cacheService.preload('preload-key', mockDataLoader);
      
      expect(result).toBe('preloaded-value');
      expect(cacheService.get('preload-key')).toBe('preloaded-value');
      expect(mockDataLoader).toHaveBeenCalledTimes(1);
    });

    it('should return cached value if already exists', async () => {
      cacheService.set('preload-key', 'cached-value');
      const mockDataLoader = vi.fn().mockResolvedValue('new-value');
      
      const result = await cacheService.preload('preload-key', mockDataLoader);
      
      expect(result).toBe('cached-value');
      expect(mockDataLoader).not.toHaveBeenCalled();
    });

    it('should handle preload errors', async () => {
      const mockDataLoader = vi.fn().mockRejectedValue(new Error('Load failed'));
      
      await expect(cacheService.preload('preload-key', mockDataLoader))
        .rejects.toThrow('Load failed');
      
      expect(cacheService.get('preload-key')).toBeNull();
    });
  });

  describe('Warmup Functionality', () => {
    it('should warmup multiple keys', async () => {
      const mockDataLoader = vi.fn((key) => Promise.resolve(`data-${key}`));
      
      await cacheService.warmup(['key1', 'key2', 'key3'], mockDataLoader);
      
      expect(cacheService.get('key1')).toBe('data-key1');
      expect(cacheService.get('key2')).toBe('data-key2');
      expect(cacheService.get('key3')).toBe('data-key3');
      
      expect(mockDataLoader).toHaveBeenCalledTimes(3);
    });

    it('should skip warmup for keys that already exist', async () => {
      cacheService.set('key1', 'existing-value');
      const mockDataLoader = vi.fn((key) => Promise.resolve(`data-${key}`));
      
      await cacheService.warmup(['key1', 'key2'], mockDataLoader);
      
      expect(cacheService.get('key1')).toBe('existing-value');
      expect(cacheService.get('key2')).toBe('data-key2');
      
      expect(mockDataLoader).toHaveBeenCalledTimes(1);
      expect(mockDataLoader).toHaveBeenCalledWith('key2');
    });

    it('should handle warmup errors gracefully', async () => {
      const mockDataLoader = vi.fn((key) => {
        if (key === 'error-key') {
          return Promise.reject(new Error('Load failed'));
        }
        return Promise.resolve(`data-${key}`);
      });
      
      await cacheService.warmup(['good-key', 'error-key'], mockDataLoader);
      
      expect(cacheService.get('good-key')).toBe('data-good-key');
      expect(cacheService.get('error-key')).toBeNull();
    });
  });

  describe('Has Method', () => {
    it('should return true for existing keys', () => {
      cacheService.set('test-key', 'test-value');
      expect(cacheService.has('test-key')).toBe(true);
    });

    it('should return false for non-existing keys', () => {
      expect(cacheService.has('non-existent')).toBe(false);
    });

    it('should return false for expired keys', (done) => {
      cacheService.set('test-key', 'test-value', { ttl: 50 });
      
      setTimeout(() => {
        expect(cacheService.has('test-key')).toBe(false);
        done();
      }, 100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle large data sets', () => {
      const largeData = new Array(1000).fill(0).map((_, i) => ({ id: i, name: `item-${i}` }));
      
      cacheService.set('large-data', largeData);
      const retrieved = cacheService.get('large-data');
      
      expect(retrieved).toEqual(largeData);
    });

    it('should handle circular references gracefully', () => {
      const obj: any = { name: 'test' };
      obj.self = obj;
      
      expect(() => cacheService.set('circular', obj)).not.toThrow();
    });

    it('should handle special characters in keys', () => {
      const specialKeys = ['test:key', 'test/key', 'test?key', 'test key', 'test.key'];
      
      specialKeys.forEach(key => {
        expect(() => {
          cacheService.set(key, 'value');
          expect(cacheService.get(key)).toBe('value');
        }).not.toThrow();
      });
    });
  });
});
