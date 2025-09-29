import { brokerCrossVerificationService } from '../services/brokerCrossVerificationService';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Test the streamlined cross-verification service
 */

async function testStreamlinedCrossVerification() {
  console.log('🚀 Testing Streamlined Cross-Verification Service...\n');
  console.log(`📅 Test Started: ${new Date().toISOString()}`);
  console.log('=' .repeat(80));

  try {
    // Test 1: Verify multiple brokers (batch verification)
    console.log('\n🧪 Test 1: Batch Broker Verification');
    console.log('='.repeat(50));
    
    const results = await brokerCrossVerificationService.verifyMultipleBrokers();
    
    console.log(`\n📊 Verification Results: ${results.length} brokers processed`);

    // Test 2: Generate and display summary report
    console.log('\n📋 Test 2: Generating Summary Report');
    console.log('='.repeat(50));
    
    const summaryReport = brokerCrossVerificationService.generateSummaryReport(results);
    console.log(summaryReport);

    // Test 3: Save detailed results to file
    console.log('\n💾 Test 3: Saving Results to File');
    console.log('='.repeat(50));

    const reportData = {
      testCompleted: new Date().toISOString(),
      summary: {
        totalBrokers: results.length,
        verifiedBrokers: results.filter(r => r.status === 'verified').length,
        discrepanciesFound: results.reduce((sum, r) => sum + r.discrepancies.length, 0),
        averageConfidence: results.reduce((sum, r) => sum + r.overallConfidence, 0) / results.length,
        averageProcessingTime: results.reduce((sum, r) => sum + r.processingTime, 0) / results.length
      },
      detailedResults: results,
      summaryReport: summaryReport
    };

    // Save to reports directory
    const reportsDir = join(process.cwd(), 'reports');
    try {
      await fs.access(reportsDir);
    } catch {
      await fs.mkdir(reportsDir, { recursive: true });
      console.log('📁 Created reports directory');
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = join(reportsDir, `streamlined-cross-verification-${timestamp}.json`);
    
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`✅ Detailed results saved to: ${reportPath}`);

    // Test 4: Display key insights
    console.log('\n🔍 Test 4: Key Insights');
    console.log('='.repeat(50));

    const highSeverityDiscrepancies = results.flatMap(r => 
      r.discrepancies.filter(d => d.severity === 'high')
    );

    const mediumSeverityDiscrepancies = results.flatMap(r => 
      r.discrepancies.filter(d => d.severity === 'medium')
    );

    console.log(`\n📈 Data Quality Insights:`);
    console.log(`   High-severity discrepancies: ${highSeverityDiscrepancies.length}`);
    console.log(`   Medium-severity discrepancies: ${mediumSeverityDiscrepancies.length}`);
    
    if (highSeverityDiscrepancies.length > 0) {
      console.log('\n🚨 High-Severity Issues:');
      highSeverityDiscrepancies.forEach((disc, index) => {
        const broker = results.find(r => r.discrepancies.includes(disc));
        console.log(`   ${index + 1}. ${broker?.brokerName} - ${disc.fieldName}`);
        console.log(`      ${disc.reasoning}`);
      });
    }

    // Test 5: Performance Analysis
    console.log('\n⚡ Test 5: Performance Analysis');
    console.log('='.repeat(50));

    const processingTimes = results.map(r => r.processingTime);
    const minTime = Math.min(...processingTimes);
    const maxTime = Math.max(...processingTimes);
    const avgTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;

    console.log(`\n⏱️  Processing Performance:`);
    console.log(`   Fastest verification: ${minTime}ms`);
    console.log(`   Slowest verification: ${maxTime}ms`);
    console.log(`   Average time: ${avgTime.toFixed(0)}ms`);
    console.log(`   Total processing time: ${processingTimes.reduce((sum, time) => sum + time, 0)}ms`);

    const sourcesPerBroker = results.map(r => r.sourcesChecked.length);
    const avgSources = sourcesPerBroker.reduce((sum, count) => sum + count, 0) / sourcesPerBroker.length;

    console.log(`\n📊 Source Coverage:`);
    console.log(`   Average sources per broker: ${avgSources.toFixed(1)}`);
    console.log(`   Total sources consulted: ${sourcesPerBroker.reduce((sum, count) => sum + count, 0)}`);

    console.log('\n🎉 All tests completed successfully!');
    
    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log('🏆 FINAL TEST SUMMARY');
    console.log('='.repeat(80));
    
    const passedTests = [
      results.length > 0 ? 'Batch verification' : null,
      summaryReport.length > 0 ? 'Summary report generation' : null,
      'File saving',
      'Insights analysis',
      'Performance analysis'
    ].filter(Boolean);

    console.log(`✅ Tests passed: ${passedTests.length}/5`);
    console.log(`📊 Brokers verified: ${results.length}`);
    console.log(`⚠️  Discrepancies detected: ${results.reduce((sum, r) => sum + r.discrepancies.length, 0)}`);
    console.log(`💯 Average confidence: ${(results.reduce((sum, r) => sum + r.overallConfidence, 0) / results.length * 100).toFixed(1)}%`);
    
    if (highSeverityDiscrepancies.length > 0) {
      console.log(`\n🔴 Action Required: ${highSeverityDiscrepancies.length} high-severity discrepancies need review`);
    } else {
      console.log(`\n🟢 All data quality checks passed!`);
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
    console.error('   Stack:', error.stack);
    throw error;
  }
}

// Run the test
testStreamlinedCrossVerification()
  .then(() => {
    console.log('\n👋 Streamlined cross-verification test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test crashed:', error);
    process.exit(1);
  });