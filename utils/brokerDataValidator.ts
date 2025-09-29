import { Broker } from '../types';
import { formatCurrency, formatNumber } from '../constants/designSystem';

/**
 * Broker Data Validation and Fallback System
 * Ensures all brokers have complete, accurate, and up-to-date information
 */

export interface BrokerDataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  updatedBroker: Broker;
}

export class BrokerDataValidator {
  private static instance: BrokerDataValidator;
  private lastUpdateCheck: Map<string, Date> = new Map();

  public static getInstance(): BrokerDataValidator {
    if (!BrokerDataValidator.instance) {
      BrokerDataValidator.instance = new BrokerDataValidator();
    }
    return BrokerDataValidator.instance;
  }

  /**
   * Validates and enriches broker data with fallbacks
   */
  public validateBroker(broker: Broker): BrokerDataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let updatedBroker = { ...broker };

    // Core Information Validation
    updatedBroker = this.validateCoreInfo(updatedBroker, errors, warnings);
    
    // Financial Data Validation
    updatedBroker = this.validateFinancialData(updatedBroker, errors, warnings);
    
    // Regulatory Information Validation
    updatedBroker = this.validateRegulatoryInfo(updatedBroker, errors, warnings);
    
    // Trading Conditions Validation
    updatedBroker = this.validateTradingConditions(updatedBroker, errors, warnings);
    
    // Platform and Technology Validation
    updatedBroker = this.validateTechnology(updatedBroker, errors, warnings);

    // Data Freshness Check
    this.checkDataFreshness(updatedBroker, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      updatedBroker
    };
  }

  private validateCoreInfo(broker: Broker, errors: string[], warnings: string[]): Broker {
    const updated = { ...broker };

    // Name validation
    if (!updated.name || updated.name.trim().length === 0) {
      errors.push('Broker name is required');
      updated.name = 'Unknown Broker';
    }

    // Logo URL validation
    if (!updated.logoUrl) {
      warnings.push('Missing broker logo');
      updated.logoUrl = '/broker-logos/default-broker.png';
    }

    // Website URL validation
    if (!updated.websiteUrl) {
      warnings.push('Missing website URL');
    } else if (!this.isValidUrl(updated.websiteUrl)) {
      errors.push('Invalid website URL format');
    }

    // Founded year validation
    const currentYear = new Date().getFullYear();
    if (!updated.foundingYear || updated.foundingYear < 1900 || updated.foundingYear > currentYear) {
      warnings.push('Invalid or missing founding year');
      updated.foundingYear = currentYear - 10; // Default to 10 years ago
    }

    // Description validation
    if (!updated.description || updated.description.length < 50) {
      warnings.push('Description too short or missing');
      updated.description = `${updated.name} is a financial services provider offering online trading solutions for forex, CFDs, and other financial instruments.`;
    }

    // Score validation
    if (!updated.score || updated.score < 0 || updated.score > 10) {
      warnings.push('Invalid or missing broker score');
      updated.score = 7.5; // Default neutral score
    }

    return updated;
  }

  private validateFinancialData(broker: Broker, errors: string[], warnings: string[]): Broker {
    const updated = { ...broker };

    // Accessibility validation
    if (!updated.accessibility) {
      updated.accessibility = {
        minDeposit: 100,
        depositMethods: ['Credit Card', 'Bank Transfer'],
        withdrawalMethods: ['Bank Transfer'],
        customerSupport: ['Email']
      };
      warnings.push('Missing accessibility data, using defaults');
    } else {
      if (updated.accessibility.minDeposit === undefined || updated.accessibility.minDeposit < 0) {
        updated.accessibility.minDeposit = 100;
        warnings.push('Invalid minimum deposit, set to default $100');
      }
    }

    // Fees validation
    if (!updated.fees) {
      updated.fees = {
        trading: {
          spreadType: 'Variable',
          averageSpreads: [
            { pair: 'EUR/USD', spread: '1.0 pips' },
            { pair: 'GBP/USD', spread: '1.5 pips' }
          ],
          commissionStructure: 'No commission',
          overnightSwapFees: 'Standard rates apply'
        },
        nonTrading: {
          inactivityFee: 'None',
          withdrawalFee: 'None',
          depositFee: 'None'
        }
      };
      warnings.push('Missing fee structure, using defaults');
    }

    return updated;
  }

  private validateRegulatoryInfo(broker: Broker, errors: string[], warnings: string[]): Broker {
    const updated = { ...broker };

    if (!updated.regulation || !updated.regulation.regulators || updated.regulation.regulators.length === 0) {
      warnings.push('Missing regulatory information - this is critical for user trust');
      updated.regulation = {
        regulators: ['Pending Verification']
      };
    }

    // Security information
    if (!updated.security) {
      updated.security = {
        regulatedBy: updated.regulation.regulators.map(reg => ({ regulator: reg, licenseNumber: 'N/A' })),
        segregatedAccounts: false,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: false
      };
      warnings.push('Missing security information');
    }

    return updated;
  }

  private validateTradingConditions(broker: Broker, errors: string[], warnings: string[]): Broker {
    const updated = { ...broker };

    if (!updated.tradingConditions) {
      updated.tradingConditions = {
        spreads: { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.0 },
        commission: 'No commission',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:100',
        minLotSize: 0.01
      };
      warnings.push('Missing trading conditions, using defaults');
    } else {
      // Validate spreads
      if (!updated.tradingConditions.spreads) {
        updated.tradingConditions.spreads = { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.0 };
        warnings.push('Missing spread information');
      }

      // Validate leverage
      if (!updated.tradingConditions.maxLeverage) {
        updated.tradingConditions.maxLeverage = '1:100';
        warnings.push('Missing leverage information');
      }
    }

    return updated;
  }

  private validateTechnology(broker: Broker, errors: string[], warnings: string[]): Broker {
    const updated = { ...broker };

    if (!updated.technology) {
      updated.technology = {
        platforms: ['Web Platform'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: false
      };
      warnings.push('Missing technology information, using defaults');
    } else {
      if (!updated.technology.platforms || updated.technology.platforms.length === 0) {
        updated.technology.platforms = ['Web Platform'];
        warnings.push('No trading platforms specified');
      }
    }

    return updated;
  }

  private checkDataFreshness(broker: Broker, warnings: string[]): void {
    const lastCheck = this.lastUpdateCheck.get(broker.id);
    const daysSinceLastCheck = lastCheck ? 
      Math.floor((Date.now() - lastCheck.getTime()) / (1000 * 60 * 60 * 24)) : 
      999; // Assume very old if never checked

    if (daysSinceLastCheck > 30) {
      warnings.push(`Broker data may be outdated (last checked: ${daysSinceLastCheck} days ago)`);
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Updates the last check timestamp for a broker
   */
  public markAsUpdated(brokerId: string): void {
    this.lastUpdateCheck.set(brokerId, new Date());
  }

  /**
   * Gets enhanced broker stats for display
   */
  public getEnhancedStats(broker: Broker): BrokerStats {
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - (broker.foundingYear || currentYear - 10);
    
    return {
      founded: broker.foundingYear || currentYear - 10,
      yearsInBusiness,
      marketsAvailable: this.calculateTotalMarkets(broker),
      minDeposit: broker.accessibility?.minDeposit || 0,
      supportHours: this.determineSupportHours(broker),
      regulatoryScore: this.calculateRegulatoryScore(broker),
      platformsCount: broker.technology?.platforms?.length || 1,
      spreadFrom: broker.tradingConditions?.spreads?.eurusd || 1.0
    };
  }

  private calculateTotalMarkets(broker: Broker): number {
    if (!broker.tradableInstruments) return 100;
    
    const instruments = broker.tradableInstruments;
    return (instruments.forexPairs?.total || 0) +
           (instruments.commodities?.total || 0) +
           (instruments.indices?.total || 0) +
           (instruments.stocks?.total || 0) +
           (instruments.cryptocurrencies?.total || 0) +
           (instruments.etfs?.total || 0);
  }

  private determineSupportHours(broker: Broker): string {
    if (broker.customerSupport?.hours) return broker.customerSupport.hours;
    if (broker.accessibility?.customerSupport?.some(s => s.includes('24'))) return '24/5';
    return '9/5';
  }

  private calculateRegulatoryScore(broker: Broker): number {
    if (!broker.regulation?.regulators) return 5.0;
    
    const tierOneRegulators = ['FCA', 'ASIC', 'CySEC', 'FSA', 'FINRA', 'SEC'];
    const regulatorCount = broker.regulation.regulators.length;
    const tierOneCount = broker.regulation.regulators.filter(reg => 
      tierOneRegulators.some(tier1 => reg.includes(tier1))
    ).length;
    
    return Math.min(10, 6 + (tierOneCount * 2) + (regulatorCount * 0.5));
  }
}

export interface BrokerStats {
  founded: number;
  yearsInBusiness: number;
  marketsAvailable: number;
  minDeposit: number;
  supportHours: string;
  regulatoryScore: number;
  platformsCount: number;
  spreadFrom: number;
}

// Export singleton instance
export const brokerValidator = BrokerDataValidator.getInstance();