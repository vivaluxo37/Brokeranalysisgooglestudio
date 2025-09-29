/**
 * CalculationService - Service for rebate calculations with tiered rate support
 * Handles complex rebate calculations based on trading volume and promotion tiers
 */

import type { 
  Promotion, 
  PromotionRate, 
  CalculationResult, 
  CalculateRebateRequest,
  CalculateRebateResponse,
  RateType,
  PaymentFrequency
} from '../types';

export class CalculationService {
  /**
   * Calculate rebate for a given promotion and trading volume
   */
  async calculateRebate(
    promotion: Promotion, 
    monthlyVolume: number, 
    accountType?: string
  ): Promise<CalculationResult> {
    try {
      // Validate inputs
      this.validateCalculationInputs(promotion, monthlyVolume);

      // Find applicable rate tier
      const applicableRate = this.findApplicableRate(promotion.rates || [], monthlyVolume);
      
      if (!applicableRate) {
        throw new Error('No applicable rate found for the given volume');
      }

      // Calculate rebate amount
      const rebateAmount = this.calculateRebateAmount(applicableRate, monthlyVolume);

      // Calculate additional metrics
      const result = this.calculateAdditionalMetrics(
        applicableRate, 
        rebateAmount, 
        monthlyVolume,
        promotion.rates || []
      );

      return result;
    } catch (error) {
      throw new Error(`Rebate calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate rebate for multiple promotions and return the best options
   */
  async calculateBestRebates(
    promotions: Promotion[], 
    monthlyVolume: number, 
    accountType?: string
  ): Promise<Array<{ promotion: Promotion; result: CalculationResult }>> {
    const results: Array<{ promotion: Promotion; result: CalculationResult }> = [];

    for (const promotion of promotions) {
      try {
        const result = await this.calculateRebate(promotion, monthlyVolume, accountType);
        results.push({ promotion, result });
      } catch (error) {
        // Skip promotions that can't be calculated
        console.warn(`Skipping promotion ${promotion.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Sort by rebate amount (highest first)
    return results.sort((a, b) => b.result.rebateAmount - a.result.rebateAmount);
  }

  /**
   * Calculate potential earnings across different volume scenarios
   */
  async calculateVolumeScenarios(
    promotion: Promotion,
    volumeScenarios: number[]
  ): Promise<Array<{ volume: number; result: CalculationResult }>> {
    const scenarios: Array<{ volume: number; result: CalculationResult }> = [];

    for (const volume of volumeScenarios) {
      try {
        const result = await this.calculateRebate(promotion, volume);
        scenarios.push({ volume, result });
      } catch (error) {
        // Skip invalid scenarios
        console.warn(`Skipping volume scenario ${volume}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return scenarios;
  }

  /**
   * Calculate break-even analysis for different promotion tiers
   */
  calculateBreakEvenAnalysis(
    promotion: Promotion,
    targetEarnings: number
  ): Array<{ tier: PromotionRate; requiredVolume: number; timeToBreakEven: string }> {
    if (!promotion.rates || promotion.rates.length === 0) {
      return [];
    }

    const analysis: Array<{ tier: PromotionRate; requiredVolume: number; timeToBreakEven: string }> = [];

    for (const rate of promotion.rates) {
      try {
        const requiredVolume = this.calculateRequiredVolumeForEarnings(rate, targetEarnings);
        const timeToBreakEven = this.estimateTimeToBreakEven(rate, requiredVolume);
        
        analysis.push({
          tier: rate,
          requiredVolume,
          timeToBreakEven
        });
      } catch (error) {
        // Skip tiers that can't achieve target earnings
        continue;
      }
    }

    return analysis.sort((a, b) => a.requiredVolume - b.requiredVolume);
  }

  /**
   * Calculate cost savings compared to standard trading costs
   */
  calculateCostSavings(
    rebateAmount: number,
    frequency: PaymentFrequency,
    standardCommission: number = 7, // Default $7 per lot
    monthlyVolume: number
  ): {
    monthlySavings: number;
    yearlySavings: number;
    savingsPercentage: number;
  } {
    // Convert rebate to monthly amount
    let monthlyRebate = rebateAmount;
    switch (frequency) {
      case 'daily':
        monthlyRebate = rebateAmount * 30;
        break;
      case 'weekly':
        monthlyRebate = rebateAmount * 4.33; // Average weeks per month
        break;
      case 'quarterly':
        monthlyRebate = rebateAmount / 3;
        break;
      case 'one_time':
        monthlyRebate = rebateAmount; // Assume it's already monthly equivalent
        break;
    }

    const monthlyCost = monthlyVolume * standardCommission;
    const savingsPercentage = monthlyCost > 0 ? (monthlyRebate / monthlyCost) * 100 : 0;

    return {
      monthlySavings: monthlyRebate,
      yearlySavings: monthlyRebate * 12,
      savingsPercentage
    };
  }

  // Private helper methods

  private validateCalculationInputs(promotion: Promotion, monthlyVolume: number): void {
    if (!promotion) {
      throw new Error('Promotion is required');
    }

    if (!promotion.rates || promotion.rates.length === 0) {
      throw new Error('Promotion must have at least one rate');
    }

    if (monthlyVolume < 0) {
      throw new Error('Monthly volume cannot be negative');
    }

    if (!Number.isFinite(monthlyVolume)) {
      throw new Error('Monthly volume must be a valid number');
    }
  }

  private findApplicableRate(rates: PromotionRate[], volume: number): PromotionRate | null {
    // Sort rates by minimum volume (ascending)
    const sortedRates = [...rates].sort((a, b) => a.minVolume - b.minVolume);

    // Find the highest tier that the volume qualifies for
    let applicableRate: PromotionRate | null = null;

    for (const rate of sortedRates) {
      if (volume >= rate.minVolume) {
        if (!rate.maxVolume || volume <= rate.maxVolume) {
          applicableRate = rate;
        }
      }
    }

    return applicableRate;
  }

  private calculateRebateAmount(rate: PromotionRate, volume: number): number {
    switch (rate.rateType) {
      case 'fixed_per_lot':
        return rate.rateValue * volume;
      
      case 'percentage':
        // For percentage rates, we need a base amount to calculate from
        // This would typically be the trading cost or spread
        // For now, assume a standard commission of $7 per lot
        const standardCommission = 7;
        return (rate.rateValue / 100) * (standardCommission * volume);
      
      case 'fixed_amount':
        return rate.rateValue;
      
      default:
        throw new Error(`Unsupported rate type: ${rate.rateType}`);
    }
  }

  private calculateAdditionalMetrics(
    rate: PromotionRate, 
    rebateAmount: number, 
    monthlyVolume: number,
    allRates: PromotionRate[]
  ): CalculationResult {
    // Calculate frequency-based amounts
    let dailyRebate = 0;
    let monthlyRebate = rebateAmount;
    let yearlyRebate = 0;

    switch (rate.frequency) {
      case 'daily':
        dailyRebate = rebateAmount;
        monthlyRebate = rebateAmount * 30;
        yearlyRebate = rebateAmount * 365;
        break;
      case 'weekly':
        dailyRebate = rebateAmount / 7;
        monthlyRebate = rebateAmount * 4.33;
        yearlyRebate = rebateAmount * 52;
        break;
      case 'monthly':
        dailyRebate = rebateAmount / 30;
        monthlyRebate = rebateAmount;
        yearlyRebate = rebateAmount * 12;
        break;
      case 'quarterly':
        dailyRebate = rebateAmount / 90;
        monthlyRebate = rebateAmount / 3;
        yearlyRebate = rebateAmount * 4;
        break;
      case 'one_time':
        dailyRebate = 0;
        monthlyRebate = rebateAmount;
        yearlyRebate = rebateAmount;
        break;
    }

    // Calculate cost reduction
    const standardCommission = 7; // $7 per lot
    const totalCost = monthlyVolume * standardCommission;
    const effectiveCostReduction = totalCost > 0 ? (monthlyRebate / totalCost) * 100 : 0;

    // Find next tier information
    const nextTier = this.findNextTier(allRates, rate, monthlyVolume);

    return {
      rebateAmount,
      rateValue: rate.rateValue,
      rateType: rate.rateType,
      tierName: rate.tierName,
      currency: rate.currency,
      frequency: rate.frequency,
      dailyRebate,
      monthlyRebate,
      yearlyRebate,
      effectiveCostReduction,
      nextTierVolume: nextTier?.minVolume,
      nextTierRebate: nextTier ? this.calculateRebateAmount(nextTier, nextTier.minVolume) : undefined
    };
  }

  private findNextTier(
    allRates: PromotionRate[], 
    currentRate: PromotionRate, 
    currentVolume: number
  ): PromotionRate | undefined {
    // Find the next higher tier
    const higherTiers = allRates
      .filter(rate => rate.minVolume > currentVolume)
      .sort((a, b) => a.minVolume - b.minVolume);

    return higherTiers[0];
  }

  private calculateRequiredVolumeForEarnings(rate: PromotionRate, targetEarnings: number): number {
    switch (rate.rateType) {
      case 'fixed_per_lot':
        return targetEarnings / rate.rateValue;
      
      case 'percentage':
        const standardCommission = 7;
        return targetEarnings / ((rate.rateValue / 100) * standardCommission);
      
      case 'fixed_amount':
        // Fixed amount doesn't scale with volume
        throw new Error('Cannot calculate required volume for fixed amount rate');
      
      default:
        throw new Error(`Unsupported rate type: ${rate.rateType}`);
    }
  }

  private estimateTimeToBreakEven(rate: PromotionRate, requiredVolume: number): string {
    // Assume average trading volume per day (this could be configurable)
    const averageDailyVolume = 2; // 2 lots per day
    
    if (averageDailyVolume <= 0) {
      return 'Unable to estimate';
    }

    const daysRequired = Math.ceil(requiredVolume / averageDailyVolume);
    
    if (daysRequired <= 30) {
      return `${daysRequired} days`;
    } else if (daysRequired <= 365) {
      const months = Math.ceil(daysRequired / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.ceil(daysRequired / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }
}

/**
 * Utility functions for common calculations
 */
export class CalculationUtils {
  /**
   * Convert volume between different units (lots, units, etc.)
   */
  static convertVolume(
    volume: number, 
    fromUnit: 'lots' | 'units' | 'mini_lots', 
    toUnit: 'lots' | 'units' | 'mini_lots'
  ): number {
    if (fromUnit === toUnit) return volume;

    // Convert to standard lots first
    let standardLots = volume;
    switch (fromUnit) {
      case 'mini_lots':
        standardLots = volume / 10;
        break;
      case 'units':
        standardLots = volume / 100000; // Assuming 1 lot = 100,000 units
        break;
    }

    // Convert from standard lots to target unit
    switch (toUnit) {
      case 'mini_lots':
        return standardLots * 10;
      case 'units':
        return standardLots * 100000;
      default:
        return standardLots;
    }
  }

  /**
   * Calculate compound growth of rebates over time
   */
  static calculateCompoundGrowth(
    initialRebate: number,
    monthlyGrowthRate: number,
    months: number
  ): number {
    return initialRebate * Math.pow(1 + monthlyGrowthRate / 100, months);
  }

  /**
   * Calculate the effective annual rate of return from rebates
   */
  static calculateEffectiveAnnualRate(
    monthlyRebate: number,
    initialInvestment: number
  ): number {
    if (initialInvestment <= 0) return 0;
    const monthlyRate = monthlyRebate / initialInvestment;
    return (Math.pow(1 + monthlyRate, 12) - 1) * 100;
  }

  /**
   * Format currency amounts for display
   */
  static formatCurrency(
    amount: number, 
    currency: string = 'USD', 
    locale: string = 'en-US'
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format percentage values for display
   */
  static formatPercentage(
    value: number, 
    decimals: number = 2
  ): string {
    return `${value.toFixed(decimals)}%`;
  }
}