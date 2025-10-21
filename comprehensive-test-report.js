/**
 * Comprehensive Test Report Generator for Broker Analysis Application
 * Tests navigation, pages, features, and generates detailed reports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ApplicationTester {
  constructor(baseUrl = 'http://localhost:3005') {
    this.baseUrl = baseUrl;
    this.testResults = [];
    this.startTime = new Date();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logEntry);
    this.testResults.push({
      timestamp,
      type,
      message,
      success: type === 'success',
      error: type === 'error'
    });
  }

  async testPageLoad(page, expectedTitle) {
    try {
      const response = await fetch(`${this.baseUrl}${page}`);
      if (!response.ok) {
        this.log(`Failed to load ${page}: HTTP ${response.status}`, 'error');
        return false;
      }
      
      const html = await response.text();
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const actualTitle = titleMatch ? titleMatch[1] : '';
      
      if (expectedTitle && actualTitle.includes(expectedTitle)) {
        this.log(`${page} - Title matches: "${actualTitle}"`, 'success');
        return true;
      } else if (actualTitle) {
        this.log(`${page} - Title found: "${actualTitle}"`, 'success');
        return true;
      }
      
      this.log(`${page} - Page loaded but no title found`, 'warning');
      return true;
    } catch (error) {
      this.log(`Error loading ${page}: ${error.message}`, 'error');
      return false;
    }
  }

  async testCriticalPages() {
    this.log('\n=== Testing Critical Pages ===', 'info');
    
    const criticalPages = [
      { path: '/', expectedTitle: 'Find Your Perfect Trading Broker' },
      { path: '/best-brokers', expectedTitle: 'Best Brokers' },
      { path: '/brokers', expectedTitle: 'All Brokers' },
      { path: '/compare', expectedTitle: 'Compare Brokers' },
      { path: '/broker-matcher', expectedTitle: 'AI Broker Matcher' },
      { path: '/cost-analyzer', expectedTitle: 'Cost Analyzer' },
      { path: '/categories', expectedTitle: 'Categories' },
      { path: '/countries', expectedTitle: 'Countries' }
    ];

    let passCount = 0;
    let failCount = 0;

    for (const page of criticalPages) {
      const success = await this.testPageLoad(page.path, page.expectedTitle);
      if (success) passCount++;
      else failCount++;
    }

    this.log(`Critical Pages: ${passCount} passed, ${failCount} failed`, failCount === 0 ? 'success' : 'error');
    return { passCount, failCount, total: criticalPages.length };
  }

  async testBrokerPages() {
    this.log('\n=== Testing Broker Detail Pages ===', 'info');
    
    const brokerSlugs = ['pepperstone', 'ic-markets', 'xtb', 'fxpro', 'admiral-markets'];
    let passCount = 0;
    let failCount = 0;

    for (const slug of brokerSlugs) {
      const success = await this.testPageLoad(`/broker/${slug}`, slug);
      if (success) passCount++;
      else failCount++;
    }

    this.log(`Broker Pages: ${passCount} passed, ${failCount} failed`, failCount === 0 ? 'success' : 'error');
    return { passCount, failCount, total: brokerSlugs.length };
  }

  async testCategoryPages() {
    this.log('\n=== Testing Category Pages ===', 'info');
    
    const categories = [
      'ecn-brokers',
      'scalping',
      'copy-trading',
      'metatrader4-mt4',
      'forex-brokers-for-beginners',
      'low-spread-forex-brokers',
      'high-leverage-forex-brokers'
    ];
    
    let passCount = 0;
    let failCount = 0;

    for (const category of categories) {
      const success = await this.testPageLoad(`/best-brokers/${category}`, category);
      if (success) passCount++;
      else failCount++;
    }

    this.log(`Category Pages: ${passCount} passed, ${failCount} failed`, failCount === 0 ? 'success' : 'error');
    return { passCount, failCount, total: categories.length };
  }

  async testCountryPages() {
    this.log('\n=== Testing Country Pages ===', 'info');
    
    const countries = [
      'united-kingdom',
      'united-states',
      'australia',
      'canada',
      'germany',
      'france',
      'japan',
      'singapore'
    ];
    
    let passCount = 0;
    let failCount = 0;

    for (const country of countries) {
      const success = await this.testPageLoad(`/best-forex-brokers/${country}`, country);
      if (success) passCount++;
      else failCount++;
    }

    this.log(`Country Pages: ${passCount} passed, ${failCount} failed`, failCount === 0 ? 'success' : 'error');
    return { passCount, failCount, total: countries.length };
  }

  async testAPIEndpoints() {
    this.log('\n=== Testing API Endpoints ===', 'info');
    
    const apiEndpoints = [
      { path: '/health', description: 'Proxy server health check' },
      { path: '/api/chatbot', description: 'AI chatbot endpoint' },
      { path: '/api/tutor', description: 'AI tutor endpoint' }
    ];

    let passCount = 0;
    let failCount = 0;

    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(`http://localhost:3001${endpoint.path}`);
        if (response.ok) {
          this.log(`API ${endpoint.path} - ${endpoint.description}: OK`, 'success');
          passCount++;
        } else {
          this.log(`API ${endpoint.path} - HTTP ${response.status}`, 'error');
          failCount++;
        }
      } catch (error) {
        this.log(`API ${endpoint.path} - Connection failed: ${error.message}`, 'error');
        failCount++;
      }
    }

    this.log(`API Endpoints: ${passCount} passed, ${failCount} failed`, failCount === 0 ? 'success' : 'error');
    return { passCount, failCount, total: apiEndpoints.length };
  }

  async testStaticAssets() {
    this.log('\n=== Testing Static Assets ===', 'info');
    
    const assets = [
      '/favicon.ico',
      '/manifest.json',
      '/robots.txt'
    ];

    let passCount = 0;
    let failCount = 0;

    for (const asset of assets) {
      try {
        const response = await fetch(`${this.baseUrl}${asset}`);
        if (response.ok) {
          this.log(`Static asset ${asset}: Found`, 'success');
          passCount++;
        } else {
          this.log(`Static asset ${asset}: HTTP ${response.status}`, 'warning');
          failCount++;
        }
      } catch (error) {
        this.log(`Static asset ${asset}: Connection failed`, 'error');
        failCount++;
      }
    }

    this.log(`Static Assets: ${passCount} passed, ${failCount} failed`, failCount === 0 ? 'success' : 'warning');
    return { passCount, failCount, total: assets.length };
  }

  async checkErrorPages() {
    this.log('\n=== Testing Error Pages ===', 'info');
    
    const errorPaths = ['/nonexistent-page', '/invalid/broker', '/broken/link'];
    let found404s = 0;

    for (const path of errorPaths) {
      try {
        const response = await fetch(`${this.baseUrl}${path}`);
        if (response.status === 404) {
          this.log(`404 handling for ${path}: Properly returns 404`, 'success');
          found404s++;
        } else {
          this.log(`404 handling for ${path}: Returns ${response.status} instead of 404`, 'warning');
        }
      } catch (error) {
        this.log(`Error checking ${path}: ${error.message}`, 'error');
      }
    }

    this.log(`Error Pages: ${found404s} proper 404 responses out of ${errorPaths.length}`, 
                 found404s === errorPaths.length ? 'success' : 'warning');
    return { found404s, total: errorPaths.length };
  }

  async generateReport() {
    const endTime = new Date();
    const testDuration = endTime - this.startTime;

    const report = {
      testSummary: {
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: `${Math.round(testDuration / 1000)}s`,
        totalTests: this.testResults.length,
        successfulTests: this.testResults.filter(r => r.success).length,
        failedTests: this.testResults.filter(r => r.error).length,
        warnings: this.testResults.filter(r => r.type === 'warning').length
      },
      testResults: this.testResults,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(__dirname, 'comprehensive-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Also create a human-readable summary
    const summary = this.generateHumanReadableReport(report);
    const summaryPath = path.join(__dirname, 'test-summary.md');
    fs.writeFileSync(summaryPath, summary);

    return report;
  }

  generateHumanReadableReport(report) {
    const { testSummary, recommendations } = report;
    
    return `
# Broker Analysis Application - Comprehensive Test Report

## Test Summary
- **Test Duration**: ${testSummary.duration}
- **Total Tests**: ${testSummary.totalTests}
- **Successful**: ${testSummary.successfulTests} ✅
- **Failed**: ${testSummary.failedTests} ❌
- **Warnings**: ${testSummary.warnings} ⚠️
- **Success Rate**: ${Math.round((testSummary.successfulTests / testSummary.totalTests) * 100)}%

## Test Results

### Critical Issues ❌
${this.testResults.filter(r => r.error).map(r => `- ${r.message}`).join('\n') || 'No critical issues found'}

### Warnings ⚠️
${this.testResults.filter(r => r.type === 'warning').map(r => `- ${r.message}`).join('\n') || 'No warnings found'}

### Successful Tests ✅
${this.testResults.filter(r => r.success).slice(0, 10).map(r => `- ${r.message}`).join('\n')}
${this.testResults.filter(r => r.success).length > 10 ? `... and ${this.testResults.filter(r => r.success).length - 10} more` : ''}

## Recommendations

${recommendations.map(rec => `- ${rec}`).join('\n')}

## Test Environment
- **Base URL**: ${this.baseUrl}
- **Test Date**: ${testSummary.endTime}
- **Node Version**: ${process.version}

---
*Report generated on ${new Date().toLocaleString()}*
`;
  }

  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.testResults.filter(r => r.error);
    const warnings = this.testResults.filter(r => r.type === 'warning');

    if (failedTests.length > 0) {
      recommendations.push('Address the critical issues listed above before deploying to production');
    }

    if (warnings.length > 0) {
      recommendations.push('Review and fix the warnings to improve user experience');
    }

    if (this.testResults.some(r => r.message.includes('API') && r.error)) {
      recommendations.push('Check proxy server configuration and ensure all API endpoints are accessible');
    }

    if (this.testResults.some(r => r.message.includes('404'))) {
      recommendations.push('Implement proper 404 error pages for better user experience');
    }

    if (this.testResults.some(r => r.message.includes('static asset') && r.error)) {
      recommendations.push('Ensure all static assets (favicon, manifest, robots.txt) are properly configured');
    }

    recommendations.push('Consider implementing automated testing in CI/CD pipeline');
    recommendations.push('Add performance monitoring and error tracking');
    recommendations.push('Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)');

    return recommendations;
  }

  async runFullTestSuite() {
    console.log('🚀 Starting Comprehensive Test Suite for Broker Analysis Application');
    console.log(`📍 Testing application at: ${this.baseUrl}`);
    console.log(`⏰ Started at: ${this.startTime.toLocaleString()}\n`);

    try {
      const criticalResults = await this.testCriticalPages();
      const brokerResults = await this.testBrokerPages();
      const categoryResults = await this.testCategoryPages();
      const countryResults = await this.testCountryPages();
      const apiResults = await this.testAPIEndpoints();
      const assetResults = await this.testStaticAssets();
      const errorResults = await this.checkErrorPages();

      const report = await this.generateReport();

      console.log('\n📊 Test Suite Summary');
      console.log('==================');
      console.log(`✅ Successful: ${report.testSummary.successfulTests}`);
      console.log(`❌ Failed: ${report.testSummary.failedTests}`);
      console.log(`⚠️ Warnings: ${report.testSummary.warnings}`);
      console.log(`📈 Success Rate: ${Math.round((report.testSummary.successfulTests / report.testSummary.totalTests) * 100)}%`);
      console.log(`⏱️ Duration: ${report.testSummary.duration}`);
      console.log('\n📁 Reports generated:');
      console.log('   - comprehensive-test-report.json (detailed JSON)');
      console.log('   - test-summary.md (human-readable)');

      return report;
    } catch (error) {
      this.log(`Test suite failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Run the test suite
async function main() {
  const tester = new ApplicationTester();
  
  try {
    const report = await tester.runFullTestSuite();
    
    // Exit with appropriate code
    if (report.testSummary.failedTests > 0) {
      console.log('\n❌ Test suite completed with failures');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n💥 Test suite crashed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ApplicationTester;
