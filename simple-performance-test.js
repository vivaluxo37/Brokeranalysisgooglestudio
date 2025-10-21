/**
 * Simple Performance Test for Broker Analysis Application
 * Tests loading times and provides basic performance metrics
 */

const https = require('https');
const http = require('http');

class SimplePerformanceTest {
  constructor(baseUrl = 'http://localhost:3005') {
    this.baseUrl = baseUrl;
    this.testResults = [];
  }

  log(message) {
    console.log(`[PERF] ${message}`);
    this.testResults.push({ timestamp: new Date().toISOString(), message });
  }

  async testPageLoad(url, name) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}${url}`);
      const loadTime = Date.now() - startTime;
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length') || '0';
        this.log(`✅ ${name}: ${loadTime}ms (${contentLength} bytes)`);
        return { name, status: 'PASS', loadTime, size: parseInt(contentLength) };
      } else {
        this.log(`❌ ${name}: HTTP ${response.status}`);
        return { name, status: 'FAIL', error: `HTTP ${response.status}` };
      }
    } catch (error) {
      this.log(`❌ ${name}: ${error.message}`);
      return { name, status: 'ERROR', error: error.message };
    }
  }

  async runQuickPerformanceTest() {
    console.log('🚀 Quick Performance Test');
    console.log('==================');
    
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/best-brokers', name: 'Best Brokers' },
      { url: '/broker/pepperstone', name: 'Pepperstone Details' },
      { url: '/categories', name: 'Categories' },
      { url: '/countries', name: 'Countries' }
    ];

    const results = [];
    let totalTime = 0;
    let totalSize = 0;

    for (const page of pages) {
      const result = await this.testPageLoad(page.url, page.name);
      results.push(result);
      totalTime += result.loadTime || 0;
      totalSize += result.size || 0;
    }

    const avgTime = totalTime / results.filter(r => r.status === 'PASS').length;
    console.log('\n📊 Performance Summary:');
    console.log(`Total Tests: ${results.length}`);
    console.log(`Average Load Time: ${avgTime.toFixed(0)}ms`);
    console.log(`Total Content Size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const errors = results.filter(r => r.status === 'ERROR').length;
    
    console.log(`Results: ${passed} passed, ${failed} failed, ${errors} errors`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`   ${r.name}: ${r.error}`);
      });
    }
    
    console.log('\n🎯 Performance Status: ' + (passed === results.length ? '✅ GOOD' : failed > 0 ? '⚠️ NEEDS WORK' : '❌ PROBLEMS'));
    
    return {
      total: results.length,
      passed,
      failed,
      errors,
      avgTime,
      totalSize
    };
  }

  printSummary(results) {
    const successRate = results.passed / results.total;
    console.log('\n📊 FINAL SUMMARY');
    console.log('==================');
    console.log(`Status: ${successRate === 1 ? '✅ ALL TESTS PASSED' : successRate === 0 ? '❌ ALL TESTS FAILED' : successRate >= 0.8 ? '✅ MOST TESTS PASSED' : successRate >= 0.6 ? '⚠️ SOME TESTS FAILED' : '❌ MANY TESTS FAILED'));
    
    console.log(`Success Rate: ${Math.round(successRate * 100)}%`);
    console.log(`Total Time: ${results.avgTime.toFixed(0)}ms average`);
    console.log(`Total Size: ${(results.totalSize / 1024).toFixed(2)} KB`);
    
    return results;
  }
}

// Run the test
const tester = new SimplePerformanceTest();
const results = tester.runQuickPerformanceTest();
tester.printSummary(results);
