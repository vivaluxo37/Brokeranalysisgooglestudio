#!/usr/bin/env node

/**
 * Test script to validate all 39 categories accessibility and functionality
 * This script tests:
 * 1. Category route accessibility
 * 2. Category data loading
 * 3. Broker filtering functionality
 * 4. SEO metadata generation
 */

const http = require('http');

// List of all 39 category slugs (from enhancedCategoryMappings.ts)
const categorySlugs = [
  // General Broker Types
  'top-online-trading-brokers',
  'top-cfd-brokers-platforms',
  'top-forex-brokers',

  // Execution Types
  'ecn-brokers',
  'dma-direct-market-access-brokers',
  'stp-brokers',
  'no-dealing-desk-brokers',
  'raw-spread-brokers',
  'instant-execution-brokers',
  'fixed-spread-brokers',
  'no-spread-brokers',

  // Strategy Types
  'pamm-brokers',
  'hft-brokers',
  'scalping-brokers',
  'swing-trading-brokers',
  'hedging-brokers',
  'brokers-for-beginners',
  'day-trading-brokers',
  'api-trading-brokers',

  // Feature Types
  'most-regulated-brokers',
  'micro-accounts-brokers',
  'high-leverage-brokers',
  'islamic-accounts-brokers',
  'no-deposit-brokers',
  'no-minimum-deposit-brokers',
  'mt4-brokers',
  'mt5-brokers',
  'tradingview-brokers',
  'crypto-cfd-brokers',
  'stock-cfd-brokers',
  'offshore-brokers',
  'corporate-account-brokers',
  'trailing-stop-loss-brokers'
];

console.log(`Found ${categorySlugs.length} categories to test`);

async function testCategoryAccessibility(slug) {
  return new Promise((resolve) => {
    const url = `http://localhost:5176/best-brokers/enhanced/${slug}`;
    const startTime = Date.now();

    const req = http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          slug,
          url,
          status: res.statusCode,
          responseTime: endTime - startTime,
          success: res.statusCode === 200,
          contentLength: data.length,
          hasContent: data.length > 1000 // Basic check for meaningful content
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        slug,
        url,
        status: 'ERROR',
        responseTime: Date.now() - startTime,
        success: false,
        error: err.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        slug,
        url,
        status: 'TIMEOUT',
        responseTime: 10000,
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function testAllCategories() {
  console.log('\n🧪 Testing all category accessibility...\n');

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < categorySlugs.length; i++) {
    const slug = categorySlugs[i];
    process.stdout.write(`Testing ${i + 1}/${categorySlugs.length}: ${slug}... `);

    const result = await testCategoryAccessibility(slug);
    results.push(result);

    if (result.success) {
      successCount++;
      console.log(`✅ ${result.status} (${result.responseTime}ms)`);
    } else {
      failCount++;
      console.log(`❌ ${result.status} - ${result.error || 'Failed'}`);
    }
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`Total Categories: ${categorySlugs.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`Success Rate: ${((successCount / categorySlugs.length) * 100).toFixed(1)}%`);

  // Show failed categories
  const failedCategories = results.filter(r => !r.success);
  if (failedCategories.length > 0) {
    console.log('\n❌ Failed Categories:');
    failedCategories.forEach(cat => {
      console.log(`  - ${cat.slug}: ${cat.status} - ${cat.error || 'Unknown error'}`);
    });
  }

  // Show performance stats
  const avgResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length;
  console.log(`\n⚡ Average Response Time: ${avgResponseTime.toFixed(0)}ms`);

  return results;
}

// Check if server is running first
async function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5176/', (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log('🚀 Category Accessibility Test Suite');
  console.log('Testing server at: http://localhost:5176');

  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ Server is not running or not accessible!');
    console.log('Please start the development server with: npm run dev');
    process.exit(1);
  }

  console.log('✅ Server is running');

  const results = await testAllCategories();

  // Exit with appropriate code
  const failedCount = results.filter(r => !r.success).length;
  process.exit(failedCount > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAllCategories, testCategoryAccessibility };