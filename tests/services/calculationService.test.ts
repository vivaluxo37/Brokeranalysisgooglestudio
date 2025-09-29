/**
 * Unit tests for CalculationService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CalculationService, CalculationUtils } from '../../services/calculationService';
import type { Promotion, PromotionRate } from '../../types';

describe('CalculationService', () => {
  let calculationService: CalculationService;

  beforeEach(() => {
    calculationService = new CalculationService();
  });

  const createSamplePromotion = (rates: PromotionRate[]): Promotion => ({
    id: 'test-promo',
    brokerId: '1',
    title: 'Test Promotion',
    promotionType: 'cashback',
    isActive: true,
    isFeatured: false,
    isExclusive: false,
    isPopular: false,
    startDate: '2024-01-01T00:00:00Z',
    activationMethod: 'automatic',
    requirements: {},
    rates,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  });

  const createSampleRate = (overrides: Partial<PromotionRate> = {}): PromotionRate => ({
    id: 'rate-1',
    promotionId: 'test-promo',
    tierName: 'Standard',
    minVolume: 0,
    rateType: 'fixed_per_lot',
    rateValue: 5,
    currency: 'USD',
    frequency: 'monthly',
    displayOrder: 1,
    ...overrides
  });

  describe('calculateRebate', () => {
    it('should calculate rebate for fixed_per_lot rate type', async () => {
      const rate = createSampleRate({
        rateType: 'fixed_per_lot',
        rateValue: 8,
        minVolume: 0
      });
      const promotion = createSamplePromotion([rate]);

      const result = await calculationService.calculateRebate(promotion, 10);

      expect(result.rebateAmount).toBe(80); // 8 * 10
      expect(result.rateType).toBe('fixed_per_lot');
      expect(result.rateValue).toBe(8);
      expect(result.monthlyRebate).toBe(80);
    });

    it('should calculate rebate for percentage rate type', async () => {
      const rate = createSampleRate({
        rateType: 'percentage',
        rateValue: 50, // 50% of standard commission
        minVolume: 0
      });
      const promotion = createSamplePromotion([rate]);

      const result = await calculationService.calculateRebate(promotion, 10);

      // 50% of (7 * 10) = 35
      expect(result.rebateAmount).toBe(35);
      expect(result.rateType).toBe('percentage');
      expect(result.rateValue).toBe(50);
    });

    it('should calculate rebate for fixed_amount rate type', async () => {
      const rate = createSampleRate({
        rateType: 'fixed_amount',
        rateValue: 100,
        minVolume: 0
      });
      const promotion = createSamplePromotion([rate]);

      const result = await calculationService.calculateRebate(promotion, 10);

      expect(result.rebateAmount).toBe(100);
      expect(result.rateType).toBe('fixed_amount');
      expect(result.rateValue).toBe(100);
    });

    it('should select correct tier based on volume', async () => {
      const rates = [
        createSampleRate({
          id: 'rate-1',
          tierName: 'Bronze',
          minVolume: 0,
          maxVolume: 5,
          rateValue: 3
        }),
        createSampleRate({
          id: 'rate-2',
          tierName: 'Silver',
          minVolume: 5,
          maxVolume: 15,
          rateValue: 5
        }),
        createSampleRate({
          id: 'rate-3',
          tierName: 'Gold',
          minVolume: 15,
          rateValue: 8
        })
      ];
      const promotion = createSamplePromotion(rates);

      // Test Bronze tier
      const bronzeResult = await calculationService.calculateRebate(promotion, 3);
      expect(bronzeResult.tierName).toBe('Bronze');
      expect(bronzeResult.rateValue).toBe(3);

      // Test Silver tier
      const silverResult = await calculationService.calculateRebate(promotion, 10);
      expect(silverResult.tierName).toBe('Silver');
      expect(silverResult.rateValue).toBe(5);

      // Test Gold tier
      const goldResult = await calculationService.calculateRebate(promotion, 20);
      expect(goldResult.tierName).toBe('Gold');
      expect(goldResult.rateValue).toBe(8);
    });

    it('should calculate frequency-based amounts correctly', async () => {
      const dailyRate = createSampleRate({
        rateValue: 2,
        frequency: 'daily'
      });
      const promotion = createSamplePromotion([dailyRate]);

      const result = await calculationService.calculateRebate(promotion, 10);

      expect(result.dailyRebate).toBe(20); // 2 * 10
      expect(result.monthlyRebate).toBe(600); // 20 * 30
      expect(result.yearlyRebate).toBe(7300); // 20 * 365
    });

    it('should calculate next tier information', async () => {
      const rates = [
        createSampleRate({
          tierName: 'Bronze',
          minVolume: 0,
          maxVolume: 10,
          rateValue: 3
        }),
        createSampleRate({
          tierName: 'Silver',
          minVolume: 10,
          rateValue: 5
        })
      ];
      const promotion = createSamplePromotion(rates);

      const result = await calculationService.calculateRebate(promotion, 5);

      expect(result.nextTierVolume).toBe(10);
      expect(result.nextTierRebate).toBe(50); // 5 * 10 (minimum volume for next tier)
    });

    it('should calculate effective cost reduction', async () => {
      const rate = createSampleRate({
        rateValue: 3.5, // $3.50 per lot
        frequency: 'monthly'
      });
      const promotion = createSamplePromotion([rate]);

      const result = await calculationService.calculateRebate(promotion, 10);

      // Standard commission is $7 per lot, so $70 total cost
      // Rebate is $35, so 50% cost reduction
      expect(result.effectiveCostReduction).toBe(50);
    });

    it('should throw error for invalid inputs', async () => {
      const rate = createSampleRate();
      const promotion = createSamplePromotion([rate]);

      // Negative volume
      await expect(calculationService.calculateRebate(promotion, -5))
        .rejects.toThrow('Monthly volume cannot be negative');

      // Invalid volume
      await expect(calculationService.calculateRebate(promotion, NaN))
        .rejects.toThrow('Monthly volume must be a valid number');

      // No promotion
      await expect(calculationService.calculateRebate(null as any, 10))
        .rejects.toThrow('Promotion is required');

      // No rates
      const emptyPromotion = createSamplePromotion([]);
      await expect(calculationService.calculateRebate(emptyPromotion, 10))
        .rejects.toThrow('Promotion must have at least one rate');
    });

    it('should throw error when no applicable rate found', async () => {
      const rate = createSampleRate({
        minVolume: 10,
        maxVolume: 20
      });
      const promotion = createSamplePromotion([rate]);

      await expect(calculationService.calculateRebate(promotion, 5))
        .rejects.toThrow('No applicable rate found for the given volume');
    });

    it('should throw error for unsupported rate type', async () => {
      const rate = createSampleRate({
        rateType: 'unsupported_type' as any
      });
      const promotion = createSamplePromotion([rate]);

      await expect(calculationService.calculateRebate(promotion, 10))
        .rejects.toThrow('Unsupported rate type');
    });
  });

  describe('calculateBestRebates', () => {
    it('should return promotions sorted by rebate amount', async () => {
      const promotion1 = createSamplePromotion([
        createSampleRate({ rateValue: 3, promotionId: 'promo-1' })
      ]);
      promotion1.id = 'promo-1';

      const promotion2 = createSamplePromotion([
        createSampleRate({ rateValue: 8, promotionId: 'promo-2' })
      ]);
      promotion2.id = 'promo-2';

      const promotion3 = createSamplePromotion([
        createSampleRate({ rateValue: 5, promotionId: 'promo-3' })
      ]);
      promotion3.id = 'promo-3';

      const results = await calculationService.calculateBestRebates(
        [promotion1, promotion2, promotion3], 
        10
      );

      expect(results).toHaveLength(3);
      expect(results[0].result.rebateAmount).toBe(80); // promotion2
      expect(results[1].result.rebateAmount).toBe(50); // promotion3
      expect(results[2].result.rebateAmount).toBe(30); // promotion1
    });

    it('should skip promotions that cannot be calculated', async () => {
      const validPromotion = createSamplePromotion([
        createSampleRate({ rateValue: 5 })
      ]);

      const invalidPromotion = createSamplePromotion([]);

      const results = await calculationService.calculateBestRebates(
        [validPromotion, invalidPromotion], 
        10
      );

      expect(results).toHaveLength(1);
      expect(results[0].result.rebateAmount).toBe(50);
    });
  });

  describe('calculateVolumeScenarios', () => {
    it('should calculate rebates for different volume scenarios', async () => {
      const rates = [
        createSampleRate({
          tierName: 'Bronze',
          minVolume: 0,
          maxVolume: 10,
          rateValue: 3
        }),
        createSampleRate({
          tierName: 'Silver',
          minVolume: 10,
          rateValue: 5
        })
      ];
      const promotion = createSamplePromotion(rates);

      const scenarios = await calculationService.calculateVolumeScenarios(
        promotion, 
        [5, 15, 25]
      );

      expect(scenarios).toHaveLength(3);
      
      // 5 lots - Bronze tier
      expect(scenarios[0].volume).toBe(5);
      expect(scenarios[0].result.tierName).toBe('Bronze');
      expect(scenarios[0].result.rebateAmount).toBe(15);

      // 15 lots - Silver tier
      expect(scenarios[1].volume).toBe(15);
      expect(scenarios[1].result.tierName).toBe('Silver');
      expect(scenarios[1].result.rebateAmount).toBe(75);

      // 25 lots - Silver tier
      expect(scenarios[2].volume).toBe(25);
      expect(scenarios[2].result.tierName).toBe('Silver');
      expect(scenarios[2].result.rebateAmount).toBe(125);
    });

    it('should skip invalid volume scenarios', async () => {
      const rate = createSampleRate({
        minVolume: 10,
        maxVolume: 20
      });
      const promotion = createSamplePromotion([rate]);

      const scenarios = await calculationService.calculateVolumeScenarios(
        promotion, 
        [5, 15, 25] // 5 and 25 are outside the valid range
      );

      expect(scenarios).toHaveLength(1);
      expect(scenarios[0].volume).toBe(15);
    });
  });

  describe('calculateBreakEvenAnalysis', () => {
    it('should calculate required volume for target earnings', () => {
      const rates = [
        createSampleRate({
          tierName: 'Bronze',
          rateType: 'fixed_per_lot',
          rateValue: 3
        }),
        createSampleRate({
          tierName: 'Silver',
          rateType: 'fixed_per_lot',
          rateValue: 5
        })
      ];
      const promotion = createSamplePromotion(rates);

      const analysis = calculationService.calculateBreakEvenAnalysis(promotion, 150);

      expect(analysis).toHaveLength(2);
      
      // Results are sorted by required volume (lowest first)
      // Silver: 150 / 5 = 30 lots required (lower, so first)
      expect(analysis[0].tier.tierName).toBe('Silver');
      expect(analysis[0].requiredVolume).toBe(30);

      // Bronze: 150 / 3 = 50 lots required (higher, so second)
      expect(analysis[1].tier.tierName).toBe('Bronze');
      expect(analysis[1].requiredVolume).toBe(50);
    });

    it('should sort results by required volume', () => {
      const rates = [
        createSampleRate({
          tierName: 'Bronze',
          rateValue: 2 // Higher volume required
        }),
        createSampleRate({
          tierName: 'Silver',
          rateValue: 5 // Lower volume required
        })
      ];
      const promotion = createSamplePromotion(rates);

      const analysis = calculationService.calculateBreakEvenAnalysis(promotion, 100);

      expect(analysis[0].tier.tierName).toBe('Silver'); // 20 lots required
      expect(analysis[1].tier.tierName).toBe('Bronze'); // 50 lots required
    });

    it('should skip tiers with fixed_amount that cannot achieve target', () => {
      const rates = [
        createSampleRate({
          tierName: 'Fixed',
          rateType: 'fixed_amount',
          rateValue: 50
        }),
        createSampleRate({
          tierName: 'PerLot',
          rateType: 'fixed_per_lot',
          rateValue: 5
        })
      ];
      const promotion = createSamplePromotion(rates);

      const analysis = calculationService.calculateBreakEvenAnalysis(promotion, 100);

      expect(analysis).toHaveLength(1);
      expect(analysis[0].tier.tierName).toBe('PerLot');
    });

    it('should return empty array for promotion without rates', () => {
      const promotion = createSamplePromotion([]);
      const analysis = calculationService.calculateBreakEvenAnalysis(promotion, 100);
      expect(analysis).toEqual([]);
    });
  });

  describe('calculateCostSavings', () => {
    it('should calculate monthly and yearly savings', () => {
      const savings = calculationService.calculateCostSavings(
        35, // $35 monthly rebate
        'monthly',
        7, // $7 standard commission
        10 // 10 lots per month
      );

      expect(savings.monthlySavings).toBe(35);
      expect(savings.yearlySavings).toBe(420); // 35 * 12
      expect(savings.savingsPercentage).toBe(50); // 35 / 70 * 100
    });

    it('should convert daily rebates to monthly', () => {
      const savings = calculationService.calculateCostSavings(
        2, // $2 daily rebate
        'daily',
        7,
        10
      );

      expect(savings.monthlySavings).toBe(60); // 2 * 30
      expect(savings.yearlySavings).toBe(720); // 60 * 12
    });

    it('should convert weekly rebates to monthly', () => {
      const savings = calculationService.calculateCostSavings(
        14, // $14 weekly rebate
        'weekly',
        7,
        10
      );

      expect(savings.monthlySavings).toBeCloseTo(60.62); // 14 * 4.33
    });

    it('should convert quarterly rebates to monthly', () => {
      const savings = calculationService.calculateCostSavings(
        105, // $105 quarterly rebate
        'quarterly',
        7,
        10
      );

      expect(savings.monthlySavings).toBe(35); // 105 / 3
    });

    it('should handle zero monthly cost', () => {
      const savings = calculationService.calculateCostSavings(
        35,
        'monthly',
        7,
        0 // No volume
      );

      expect(savings.savingsPercentage).toBe(0);
    });
  });
});

describe('CalculationUtils', () => {
  describe('convertVolume', () => {
    it('should convert between lots and mini lots', () => {
      expect(CalculationUtils.convertVolume(1, 'lots', 'mini_lots')).toBe(10);
      expect(CalculationUtils.convertVolume(10, 'mini_lots', 'lots')).toBe(1);
    });

    it('should convert between lots and units', () => {
      expect(CalculationUtils.convertVolume(1, 'lots', 'units')).toBe(100000);
      expect(CalculationUtils.convertVolume(100000, 'units', 'lots')).toBe(1);
    });

    it('should return same value for same units', () => {
      expect(CalculationUtils.convertVolume(5, 'lots', 'lots')).toBe(5);
      expect(CalculationUtils.convertVolume(50, 'mini_lots', 'mini_lots')).toBe(50);
    });
  });

  describe('calculateCompoundGrowth', () => {
    it('should calculate compound growth correctly', () => {
      const result = CalculationUtils.calculateCompoundGrowth(100, 5, 12);
      expect(result).toBeCloseTo(179.59, 2); // 100 * (1.05)^12
    });

    it('should handle zero growth rate', () => {
      const result = CalculationUtils.calculateCompoundGrowth(100, 0, 12);
      expect(result).toBe(100);
    });

    it('should handle negative growth rate', () => {
      const result = CalculationUtils.calculateCompoundGrowth(100, -5, 12);
      expect(result).toBeCloseTo(54.04, 2); // 100 * (0.95)^12
    });
  });

  describe('calculateEffectiveAnnualRate', () => {
    it('should calculate effective annual rate correctly', () => {
      const result = CalculationUtils.calculateEffectiveAnnualRate(50, 1000);
      expect(result).toBeCloseTo(79.59, 2); // ((1 + 0.05)^12 - 1) * 100
    });

    it('should handle zero investment', () => {
      const result = CalculationUtils.calculateEffectiveAnnualRate(50, 0);
      expect(result).toBe(0);
    });

    it('should handle negative investment', () => {
      const result = CalculationUtils.calculateEffectiveAnnualRate(50, -1000);
      expect(result).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const result = CalculationUtils.formatCurrency(1234.56, 'USD');
      expect(result).toBe('$1,234.56');
    });

    it('should format EUR currency correctly', () => {
      const result = CalculationUtils.formatCurrency(1234.56, 'EUR', 'en-US');
      expect(result).toBe('€1,234.56');
    });

    it('should handle zero amount', () => {
      const result = CalculationUtils.formatCurrency(0, 'USD');
      expect(result).toBe('$0.00');
    });

    it('should handle negative amount', () => {
      const result = CalculationUtils.formatCurrency(-1234.56, 'USD');
      expect(result).toBe('-$1,234.56');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with default decimals', () => {
      const result = CalculationUtils.formatPercentage(12.3456);
      expect(result).toBe('12.35%');
    });

    it('should format percentage with custom decimals', () => {
      const result = CalculationUtils.formatPercentage(12.3456, 1);
      expect(result).toBe('12.3%');
    });

    it('should handle zero percentage', () => {
      const result = CalculationUtils.formatPercentage(0);
      expect(result).toBe('0.00%');
    });

    it('should handle negative percentage', () => {
      const result = CalculationUtils.formatPercentage(-5.25);
      expect(result).toBe('-5.25%');
    });
  });
});