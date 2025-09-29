/**
 * Unit tests for PromotionRepository
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryPromotionRepository } from '../../services/promotionRepository';
import type { 
  CreatePromotionRequest, 
  UpdatePromotionRequest, 
  GetPromotionsRequest,
  Promotion 
} from '../../types';

describe('InMemoryPromotionRepository', () => {
  let repository: InMemoryPromotionRepository;

  beforeEach(() => {
    repository = new InMemoryPromotionRepository();
  });

  describe('findPromotions', () => {
    it('should return all promotions with default parameters', async () => {
      const request: GetPromotionsRequest = {};
      const result = await repository.findPromotions(request);

      expect(result).toBeDefined();
      expect(result.promotions).toBeInstanceOf(Array);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
      expect(result.hasMore).toBeDefined();
      expect(result.filters).toBeDefined();
    });

    it('should apply broker filter correctly', async () => {
      const request: GetPromotionsRequest = {
        filters: { brokers: ['1'] }
      };
      const result = await repository.findPromotions(request);

      expect(result.promotions.every(p => p.brokerId === '1')).toBe(true);
    });

    it('should apply promotion type filter correctly', async () => {
      const request: GetPromotionsRequest = {
        filters: { promotionTypes: ['cashback'] }
      };
      const result = await repository.findPromotions(request);

      expect(result.promotions.every(p => p.promotionType === 'cashback')).toBe(true);
    });

    it('should apply activation method filter correctly', async () => {
      const request: GetPromotionsRequest = {
        filters: { activationMethod: ['automatic'] }
      };
      const result = await repository.findPromotions(request);

      expect(result.promotions.every(p => p.activationMethod === 'automatic')).toBe(true);
    });

    it('should apply rebate range filter correctly', async () => {
      const request: GetPromotionsRequest = {
        filters: { 
          rebateRange: { min: 5, max: 20 }
        }
      };
      const result = await repository.findPromotions(request);

      result.promotions.forEach(promotion => {
        if (promotion.rates && promotion.rates.length > 0) {
          const maxRate = Math.max(...promotion.rates.map(r => r.rateValue));
          expect(maxRate).toBeGreaterThanOrEqual(5);
          expect(maxRate).toBeLessThanOrEqual(20);
        }
      });
    });

    it('should apply multiple filters correctly', async () => {
      const request: GetPromotionsRequest = {
        filters: {
          brokers: ['1'],
          promotionTypes: ['cashback'],
          activationMethod: ['automatic']
        }
      };
      const result = await repository.findPromotions(request);

      result.promotions.forEach(promotion => {
        expect(promotion.brokerId).toBe('1');
        expect(promotion.promotionType).toBe('cashback');
        expect(promotion.activationMethod).toBe('automatic');
      });
    });

    it('should apply sorting by rating correctly', async () => {
      const request: GetPromotionsRequest = {
        sort: { field: 'rating', order: 'desc' }
      };
      const result = await repository.findPromotions(request);

      if (result.promotions.length > 1) {
        for (let i = 1; i < result.promotions.length; i++) {
          const prevRating = result.promotions[i - 1].broker?.rating || 0;
          const currentRating = result.promotions[i].broker?.rating || 0;
          expect(currentRating).toBeLessThanOrEqual(prevRating);
        }
      }
    });

    it('should apply sorting by rebate amount correctly', async () => {
      const request: GetPromotionsRequest = {
        sort: { field: 'rebate_amount', order: 'desc' }
      };
      const result = await repository.findPromotions(request);

      if (result.promotions.length > 1) {
        for (let i = 1; i < result.promotions.length; i++) {
          const prevMax = result.promotions[i - 1].rates ? 
            Math.max(...result.promotions[i - 1].rates!.map(r => r.rateValue)) : 0;
          const currentMax = result.promotions[i].rates ? 
            Math.max(...result.promotions[i].rates!.map(r => r.rateValue)) : 0;
          expect(currentMax).toBeLessThanOrEqual(prevMax);
        }
      }
    });

    it('should apply pagination correctly', async () => {
      const request: GetPromotionsRequest = {
        pagination: { page: 1, limit: 2 }
      };
      const result = await repository.findPromotions(request);

      expect(result.promotions.length).toBeLessThanOrEqual(2);
    });

    it('should calculate hasMore correctly', async () => {
      const request: GetPromotionsRequest = {
        pagination: { page: 1, limit: 1 }
      };
      const result = await repository.findPromotions(request);

      if (result.totalCount > 1) {
        expect(result.hasMore).toBe(true);
      } else {
        expect(result.hasMore).toBe(false);
      }
    });
  });

  describe('findById', () => {
    it('should return promotion when found', async () => {
      // Get existing promotion ID from sample data
      const allPromotions = await repository.findPromotions({});
      if (allPromotions.promotions.length > 0) {
        const promotionId = allPromotions.promotions[0].id;
        const result = await repository.findById(promotionId);

        expect(result).toBeDefined();
        expect(result?.id).toBe(promotionId);
      }
    });

    it('should return null when promotion not found', async () => {
      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('findByBrokerId', () => {
    it('should return promotions for existing broker', async () => {
      const result = await repository.findByBrokerId('1');
      expect(result).toBeInstanceOf(Array);
      expect(result.every(p => p.brokerId === '1')).toBe(true);
    });

    it('should return only active promotions when activeOnly is true', async () => {
      const result = await repository.findByBrokerId('1', true);
      expect(result.every(p => p.isActive)).toBe(true);
    });

    it('should return empty array for non-existent broker', async () => {
      const result = await repository.findByBrokerId('non-existent-broker');
      expect(result).toEqual([]);
    });
  });

  describe('findFeatured', () => {
    it('should return featured promotions', async () => {
      const result = await repository.findFeatured(10);
      expect(result).toBeInstanceOf(Array);
      expect(result.every(p => p.isFeatured && p.isActive)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should respect limit parameter', async () => {
      const result = await repository.findFeatured(2);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should return promotions sorted by creation date', async () => {
      const result = await repository.findFeatured(10);
      
      if (result.length > 1) {
        for (let i = 1; i < result.length; i++) {
          const prevDate = new Date(result[i - 1].createdAt).getTime();
          const currentDate = new Date(result[i].createdAt).getTime();
          expect(currentDate).toBeLessThanOrEqual(prevDate);
        }
      }
    });
  });

  describe('create', () => {
    const validCreateRequest: CreatePromotionRequest = {
      brokerId: '2',
      title: 'Test Promotion',
      description: 'Test description',
      promotionType: 'deposit_bonus',
      activationMethod: 'manual',
      requirements: {
        minDeposit: 200,
        newClientsOnly: true
      },
      rates: [
        {
          tierName: 'Bronze',
          minVolume: 0,
          maxVolume: 5,
          rateType: 'percentage',
          rateValue: 10,
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
          isHighlighted: true
        }
      ],
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z'
    };

    it('should create promotion with valid data', async () => {
      const result = await repository.create(validCreateRequest);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe(validCreateRequest.title);
      expect(result.brokerId).toBe(validCreateRequest.brokerId);
      expect(result.promotionType).toBe(validCreateRequest.promotionType);
      expect(result.isActive).toBe(true);
      expect(result.rates).toHaveLength(1);
      expect(result.features).toHaveLength(1);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should assign unique IDs to rates and features', async () => {
      const result = await repository.create(validCreateRequest);

      expect(result.rates?.[0].id).toBeDefined();
      expect(result.rates?.[0].promotionId).toBe(result.id);
      expect(result.features?.[0].id).toBeDefined();
      expect(result.features?.[0].promotionId).toBe(result.id);
    });

    it('should set default values correctly', async () => {
      const minimalRequest: CreatePromotionRequest = {
        brokerId: '2',
        title: 'Minimal Promotion',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: {},
        rates: [{
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

      const result = await repository.create(minimalRequest);

      expect(result.isActive).toBe(true);
      expect(result.isFeatured).toBe(false);
      expect(result.isExclusive).toBe(false);
      expect(result.isPopular).toBe(false);
    });
  });

  describe('update', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      const createRequest: CreatePromotionRequest = {
        brokerId: '2',
        title: 'Original Title',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: {},
        rates: [{
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
      const created = await repository.create(createRequest);
      existingPromotionId = created.id;
    });

    it('should update existing promotion', async () => {
      const before = await repository.findById(existingPromotionId);
      
      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const updateRequest: UpdatePromotionRequest = {
        id: existingPromotionId,
        title: 'Updated Title',
        description: 'Updated description'
      };

      const result = await repository.update(updateRequest);

      expect(result.id).toBe(existingPromotionId);
      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated description');
      expect(result.updatedAt).not.toBe(before?.createdAt);
    });

    it('should update rates when provided', async () => {
      const updateRequest: UpdatePromotionRequest = {
        id: existingPromotionId,
        rates: [
          {
            tierName: 'Updated Tier',
            minVolume: 0,
            rateType: 'fixed_per_lot',
            rateValue: 10,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 1
          }
        ]
      };

      const result = await repository.update(updateRequest);

      expect(result.rates).toHaveLength(1);
      expect(result.rates?.[0].tierName).toBe('Updated Tier');
      expect(result.rates?.[0].rateValue).toBe(10);
    });

    it('should update features when provided', async () => {
      const updateRequest: UpdatePromotionRequest = {
        id: existingPromotionId,
        features: [
          {
            featureText: 'Updated feature',
            featureType: 'requirement',
            displayOrder: 1,
            isHighlighted: false
          }
        ]
      };

      const result = await repository.update(updateRequest);

      expect(result.features).toHaveLength(1);
      expect(result.features?.[0].featureText).toBe('Updated feature');
      expect(result.features?.[0].featureType).toBe('requirement');
    });

    it('should throw error for non-existent promotion', async () => {
      const updateRequest: UpdatePromotionRequest = {
        id: 'non-existent-id',
        title: 'Updated Title'
      };

      await expect(repository.update(updateRequest)).rejects.toThrow('Promotion not found');
    });
  });

  describe('deactivate', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      const createRequest: CreatePromotionRequest = {
        brokerId: '2',
        title: 'To Be Deactivated',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: {},
        rates: [{
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
      const created = await repository.create(createRequest);
      existingPromotionId = created.id;
    });

    it('should deactivate existing promotion', async () => {
      await repository.deactivate(existingPromotionId);
      
      const deactivated = await repository.findById(existingPromotionId);
      expect(deactivated?.isActive).toBe(false);
    });

    it('should update the updatedAt timestamp', async () => {
      const before = await repository.findById(existingPromotionId);
      const beforeTime = before ? new Date(before.updatedAt).getTime() : 0;
      
      // Add a delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 50));
      
      await repository.deactivate(existingPromotionId);
      const after = await repository.findById(existingPromotionId);
      const afterTime = after ? new Date(after.updatedAt).getTime() : 0;

      expect(afterTime).toBeGreaterThan(beforeTime);
    });

    it('should throw error for non-existent promotion', async () => {
      await expect(repository.deactivate('non-existent-id')).rejects.toThrow('Promotion not found');
    });
  });

  describe('trackEvent', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      const allPromotions = await repository.findPromotions({});
      if (allPromotions.promotions.length > 0) {
        existingPromotionId = allPromotions.promotions[0].id;
      }
    });

    it('should track view events', async () => {
      if (existingPromotionId) {
        await repository.trackEvent(existingPromotionId, 'view');
        
        const stats = await repository.getStats(existingPromotionId);
        expect(stats.totalViews).toBeGreaterThan(0);
      }
    });

    it('should track click events', async () => {
      if (existingPromotionId) {
        await repository.trackEvent(existingPromotionId, 'click');
        
        const stats = await repository.getStats(existingPromotionId);
        expect(stats.totalClicks).toBeGreaterThan(0);
      }
    });

    it('should track conversion events', async () => {
      if (existingPromotionId) {
        await repository.trackEvent(existingPromotionId, 'conversion');
        
        const stats = await repository.getStats(existingPromotionId);
        expect(stats.totalConversions).toBeGreaterThan(0);
      }
    });

    it('should handle multiple events for same promotion and date', async () => {
      if (existingPromotionId) {
        await repository.trackEvent(existingPromotionId, 'view');
        await repository.trackEvent(existingPromotionId, 'view');
        
        const stats = await repository.getStats(existingPromotionId);
        expect(stats.totalViews).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('getStats', () => {
    let existingPromotionId: string;

    beforeEach(async () => {
      const allPromotions = await repository.findPromotions({});
      if (allPromotions.promotions.length > 0) {
        existingPromotionId = allPromotions.promotions[0].id;
      }
    });

    it('should return stats for existing promotion', async () => {
      if (existingPromotionId) {
        const stats = await repository.getStats(existingPromotionId);

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

    it('should calculate rates correctly', async () => {
      if (existingPromotionId) {
        // Track some events
        await repository.trackEvent(existingPromotionId, 'view');
        await repository.trackEvent(existingPromotionId, 'view');
        await repository.trackEvent(existingPromotionId, 'click');
        await repository.trackEvent(existingPromotionId, 'conversion');

        const stats = await repository.getStats(existingPromotionId);

        expect(stats.clickThroughRate).toBe(50); // 1 click / 2 views * 100
        expect(stats.conversionRate).toBe(50); // 1 conversion / 2 views * 100
      }
    });
  });

  describe('getAvailableFilters', () => {
    it('should return available filter options', async () => {
      const filters = await repository.getAvailableFilters();

      expect(filters).toBeDefined();
      expect(filters.brokers).toBeInstanceOf(Array);
      expect(filters.promotionTypes).toBeInstanceOf(Array);
      expect(filters.activationMethods).toBeInstanceOf(Array);
      expect(filters.rebateRanges).toBeInstanceOf(Array);
    });

    it('should include broker information in filters', async () => {
      const filters = await repository.getAvailableFilters();

      filters.brokers.forEach(broker => {
        expect(broker.id).toBeDefined();
        expect(broker.name).toBeDefined();
        expect(typeof broker.count).toBe('number');
      });
    });

    it('should include promotion type counts', async () => {
      const filters = await repository.getAvailableFilters();

      filters.promotionTypes.forEach(type => {
        expect(type.type).toBeDefined();
        expect(typeof type.count).toBe('number');
      });
    });
  });

  describe('deactivateExpired', () => {
    it('should return number of deactivated promotions', async () => {
      const count = await repository.deactivateExpired();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should deactivate promotions with past end dates', async () => {
      // Create a promotion with past end date
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const createRequest: CreatePromotionRequest = {
        brokerId: '2',
        title: 'Expired Promotion',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: {},
        rates: [{
          minVolume: 0,
          rateType: 'fixed_per_lot',
          rateValue: 5,
          currency: 'USD',
          frequency: 'monthly',
          displayOrder: 1
        }],
        features: [],
        startDate: '2024-01-01T00:00:00Z',
        endDate: pastDate.toISOString()
      };

      const created = await repository.create(createRequest);
      expect(created.isActive).toBe(true);

      const deactivatedCount = await repository.deactivateExpired();
      expect(deactivatedCount).toBeGreaterThan(0);

      const expired = await repository.findById(created.id);
      expect(expired?.isActive).toBe(false);
    });

    it('should not deactivate promotions without end dates', async () => {
      const createRequest: CreatePromotionRequest = {
        brokerId: '2',
        title: 'No End Date Promotion',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: {},
        rates: [{
          minVolume: 0,
          rateType: 'fixed_per_lot',
          rateValue: 5,
          currency: 'USD',
          frequency: 'monthly',
          displayOrder: 1
        }],
        features: [],
        startDate: '2024-01-01T00:00:00Z'
        // No endDate
      };

      const created = await repository.create(createRequest);
      await repository.deactivateExpired();

      const stillActive = await repository.findById(created.id);
      expect(stillActive?.isActive).toBe(true);
    });
  });
});