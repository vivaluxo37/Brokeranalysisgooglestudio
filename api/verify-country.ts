import { createClient } from '@supabase/supabase-js';

// Types for country verification
interface VerificationResult {
  broker_id: number;
  country_slug: string;
  available: boolean | null;
  confidence_level: 'high' | 'medium' | 'low' | 'unknown' | 'manual_check';
  evidence_urls: string[];
  evidence_summary: string;
  search_queries: string[];
  checked_at: string;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance_score: number;
}

// Search query templates for country verification
const SEARCH_QUERY_TEMPLATES = {
  accepts_clients: (brokerName: string, country: string) => 
    `"${brokerName}" accepts clients from "${country}"`,
  
  account_opening: (brokerName: string, country: string) => 
    `"${brokerName}" "${country}" account opening`,
  
  terms_conditions: (brokerName: string, country: string) => 
    `"${brokerName}" terms conditions "${country}"`,
  
  prohibited_countries: (brokerName: string, country: string) => 
    `"${brokerName}" prohibited countries "${country}"`,
  
  regulation_territory: (brokerName: string, country: string) => 
    `"${brokerName}" regulation "${country}" territory`,
  
  official_website: (brokerName: string, country: string) => 
    `site:${brokerName.toLowerCase().replace(/\s+/g, '')}.com "${country}"`,
};

// Positive indicators in search results
const POSITIVE_INDICATORS = [
  'accepts clients from',
  'available in',
  'open account',
  'registration available',
  'services available',
  'accepts residents',
  'trading available',
  'account opening',
  'regulated in',
  'licensed in'
];

// Negative indicators in search results
const NEGATIVE_INDICATORS = [
  'not available',
  'restricted country',
  'prohibited',
  'not accepted',
  'excluded',
  'restricted territory',
  'not permitted',
  'embargo',
  'sanctions',
  'blocked'
];

export class CountryVerificationService {
  private supabase;
  private readonly CACHE_DURATION_DAYS = 30;
  private readonly MAX_SEARCHES_PER_VERIFICATION = 4;
  private readonly RATE_LIMIT_DELAY = 2000; // 2 seconds between searches

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Verify if a broker is available in a specific country
   */
  async verifyCountryAvailability(
    brokerId: number, 
    countrySlug: string,
    forceRefresh = false
  ): Promise<VerificationResult> {
    
    try {
      // Check if we have recent cached data
      if (!forceRefresh) {
        const cachedResult = await this.getCachedVerification(brokerId, countrySlug);
        if (cachedResult) {
          return cachedResult;
        }
      }

      // Get broker and country details
      const [broker, country] = await Promise.all([
        this.getBrokerDetails(brokerId),
        this.getCountryDetails(countrySlug)
      ]);

      if (!broker || !country) {
        throw new Error(`Broker or country not found: ${brokerId}, ${countrySlug}`);
      }

      // Perform verification searches
      const verificationResult = await this.performVerificationSearches(
        broker,
        country
      );

      // Save results to database
      await this.saveVerificationResult(brokerId, country.id, verificationResult);

      return {
        broker_id: brokerId,
        country_slug: countrySlug,
        ...verificationResult,
        checked_at: new Date().toISOString()
      };

    } catch (error) {
      console.error('Country verification error:', error);
      throw new Error(`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get cached verification result if available and not expired
   */
  private async getCachedVerification(
    brokerId: number, 
    countrySlug: string
  ): Promise<VerificationResult | null> {
    
    const cacheExpiryDate = new Date();
    cacheExpiryDate.setDate(cacheExpiryDate.getDate() - this.CACHE_DURATION_DAYS);

    try {
      const { data, error } = await this.supabase
        .from('broker_country_availability')
        .select(`
          *,
          countries!inner(slug)
        `)
        .eq('broker_id', brokerId)
        .eq('countries.slug', countrySlug)
        .gte('last_checked_at', cacheExpiryDate.toISOString())
        .single();

      if (error || !data) {
        return null;
      }

      return {
        broker_id: brokerId,
        country_slug: countrySlug,
        available: data.available,
        confidence_level: data.confidence_level,
        evidence_urls: data.evidence_urls || [],
        evidence_summary: data.evidence_summary || '',
        search_queries: data.search_queries || [],
        checked_at: data.last_checked_at
      };

    } catch (error) {
      console.error('Error fetching cached verification:', error);
      return null;
    }
  }

  /**
   * Get broker details from database
   */
  private async getBrokerDetails(brokerId: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('brokers')
      .select('id, name, website')
      .eq('id', brokerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch broker: ${error.message}`);
    }

    return data;
  }

  /**
   * Get country details from database
   */
  private async getCountryDetails(countrySlug: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('countries')
      .select('id, slug, name, iso2')
      .eq('slug', countrySlug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch country: ${error.message}`);
    }

    return data;
  }

  /**
   * Perform verification searches using multiple query templates
   */
  private async performVerificationSearches(
    broker: any, 
    country: any
  ): Promise<Omit<VerificationResult, 'broker_id' | 'country_slug' | 'checked_at'>> {
    
    const searchResults: SearchResult[] = [];
    const usedQueries: string[] = [];

    // Generate search queries
    const queries = [
      SEARCH_QUERY_TEMPLATES.accepts_clients(broker.name, country.name),
      SEARCH_QUERY_TEMPLATES.account_opening(broker.name, country.name),
      SEARCH_QUERY_TEMPLATES.terms_conditions(broker.name, country.name),
      SEARCH_QUERY_TEMPLATES.prohibited_countries(broker.name, country.name)
    ];

    // Perform searches with rate limiting
    for (let i = 0; i < Math.min(queries.length, this.MAX_SEARCHES_PER_VERIFICATION); i++) {
      const query = queries[i];
      usedQueries.push(query);

      try {
        // Simulate search results (in production, you'd use actual search APIs)
        const results = await this.performWebSearch(query);
        searchResults.push(...results);

        // Rate limiting delay
        if (i < queries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
        }

      } catch (error) {
        console.error(`Search failed for query: ${query}`, error);
      }
    }

    // Analyze search results
    const analysis = this.analyzeSearchResults(searchResults, broker.name, country.name);

    return {
      available: analysis.available,
      confidence_level: analysis.confidence_level,
      evidence_urls: analysis.evidence_urls,
      evidence_summary: analysis.evidence_summary,
      search_queries: usedQueries
    };
  }

  /**
   * Perform web search (mock implementation - replace with actual search API)
   */
  private async performWebSearch(query: string): Promise<SearchResult[]> {
    // Mock search results - in production, use SerpAPI, Google Custom Search, or Bing Search API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock results based on query patterns
    const mockResults: SearchResult[] = [];

    if (query.includes('accepts clients')) {
      mockResults.push({
        title: `${query.split('"')[1]} - Account Opening`,
        url: `https://example-broker.com/account-opening`,
        snippet: `We accept clients from ${query.split('"')[3]} subject to regulatory compliance...`,
        relevance_score: 0.85
      });
    }

    if (query.includes('prohibited')) {
      mockResults.push({
        title: `${query.split('"')[1]} - Terms and Conditions`,
        url: `https://example-broker.com/terms`,
        snippet: `Our services are not available to residents of certain restricted countries...`,
        relevance_score: 0.75
      });
    }

    return mockResults;
  }

  /**
   * Analyze search results to determine broker availability
   */
  private analyzeSearchResults(
    results: SearchResult[],
    brokerName: string,
    countryName: string
  ): {
    available: boolean | null;
    confidence_level: 'high' | 'medium' | 'low' | 'unknown' | 'manual_check';
    evidence_urls: string[];
    evidence_summary: string;
  } {

    if (results.length === 0) {
      return {
        available: null,
        confidence_level: 'unknown',
        evidence_urls: [],
        evidence_summary: 'No search results found'
      };
    }

    let positiveScore = 0;
    let negativeScore = 0;
    const evidenceUrls: string[] = [];
    const evidencePieces: string[] = [];

    // Analyze each result
    for (const result of results) {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      const countryLower = countryName.toLowerCase();
      const brokerLower = brokerName.toLowerCase();

      // Skip if not actually about our broker/country
      if (!text.includes(brokerLower) && !text.includes(countryLower)) {
        continue;
      }

      evidenceUrls.push(result.url);

      // Check for positive indicators
      for (const indicator of POSITIVE_INDICATORS) {
        if (text.includes(indicator) && text.includes(countryLower)) {
          positiveScore += result.relevance_score * 1.0;
          evidencePieces.push(`✓ ${indicator}: ${result.snippet}`);
          break;
        }
      }

      // Check for negative indicators
      for (const indicator of NEGATIVE_INDICATORS) {
        if (text.includes(indicator) && text.includes(countryLower)) {
          negativeScore += result.relevance_score * 1.2; // Weight negative slightly higher
          evidencePieces.push(`✗ ${indicator}: ${result.snippet}`);
          break;
        }
      }
    }

    // Determine availability and confidence
    let available: boolean | null = null;
    let confidence_level: 'high' | 'medium' | 'low' | 'unknown' | 'manual_check' = 'unknown';

    if (positiveScore > negativeScore * 1.5) {
      available = true;
      if (positiveScore > 2.0) confidence_level = 'high';
      else if (positiveScore > 1.0) confidence_level = 'medium';
      else confidence_level = 'low';
    } else if (negativeScore > positiveScore * 1.2) {
      available = false;
      if (negativeScore > 2.0) confidence_level = 'high';
      else if (negativeScore > 1.0) confidence_level = 'medium';
      else confidence_level = 'low';
    } else if (positiveScore > 0 && negativeScore > 0) {
      // Conflicting evidence
      available = null;
      confidence_level = 'manual_check';
    }

    return {
      available,
      confidence_level,
      evidence_urls: [...new Set(evidenceUrls)], // Remove duplicates
      evidence_summary: evidencePieces.join('\n')
    };
  }

  /**
   * Save verification result to database
   */
  private async saveVerificationResult(
    brokerId: number,
    countryId: string,
    result: Omit<VerificationResult, 'broker_id' | 'country_slug' | 'checked_at'>
  ): Promise<void> {
    
    const verificationData = {
      broker_id: brokerId,
      country_id: countryId,
      available: result.available,
      confidence_level: result.confidence_level,
      evidence_urls: result.evidence_urls,
      evidence_summary: result.evidence_summary,
      search_queries: result.search_queries,
      last_checked_at: new Date().toISOString(),
      checked_by: 'auto'
    };

    const { error } = await this.supabase
      .from('broker_country_availability')
      .upsert(verificationData, { onConflict: 'broker_id,country_id' });

    if (error) {
      throw new Error(`Failed to save verification result: ${error.message}`);
    }

    // Log the verification attempt
    await this.logVerificationAttempt(brokerId, countryId, result);
  }

  /**
   * Log verification attempt for debugging/auditing
   */
  private async logVerificationAttempt(
    brokerId: number,
    countryId: string,
    result: any
  ): Promise<void> {
    try {
      const logData = {
        broker_id: brokerId,
        country_id: countryId,
        search_engine: 'mock', // In production: 'google', 'bing', etc.
        query_used: result.search_queries.join(' | '),
        results_found: result.evidence_urls.length,
        result_urls: result.evidence_urls,
        result_snippets: [result.evidence_summary],
        processing_time_ms: 5000, // Mock processing time
        success: true
      };

      await this.supabase
        .from('verification_logs')
        .insert([logData]);

    } catch (error) {
      console.error('Failed to log verification attempt:', error);
      // Don't throw - logging failure shouldn't break the main process
    }
  }

  /**
   * Batch verify multiple broker-country combinations
   */
  async batchVerifyCountries(
    verifications: { brokerId: number; countrySlug: string }[],
    forceRefresh = false
  ): Promise<VerificationResult[]> {
    
    const results: VerificationResult[] = [];
    
    for (const { brokerId, countrySlug } of verifications) {
      try {
        const result = await this.verifyCountryAvailability(brokerId, countrySlug, forceRefresh);
        results.push(result);
        
        // Rate limiting between batch items
        await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
        
      } catch (error) {
        console.error(`Batch verification failed for ${brokerId}/${countrySlug}:`, error);
        
        // Add failed result
        results.push({
          broker_id: brokerId,
          country_slug: countrySlug,
          available: null,
          confidence_level: 'unknown',
          evidence_urls: [],
          evidence_summary: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          search_queries: [],
          checked_at: new Date().toISOString()
        });
      }
    }

    return results;
  }
}

// API handler for Vercel serverless function
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    broker_id, 
    country_slug, 
    force_refresh = false,
    batch_verifications = []
  } = req.body;

  // Validate environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase configuration missing' });
  }

  const verificationService = new CountryVerificationService(supabaseUrl, supabaseKey);

  try {
    // Handle batch verification
    if (batch_verifications.length > 0) {
      const results = await verificationService.batchVerifyCountries(
        batch_verifications,
        force_refresh
      );
      
      return res.status(200).json({
        success: true,
        results,
        processed_count: results.length
      });
    }

    // Handle single verification
    if (!broker_id || !country_slug) {
      return res.status(400).json({ 
        error: 'Missing required parameters: broker_id and country_slug' 
      });
    }

    const result = await verificationService.verifyCountryAvailability(
      broker_id,
      country_slug,
      force_refresh
    );

    return res.status(200).json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Verification API error:', error);
    return res.status(500).json({
      error: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

// Export the service for use in other modules
export { CountryVerificationService, type VerificationResult, type SearchResult };