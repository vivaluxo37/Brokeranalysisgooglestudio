import { createClient } from '@supabase/supabase-js';

// Database service for broker operations
// This replaces the static brokers.ts file with dynamic database queries

interface BrokerData {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  score: number;
  foundingYear: number;
  headquarters: string;
  description: string;
  summary: string;
  brokerType: string;
  mobileTrading: boolean;
  demoAccount: boolean;
}

interface BrokerFees {
  spreadType: string;
  eurUsdSpread: number;
  gbpUsdSpread: number;
  usdJpySpread: number;
  commissionStructure: string;
  overnightSwapFees: string;
  inactivityFee: string;
  withdrawalFee: string;
  depositFee: string;
  maxLeverage: string;
  minLotSize: number;
}

interface BrokerPlatform {
  name: string;
  type: string;
  apiAccess: boolean;
  eaSupport: boolean;
  indicatorsCount: number;
  drawingToolsCount: number;
}

interface BrokerRegulation {
  regulator: string;
  licenseNumber: string;
  jurisdiction: string;
}

interface CompleteBrokerData extends BrokerData {
  fees: BrokerFees;
  platforms: BrokerPlatform[];
  regulations: BrokerRegulation[];
  accountTypes: any[];
  instruments: any[];
  prosAndCons: { pros: string[], cons: string[] };
  ratings: any;
  support: any;
  reviews: any[];
}

class BrokerDatabaseService {
  private supabase;

  constructor() {
    // Initialize Supabase connection with correct project details
    this.supabase = createClient(
      'https://sdanjzsxwczlwsgspihb.supabase.co',
      'sbp_a008ee810fd64e9c06e14a517d53ba1878f74e8c'
    );
  }

  // Get all brokers with basic information (for listings)
  async getAllBrokers(): Promise<BrokerData[]> {
    const { data, error } = await this.supabase
      .from('brokers')
      .select('*')
      .order('score', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get top brokers by score
  async getTopBrokers(limit = 20): Promise<BrokerData[]> {
    const { data, error } = await this.supabase
      .from('brokers')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Get complete broker data for detail page
  async getBrokerById(brokerId: string): Promise<CompleteBrokerData | null> {
    try {
      // Get basic broker info
      const { data: broker, error: brokerError } = await this.supabase
        .from('brokers')
        .select('*')
        .eq('id', brokerId)
        .single();

      if (brokerError || !broker) return null;

      // Get all related data in parallel
      const [
        feesData,
        platformsData,
        regulationsData,
        accountTypesData,
        instrumentsData,
        prosConsData,
        ratingsData,
        supportData,
        reviewsData
      ] = await Promise.all([
        this.getBrokerFees(brokerId),
        this.getBrokerPlatforms(brokerId),
        this.getBrokerRegulations(brokerId),
        this.getBrokerAccountTypes(brokerId),
        this.getBrokerInstruments(brokerId),
        this.getBrokerProsAndCons(brokerId),
        this.getBrokerRatings(brokerId),
        this.getBrokerSupport(brokerId),
        this.getBrokerReviews(brokerId)
      ]);

      return {
        ...broker,
        fees: feesData,
        platforms: platformsData,
        regulations: regulationsData,
        accountTypes: accountTypesData,
        instruments: instrumentsData,
        prosAndCons: prosConsData,
        ratings: ratingsData,
        support: supportData,
        reviews: reviewsData
      };
    } catch (error) {
      console.error('Error fetching broker data:', error);
      return null;
    }
  }

  // Helper methods for related data
  private async getBrokerFees(brokerId: string): Promise<BrokerFees> {
    const { data, error } = await this.supabase
      .from('broker_fees')
      .select('*')
      .eq('broker_id', brokerId)
      .single();

    if (error) throw error;
    return data;
  }

  private async getBrokerPlatforms(brokerId: string): Promise<BrokerPlatform[]> {
    const { data, error } = await this.supabase
      .from('broker_platforms')
      .select('*')
      .eq('broker_id', brokerId);

    if (error) throw error;
    return data || [];
  }

  private async getBrokerRegulations(brokerId: string): Promise<BrokerRegulation[]> {
    const { data, error } = await this.supabase
      .from('broker_regulations')
      .select('*')
      .eq('broker_id', brokerId);

    if (error) throw error;
    return data || [];
  }

  private async getBrokerAccountTypes(brokerId: string): Promise<any[]> {
    // Note: No account types table in schema.sql, we'll store this as JSON in broker table
    return [];
  }

  private async getBrokerInstruments(brokerId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('broker_trading_instruments')
      .select('*')
      .eq('broker_id', brokerId);

    if (error) throw error;
    return data || [];
  }

  private async getBrokerProsAndCons(brokerId: string): Promise<{ pros: string[], cons: string[] }> {
    // Note: No pros/cons table in schema.sql, we'll store this as JSON in broker table
    return { pros: [], cons: [] };
  }

  private async getBrokerRatings(brokerId: string): Promise<any> {
    // Note: No ratings table in schema.sql, we'll store this as columns in broker table
    return null;
  }

  private async getBrokerSupport(brokerId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('broker_customer_support')
      .select('*')
      .eq('broker_id', brokerId);

    if (error) throw error;
    return data || [];
  }

  private async getBrokerReviews(brokerId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('broker_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Search brokers
  async searchBrokers(query: string): Promise<BrokerData[]> {
    const { data, error } = await this.supabase
      .from('brokers')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('score', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Filter brokers
  async filterBrokers(filters: {
    minScore?: number;
    maxScore?: number;
    brokerType?: string;
    regulation?: string;
    minDeposit?: number;
    maxDeposit?: number;
  }): Promise<BrokerData[]> {
    let query = this.supabase.from('brokers').select('*');

    if (filters.minScore) {
      query = query.gte('score', filters.minScore);
    }
    if (filters.maxScore) {
      query = query.lte('score', filters.maxScore);
    }
    if (filters.brokerType) {
      query = query.eq('broker_type', filters.brokerType);
    }

    query = query.order('score', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Add new broker (admin function)
  async addBroker(brokerData: BrokerData): Promise<void> {
    const { error } = await this.supabase
      .from('brokers')
      .insert([brokerData]);

    if (error) throw error;
  }

  // Update broker (admin function)
  async updateBroker(brokerId: string, updates: Partial<BrokerData>): Promise<void> {
    const { error } = await this.supabase
      .from('brokers')
      .update(updates)
      .eq('id', brokerId);

    if (error) throw error;
  }

  // Cache management
  private cache = new Map();
  private cacheExpiry = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getCachedBrokerData(brokerId: string): Promise<CompleteBrokerData | null> {
    const cacheKey = `broker_${brokerId}`;
    const now = Date.now();

    // Check if cached data exists and is not expired
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey) > now) {
      return this.cache.get(cacheKey);
    }

    // Fetch fresh data
    const data = await this.getBrokerById(brokerId);
    
    if (data) {
      this.cache.set(cacheKey, data);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
    }

    return data;
  }

  // Clear cache for a specific broker
  clearBrokerCache(brokerId: string): void {
    const cacheKey = `broker_${brokerId}`;
    this.cache.delete(cacheKey);
    this.cacheExpiry.delete(cacheKey);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const brokerDatabaseService = new BrokerDatabaseService();
export default brokerDatabaseService;