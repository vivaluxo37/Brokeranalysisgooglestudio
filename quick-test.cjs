/**
 * Quick Test for Broker Analysis Application
 */

const https = require('https');
const http = require('http');

const baseUrl = 'http://localhost:3005';

async function testPageLoad(url, name) {
  try {
    const start = Date.now();
    const response = await fetch(`${baseUrl}${url}`);
    const time = Date.now() - start;
    
    if (response.ok) {
      const size = response.headers.get('content-length') || '0';
      console.log(`✅ ${name} (${time}ms, ${size} bytes)`);
      return { success: true, time, size };
    } else {
      console.log(`❌ ${name} - HTTP ${response.status}`);
      return { success: false, time: 0, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ ${name} - Connection failed: ${error.message}`);
    return { success: false, time: 0, error: error.message };
  }
}

async function runQuickTest() {
  console.log('🚀 Quick Performance Test');
  console.log('==================');
  
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/best-brokers', name: 'Best Brokers' },
    { url: '/broker/pepperstone', name: 'Pepperstone Details' },
    { url: '/categories', name: 'Categories' },
    { url: '/countries', name: 'Countries' }
  ];

  let totalTime = 0;
  let totalSize = 0;
  let passed = 0;
  let failed = 0;

  console.log(`🔍 Testing ${pages.length} pages...`);
  
  for (const page of pages) {
    const result = await testPageLoad(page.url, page.name);
    totalTime += result.time || 0;
    totalSize += result.size || 0;
    
    if (result.success) {
      passed++;
    } else if (result.error) {
      failed++;
    }
  }

  console.log('\n📊 Performance Summary:');
  const successRate = passed / pages.length;
  console.log(`✅ Success Rate: ${Math.round(successRate * 100)}%`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
  
  console.log(`Results: ${passed} passed, ${failed} failed`);
  return { passed, failed, totalTime, totalSize };
}

async function main() {
  console.log('🚀 Starting Quick Performance Test...');
  
  try {
    const results = await runQuickTest();
    
    const success = results.passed === results.total;
    const successRate = results.passed / results.total;
    
    console.log('\n🎯 Test Status: ' + (success ? '✅ ALL TESTS PASSED' : successRate >= 0.8 ? '✅ MOST TESTS PASSED' : successRate >= 0.6 ? '✅ MOST TESTS PASSED' : '❌ MANY TESTS FAILED'));
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
      process.exit(1);
  }
}

main();
