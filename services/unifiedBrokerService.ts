import { brokerDatabaseService } from './brokerDatabaseService';
import { brokers as staticBrokers } from '../data/brokers';
import type { Broker } from '../types';

/**
 * Unified Broker Service
 * 
 * This service acts as the single source of truth for broker data.
 * It tries to fetch from the database first, and falls back to static data if needed.
 * 
 * This ensures that even if the database is down or missing data,
 * the application continues to work with the original broker data.
 */
class UnifiedBrokerService {
  private cache: Broker[] | null = null;
  private cacheExpiry = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all brokers - tries database first, falls back to static data
   */
  async getBrokers(): Promise<Broker[]> {
    // Return cached data if valid
    if (this.cache && Date.now() < this.cacheExpiry) {
      return this.cache;
    }

    try {
      console.log('🔄 Attempting to fetch brokers from database...');
      
      // Try to get brokers from database
      const dbBrokers = await brokerDatabaseService.getAllBrokers();
      
      if (dbBrokers && dbBrokers.length > 0) {
        console.log(`✅ Successfully fetched ${dbBrokers.length} brokers from database`);
        
        // Transform database brokers to match the Broker interface
        const transformedBrokers = dbBrokers.map(this.transformDatabaseBroker);
        
        // Cache the result
        this.cache = transformedBrokers;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        return transformedBrokers;
      }
    } catch (error) {
      console.warn('⚠️ Database fetch failed, falling back to static data:', error);
    }

    // Fallback to static data
    console.log(`📁 Using static broker data (${staticBrokers.length} brokers)`);
    
    // Cache static data as well
    this.cache = staticBrokers;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
    
    return staticBrokers;
  }

  /**
   * Get a single broker by ID
   */
  async getBrokerById(brokerId: string): Promise<Broker | null> {
    const brokers = await this.getBrokers();
    return brokers.find(broker => broker.id === brokerId) || null;
  }

  /**
   * Search brokers by name or description
   */
  async searchBrokers(query: string): Promise<Broker[]> {
    const brokers = await this.getBrokers();
    const lowerQuery = query.toLowerCase();
    
    return brokers.filter(broker => 
      broker.name.toLowerCase().includes(lowerQuery) ||
      broker.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get featured brokers
   */
  async getFeaturedBrokers(limit = 10): Promise<Broker[]> {
    const brokers = await this.getBrokers();
    return brokers
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }

  /**
   * Clear cache to force refresh
   */
  clearCache(): void {
    this.cache = null;
    this.cacheExpiry = 0;
  }

  /**
   * Transform database broker to match Broker interface
   */
  private transformDatabaseBroker(dbBroker: any): Broker {
    // If the database broker already matches the Broker interface, return as is
    if (dbBroker.regulation && dbBroker.tradingConditions && dbBroker.technology) {
      return dbBroker;
    }

    // Otherwise, transform from database format to Broker format
    return {
      id: dbBroker.slug || dbBroker.id,
      name: dbBroker.name,
      logoUrl: dbBroker.logo_url || `/broker-logos/${dbBroker.slug}.png`,
      websiteUrl: dbBroker.website,
      score: dbBroker.overall_rating || dbBroker.trust_score || 0,
      foundingYear: dbBroker.year_founded || dbBroker.founding_year,
      headquarters: dbBroker.headquarters || 'Not specified',
      description: dbBroker.description || '',
      summary: dbBroker.description || '',
      
      // Transform complex data from JSONB or provide defaults
      pros: dbBroker.pros || [],
      cons: dbBroker.cons || [],
      
      accessibility: {
        minDeposit: dbBroker.minimum_deposit || 0,
        depositMethods: [],
        withdrawalMethods: [],
        customerSupport: []
      },
      
      regulation: {
        regulators: [dbBroker.regulation_status].filter(Boolean),
        clientFundSeparation: true,
        protectionSchemes: [],
        compensationSchemes: []
      },
      
      tradingConditions: {
        spreads: {
          eurusd: '1.0',
          gbpusd: '1.5',
          usdjpy: '1.2'
        },
        commission: 'No commission',
        maxLeverage: '1:100',
        minLotSize: 0.01
      },
      
      technology: {
        platforms: ['MetaTrader 4', 'WebTrader'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: true
      },
      
      // Other required fields with defaults
      accountTypes: dbBroker.account_types || [],
      fees: dbBroker.fees || {},
      coreInfo: {
        brokerType: dbBroker.broker_type || 'Market Maker',
        mobileTrading: dbBroker.mobile_trading || true,
        demoAccount: dbBroker.demo_account || true
      },
      
      ratings: {
        regulation: dbBroker.overall_rating || 4,
        costs: dbBroker.overall_rating || 4,
        platforms: dbBroker.overall_rating || 4,
        support: dbBroker.overall_rating || 4
      },
      
      customerSupport: {
        languages: ['English'],
        hours: '24/5',
        channels: ['Email', 'Live Chat']
      },
      
      tradableInstruments: {
        forexPairs: 50,
        stocks: 100,
        commodities: 10,
        indices: 20,
        cryptocurrencies: 5
      },

      security: dbBroker.security || {},
      tradingEnvironment: {},
      platformFeatures: {
        copyTrading: { available: false },
        charting: { indicators: 50, drawingTools: 20 }
      },
      accountManagement: {
        islamicAccount: { available: false }
      },
      transparency: {},
      reviews: []
    };
  }
}

// Create and export singleton instance
export const unifiedBrokerService = new UnifiedBrokerService();
export default unifiedBrokerService;