import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Search Engine Service
 * Provides web search capabilities using SerpAPI with Google Search Engine
 */

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  source: string;
  date?: string;
  favicon?: string;
}

export interface SearchOptions {
  query: string;
  siteRestriction?: string; // e.g., "forexpeacearmy.com"
  num?: number; // Number of results (default: 10)
  location?: string; // Geographic location
  language?: string; // Language code (default: 'en')
  retries?: number; // Number of retry attempts (default: 3)
  cache?: boolean; // Use cached results if available (default: true)
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults?: number;
  searchTime?: number;
  query: string;
  cached: boolean;
  error?: string;
}

export class SearchEngine {
  private readonly serpApiKey: string;
  private readonly baseUrl = 'https://serpapi.com/search';
  private readonly cache = new Map<string, { data: SearchResponse; timestamp: number }>();
  private readonly cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly rateLimitDelay = 1000; // 1 second between requests

  constructor() {
    this.serpApiKey = process.env.SERPAPI_API_KEY || '';
    
    if (!this.serpApiKey) {
      console.warn('⚠️  SERPAPI_API_KEY not found. Web search functionality will be limited.');
    }
  }

  /**
   * Performs a web search using Google via SerpAPI
   */
  public async search(options: SearchOptions): Promise<SearchResponse> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(options);

    // Check cache first
    if (options.cache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }
    }

    // Rate limiting
    await this.enforceRateLimit();

    try {
      const searchParams = this.buildSearchParams(options);
      const response = await this.performSearch(searchParams);
      
      const searchResponse: SearchResponse = {
        results: this.parseSearchResults(response.data),
        totalResults: response.data.search_information?.total_results,
        searchTime: Date.now() - startTime,
        query: options.query,
        cached: false
      };

      // Cache the response
      if (options.cache !== false) {
        this.setCache(cacheKey, searchResponse);
      }

      this.requestCount++;
      console.log(`🔍 Search completed: "${options.query}" (${searchResponse.results.length} results)`);
      
      return searchResponse;

    } catch (error: any) {
      console.error('❌ Search failed:', error.message);
      
      return {
        results: [],
        query: options.query,
        cached: false,
        error: error.message,
        searchTime: Date.now() - startTime
      };
    }
  }

  /**
   * Searches specifically for broker information
   */
  public async searchBrokerInfo(brokerName: string, infoType: string): Promise<SearchResponse> {
    const queries = this.generateBrokerQueries(brokerName, infoType);
    const allResults: SearchResult[] = [];
    let totalSearchTime = 0;

    for (const query of queries) {
      const result = await this.search({
        query,
        num: 5,
        retries: 2
      });

      if (result.results.length > 0) {
        allResults.push(...result.results);
        totalSearchTime += result.searchTime || 0;
      }

      // Stop if we have enough results
      if (allResults.length >= 10) break;
    }

    return {
      results: this.deduplicateResults(allResults).slice(0, 10),
      query: `${brokerName} ${infoType}`,
      cached: false,
      searchTime: totalSearchTime
    };
  }

  /**
   * Searches reliable forex industry sources
   */
  public async searchReliableSources(query: string): Promise<SearchResponse> {
    const reliableSites = [
      'forexpeacearmy.com',
      'fxempire.com',
      'babypips.com',
      'dailyfx.com',
      'investopedia.com',
      'financemagnates.com'
    ];

    const siteQueries = reliableSites.map(site => `${query} site:${site}`);
    const allResults: SearchResult[] = [];
    let totalSearchTime = 0;

    for (const siteQuery of siteQueries.slice(0, 3)) { // Limit to 3 sources to stay within quota
      const result = await this.search({
        query: siteQuery,
        num: 3,
        retries: 1
      });

      if (result.results.length > 0) {
        allResults.push(...result.results.map(r => ({
          ...r,
          source: this.extractDomain(r.link)
        })));
        totalSearchTime += result.searchTime || 0;
      }
    }

    return {
      results: this.deduplicateResults(allResults),
      query,
      cached: false,
      searchTime: totalSearchTime
    };
  }

  /**
   * Gets search statistics and quota usage
   */
  public getSearchStats(): {
    requestCount: number;
    lastRequestTime: number;
    cacheSize: number;
    quotaUsed: number;
  } {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      cacheSize: this.cache.size,
      quotaUsed: (this.requestCount / 100) * 100 // Assuming 100 requests per day limit
    };
  }

  /**
   * Clears the search cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.log('🧹 Search cache cleared');
  }

  // Private methods

  private generateBrokerQueries(brokerName: string, infoType: string): string[] {
    const cleanBrokerName = brokerName.replace(/[^a-zA-Z0-9\s]/g, '');
    
    const queryTemplates = {
      'regulation': [
        `${cleanBrokerName} broker regulation license`,
        `${cleanBrokerName} FCA ASIC CySEC license`,
        `${cleanBrokerName} regulatory status 2024`
      ],
      'spreads': [
        `${cleanBrokerName} spreads commission fees`,
        `${cleanBrokerName} EUR/USD spread`,
        `${cleanBrokerName} trading costs 2024`
      ],
      'deposit': [
        `${cleanBrokerName} minimum deposit requirement`,
        `${cleanBrokerName} account opening deposit`,
        `${cleanBrokerName} deposit methods`
      ],
      'platforms': [
        `${cleanBrokerName} trading platforms MT4 MT5`,
        `${cleanBrokerName} platform features`,
        `${cleanBrokerName} cTrader web platform`
      ],
      'review': [
        `${cleanBrokerName} broker review 2024`,
        `${cleanBrokerName} customer reviews rating`,
        `${cleanBrokerName} pros cons analysis`
      ]
    };

    return queryTemplates[infoType as keyof typeof queryTemplates] || 
           [`${cleanBrokerName} broker ${infoType}`];
  }

  private buildSearchParams(options: SearchOptions): Record<string, string> {
    const params: Record<string, string> = {
      engine: 'google',
      api_key: this.serpApiKey,
      q: options.siteRestriction ? `${options.query} site:${options.siteRestriction}` : options.query,
      num: (options.num || 10).toString(),
      hl: options.language || 'en',
      gl: options.location || 'us'
    };

    return params;
  }

  private async performSearch(params: Record<string, string>): Promise<any> {
    const retries = 3;
    let lastError: Error;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(this.baseUrl, {
          params,
          timeout: 10000,
          headers: {
            'User-Agent': 'Broker-Analysis-Tool/1.0'
          }
        });

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        return response;

      } catch (error: any) {
        lastError = error;
        
        if (attempt < retries) {
          console.warn(`⚠️  Search attempt ${attempt} failed, retrying...`);
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  private parseSearchResults(data: any): SearchResult[] {
    const results: SearchResult[] = [];

    if (data.organic_results) {
      data.organic_results.forEach((result: any, index: number) => {
        results.push({
          title: result.title || '',
          link: result.link || '',
          snippet: result.snippet || '',
          position: result.position || index + 1,
          source: this.extractDomain(result.link || ''),
          date: result.date,
          favicon: result.favicon
        });
      });
    }

    return results;
  }

  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  }

  private deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = `${result.title}${result.link}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private generateCacheKey(options: SearchOptions): string {
    return `${options.query}_${options.siteRestriction || 'all'}_${options.num || 10}`;
  }

  private getFromCache(key: string): SearchResponse | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    
    return null;
  }

  private setCache(key: string, data: SearchResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Clean up old cache entries
    if (this.cache.size > 100) {
      const oldest = Math.min(...Array.from(this.cache.values()).map(v => v.timestamp));
      for (const [k, v] of this.cache.entries()) {
        if (v.timestamp === oldest) {
          this.cache.delete(k);
          break;
        }
      }
    }
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastRequest;
      await this.delay(delay);
    }
    
    this.lastRequestTime = Date.now();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const searchEngine = new SearchEngine();