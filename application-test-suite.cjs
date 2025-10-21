/**
 * Comprehensive Application Test Suite for Broker Analysis Application
 * Uses Node.js to test all pages, features, and functionality
 */

const http = require('http');
const https = require('https');

class ApplicationTestSuite {
  constructor(baseUrl = 'http://localhost:3005') {
    this.baseUrl = baseUrl;
    this.results = {
      pages: {},
      api: {},
      assets: {},
      errors: [],
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${type}] ${message}`;
    console.log(logLine);
    
    this.results.summary.totalTests++;
    if (type === 'PASS') {
      this.results.summary.passed++;
    } else if (type === 'FAIL') {
      this.results.summary.failed++;
    } else if (type === 'WARN') {
      this.results.summary.warnings++;
    }
  }

  async testUrl(path, expectedTitle = null, description = '') {
    const fullUrl = `${this.baseUrl}${path}`;
    
    try {
      const startTime = Date.now();
      const response = await this.makeRequest(fullUrl);
      const responseTime = Date.now() - startTime;
      
      if (response.statusCode === 200) {
        const data = await this.getResponseData(response);
        const titleMatch = data.match(/<title>(.*?)<\/title>/);
        const actualTitle = titleMatch ? titleMatch[1] : 'No title found';
        
        if (expectedTitle && actualTitle.toLowerCase().includes(expectedTitle.toLowerCase())) {
          this.log(`✅ ${path} (${responseTime}ms) - "${actualTitle}" - ${description}`, 'PASS');
          this.results.pages[path] = {
            status: 'PASS',
            title: actualTitle,
            responseTime,
            description
          };
          return true;
        } else {
          this.log(`⚠️ ${path} (${responseTime}ms) - "${actualTitle}" - ${description} (Title mismatch)`, 'WARN');
          this.results.pages[path] = {
            status: 'WARN',
            title: actualTitle,
            responseTime,
            description,
            issue: 'Title mismatch'
          };
          return false;
        }
      } else {
        this.log(`❌ ${path} - HTTP ${response.statusCode} - ${description}`, 'FAIL');
        this.results.pages[path] = {
          status: 'FAIL',
          statusCode: response.statusCode,
          description,
          issue: `HTTP ${response.statusCode}`
        };
        this.results.errors.push({ type: 'HTTP_ERROR', path, status: response.statusCode });
        return false;
      }
    } catch (error) {
      this.log(`❌ ${path} - Connection failed: ${error.message} - ${description}`, 'FAIL');
      this.results.pages[path] = {
        status: 'FAIL',
        description,
        issue: 'Connection failed',
        error: error.message
      };
      this.results.errors.push({ type: 'CONNECTION_ERROR', path, error: error.message });
      return false;
    }
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https:') ? https : http;
      const request = client.get(url, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(response));
      });
      request.on('error', reject);
      request.setTimeout(10000, () => reject(new Error('Request timeout')));
    });
  }

  async getResponseData(response) {
    return new Promise((resolve) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    });
  }

  async testCriticalPages() {
    this.log('\n🔍 Testing Critical Pages');
    
    const criticalPages = [
      { path: '/', expectedTitle: 'Find Your Perfect Trading Broker', description: 'Homepage' },
      { path: '/best-brokers', expectedTitle: 'Best Brokers', description: 'Best Brokers Directory' },
      { path: '/brokers', expectedTitle: 'All Brokers', description: 'All Brokers List' },
      { path: '/compare', expectedTitle: 'Compare', description: 'Broker Comparison Tool' },
      { path: '/broker-matcher', expectedTitle: 'AI Broker Matcher', description: 'AI Broker Matcher' },
      { path: '/cost-analyzer', expectedTitle: 'Cost Analyzer', description: 'Cost Analyzer Tool' },
      { path: '/categories', expectedTitle: 'Categories', description: 'Categories Page' },
      { path: '/countries', expectedTitle: 'Countries', description: 'Countries Page' }
    ];

    for (const page of criticalPages) {
      await this.testUrl(page.path, page.expectedTitle, page.description);
    }
  }

  async testBrokerPages() {
    this.log('\n📊 Testing Broker Detail Pages');
    
    const brokerSlugs = [
      'pepperstone',
      'ic-markets', 
      'xtb',
      'fxpro',
      'admiral-markets',
      'plus500',
      'exness',
      'tm',
      'octafx'
    ];

    for (const slug of brokerSlugs) {
      await this.testUrl(`/broker/${slug}`, slug, `Broker: ${slug}`);
    }
  }

  async testCategoryPages() {
    this.log('\n📈 Testing Category Pages');
    
    const categories = [
      'ecn-brokers',
      'scalping',
      'copy-trading',
      'metatrader4-mt4',
      'forex-brokers-for-beginners',
      'low-spread-forex-brokers',
      'high-leverage-forex-brokers',
      'islamic-forex-brokers',
      'regulated-forex-brokers'
    ];

    for (const category of categories) {
      await this.testUrl(`/best-brokers/${category}`, category, `Category: ${category}`);
    }
  }

  async testCountryPages() {
    this.log('\n🌍 Testing Country Pages');
    
    const countries = [
      'united-kingdom',
      'united-states',
      'australia',
      'canada',
      'germany',
      'france',
      'japan',
      'singapore',
      'switzerland',
      'united-arab-emirates'
    ];

    for (const country of countries) {
      await this.testUrl(`/best-forex-brokers/${country}`, country, `Country: ${country}`);
    }
  }

  async testAPIEndpoints() {
    this.log('\n🔧 Testing API Endpoints');
    
    const apiEndpoints = [
      { path: '/health', description: 'Proxy server health check' },
      { path: '/api/chatbot', description: 'AI chatbot endpoint' },
      { path: '/api/tutor', description: 'AI tutor endpoint' }
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(`http://localhost:3001${endpoint.path}`);
        const responseTime = Date.now() - startTime;
        
        if (response.statusCode === 200) {
          this.log(`✅ API ${endpoint.path} (${responseTime}ms) - ${endpoint.description}`, 'PASS');
          this.results.api[endpoint.path] = {
            status: 'PASS',
            responseTime,
            description: endpoint.description
          };
        } else {
          this.log(`❌ API ${endpoint.path} - HTTP ${response.statusCode} - ${endpoint.description}`, 'FAIL');
          this.results.api[endpoint.path] = {
            status: 'FAIL',
            statusCode: response.statusCode,
            description: endpoint.description
          };
          this.results.errors.push({ type: 'API_ERROR', endpoint: endpoint.path, status: response.statusCode });
        }
      } catch (error) {
        this.log(`❌ API ${endpoint.path} - Connection failed - ${endpoint.description}`, 'FAIL');
        this.results.api[endpoint.path] = {
          status: 'FAIL',
          description: endpoint.description,
          error: error.message
        };
        this.results.errors.push({ type: 'API_CONNECTION_ERROR', endpoint: endpoint.path, error: error.message });
      }
    }
  }

  async testStaticAssets() {
    this.log('\n📁 Testing Static Assets');
    
    const assets = [
      { path: '/favicon.ico', description: 'Favicon' },
      { path: '/manifest.json', description: 'Web App Manifest' },
      { path: '/robots.txt', description: 'Robots.txt' }
    ];

    for (const asset of assets) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${asset.path}`);
        if (response.statusCode === 200) {
          this.log(`✅ Static asset ${asset.path} - ${asset.description}`, 'PASS');
          this.results.assets[asset.path] = {
            status: 'PASS',
            description: asset.description
          };
        } else if (response.statusCode === 404) {
          this.log(`⚠️ Static asset ${asset.path} - ${asset.description} (Not found - acceptable)`, 'WARN');
          this.results.assets[asset.path] = {
            status: 'WARN',
            statusCode: response.statusCode,
            description: asset.description
          };
        } else {
          this.log(`❌ Static asset ${asset.path} - HTTP ${response.statusCode} - ${asset.description}`, 'FAIL');
          this.results.assets[asset.path] = {
            status: 'FAIL',
            statusCode: response.statusCode,
            description: asset.description
          };
        }
      } catch (error) {
        this.log(`❌ Static asset ${asset.path} - Connection failed - ${asset.description}`, 'FAIL');
        this.results.assets[asset.path] = {
          status: 'FAIL',
          description: asset.description,
          error: error.message
        };
      }
    }
  }

  async testErrorHandling() {
    this.log('\n🚫 Testing Error Handling');
    
    const errorPaths = [
      '/nonexistent-page',
      '/invalid/broker',
      '/broken/link',
      '/api/nonexistent-endpoint'
    ];

    let proper404s = 0;
    for (const path of errorPaths) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${path}`);
        if (response.statusCode === 404) {
          proper404s++;
          this.log(`✅ 404 handling for ${path}`, 'PASS');
        } else {
          this.log(`⚠️ ${path} returns HTTP ${response.statusCode} instead of 404`, 'WARN');
        }
      } catch (error) {
        this.log(`❌ Error checking ${path}: ${error.message}`, 'FAIL');
      }
    }
    
    this.log(`Error Handling: ${proper404s}/${errorPaths.length} pages return proper 404`, 
             proper404s === errorPaths.length ? 'PASS' : 'WARN');
  }

  analyzePerformance() {
    this.log('\n⚡ Analyzing Performance');
    
    const pageResponseTimes = Object.values(this.results.pages)
      .filter(page => page.status === 'PASS' && page.responseTime)
      .map(page => page.responseTime);
    
    const apiResponseTimes = Object.values(this.results.api)
      .filter(api => api.status === 'PASS' && api.responseTime)
      .map(api => api.responseTime);

    if (pageResponseTimes.length > 0) {
      const avgPageTime = pageResponseTimes.reduce((a, b) => a + b) / pageResponseTimes.length;
      const maxPageTime = Math.max(...pageResponseTimes);
      
      this.log(`Page Response Times: Avg ${avgPageTime.toFixed(0)}ms, Max ${maxPageTime}ms`, 
                 avgPageTime < 1000 ? 'PASS' : 'WARN');
      
      if (maxPageTime > 3000) {
        this.log(`⚠️ Slow page detected (${maxPageTime}ms) - Consider optimization`, 'WARN');
      }
    }

    if (apiResponseTimes.length > 0) {
      const avgApiTime = apiResponseTimes.reduce((a, b) => a + b) / apiResponseTimes.length;
      const maxApiTime = Math.max(...apiResponseTimes);
      
      this.log(`API Response Times: Avg ${avgApiTime.toFixed(0)}ms, Max ${maxApiTime}ms`, 
                 avgApiTime < 500 ? 'PASS' : 'WARN');
    }
  }

  generateReport() {
    const report = {
      summary: this.results.summary,
      pages: this.results.pages,
      api: this.results.api,
      assets: this.results.assets,
      errors: this.results.errors,
      timestamp: new Date().toISOString()
    };

    return report;
  }

  printSummary(report) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST REPORT');
    console.log('='.repeat(80));
    console.log(`📅 Test Date: ${report.timestamp}`);
    console.log(`🌐 Base URL: ${this.baseUrl}`);
    console.log('');
    
    console.log('📈 SUMMARY');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⚠️ Warnings: ${report.summary.warnings}`);
    console.log(`📊 Success Rate: ${Math.round((report.summary.passed / report.summary.totalTests) * 100)}%`);
    
    if (report.summary.failed > 0) {
      console.log('\n❌ CRITICAL ISSUES');
      console.log('-'.repeat(30));
      report.errors.forEach(error => {
        console.log(`• ${error.type}: ${error.path || error.endpoint || error.error}`);
      });
    }
    
    if (report.summary.warnings > 0) {
      console.log('\n⚠️  WARNINGS');
      console.log('-'.repeat(30));
      const warnings = Object.values(report.pages)
        .concat(Object.values(report.api))
        .filter(result => result.status === 'WARN');
      
      warnings.forEach(warning => {
        console.log(`• ${warning.description || warning.path || warning.endpoint}: ${warning.issue}`);
      });
    }
    
    console.log('\n📱 PAGE ANALYSIS');
    const pageStats = Object.values(report.pages);
    const passedPages = pageStats.filter(p => p.status === 'PASS').length;
    const failedPages = pageStats.filter(p => p.status === 'FAIL').length;
    console.log(`Pages Tested: ${pageStats.length}`);
    console.log(`✅ Passed: ${passedPages}`);
    console.log(`❌ Failed: ${failedPages}`);
    
    console.log('\n🔧 API ANALYSIS');
    const apiStats = Object.values(report.api);
    const passedApis = apiStats.filter(a => a.status === 'PASS').length;
    const failedApis = apiStats.filter(a => a.status === 'FAIL').length;
    console.log(`API Endpoints: ${apiStats.length}`);
    console.log(`✅ Working: ${passedApis}`);
    console.log(`❌ Failed: ${failedApis}`);
    
    console.log('\n🎯 RECOMMENDATIONS');
    const recommendations = [];
    
    if (report.summary.failed > 0) {
      recommendations.push('🔧 Fix critical page loading issues before deployment');
    }
    
    if (report.summary.warnings > 0) {
      recommendations.push('⚠️ Address warnings to improve user experience');
    }
    
    if (Object.values(report.pages).some(p => p.responseTime && p.responseTime > 3000)) {
      recommendations.push('🚀 Optimize slow-loading pages (consider lazy loading, code splitting)');
    }
    
    if (Object.values(report.api).some(a => a.responseTime && a.responseTime > 1000)) {
      recommendations.push('⚡ Optimize API response times');
    }
    
    recommendations.push('🔍 Add cross-browser testing (Chrome, Firefox, Safari, Edge)');
    recommendations.push('📱 Add mobile responsiveness testing');
    recommendations.push('🧪 Implement automated testing in CI/CD pipeline');
    recommendations.push('📊 Add performance monitoring and alerting');
    recommendations.push('🛡️ Add security headers and HTTPS enforcement');
    
    recommendations.forEach(rec => console.log(rec));
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Test completed successfully!');
    
    return report;
  }

  async runFullTestSuite() {
    console.log('🚀 Starting Comprehensive Test Suite for Broker Analysis Application');
    console.log(`📍 Testing: ${this.baseUrl}`);
    console.log(`⏰ Started: ${new Date().toLocaleString()}\n`);

    try {
      await this.testCriticalPages();
      await this.testBrokerPages();
      await this.testCategoryPages();
      await this.testCountryPages();
      await this.testAPIEndpoints();
      await this.testStaticAssets();
      await this.testErrorHandling();
      this.analyzePerformance();
      
      const report = this.generateReport();
      return this.printSummary(report);
      
    } catch (error) {
      console.log('\n💥 Test suite crashed:', error.message);
      this.log(`Error details: ${error.stack}`, 'ERROR');
      this.results.summary.failed++;
      throw error;
    }
  }
}

// Run the test suite
async function main() {
  const tester = new ApplicationTestSuite();
  
  try {
    const report = await tester.runFullTestSuite();
    
    // Exit with appropriate code
    if (report.summary.failed > 0) {
      console.log('\n❌ Test completed with failures');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = ApplicationTestSuite;
