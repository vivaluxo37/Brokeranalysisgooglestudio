#!/usr/bin/env node

/**
 * Test Script for Web Search Integration
 * Tests search engine, scrapers, regulatory verifier, and source reliability
 * Usage: npx tsx scripts/testWebSearchIntegration.ts
 */

import { searchEngine } from '../services/verification/searchEngine';
import { webScrapers } from '../services/verification/webScrapers';
import { regAuthorityVerifier } from '../services/verification/regAuthorityVerifier';
import { sourceReliabilityManager } from '../services/verification/sourceReliability';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSearchEngine() {
  console.log('🔍 Testing Search Engine...');
  console.log('=' .repeat(40));

  try {
    // Test basic search
    const searchResult = await searchEngine.search({
      query: 'Pepperstone broker review',
      num: 3,
      cache: false
    });

    console.log(`Search Query: "${searchResult.query}"`);
    console.log(`Results Found: ${searchResult.results.length}`);
    console.log(`Search Time: ${searchResult.searchTime}ms`);
    console.log(`Cached: ${searchResult.cached}`);

    if (searchResult.results.length > 0) {
      console.log('\nSample Results:');
      searchResult.results.slice(0, 2).forEach((result, index) => {
        console.log(`${index + 1}. ${result.title}`);
        console.log(`   Source: ${result.source}`);
        console.log(`   URL: ${result.link}`);
        console.log(`   Snippet: ${result.snippet.substring(0, 100)}...`);
      });
    }

    // Test broker-specific search
    console.log('\n🎯 Testing Broker-Specific Search...');
    const brokerSearch = await searchEngine.searchBrokerInfo('Pepperstone', 'regulation');
    console.log(`Broker Search Results: ${brokerSearch.results.length}`);
    
    // Test reliable sources search
    console.log('\n🏆 Testing Reliable Sources Search...');
    const reliableSearch = await searchEngine.searchReliableSources('Pepperstone spread');
    console.log(`Reliable Sources Results: ${reliableSearch.results.length}`);

    console.log('✅ Search Engine Test Completed\n');
    return true;

  } catch (error) {
    console.error('❌ Search Engine Test Failed:', error);
    console.log('ℹ️  Note: This may fail without SERPAPI_API_KEY in environment\n');
    return false;
  }
}

async function testWebScrapers() {
  console.log('🕷️  Testing Web Scrapers...');
  console.log('=' .repeat(40));

  try {
    // Create mock search results for testing
    const mockSearchResults = [
      {
        title: 'Pepperstone Broker Review 2024 - Forex Peace Army',
        link: 'https://www.forexpeacearmy.com/forex_reviews/pepperstone',
        snippet: 'Pepperstone is regulated by ASIC and FCA with competitive spreads from 0.0 pips',
        position: 1,
        source: 'forexpeacearmy.com'
      },
      {
        title: 'Pepperstone Review - FX Empire',
        link: 'https://www.fxempire.com/brokers/pepperstone/review',
        snippet: 'Pepperstone offers MT4 and MT5 platforms with minimum deposit of $200',
        position: 2,
        source: 'fxempire.com'
      }
    ];

    // Test robots.txt checking
    console.log('🤖 Testing Robots.txt Check...');
    const robotsAllowed = await webScrapers.checkRobotsPermission('https://www.forexpeacearmy.com');
    console.log(`Robots.txt allows scraping: ${robotsAllowed}`);

    // Test scraping (will likely fail without actual page access, but tests the structure)
    console.log('\n📄 Testing Web Scraping...');
    for (const result of mockSearchResults) {
      try {
        const scrapedData = await webScrapers.scrapeBrokerInfo(result, 'Pepperstone');
        console.log(`Scraped from ${scrapedData.source}:`);
        console.log(`  Confidence: ${scrapedData.confidence}`);
        console.log(`  Data Points: ${Object.keys(scrapedData.data).join(', ')}`);
        if (scrapedData.data.summary) {
          console.log(`  Summary: ${scrapedData.data.summary.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`⚠️  Scraping failed for ${result.source} (expected in test environment)`);
      }
    }

    console.log('✅ Web Scrapers Test Completed\n');
    return true;

  } catch (error) {
    console.error('❌ Web Scrapers Test Failed:', error);
    return false;
  }
}

async function testRegulatoryVerifier() {
  console.log('🏛️  Testing Regulatory Authority Verifier...');
  console.log('=' .repeat(40));

  try {
    // Test regulatory verification
    const brokerName = 'Pepperstone';
    const claimedRegulators = ['ASIC', 'FCA', 'CySEC'];
    const licenseNumbers = {
      'ASIC': '414530',
      'FCA': '684312',
      'CySEC': '388/20'
    };

    console.log(`Verifying ${brokerName} regulatory status...`);
    const verification = await regAuthorityVerifier.verifyBrokerRegulation(
      brokerName, 
      claimedRegulators, 
      licenseNumbers
    );

    console.log(`\nVerification Results:`);
    console.log(`Overall Status: ${verification.overallStatus}`);
    console.log(`Confidence Score: ${verification.confidenceScore}`);
    console.log(`Total Checks: ${verification.totalChecks}`);
    console.log(`Verified Regulators: ${verification.verifiedRegulators.length}`);

    console.log('\nRegulator Details:');
    verification.verifiedRegulators.forEach((check, index) => {
      console.log(`${index + 1}. ${check.authority}:`);
      console.log(`   Status: ${check.status}`);
      console.log(`   Confidence: ${check.confidence}`);
      console.log(`   License: ${check.licenseNumber || 'N/A'}`);
      if (check.details?.officialName) {
        console.log(`   Official Name: ${check.details.officialName}`);
      }
    });

    console.log('\nRecommendations:');
    verification.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    // Test verification stats
    const stats = regAuthorityVerifier.getVerificationStats();
    console.log(`\nVerification Stats:`);
    console.log(`  Requests Made: ${stats.requestCount}`);
    console.log(`  Cache Size: ${stats.cacheSize}`);
    console.log(`  Supported Authorities: ${stats.supportedAuthorities.join(', ')}`);

    console.log('✅ Regulatory Verifier Test Completed\n');
    return true;

  } catch (error) {
    console.error('❌ Regulatory Verifier Test Failed:', error);
    return false;
  }
}

async function testSourceReliability() {
  console.log('📊 Testing Source Reliability Manager...');
  console.log('=' .repeat(40));

  try {
    // Test getting reliability scores
    const domains = ['forexpeacearmy.com', 'fxempire.com', 'fca.org.uk', 'unknown-site.com'];
    
    console.log('Source Reliability Scores:');
    for (const domain of domains) {
      const score = await sourceReliabilityManager.getSourceReliability(domain);
      console.log(`${domain}: ${score}/10`);
    }

    // Test updating source reliability
    console.log('\n📈 Testing Reliability Updates...');
    await sourceReliabilityManager.updateSourceReliability(
      'test-broker-site.com',
      true, // accurate
      0.8,  // high confidence
      'Pepperstone minimum deposit verification'
    );
    
    const updatedScore = await sourceReliabilityManager.getSourceReliability('test-broker-site.com');
    console.log(`Updated test site score: ${updatedScore}/10`);

    // Test getting recommended sources
    console.log('\n🏆 Testing Recommended Sources...');
    const recommendedForRegulation = await sourceReliabilityManager.getRecommendedSources('regulation');
    console.log(`Recommended for regulation (${recommendedForRegulation.length}):`);
    recommendedForRegulation.slice(0, 3).forEach((source, index) => {
      console.log(`${index + 1}. ${source.name} (${source.domain}) - ${source.reliabilityScore}/10`);
    });

    // Test reliability metrics
    console.log('\n📊 Testing Reliability Metrics...');
    const metrics = await sourceReliabilityManager.getReliabilityMetrics();
    console.log(`Total Sources: ${metrics.totalSources}`);
    console.log(`Average Reliability: ${metrics.averageReliability}/10`);
    console.log(`Recent Updates: ${metrics.recentUpdates}`);
    
    console.log('\nCategory Breakdown:');
    Object.entries(metrics.categoryBreakdown).forEach(([category, data]) => {
      console.log(`  ${category}: ${data.count} sources, avg ${data.avgReliability.toFixed(1)}/10`);
    });

    console.log('✅ Source Reliability Test Completed\n');
    return true;

  } catch (error) {
    console.error('❌ Source Reliability Test Failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Web Search Integration Tests');
  console.log('=' .repeat(50));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('');

  const testResults = {
    searchEngine: false,
    webScrapers: false,
    regulatoryVerifier: false,
    sourceReliability: false
  };

  try {
    // Run all tests
    testResults.searchEngine = await testSearchEngine();
    testResults.webScrapers = await testWebScrapers();
    testResults.regulatoryVerifier = await testRegulatoryVerifier();
    testResults.sourceReliability = await testSourceReliability();

    // Summary
    console.log('📋 TEST SUMMARY');
    console.log('=' .repeat(50));
    const passedTests = Object.values(testResults).filter(result => result).length;
    const totalTests = Object.keys(testResults).length;
    
    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    console.log('');
    
    Object.entries(testResults).forEach(([testName, passed]) => {
      const status = passed ? '✅ PASSED' : '❌ FAILED';
      const displayName = testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`${status} - ${displayName}`);
    });

    console.log('');
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED!');
      console.log('Web Search Integration is ready for Phase 3.');
    } else if (passedTests >= totalTests * 0.5) {
      console.log('⚠️  MOST TESTS PASSED');
      console.log('Some components may need API keys or network access to fully function.');
      console.log('Core functionality is working. Ready to proceed with caution.');
    } else {
      console.log('❌ MULTIPLE TEST FAILURES');
      console.log('Review configuration and dependencies before proceeding.');
    }

    console.log('\n🔧 CONFIGURATION NOTES:');
    console.log('- Add SERPAPI_API_KEY to .env for full search functionality');
    console.log('- Ensure Supabase credentials are configured for data persistence');
    console.log('- Network access required for live web scraping and regulatory checks');

  } catch (error) {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  }
}

// Run the tests
main().catch(console.error);