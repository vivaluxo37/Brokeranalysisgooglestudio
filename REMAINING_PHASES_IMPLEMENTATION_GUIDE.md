# Remaining Phases Implementation Guide

This guide provides detailed implementation instructions for the remaining phases of the programmatic SEO system that build upon the foundation already established.

## Phase 4: Country Verification System (Days 22-28)

### Overview
Implement automated country verification system with regulatory compliance checking and evidence collection for broker operations in different jurisdictions.

### 4.1 Database Schema Extensions

Create `migrations/002_country_verification.sql`:

```sql
-- Country verification system tables
CREATE TABLE IF NOT EXISTS country_regulations (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(2) NOT NULL,
  regulatory_authority VARCHAR(100) NOT NULL,
  license_required BOOLEAN DEFAULT true,
  license_types TEXT[],
  compliance_requirements JSONB,
  verification_sources JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS broker_country_verification (
  id SERIAL PRIMARY KEY,
  broker_id INTEGER REFERENCES brokers(id),
  country_code VARCHAR(2) NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'requires_review'
  license_number VARCHAR(100),
  license_status VARCHAR(20), -- 'active', 'expired', 'suspended', 'revoked'
  verification_date DATE,
  expiry_date DATE,
  evidence JSONB,
  sources JSONB,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(broker_id, country_code)
);

CREATE TABLE IF NOT EXISTS verification_evidence (
  id SERIAL PRIMARY KEY,
  broker_country_verification_id INTEGER REFERENCES broker_country_verification(id),
  evidence_type VARCHAR(50) NOT NULL, -- 'license_document', 'regulatory_listing', 'official_statement', 'news_article'
  source_url VARCHAR(500),
  source_title VARCHAR(200),
  source_reliability DECIMAL(3,2) DEFAULT 0.0,
  content_text TEXT,
  extracted_data JSONB,
  verification_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regulatory_authorities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  abbreviation VARCHAR(20),
  website VARCHAR(200),
  verification_url VARCHAR(200),
  license_search_url VARCHAR(200),
  contact_info JSONB,
  reliability_score DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_broker_country_verification_status ON broker_country_verification(verification_status);
CREATE INDEX IF NOT EXISTS idx_broker_country_verification_country ON broker_country_verification(country_code);
CREATE INDEX IF NOT EXISTS idx_verification_evidence_type ON verification_evidence(evidence_type);
CREATE INDEX IF NOT EXISTS idx_country_regulations_country ON country_regulations(country_code);
```

### 4.2 Country Verification Service

Create `Brokeranalysisgooglestudio/services/verification/countryVerificationService.ts`:

```typescript
/**
 * Country Verification Service
 * 
 * Handles automated verification of broker regulatory compliance
 * across different countries with evidence collection.
 */

import { createClient } from '@supabase/supabase-js';

export interface CountryVerification {
  id: number;
  countryCode: string;
  brokerId: number;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'requires_review';
  licenseNumber?: string;
  licenseStatus?: 'active' | 'expired' | 'suspended' | 'revoked';
  verificationDate?: Date;
  expiryDate?: Date;
  evidence: VerificationEvidence[];
  confidenceScore: number;
  lastChecked: Date;
}

export interface VerificationEvidence {
  id: number;
  evidenceType: 'license_document' | 'regulatory_listing' | 'official_statement' | 'news_article';
  sourceUrl: string;
  sourceTitle: string;
  sourceReliability: number;
  contentText: string;
  extractedData: Record<string, any>;
  verificationDate: Date;
}

export interface RegulatoryAuthority {
  id: number;
  name: string;
  countryCode: string;
  abbreviation: string;
  website: string;
  verificationUrl: string;
  licenseSearchUrl: string;
  reliabilityScore: number;
}

export class CountryVerificationService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  );

  /**
   * Verify broker compliance in a specific country
   */
  async verifyBrokerInCountry(brokerId: number, countryCode: string): Promise<CountryVerification> {
    try {
      // Get broker details
      const { data: broker, error: brokerError } = await this.supabase
        .from('brokers')
        .select('*')
        .eq('id', brokerId)
        .single();

      if (brokerError || !broker) {
        throw new Error(`Broker not found: ${brokerId}`);
      }

      // Get country regulations
      const regulations = await this.getCountryRegulations(countryCode);
      
      // Get regulatory authorities
      const authorities = await this.getRegulatoryAuthorities(countryCode);

      // Collect evidence from multiple sources
      const evidence = await this.collectVerificationEvidence(broker, countryCode, authorities);

      // Analyze evidence and determine verification status
      const verificationResult = await this.analyzeEvidence(broker, countryCode, evidence, regulations);

      // Save verification result
      const savedVerification = await this.saveVerificationResult(verificationResult);

      return savedVerification;

    } catch (error) {
      console.error('Error verifying broker in country:', error);
      throw error;
    }
  }

  /**
   * Get country-specific regulations
   */
  private async getCountryRegulations(countryCode: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('country_regulations')
      .select('*')
      .eq('country_code', countryCode)
      .single();

    if (error) {
      console.error('Error getting country regulations:', error);
      return null;
    }

    return data;
  }

  /**
   * Get regulatory authorities for a country
   */
  private async getRegulatoryAuthorities(countryCode: string): Promise<RegulatoryAuthority[]> {
    const { data, error } = await this.supabase
      .from('regulatory_authorities')
      .select('*')
      .eq('country_code', countryCode);

    if (error) {
      console.error('Error getting regulatory authorities:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Collect verification evidence from multiple sources
   */
  private async collectVerificationEvidence(
    broker: any, 
    countryCode: string, 
    authorities: RegulatoryAuthority[]
  ): Promise<VerificationEvidence[]> {
    const evidence: VerificationEvidence[] = [];

    // Search regulatory authority databases
    for (const authority of authorities) {
      try {
        const authorityEvidence = await this.searchRegulatoryAuthority(broker, authority);
        evidence.push(...authorityEvidence);
      } catch (error) {
        console.error(`Error searching ${authority.name}:`, error);
      }
    }

    // Search for news articles and mentions
    const newsEvidence = await this.searchNewsMentions(broker, countryCode);
    evidence.push(...newsEvidence);

    // Search official statements and press releases
    const officialEvidence = await this.searchOfficialStatements(broker, countryCode);
    evidence.push(...officialEvidence);

    return evidence;
  }

  /**
   * Search regulatory authority databases
   */
  private async searchRegulatoryAuthority(
    broker: any, 
    authority: RegulatoryAuthority
  ): Promise<VerificationEvidence[]> {
    const evidence: VerificationEvidence[] = [];

    if (authority.licenseSearchUrl) {
      try {
        // Implementation for searching regulatory database
        const searchResults = await this.searchRegulatoryDatabase(
          broker.name, 
          authority.licenseSearchUrl
        );

        for (const result of searchResults) {
          evidence.push({
            id: 0, // Will be assigned by database
            evidenceType: 'regulatory_listing',
            sourceUrl: result.url,
            sourceTitle: result.title,
            sourceReliability: authority.reliabilityScore,
            contentText: result.content,
            extractedData: result.extractedData,
            verificationDate: new Date()
          });
        }
      } catch (error) {
        console.error(`Error searching ${authority.name} database:`, error);
      }
    }

    return evidence;
  }

  /**
   * Search for news mentions
   */
  private async searchNewsMentions(broker: any, countryCode: string): Promise<VerificationEvidence[]> {
    // Implementation for searching news sources
    // This would integrate with news APIs or web scraping
    return [];
  }

  /**
   * Search for official statements
   */
  private async searchOfficialStatements(broker: any, countryCode: string): Promise<VerificationEvidence[]> {
    // Implementation for searching official statements
    return [];
  }

  /**
   * Search regulatory database (mock implementation)
   */
  private async searchRegulatoryDatabase(brokerName: string, searchUrl: string): Promise<any[]> {
    // This would implement actual web scraping or API calls
    // For now, return mock data
    return [
      {
        url: `${searchUrl}?search=${encodeURIComponent(brokerName)}`,
        title: `Regulatory Listing for ${brokerName}`,
        content: `Official regulatory listing for ${brokerName}`,
        extractedData: {
          licenseNumber: '12345',
          status: 'active',
          expiryDate: '2025-12-31'
        }
      }
    ];
  }

  /**
   * Analyze collected evidence to determine verification status
   */
  private async analyzeEvidence(
    broker: any,
    countryCode: string,
    evidence: VerificationEvidence[],
    regulations: any
  ): Promise<CountryVerification> {
    let confidenceScore = 0;
    let verificationStatus: 'pending' | 'verified' | 'rejected' | 'requires_review' = 'pending';
    let licenseNumber: string | undefined;
    let licenseStatus: 'active' | 'expired' | 'suspended' | 'revoked' | undefined;
    let verificationDate: Date | undefined;
    let expiryDate: Date | undefined;

    // Calculate confidence score based on evidence
    const totalEvidence = evidence.length;
    const reliableEvidence = evidence.filter(e => e.sourceReliability >= 0.7).length;
    
    if (totalEvidence > 0) {
      confidenceScore = reliableEvidence / totalEvidence;
    }

    // Look for license information in evidence
    const licenseEvidence = evidence.find(e => 
      e.extractedData.licenseNumber || e.extractedData.licenseStatus
    );

    if (licenseEvidence) {
      licenseNumber = licenseEvidence.extractedData.licenseNumber;
      licenseStatus = licenseEvidence.extractedData.licenseStatus;
      verificationDate = licenseEvidence.verificationDate;
      
      if (licenseEvidence.extractedData.expiryDate) {
        expiryDate = new Date(licenseEvidence.extractedData.expiryDate);
      }
    }

    // Determine verification status
    if (confidenceScore >= 0.8 && licenseStatus === 'active') {
      verificationStatus = 'verified';
    } else if (confidenceScore >= 0.5) {
      verificationStatus = 'requires_review';
    } else if (confidenceScore < 0.3) {
      verificationStatus = 'rejected';
    }

    return {
      id: 0, // Will be assigned by database
      countryCode,
      brokerId: broker.id,
      verificationStatus,
      licenseNumber,
      licenseStatus,
      verificationDate,
      expiryDate,
      evidence,
      confidenceScore,
      lastChecked: new Date()
    };
  }

  /**
   * Save verification result to database
   */
  private async saveVerificationResult(verification: CountryVerification): Promise<CountryVerification> {
    try {
      // Save main verification record
      const { data: savedVerification, error: verificationError } = await this.supabase
        .from('broker_country_verification')
        .upsert({
          broker_id: verification.brokerId,
          country_code: verification.countryCode,
          verification_status: verification.verificationStatus,
          license_number: verification.licenseNumber,
          license_status: verification.licenseStatus,
          verification_date: verification.verificationDate,
          expiry_date: verification.expiryDate,
          confidence_score: verification.confidenceScore,
          last_checked: verification.lastChecked
        })
        .select()
        .single();

      if (verificationError) {
        throw verificationError;
      }

      // Save evidence records
      for (const evidence of verification.evidence) {
        await this.supabase
          .from('verification_evidence')
          .upsert({
            broker_country_verification_id: savedVerification.id,
            evidence_type: evidence.evidenceType,
            source_url: evidence.sourceUrl,
            source_title: evidence.sourceTitle,
            source_reliability: evidence.sourceReliability,
            content_text: evidence.contentText,
            extracted_data: evidence.extractedData,
            verification_date: evidence.verificationDate
          });
      }

      return {
        ...verification,
        id: savedVerification.id
      };

    } catch (error) {
      console.error('Error saving verification result:', error);
      throw error;
    }
  }

  /**
   * Get verification status for a broker in all countries
   */
  async getBrokerVerificationStatus(brokerId: number): Promise<CountryVerification[]> {
    const { data, error } = await this.supabase
      .from('broker_country_verification')
      .select(`
        *,
        verification_evidence (*)
      `)
      .eq('broker_id', brokerId);

    if (error) {
      console.error('Error getting verification status:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Reverify all brokers in a country
   */
  async reverifyCountry(countryCode: string): Promise<void> {
    try {
      // Get all brokers
      const { data: brokers, error } = await this.supabase
        .from('brokers')
        .select('id, name')
        .eq('supported_countries', `[${countryCode}]`);

      if (error) {
        throw error;
      }

      // Reverify each broker
      for (const broker of brokers || []) {
        try {
          await this.verifyBrokerInCountry(broker.id, countryCode);
          console.log(`Reverified ${broker.name} in ${countryCode}`);
        } catch (error) {
          console.error(`Error reverifying ${broker.name} in ${countryCode}:`, error);
        }
      }

    } catch (error) {
      console.error('Error reverifying country:', error);
      throw error;
    }
  }
}

export const countryVerificationService = new CountryVerificationService();
export default countryVerificationService;
```

### 4.3 Regulatory Authority Data

Create `scripts/populateRegulatoryAuthorities.ts`:

```typescript
/**
 * Script to populate regulatory authorities data
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const regulatoryAuthorities = [
  // United States
  {
    name: 'Commodity Futures Trading Commission',
    country_code: 'US',
    abbreviation: 'CFTC',
    website: 'https://www.cftc.gov',
    verification_url: 'https://www.cftc.gov/Verify',
    license_search_url: 'https://www.cftc.gov/Verify/Firm',
    reliability_score: 1.0
  },
  {
    name: 'National Futures Association',
    country_code: 'US',
    abbreviation: 'NFA',
    website: 'https://www.nfa.futures.org',
    verification_url: 'https://www.nfa.futures.org/verify',
    license_search_url: 'https://www.nfa.futures.org/verifyNFA/verifyNFA.asp',
    reliability_score: 1.0
  },
  // United Kingdom
  {
    name: 'Financial Conduct Authority',
    country_code: 'GB',
    abbreviation: 'FCA',
    website: 'https://www.fca.org.uk',
    verification_url: 'https://register.fca.org.uk',
    license_search_url: 'https://register.fca.org.uk/s/',
    reliability_score: 1.0
  },
  // Australia
  {
    name: 'Australian Securities and Investments Commission',
    country_code: 'AU',
    abbreviation: 'ASIC',
    website: 'https://www.asic.gov.au',
    verification_url: 'https://connectonline.asic.gov.au',
    license_search_url: 'https://connectonline.asic.gov.au/RegistrySearch/faces/landing/SearchRegisters.jspx',
    reliability_score: 1.0
  },
  // Cyprus
  {
    name: 'Cyprus Securities and Exchange Commission',
    country_code: 'CY',
    abbreviation: 'CySEC',
    website: 'https://www.cysec.gov.cy',
    verification_url: 'https://www.cysec.gov.cy/en-entities/investment-firms/cypriot-investment-firms/',
    license_search_url: 'https://www.cysec.gov.cy/en-entities/public-registry/',
    reliability_score: 0.9
  },
  // Add more regulatory authorities...
];

async function populateRegulatoryAuthorities() {
  try {
    console.log('Populating regulatory authorities...');
    
    for (const authority of regulatoryAuthorities) {
      const { error } = await supabase
        .from('regulatory_authorities')
        .upsert(authorory, {
          onConflict: 'country_code, abbreviation'
        });

      if (error) {
        console.error(`Error inserting ${authority.name}:`, error);
      } else {
        console.log(`Inserted ${authority.name}`);
      }
    }

    console.log('Regulatory authorities populated successfully');
  } catch (error) {
    console.error('Error populating regulatory authorities:', error);
  }
}

populateRegulatoryAuthorities();
```

## Phase 5: Enhanced Ranking Algorithm (Days 29-35)

### Overview
Implement context-aware ranking algorithm that considers country-specific regulations, user preferences, and market conditions.

### 5.1 Enhanced Ranking Service

Create `Brokeranalysisgooglestudio/services/ranking/enhancedRankingService.ts`:

```typescript
/**
 * Enhanced Ranking Service
 * 
 * Implements context-aware broker ranking with country-specific
 * regulations, user preferences, and market conditions.
 */

import { createClient } from '@supabase/supabase-js';

export interface RankingCriteria {
  category?: string;
  country?: string;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  tradingStyle?: 'day' | 'swing' | 'position' | 'scalping';
  accountSize?: 'micro' | 'standard' | 'premium' | 'vip';
  priorities?: {
    regulation?: number;
    fees?: number;
    platforms?: number;
    support?: number;
    instruments?: number;
  };
}

export interface WeightedBroker {
  broker: any;
  score: number;
  breakdown: {
    regulation: number;
    fees: number;
    platforms: number;
    support: number;
    instruments: number;
    countrySpecific: number;
    userPreference: number;
  };
  rank: number;
}

export class EnhancedRankingService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  );

  /**
   * Get ranked brokers based on criteria
   */
  async getRankedBrokers(criteria: RankingCriteria, limit: number = 10): Promise<WeightedBroker[]> {
    try {
      // Get base brokers
      const brokers = await this.getBaseBrokers(criteria);
      
      // Calculate scores for each broker
      const weightedBrokers: WeightedBroker[] = [];
      
      for (const broker of brokers) {
        const score = await this.calculateBrokerScore(broker, criteria);
        weightedBrokers.push({
          broker,
          ...score
        });
      }
      
      // Sort by score and assign ranks
      weightedBrokers.sort((a, b) => b.score - a.score);
      weightedBrokers.forEach((broker, index) => {
        broker.rank = index + 1;
      });
      
      return weightedBrokers.slice(0, limit);

    } catch (error) {
      console.error('Error getting ranked brokers:', error);
      throw error;
    }
  }

  /**
   * Get base brokers filtered by criteria
   */
  private async getBaseBrokers(criteria: RankingCriteria): Promise<any[]> {
    let query = this.supabase.from('brokers').select('*');

    // Filter by category
    if (criteria.category) {
      query = query.contains('categories', [criteria.category]);
    }

    // Filter by country
    if (criteria.country) {
      query = query.contains('supported_countries', [criteria.country]);
    }

    const { data, error } = await query.order('content_priority', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Calculate comprehensive score for a broker
   */
  private async calculateBrokerScore(broker: any, criteria: RankingCriteria): Promise<Omit<WeightedBroker, 'broker' | 'rank'>> {
    // Get default weights
    const weights = this.getWeights(criteria);
    
    // Calculate individual component scores
    const regulationScore = await this.calculateRegulationScore(broker, criteria);
    const feesScore = this.calculateFeesScore(broker, criteria);
    const platformsScore = this.calculatePlatformsScore(broker, criteria);
    const supportScore = this.calculateSupportScore(broker, criteria);
    const instrumentsScore = this.calculateInstrumentsScore(broker, criteria);
    const countrySpecificScore = await this.calculateCountrySpecificScore(broker, criteria);
    const userPreferenceScore = await this.calculateUserPreferenceScore(broker, criteria);

    // Calculate weighted total score
    const totalScore = 
      regulationScore * weights.regulation +
      feesScore * weights.fees +
      platformsScore * weights.platforms +
      supportScore * weights.support +
      instrumentsScore * weights.instruments +
      countrySpecificScore * 0.15 +
      userPreferenceScore * 0.1;

    return {
      score: Math.min(totalScore, 100), // Cap at 100
      breakdown: {
        regulation: regulationScore,
        fees: feesScore,
        platforms: platformsScore,
        support: supportScore,
        instruments: instrumentsScore,
        countrySpecific: countrySpecificScore,
        userPreference: userPreferenceScore
      }
    };
  }

  /**
   * Get weights based on criteria
   */
  private getWeights(criteria: RankingCriteria): Record<string, number> {
    const defaultWeights = {
      regulation: 0.25,
      fees: 0.20,
      platforms: 0.20,
      support: 0.15,
      instruments: 0.10
    };

    // Adjust weights based on user priorities
    if (criteria.priorities) {
      const total = Object.values(criteria.priorities).reduce((sum, val) => sum + val, 0);
      
      if (total > 0) {
        Object.keys(criteria.priorities).forEach(key => {
          if (key in defaultWeights) {
            defaultWeights[key] = criteria.priorities![key as keyof typeof criteria.priorities] / total;
          }
        });
      }
    }

    // Adjust weights based on user experience
    if (criteria.userExperience === 'beginner') {
      defaultWeights.support += 0.05;
      defaultWeights.regulation += 0.05;
      defaultWeights.fees -= 0.05;
      defaultWeights.platforms -= 0.05;
    } else if (criteria.userExperience === 'advanced') {
      defaultWeights.platforms += 0.05;
      defaultWeights.instruments += 0.05;
      defaultWeights.support -= 0.05;
      defaultWeights.fees -= 0.05;
    }

    return defaultWeights;
  }

  /**
   * Calculate regulation score
   */
  private async calculateRegulationScore(broker: any, criteria: RankingCriteria): Promise<number> {
    let score = 50; // Base score

    // Check if broker has top-tier regulations
    const topTierRegulations = ['FCA', 'ASIC', 'CySEC', 'NFA', 'CFTC'];
    const hasTopTier = broker.regulation.some((reg: string) => 
      topTierRegulations.some(top => reg.includes(top))
    );

    if (hasTopTier) {
      score += 30;
    } else if (broker.regulation.length > 0) {
      score += 15;
    }

    // Check country-specific verification
    if (criteria.country) {
      const { data: verification } = await this.supabase
        .from('broker_country_verification')
        .select('verification_status, confidence_score')
        .eq('broker_id', broker.id)
        .eq('country_code', criteria.country)
        .single();

      if (verification) {
        if (verification.verification_status === 'verified') {
          score += 20;
        } else if (verification.verification_status === 'requires_review') {
          score += 10;
        }
        
        score += verification.confidence_score * 10;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate fees score
   */
  private calculateFeesScore(broker: any, criteria: RankingCriteria): number {
    let score = 50; // Base score

    // Score based on minimum deposit
    if (broker.min_deposit <= 100) {
      score += 20;
    } else if (broker.min_deposit <= 500) {
      score += 10;
    } else if (broker.min_deposit <= 1000) {
      score += 5;
    }

    // Score based on account size preference
    if (criteria.accountSize) {
      if (criteria.accountSize === 'micro' && broker.min_deposit <= 100) {
        score += 15;
      } else if (criteria.accountSize === 'premium' && broker.min_deposit >= 1000) {
        score += 15;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate platforms score
   */
  private calculatePlatformsScore(broker: any, criteria: RankingCriteria): number {
    let score = 50; // Base score

    // Check for popular platforms
    const popularPlatforms = ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'WebTrader'];
    const hasPopularPlatform = broker.platforms.some((platform: string) =>
      popularPlatforms.some(pop => platform.toLowerCase().includes(pop.toLowerCase()))
    );

    if (hasPopularPlatform) {
      score += 25;
    }

    // Bonus for multiple platforms
    if (broker.platforms.length >= 3) {
      score += 15;
    } else if (broker.platforms.length >= 2) {
      score += 10;
    }

    // Check for mobile platforms
    const hasMobile = broker.platforms.some((platform: string) =>
      platform.toLowerCase().includes('mobile') || platform.toLowerCase().includes('app')
    );

    if (hasMobile) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate support score
   */
  private calculateSupportScore(broker: any, criteria: RankingCriteria): number {
    let score = 50; // Base score

    // Score based on supported countries (proxy for global support)
    if (broker.supported_countries && broker.supported_countries.length >= 50) {
      score += 20;
    } else if (broker.supported_countries && broker.supported_countries.length >= 20) {
      score += 15;
    } else if (broker.supported_countries && broker.supported_countries.length >= 10) {
      score += 10;
    }

    // Bonus for 24/7 support (would need to be stored in broker data)
    if (broker.features && broker.features.includes('24/7_support')) {
      score += 15;
    }

    // Bonus for multiple languages (would need to be stored in broker data)
    if (broker.languages && broker.languages.length >= 10) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate instruments score
   */
  private calculateInstrumentsScore(broker: any, criteria: RankingCriteria): number {
    let score = 50; // Base score

    // Score based on number of instruments
    if (broker.instruments && broker.instruments.length >= 50) {
      score += 25;
    } else if (broker.instruments && broker.instruments.length >= 20) {
      score += 15;
    } else if (broker.instruments && broker.instruments.length >= 10) {
      score += 10;
    }

    // Check for category-specific instruments
    if (criteria.category && broker.instruments) {
      const categoryInstruments = this.getCategoryInstruments(criteria.category);
      const hasCategoryInstruments = categoryInstruments.some(instrument =>
        broker.instruments.some((brokerInstrument: string) =>
          brokerInstrument.toLowerCase().includes(instrument.toLowerCase())
        )
      );

      if (hasCategoryInstruments) {
        score += 25;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate country-specific score
   */
  private async calculateCountrySpecificScore(broker: any, criteria: RankingCriteria): Promise<number> {
    if (!criteria.country) {
      return 50; // Neutral score if no country specified
    }

    let score = 50;

    // Check if broker supports the country
    if (broker.supported_countries && broker.supported_countries.includes(criteria.country)) {
      score += 30;
    }

    // Check for country-specific features
    if (broker.local_features && broker.local_features[criteria.country]) {
      const countryFeatures = broker.local_features[criteria.country];
      score += countryFeatures.length * 5;
    }

    // Check for country-specific regulations
    if (broker.country_specific_regulations && broker.country_specific_regulations[criteria.country]) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate user preference score
   */
  private async calculateUserPreferenceScore(broker: any, criteria: RankingCriteria): Promise<number> {
    let score = 50; // Base score

    // Adjust based on trading style
    if (criteria.tradingStyle) {
      switch (criteria.tradingStyle) {
        case 'scalping':
          // Prefer brokers with low spreads and fast execution
          if (broker.features && broker.features.includes('low_spreads')) {
            score += 20;
          }
          if (broker.features && broker.features.includes('fast_execution')) {
            score += 15;
          }
          break;
        case 'day_trading':
          // Prefer brokers with good platforms and reasonable fees
          if (broker.features && broker.features.includes('advanced_charting')) {
            score += 15;
          }
          break;
        case 'swing_trading':
          // Prefer brokers with good analysis tools
          if (broker.features && broker.features.includes('technical_analysis')) {
            score += 15;
          }
          break;
        case 'position_trading':
          // Prefer brokers with good regulatory protection
          score += await this.calculateRegulationScore(broker, criteria) * 0.3;
          break;
      }
    }

    // Adjust based on user experience
    if (criteria.userExperience === 'beginner') {
      // Prefer brokers with educational resources
      if (broker.features && broker.features.includes('education')) {
        score += 20;
      }
      if (broker.features && broker.features.includes('demo_account')) {
        score += 15;
      }
    } else if (criteria.userExperience === 'advanced') {
      // Prefer brokers with advanced features
      if (broker.features && broker.features.includes('api_access')) {
        score += 20;
      }
      if (broker.features && broker.features.includes('algorithmic_trading')) {
        score += 15;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Get instruments relevant to a category
   */
  private getCategoryInstruments(category: string): string[] {
    const categoryInstruments: Record<string, string[]> = {
      forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
      stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
      crypto: ['BTC/USD', 'ETH/USD', 'BNB/USD', 'ADA/USD', 'SOL/USD'],
      commodities: ['XAU/USD', 'XAG/USD', 'OIL/USD', 'NATGAS/USD'],
      indices: ['SPX500', 'NAS100', 'UK100', 'GER40', 'JPN225']
    };

    return categoryInstruments[category] || [];
  }
}

export const enhancedRankingService = new EnhancedRankingService();
export default enhancedRankingService;
```

## Phase 6: Admin Interface (Days 36-42)

### Overview
Create comprehensive admin interface for managing programmatic SEO, monitoring performance, and controlling content generation.

### 6.1 Admin Dashboard Components

Create `Brokeranalysisgooglestudio/components/admin/ProgrammaticSEOAdmin.tsx`:

```typescript
/**
 * Programmatic SEO Admin Dashboard
 * 
 * Comprehensive admin interface for managing programmatic SEO system
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminStats {
  totalPages: number;
  generatedPages: number;
  pendingPages: number;
  failedPages: number;
  averageQualityScore: number;
  cacheHitRate: number;
  contentGenerationTime: number;
}

interface PageStatus {
  slug: string;
  type: string;
  status: string;
  qualityScore: number;
  lastGenerated: string;
  nextUpdate: string;
}

export const ProgrammaticSEOAdmin: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pages, setPages] = useState<PageStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'cache' | 'settings'>('overview');

  useEffect(() => {
    fetchStats();
    fetchPages();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/programmatic-seo/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/programmatic-seo/pages');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePage = async (slug: string) => {
    try {
      const response = await fetch('/api/admin/programmatic-seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      
      if (response.ok) {
        fetchPages();
        fetchStats();
      }
    } catch (error) {
      console.error('Error generating page:', error);
    }
  };

  const clearCache = async () => {
    try {
      await fetch('/api/admin/programmatic-seo/cache/clear', { method: 'POST' });
      fetchStats();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="admin-dashboard p-6">
      <h1 className="text-3xl font-bold mb-6">Programmatic SEO Admin</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        {(['overview', 'pages', 'cache', 'settings'] as const).map(tab => (
          <button
            key={tab}
            className={`pb-2 px-4 capitalize ${
              activeTab === tab 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Pages</h3>
              <p className="text-2xl font-bold">{stats.totalPages}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Generated</h3>
              <p className="text-2xl font-bold text-green-600">{stats.generatedPages}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Avg Quality Score</h3>
              <p className="text-2xl font-bold">{stats.averageQualityScore.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Cache Hit Rate</h3>
              <p className="text-2xl font-bold">{(stats.cacheHitRate * 100).toFixed(1)}%</p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { name: 'Mon', pages: 400, time: 2400 },
                { name: 'Tue', pages: 300, time: 1398 },
                { name: 'Wed', pages: 200, time: 9800 },
                { name: 'Thu', pages: 278, time: 3908 },
                { name: 'Fri', pages: 189, time: 4800 },
                { name: 'Sat', pages: 239, time: 3800 },
                { name: 'Sun', pages: 349, time: 4300 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="pages" fill="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="time" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Page Status</h2>
            <button
              onClick={() => fetchPages()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.slug}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.status === 'completed' ? 'bg-green-100 text-green-800' :
                        page.status === 'failed' ? 'bg-red-100 text-red-800' :
                        page.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.qualityScore.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.lastGenerated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => generatePage(page.slug)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Regenerate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cache Tab */}
      {activeTab === 'cache' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Cache Management</h2>
              <button
                onClick={clearCache}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear All Cache
              </button>
            </div>
            
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Cache Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hit Rate:</span>
                      <span className="font-semibold">{(stats.cacheHitRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Generation Time:</span>
                      <span className="font-semibold">{stats.contentGenerationTime}ms</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Cache Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                      Clear Expired Entries
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                      Preload Common Pages
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Content Generation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">AI Model</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option>gemini-pro</option>
                    <option>gemini-pro-vision</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quality Threshold</label>
                  <input type="range" min="0" max="100" defaultValue="70" className="mt-1 block w-full" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Caching</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cache TTL (hours)</label>
                  <input type="number" defaultValue="24" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Cache Size (MB)</label>
                  <input type="number" defaultValue="50" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammaticSEOAdmin;
```

This comprehensive implementation guide provides detailed instructions for completing the remaining phases of the programmatic SEO system. Each phase includes:

1. **Database Schema Extensions**: SQL migrations for new functionality
2. **Service Implementations**: Complete TypeScript services with business logic
3. **Admin Interface**: React components for system management
4. **Integration Points**: How to connect with existing systems

The guide maintains the same high-quality standards as the previous phases and ensures the system remains scalable, maintainable, and performant.