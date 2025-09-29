#!/usr/bin/env node

/**
 * Run Comprehensive Broker Data Audit
 * Usage: npx tsx scripts/audit/runAudit.ts
 */

import { dataAuditor } from './dataAuditor';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🚀 Starting Comprehensive Broker Database Audit');
  console.log('=' .repeat(50));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('');

  try {
    // Perform audit
    const auditResult = await dataAuditor.performAudit();
    
    // Generate reports
    console.log('\n📄 Generating audit reports...');
    const markdownPath = await dataAuditor.generateReport(auditResult);
    const jsonPath = await dataAuditor.exportToJSON(auditResult);
    
    // Display summary
    console.log('\n📊 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total Brokers: ${auditResult.totalBrokers}`);
    console.log(`Overall Quality Score: ${auditResult.dataQuality.overallScore}/10`);
    console.log(`Data Completeness: ${auditResult.dataQuality.completenessScore}/10`);
    console.log(`Data Consistency: ${auditResult.dataQuality.consistencyScore}/10`);
    console.log(`Validation Score: ${auditResult.dataQuality.validationScore}/10`);
    console.log('');
    console.log(`Critical Errors: ${auditResult.criticalErrors.length}`);
    console.log(`Inconsistencies: ${auditResult.inconsistencies.length}`);
    console.log('');
    
    // Show top issues
    if (auditResult.criticalErrors.length > 0) {
      console.log('🔴 TOP CRITICAL ERRORS:');
      auditResult.criticalErrors
        .filter(e => e.severity === 'critical')
        .slice(0, 5)
        .forEach((error, index) => {
          console.log(`${index + 1}. ${error.brokerName}: ${error.recommendation}`);
        });
      console.log('');
    }
    
    // Show recommendations
    console.log('💡 KEY RECOMMENDATIONS:');
    auditResult.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.log('');
    
    console.log('📁 REPORTS GENERATED:');
    console.log(`- Markdown Report: ${markdownPath}`);
    console.log(`- JSON Data Export: ${jsonPath}`);
    console.log('');
    
    // Exit status
    const hasSeriousIssues = auditResult.criticalErrors.some(e => e.severity === 'critical') || 
                             auditResult.inconsistencies.some(i => i.impact === 'high');
    
    if (hasSeriousIssues) {
      console.log('⚠️  ATTENTION REQUIRED: Serious data quality issues found!');
      console.log('Please review the full report and address critical errors.');
      process.exit(1);
    } else {
      console.log('✅ AUDIT COMPLETED: Data quality is acceptable.');
      console.log('Continue with regular monitoring and improvements.');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Run the audit if this file is executed directly
main().catch(console.error);

export { main as runAudit };