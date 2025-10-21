/**
 * Synchronous Test for Broker Analysis Application
 */

const http = require('http');
const https = require('https');

const baseUrl = 'http://localhost:3005';

function testSyncPageLoad(url, name) {
  try {
    const start = Date.now();
    const response = http.get(`${baseUrl}${url}`);
    const time = Date.now() - start;
    
    if (response.statusCode === 200) {
      const size = response.headers['content-length'] || '0';
      console.log(`✅ ${name} (${time}ms, ${size} bytes)`);
      return { success: true, time, size };
    } else {
      console.log(`❌ ${name} - HTTP ${response.statusCode}`);
      return { success: false, time: 0, error: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    console.log(`❌ ${name} - Connection failed: ${error.message}`);
      return { success: false, time: 0, error: error.message };
  }
}

async function runSyncTest() {
  console.log('🔍 Starting Synchronous Test');
  console.log('==================');
  
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/best-brokers', name: 'Best Brokers' },
    { url: '/broker/pepperstone', name: 'Pepperstone Details' },
    { url: '/categories', name: 'Categories' },
    { url: '/countries', name: 'Countries' }
  ];

  let totalTime = 0;
  let passed = 0;
  let failed = 0;

  console.log(`🔍 Testing ${pages.length} pages...`);
  
  for (const page of pages) {
    const result = testSyncPageLoad(page.url, page.name);
    totalTime += result.time || 0;
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n📊 Performance Summary:');
  const successRate = passed / pages.length;
  console.log(`✅ Success Rate: ${Math.round(successRate * 100)}%`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`Total Size: ~${Math.round((response.headers['content-length'] || '0') / 1024)}KB`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  console.log('\n🎯 Test Status: ' + (passed === pages.length ? '✅ ALL TESTS PASSED' : failed === 0 ? '❌ ALL TESTS FAILED' : failed >= 0.8 ? '✅ MOST TESTS PASSED' : failed >= 0.6 ? '✅ MOST TESTS PASSED' : '❌ MANY TESTS FAILED');
  
  process.exit(passed === pages.length ? 0 : 1);
}

// Run the synchronous test
runSyncTest();
