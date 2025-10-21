/**
 * Secure API Service Tests
 * Tests for the secure API proxy service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { secureApiService } from '../../services/secureApiService';
import { globalRateLimiter } from '../../utils/validation';

// Mock fetch API
global.fetch = vi.fn();

describe('SecureApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset rate limiter
    vi.spyOn(globalRateLimiter, 'isAllowed').mockReturnValue(true);
  });

  describe('healthCheck', () => {
    it('should return true when health check succeeds', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ status: 'OK' })
      };
      (fetch as any).mockResolvedValue(mockResponse);

      const result = await secureApiService.healthCheck();
      expect(result).toBe(true);
    });

    it('should return false when health check fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      };
      (fetch as any).mockResolvedValue(mockResponse);

      const result = await secureApiService.healthCheck();
      expect(result).toBe(false);
    });

    it('should return false when fetch throws error', async () => {
      (fetch as any).mockRejectedValue(new Error('Network error'));

      const result = await secureApiService.healthCheck();
      expect(result).toBe(false);
    });
  });

  describe('sendChatbotMessage', () => {
    const validMessage = 'Hello, I need help with forex trading';
    const brokerContext = 'ECN brokers with low spreads';

    it('should send message to chatbot API', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          success: true,
          response: 'Hello! I can help you with forex trading...'
        })
      };
      (fetch as any).mockResolvedValue(mockResponse);

      const result = await secureApiService.sendChatbotMessage(validMessage, brokerContext);
      
      expect(result).toBe('Hello! I can help you with forex trading...');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/chatbot',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: validMessage,
            brokerContext: brokerContext
          })
        })
      );
    });

    it('should validate and sanitize input', async () => {
      const maliciousMessage = '<script>alert("xss")</script>Hello';
      
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          response: 'Response'
        })
      });

      const result = await secureApiService.sendChatbotMessage(maliciousMessage);
      
      // Should have removed script tags
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({
            message: 'alertxssHello',
            brokerContext: ''
          })
        })
      );
    });

    it('should handle rate limiting', async () => {
      vi.spyOn(globalRateLimiter, 'isAllowed').mockReturnValue(false);

      await expect(secureApiService.sendChatbotMessage(validMessage))
        .rejects.toThrow('Too many requests');
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: 'Service unavailable'
        })
      };
      (fetch as any).mockResolvedValue(mockResponse);

      await expect(secureApiService.sendChatbotMessage(validMessage))
        .rejects.toThrow('Failed to get chatbot response');
    });

    it('should handle network errors', async () => {
      (fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(secureApiService.sendChatbotMessage(validMessage))
        .rejects.toThrow('Unable to process your request');
    });
  });

  describe('getBrokerRecommendations', () => {
    it('should get broker recommendations', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          success: true,
          recommendations: 'Recommended brokers...'
        })
      };
      (fetch as any).mockResolvedValue(mockResponse);

      const preferences = {
        tradingStyle: 'scalping',
        experienceLevel: 'advanced',
        initialDeposit: 10000
      };

      const result = await secureApiService.getBrokerRecommendations(
        preferences,
        'scalping',
        'advanced',
        '$10,000',
        'US'
      );
      
      expect(result).toBe('Recommended brokers...');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/broker-matcher',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            preferences,
            tradingStyle: 'scalping',
            experience: 'advanced',
            budget: '$10,000',
            region: 'US'
          })
        })
      );
    });

    it('should handle empty preferences', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          success: true,
          recommendations: 'Default recommendations...'
        })
      };
      (fetch as any).mockResolvedValue(mockResponse);

      const result = await secureApiService.getBrokerRecommendations({});
      
      expect(result).toBe('Default recommendations...');
    });
  });

  describe('request method', () => {
    it('should handle JSON response', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true, data: 'test' })
      };
      (fetch as any).mockResolvedValue(mockResponse);

      const result = await (secureApiService as any).request('/test', {
        method: 'GET'
      });
      
      expect(await result.json()).toEqual({ success: true, data: 'test' });
    });

    it('should throw on non-OK response', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' })
      };
      (fetch as any).mockResolvedValue(mockResponse);

      await expect((secureApiService as any).request('/test'))
        .rejects.toThrow('HTTP 404: Not Found');
    });

    it('should throw on network error', async () => {
      (fetch as any).mockRejectedValue(new Error('Network error'));

      await expect((secureApiService as any).request('/test'))
        .rejects.toThrow('Network error');
    });
  });

  describe('getClientIdentifier', () => {
    it('should generate consistent identifier', () => {
      const service = (secureApiService as any);
      const id1 = service.getClientIdentifier();
      const id2 = service.getClientIdentifier();
      
      expect(id1).toBe(id2);
    });

    it('should use session storage when available', () => {
      const mockGetItem = vi.fn();
      const mockSetItem = vi.fn();
      
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: mockGetItem,
          setItem: mockSetItem
        },
        writable: true
      });

      mockGetItem.mockReturnValue('session-id-123');
      
      const service = (secureApiService as any);
      const id = service.getClientIdentifier();
      
      expect(id).toBe('session-id-123');
    });
  });
});
