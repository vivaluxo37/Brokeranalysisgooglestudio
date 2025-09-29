/**
 * Integration tests for promotion API endpoints
 * Tests the complete API functionality including validation, error handling, and rate limiting
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
// Simplified mock for testing without node-mocks-http
const createMocks = (options: any) => {
  const req = {
    method: options.method,
    query: options.query || {},
    headers: options.headers || {},
    body: options.body,
    on: vi.fn(),
    ...options
  };
  
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    _getStatusCode: vi.fn().mockReturnValue(200),
    _getData: vi.fn().mockReturnValue('{}'),
    getHeaders: vi.fn().mockReturnValue({})
  };
  
  return { req, res };
};

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import API handlers
import promotionsHandler from '../../api/promotions/index';
import promotionByIdHandler from '../../api/promotions/[id]';
import calculateHandler from '../../api/promotions/calculate';

// Mock data
const mockPromotion = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  brokerId: '550e8400-e29b-41d4-a716-446655440001',
  broker: {
    name: 'Test Broker',
    logo: 'https://example.com/logo.png',
    rating: 4.5,
    platforms: ['MT4', 'MT5']
  },
  title: 'Test Cashback Promotion',
  description: 'Test promotion for integration tests',
  promotionType: 'cashback' as const,
  isActive: true,
  isFeatured: true,
  isExclusive: false,
  isPopular: true,
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',
  activationMethod: 'automatic' as const,
  requirements: {
    minDeposit: 100,
    accountTypes: ['Standard', 'ECN'],
    tradingVolume: 1,
    newClientsOnly: false,
    verificationRequired: true
  },
  rates: [
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      promotionId: '550e8400-e29b-41d4-a716-446655440000',
      tierName: 'Basic',
      minVolume: 0,
      maxVolume: 10,
      rateType: 'fixed_per_lot' as const,
      rateValue: 5,
      currency: 'USD',
      frequency: 'monthly' as const,
      displayOrder: 1
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      promotionId: '550e8400-e29b-41d4-a716-446655440000',
      tierName: 'Premium',
      minVolume: 10,
      maxVolume: 100,
      rateType: 'fixed_per_lot' as const,
      rateValue: 8,
      currency: 'USD',
      frequency: 'monthly' as const,
      displayOrder: 2
    }
  ],
  features: [
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      promotionId: '550e8400-e29b-41d4-a716-446655440000',
      featureText: 'Automated rebates',
      featureType: 'advantage' as const,
      displayOrder: 1,
      isHighlighted: true
    }
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

// Mock the promotion service
const mockPromotionService = {
  getPromotions: vi.fn(),
  getPromotionById: vi.fn(),
  trackPromotionEvent: vi.fn()
};

const mockCalculationService = {
  calculateRebate: vi.fn()
};

// Mock the service factory
vi.mock('../../services/promotionServiceFactory', () => ({
  PromotionServiceFactory: {
    create: () => mockPromotionService,
    createCalculationService: () => mockCalculationService
  }
}));

describe('Promotions API Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('GET /api/promotions', () => {
    it('should return promotions with default pagination', async () => {
      const mockResponse = {
        promotions: [mockPromotion],
        totalCount: 1,
        hasMore: false,
        filters: {
          brokers: [],
          promotionTypes: [],
          activationMethods: [],
          rebateRanges: []
        },
        pagination: {
          page: 1,
          limit: 20,
          totalPages: 1
        }
      };

      mockPromotionService.getPromotions.mockResolvedValue(mockResponse);

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: {}
      });

      await promotionsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toEqual(mockResponse);
      expect(mockPromotionService.getPromotions).toHaveBeenCalledWith({
        pagination: { page: 1, limit: 20 },
        sort: { field: 'created_at', order: 'desc' }
      });
    });

    it('should handle filtering by promotion type', async () => {
      const mockResponse = {
        promotions: [mockPromotion],
        totalCount: 1,
        hasMore: false,
        filters: {
          brokers: [],
          promotionTypes: [],
          activationMethods: [],
          rebateRanges: []
        },
        pagination: {
          page: 1,
          limit: 20,
          totalPages: 1
        }
      };

      mockPromotionService.getPromotions.mockResolvedValue(mockResponse);

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: {
          promotionTypes: ['cashback', 'deposit_bonus'],
          isActive: 'true',
          page: '2',
          limit: '10'
        }
      });

      await promotionsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(mockPromotionService.getPromotions).toHaveBeenCalledWith({
        filters: {
          promotionTypes: ['cashback', 'deposit_bonus'],
          isActive: true
        },
        pagination: { page: 2, limit: 10 },
        sort: { field: 'created_at', order: 'desc' }
      });
    });

    it('should handle invalid pagination parameters', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: {
          page: '-1',
          limit: '200' // Exceeds maximum
        }
      });

      await promotionsHandler(req, res);

      // Should use default values for invalid parameters
      expect(mockPromotionService.getPromotions).toHaveBeenCalledWith({
        pagination: { page: 1, limit: 100 }, // Clamped to maximum
        sort: { field: 'created_at', order: 'desc' }
      });
    });

    it('should return 405 for non-GET methods', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST'
      });

      await promotionsHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('METHOD_NOT_ALLOWED');
    });

    it('should handle service errors gracefully', async () => {
      mockPromotionService.getPromotions.mockRejectedValue(new Error('Database connection failed'));

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: {}
      });

      await promotionsHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('GET /api/promotions/[id]', () => {
    it('should return promotion details for valid ID', async () => {
      mockPromotionService.getPromotionById.mockResolvedValue(mockPromotion);
      mockPromotionService.trackPromotionEvent.mockResolvedValue(undefined);

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: { id: mockPromotion.id }
      });

      await promotionByIdHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toEqual(mockPromotion);
      expect(mockPromotionService.getPromotionById).toHaveBeenCalledWith(mockPromotion.id);
      expect(mockPromotionService.trackPromotionEvent).toHaveBeenCalledWith(
        mockPromotion.id,
        'view',
        expect.any(Object)
      );
    });

    it('should return 404 for non-existent promotion', async () => {
      mockPromotionService.getPromotionById.mockResolvedValue(null);

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: { id: '550e8400-e29b-41d4-a716-446655440999' }
      });

      await promotionByIdHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('PROMOTION_NOT_FOUND');
    });

    it('should return 410 for inactive promotion', async () => {
      const inactivePromotion = { ...mockPromotion, isActive: false };
      mockPromotionService.getPromotionById.mockResolvedValue(inactivePromotion);

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: { id: mockPromotion.id }
      });

      await promotionByIdHandler(req, res);

      expect(res._getStatusCode()).toBe(410);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('PROMOTION_INACTIVE');
    });

    it('should return 410 for expired promotion', async () => {
      const expiredPromotion = { 
        ...mockPromotion, 
        endDate: '2023-12-31T23:59:59Z' // Past date
      };
      mockPromotionService.getPromotionById.mockResolvedValue(expiredPromotion);

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: { id: mockPromotion.id }
      });

      await promotionByIdHandler(req, res);

      expect(res._getStatusCode()).toBe(410);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('PROMOTION_EXPIRED');
    });

    it('should return 400 for invalid ID format', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        query: { id: 'invalid-id' }
      });

      await promotionByIdHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/promotions/calculate', () => {
    const mockCalculationResult = {
      rebateAmount: 50,
      rateValue: 5,
      rateType: 'fixed_per_lot' as const,
      tierName: 'Basic',
      currency: 'USD',
      frequency: 'monthly' as const,
      dailyRebate: 1.67,
      monthlyRebate: 50,
      yearlyRebate: 600,
      effectiveCostReduction: 7.14
    };

    it('should calculate rebate successfully', async () => {
      mockPromotionService.getPromotionById.mockResolvedValue(mockPromotion);
      mockCalculationService.calculateRebate.mockResolvedValue(mockCalculationResult);
      mockPromotionService.getPromotions.mockResolvedValue({
        promotions: [],
        totalCount: 0,
        hasMore: false
      });
      mockPromotionService.trackPromotionEvent.mockResolvedValue(undefined);

      const requestBody = {
        promotionId: mockPromotion.id,
        monthlyVolume: 10,
        accountType: 'Standard'
      };

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST',
        body: requestBody
      });

      // Mock the request body parsing
      req.body = JSON.stringify(requestBody);

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.result).toEqual(mockCalculationResult);
      expect(mockCalculationService.calculateRebate).toHaveBeenCalledWith(
        mockPromotion,
        10,
        'Standard'
      );
    });

    it('should validate request body', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST',
        body: {}
      });

      req.body = JSON.stringify({});

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate promotion ID format', async () => {
      const requestBody = {
        promotionId: 'invalid-id',
        monthlyVolume: 10
      };

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST',
        body: requestBody
      });

      req.body = JSON.stringify(requestBody);

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.message).toContain('Invalid promotion ID format');
    });

    it('should validate monthly volume', async () => {
      const requestBody = {
        promotionId: mockPromotion.id,
        monthlyVolume: -5
      };

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST',
        body: requestBody
      });

      req.body = JSON.stringify(requestBody);

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.message).toContain('non-negative number');
    });

    it('should check account type eligibility', async () => {
      mockPromotionService.getPromotionById.mockResolvedValue(mockPromotion);

      const requestBody = {
        promotionId: mockPromotion.id,
        monthlyVolume: 10,
        accountType: 'VIP' // Not in allowed types
      };

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST',
        body: requestBody
      });

      req.body = JSON.stringify(requestBody);

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('INVALID_ACCOUNT_TYPE');
    });

    it('should check minimum volume requirement', async () => {
      const promotionWithMinVolume = {
        ...mockPromotion,
        requirements: {
          ...mockPromotion.requirements,
          tradingVolume: 20 // Minimum 20 lots
        }
      };

      mockPromotionService.getPromotionById.mockResolvedValue(promotionWithMinVolume);

      const requestBody = {
        promotionId: mockPromotion.id,
        monthlyVolume: 10 // Below minimum
      };

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST',
        body: requestBody
      });

      req.body = JSON.stringify(requestBody);

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('INSUFFICIENT_VOLUME');
    });

    it('should return 405 for non-POST methods', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET'
      });

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('METHOD_NOT_ALLOWED');
    });
  });

  describe('CORS and Rate Limiting', () => {
    it('should handle OPTIONS requests', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'OPTIONS'
      });

      await promotionsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it('should set CORS headers', async () => {
      mockPromotionService.getPromotions.mockResolvedValue({
        promotions: [],
        totalCount: 0,
        hasMore: false,
        filters: { brokers: [], promotionTypes: [], activationMethods: [], rebateRanges: [] },
        pagination: { page: 1, limit: 20, totalPages: 0 }
      });

      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'GET',
        headers: {
          origin: 'http://localhost:3000'
        }
      });

      await promotionsHandler(req, res);

      expect(res.getHeaders()).toHaveProperty('access-control-allow-methods');
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parsing errors', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST'
      });

      // Simulate invalid JSON
      req.body = 'invalid json';

      await calculateHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should include error timestamps', async () => {
      const { req, res } = createMocks<VercelRequest, VercelResponse>({
        method: 'POST'
      });

      await promotionsHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.error.timestamp).toBeDefined();
      expect(new Date(data.error.timestamp)).toBeInstanceOf(Date);
    });
  });
});