import { crossVerifier } from '../services/verification/crossVerifier';
import { BrokerDataAuditor } from '../services/verification/dataAuditor';
import { Broker } from '../types';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Test Cross-Verification Engine
 * This script tests the cross-verification functionality on a few sample brokers
 */

async function runCrossVerificationTest() {
  console.log('🚀 Starting Cross-Verification Engine Test...\n');

  // Initialize Supabase client
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Fetch some sample brokers from the database
    console.log('📊 Fetching sample brokers...');
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .limit(3); // Test with just 3 brokers initially

    if (error) {
      console.error('❌ Failed to fetch brokers:', error);
      return;
    }

    if (!brokers || brokers.length === 0) {
      console.log('⚠️  No brokers found in database');
      return;
    }

    console.log(`✅ Found ${brokers.length} brokers to test\n`);

    // 2. Run cross-verification on each broker
    const verificationResults = [];

    for (const broker of brokers) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📋 Testing broker: ${broker.name}`);
      console.log(`${'='.repeat(60)}`);

      try {
        // Test with different verification options
        const result = await crossVerifier.verifyBroker(broker as Broker, {
          fieldsToCheck: ['name', 'minDeposit', 'regulators', 'foundingYear'],
          maxSources: 3, // Use fewer sources for testing
          confidenceThreshold: 0.5,
          skipRegulatory: false,
          enableAlerts: false, // Disable alerts for testing
          saveDiscrepancies: true
        });

        verificationResults.push(result);

        // Display results
        console.log('\n📊 VERIFICATION RESULTS:');
        console.log(`   Status: ${result.status}`);
        console.log(`   Overall Confidence: ${result.overallConfidence.toFixed(3)}`);
        console.log(`   Processing Time: ${result.processingTime}ms`);
        console.log(`   Sources Used: ${result.sourcesUsed.length}`);
        console.log(`   Fields Checked: ${result.totalFieldsChecked}`);
        console.log(`   Discrepancies Found: ${result.fieldsWithDiscrepancies}`);

        if (result.sourcesUsed.length > 0) {
          console.log('\n🌐 SOURCES USED:');
          result.sourcesUsed.forEach((source, index) => {
            console.log(`   ${index + 1}. ${source.domain}`);
            console.log(`      Confidence: ${source.confidence.toFixed(3)}`);
            console.log(`      Reliability: ${source.reliability.toFixed(3)}`);
            console.log(`      Relevance: ${source.relevanceScore.toFixed(3)}`);
          });
        }

        if (result.discrepancies.length > 0) {
          console.log('\n⚠️  DISCREPANCIES FOUND:');
          result.discrepancies.forEach((disc, index) => {
            console.log(`   ${index + 1}. Field: ${disc.fieldName}`);
            console.log(`      DB Value: ${JSON.stringify(disc.dbValue)}`);
            console.log(`      Web Value: ${JSON.stringify(disc.aggregatedWebValue)}`);
            console.log(`      Severity: ${disc.severity}`);
            console.log(`      Recommended Action: ${disc.recommendedAction}`);
            console.log(`      Confidence: ${disc.confidenceScore.toFixed(3)}`);
            console.log(`      Reasoning: ${disc.reasoning}`);
            console.log();
          });
        }

        if (result.recommendations.length > 0) {
          console.log('💡 RECOMMENDATIONS:');
          result.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
          });
        }

        // Add a delay between requests to be respectful to APIs
        if (brokers.indexOf(broker) < brokers.length - 1) {
          console.log('\n⏱️  Waiting 10 seconds before next broker...');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }

      } catch (error) {
        console.error(`❌ Cross-verification failed for ${broker.name}:`, error);
      }
    }

    // 3. Generate summary report
    console.log('\n' + '='.repeat(80));
    console.log('📋 CROSS-VERIFICATION SUMMARY REPORT');
    console.log('='.repeat(80));

    const totalBrokers = verificationResults.length;
    const verifiedBrokers = verificationResults.filter(r => r.status === 'verified').length;
    const brokersWithDiscrepancies = verificationResults.filter(r => r.status === 'discrepancies_found').length;
    const brokersNeedingReview = verificationResults.filter(r => r.status === 'needs_review').length;
    const failedBrokers = verificationResults.filter(r => r.status === 'failed').length;

    const totalDiscrepancies = verificationResults.reduce((sum, r) => sum + r.discrepancies.length, 0);
    const avgConfidence = verificationResults.reduce((sum, r) => sum + r.overallConfidence, 0) / totalBrokers;
    const avgProcessingTime = verificationResults.reduce((sum, r) => sum + r.processingTime, 0) / totalBrokers;
    const totalSources = verificationResults.reduce((sum, r) => sum + r.sourcesUsed.length, 0);

    console.log(`\n📊 Overall Statistics:`);
    console.log(`   Total Brokers Tested: ${totalBrokers}`);
    console.log(`   Verified: ${verifiedBrokers}`);
    console.log(`   With Discrepancies: ${brokersWithDiscrepancies}`);
    console.log(`   Needs Review: ${brokersNeedingReview}`);
    console.log(`   Failed: ${failedBrokers}`);
    console.log(`   Total Discrepancies: ${totalDiscrepancies}`);
    console.log(`   Average Confidence: ${avgConfidence.toFixed(3)}`);
    console.log(`   Average Processing Time: ${avgProcessingTime.toFixed(0)}ms`);
    console.log(`   Total Sources Consulted: ${totalSources}`);

    // Show brokers by status
    const statusGroups = {
      'verified': verificationResults.filter(r => r.status === 'verified'),
      'discrepancies_found': verificationResults.filter(r => r.status === 'discrepancies_found'),
      'needs_review': verificationResults.filter(r => r.status === 'needs_review'),
      'failed': verificationResults.filter(r => r.status === 'failed')
    };

    for (const [status, results] of Object.entries(statusGroups)) {
      if (results.length > 0) {
        console.log(`\n📋 ${status.toUpperCase().replace('_', ' ')} (${results.length}):`);
        results.forEach(result => {
          console.log(`   • ${result.brokerName} (Confidence: ${result.overallConfidence.toFixed(3)})`);
        });
      }
    }

    // Critical issues that need immediate attention
    const criticalDiscrepancies = verificationResults
      .flatMap(r => r.discrepancies.filter(d => d.severity === 'critical'));
    
    if (criticalDiscrepancies.length > 0) {
      console.log(`\n🚨 CRITICAL ISSUES (${criticalDiscrepancies.length}):`);
      criticalDiscrepancies.forEach((disc, index) => {
        const brokerName = verificationResults.find(r => r.discrepancies.includes(disc))?.brokerName;
        console.log(`   ${index + 1}. ${brokerName} - ${disc.fieldName}: ${disc.reasoning}`);
      });
    }

    console.log('\n✅ Cross-verification test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runCrossVerificationTest()
    .then(() => {
      console.log('\n👋 Test finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test crashed:', error);
      process.exit(1);
    });
}

export { runCrossVerificationTest };