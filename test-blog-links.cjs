const fs = require('fs');
const puppeteer = require('puppeteer');
const axios = require('axios');

const TIMEOUT = 10000; // 10 seconds timeout for each page/link test
const BASE_URL = 'http://localhost:3000';

// Extract blog data from TypeScript file
function extractBlogData() {
    const blogDataPath = './data/blog.ts';
    let blogContent = fs.readFileSync(blogDataPath, 'utf8');
    
    // Extract the blogPosts array content between export const blogPosts: BlogPost[] = [ and ];
    const arrayStart = blogContent.indexOf('export const blogPosts: BlogPost[] = [');
    console.log('Array start position:', arrayStart);
    
    if (arrayStart === -1) {
        console.error('Could not find export const blogPosts in file');
        return [];
    }
    
    const arrayStartIndex = blogContent.indexOf('[', arrayStart);
    console.log('Array bracket start:', arrayStartIndex);
    
    // Find the matching closing bracket
    let bracketCount = 0;
    let arrayEndIndex = arrayStartIndex;
    for (let i = arrayStartIndex; i < blogContent.length; i++) {
        if (blogContent[i] === '[') bracketCount++;
        if (blogContent[i] === ']') bracketCount--;
        if (bracketCount === 0) {
            arrayEndIndex = i;
            break;
        }
    }
    
    const arrayContent = blogContent.substring(arrayStartIndex, arrayEndIndex + 1);
    console.log('Array content length:', arrayContent.length);
    console.log('First 500 chars of array:', arrayContent.substring(0, 500));
    
    // Simple parsing to extract blog objects
    const blogs = [];
    const blogMatches = arrayContent.matchAll(/{\s*id:\s*'([^']+)'/g);
    console.log('Blog matches found:', [...blogMatches].length);
    
    for (const match of blogMatches) {
        const blogId = match[1];
        const blogStart = match.index;
        
        // Find the end of this blog object
        let braceCount = 0;
        let blogEnd = blogStart;
        for (let i = blogStart; i < arrayContent.length; i++) {
            if (arrayContent[i] === '{') braceCount++;
            if (arrayContent[i] === '}') braceCount--;
            if (braceCount === 0) {
                blogEnd = i;
                break;
            }
        }
        
        const blogContent = arrayContent.substring(blogStart, blogEnd + 1);
        
        // Extract slug
        const slugMatch = blogContent.match(/slug:\s*'([^']+)'/);
        const slug = slugMatch ? slugMatch[1] : blogId;
        
        // Extract title
        const titleMatch = blogContent.match(/title:\s*'([^']+)'/);
        const title = titleMatch ? titleMatch[1] : 'Unknown Title';
        
        blogs.push({
            id: blogId,
            slug: slug,
            title: title,
            content: blogContent
        });
    }
    
    return blogs;
}

// Extract all links from a blog post content
function extractLinks(content) {
    const links = [];
    
    // Match markdown links: [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = markdownLinkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const url = match[2];
        
        links.push({
            text: linkText,
            url: url,
            type: url.startsWith('http') ? 'external' : 'internal'
        });
    }
    
    return links;
}

// Test external link
async function testExternalLink(url) {
    try {
        const response = await axios.get(url, {
            timeout: TIMEOUT,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        return {
            success: true,
            status: response.status,
            message: 'OK'
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 0,
            message: error.message
        };
    }
}

// Test internal link using Puppeteer
async function testInternalLink(browser, url, baseUrl) {
    let page;
    try {
        page = await browser.newPage();
        await page.setDefaultTimeout(TIMEOUT);
        
        const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
        console.log(`Testing internal link: ${fullUrl}`);
        
        const response = await page.goto(fullUrl, { waitUntil: 'networkidle0' });
        
        if (!response) {
            return {
                success: false,
                status: 0,
                message: 'No response received'
            };
        }
        
        const status = response.status();
        const success = status >= 200 && status < 400;
        
        return {
            success: success,
            status: status,
            message: success ? 'Page loaded successfully' : `HTTP ${status}`
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

// Test blog page accessibility
async function testBlogPage(browser, blogSlug) {
    let page;
    try {
        page = await browser.newPage();
        await page.setDefaultTimeout(TIMEOUT);
        
        const blogUrl = `${BASE_URL}/blog/${blogSlug}`;
        console.log(`Testing blog page: ${blogUrl}`);
        
        const response = await page.goto(blogUrl, { waitUntil: 'networkidle0' });
        
        if (!response) {
            return {
                success: false,
                status: 0,
                message: 'No response received'
            };
        }
        
        const status = response.status();
        const success = status === 200;
        
        // Check if the page contains blog content
        const hasContent = await page.$eval('body', el => el.textContent.length > 1000);
        
        return {
            success: success && hasContent,
            status: status,
            message: success ? (hasContent ? 'Blog page loaded with content' : 'Blog page loaded but content may be missing') : `HTTP ${status}`
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
    console.log('🔍 Starting comprehensive blog link testing...\n');
    
    // Extract blog data
    const blogs = extractBlogData();
    console.log(`Found ${blogs.length} blog posts to test\n`);
    
    const results = {
        blogPages: [],
        internalLinks: [],
        externalLinks: [],
        summary: {
            totalBlogPages: blogs.length,
            successfulBlogPages: 0,
            totalInternalLinks: 0,
            successfulInternalLinks: 0,
            totalExternalLinks: 0,
            successfulExternalLinks: 0
        }
    };
    
    // Launch browser for internal link testing
    console.log('🚀 Launching browser for internal link testing...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        // Test each blog page accessibility
        console.log('\n📄 Testing blog page accessibility...');
        for (const blog of blogs) {
            const pageResult = await testBlogPage(browser, blog.slug);
            results.blogPages.push({
                id: blog.id,
                slug: blog.slug,
                title: blog.title,
                ...pageResult
            });
            
            if (pageResult.success) {
                results.summary.successfulBlogPages++;
            }
            
            console.log(`${pageResult.success ? '✅' : '❌'} ${blog.slug}: ${pageResult.message}`);
        }
        
        // Test internal and external links
        console.log('\n🔗 Testing links in blog content...');
        const allInternalLinks = [];
        const allExternalLinks = [];
        
        for (const blog of blogs) {
            const links = extractLinks(blog.content);
            
            for (const link of links) {
                if (link.type === 'internal') {
                    allInternalLinks.push({ ...link, blogId: blog.id });
                } else {
                    allExternalLinks.push({ ...link, blogId: blog.id });
                }
            }
        }
        
        // Remove duplicates
        const uniqueInternalLinks = [...new Map(allInternalLinks.map(link => [link.url, link])).values()];
        const uniqueExternalLinks = [...new Map(allExternalLinks.map(link => [link.url, link])).values()];
        
        console.log(`Found ${uniqueInternalLinks.length} unique internal links and ${uniqueExternalLinks.length} unique external links`);
        
        // Test internal links
        console.log('\n🏠 Testing internal links...');
        results.summary.totalInternalLinks = uniqueInternalLinks.length;
        
        for (const link of uniqueInternalLinks) {
            const linkResult = await testInternalLink(browser, link.url, BASE_URL);
            results.internalLinks.push({
                ...link,
                ...linkResult
            });
            
            if (linkResult.success) {
                results.summary.successfulInternalLinks++;
            }
            
            console.log(`${linkResult.success ? '✅' : '❌'} ${link.url}: ${linkResult.message}`);
        }
        
        // Test external links (with rate limiting)
        console.log('\n🌐 Testing external links...');
        results.summary.totalExternalLinks = uniqueExternalLinks.length;
        
        for (let i = 0; i < uniqueExternalLinks.length; i++) {
            const link = uniqueExternalLinks[i];
            const linkResult = await testExternalLink(link.url);
            results.externalLinks.push({
                ...link,
                ...linkResult
            });
            
            if (linkResult.success) {
                results.summary.successfulExternalLinks++;
            }
            
            console.log(`${linkResult.success ? '✅' : '❌'} ${link.url}: ${linkResult.message}`);
            
            // Rate limiting: wait 500ms between external requests
            if (i < uniqueExternalLinks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
    } finally {
        await browser.close();
    }
    
    // Generate summary report
    console.log('\n📊 Testing Summary:');
    console.log('='.repeat(50));
    console.log(`Blog Pages: ${results.summary.successfulBlogPages}/${results.summary.totalBlogPages} successful`);
    console.log(`Internal Links: ${results.summary.successfulInternalLinks}/${results.summary.totalInternalLinks} successful`);
    console.log(`External Links: ${results.summary.successfulExternalLinks}/${results.summary.totalExternalLinks} successful`);
    
    // Calculate success rates
    const blogPageSuccessRate = (results.summary.successfulBlogPages / results.summary.totalBlogPages * 100).toFixed(1);
    const internalLinkSuccessRate = results.summary.totalInternalLinks > 0 ? 
        (results.summary.successfulInternalLinks / results.summary.totalInternalLinks * 100).toFixed(1) : '100.0';
    const externalLinkSuccessRate = results.summary.totalExternalLinks > 0 ? 
        (results.summary.successfulExternalLinks / results.summary.totalExternalLinks * 100).toFixed(1) : '100.0';
    
    console.log(`\\nSuccess Rates:`);
    console.log(`- Blog Pages: ${blogPageSuccessRate}%`);
    console.log(`- Internal Links: ${internalLinkSuccessRate}%`);
    console.log(`- External Links: ${externalLinkSuccessRate}%`);
    
    // Save detailed results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `blog-link-test-report-${timestamp}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
    
    console.log(`\\n📋 Detailed report saved to: ${reportFile}`);
    
    // Highlight issues
    const failedBlogPages = results.blogPages.filter(page => !page.success);
    const failedInternalLinks = results.internalLinks.filter(link => !link.success);
    const failedExternalLinks = results.externalLinks.filter(link => !link.success);
    
    if (failedBlogPages.length > 0) {
        console.log(`\\n❌ Failed Blog Pages (${failedBlogPages.length}):`);
        failedBlogPages.forEach(page => {
            console.log(`- ${page.slug}: ${page.message}`);
        });
    }
    
    if (failedInternalLinks.length > 0) {
        console.log(`\\n❌ Failed Internal Links (${failedInternalLinks.length}):`);
        failedInternalLinks.forEach(link => {
            console.log(`- ${link.url}: ${link.message}`);
        });
    }
    
    if (failedExternalLinks.length > 0) {
        console.log(`\\n❌ Failed External Links (${failedExternalLinks.length}):`);
        failedExternalLinks.forEach(link => {
            console.log(`- ${link.url}: ${link.message}`);
        });
    }
    
    const overallSuccess = failedBlogPages.length === 0 && failedInternalLinks.length === 0 && failedExternalLinks.length === 0;
    console.log(`\\n${overallSuccess ? '🎉' : '⚠️'} Overall Status: ${overallSuccess ? 'All tests passed!' : 'Some issues found - see details above'}`);
    
    process.exit(overallSuccess ? 0 : 1);
}

main().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});