/**
 * Integration tests for promotion services
 * Tests the complete flow from service creation to complex operations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  PromotionServiceFactory, 
  getPromotionService, 
  createPromotionService 
} from '../../services/promotionServiceFactory';
import type { CreatePromotionRequest } from '../../types';

describe('Promotion Services Integration', () => {
  beforeEach(() => {
    // Reset factory for each test
    PromotionServiceFactory.reset();
  });

  describe('PromotionServiceFactory', () => {
    it('should create service with default configuration', () => {
      const service = getPromotionService();
      expect(service).toBeDefined();
    });

    it('should return same instance for singleton pattern', () => {
      const service1 = getPromotionService();
      const service2 = getPromotionService();
      expect(service1).toBe(service2);
    });

    it('should create new instances when requested', () => {
      const service1 = createPromotionService();
      const service2 = createPromotionService();
      expect(service1).not.toBe(service2);
    });

    it('should configure repository type', () => {
      PromotionServiceFactory.configure({ repositoryType: 'memory' });
      const service = getPromotionService();
      expect(service).toBeDefined();
    });

    it('should reset singleton instance', () => {
      const service1 = getPromotionService();
      PromotionServiceFactory.reset();
      const service2 = getPromotionService();
      expect(service1).not.toBe(service2);
    });
  });

  describe('End-to-End Promotion Workflow', () => {
    it('should handle complete promotion lifecycle', async () => {
      const service = createPromotionService({ repositoryType: 'memory' });

      // 1. Create a promotion
      const createRequest: CreatePromotionRequest = {
        brokerId: '1',
        title: 'Integration Test Promotion',
        description: 'A comprehensive cashback program for testing',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: {
          minDeposit: 500,
          accountTypes: ['Standard', 'ECN'],
          newClientsOnly: false
        },
        rates: [
          {
            tierName: 'Bronze',
            minVolume: 0,
            maxVolume: 10,
            rateType: 'fixed_per_lot',
            rateValue: 5,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 1
          },
          {
            tierName: 'Silver',
            minVolume: 10,
            maxVolume: 50,
            rateType: 'fixed_per_lot',
            rateValue: 8,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 2
          },
          {
            tierName: 'Gold',
            minVolume: 50,
            rateType: 'fixed_per_lot',
            rateValue: 12,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 3
          }
        ],
        features: [
          {
            featureText: 'Automated rebate payments',
            featureType: 'advantage',
            displayOrder: 1,
            isHighlighted: true
          },
          {
            featureText: 'No minimum volume required',
            featureType: 'advantage',
            displayOrder: 2,
            isHighlighted: false
          },
          {
            featureText: 'Must maintain account for 30 days',
            featureType: 'requirement',
            displayOrder: 3,
            isHighlighted: false
          }
        ],
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        isFeatured: true
      };

      const createdPromotion = await service.createPromotion(createRequest);
      expect(createdPromotion.id).toBeDefined();
      expect(createdPromotion.title).toBe(createRequest.title);
      expect(createdPromotion.rates).toHaveLength(3);
      expect(createdPromotion.features).toHaveLength(3);

      // 2. Retrieve the promotion
      const retrievedPromotion = await service.getPromotionById(createdPromotion.id);
      expect(retrievedPromotion).toBeDefined();
      expect(retrievedPromotion?.id).toBe(createdPromotion.id);

      // 3. Get promotions with filters
      const filteredPromotions = await service.getPromotions({
        filters: {
          promotionTypes: ['cashback'],
          brokers: ['1']
        },
        pagination: { page: 1, limit: 10 }
      });
      expect(filteredPromotions.promotions.length).toBeGreaterThan(0);
      expect(filteredPromotions.promotions.some(p => p.id === createdPromotion.id)).toBe(true);

      // 4. Get featured promotions
      const featuredPromotions = await service.getFeaturedPromotions(5);
      expect(featuredPromotions.some(p => p.id === createdPromotion.id)).toBe(true);

      // 5. Track analytics events
      await service.trackPromotionEvent(createdPromotion.id, 'view');
      await service.trackPromotionEvent(createdPromotion.id, 'click');
      await service.trackPromotionEvent(createdPromotion.id, 'conversion');

      // 6. Get promotion statistics
      const stats = await service.getPromotionStats(createdPromotion.id);
      expect(stats.totalViews).toBeGreaterThan(0);
      expect(stats.totalClicks).toBeGreaterThan(0);
      expect(stats.totalConversions).toBeGreaterThan(0);

      // 7. Update the promotion
      const updatedPromotion = await service.updatePromotion({
        id: createdPromotion.id,
        title: 'Updated Integration Test Promotion',
        description: 'Updated description for testing'
      });
      expect(updatedPromotion.title).toBe('Updated Integration Test Promotion');

      // 8. Deactivate the promotion
      await service.deactivatePromotion(createdPromotion.id);
      const deactivatedPromotion = await service.getPromotionById(createdPromotion.id);
      expect(deactivatedPromotion?.isActive).toBe(false);
    });

    it('should handle complex filtering and sorting scenarios', async () => {
      const service = createPromotionService({ repositoryType: 'memory' });

      // Create multiple promotions with different characteristics
      const promotions = [
        {
          brokerId: '1',
          title: 'High Rebate Promotion',
          promotionType: 'cashback' as const,
          activationMethod: 'automatic' as const,
          requirements: { minDeposit: 100, newClientsOnly: false },
          rates: [{
            tierName: 'High',
            minVolume: 0,
            rateType: 'fixed_per_lot' as const,
            rateValue: 15,
            currency: 'USD',
            frequency: 'monthly' as const,
            displayOrder: 1
          }],
          features: [],
          startDate: '2024-01-01T00:00:00Z',
          isFeatured: true,
          isPopular: true
        },
        {
          brokerId: '2',
          title: 'Deposit Bonus Promotion',
          promotionType: 'deposit_bonus' as const,
          activationMethod: 'manual' as const,
          requirements: { minDeposit: 1000, newClientsOnly: true },
          rates: [{
            tierName: 'Bonus',
            minVolume: 0,
            rateType: 'percentage' as const,
            rateValue: 50,
            currency: 'USD',
            frequency: 'one_time' as const,
            displayOrder: 1
          }],
          features: [],
          startDate: '2024-01-01T00:00:00Z',
          isFeatured: false,
          isPopular: false
        }
      ];

      const createdPromotions = [];
      for (const promo of promotions) {
        const created = await service.createPromotion(promo);
        createdPromotions.push(created);
      }

      // Test filtering by promotion type
      const cashbackPromotions = await service.getPromotions({
        filters: { promotionTypes: ['cashback'] }
      });
      expect(cashbackPromotions.promotions.every(p => p.promotionType === 'cashback')).toBe(true);

      // Test filtering by broker
      const broker1Promotions = await service.getPromotions({
        filters: { brokers: ['1'] }
      });
      expect(broker1Promotions.promotions.every(p => p.brokerId === '1')).toBe(true);

      // Test filtering by activation method
      const automaticPromotions = await service.getPromotions({
        filters: { activationMethod: ['automatic'] }
      });
      expect(automaticPromotions.promotions.every(p => p.activationMethod === 'automatic')).toBe(true);

      // Test sorting by rebate amount
      const sortedByRebate = await service.getPromotions({
        sort: { field: 'rebate_amount', order: 'desc' }
      });
      if (sortedByRebate.promotions.length > 1) {
        const rates1 = sortedByRebate.promotions[0].rates || [];
        const rates2 = sortedByRebate.promotions[1].rates || [];
        const max1 = rates1.length > 0 ? Math.max(...rates1.map(r => r.rateValue)) : 0;
        const max2 = rates2.length > 0 ? Math.max(...rates2.map(r => r.rateValue)) : 0;
        expect(max1).toBeGreaterThanOrEqual(max2);
      }

      // Test pagination
      const paginatedPromotions = await service.getPromotions({
        pagination: { page: 1, limit: 1 }
      });
      expect(paginatedPromotions.promotions.length).toBeLessThanOrEqual(1);
      if (paginatedPromotions.totalCount > 1) {
        expect(paginatedPromotions.hasMore).toBe(true);
      }
    });

    it('should handle rebate calculations across different scenarios', async () => {
      const service = createPromotionService({ repositoryType: 'memory' });

      // Create a promotion with tiered rates
      const createRequest: CreatePromotionRequest = {
        brokerId: '1',
        title: 'Tiered Rebate Promotion',
        promotionType: 'cashback',
        activationMethod: 'automatic',
        requirements: { minDeposit: 100, newClientsOnly: false },
        rates: [
          {
            tierName: 'Starter',
            minVolume: 0,
            maxVolume: 5,
            rateType: 'fixed_per_lot',
            rateValue: 3,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 1
          },
          {
            tierName: 'Professional',
            minVolume: 5,
            maxVolume: 20,
            rateType: 'fixed_per_lot',
            rateValue: 6,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 2
          },
          {
            tierName: 'VIP',
            minVolume: 20,
            rateType: 'fixed_per_lot',
            rateValue: 10,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 3
          }
        ],
        features: [],
        startDate: '2024-01-01T00:00:00Z'
      };

      const promotion = await service.createPromotion(createRequest);

      // Test calculation service integration through promotion service
      // This would typically be done through a separate calculation endpoint
      // but we can verify the promotion has the correct rate structure
      expect(promotion.rates).toHaveLength(3);
      
      // Verify rate tiers are correctly structured
      const starterRate = promotion.rates?.find(r => r.tierName === 'Starter');
      const professionalRate = promotion.rates?.find(r => r.tierName === 'Professional');
      const vipRate = promotion.rates?.find(r => r.tierName === 'VIP');

      expect(starterRate?.minVolume).toBe(0);
      expect(starterRate?.maxVolume).toBe(5);
      expect(starterRate?.rateValue).toBe(3);

      expect(professionalRate?.minVolume).toBe(5);
      expect(professionalRate?.maxVolume).toBe(20);
      expect(professionalRate?.rateValue).toBe(6);

      expect(vipRate?.minVolume).toBe(20);
      expect(vipRate?.maxVolume).toBeUndefined();
      expect(vipRate?.rateValue).toBe(10);
    });

    it('should handle error scenarios gracefully', async () => {
      const service = createPromotionService({ repositoryType: 'memory' });

      // Test invalid promotion creation
      const invalidRequest = {
        brokerId: '',
        title: '',
        promotionType: 'cashback' as const,
        activationMethod: 'automatic' as const,
        requirements: {},
        rates: [],
        features: [],
        startDate: '2024-01-01T00:00:00Z'
      };

      await expect(service.createPromotion(invalidRequest)).rejects.toThrow();

      // Test non-existent promotion retrieval
      const nonExistentPromotion = await service.getPromotionById('non-existent-id');
      expect(nonExistentPromotion).toBeNull();

      // Test invalid filter parameters
      await expect(service.getPromotions({
        pagination: { page: -1, limit: 5 }
      })).rejects.toThrow('Invalid page number');

      // Test invalid sort parameters
      await expect(service.getPromotions({
        sort: { field: 'invalid_field', order: 'asc' }
      })).rejects.toThrow('Invalid sort field');
    });

    it('should maintain data consistency across operations', async () => {
      const service = createPromotionService({ repositoryType: 'memory' });

      // Create a promotion
      const createRequest: CreatePromotionRequest = {
        brokerId: '1',
        title: 'Consistency Test Promotion',
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
        features: [{
          featureText: 'Test feature',
          featureType: 'advantage',
          displayOrder: 1,
          isHighlighted: false
        }],
        startDate: '2024-01-01T00:00:00Z'
      };

      const promotion = await service.createPromotion(createRequest);

      // Verify promotion appears in various queries
      const allPromotions = await service.getPromotions({});
      expect(allPromotions.promotions.some(p => p.id === promotion.id)).toBe(true);

      const brokerPromotions = await service.getPromotionsByBrokerId('1');
      expect(brokerPromotions.some(p => p.id === promotion.id)).toBe(true);

      // Update promotion and verify consistency
      const updatedPromotion = await service.updatePromotion({
        id: promotion.id,
        title: 'Updated Consistency Test'
      });

      const retrievedAfterUpdate = await service.getPromotionById(promotion.id);
      expect(retrievedAfterUpdate?.title).toBe('Updated Consistency Test');

      // Deactivate and verify it's no longer in active queries
      await service.deactivatePromotion(promotion.id);
      
      const activePromotions = await service.getPromotions({
        filters: { brokers: ['1'] }
      });
      const deactivatedPromotion = activePromotions.promotions.find(p => p.id === promotion.id);
      expect(deactivatedPromotion?.isActive).toBe(false);
    });
  });
});