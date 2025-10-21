const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Homepage Link Testing Script
 * Tests all links on the homepage for 404 errors and functionality
 */

class HomepageLinkTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = {
      totalLinks: 0,
      workingLinks: 0,
      brokenLinks: [],
      redirectLinks: [],
      slowLinks: [],
      testResults: []
    };
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Initializing Playwright for comprehensive link testing...');
    
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      });
      this.page = await this.browser.newPage();
      
      // Set viewport and user agent
      await this.page.setViewportSize({ width: 1280, height: 720 });
      await this.page.addInitScript(() => {
        Object.defineProperty(navigator, 'userAgent', {
          get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });
      });
      
      // Increase timeout for slower loading
      this.page.setDefaultTimeout(10000);
      
      console.log('✅ Playwright initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Playwright:', error.message);
      throw error;
    }
  }

  async navigateToHomepage() {
    try {
      console.log(`📍 Navigating to homepage: ${this.baseUrl}`);
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      
      // Wait for page to be fully loaded
      await this.page.waitForTimeout(2000);
      
      // Check if page loaded successfully
      const pageTitle = await this.page.title();
      console.log(`✅ Page loaded successfully: ${pageTitle}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to navigate to homepage: ${error.message}`);
      return false;
    }
  }

  async getAllLinks() {
    console.log('🔍 Scanning for all links on the page...');
    
    try {
      // Get all link elements
      const links = await this.page.$$eval('a[href]', (elements) => {
        return elements.map((link, index) => {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim() || link.innerText || '';
          const title = link.getAttribute('title') || '';
          const className = link.className || '';
          const tagName = link.tagName.toLowerCase();
          const parentSelector = link.closest('nav, header, footer, main, section')?.tagName.toLowerCase() || 'unknown';
          
          return {
            index,
            href,
            text: text.substring(0, 100), // Limit text length
            title,
            className,
            tagName,
            parentSection: parentSelector,
            isVisible: link.offsetWidth > 0 && link.offsetHeight > 0
          };
        });
      });

      console.log(`📊 Found ${links.length} total links`);
      this.results.totalLinks = links.length;
      
      return links;
    } catch (error) {
      console.error('❌ Failed to scan for links:', error.message);
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
      finalUrl: null,
      isBroken: false,
      isRedirect: false,
      isSlow: false
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

      console.log(`🔗 Testing: ${link.text || url}`);

      // Make a direct request to check if the page exists
      const response = await this.page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 10000
      });

      const responseTime = Date.now() - startTime;
      result.responseTime = responseTime;
      result.finalUrl = this.page.url();

      // Check for slow loading
      if (responseTime > 5000) {
        result.isSlow = true;
        this.results.slowLinks.push(result);
      }

      // Check if page loaded successfully
      const pageContent = await this.page.content();
      const pageTitle = await this.page.title();

      // Check for 404 indicators
      const is404 = pageContent.includes('404') || 
                   pageContent.includes('Not Found') || 
                   pageContent.includes('Page not found') ||
                   pageTitle.includes('404') ||
                   url.includes('404');

      // Check for error pages
      const isError = pageContent.includes('Error') ||
                     pageContent.includes('Something went wrong') ||
                     pageTitle.includes('Error');

      if (is404) {
        result.status = 'broken';
        result.isBroken = true;
        result.statusCode = 404;
        result.error = '404 Page Not Found';
        this.results.brokenLinks.push(result);
      } else if (isError) {
        result.status = 'error';
        result.error = 'Page contains error indicators';
        this.results.brokenLinks.push(result);
      } else {
        result.status = 'working';
        this.results.workingLinks++;
      }

      // Check for redirects
      if (url !== result.finalUrl) {
        result.isRedirect = true;
        this.results.redirectLinks.push(result);
      }

      console.log(`${result.status === 'working' ? '✅' : '❌'} ${link.text || url} (${responseTime}ms)`);

    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      result.isBroken = true;
      result.responseTime = Date.now() - startTime;
      this.results.brokenLinks.push(result);
      console.log(`❌ ${link.text || url} - Error: ${error.message}`);
    }

    return result;
  }

  async testAllLinks(links) {
    console.log(`🧪 Testing ${links.length} links...`);
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      console.log(`\n[${i + 1}/${links.length}] Testing link...`);
      
      const result = await this.testLink(link);
      this.results.testResults.push(result);
      
      // Small delay between tests to avoid overwhelming the server
      await this.page.waitForTimeout(100);
    }
  }

  async categorizeLinks(links) {
    const categories = {
      header: [],
      hero: [],
      features: [],
      footer: [],
      navigation: [],
      other: []
    };

    links.forEach(link => {
      if (link.parentSection === 'header' || link.className.includes('header') || link.className.includes('nav')) {
        categories.header.push(link);
      } else if (link.parentSection === 'main' && (link.className.includes('hero') || link.text.includes('Get Started'))) {
        categories.hero.push(link);
      } else if (link.className.includes('feature') || link.text.includes('Compare') || link.text.includes('Calculator')) {
        categories.features.push(link);
      } else if (link.parentSection === 'footer' || link.className.includes('footer')) {
        categories.footer.push(link);
      } else if (link.className.includes('nav') || link.className.includes('menu')) {
        categories.navigation.push(link);
      } else {
        categories.other.push(link);
      }
    });

    return categories;
  }

  generateReport() {
    const { totalLinks, workingLinks, brokenLinks, redirectLinks, slowLinks, testResults } = this.results;
    
    const report = {
      summary: {
        total: totalLinks,
        working: workingLinks,
        broken: brokenLinks.length,
        redirects: redirectLinks.length,
        slow: slowLinks.length,
        successRate: totalLinks > 0 ? ((workingLinks / totalLinks) * 100).toFixed(2) + '%' : '0%'
      },
      brokenLinks: brokenLinks.map(link => ({
        text: link.text,
        href: link.href,
        error: link.error,
        parentSection: link.parentSection,
        className: link.className
      })),
      slowLinks: slowLinks.map(link => ({
        text: link.text,
        href: link.href,
        responseTime: link.responseTime + 'ms',
        parentSection: link.parentSection
      })),
      redirectLinks: redirectLinks.map(link => ({
        text: link.text,
        original: link.href,
        final: link.finalUrl,
        parentSection: link.parentSection
      })),
      categories: {}
    };

    // Categorize results
    const allLinks = testResults;
    report.categories.header = allLinks.filter(link => 
      link.parentSection === 'header' || link.className.includes('header') || link.className.includes('nav')
    );
    report.categories.hero = allLinks.filter(link => 
      link.parentSection === 'main' && (link.className.includes('hero') || link.text.includes('Get Started'))
    );
    report.categories.features = allLinks.filter(link => 
      link.className.includes('feature') || link.text.includes('Compare') || link.text.includes('Calculator')
    );
    report.categories.footer = allLinks.filter(link => 
      link.parentSection === 'footer' || link.className.includes('footer')
    );
    report.categories.navigation = allLinks.filter(link => 
      link.className.includes('nav') || link.className.includes('menu')
    );
    report.categories.other = allLinks.filter(link => 
      !report.categories.header.includes(link) &&
      !report.categories.hero.includes(link) &&
      !report.categories.features.includes(link) &&
      !report.categories.footer.includes(link) &&
      !report.categories.navigation.includes(link)
    );

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }

  async runFullTest() {
    try {
      await this.init();
      
      const homepageLoaded = await this.navigateToHomepage();
      if (!homepageLoaded) {
        throw new Error('Failed to load homepage');
      }

      const links = await this.getAllLinks();
      if (links.length === 0) {
        throw new Error('No links found on homepage');
      }

      // Categorize links for better reporting
      const categories = await this.categorizeLinks(links);
      console.log('\n📂 Link Categories:');
      Object.entries(categories).forEach(([category, categoryLinks]) => {
        console.log(`  ${category}: ${categoryLinks.length} links`);
      });

      await this.testAllLinks(links);
      
      const report = this.generateReport();
      
      console.log('\n' + '='.repeat(80));
      console.log('📊 COMPREHENSIVE LINK TESTING REPORT');
      console.log('='.repeat(80));
      
      console.log(`\n📈 SUMMARY:`);
      console.log(`  Total Links Tested: ${report.summary.total}`);
      console.log(`  Working Links: ${report.summary.working}`);
      console.log(`  Broken Links: ${report.summary.broken}`);
      console.log(`  Redirect Links: ${report.summary.redirects}`);
      console.log(`  Slow Links: ${report.summary.slow}`);
      console.log(`  Success Rate: ${report.summary.successRate}`);

      if (report.summary.broken > 0) {
        console.log(`\n❌ BROKEN LINKS (${report.summary.broken}):`);
        report.brokenLinks.forEach((link, index) => {
          console.log(`  ${index + 1}. ${link.text || link.href}`);
          console.log(`     URL: ${link.href}`);
          console.log(`     Error: ${link.error}`);
          console.log(`     Section: ${link.parentSection}`);
          console.log('');
        });
      }

      if (report.summary.slow > 0) {
        console.log(`\n⚠️  SLOW LINKS (${report.summary.slow}):`);
        report.slowLinks.forEach((link, index) => {
          console.log(`  ${index + 1}. ${link.text || link.href}`);
          console.log(`     Response Time: ${link.responseTime}`);
          console.log('');
        });
      }

      if (report.summary.redirect > 0) {
        console.log(`\n🔄 REDIRECT LINKS (${report.summary.redirect}):`);
        report.redirectLinks.forEach((link, index) => {
          console.log(`  ${index + 1}. ${link.text}`);
          console.log(`     ${link.original} → ${link.finalUrl}`);
          console.log('');
        });
      }

      console.log(`\n📂 BY CATEGORY:`);
      Object.entries(report.categories).forEach(([category, categoryLinks]) => {
        const working = categoryLinks.filter(link => link.status === 'working').length;
        const broken = categoryLinks.filter(link => link.status !== 'working' && link.status !== 'skipped').length;
        const total = categoryLinks.length;
        
        console.log(`  ${category.toUpperCase()}:`);
        console.log(`    Total: ${total}, Working: ${working}, Broken: ${broken}`);
        
        if (broken > 0) {
          console.log(`    ❌ Broken links found in ${category}`);
        }
      });

      // Save detailed report to file
      const reportPath = path.join(__dirname, 'homepage-link-test-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n💾 Detailed report saved to: ${reportPath}`);

      // Generate CSV summary
      const csvPath = path.join(__dirname, 'homepage-link-test-summary.csv');
      const csvContent = [
        'Text,URL,Status,Response Time,Parent Section,Error',
        ...testResults.map(link => 
          `"${link.text}","${link.href}","${link.status}","${link.responseTime}ms","${link.parentSection}","${link.error || ''}"`
        )
      ].join('\n');
      
      fs.writeFileSync(csvPath, csvContent);
      console.log(`📊 CSV summary saved to: ${csvPath}`);

      console.log('\n' + '='.repeat(80));
      console.log(report.summary.broken === 0 ? '✅ All links are working correctly!' : '❌ Some links need attention');
      console.log('='.repeat(80));

      return report;

    } catch (error) {
      console.error('❌ Test failed:', error.message);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 Starting Comprehensive Homepage Link Testing');
  console.log('🌐 Testing against: http://localhost:3000');
  console.log('⏰ Started at:', new Date().toISOString());
  console.log('');

  const tester = new HomepageLinkTester('http://localhost:3000');

  try {
    const report = await tester.runFullTest();
    
    // Exit with appropriate code
    process.exit(report.summary.broken > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { HomepageLinkTester };
