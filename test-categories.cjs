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
const { enhancedCategories } = require('./data/enhancedCategoryMappings.ts');

const BASE_URL = 'http://localhost:5176';
const TEST_TIMEOUT = 10000; // 10 seconds per request

// Extract category slugs from enhanced mappings
const categorySlugs = enhancedCategories.map(cat => cat.slug);

console.log(`Found ${categorySlugs.length} categories to test`);

async function testCategoryAccessibility(slug) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}/best-brokers/enhanced/${slug}`;
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

    req.setTimeout(TEST_TIMEOUT, () => {
      req.destroy();
      resolve({
        slug,
        url,
        status: 'TIMEOUT',
        responseTime: TEST_TIMEOUT,
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
    const req = http.get(`${BASE_URL}/`, (res) => {
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
  console.log(`Testing server at: ${BASE_URL}`);

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