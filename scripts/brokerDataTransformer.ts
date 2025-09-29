/**
 * Broker Data Transformer
 * Converts researched broker data into the existing broker data format
 */

import { BrokerResearchData } from './brokerDataResearch';

// Existing broker interface (based on current codebase)
export interface BrokerData {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  country: string;
  regulation: string[];
  founded: number;
  minDeposit: number;
  maxLeverage: string;
  spreads: {
    EUR_USD: number;
    GBP_USD: number;
    USD_JPY: number;
  };
  platforms: string[];
  accountTypes: string[];
  assets: string[];
  
  // Rating and scoring
  ratings: {
    overall: number;
    spreads: number;
    platforms: number;
    execution: number;
    support: number;
    regulation: number;
  };
  
  // Detailed information
  pros: string[];
  cons: string[];
  fees: {
    commission: string;
    deposit: string;
    withdrawal: string;
    inactivity: string;
  };
  
  // Additional data
  executionType: string;
  support: string[];
  languages: string[];
  lastUpdated: string;
}

export class BrokerDataTransformer {
  
  /**
   * Transform research data into existing broker format
   */
  public static transformToBrokerData(research: BrokerResearchData): BrokerData {
    return {
      id: research.id,
      name: research.name,
      logo: `/assets/brokers/${research.id}.svg`,
      description: this.generateBrokerDescription(research),
      website: research.websiteUrl,
      country: this.extractCountryFromHeadquarters(research.headquarters),
      regulation: research.regulators,
      founded: research.foundingYear,
      minDeposit: research.minDeposit,
      maxLeverage: research.maxLeverage,
      
      spreads: {
        EUR_USD: research.spreads.eurusd,
        GBP_USD: research.spreads.gbpusd,
        USD_JPY: research.spreads.usdjpy
      },
      
      platforms: research.platforms,
      accountTypes: research.accountTypes.map(acc => acc.name),
      assets: this.generateAssetsArray(research),
      
      ratings: this.calculateRatings(research),
      
      pros: this.generatePros(research),
      cons: this.generateCons(research),
      
      fees: this.transformFees(research),
      
      executionType: research.executionType,
      support: research.customerSupport,
      languages: research.languages,
      lastUpdated: research.lastResearched.toISOString().split('T')[0]
    };
  }

  /**
   * Generate broker description based on research data
   */
  private static generateBrokerDescription(research: BrokerResearchData): string {
    const founded = research.foundingYear;
    const headquarters = research.headquarters;
    const mainRegulator = research.regulators[0] || 'regulated';
    
    return `${research.name} is a ${mainRegulator}-regulated broker established in ${founded} and headquartered in ${headquarters}. ` +
           `Offering ${research.platforms.length} trading platforms with access to ${research.forexPairs} forex pairs, ` +
           `${research.stocks} stocks, and various other instruments with a minimum deposit of $${research.minDeposit}.`;
  }

  /**
   * Extract country from headquarters string
   */
  private static extractCountryFromHeadquarters(headquarters: string): string {
    // Extract the last part after the last comma (typically the country)
    const parts = headquarters.split(',').map(part => part.trim());
    return parts[parts.length - 1];
  }

  /**
   * Generate assets array from research data
   */
  private static generateAssetsArray(research: BrokerResearchData): string[] {
    const assets: string[] = [];
    
    if (research.forexPairs > 0) assets.push(`${research.forexPairs} Forex Pairs`);
    if (research.stocks > 0) assets.push(`${research.stocks} Stocks`);
    if (research.indices > 0) assets.push(`${research.indices} Indices`);
    if (research.commodities > 0) assets.push(`${research.commodities} Commodities`);
    if (research.cryptocurrencies > 0) assets.push(`${research.cryptocurrencies} Cryptocurrencies`);
    
    return assets;
  }

  /**
   * Calculate ratings based on broker characteristics
   */
  private static calculateRatings(research: BrokerResearchData): BrokerData['ratings'] {
    // Rating algorithm based on broker characteristics
    const regulationScore = this.calculateRegulationScore(research.regulators);
    const spreadsScore = this.calculateSpreadsScore(research.spreads.eurusd);
    const platformsScore = this.calculatePlatformsScore(research.platforms);
    const executionScore = this.calculateExecutionScore(research.executionType);
    const supportScore = this.calculateSupportScore(research.customerSupport);
    
    const overall = (regulationScore + spreadsScore + platformsScore + executionScore + supportScore) / 5;
    
    return {
      overall: Math.round(overall * 10) / 10,
      spreads: spreadsScore,
      platforms: platformsScore,
      execution: executionScore,
      support: supportScore,
      regulation: regulationScore
    };
  }

  /**
   * Calculate regulation score (1-5)
   */
  private static calculateRegulationScore(regulators: string[]): number {
    const topTierRegulators = ['FCA', 'SEC', 'FINRA', 'ASIC', 'CySEC'];
    const hasTopTierRegulator = regulators.some(reg => topTierRegulators.includes(reg));
    
    if (regulators.length >= 3 && hasTopTierRegulator) return 5.0;
    if (regulators.length >= 2 && hasTopTierRegulator) return 4.5;
    if (hasTopTierRegulator) return 4.0;
    if (regulators.length >= 2) return 3.5;
    if (regulators.length >= 1) return 3.0;
    return 2.0;
  }

  /**
   * Calculate spreads score based on EUR/USD spread
   */
  private static calculateSpreadsScore(eurusdSpread: number): number {
    if (eurusdSpread <= 0.2) return 5.0;
    if (eurusdSpread <= 0.5) return 4.5;
    if (eurusdSpread <= 0.8) return 4.0;
    if (eurusdSpread <= 1.2) return 3.5;
    if (eurusdSpread <= 1.8) return 3.0;
    return 2.5;
  }

  /**
   * Calculate platforms score
   */
  private static calculatePlatformsScore(platforms: string[]): number {
    const popularPlatforms = ['MT4', 'MT5', 'cTrader', 'TradingView'];
    const hasPopularPlatform = platforms.some(platform => 
      popularPlatforms.some(popular => platform.toLowerCase().includes(popular.toLowerCase()))
    );
    
    if (platforms.length >= 4 && hasPopularPlatform) return 5.0;
    if (platforms.length >= 3 && hasPopularPlatform) return 4.5;
    if (platforms.length >= 2 && hasPopularPlatform) return 4.0;
    if (hasPopularPlatform) return 3.5;
    if (platforms.length >= 2) return 3.0;
    return 2.5;
  }

  /**
   * Calculate execution score
   */
  private static calculateExecutionScore(executionType: string): number {
    const type = executionType.toLowerCase();
    if (type.includes('dma') || type.includes('ecn')) return 5.0;
    if (type.includes('stp')) return 4.5;
    if (type.includes('market maker')) return 3.5;
    return 3.0;
  }

  /**
   * Calculate support score
   */
  private static calculateSupportScore(support: string[]): number {
    const has24_7 = support.some(s => s.toLowerCase().includes('24') || s.toLowerCase().includes('live'));
    const hasPhone = support.some(s => s.toLowerCase().includes('phone'));
    const hasLiveChat = support.some(s => s.toLowerCase().includes('chat'));
    
    let score = 3.0; // Base score
    if (has24_7) score += 1.0;
    if (hasPhone) score += 0.5;
    if (hasLiveChat) score += 0.5;
    
    return Math.min(score, 5.0);
  }

  /**
   * Generate pros based on broker characteristics
   */
  private static generatePros(research: BrokerResearchData): string[] {
    const pros: string[] = [];
    
    // Low minimum deposit
    if (research.minDeposit === 0) {
      pros.push('No minimum deposit required');
    } else if (research.minDeposit <= 50) {
      pros.push('Low minimum deposit');
    }
    
    // Tight spreads
    if (research.spreads.eurusd <= 0.5) {
      pros.push('Tight spreads from 0.0 pips');
    }
    
    // Strong regulation
    const topTierRegs = ['FCA', 'SEC', 'FINRA', 'ASIC'];
    if (research.regulators.some(reg => topTierRegs.includes(reg))) {
      pros.push('Strong regulatory oversight');
    }
    
    // Popular platforms
    if (research.platforms.some(p => p.toLowerCase().includes('mt4') || p.toLowerCase().includes('mt5'))) {
      pros.push('MetaTrader 4/5 support');
    }
    
    // High leverage
    const leverageNum = parseInt(research.maxLeverage.split(':')[1] || '1');
    if (leverageNum >= 100) {
      pros.push(`High leverage up to ${research.maxLeverage}`);
    }
    
    // Wide instrument selection
    if (research.stocks > 1000) {
      pros.push('Wide selection of tradeable instruments');
    }
    
    // Good customer support
    if (research.customerSupport.some(s => s.toLowerCase().includes('24'))) {
      pros.push('24/5 customer support');
    }
    
    return pros;
  }

  /**
   * Generate cons based on broker characteristics
   */
  private static generateCons(research: BrokerResearchData): string[] {
    const cons: string[] = [];
    
    // High minimum deposit
    if (research.minDeposit >= 500) {
      cons.push('High minimum deposit requirement');
    }
    
    // Wide spreads
    if (research.spreads.eurusd >= 1.5) {
      cons.push('Relatively wide spreads');
    }
    
    // Limited regulation
    if (research.regulators.length <= 1) {
      cons.push('Limited regulatory oversight');
    }
    
    // Limited platforms
    if (research.platforms.length <= 1) {
      cons.push('Limited platform options');
    }
    
    // No crypto
    if (research.cryptocurrencies === 0) {
      cons.push('No cryptocurrency trading available');
    }
    
    // Market maker execution
    if (research.executionType.toLowerCase().includes('market maker')) {
      cons.push('Market maker execution model');
    }
    
    // Limited support languages
    if (research.languages.length <= 2) {
      cons.push('Limited language support');
    }
    
    return cons;
  }

  /**
   * Transform fees information
   */
  private static transformFees(research: BrokerResearchData): BrokerData['fees'] {
    return {
      commission: research.commission,
      deposit: 'Free (varies by method)', // Default assumption
      withdrawal: 'Varies by method', // Default assumption
      inactivity: 'Check with broker' // Default assumption
    };
  }

  /**
   * Batch transform multiple broker research data
   */
  public static transformMultipleBrokers(researchDataArray: BrokerResearchData[]): BrokerData[] {
    return researchDataArray.map(research => this.transformToBrokerData(research));
  }

  /**
   * Update existing broker data with research data
   */
  public static updateExistingBrokerData(
    existingBrokers: BrokerData[], 
    researchData: BrokerResearchData[]
  ): BrokerData[] {
    const researchMap = new Map(researchData.map(r => [r.id, r]));
    
    return existingBrokers.map(existing => {
      const research = researchMap.get(existing.id);
      if (research) {
        // Update with research data while preserving existing structure
        const transformed = this.transformToBrokerData(research);
        return {
          ...existing,
          ...transformed,
          // Preserve any custom fields that might exist
          logo: existing.logo || transformed.logo
        };
      }
      return existing;
    });
  }
}