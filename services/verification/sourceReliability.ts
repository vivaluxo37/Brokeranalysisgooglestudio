import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Source Reliability Management System
 * Tracks and scores the reliability of different data sources
 */

export interface DataSource {
  id?: string;
  domain: string;
  name: string;
  category: 'regulatory' | 'news' | 'review' | 'broker_official' | 'analysis';
  reliabilityScore: number; // 1-10 scale
  successRate: number; // 0-1 (percentage of successful verifications)
  totalChecks: number;
  successfulChecks: number;
  lastReviewed: Date;
  notes?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SourceVerification {
  id?: string;
  sourceId: string;
  domain: string;
  brokerName: string;
  dataType: string;
  isAccurate: boolean;
  confidence: number;
  verifiedAt: Date;
  notes?: string;
}

export interface ReliabilityMetrics {
  totalSources: number;
  averageReliability: number;
  topReliableSources: DataSource[];
  bottomReliableSources: DataSource[];
  categoryBreakdown: { [category: string]: { count: number; avgReliability: number } };
  recentUpdates: number;
}

export class SourceReliabilityManager {
  private supabase: any;
  private cache = new Map<string, DataSource>();
  private cacheTimeout = 60 * 60 * 1000; // 1 hour

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.warn('⚠️  Supabase not configured. Using in-memory source reliability.');
    }

    this.initializeDefaultSources();
  }

  /**
   * Gets reliability score for a domain
   */
  public async getSourceReliability(domain: string): Promise<number> {
    const source = await this.getSource(domain);
    return source ? source.reliabilityScore : this.getDefaultReliabilityScore(domain);
  }

  /**
   * Updates source reliability based on verification results
   */
  public async updateSourceReliability(
    domain: string, 
    isAccurate: boolean, 
    confidence: number, 
    context: string
  ): Promise<void> {
    let source = await this.getSource(domain);
    
    if (!source) {
      // Create new source if it doesn't exist
      source = {
        domain,
        name: this.extractSourceName(domain),
        category: this.categorizeSource(domain),
        reliabilityScore: this.getDefaultReliabilityScore(domain),
        successRate: 0,
        totalChecks: 0,
        successfulChecks: 0,
        lastReviewed: new Date(),
        isActive: true
      };
    }

    // Update verification statistics
    source.totalChecks++;
    if (isAccurate && confidence > 0.5) {
      source.successfulChecks++;
    }
    source.successRate = source.successfulChecks / source.totalChecks;
    source.lastReviewed = new Date();
    source.updatedAt = new Date();

    // Adjust reliability score based on performance
    source.reliabilityScore = this.calculateUpdatedReliabilityScore(source, isAccurate, confidence);

    // Save to database or cache
    await this.saveSource(source);

    // Record the verification
    await this.recordVerification(source, isAccurate, confidence, context);

    console.log(`📊 Updated reliability for ${domain}: ${source.reliabilityScore}/10 (${(source.successRate * 100).toFixed(1)}% success)`);
  }

  /**
   * Gets all sources with their reliability scores
   */
  public async getAllSources(): Promise<DataSource[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('data_sources')
          .select('*')
          .order('reliability_score', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Failed to fetch sources from database:', error);
      }
    }

    // Fallback to cache/memory
    return Array.from(this.cache.values()).sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  }

  /**
   * Gets reliability metrics and analytics
   */
  public async getReliabilityMetrics(): Promise<ReliabilityMetrics> {
    const sources = await this.getAllSources();
    
    const totalSources = sources.length;
    const averageReliability = sources.reduce((sum, s) => sum + s.reliabilityScore, 0) / totalSources;
    
    const topReliableSources = sources
      .filter(s => s.totalChecks > 5) // Only sources with sufficient data
      .slice(0, 10);
    
    const bottomReliableSources = sources
      .filter(s => s.totalChecks > 5)
      .slice(-10)
      .reverse();

    // Category breakdown
    const categoryBreakdown: { [category: string]: { count: number; avgReliability: number } } = {};
    sources.forEach(source => {
      if (!categoryBreakdown[source.category]) {
        categoryBreakdown[source.category] = { count: 0, avgReliability: 0 };
      }
      categoryBreakdown[source.category].count++;
      categoryBreakdown[source.category].avgReliability += source.reliabilityScore;
    });

    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category].avgReliability /= categoryBreakdown[category].count;
    });

    const recentUpdates = sources.filter(s => 
      s.lastReviewed && (Date.now() - s.lastReviewed.getTime()) < (7 * 24 * 60 * 60 * 1000) // Last 7 days
    ).length;

    return {
      totalSources,
      averageReliability: Math.round(averageReliability * 100) / 100,
      topReliableSources,
      bottomReliableSources,
      categoryBreakdown,
      recentUpdates
    };
  }

  /**
   * Ranks sources by reliability for a specific category
   */
  public async getSourcesByCategory(category: string): Promise<DataSource[]> {
    const allSources = await this.getAllSources();
    return allSources
      .filter(s => s.category === category && s.isActive)
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  }

  /**
   * Gets recommended sources for broker verification
   */
  public async getRecommendedSources(purpose: 'regulation' | 'pricing' | 'review' = 'review'): Promise<DataSource[]> {
    const categoryMap = {
      'regulation': ['regulatory', 'news'],
      'pricing': ['broker_official', 'analysis', 'review'],
      'review': ['review', 'analysis', 'news']
    };

    const relevantCategories = categoryMap[purpose];
    const allSources = await this.getAllSources();

    return allSources
      .filter(s => 
        relevantCategories.includes(s.category) && 
        s.isActive && 
        s.reliabilityScore >= 6 // Only recommend reasonably reliable sources
      )
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
      .slice(0, 10);
  }

  // Private methods

  private async getSource(domain: string): Promise<DataSource | null> {
    // Check cache first
    const cached = this.cache.get(domain);
    if (cached) return cached;

    // Check database
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('data_sources')
          .select('*')
          .eq('domain', domain)
          .single();

        if (!error && data) {
          const source = this.mapDatabaseToSource(data);
          this.cache.set(domain, source);
          return source;
        }
      } catch (error) {
        // Source doesn't exist, which is fine
      }
    }

    return null;
  }

  private async saveSource(source: DataSource): Promise<void> {
    // Update cache
    this.cache.set(source.domain, source);

    // Save to database
    if (this.supabase) {
      try {
        const dbData = this.mapSourceToDatabase(source);
        
        const { error } = await this.supabase
          .from('data_sources')
          .upsert(dbData);

        if (error) {
          console.error('Failed to save source to database:', error);
        }
      } catch (error) {
        console.error('Database save error:', error);
      }
    }
  }

  private async recordVerification(
    source: DataSource, 
    isAccurate: boolean, 
    confidence: number, 
    context: string
  ): Promise<void> {
    if (!this.supabase) return;

    try {
      const verification: Omit<SourceVerification, 'id'> = {
        sourceId: source.id || source.domain,
        domain: source.domain,
        brokerName: context.split(' ')[0] || 'unknown',
        dataType: context,
        isAccurate,
        confidence,
        verifiedAt: new Date(),
        notes: `Auto-generated verification record`
      };

      const { error } = await this.supabase
        .from('source_verifications')
        .insert(verification);

      if (error) {
        console.error('Failed to record verification:', error);
      }
    } catch (error) {
      console.error('Verification recording error:', error);
    }
  }

  private calculateUpdatedReliabilityScore(
    source: DataSource, 
    isAccurate: boolean, 
    confidence: number
  ): number {
    const currentScore = source.reliabilityScore;
    const successRate = source.successRate;
    const totalChecks = source.totalChecks;

    // Weight recent performance more heavily for sources with more data
    const recentWeight = Math.min(totalChecks / 20, 0.8); // Max 80% weight for recent data
    const historicalWeight = 1 - recentWeight;

    // Calculate impact of current verification
    let currentImpact = 0;
    if (isAccurate && confidence > 0.7) {
      currentImpact = 0.2; // Small positive adjustment
    } else if (isAccurate && confidence > 0.5) {
      currentImpact = 0.1;
    } else if (!isAccurate) {
      currentImpact = -0.3; // Negative adjustment for inaccurate data
    }

    // Combine historical performance with current result
    const baseScore = (successRate * 10); // Convert success rate to 1-10 scale
    const adjustedScore = currentScore + currentImpact;
    
    // Weighted combination
    const newScore = (historicalWeight * baseScore) + (recentWeight * adjustedScore);

    // Ensure score stays within bounds and apply some smoothing
    return Math.max(1, Math.min(10, Math.round(newScore * 10) / 10));
  }

  private getDefaultReliabilityScore(domain: string): number {
    const reliabilityMap: { [key: string]: number } = {
      // Regulatory authorities (highest reliability)
      'fca.org.uk': 10,
      'asic.gov.au': 10,
      'cysec.gov.cy': 10,
      'finra.org': 10,
      'sec.gov': 10,
      
      // Established forex industry sites
      'forexpeacearmy.com': 8,
      'fxempire.com': 7,
      'babypips.com': 7,
      'dailyfx.com': 7,
      'investopedia.com': 8,
      'financemagnates.com': 7,
      
      // Broker official sites (medium-high reliability for their own data)
      'pepperstone.com': 6,
      'icmarkets.com': 6,
      'plus500.com': 6,
      'etoro.com': 6,
      
      // General financial news
      'bloomberg.com': 8,
      'reuters.com': 8,
      'ft.com': 8,
      'wsj.com': 8
    };

    // Check exact match first
    if (reliabilityMap[domain]) {
      return reliabilityMap[domain];
    }

    // Check for partial matches
    for (const [knownDomain, score] of Object.entries(reliabilityMap)) {
      if (domain.includes(knownDomain) || knownDomain.includes(domain)) {
        return score;
      }
    }

    // Default scores by domain patterns
    if (domain.includes('.gov')) return 9; // Government sites
    if (domain.includes('.org')) return 6; // Organizations
    if (domain.includes('.edu')) return 7; // Educational institutions
    if (domain.includes('broker') || domain.includes('trading')) return 5; // Trading-related sites
    
    return 4; // Default for unknown sources
  }

  private categorizeSource(domain: string): DataSource['category'] {
    if (domain.includes('.gov') || ['fca.org.uk', 'asic.gov.au', 'cysec.gov.cy'].includes(domain)) {
      return 'regulatory';
    }
    
    if (['forexpeacearmy.com', 'trustpilot.com'].some(review => domain.includes(review))) {
      return 'review';
    }
    
    if (['bloomberg.com', 'reuters.com', 'financemagnates.com'].some(news => domain.includes(news))) {
      return 'news';
    }
    
    if (['fxempire.com', 'babypips.com', 'investopedia.com'].some(analysis => domain.includes(analysis))) {
      return 'analysis';
    }
    
    return 'broker_official'; // Default assumption for unknown sources
  }

  private extractSourceName(domain: string): string {
    const nameMap: { [key: string]: string } = {
      'forexpeacearmy.com': 'Forex Peace Army',
      'fxempire.com': 'FX Empire',
      'babypips.com': 'Baby Pips',
      'dailyfx.com': 'DailyFX',
      'investopedia.com': 'Investopedia',
      'financemagnates.com': 'Finance Magnates',
      'fca.org.uk': 'Financial Conduct Authority',
      'asic.gov.au': 'ASIC',
      'cysec.gov.cy': 'CySEC'
    };

    return nameMap[domain] || domain.replace('www.', '').replace('.com', '').toUpperCase();
  }

  private initializeDefaultSources(): void {
    // Initialize with known reliable sources
    const defaultSources: DataSource[] = [
      {
        domain: 'fca.org.uk',
        name: 'Financial Conduct Authority',
        category: 'regulatory',
        reliabilityScore: 10,
        successRate: 0.95,
        totalChecks: 0,
        successfulChecks: 0,
        lastReviewed: new Date(),
        isActive: true
      },
      {
        domain: 'forexpeacearmy.com',
        name: 'Forex Peace Army',
        category: 'review',
        reliabilityScore: 8,
        successRate: 0.8,
        totalChecks: 0,
        successfulChecks: 0,
        lastReviewed: new Date(),
        isActive: true
      },
      {
        domain: 'fxempire.com',
        name: 'FX Empire',
        category: 'analysis',
        reliabilityScore: 7,
        successRate: 0.75,
        totalChecks: 0,
        successfulChecks: 0,
        lastReviewed: new Date(),
        isActive: true
      }
    ];

    // Add to cache
    defaultSources.forEach(source => {
      this.cache.set(source.domain, source);
    });
  }

  private mapDatabaseToSource(dbData: any): DataSource {
    return {
      id: dbData.id,
      domain: dbData.domain,
      name: dbData.name,
      category: dbData.category,
      reliabilityScore: dbData.reliability_score,
      successRate: dbData.success_rate,
      totalChecks: dbData.total_checks || 0,
      successfulChecks: dbData.successful_checks || 0,
      lastReviewed: new Date(dbData.last_reviewed),
      notes: dbData.notes,
      isActive: dbData.is_active,
      createdAt: dbData.created_at ? new Date(dbData.created_at) : undefined,
      updatedAt: dbData.updated_at ? new Date(dbData.updated_at) : undefined
    };
  }

  private mapSourceToDatabase(source: DataSource): any {
    return {
      id: source.id,
      domain: source.domain,
      name: source.name,
      category: source.category,
      reliability_score: source.reliabilityScore,
      success_rate: source.successRate,
      total_checks: source.totalChecks,
      successful_checks: source.successfulChecks,
      last_reviewed: source.lastReviewed.toISOString(),
      notes: source.notes,
      is_active: source.isActive,
      created_at: source.createdAt?.toISOString(),
      updated_at: source.updatedAt?.toISOString() || new Date().toISOString()
    };
  }
}

// Export singleton instance
export const sourceReliabilityManager = new SourceReliabilityManager();