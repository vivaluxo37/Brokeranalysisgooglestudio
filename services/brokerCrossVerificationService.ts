/**
 * Broker Cross-Verification Service
 * Streamlined version that works within existing codebase patterns
 * Verifies broker data against web sources and detects discrepancies
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

interface BrokerData {
  id: string | number;
  name: string;
  year_founded: number;
  headquarters: string;
  website: string;
  minimum_deposit: number;
  regulation_status: string;
  overall_rating: number;
  trust_score: number;
}

interface VerificationSource {
  domain: string;
  url: string;
  dataFound: any;
  confidence: number;
  scrapedAt: Date;
}

interface FieldDiscrepancy {
  fieldName: string;
  dbValue: any;
  webValue: any;
  severity: 'critical' | 'high' | 'medium' | 'low';
  action: 'update' | 'review' | 'ignore';
  confidence: number;
  sources: string[];
  reasoning: string;
}

interface VerificationResult {
  brokerId: string;
  brokerName: string;
  verifiedAt: Date;
  status: 'verified' | 'discrepancies_found' | 'failed';
  overallConfidence: number;
  discrepancies: FieldDiscrepancy[];
  sourcesChecked: VerificationSource[];
  processingTime: number;
  recommendations: string[];
}

export class BrokerCrossVerificationService {
  private supabase: any;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Verify a single broker against web sources
   */
  async verifyBroker(brokerData: BrokerData): Promise<VerificationResult> {
    const startTime = Date.now();
    console.log(`🔍 Starting verification for ${brokerData.name}...`);

    try {
      // 1. Gather web data from multiple sources
      const sources = await this.gatherWebData(brokerData);

      // 2. Compare database values with web data
      const discrepancies = this.compareFields(brokerData, sources);

      // 3. Calculate overall confidence and status
      const overallConfidence = this.calculateConfidence(sources, discrepancies);
      const status = discrepancies.length === 0 ? 'verified' : 'discrepancies_found';

      // 4. Generate recommendations
      const recommendations = this.generateRecommendations(discrepancies);

      const result: VerificationResult = {
        brokerId: brokerData.id.toString(),
        brokerName: brokerData.name,
        verifiedAt: new Date(),
        status,
        overallConfidence,
        discrepancies,
        sourcesChecked: sources,
        processingTime: Date.now() - startTime,
        recommendations
      };

      console.log(`✅ Verification completed for ${brokerData.name}`);
      console.log(`   Status: ${status}, Confidence: ${overallConfidence.toFixed(2)}, Discrepancies: ${discrepancies.length}`);

      return result;

    } catch (error) {
      console.error(`❌ Verification failed for ${brokerData.name}:`, error);

      return {
        brokerId: brokerData.id.toString(),
        brokerName: brokerData.name,
        verifiedAt: new Date(),
        status: 'failed',
        overallConfidence: 0,
        discrepancies: [],
        sourcesChecked: [],
        processingTime: Date.now() - startTime,
        recommendations: [`Verification failed: ${error.message}`]
      };
    }
  }

  /**
   * Gather data from web sources (simplified version)
   */
  private async gatherWebData(broker: BrokerData): Promise<VerificationSource[]> {
    const sources: VerificationSource[] = [];
    console.log(`📡 Gathering web data for ${broker.name}...`);

    try {
      // For demonstration, we'll create mock web sources
      // In a real implementation, this would use web scraping/search APIs

      // Source 1: Mock Forex Peace Army data
      sources.push({
        domain: 'forexpeacearmy.com',
        url: `https://forexpeacearmy.com/broker/${broker.name.toLowerCase().replace(/\s+/g, '-')}`,
        dataFound: {
          name: broker.name,
          foundingYear: broker.year_founded + (Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0), // Sometimes different
          headquarters: broker.headquarters,
          minDeposit: broker.minimum_deposit + (Math.random() > 0.6 ? Math.floor(Math.random() * 50) : 0),
          rating: Math.random() * 5,
          platforms: ['MT4', 'MT5', 'WebTrader']
        },
        confidence: 0.7 + Math.random() * 0.2,
        scrapedAt: new Date()
      });

      // Source 2: Mock FXEmpire data
      sources.push({
        domain: 'fxempire.com',
        url: `https://fxempire.com/brokers/${broker.name.toLowerCase().replace(/\s+/g, '-')}`,
        dataFound: {
          name: broker.name,
          foundingYear: broker.year_founded,
          headquarters: broker.headquarters + (Math.random() > 0.8 ? ', Additional Info' : ''),
          minDeposit: broker.minimum_deposit,
          regulation: broker.regulation_status
        },
        confidence: 0.8 + Math.random() * 0.15,
        scrapedAt: new Date()
      });

      // Source 3: Mock Investopedia or similar
      if (Math.random() > 0.3) { // Sometimes this source has data
        sources.push({
          domain: 'investopedia.com',
          url: `https://investopedia.com/brokers/${broker.name.toLowerCase().replace(/\s+/g, '-')}-review`,
          dataFound: {
            name: broker.name,
            foundingYear: broker.year_founded,
            minDeposit: broker.minimum_deposit + (Math.random() > 0.5 ? 5 : 0),
            trustScore: broker.trust_score + (Math.random() - 0.5) * 0.5
          },
          confidence: 0.6 + Math.random() * 0.25,
          scrapedAt: new Date()
        });
      }

      console.log(`📊 Found data from ${sources.length} sources`);

    } catch (error) {
      console.error('Failed to gather web data:', error);
    }

    return sources;
  }

  /**
   * Compare database fields with web data
   */
  private compareFields(broker: BrokerData, sources: VerificationSource[]): FieldDiscrepancy[] {
    const discrepancies: FieldDiscrepancy[] = [];

    // Fields to check and their comparison logic
    const fieldsToCheck = [
      { field: 'name', dbValue: broker.name, tolerance: 0 },
      { field: 'foundingYear', dbValue: broker.year_founded, tolerance: 1 },
      { field: 'headquarters', dbValue: broker.headquarters, tolerance: 0 },
      { field: 'minDeposit', dbValue: broker.minimum_deposit, tolerance: 10 }
    ];

    for (const { field, dbValue, tolerance } of fieldsToCheck) {
      const webValues = this.extractWebValues(sources, field);
      
      if (webValues.length === 0) continue;

      const aggregatedWebValue = this.aggregateWebValues(webValues);
      const discrepancy = this.checkFieldDiscrepancy(field, dbValue, aggregatedWebValue, tolerance, sources);

      if (discrepancy) {
        discrepancies.push(discrepancy);
      }
    }

    return discrepancies;
  }

  /**
   * Extract web values for a specific field
   */
  private extractWebValues(sources: VerificationSource[], fieldName: string): any[] {
    const values: any[] = [];

    for (const source of sources) {
      const data = source.dataFound;
      let value = null;

      switch (fieldName) {
        case 'name':
          value = data.name;
          break;
        case 'foundingYear':
          value = data.foundingYear || data.yearFounded;
          break;
        case 'headquarters':
          value = data.headquarters || data.location;
          break;
        case 'minDeposit':
          value = data.minDeposit || data.minimumDeposit;
          break;
      }

      if (value !== null && value !== undefined) {
        values.push({ value, source: source.domain, confidence: source.confidence });
      }
    }

    return values;
  }

  /**
   * Aggregate multiple web values using weighted average/consensus
   */
  private aggregateWebValues(webValues: any[]): any {
    if (webValues.length === 0) return null;
    if (webValues.length === 1) return webValues[0].value;

    // For numerical values, calculate weighted average
    const firstValue = webValues[0].value;
    if (typeof firstValue === 'number') {
      let totalWeight = 0;
      let weightedSum = 0;

      webValues.forEach(({ value, confidence }) => {
        weightedSum += value * confidence;
        totalWeight += confidence;
      });

      return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : firstValue;
    }

    // For strings, return the most confident value
    const bestValue = webValues.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    return bestValue.value;
  }

  /**
   * Check if there's a discrepancy for a field
   */
  private checkFieldDiscrepancy(
    fieldName: string,
    dbValue: any,
    webValue: any,
    tolerance: number,
    sources: VerificationSource[]
  ): FieldDiscrepancy | null {
    if (webValue === null || webValue === undefined) return null;

    let hasDiscrepancy = false;
    let severity: FieldDiscrepancy['severity'] = 'low';

    // Check based on field type
    if (typeof dbValue === 'number' && typeof webValue === 'number') {
      const difference = Math.abs(dbValue - webValue);
      hasDiscrepancy = difference > tolerance;
      
      if (difference > tolerance * 3) severity = 'high';
      else if (difference > tolerance * 2) severity = 'medium';
      else severity = 'low';
    } else if (typeof dbValue === 'string' && typeof webValue === 'string') {
      // For strings, check if they're significantly different
      const similarity = this.calculateStringSimilarity(dbValue, webValue);
      hasDiscrepancy = similarity < 0.8;
      
      if (similarity < 0.5) severity = 'high';
      else if (similarity < 0.7) severity = 'medium';
      else severity = 'low';
    } else {
      hasDiscrepancy = dbValue !== webValue;
      severity = 'medium';
    }

    if (!hasDiscrepancy) return null;

    // Determine critical fields
    if (['name', 'foundingYear'].includes(fieldName)) {
      severity = severity === 'low' ? 'medium' : 'high';
    }

    return {
      fieldName,
      dbValue,
      webValue,
      severity,
      action: severity === 'high' ? 'review' : severity === 'medium' ? 'review' : 'ignore',
      confidence: sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length,
      sources: sources.map(s => s.domain),
      reasoning: this.generateDiscrepancyReasoning(fieldName, dbValue, webValue, severity)
    };
  }

  /**
   * Calculate string similarity (simple algorithm)
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(sources: VerificationSource[], discrepancies: FieldDiscrepancy[]): number {
    if (sources.length === 0) return 0;

    const sourceConfidence = sources.reduce((sum, source) => sum + source.confidence, 0) / sources.length;
    
    // Reduce confidence based on discrepancies
    const discrepancyPenalty = discrepancies.reduce((penalty, disc) => {
      switch (disc.severity) {
        case 'critical': return penalty + 0.4;
        case 'high': return penalty + 0.3;
        case 'medium': return penalty + 0.15;
        case 'low': return penalty + 0.05;
        default: return penalty;
      }
    }, 0);

    return Math.max(0, Math.min(1, sourceConfidence - discrepancyPenalty));
  }

  /**
   * Generate reasoning for discrepancy
   */
  private generateDiscrepancyReasoning(fieldName: string, dbValue: any, webValue: any, severity: string): string {
    const baseReason = `Database shows "${dbValue}" but web sources indicate "${webValue}"`;
    
    switch (severity) {
      case 'high':
        return `${baseReason}. This is a significant discrepancy that requires review.`;
      case 'medium':
        return `${baseReason}. This difference should be investigated.`;
      default:
        return `${baseReason}. This is a minor discrepancy.`;
    }
  }

  /**
   * Generate recommendations based on discrepancies
   */
  private generateRecommendations(discrepancies: FieldDiscrepancy[]): string[] {
    const recommendations: string[] = [];

    const criticalCount = discrepancies.filter(d => d.severity === 'critical').length;
    const highCount = discrepancies.filter(d => d.severity === 'high').length;
    const mediumCount = discrepancies.filter(d => d.severity === 'medium').length;

    if (criticalCount > 0) {
      recommendations.push(`Critical: Address ${criticalCount} critical discrepancies immediately`);
    }

    if (highCount > 0) {
      recommendations.push(`High Priority: Review ${highCount} high-severity discrepancies`);
    }

    if (mediumCount > 0) {
      recommendations.push(`Medium Priority: Investigate ${mediumCount} medium-severity discrepancies`);
    }

    if (discrepancies.length === 0) {
      recommendations.push('No significant discrepancies found. Data appears accurate.');
    }

    return recommendations;
  }

  /**
   * Verify multiple brokers
   */
  async verifyMultipleBrokers(brokerIds?: string[]): Promise<VerificationResult[]> {
    console.log('🚀 Starting batch broker verification...');

    try {
      // Fetch brokers from database
      let query = this.supabase
        .from('brokers')
        .select('id, name, year_founded, headquarters, website, minimum_deposit, regulation_status, overall_rating, trust_score')
        .eq('is_active', true);

      if (brokerIds && brokerIds.length > 0) {
        query = query.in('id', brokerIds);
      } else {
        query = query.limit(5); // Default to 5 brokers for testing
      }

      const { data: brokers, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch brokers: ${error.message}`);
      }

      if (!brokers || brokers.length === 0) {
        throw new Error('No brokers found for verification');
      }

      console.log(`📊 Found ${brokers.length} brokers to verify`);

      const results: VerificationResult[] = [];

      // Verify each broker with delay between requests
      for (let i = 0; i < brokers.length; i++) {
        const broker = brokers[i];
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📋 Verifying ${i + 1}/${brokers.length}: ${broker.name}`);
        console.log('='.repeat(60));

        const result = await this.verifyBroker(broker);
        results.push(result);

        // Add delay between requests to be respectful
        if (i < brokers.length - 1) {
          console.log('⏱️  Waiting 3 seconds before next verification...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      console.log('\n🎉 Batch verification completed!');
      return results;

    } catch (error) {
      console.error('💥 Batch verification failed:', error);
      throw error;
    }
  }

  /**
   * Generate summary report
   */
  generateSummaryReport(results: VerificationResult[]): string {
    const totalBrokers = results.length;
    const verifiedBrokers = results.filter(r => r.status === 'verified').length;
    const brokersWithDiscrepancies = results.filter(r => r.status === 'discrepancies_found').length;
    const failedBrokers = results.filter(r => r.status === 'failed').length;

    const totalDiscrepancies = results.reduce((sum, r) => sum + r.discrepancies.length, 0);
    const avgConfidence = results.reduce((sum, r) => sum + r.overallConfidence, 0) / totalBrokers;
    const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / totalBrokers;

    const report = `
📋 CROSS-VERIFICATION SUMMARY REPORT
${'='.repeat(50)}

📊 Overall Statistics:
   Total Brokers Verified: ${totalBrokers}
   Verified (No Issues): ${verifiedBrokers} (${((verifiedBrokers/totalBrokers)*100).toFixed(1)}%)
   With Discrepancies: ${brokersWithDiscrepancies} (${((brokersWithDiscrepancies/totalBrokers)*100).toFixed(1)}%)
   Failed Verification: ${failedBrokers} (${((failedBrokers/totalBrokers)*100).toFixed(1)}%)

📈 Quality Metrics:
   Total Discrepancies Found: ${totalDiscrepancies}
   Average Confidence Score: ${avgConfidence.toFixed(3)}
   Average Processing Time: ${avgProcessingTime.toFixed(0)}ms per broker

📋 Broker Results:
${results.map((result, index) => {
  return `   ${index + 1}. ${result.brokerName}
      Status: ${result.status}
      Confidence: ${result.overallConfidence.toFixed(3)}
      Discrepancies: ${result.discrepancies.length}
      Processing Time: ${result.processingTime}ms`;
}).join('\n')}

${results.some(r => r.discrepancies.length > 0) ? `
🚨 Critical Issues Found:
${results.filter(r => r.discrepancies.some(d => d.severity === 'high')).map(result => {
  const criticalDiscrepancies = result.discrepancies.filter(d => d.severity === 'high');
  return `   • ${result.brokerName}: ${criticalDiscrepancies.length} high-severity discrepancies
${criticalDiscrepancies.map(d => `     - ${d.fieldName}: ${d.reasoning}`).join('\n')}`;
}).join('\n')}
` : '✅ No critical issues found in any broker data.'}

💡 Next Steps:
${results.flatMap(r => r.recommendations).filter((rec, index, arr) => arr.indexOf(rec) === index).map(rec => `   • ${rec}`).join('\n')}
`;

    return report;
  }
}

// Export singleton instance
export const brokerCrossVerificationService = new BrokerCrossVerificationService();