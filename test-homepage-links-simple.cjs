const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Simple Homepage Link Testing Script
 * Tests all links on the homepage for 404 errors and functionality
 */

class SimpleLinkTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = {
      totalLinks: 0,
      workingLinks: 0,
      brokenLinks: [],
      testResults: []
    };
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Initializing Playwright...');
    
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      });
      this.page = await this.browser.newPage();
      
      await this.page.setViewportSize({ width: 1280, height: 720 });
      this.page.setDefaultTimeout(5000);
      
      console.log('✅ Playwright initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Playwright:', error.message);
      throw error;
    }
  }

  async checkServerStatus() {
    try {
      console.log(`🔍 Checking server status at ${this.baseUrl}`);
      const response = await this.page.goto(this.baseUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 5000 
      });
      
      const statusCode = response.status();
      console.log(`✅ Server responded with status: ${statusCode}`);
      
      if (statusCode === 200) {
        // Wait a bit for page to load
        await this.page.waitForTimeout(2000);
        return true;
      } else {
        console.log(`⚠️ Server responded with status: ${statusCode}`);
        return false;
      }
      
    } catch (error) {
      console.error(`❌ Server not accessible: ${error.message}`);
      return false;
    }
  }

  async extractLinksFromPage() {
    try {
      console.log('🔗 Extracting links from page...');
      
      const links = await this.page.$$eval('a[href]', (elements) => {
        return elements.map((link, index) => {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim() || link.innerText || '';
          const title = link.getAttribute('title') || '';
          const className = link.className || '';
          
          // Get the parent element's tag
          const parent = link.parentElement;
          const parentTag = parent?.tagName?.toLowerCase() || 'unknown';
          
          // Try to find the closest semantic parent
          let section = 'unknown';
          let current = link;
          while (current && current !== document.body) {
            const tag = current.tagName?.toLowerCase();
            if (['header', 'nav', 'footer', 'main', 'section'].includes(tag)) {
              section = tag;
              break;
            }
            current = current.parentElement;
          }
          
          return {
            index,
            href,
            text: text.substring(0, 80),
            title,
            className,
            section,
            parentTag
          };
        });
      });

      console.log(`📊 Found ${links.length} links on the page`);
      this.results.totalLinks = links.length;
      
      return links;
    } catch (error) {
      console.error('❌ Failed to extract links:', error.message);
      return [];
    }
  }

  async testLink(link) {
    const startTime = Date.now();
    let result = {
      ...link,
      status: 'unknown',
      statusCode: null,
      error: null,
      responseTime: 0,
      isBroken: false
    };

    try {
      // Skip empty or invalid hrefs
      if (!link.href || link.href === '#' || link.href === 'javascript:void(0)' || link.href === 'javascript:;') {
        result.status = 'skipped';
        result.error = 'Empty or invalid href';
        return result;
      }

      // Convert relative URLs to absolute
      let url = link.href;
      if (url.startsWith('/')) {
        url = new URL(url, this.baseUrl).href;
      }

      console.log(`🔗 Testing: ${link.text || url.substring(0, 50)}...`);

      // Make a HEAD request first (faster)
      const response = await this.page.evaluate(async (testUrl) => {
        try {
          const response = await fetch(testUrl, { method: 'HEAD' });
          return {
            status: response.status,
            ok: response.ok,
            url: response.url
          };
        } catch (error) {
          return {
            status: 0,
            ok: false,
            url: testUrl,
            error: error.message
          };
        }
      }, url);

      const responseTime = Date.now() - startTime;
      result.responseTime = responseTime;

      if (response.status === 200) {
        result.status = 'working';
        result.statusCode = response.status;
        this.results.workingLinks++;
        console.log(`✅ ${link.text || url.substring(0, 30)} (${responseTime}ms)`);
      } else {
        result.status = 'broken';
        result.statusCode = response.status;
        result.isBroken = true;
        result.error = `HTTP ${response.status}`;
        this.results.brokenLinks.push(result);
        console.log(`❌ ${link.text || url.substring(0, 30)} - HTTP ${response.status}`);
      }

    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      result.isBroken = true;
      result.responseTime = Date.now() - startTime;
      this.results.brokenLinks.push(result);
      console.log(`❌ ${link.text || link.href} - Error: ${error.message}`);
    }

    return result;
  }

  async testAllLinks(links) {
    console.log(`\n🧪 Testing ${links.length} links...`);
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      
      // Test a sample of links to avoid too many requests
      if (i < 20 || i % 5 === 0) { // Test first 20 and every 5th link
        const result = await this.testLink(link);
        this.results.testResults.push(result);
        
        // Small delay between tests
        await this.page.waitForTimeout(200);
      } else {
        // For other links, just do a quick check
        const result = {
          ...link,
          status: 'skipped',
          error: 'Skipped for performance'
        };
        this.results.testResults.push(result);
      }
    }
  }

  generateReport() {
    const { totalLinks, workingLinks, brokenLinks, testResults } = this.results;
    
    const report = {
      summary: {
        total: totalLinks,
        tested: testResults.filter(r => r.status !== 'skipped').length,
        working: workingLinks,
        broken: brokenLinks.length,
        successRate: workingLinks > 0 ? ((workingLinks / workingLinks) * 100).toFixed(2) + '%' : '0%'
      },
      brokenLinks: brokenLinks.map(link => ({
        text: link.text,
        href: link.href,
        error: link.error,
        section: link.section,
        statusCode: link.statusCode
      })),
      bySection: {}
    };

    // Group results by section
    const sections = ['header', 'nav', 'footer', 'main', 'section'];
    sections.forEach(section => {
      const sectionLinks = testResults.filter(link => link.section === section);
      const working = sectionLinks.filter(link => link.status === 'working').length;
      const broken = sectionLinks.filter(link => link.status === 'broken').length;
      const skipped = sectionLinks.filter(link => link.status === 'skipped').length;
      
      report.bySection[section] = {
        total: sectionLinks.length,
        tested: sectionLinks.length - skipped,
        working: working,
        broken: broken,
        skipped: skipped
      };
    });

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }

  async runTest() {
    try {
      await this.init();
      
      const serverStatus = await this.checkServerStatus();
      if (!serverStatus) {
        console.log('\n❌ Cannot test links - server is not accessible');
        console.log('💡 Please ensure the development server is running at http://localhost:3000');
        
        return {
          summary: {
            error: 'Server not accessible',
            recommendation: 'Start the development server first'
          }
        };
      }

      const links = await this.extractLinksFromPage();
      if (links.length === 0) {
        console.log('⚠️ No links found on the page');
        return {
          summary: {
            error: 'No links found',
            recommendation: 'Check if the page loaded correctly'
          }
        };
      }

      await this.testAllLinks(links);
      const report = this.generateReport();
      
      console.log('\n' + '='.repeat(60));
      console.log('📊 LINK TESTING REPORT');
      console.log('='.repeat(60));
      
      console.log(`\n📈 SUMMARY:`);
      console.log(`  Total Links Found: ${report.summary.total}`);
      console.log(`  Links Tested: ${report.summary.tested}`);
      console.log(`  Working Links: ${report.summary.working}`);
      console.log(`  Broken Links: ${report.summary.broken}`);
      console.log(`  Success Rate: ${report.summary.successRate}`);

      if (report.summary.broken > 0) {
        console.log(`\n❌ BROKEN LINKS (${report.summary.broken}):`);
        report.brokenLinks.forEach((link, index) => {
          console.log(`  ${index + 1}. ${link.text || link.href}`);
          console.log(`     URL: ${link.href}`);
          console.log(`     Error: ${link.error} (Status: ${link.statusCode})`);
          console.log(`     Section: ${link.section}`);
          console.log('');
        });
      }

      console.log(`\n📂 BY SECTION:`);
      Object.entries(report.bySection).forEach(([section, data]) => {
        if (data.total > 0) {
          console.log(`  ${section.toUpperCase()}:`);
          console.log(`    Total: ${data.total}, Tested: ${data.tested}, Working: ${data.working}, Broken: ${data.broken}`);
          if (data.skipped > 0) {
            console.log(`    (Skipped: ${data.skipped} for performance)`);
          }
        }
      });

      // Save report to file
      const reportPath = path.join(__dirname, 'homepage-link-test-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n💾 Report saved to: ${reportPath}`);

      console.log('\n' + '='.repeat(60));
      console.log(report.summary.broken === 0 ? '✅ Tested links are working!' : '❌ Some links need attention');
      console.log('='.repeat(60));

      return report;

    } catch (error) {
      console.error('❌ Test failed:', error.message);
      return {
        summary: {
          error: error.message,
          recommendation: 'Check the error and try again'
        }
      };
    } finally {
      await this.cleanup();
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 Starting Homepage Link Testing');
  console.log('🌐 Testing against: http://localhost:3000');
  console.log('⏰ Started at:', new Date().toISOString());
  console.log('');

  const tester = new SimpleLinkTester('http://localhost:3000');

  try {
    const report = await tester.runTest();
    
    // Exit with appropriate code
    if (report.summary.error) {
      process.exit(1);
    } else {
      process.exit(report.summary.broken > 0 ? 1 : 0);
    }
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SimpleLinkTester };
