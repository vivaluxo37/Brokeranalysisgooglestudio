/**
 * Focused Application Test for Broker Analysis
 * Tests key pages and features systematically
 */

const https = require('https');
const http =require('http');

class FocusedApplicationTest {
  constructor(baseUrl = 'http://localhost:3005') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${type}] ${message}`;
    console.log(entry);
    this.results.push({ timestamp, type, message });
  }

  async checkPage(url, expectedContent = null, name = '') {
    try {
      const start = Date.now();
      const response = await fetch(`${this.baseUrl}${url}`);
      const time = Date.now() - start;
      
      if (response.ok) {
        const html = await response.text();
        const title = html.match(/<title>(.*?)<\/title>/);
        const pageTitle = title ? title[1] : 'No title';
        
        let status = '✅';
        let issue = '';
        
        if (expectedContent && !html.toLowerCase().includes(expectedContent.toLowerCase())) {
          status = '⚠️';
          issue = 'Content not found';
        }
        
        this.log(`${status} ${name || url} (${time}ms) - ${pageTitle}`, issue ? 'WARN' : 'INFO');
        return { url, status: issue ? 'WARN' : 'PASS', time, pageTitle, issue };
      } else {
        this.log(`❌ ${name || url} - HTTP ${response.status}`, 'ERROR');
        return { url, status: 'FAIL', error: `HTTP ${response.status}` };
      }
    } catch (error) {
      this.log(`❌ ${name || url} - ${error.message}`, 'ERROR');
      return { url, status: 'FAIL', error: error.message };
    }
  }

  async testCorePages() {
    this.log('🔍 Testing Core Pages', 'INFO');
    
    const pages = [
      { url: '/', name: 'Homepage', expected: 'Find Your Perfect Trading Broker' },
      { url: '/best-brokers', name: 'Best Brokers', expected: 'Best Brokers' },
      { url: '/brokers', name: 'All Brokers', expected: 'All Brokers' },
      { url: '/compare', name: 'Compare', expected: 'Compare Brokers' },
      { url: '/broker-matcher', name: 'Broker Matcher', expected: 'AI Broker Matcher' },
      { url: '/cost-analyzer', name: 'Cost Analyzer', expected: 'Cost Analyzer' },
      { url: '/categories', name: 'Categories' },
      { url: '/countries', name: 'Countries' }
    ];

    const results = [];
    for (const page of pages) {
      const result = await this.checkPage(page.url, page.expectedContent, page.name);
      results.push(result);
    }
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const warnings = results.filter(r => r.status === 'WARN').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    this.log(`Core Pages: ${passed} passed, ${warnings} warnings, ${failed} failed`, 
             failed === 0 ? 'INFO' : 'ERROR');
    
    return { passed, warnings, failed, total: pages.length };
  }

  async testBrokerPages() {
    this.log('📊 Testing Broker Pages', 'INFO');
    
    const brokers = [
      'pepperstone', 'ic-markets', 'xtb', 'fxpro', 'admiral-markets'
    ];

    const results = [];
    for (const broker of brokers) {
      const result = await this.checkPage(`/broker/${broker}`, null, `Broker: ${broker}`);
      results.push(result);
    }
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    this.log(`Broker Pages: ${passed} passed, ${failed} failed`, 
             failed === 0 ? 'INFO' : 'ERROR');
    
    return { passed, failed, total: brokers.length };
  }

  async testCategoryPages() {
    this.log('📈 Testing Category Pages', 'INFO');
    
    const categories = [
      'ecn-brokers',
      'scalping',
      'copy-trading',
      'metatrader4-mt4',
      'forex-brokers-for-beginners'
    ];

    const results = [];
    for (const category of categories) {
      const result = await this.checkPage(`/best-brokers/${category}`, null, `Category: ${category}`);
      results.push(result);
    }
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    this.log(`Category Pages: ${passed} passed, ${failed} failed`, 
             failed === 0 ? 'INFO' : 'ERROR');
    
    return { passed, failed, total: categories.length };
  }

  async testCountryPages() {
    this.log('🌍 Testing Country Pages', 'INFO');
    
    const countries = [
      'united-kingdom',
      'united-states', 
      'australia',
      'canada',
      'germany',
      'france'
    ];

    const results = [];
    for (const country of countries) {
      const result = await this.checkPage(`/best-forex-brokers/${country}`, null, `Country: ${country}`);
      results.push(result);
    }
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    this.log(`Country Pages: ${passed} passed, ${failed} failed`, 
             failed === 0 ? 'INFO' : 'ERROR');
    
    return { passed, failed, total: countries.length };
  }

  async testAPIEndpoints() {
    this.log('🔧 Testing API Endpoints', 'INFO');
    
    const endpoints = [
      { url: 'http://localhost:3001/health', name: 'Health Check', method: 'GET' },
      { 
        url: 'http://localhost:3001/api/chatbot', 
        name: 'Chatbot API', 
        method: 'POST',
        body: { message: "Test message", brokerContext: "" }
      },
      { 
        url: 'http://localhost:3001/api/tutor', 
        name: 'Tutor API', 
        method: 'POST',
        body: { topic: "Test topic", difficulty: "beginner", userLevel: "beginner" }
      }
    ];

    const results = [];
    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        const options = {
          method: endpoint.method || 'GET'
        };
        
        if (endpoint.method === 'POST' && endpoint.body) {
          options.headers = { 'Content-Type': 'application/json' };
          options.body = JSON.stringify(endpoint.body);
        }
        
        const response = await fetch(endpoint.url, options);
        const time = Date.now() - start;
        
        if (response.ok) {
          this.log(`✅ ${endpoint.name} (${time}ms)`, 'INFO');
          results.push({ endpoint: endpoint.name, status: 'PASS', time });
        } else {
          this.log(`❌ ${endpoint.name} - HTTP ${response.status}`, 'ERROR');
          results.push({ endpoint: endpoint.name, status: 'FAIL', error: `HTTP ${response.status}` });
        }
      } catch (error) {
        this.log(`❌ ${endpoint.name} - ${error.message}`, 'ERROR');
        results.push({ endpoint: endpoint.name, status: 'FAIL', error: error.message });
      }
    }
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    this.log(`API Endpoints: ${passed} working, ${failed} failed`, 
             failed === 0 ? 'INFO' : 'ERROR');
    
    return { passed, failed, total: endpoints.length };
  }

  generateReport(coreResults, brokerResults, categoryResults, countryResults, apiResults) {
    const totalTests = coreResults.total + brokerResults.total + categoryResults.total + countryResults.total + apiResults.total;
    const totalPassed = coreResults.passed + brokerResults.passed + categoryResults.passed + countryResults.passed + apiResults.passed;
    const totalFailed = coreResults.failed + brokerResults.failed + categoryResults.failed + countryResults.failed + apiResults.failed;
    const totalWarnings = coreResults.warnings + brokerResults.warnings + categoryResults.warnings + countryResults.warnings + apiResults.warnings;
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: totalPassed,
        failed: totalFailed,
        warnings: totalWarnings,
        successRate: Math.round((totalPassed / totalTests) * 100)
      },
      coreResults,
      brokerResults,
      categoryResults,
      countryResults,
      apiResults,
      errors: this.results.filter(r => r.type === 'ERROR')
    };
    
    return report;
  }

  printReport(report) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 BROKER ANALYSIS APPLICATION TEST REPORT');
    console.log('='.repeat(80));
    console.log(`📅 Tested: ${report.timestamp}`);
    console.log(`🌐 URL: http://localhost:3005`);
    console.log('');
    
    console.log('📈 SUMMARY');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⚠️ Warnings: ${report.summary.warnings}`);
    console.log(`📊 Success Rate: ${report.summary.successRate}%`);
    console.log('');
    
    console.log('📋 RESULTS BY CATEGORY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📄 Core Pages: ${report.coreResults.passed}/${report.coreResults.total} passed`);
    console.log(`📊 Broker Pages: ${report.brokerResults.passed}/${report.brokerResults.total} passed`);
    console.log(`📈 Category Pages: ${report.categoryResults.passed}/${report.categoryResults.total} passed`);
    console.log(`🌍 Country Pages: ${report.countryResults.passed}/${report.countryResults.total} passed`);
    console.log(`🔧 API Endpoints: ${report.apiResults.passed}/${report.apiResults.total} working`);
    console.log('');
    
    if (report.errors.length > 0) {
      console.log('❌ ERRORS ENCOUNTERED');
      console.log('─'.repeat(50));
      report.errors.forEach(error => {
        console.log(`• ${error.message}`);
      });
      console.log('');
    }
    
    console.log('🎯 RECOMMENDATIONS');
    console.log('─'.repeat(50));
    const recommendations = [];
    
    if (report.summary.failed > 0) {
      recommendations.push('🔧 Fix failed pages before deployment');
    }
    
    if (report.summary.warnings > 0) {
      recommendations.push('⚠️ Address warnings for better user experience');
    }
    
    if (report.apiResults.failed > 0) {
      recommendations.push('🔧 Ensure proxy server is running on port 3001');
      recommendations.push('🔧 Check API configuration and dependencies');
    }
    
    if (report.summary.passed === report.summary.total && report.summary.warnings === 0) {
      recommendations.push('✅ Application is ready for production');
    }
    
    recommendations.push('🧪 Implement automated testing in CI/CD');
    recommendations.push('📱 Add cross-browser testing');
    recommendations.push('🚀 Monitor performance and error tracking');
    recommendations.push('🛡️ Add security headers and HTTPS');
    
    recommendations.forEach(rec => console.log(rec));
    console.log('');
    
    console.log('🎉 TEST STATUS: ' + (report.summary.failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'));
    console.log('='.repeat(80));
    
    return report;
  }

  async runTest() {
    console.log('🚀 Starting Focused Application Test Suite');
    console.log('📍 Testing: http://localhost:3005');
    console.log(`⏰ Started: ${new Date().toLocaleString()}\n`);
    
    try {
      const coreResults = await this.testCorePages();
      const brokerResults = await this.testBrokerPages();
      const categoryResults = await this.testCategoryPages();
      const countryResults = await this.testCountryPages();
      const apiResults = await this.testAPIEndpoints();
      
      const report = this.generateReport(
        coreResults,
        brokerResults,
        categoryResults,
        countryResults,
        apiResults
      );
      
      return this.printReport(report);
      
    } catch (error) {
      console.error('💥 Test suite failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the test
const tester = new FocusedApplicationTest();
tester.runTest().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
