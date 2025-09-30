import { createClient } from '@supabase/supabase-js';

// Types for broker ranking
export interface BrokerScore {
  broker_id: number;
  broker_name: string;
  total_score: number;
  score_breakdown: {
    regulation: number;
    execution_spreads: number;
    fees_commissions: number;
    withdrawal_reliability: number;
    platform_features: number;
    country_availability: number;
    user_reviews: number;
  };
  category_match_score?: number;
  country_available?: boolean;
  evidence_urls?: string[];
}

export interface RankingWeights {
  regulation: number;
  execution_spreads: number;
  fees_commissions: number;
  withdrawal_reliability: number;
  platform_features: number;
  country_availability: number;
  user_reviews: number;
}

export interface RankingOptions {
  categorySlug?: string;
  countrySlug?: string;
  limit?: number;
  minScore?: number;
  onlyAvailable?: boolean;
}

export class BrokerRankingEngine {
  private supabase;
  private weights: RankingWeights | null = null;
  private weightsLastFetched = 0;
  private readonly WEIGHTS_CACHE_DURATION = 300000; // 5 minutes

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Get ranking weights from database (cached)
   */
  private async getRankingWeights(): Promise<RankingWeights> {
    const now = Date.now();
    
    // Use cached weights if available and not expired
    if (this.weights && (now - this.weightsLastFetched) < this.WEIGHTS_CACHE_DURATION) {
      return this.weights;
    }

    try {
      const { data, error } = await this.supabase
        .from('ranking_weights')
        .select('factor_name, weight')
        .eq('is_active', true);

      if (error) {
        throw new Error(`Failed to fetch ranking weights: ${error.message}`);
      }

      // Convert to weights object
      const weights: RankingWeights = {
        regulation: 0.25,
        execution_spreads: 0.20,
        fees_commissions: 0.15,
        withdrawal_reliability: 0.10,
        platform_features: 0.10,
        country_availability: 0.10,
        user_reviews: 0.10,
      };

      // Update with database values
      data?.forEach(item => {
        if (item.factor_name in weights) {
          weights[item.factor_name as keyof RankingWeights] = item.weight;
        }
      });

      this.weights = weights;
      this.weightsLastFetched = now;

      return weights;
    } catch (error) {
      console.error('Error fetching ranking weights:', error);
      
      // Return default weights
      return {
        regulation: 0.25,
        execution_spreads: 0.20,
        fees_commissions: 0.15,
        withdrawal_reliability: 0.10,
        platform_features: 0.10,
        country_availability: 0.10,
        user_reviews: 0.10,
      };
    }
  }

  /**
   * Calculate regulation score based on regulatory strength
   */
  private calculateRegulationScore(broker: any): number {
    if (!broker.regulation_status) return 0;

    const regulations = broker.regulation_status.toLowerCase();
    let score = 0;

    // Top-tier regulators (highest scores)
    if (regulations.includes('fca')) score += 2.5;        // UK FCA
    if (regulations.includes('asic')) score += 2.3;      // Australian ASIC
    if (regulations.includes('cysec')) score += 2.0;     // Cyprus CySEC
    if (regulations.includes('finra') || regulations.includes('sec')) score += 2.5; // US regulators
    if (regulations.includes('bafin')) score += 2.2;     // German BaFin
    if (regulations.includes('finma')) score += 2.4;     // Swiss FINMA
    if (regulations.includes('mas')) score += 2.1;       // Singapore MAS
    if (regulations.includes('jfsa')) score += 2.0;      // Japan FSA

    // Mid-tier regulators
    if (regulations.includes('iiroc')) score += 1.8;     // Canadian IIROC
    if (regulations.includes('afm')) score += 1.7;       // Dutch AFM
    if (regulations.includes('consob')) score += 1.6;    // Italian CONSOB
    if (regulations.includes('cnmv')) score += 1.5;      // Spanish CNMV

    // Multiple regulators bonus
    const regulatorCount = (regulations.match(/fca|asic|cysec|finra|sec|bafin|finma|mas|jfsa/g) || []).length;
    if (regulatorCount > 1) score += regulatorCount * 0.5;

    // Normalize to 0-10 scale
    return Math.min(score * 1.2, 10);
  }

  /**
   * Calculate execution and spreads score
   */
  private calculateExecutionScore(broker: any): number {
    let score = 0;

    // Use overall rating as base if available
    if (broker.overall_rating) {
      score = broker.overall_rating;
    }

    // Adjust based on broker type
    const brokerType = (broker.broker_type || '').toLowerCase();
    if (brokerType.includes('ecn')) score += 1.0;
    if (brokerType.includes('stp')) score += 0.8;
    if (brokerType.includes('dma')) score += 1.2;

    // Penalty for market makers (potential conflict of interest)
    if (brokerType.includes('market maker')) score -= 0.5;

    return Math.max(0, Math.min(score, 10));
  }

  /**
   * Calculate fees and commissions score
   */
  private calculateFeesScore(broker: any): number {
    let score = 7.0; // Default score

    // Lower minimum deposit = better accessibility
    if (broker.minimum_deposit !== null) {
      if (broker.minimum_deposit === 0) score += 1.5;
      else if (broker.minimum_deposit <= 100) score += 1.0;
      else if (broker.minimum_deposit <= 500) score += 0.5;
      else if (broker.minimum_deposit > 2000) score -= 1.0;
    }

    // Check for fee-related features in JSONB data
    if (broker.fees) {
      try {
        const fees = typeof broker.fees === 'string' ? JSON.parse(broker.fees) : broker.fees;
        
        // Check for competitive spreads
        if (fees.trading?.spreadType === 'variable' || fees.trading?.spreadType === 'raw') {
          score += 0.5;
        }
        
        // Penalty for high withdrawal fees
        if (fees.nonTrading?.withdrawalFee && fees.nonTrading.withdrawalFee !== 'free') {
          score -= 0.3;
        }
        
        // Penalty for inactivity fees
        if (fees.nonTrading?.inactivityFee && fees.nonTrading.inactivityFee !== 'none') {
          score -= 0.5;
        }
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    return Math.max(0, Math.min(score, 10));
  }

  /**
   * Calculate platform features score
   */
  private calculatePlatformScore(broker: any): number {
    let score = 5.0; // Base score

    // Check platform availability
    if (broker.platform_features) {
      try {
        const features = typeof broker.platform_features === 'string' 
          ? JSON.parse(broker.platform_features) 
          : broker.platform_features;
        
        // Popular platforms
        if (features.platforms) {
          const platforms = Array.isArray(features.platforms) ? features.platforms : [];
          if (platforms.includes('MT4')) score += 0.8;
          if (platforms.includes('MT5')) score += 1.0;
          if (platforms.includes('cTrader')) score += 0.7;
          if (platforms.includes('TradingView')) score += 0.9;
          if (platforms.includes('Proprietary')) score += 0.6;
        }

        // Advanced features
        if (features.apiAccess) score += 0.5;
        if (features.eaSupport) score += 0.4;
        if (features.copyTrading?.available) score += 0.3;
        if (features.backtesting) score += 0.2;
        
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    // Mobile trading support
    if (broker.mobile_trading) score += 0.5;
    
    // Demo account availability
    if (broker.demo_account) score += 0.3;

    return Math.max(0, Math.min(score, 10));
  }

  /**
   * Calculate country availability score
   */
  private async calculateCountryScore(brokerId: number, countrySlug?: string): Promise<number> {
    if (!countrySlug) return 8.0; // Default score when no country specified

    try {
      const { data, error } = await this.supabase
        .from('broker_country_availability')
        .select(`
          available,
          confidence_level,
          countries!inner(slug)
        `)
        .eq('broker_id', brokerId)
        .eq('countries.slug', countrySlug)
        .single();

      if (error || !data) return 5.0; // Neutral score if no data

      // Score based on availability
      if (data.available === true) {
        // Bonus for high confidence
        if (data.confidence_level === 'high') return 10.0;
        if (data.confidence_level === 'medium') return 8.5;
        return 7.0; // Low confidence or unknown confidence
      }
      
      if (data.available === false) return 0.0; // Not available
      
      return 5.0; // Unknown availability
      
    } catch (error) {
      console.error('Error calculating country score:', error);
      return 5.0; // Neutral score on error
    }
  }

  /**
   * Calculate user reviews score
   */
  private calculateUserReviewsScore(broker: any): number {
    // Use trust score or overall rating as proxy
    if (broker.trust_score) {
      return Math.min(broker.trust_score, 10);
    }
    
    if (broker.overall_rating) {
      return Math.min(broker.overall_rating, 10);
    }
    
    // Default neutral score
    return 6.0;
  }

  /**
   * Calculate category match score
   */
  private calculateCategoryMatchScore(broker: any, categorySlug?: string): number {
    if (!categorySlug) return 10.0; // Full score if no category filtering

    // Simple category matching based on broker attributes
    switch (categorySlug) {
      case 'ecn-brokers':
        return (broker.broker_type || '').toLowerCase().includes('ecn') ? 10.0 : 3.0;
      
      case 'stp-forex-brokers':
        return (broker.broker_type || '').toLowerCase().includes('stp') ? 10.0 : 4.0;
      
      case 'mt4-brokers':
        try {
          const platforms = broker.platform_features ? 
            (typeof broker.platform_features === 'string' ? JSON.parse(broker.platform_features) : broker.platform_features) : {};
          return (platforms.platforms || []).includes('MT4') ? 10.0 : 2.0;
        } catch {
          return 5.0;
        }
      
      case 'mt5-brokers':
        try {
          const platforms = broker.platform_features ? 
            (typeof broker.platform_features === 'string' ? JSON.parse(broker.platform_features) : broker.platform_features) : {};
          return (platforms.platforms || []).includes('MT5') ? 10.0 : 2.0;
        } catch {
          return 5.0;
        }
      
      case 'forex-brokers-beginners':
        // Lower minimum deposit = better for beginners
        if (broker.minimum_deposit === 0) return 10.0;
        if (broker.minimum_deposit <= 50) return 8.5;
        if (broker.minimum_deposit <= 200) return 7.0;
        return 4.0;
      
      case 'islamic-accounts':
        // Check for Islamic account support in features
        try {
          const features = broker.platform_features ? 
            (typeof broker.platform_features === 'string' ? JSON.parse(broker.platform_features) : broker.platform_features) : {};
          return features.islamicAccounts ? 10.0 : 1.0;
        } catch {
          return 5.0;
        }
      
      case 'most-regulated-forex-brokers':
        // Higher regulation score
        return this.calculateRegulationScore(broker);
      
      default:
        return 7.0; // Default category match score
    }
  }

  /**
   * Get brokers for category
   */
  private async getBrokersForCategory(categorySlug?: string): Promise<any[]> {
    if (!categorySlug) {
      // Get all active brokers
      const { data, error } = await this.supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('overall_rating', { ascending: false });

      if (error) throw new Error(`Failed to fetch brokers: ${error.message}`);
      return data || [];
    }

    // Get brokers mapped to this category
    const { data, error } = await this.supabase
      .from('broker_category_map')
      .select(`
        broker_id,
        rank_position,
        brokers!inner(*)
      `)
      .eq('broker_categories.slug', categorySlug)
      .eq('brokers.is_active', true)
      .order('rank_position', { ascending: true });

    if (error) {
      console.warn(`No category mapping found for ${categorySlug}, using all brokers`);
      
      // Fallback: get all brokers
      const { data: allBrokers, error: allError } = await this.supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('overall_rating', { ascending: false });

      if (allError) throw new Error(`Failed to fetch brokers: ${allError.message}`);
      return allBrokers || [];
    }

    return data?.map(item => item.brokers) || [];
  }

  /**
   * Rank brokers based on category and country
   */
  async rankBrokers(options: RankingOptions = {}): Promise<BrokerScore[]> {
    const {
      categorySlug,
      countrySlug,
      limit = 30,
      minScore = 0,
      onlyAvailable = false
    } = options;

    try {
      // Get ranking weights
      const weights = await this.getRankingWeights();
      
      // Get brokers
      const brokers = await this.getBrokersForCategory(categorySlug);
      
      if (brokers.length === 0) {
        return [];
      }

      // Calculate scores for each broker
      const brokerScores: BrokerScore[] = [];

      for (const broker of brokers) {
        // Calculate individual factor scores
        const regulationScore = this.calculateRegulationScore(broker);
        const executionScore = this.calculateExecutionScore(broker);
        const feesScore = this.calculateFeesScore(broker);
        const platformScore = this.calculatePlatformScore(broker);
        const countryScore = await this.calculateCountryScore(broker.id, countrySlug);
        const userReviewsScore = this.calculateUserReviewsScore(broker);
        const categoryMatchScore = this.calculateCategoryMatchScore(broker, categorySlug);

        // Skip if country filtering is on and broker is not available
        if (onlyAvailable && countrySlug && countryScore === 0) {
          continue;
        }

        // Calculate weighted total score
        const totalScore = (
          regulationScore * weights.regulation +
          executionScore * weights.execution_spreads +
          feesScore * weights.fees_commissions +
          7.0 * weights.withdrawal_reliability + // Default score for withdrawal reliability
          platformScore * weights.platform_features +
          countryScore * weights.country_availability +
          userReviewsScore * weights.user_reviews
        );

        // Apply category match bonus (up to 10% boost)
        const finalScore = totalScore * (1 + (categoryMatchScore / 100));

        // Skip if below minimum score
        if (finalScore < minScore) continue;

        brokerScores.push({
          broker_id: broker.id,
          broker_name: broker.name,
          total_score: Math.round(finalScore * 100) / 100,
          score_breakdown: {
            regulation: Math.round(regulationScore * 100) / 100,
            execution_spreads: Math.round(executionScore * 100) / 100,
            fees_commissions: Math.round(feesScore * 100) / 100,
            withdrawal_reliability: 7.0,
            platform_features: Math.round(platformScore * 100) / 100,
            country_availability: Math.round(countryScore * 100) / 100,
            user_reviews: Math.round(userReviewsScore * 100) / 100,
          },
          category_match_score: Math.round(categoryMatchScore * 100) / 100,
          country_available: countryScore > 5.0,
        });
      }

      // Sort by total score (descending) and limit results
      return brokerScores
        .sort((a, b) => b.total_score - a.total_score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error ranking brokers:', error);
      throw new Error(`Failed to rank brokers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get ranked brokers for a specific country
   */
  async getBrokersForCountry(countrySlug: string, limit = 20): Promise<BrokerScore[]> {
    return this.rankBrokers({
      countrySlug,
      limit,
      minScore: 5.0,
      onlyAvailable: true
    });
  }

  /**
   * Get ranked brokers for a specific category
   */
  async getBrokersForCategory(categorySlug: string, limit = 30): Promise<BrokerScore[]> {
    return this.rankBrokers({
      categorySlug,
      limit,
      minScore: 4.0
    });
  }

  /**
   * Update ranking weights (admin function)
   */
  async updateRankingWeights(newWeights: Partial<RankingWeights>): Promise<void> {
    const updates = Object.entries(newWeights).map(([factor, weight]) => ({
      factor_name: factor,
      weight,
      updated_at: new Date().toISOString()
    }));

    const { error } = await this.supabase
      .from('ranking_weights')
      .upsert(updates, { onConflict: 'factor_name' });

    if (error) {
      throw new Error(`Failed to update ranking weights: ${error.message}`);
    }

    // Clear cache to force refresh
    this.weights = null;
    this.weightsLastFetched = 0;
  }
}

// Export singleton instance
let rankingEngine: BrokerRankingEngine | null = null;

export function getRankingEngine(): BrokerRankingEngine {
  if (!rankingEngine) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    rankingEngine = new BrokerRankingEngine(supabaseUrl, supabaseKey);
  }
  
  return rankingEngine;
}