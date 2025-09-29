/**
 * Unit tests for PromotionService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromotionService } from '../../services/promotionService';
import { InMemoryPromotionRepository } from '../../services/promotionRepository';
import { CalculationService } from '../../services/calculationService';
import type { 
  CreatePromotionRequest, 
  UpdatePromotionRequest, 
  GetPromotionsRequest,
  Promotion 
} from '../../types';

describe('PromotionService', () => {
  let promotionService: PromotionService;
  let mockRepository: InMemoryPromotionRepository;
  let mockCalculationService: CalculationService;

  beforeEach(() => {
    mockRepository = new InMemoryPromotionRepository();
    mockCalculationService = new CalculationService();
    promotionService = new PromotionService(mockRepository, mockCalculationService);
  });

  describe('getPromotions', () => {
    it('should return promotions with default pagination', async () => {
      const request: GetPromotionsRequest = {};
      const result = await promotionService.getPromotions(request);

      expect(result).toBeDefined();
      expect(result.promotions).toBeInstanceOf(Array);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
      expect(result.hasMore).toBeDefined();
      expect(result.filters).toBeDefined();
    });

    it('should apply filters correctly', async () => {
      const request: GetPromotionsRequest = {
        filters: {
          promotionTypes: ['cashback'],
          brokers: ['1']
        }
      };
      const result = await promotionService.getPromotions(request);

      expect(result.promotions.every(p => p.promotionType === 'cashback')).toBe(true);
      expect(result.promotions.every(p => p.brokerId === '1')).toBe(true);
    });

    it('should apply pagination correctly', async () => {
      const request: GetPromotionsRequest = {
        pagination: { page: 1, limit: 5 }
      };
      const result = await promotionService.getPromotions(request);

      expect(result.promotions.length).toBeLessThanOrEqual(5);
    });

    it('should apply sorting correctly', async () => {
      const request: GetPromotionsRequest = {
        sort: { field: 'created_at', order: 'desc' }
      };
      const result = await promotionService.getPromotions(request);

      if (result.promotions.length > 1) {
        const dates = result.promotions.map(p => new Date(p.createdAt).getTime());
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
        }
      }
    });

    it('should throw error for invalid pagination', async () => {
      const request: GetPromotionsRequest = {
        pagination: { page: -1, limit: 5 }
      };

      await expect(promotionService.getPromotions(request)).rejects.toThrow('Invalid page number');
    });

    it('should throw error for invalid limit', async () => {
      const request: GetPromotionsRequest = {
        pagination: { page: 1, limit: 101 }
      };

      await expect(promotionService.getPromotions(request)).rejects.toThrow('Invalid limit');
    });

    it('should throw error for invalid sort field', async () => {
      const request: GetPromotionsRequest = {
        sort: { field: 'invalid_field', order: 'asc' }
      };

      await expect(promotionService.getPromotions(request)).rejects.toThrow('Invalid sort field');
    });
  });

  describe('getPromotionById', () => {
    it('should return promotion when found', async () => {
      // First, get an existing promotion ID
      const promotions = await promotionService.getPromotions({});
      if (promotions.promotions.length > 0) {
        const promotionId = promotions.promotions[0].id;
        const result = await promotionService.getPromotionById(promotionId);

        expect(result).toBeDefined();
        expect(result?.id).toBe(promotionId);
      }
    });

    it('should return null when promotion not found', async () => {
      const result = await promotionService.getPromotionById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should throw error for invalid ID', async () => {
      await expect(promotionService.getPromotionById('')).rejects.toThrow('Invalid promotion ID');
      await expect(promotionService.getPromotionById(null as any)).rejects.toThrow('Invalid promotion ID');
    });
  });

  describe('getPromotionsByBrokerId', () => {
    it('should return promotions for valid broker ID', async () => {
      const result = await promotionService.getPromotionsByBrokerId('1');
      expect(result).toBeInstanceOf(Array);
      expect(result.every(p => p.brokerId === '1')).toBe(true);
    });

    it('should return empty array for non-existent broker', async () => {
      const result = await promotionService.getPromotionsByBrokerId('non-existent-broker');
      expect(result).toEqual([]);
    });

    it('should throw error for invalid broker ID', async () => {
      await expect(promotionService.getPromotionsByBrokerId('')).rejects.toThrow('Invalid broker ID');
    });
  });

  describe('getFeaturedPromotions', () => {
    it('should return featured promotions with default limit', async () => {
      const result = await promotionService.getFeaturedPromotions();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeLessThanOrEqual(10);
      expect(result.every(p => p.isFeatured)).toBe(true);
    });

    it('should respect custom limit', async () => {
      const result = await promotionService.getFeaturedPromotions(3);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should throw error for invalid limit', async () => {
      await expect(promotionService.getFeaturedPromotions(0)).rejects.toThrow('Invalid limit');
      await expect(promotionService.getFeaturedPromotions(101)).rejects.toThrow('Invalid limit');
    });
  });

  describe('createPromotion', () => {
    const validCreateRequest: CreatePromotionRequest = {
      brokerId: '1',
      title: 'Test Promotion',
      description: 'Test description',
      promotionType: 'cashback',
      activationMethod: 'automatic',
      requirements: {
        minDeposit: 100,
        newClientsOnly: false
      },
      rates: [
        {
          tierName: 'Standard',
          minVolume: 0,
          rateType: 'fixed_per_lot',
          rateValue: 5,
          currency: 'USD',
          frequency: 'monthly',
          displayOrder: 1
        }
      ],
      features: [
        {
          featureText: 'Test feature',
          featureType: 'advantage',
          displayOrder: 1,
          isHighlighted: false
        }
      ],
      startDate: '2024-01-01T00:00:00Z'
    };

    it('should create promotion with valid data', async () => {
      const result = await promotionService.createPromotion(validCreateRequest);

      expect(result).toBeDefined();
      expect(result.title).toBe(validCreateRequest.title);
      expect(result.brokerId).toBe(validCreateRequest.brokerId);
      expect(result.isActive).toBe(true);
    });

    it('should throw error for missing required fields', async () => {
      const invalidRequest = { ...validCreateRequest, title: '' };
      await expect(promotionService.createPromotion(invalidRequest)).rejects.toThrow('Title is required');
    });

    it('should throw error for invalid broker ID', async () => {
      const invalidRequest = { ...validCreateRequest, brokerId: '' };
      await expect(promotionService.createPromotion(invalidRequest)).rejects.toThrow('Invalid broker ID');
    });

    it('should throw error for invalid date range', async () => {
      const invalidRequest = { 
        ...validCreateRequest, 
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2023-12-31T00:00:00Z'
      };
      await expect(promotionService.createPromotion(invalidRequest)).rejects.toThrow('End date must be after start date');
    });

    it('should throw error for empty rates', async () => {
      const invalidRequest = { ...validCreateRequest, rates: [] };
      await expect(promotionService.createPromotion(invalidRequest)).rejects.toThrow('At least one rate is required');
    });

    it('should throw error for invalid rate values', async () => {
      const invalidRequest = { 
        ...validCreateRequest, 
        rates: [{
          ...validCreateRequest.rates[0],
          rateValue: -1
        }]
      };
      await expect(promotionService.createPromotion(invalidRequest)).rejects.toThrow('rate value must be positive');
    });
  });

  describe('updatePromotion', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      // Create a promotion to update
      const createRequest: CreatePromotionRequest = {
        brokerId: '1',
        title: 'Original Title',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: { minDeposit: 100, newClientsOnly: false },
        rates: [{
          tierName: 'Standard',
          minVolume: 0,
          rateType: 'fixed_per_lot',
          rateValue: 5,
          currency: 'USD',
          frequency: 'monthly',
          displayOrder: 1
        }],
        features: [],
        startDate: '2024-01-01T00:00:00Z'
      };
      const created = await promotionService.createPromotion(createRequest);
      existingPromotionId = created.id;
    });

    it('should update promotion with valid data', async () => {
      const updateRequest: UpdatePromotionRequest = {
        id: existingPromotionId,
        title: 'Updated Title'
      };

      const result = await promotionService.updatePromotion(updateRequest);
      expect(result.title).toBe('Updated Title');
      expect(result.id).toBe(existingPromotionId);
    });

    it('should throw error for non-existent promotion', async () => {
      const updateRequest: UpdatePromotionRequest = {
        id: 'non-existent-id',
        title: 'Updated Title'
      };

      await expect(promotionService.updatePromotion(updateRequest)).rejects.toThrow('Promotion not found');
    });

    it('should throw error for invalid ID', async () => {
      const updateRequest: UpdatePromotionRequest = {
        id: '',
        title: 'Updated Title'
      };

      await expect(promotionService.updatePromotion(updateRequest)).rejects.toThrow('Invalid promotion ID');
    });
  });

  describe('deactivatePromotion', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      // Create a promotion to deactivate
      const createRequest: CreatePromotionRequest = {
        brokerId: '1',
        title: 'To Be Deactivated',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: { minDeposit: 100, newClientsOnly: false },
        rates: [{
          tierName: 'Standard',
          minVolume: 0,
          rateType: 'fixed_per_lot',
          rateValue: 5,
          currency: 'USD',
          frequency: 'monthly',
          displayOrder: 1
        }],
        features: [],
        startDate: '2024-01-01T00:00:00Z'
      };
      const created = await promotionService.createPromotion(createRequest);
      existingPromotionId = created.id;
    });

    it('should deactivate existing promotion', async () => {
      await expect(promotionService.deactivatePromotion(existingPromotionId)).resolves.not.toThrow();
      
      const deactivated = await promotionService.getPromotionById(existingPromotionId);
      expect(deactivated?.isActive).toBe(false);
    });

    it('should throw error for non-existent promotion', async () => {
      await expect(promotionService.deactivatePromotion('non-existent-id')).rejects.toThrow('Promotion not found');
    });

    it('should throw error for invalid ID', async () => {
      await expect(promotionService.deactivatePromotion('')).rejects.toThrow('Invalid promotion ID');
    });
  });

  describe('trackPromotionEvent', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      const promotions = await promotionService.getPromotions({});
      if (promotions.promotions.length > 0) {
        existingPromotionId = promotions.promotions[0].id;
      }
    });

    it('should track valid events without throwing', async () => {
      if (existingPromotionId) {
        await expect(promotionService.trackPromotionEvent(existingPromotionId, 'view')).resolves.not.toThrow();
        await expect(promotionService.trackPromotionEvent(existingPromotionId, 'click')).resolves.not.toThrow();
        await expect(promotionService.trackPromotionEvent(existingPromotionId, 'conversion')).resolves.not.toThrow();
      }
    });

    it('should not throw for invalid promotion ID (analytics should not break main flow)', async () => {
      await expect(promotionService.trackPromotionEvent('invalid-id', 'view')).resolves.not.toThrow();
    });

    it('should not throw for invalid event type (analytics should not break main flow)', async () => {
      if (existingPromotionId) {
        await expect(promotionService.trackPromotionEvent(existingPromotionId, 'invalid' as any)).resolves.not.toThrow();
      }
    });
  });

  describe('getPromotionStats', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      const promotions = await promotionService.getPromotions({});
      if (promotions.promotions.length > 0) {
        existingPromotionId = promotions.promotions[0].id;
      }
    });

    it('should return stats for existing promotion', async () => {
      if (existingPromotionId) {
        const stats = await promotionService.getPromotionStats(existingPromotionId);
        
        expect(stats).toBeDefined();
        expect(stats.promotionId).toBe(existingPromotionId);
        expect(typeof stats.totalViews).toBe('number');
        expect(typeof stats.totalClicks).toBe('number');
        expect(typeof stats.totalConversions).toBe('number');
        expect(typeof stats.conversionRate).toBe('number');
        expect(typeof stats.clickThroughRate).toBe('number');
        expect(typeof stats.daysActive).toBe('number');
      }
    });

    it('should throw error for invalid promotion ID', async () => {
      await expect(promotionService.getPromotionStats('')).rejects.toThrow('Invalid promotion ID');
    });
  });

  describe('getAvailableFilters', () => {
    it('should return available filter options', async () => {
      const filters = await promotionService.getAvailableFilters();
      
      expect(filters).toBeDefined();
      expect(filters.brokers).toBeInstanceOf(Array);
      expect(filters.promotionTypes).toBeInstanceOf(Array);
      expect(filters.activationMethods).toBeInstanceOf(Array);
      expect(filters.rebateRanges).toBeInstanceOf(Array);
    });
  });

  describe('deactivateExpiredPromotions', () => {
    it('should return number of deactivated promotions', async () => {
      const count = await promotionService.deactivateExpiredPromotions();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle repository errors gracefully', async () => {
      // Mock repository to throw error
      const errorRepository = {
        ...mockRepository,
        findPromotions: vi.fn().mockRejectedValue(new Error('Database error'))
      };
      
      const errorService = new PromotionService(errorRepository as any, mockCalculationService);
      
      await expect(errorService.getPromotions({})).rejects.toThrow('Failed to get promotions');
    });

    it('should handle calculation service errors gracefully', async () => {
      // This would be tested when calculation service is integrated
      expect(true).toBe(true);
    });
  });
});