const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 15000;

// List of known blog slugs from the blog.ts file
const BLOG_SLUGS = [
    'how-to-choose-a-forex-broker-2025',
    'ecn-vs-market-maker-broker', 
    'forex-trading-strategies',
    'leverage-guide-forex-beginners',
    'trading-psychology-mastering-emotions',
    'risk-management-forex',
    'technical-analysis-guide',
    'fundamental-analysis-forex',
    'forex-trading-platforms-compared',
    'demo-account-guide-beginners',
    'algorithmic-trading-guide',
    'crypto-vs-forex-trading',
    'scalping-strategies-guide',
    'forex-trading-regulations-explained-2025'
];

// Sample internal links to test  
const INTERNAL_LINKS = [
    '/methodology',
    '/broker/pepperstone',
    '/broker/xtb',
    '/broker/ig',
    '/broker/saxo-bank',
    '/broker/fxpro',
    '/cost-analyzer',
    '/brokers',
    '/brokers/platform/mt4',
    '/brokers/type/ecn',
    '/broker-matcher'
];

// Sample external links from the blog content
const EXTERNAL_LINKS = [
    'https://www.fca.org.uk/',
    'https://asic.gov.au/',
    'https://www.nfa.futures.org/',
    'https://www.finma.ch/en/',
    'https://www.cysec.gov.cy/en-GB/home/',
    'https://en.wikipedia.org/wiki/List_of_financial_regulatory_authorities_by_country'
];

async function testBlogPage(browser, slug) {
    let page;
    try {
        page = await browser.newPage();
        await page.setDefaultTimeout(TIMEOUT);
        
        const blogUrl = `${BASE_URL}/blog/${slug}`;
        console.log(`Testing blog page: ${blogUrl}`);
        
        const response = await page.goto(blogUrl, { waitUntil: 'networkidle0' });
        
        if (!response) {
            return { success: false, status: 0, message: 'No response received' };
        }
        
        const status = response.status();
        const success = status === 200;
        
        // Check if the page has content
        const bodyText = await page.$eval('body', el => el.textContent);
        const hasContent = bodyText && bodyText.length > 1000;
        
        return {
            success: success && hasContent,
            status: status,
            message: success ? (hasContent ? 'OK' : 'Page loads but content missing') : `HTTP ${status}`
        };
        
    } catch (error) {
        return {
            success: false,
            status: 0,
            message: error.message
        };
    } finally {
        if (page) {
            await page.close();
        }
    }
}

async function testInternalLink(browser, path) {
    let page;
    try {
        page = await browser.newPage();
        await page.setDefaultTimeout(TIMEOUT);
        
        const fullUrl = `${BASE_URL}${path}`;
        console.log(`Testing internal link: ${fullUrl}`);
        
        const response = await page.goto(fullUrl, { waitUntil: 'networkidle0' });
        
        if (!response) {
            return { success: false, status: 0, message: 'No response received' };
        }
        
        const status = response.status();
        const success = status >= 200 && status < 400;
        
        return {
            success: success,
            status: status,
            message: success ? 'OK' : `HTTP ${status}`
        };
        
    } catch (error) {
        return {
            success: false,
            status: 0,
            message: error.message
        };
    } finally {
        if (page) {
            await page.close();
        }
    }
}

async function main() {
    console.log('🔍 Starting simple blog link testing...\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    let results = {
        blogPages: { passed: 0, failed: 0, details: [] },
        internalLinks: { passed: 0, failed: 0, details: [] }
    };
    
    try {
        // Test blog pages
        console.log('📄 Testing blog pages...');
        for (const slug of BLOG_SLUGS) {
            const result = await testBlogPage(browser, slug);
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${slug}: ${result.message}`);
            
            results.blogPages.details.push({ slug, ...result });
            if (result.success) {
                results.blogPages.passed++;
            } else {
                results.blogPages.failed++;
            }
        }
        
        // Test internal links
        console.log('\n🏠 Testing internal links...');
        for (const path of INTERNAL_LINKS) {
            const result = await testInternalLink(browser, path);
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${path}: ${result.message}`);
            
            results.internalLinks.details.push({ path, ...result });
            if (result.success) {
                results.internalLinks.passed++;
            } else {
                results.internalLinks.failed++;
            }
        }
        
    } finally {
        await browser.close();
    }
    
    // Summary
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(40));
    console.log(`Blog Pages: ${results.blogPages.passed}/${BLOG_SLUGS.length} passed`);
    console.log(`Internal Links: ${results.internalLinks.passed}/${INTERNAL_LINKS.length} passed`);
    
    const totalTests = BLOG_SLUGS.length + INTERNAL_LINKS.length;
    const totalPassed = results.blogPages.passed + results.internalLinks.passed;
    const successRate = ((totalPassed / totalTests) * 100).toFixed(1);
    
    console.log(`\nOverall Success Rate: ${successRate}% (${totalPassed}/${totalTests})`);
    
    // Show failures
    const blogFailures = results.blogPages.details.filter(r => !r.success);
    const linkFailures = results.internalLinks.details.filter(r => !r.success);
    
    if (blogFailures.length > 0) {
        console.log(`\n❌ Failed Blog Pages (${blogFailures.length}):`);
        blogFailures.forEach(f => console.log(`- ${f.slug}: ${f.message}`));
    }
    
    if (linkFailures.length > 0) {
        console.log(`\n❌ Failed Internal Links (${linkFailures.length}):`);
        linkFailures.forEach(f => console.log(`- ${f.path}: ${f.message}`));
    }
    
    const allPassed = blogFailures.length === 0 && linkFailures.length === 0;
    console.log(`\n${allPassed ? '🎉' : '⚠️'} Status: ${allPassed ? 'All tests passed!' : 'Some issues found'}`);
    
    process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});