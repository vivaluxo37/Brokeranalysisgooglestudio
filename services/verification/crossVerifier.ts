import { Broker } from '../../types';
import { searchEngine } from './searchEngine';
import { webScrapers } from './webScrapers';
import { regAuthorityVerifier } from './regAuthorityVerifier';
import { sourceReliabilityManager } from './sourceReliability';
import { fieldValidator, FieldComparisonResult } from '../../validators/fieldRules';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Cross-Verification Engine
 * Compares database broker data with web-sourced information to identify discrepancies
 */

export interface VerificationSource {
  domain: string;
  url: string;
  dataExtracted: any;
  confidence: number;
  reliability: number;
  extractedAt: Date;
  relevanceScore: number;
}

export interface FieldDiscrepancy {
  fieldName: string;
  dbValue: any;
  webValues: any[];
  aggregatedWebValue: any;
  confidenceScore: number;
  toleranceExceeded: boolean;
  sources: VerificationSource[];
  majorityVote: any;
  recommendedAction: 'update' | 'review' | 'ignore';
  severity: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface VerificationResult {
  brokerId: string;
  brokerName: string;
  verifiedAt: Date;
  overallConfidence: number;
  totalFieldsChecked: number;
  fieldsWithDiscrepancies: number;
  discrepancies: FieldDiscrepancy[];
  sourcesUsed: VerificationSource[];
  regulatoryVerification?: any;
  recommendations: string[];
  status: 'verified' | 'discrepancies_found' | 'failed' | 'needs_review';
  processingTime: number;
}

export interface VerificationOptions {
  fieldsToCheck?: string[];
  skipRegulatory?: boolean;
  maxSources?: number;
  confidenceThreshold?: number;
  enableAlerts?: boolean;
  saveDiscrepancies?: boolean;
}

export class CrossVerifier {
  private supabase: any;
  private readonly defaultOptions: VerificationOptions = {
    fieldsToCheck: ['name', 'minDeposit', 'regulators', 'foundingYear', 'headquarters'],
    skipRegulatory: false,
    maxSources: 5,
    confidenceThreshold: 0.6,
    enableAlerts: true,
    saveDiscrepancies: true
  };

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.warn('⚠️  Supabase not configured. Discrepancy saving will be disabled.');
    }
  }

  /**
   * Performs cross-verification for a single broker
   */
  public async verifyBroker(broker: Broker, options?: Partial<VerificationOptions>): Promise<VerificationResult> {
    const startTime = Date.now();
    const opts = { ...this.defaultOptions, ...options };
    
    console.log(`🔍 Starting cross-verification for ${broker.name}...`);

    try {
      // 1. Gather web data from multiple sources
      const sourcesUsed = await this.gatherWebData(broker, opts);

      // 2. Perform regulatory verification if not skipped
      let regulatoryVerification;
      if (!opts.skipRegulatory && broker.regulation?.regulators) {
        regulatoryVerification = await regAuthorityVerifier.verifyBrokerRegulation(
          broker.name,
          broker.regulation.regulators
        );
      }

      // 3. Compare database values with web-sourced data
      const discrepancies = await this.compareFields(broker, sourcesUsed, opts);

      // 4. Calculate overall confidence and metrics
      const overallConfidence = this.calculateOverallConfidence(discrepancies, sourcesUsed);
      const status = this.determineStatus(discrepancies, overallConfidence, opts.confidenceThreshold!);

      // 5. Generate recommendations
      const recommendations = this.generateRecommendations(discrepancies, regulatoryVerification);

      // 6. Save discrepancies to database if enabled
      if (opts.saveDiscrepancies && discrepancies.length > 0) {
        await this.saveDiscrepancies(broker.id, discrepancies);
      }

      // 7. Send alerts if enabled and necessary
      if (opts.enableAlerts && this.shouldSendAlert(discrepancies, overallConfidence)) {
        await this.sendAlert(broker, discrepancies, overallConfidence);
      }

      const result: VerificationResult = {
        brokerId: broker.id,
        brokerName: broker.name,
        verifiedAt: new Date(),
        overallConfidence,
        totalFieldsChecked: opts.fieldsToCheck!.length,
        fieldsWithDiscrepancies: discrepancies.length,
        discrepancies,
        sourcesUsed,
        regulatoryVerification,
        recommendations,
        status,
        processingTime: Date.now() - startTime
      };

      console.log(`✅ Cross-verification completed for ${broker.name} in ${result.processingTime}ms`);
      console.log(`   Status: ${status}, Confidence: ${overallConfidence.toFixed(2)}, Discrepancies: ${discrepancies.length}`);

      return result;

    } catch (error) {
      console.error(`❌ Cross-verification failed for ${broker.name}:`, error);
      
      return {
        brokerId: broker.id,
        brokerName: broker.name,
        verifiedAt: new Date(),
        overallConfidence: 0,
        totalFieldsChecked: 0,
        fieldsWithDiscrepancies: 0,
        discrepancies: [],
        sourcesUsed: [],
        recommendations: [`Verification failed: ${error}`],
        status: 'failed',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Gathers web data from multiple sources
   */
  private async gatherWebData(broker: Broker, options: VerificationOptions): Promise<VerificationSource[]> {
    console.log(`📡 Gathering web data for ${broker.name}...`);
    
    const sources: VerificationSource[] = [];
    const maxSources = options.maxSources || 5;

    try {
      // 1. Search for general broker information
      const generalSearch = await searchEngine.searchBrokerInfo(broker.name, 'review');
      
      // 2. Search reliable sources specifically
      const reliableSearch = await searchEngine.searchReliableSources(`${broker.name} broker`);
      
      // 3. Combine and prioritize search results
      const allResults = [
        ...generalSearch.results.slice(0, 3),
        ...reliableSearch.results.slice(0, 3)
      ].slice(0, maxSources);

      // 4. Scrape data from each source
      for (const searchResult of allResults) {
        try {
          const scrapedData = await webScrapers.scrapeBrokerInfo(searchResult, broker.name);
          
          if (scrapedData.confidence > 0.1) { // Only include sources with some confidence
            const reliability = await sourceReliabilityManager.getSourceReliability(scrapedData.source);
            
            const source: VerificationSource = {
              domain: scrapedData.source,
              url: scrapedData.url,
              dataExtracted: scrapedData.data,
              confidence: scrapedData.confidence,
              reliability: reliability / 10, // Convert to 0-1 scale
              extractedAt: scrapedData.scrapedAt,
              relevanceScore: this.calculateRelevanceScore(scrapedData, broker)
            };
            
            sources.push(source);
          }
        } catch (error) {
          console.warn(`⚠️  Failed to scrape data from ${searchResult.source}:`, error);
        }
      }

      // 5. Sort sources by combined score (reliability + confidence + relevance)
      sources.sort((a, b) => {
        const scoreA = (a.reliability * 0.4) + (a.confidence * 0.4) + (a.relevanceScore * 0.2);
        const scoreB = (b.reliability * 0.4) + (b.confidence * 0.4) + (b.relevanceScore * 0.2);
        return scoreB - scoreA;
      });

      console.log(`📊 Gathered data from ${sources.length} sources`);
      return sources.slice(0, maxSources);

    } catch (error) {
      console.error('Failed to gather web data:', error);
      return [];
    }
  }

  /**
   * Compares database fields with web-sourced data
   */
  private async compareFields(
    broker: Broker, 
    sources: VerificationSource[], 
    options: VerificationOptions
  ): Promise<FieldDiscrepancy[]> {
    const discrepancies: FieldDiscrepancy[] = [];
    const fieldsToCheck = options.fieldsToCheck || this.defaultOptions.fieldsToCheck!;

    for (const fieldName of fieldsToCheck) {
      const dbValue = this.extractFieldValue(broker, fieldName);
      const webValues = this.extractWebValues(sources, fieldName);

      if (webValues.length === 0) {
        continue; // Skip if no web data available for this field
      }

      // Aggregate web values using majority vote and reliability weighting
      const aggregatedWebValue = this.aggregateWebValues(webValues, sources, fieldName);
      
      // Compare database value with aggregated web value
      const comparison = fieldValidator.compareFieldValues(fieldName, dbValue, aggregatedWebValue);

      if (!comparison.isMatch || comparison.toleranceExceeded) {
        const severity = this.determineSeverity(fieldName, comparison);
        const recommendedAction = this.determineRecommendedAction(comparison, severity);

        const discrepancy: FieldDiscrepancy = {
          fieldName,
          dbValue,
          webValues,
          aggregatedWebValue,
          confidenceScore: comparison.confidence,
          toleranceExceeded: comparison.toleranceExceeded,
          sources: sources.filter(s => this.hasFieldData(s, fieldName)),
          majorityVote: aggregatedWebValue,
          recommendedAction,
          severity,
          reasoning: this.generateDiscrepancyReasoning(comparison, fieldName, severity)
        };

        discrepancies.push(discrepancy);
        
        // Update source reliability based on the comparison
        for (const source of discrepancy.sources) {
          await sourceReliabilityManager.updateSourceReliability(
            source.domain,
            comparison.isMatch,
            source.confidence,
            `${broker.name} ${fieldName} verification`
          );
        }
      }
    }

    return discrepancies;
  }

  /**
   * Extracts field value from broker object using dot notation
   */
  private extractFieldValue(broker: Broker, fieldPath: string): any {
    const pathSegments = fieldPath.split('.');
    let value: any = broker;
    
    for (const segment of pathSegments) {
      if (value === null || value === undefined) {
        return null;
      }
      
      // Handle array access or object property access
      if (segment === 'regulators' && value.regulation) {
        value = value.regulation.regulators;
      } else if (segment === 'minDeposit' && value.accessibility) {
        value = value.accessibility.minDeposit;
      } else if (segment === 'eurUsdSpread' && value.tradingConditions) {
        value = value.tradingConditions.spreads?.eurusd;
      } else if (segment === 'maxLeverage' && value.tradingConditions) {
        value = value.tradingConditions.maxLeverage;
      } else if (segment === 'platforms' && value.technology) {
        value = value.technology.platforms;
      } else {
        value = value[segment];
      }
    }
    
    return value;
  }

  /**
   * Extracts web values for a specific field from all sources
   */
  private extractWebValues(sources: VerificationSource[], fieldName: string): any[] {
    const values: any[] = [];
    
    for (const source of sources) {
      const fieldValue = this.getFieldFromWebData(source.dataExtracted, fieldName);
      if (fieldValue !== null && fieldValue !== undefined) {
        values.push(fieldValue);
      }
    }
    
    return values;
  }

  /**
   * Gets field value from scraped web data
   */
  private getFieldFromWebData(webData: any, fieldName: string): any {
    if (!webData) return null;
    
    switch (fieldName) {
      case 'name':
        return webData.brokerName || webData.name;
      case 'minDeposit':
        return webData.minDeposit;
      case 'regulators':
      case 'regulation':
        return webData.regulation;
      case 'foundingYear':
        return webData.foundingYear || webData.yearFounded;
      case 'headquarters':
        return webData.headquarters || webData.location;
      case 'platforms':
        return webData.platforms;
      case 'eurUsdSpread':
        return webData.spreads?.find((s: any) => s.pair === 'EUR/USD')?.spread;
      case 'score':
        return webData.rating || webData.score;
      default:
        return webData[fieldName];
    }
  }

  /**
   * Aggregates multiple web values using majority vote and reliability weighting
   */
  private aggregateWebValues(webValues: any[], sources: VerificationSource[], fieldName: string): any {
    if (webValues.length === 0) return null;
    if (webValues.length === 1) return webValues[0];

    // For numerical values, calculate weighted average
    if (webValues.every(v => typeof v === 'number')) {
      let totalWeight = 0;
      let weightedSum = 0;

      webValues.forEach((value, index) => {
        const source = sources[index];
        if (source) {
          const weight = (source.reliability * 0.6) + (source.confidence * 0.4);
          weightedSum += value * weight;
          totalWeight += weight;
        }
      });

      return totalWeight > 0 ? weightedSum / totalWeight : webValues[0];
    }

    // For arrays, merge unique values and prefer values from more reliable sources
    if (webValues.some(v => Array.isArray(v))) {
      const allValues = webValues.flat().filter(v => v !== null && v !== undefined);
      return [...new Set(allValues)];
    }

    // For strings and other types, use majority vote weighted by source reliability
    const valueWeights = new Map<any, number>();
    
    webValues.forEach((value, index) => {
      const source = sources[index];
      if (source) {
        const weight = (source.reliability * 0.6) + (source.confidence * 0.4);
        valueWeights.set(value, (valueWeights.get(value) || 0) + weight);
      }
    });

    // Return the value with the highest total weight
    let maxWeight = 0;
    let bestValue = webValues[0];
    
    for (const [value, weight] of valueWeights) {
      if (weight > maxWeight) {
        maxWeight = weight;
        bestValue = value;
      }
    }

    return bestValue;
  }

  /**
   * Calculates relevance score for scraped data
   */
  private calculateRelevanceScore(scrapedData: any, broker: Broker): number {
    let relevanceScore = 0.5; // Base score

    // Check if broker name is mentioned
    const brokerNameLower = broker.name.toLowerCase();
    const dataText = JSON.stringify(scrapedData.data).toLowerCase();
    
    if (dataText.includes(brokerNameLower)) {
      relevanceScore += 0.3;
    }

    // Check for specific data points
    if (scrapedData.data.minDeposit) relevanceScore += 0.1;
    if (scrapedData.data.regulation?.length > 0) relevanceScore += 0.2;
    if (scrapedData.data.platforms?.length > 0) relevanceScore += 0.1;
    if (scrapedData.data.rating || scrapedData.data.score) relevanceScore += 0.1;

    return Math.min(1, relevanceScore);
  }

  /**
   * Checks if a source has data for a specific field
   */
  private hasFieldData(source: VerificationSource, fieldName: string): boolean {
    const fieldValue = this.getFieldFromWebData(source.dataExtracted, fieldName);
    return fieldValue !== null && fieldValue !== undefined;
  }

  /**
   * Determines severity of a discrepancy
   */
  private determineSeverity(fieldName: string, comparison: FieldComparisonResult): FieldDiscrepancy['severity'] {
    const rule = fieldValidator.getFieldRule(fieldName);
    
    if (rule?.priority === 'critical') {
      return 'critical';
    } else if (rule?.priority === 'high' || comparison.toleranceExceeded) {
      return 'high';
    } else if (rule?.priority === 'medium' || comparison.confidence < 0.5) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Determines recommended action for a discrepancy
   */
  private determineRecommendedAction(
    comparison: FieldComparisonResult, 
    severity: FieldDiscrepancy['severity']
  ): FieldDiscrepancy['recommendedAction'] {
    if (comparison.confidence > 0.8 && severity !== 'low') {
      return 'update';
    } else if (comparison.confidence > 0.5) {
      return 'review';
    } else {
      return 'ignore';
    }
  }

  /**
   * Generates reasoning for a discrepancy
   */
  private generateDiscrepancyReasoning(
    comparison: FieldComparisonResult, 
    fieldName: string, 
    severity: FieldDiscrepancy['severity']
  ): string {
    const reasons: string[] = [];

    if (comparison.toleranceExceeded) {
      reasons.push('value difference exceeds acceptable tolerance');
    }

    if (comparison.confidence < 0.6) {
      reasons.push('low confidence in web data');
    }

    if (comparison.issues.length > 0) {
      reasons.push(...comparison.issues);
    }

    const baseReason = `Database value "${comparison.dbValue}" differs from web data "${comparison.webValue}"`;
    return `${baseReason}. ${reasons.join(', ')}.`;
  }

  /**
   * Calculates overall confidence score
   */
  private calculateOverallConfidence(
    discrepancies: FieldDiscrepancy[], 
    sources: VerificationSource[]
  ): number {
    if (sources.length === 0) return 0;

    // Base confidence from sources
    const sourceConfidence = sources.reduce((sum, source) => sum + source.confidence, 0) / sources.length;
    
    // Reduce confidence based on discrepancies
    const discrepancyPenalty = discrepancies.reduce((penalty, disc) => {
      switch (disc.severity) {
        case 'critical': return penalty + 0.3;
        case 'high': return penalty + 0.2;
        case 'medium': return penalty + 0.1;
        case 'low': return penalty + 0.05;
        default: return penalty;
      }
    }, 0);

    return Math.max(0, Math.min(1, sourceConfidence - discrepancyPenalty));
  }

  /**
   * Determines overall verification status
   */
  private determineStatus(
    discrepancies: FieldDiscrepancy[], 
    overallConfidence: number, 
    threshold: number
  ): VerificationResult['status'] {
    const criticalDiscrepancies = discrepancies.filter(d => d.severity === 'critical').length;
    const highDiscrepancies = discrepancies.filter(d => d.severity === 'high').length;

    if (criticalDiscrepancies > 0) {
      return 'needs_review';
    } else if (highDiscrepancies > 2 || overallConfidence < threshold) {
      return 'discrepancies_found';
    } else if (discrepancies.length === 0 && overallConfidence >= threshold) {
      return 'verified';
    } else {
      return 'discrepancies_found';
    }
  }

  /**
   * Generates recommendations based on verification results
   */
  private generateRecommendations(
    discrepancies: FieldDiscrepancy[], 
    regulatoryVerification?: any
  ): string[] {
    const recommendations: string[] = [];

    const criticalDiscrepancies = discrepancies.filter(d => d.severity === 'critical');
    if (criticalDiscrepancies.length > 0) {
      recommendations.push(`Address ${criticalDiscrepancies.length} critical data discrepancies immediately`);
    }

    const updateableDiscrepancies = discrepancies.filter(d => d.recommendedAction === 'update');
    if (updateableDiscrepancies.length > 0) {
      recommendations.push(`Consider updating ${updateableDiscrepancies.length} fields with high-confidence web data`);
    }

    const reviewDiscrepancies = discrepancies.filter(d => d.recommendedAction === 'review');
    if (reviewDiscrepancies.length > 0) {
      recommendations.push(`Manually review ${reviewDiscrepancies.length} fields with moderate discrepancies`);
    }

    if (regulatoryVerification?.overallStatus === 'issues_found') {
      recommendations.push('Critical: Regulatory verification found issues that require immediate attention');
    }

    if (recommendations.length === 0) {
      recommendations.push('No significant issues found. Continue regular monitoring.');
    }

    return recommendations;
  }

  /**
   * Saves discrepancies to database
   */
  private async saveDiscrepancies(brokerId: string, discrepancies: FieldDiscrepancy[]): Promise<void> {
    if (!this.supabase) {
      console.log('📝 Skipping database save - no Supabase connection');
      return;
    }

    try {
      const discrepancyRecords = discrepancies.map(disc => ({
        broker_id: brokerId,
        field_name: disc.fieldName,
        db_value: JSON.stringify(disc.dbValue),
        web_value: JSON.stringify(disc.aggregatedWebValue),
        confidence_score: disc.confidenceScore,
        sources_checked: disc.sources.map(s => s.domain),
        tolerance_exceeded: disc.toleranceExceeded,
        created_at: new Date().toISOString()
      }));

      const { error } = await this.supabase
        .from('broker_discrepancies')
        .insert(discrepancyRecords);

      if (error) {
        console.warn('⚠️  Failed to save discrepancies to database:', error.message);
        console.log('📝 Discrepancies will be shown in console output only');
      } else {
        console.log(`💾 Saved ${discrepancyRecords.length} discrepancies to database`);
      }
    } catch (error) {
      console.warn('⚠️  Error saving discrepancies:', error);
      console.log('📝 Discrepancies will be shown in console output only');
    }
  }

  /**
   * Determines if an alert should be sent
   */
  private shouldSendAlert(discrepancies: FieldDiscrepancy[], overallConfidence: number): boolean {
    const criticalDiscrepancies = discrepancies.filter(d => d.severity === 'critical').length;
    const highDiscrepancies = discrepancies.filter(d => d.severity === 'high').length;
    
    return criticalDiscrepancies > 0 || highDiscrepancies > 2 || overallConfidence < 0.4;
  }

  /**
   * Sends alert notification (placeholder for webhook integration)
   */
  private async sendAlert(
    broker: Broker, 
    discrepancies: FieldDiscrepancy[], 
    confidence: number
  ): Promise<void> {
    // This is where you would integrate with Discord/Slack webhooks
    const alertMessage = {
      broker: broker.name,
      discrepancies: discrepancies.length,
      criticalIssues: discrepancies.filter(d => d.severity === 'critical').length,
      confidence: confidence,
      timestamp: new Date().toISOString()
    };

    console.log('🚨 ALERT:', alertMessage);
    
    // TODO: Implement actual webhook calls
    // Example:
    // await this.sendDiscordWebhook(alertMessage);
    // await this.sendSlackWebhook(alertMessage);
  }
}

// Export singleton instance
export const crossVerifier = new CrossVerifier();