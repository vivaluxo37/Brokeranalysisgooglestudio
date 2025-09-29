import { createClient } from '@supabase/supabase-js';
import { Broker } from '../../types';
import { brokers } from '../../data/brokers';
import { brokerValidator } from '../../utils/brokerDataValidator';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * Comprehensive Data Auditor for Broker Database
 * Performs complete audit of data quality, completeness, and consistency
 */

export interface AuditResult {
  timestamp: Date;
  totalBrokers: number;
  dataQuality: {
    overallScore: number;
    completenessScore: number;
    consistencyScore: number;
    validationScore: number;
  };
  fieldAnalysis: FieldAnalysis[];
  criticalErrors: CriticalError[];
  inconsistencies: Inconsistency[];
  recommendations: string[];
  summary: string;
}

export interface FieldAnalysis {
  fieldName: string;
  completeness: number; // 0-100%
  nullCount: number;
  totalCount: number;
  dataType: string;
  validValues: number;
  invalidValues: number;
  uniqueValues: number;
  commonIssues: string[];
}

export interface CriticalError {
  brokerId: string;
  brokerName: string;
  errorType: 'missing_required' | 'invalid_format' | 'out_of_range' | 'inconsistent_data';
  fieldName: string;
  currentValue: any;
  expectedFormat?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface Inconsistency {
  type: 'data_mismatch' | 'logical_error' | 'format_inconsistency';
  description: string;
  affectedBrokers: string[];
  impact: 'high' | 'medium' | 'low';
  suggestedFix: string;
}

export class BrokerDataAuditor {
  private supabase: any;
  
  constructor() {
    // Load environment variables
    dotenv.config();
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Supabase credentials not found. Some features may be limited.');
      this.supabase = null;
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Performs comprehensive audit of broker data
   */
  public async performAudit(): Promise<AuditResult> {
    console.log('🔍 Starting comprehensive broker data audit...');
    
    const timestamp = new Date();
    const totalBrokers = brokers.length;

    // 1. Field Analysis
    const fieldAnalysis = await this.analyzeFields();
    
    // 2. Data Validation using existing validator
    const { criticalErrors, validationScore } = await this.runDataValidation();
    
    // 3. Consistency Analysis
    const inconsistencies = await this.findInconsistencies();
    
    // 4. Calculate scores
    const completenessScore = this.calculateCompletenessScore(fieldAnalysis);
    const consistencyScore = this.calculateConsistencyScore(inconsistencies);
    const overallScore = (completenessScore + consistencyScore + validationScore) / 3;
    
    // 5. Generate recommendations
    const recommendations = this.generateRecommendations(fieldAnalysis, criticalErrors, inconsistencies);
    
    // 6. Create summary
    const summary = this.generateSummary(overallScore, totalBrokers, criticalErrors.length);

    const result: AuditResult = {
      timestamp,
      totalBrokers,
      dataQuality: {
        overallScore: Math.round(overallScore * 100) / 100,
        completenessScore: Math.round(completenessScore * 100) / 100,
        consistencyScore: Math.round(consistencyScore * 100) / 100,
        validationScore: Math.round(validationScore * 100) / 100,
      },
      fieldAnalysis,
      criticalErrors,
      inconsistencies,
      recommendations,
      summary
    };

    console.log(`✅ Audit completed. Overall score: ${result.dataQuality.overallScore}/10`);
    return result;
  }

  /**
   * Analyzes each field across all brokers for completeness and validity
   */
  private async analyzeFields(): Promise<FieldAnalysis[]> {
    console.log('📊 Analyzing field completeness and validity...');
    
    const fieldAnalysis: FieldAnalysis[] = [];
    
    // Core fields to analyze
    const fieldsToAnalyze = [
      { name: 'id', path: 'id', type: 'string', required: true },
      { name: 'name', path: 'name', type: 'string', required: true },
      { name: 'logoUrl', path: 'logoUrl', type: 'string', required: true },
      { name: 'websiteUrl', path: 'websiteUrl', type: 'string', required: true },
      { name: 'score', path: 'score', type: 'number', required: true },
      { name: 'foundingYear', path: 'foundingYear', type: 'number', required: true },
      { name: 'headquarters', path: 'headquarters', type: 'string', required: true },
      { name: 'description', path: 'description', type: 'string', required: true },
      { name: 'minDeposit', path: 'accessibility.minDeposit', type: 'number', required: true },
      { name: 'maxLeverage', path: 'tradingConditions.maxLeverage', type: 'string', required: true },
      { name: 'eurUsdSpread', path: 'tradingConditions.spreads.eurusd', type: 'number', required: true },
      { name: 'regulators', path: 'regulation.regulators', type: 'array', required: true },
      { name: 'platforms', path: 'technology.platforms', type: 'array', required: true },
      { name: 'overallRating', path: 'ratings.regulation', type: 'number', required: false },
    ];

    for (const field of fieldsToAnalyze) {
      const analysis = this.analyzeField(field.name, field.path, field.type, field.required);
      fieldAnalysis.push(analysis);
    }

    return fieldAnalysis;
  }

  private analyzeField(fieldName: string, fieldPath: string, dataType: string, required: boolean): FieldAnalysis {
    let nullCount = 0;
    let validValues = 0;
    let invalidValues = 0;
    const uniqueValues = new Set();
    const commonIssues: string[] = [];

    for (const broker of brokers) {
      const value = this.getNestedValue(broker, fieldPath);
      
      if (value === null || value === undefined || value === '') {
        nullCount++;
        if (required) {
          commonIssues.push('Missing required field');
        }
      } else {
        // Type validation
        if (this.validateFieldType(value, dataType)) {
          validValues++;
          uniqueValues.add(JSON.stringify(value));
        } else {
          invalidValues++;
          commonIssues.push(`Invalid type: expected ${dataType}`);
        }

        // Field-specific validation
        const fieldIssues = this.validateFieldSpecific(fieldName, value);
        commonIssues.push(...fieldIssues);
      }
    }

    const totalCount = brokers.length;
    const completeness = ((totalCount - nullCount) / totalCount) * 100;

    return {
      fieldName,
      completeness: Math.round(completeness * 100) / 100,
      nullCount,
      totalCount,
      dataType,
      validValues,
      invalidValues,
      uniqueValues: uniqueValues.size,
      commonIssues: [...new Set(commonIssues)].slice(0, 5) // Top 5 issues
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private validateFieldType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string': return typeof value === 'string';
      case 'number': return typeof value === 'number' && !isNaN(value);
      case 'boolean': return typeof value === 'boolean';
      case 'array': return Array.isArray(value);
      case 'object': return typeof value === 'object' && !Array.isArray(value);
      default: return true;
    }
  }

  private validateFieldSpecific(fieldName: string, value: any): string[] {
    const issues: string[] = [];
    const currentYear = new Date().getFullYear();

    switch (fieldName) {
      case 'score':
        if (value < 0 || value > 10) issues.push('Score out of range (0-10)');
        break;
      case 'foundingYear':
        if (value < 1900 || value > currentYear) issues.push('Invalid founding year');
        break;
      case 'minDeposit':
        if (value < 0) issues.push('Negative minimum deposit');
        if (value > 10000) issues.push('Unusually high minimum deposit');
        break;
      case 'eurUsdSpread':
        if (value < 0) issues.push('Negative spread');
        if (value > 5) issues.push('Unusually high spread');
        break;
      case 'websiteUrl':
        if (typeof value === 'string' && !value.match(/^https?:\/\/.+/)) {
          issues.push('Invalid URL format');
        }
        break;
      case 'regulators':
        if (Array.isArray(value) && value.length === 0) {
          issues.push('No regulators listed');
        }
        break;
    }

    return issues;
  }

  /**
   * Runs data validation using the existing BrokerDataValidator
   */
  private async runDataValidation(): Promise<{ criticalErrors: CriticalError[], validationScore: number }> {
    console.log('🔬 Running data validation checks...');
    
    const criticalErrors: CriticalError[] = [];
    let totalValidationScore = 0;

    for (const broker of brokers) {
      const validation = brokerValidator.validateBroker(broker);
      
      // Convert validation errors to critical errors
      validation.errors.forEach(error => {
        criticalErrors.push({
          brokerId: broker.id,
          brokerName: broker.name,
          errorType: 'missing_required',
          fieldName: 'unknown',
          currentValue: null,
          severity: 'critical',
          recommendation: error
        });
      });

      validation.warnings.forEach(warning => {
        criticalErrors.push({
          brokerId: broker.id,
          brokerName: broker.name,
          errorType: 'invalid_format',
          fieldName: 'unknown',
          currentValue: null,
          severity: 'medium',
          recommendation: warning
        });
      });

      // Calculate validation score (inversely related to error count)
      const brokerScore = validation.isValid ? 10 : Math.max(0, 10 - validation.errors.length - (validation.warnings.length * 0.5));
      totalValidationScore += brokerScore;
    }

    const validationScore = totalValidationScore / brokers.length;
    return { criticalErrors, validationScore };
  }

  /**
   * Finds logical inconsistencies in the data
   */
  private async findInconsistencies(): Promise<Inconsistency[]> {
    console.log('🔍 Searching for data inconsistencies...');
    
    const inconsistencies: Inconsistency[] = [];

    // 1. Check for duplicate broker names
    const nameMap = new Map<string, string[]>();
    brokers.forEach(broker => {
      const name = broker.name.toLowerCase();
      if (!nameMap.has(name)) nameMap.set(name, []);
      nameMap.get(name)!.push(broker.id);
    });

    nameMap.forEach((ids, name) => {
      if (ids.length > 1) {
        inconsistencies.push({
          type: 'data_mismatch',
          description: `Duplicate broker names found: "${name}"`,
          affectedBrokers: ids,
          impact: 'high',
          suggestedFix: 'Review and consolidate duplicate entries'
        });
      }
    });

    // 2. Check for logical inconsistencies in founding year vs business years
    brokers.forEach(broker => {
      if (broker.transparency?.yearsInBusiness && broker.foundingYear) {
        const expectedYears = new Date().getFullYear() - broker.foundingYear;
        const actualYears = broker.transparency.yearsInBusiness;
        if (Math.abs(expectedYears - actualYears) > 2) {
          inconsistencies.push({
            type: 'logical_error',
            description: `Years in business (${actualYears}) doesn't match founding year (${broker.foundingYear})`,
            affectedBrokers: [broker.id],
            impact: 'medium',
            suggestedFix: 'Verify and correct founding year or years in business'
          });
        }
      }
    });

    // 3. Check for inconsistent regulation data
    brokers.forEach(broker => {
      const legacyRegulators = broker.regulation?.regulators || [];
      const securityRegulators = broker.security?.regulatedBy?.map(r => r.regulator) || [];
      
      if (legacyRegulators.length > 0 && securityRegulators.length > 0) {
        const mismatch = legacyRegulators.some(reg => !securityRegulators.includes(reg));
        if (mismatch) {
          inconsistencies.push({
            type: 'data_mismatch',
            description: 'Mismatch between regulation.regulators and security.regulatedBy',
            affectedBrokers: [broker.id],
            impact: 'medium',
            suggestedFix: 'Synchronize regulatory information across fields'
          });
        }
      }
    });

    return inconsistencies;
  }

  private calculateCompletenessScore(fieldAnalysis: FieldAnalysis[]): number {
    const requiredFields = ['id', 'name', 'logoUrl', 'websiteUrl', 'score', 'foundingYear', 'headquarters', 'description'];
    const requiredFieldsAnalysis = fieldAnalysis.filter(f => requiredFields.includes(f.fieldName));
    const averageCompleteness = requiredFieldsAnalysis.reduce((sum, field) => sum + field.completeness, 0) / requiredFieldsAnalysis.length;
    return (averageCompleteness / 100) * 10; // Convert to 0-10 scale
  }

  private calculateConsistencyScore(inconsistencies: Inconsistency[]): number {
    const highImpact = inconsistencies.filter(i => i.impact === 'high').length;
    const mediumImpact = inconsistencies.filter(i => i.impact === 'medium').length;
    const lowImpact = inconsistencies.filter(i => i.impact === 'low').length;
    
    const penalty = (highImpact * 2) + (mediumImpact * 1) + (lowImpact * 0.5);
    return Math.max(0, 10 - penalty);
  }

  private generateRecommendations(
    fieldAnalysis: FieldAnalysis[], 
    criticalErrors: CriticalError[], 
    inconsistencies: Inconsistency[]
  ): string[] {
    const recommendations: string[] = [];

    // Field completeness recommendations
    const incompleteFields = fieldAnalysis.filter(f => f.completeness < 90);
    if (incompleteFields.length > 0) {
      recommendations.push(`Improve data completeness for fields: ${incompleteFields.map(f => f.fieldName).join(', ')}`);
    }

    // Critical error recommendations
    if (criticalErrors.length > 0) {
      const criticalCount = criticalErrors.filter(e => e.severity === 'critical').length;
      if (criticalCount > 0) {
        recommendations.push(`Address ${criticalCount} critical data errors immediately`);
      }
    }

    // Inconsistency recommendations
    const highImpactInconsistencies = inconsistencies.filter(i => i.impact === 'high').length;
    if (highImpactInconsistencies > 0) {
      recommendations.push(`Resolve ${highImpactInconsistencies} high-impact data inconsistencies`);
    }

    // General recommendations
    if (fieldAnalysis.some(f => f.commonIssues.includes('Invalid URL format'))) {
      recommendations.push('Standardize and validate all URL formats');
    }

    if (fieldAnalysis.some(f => f.commonIssues.includes('No regulators listed'))) {
      recommendations.push('Ensure all brokers have regulatory information');
    }

    return recommendations.length > 0 ? recommendations : ['Data quality is excellent. Continue regular monitoring.'];
  }

  private generateSummary(overallScore: number, totalBrokers: number, criticalErrorCount: number): string {
    let status = 'Excellent';
    if (overallScore < 8) status = 'Good';
    if (overallScore < 6) status = 'Fair';
    if (overallScore < 4) status = 'Poor';

    return `Data audit completed for ${totalBrokers} brokers. Overall data quality: ${status} (${overallScore}/10). ${criticalErrorCount} critical errors found that require immediate attention.`;
  }

  /**
   * Generates and saves comprehensive audit report
   */
  public async generateReport(auditResult: AuditResult): Promise<string> {
    const reportDate = auditResult.timestamp.toISOString().split('T')[0];
    const reportPath = path.join(process.cwd(), 'reports', `broker_audit_${reportDate}.md`);

    const reportContent = this.generateMarkdownReport(auditResult);
    
    try {
      fs.writeFileSync(reportPath, reportContent, 'utf8');
      console.log(`📄 Audit report saved to: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error('Error saving audit report:', error);
      throw error;
    }
  }

  private generateMarkdownReport(result: AuditResult): string {
    const date = result.timestamp.toISOString().split('T')[0];
    const time = result.timestamp.toISOString().split('T')[1].split('.')[0];

    return `# Broker Database Audit Report

**Date:** ${date}  
**Time:** ${time} UTC  
**Total Brokers Analyzed:** ${result.totalBrokers}  

## Executive Summary

${result.summary}

## Data Quality Scores

| Metric | Score | Status |
|--------|-------|---------|
| **Overall Quality** | ${result.dataQuality.overallScore}/10 | ${this.getScoreStatus(result.dataQuality.overallScore)} |
| **Data Completeness** | ${result.dataQuality.completenessScore}/10 | ${this.getScoreStatus(result.dataQuality.completenessScore)} |
| **Data Consistency** | ${result.dataQuality.consistencyScore}/10 | ${this.getScoreStatus(result.dataQuality.consistencyScore)} |
| **Validation Score** | ${result.dataQuality.validationScore}/10 | ${this.getScoreStatus(result.dataQuality.validationScore)} |

## Field Analysis

| Field | Completeness | Null Count | Valid Values | Invalid Values | Unique Values | Common Issues |
|-------|-------------|------------|--------------|----------------|---------------|---------------|
${result.fieldAnalysis.map(f => 
  `| ${f.fieldName} | ${f.completeness}% | ${f.nullCount} | ${f.validValues} | ${f.invalidValues} | ${f.uniqueValues} | ${f.commonIssues.join(', ') || 'None'} |`
).join('\n')}

## Critical Errors (${result.criticalErrors.length})

${result.criticalErrors.length > 0 ? result.criticalErrors.map(error => 
  `### ${error.severity.toUpperCase()}: ${error.brokerName} (${error.brokerId})
- **Field:** ${error.fieldName}
- **Error Type:** ${error.errorType}
- **Current Value:** ${error.currentValue || 'NULL'}
- **Recommendation:** ${error.recommendation}
`).join('\n') : 'No critical errors found! 🎉'}

## Data Inconsistencies (${result.inconsistencies.length})

${result.inconsistencies.length > 0 ? result.inconsistencies.map(inc => 
  `### ${inc.type.replace('_', ' ').toUpperCase()} - ${inc.impact.toUpperCase()} Impact
- **Description:** ${inc.description}
- **Affected Brokers:** ${inc.affectedBrokers.join(', ')}
- **Suggested Fix:** ${inc.suggestedFix}
`).join('\n') : 'No data inconsistencies found! 🎉'}

## Recommendations

${result.recommendations.map(rec => `- ${rec}`).join('\n')}

## Next Steps

1. **Immediate Actions:**
   - Address all critical errors
   - Resolve high-impact inconsistencies
   - Fill missing data for required fields

2. **Short-term (1-2 weeks):**
   - Implement data validation rules
   - Set up monitoring for data quality
   - Create data entry guidelines

3. **Long-term (1 month+):**
   - Automate data quality checks
   - Implement real-time validation
   - Set up alerts for data quality degradation

---
*Report generated by Broker Data Auditor v1.0*
`;
  }

  private getScoreStatus(score: number): string {
    if (score >= 9) return '🟢 Excellent';
    if (score >= 7) return '🟡 Good';
    if (score >= 5) return '🟠 Fair';
    return '🔴 Poor';
  }

  /**
   * Exports audit results to JSON for programmatic use
   */
  public async exportToJSON(auditResult: AuditResult): Promise<string> {
    const reportDate = auditResult.timestamp.toISOString().split('T')[0];
    const jsonPath = path.join(process.cwd(), 'reports', `broker_audit_${reportDate}.json`);

    try {
      fs.writeFileSync(jsonPath, JSON.stringify(auditResult, null, 2), 'utf8');
      console.log(`📊 Audit data exported to: ${jsonPath}`);
      return jsonPath;
    } catch (error) {
      console.error('Error exporting audit data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dataAuditor = new BrokerDataAuditor();