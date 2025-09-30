/**
 * Comprehensive Blog Audit & Optimization Tool
 * 
 * This script analyzes all blog posts for:
 * 1. Link validation (internal & external)
 * 2. Image optimization opportunities  
 * 3. Author profile completeness
 * 4. SEO optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Blog data import
const blogDataPath = path.join(process.cwd(), 'data', 'blog.ts');
const authorsDataPath = path.join(process.cwd(), 'data', 'authors.ts');

class BlogAuditor {
    constructor() {
        this.auditResults = {
            blogPosts: [],
            linkIssues: [],
            imageIssues: [],
            authorIssues: [],
            seoIssues: [],
            timestamp: new Date().toISOString()
        };
        this.processedLinks = new Set();
    }

    /**
     * Extract blog posts data from the TypeScript file
     */
    async extractBlogPosts() {
        try {
            const content = fs.readFileSync(blogDataPath, 'utf8');
            
            // Extract blog posts using regex patterns
            const blogPostMatches = content.match(/{\s*id:\s*['"`]([^'"`]+)['"`][^}]+}/gs);
            const posts = [];

            if (blogPostMatches) {
                for (const match of blogPostMatches) {
                    const post = this.parseBlogPostFromString(match, content);
                    if (post) {
                        posts.push(post);
                    }
                }
            }

            console.log(`✅ Extracted ${posts.length} blog posts`);
            return posts;
        } catch (error) {
            console.error('❌ Error extracting blog posts:', error);
            return [];
        }
    }

    /**
     * Parse individual blog post from string match
     */
    parseBlogPostFromString(match, fullContent) {
        try {
            // Extract basic fields using regex
            const id = this.extractField(match, 'id');
            const slug = this.extractField(match, 'slug');
            const title = this.extractField(match, 'title');
            const metaTitle = this.extractField(match, 'metaTitle');
            const metaDescription = this.extractField(match, 'metaDescription');
            const imageUrl = this.extractField(match, 'imageUrl');
            const readTimeMinutes = this.extractField(match, 'readTimeMinutes');
            
            // Extract content (more complex due to multi-line)
            const contentMatch = match.match(/content:\s*`([^`]+)`/s);
            const content = contentMatch ? contentMatch[1] : '';

            // Extract tags
            const tagsMatch = match.match(/tags:\s*\[([^\]]+)\]/);
            const tags = tagsMatch ? 
                tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, '')) : [];

            // Extract author info
            const authorMatch = match.match(/author:\s*{[^}]+}/s);
            let author = {};
            if (authorMatch) {
                const authorName = this.extractField(authorMatch[0], 'name');
                const authorSlug = this.extractField(authorMatch[0], 'slug');
                const avatarUrl = this.extractField(authorMatch[0], 'avatarUrl');
                author = { name: authorName, slug: authorSlug, avatarUrl };
            }

            return {
                id,
                slug,
                title,
                metaTitle,
                metaDescription,
                imageUrl,
                readTimeMinutes: parseInt(readTimeMinutes) || 0,
                content,
                tags,
                author,
                url: `https://brokeranalysis.com/#/blog/${slug}`
            };
        } catch (error) {
            console.error('❌ Error parsing blog post:', error);
            return null;
        }
    }

    /**
     * Extract field value using regex
     */
    extractField(text, fieldName) {
        const regex = new RegExp(`${fieldName}:\\s*['"\`]([^'"\`]+)['"\`]`);
        const match = text.match(regex);
        return match ? match[1] : '';
    }

    /**
     * Extract and validate all links from blog posts
     */
    async auditLinks(posts) {
        console.log('🔍 Starting link audit...');
        const allLinks = [];

        for (const post of posts) {
            const links = this.extractLinksFromContent(post.content, post.id);
            allLinks.push(...links);
        }

        console.log(`📊 Found ${allLinks.length} unique links to validate`);

        // Validate links in batches to avoid overwhelming servers
        const batchSize = 10;
        for (let i = 0; i < allLinks.length; i += batchSize) {
            const batch = allLinks.slice(i, i + batchSize);
            await Promise.all(batch.map(link => this.validateLink(link)));
            
            // Add delay between batches
            if (i + batchSize < allLinks.length) {
                await this.delay(2000); // 2 second delay
            }
        }

        const brokenLinks = allLinks.filter(link => link.status !== 'OK');
        this.auditResults.linkIssues = brokenLinks;
        
        console.log(`✅ Link audit complete: ${brokenLinks.length} issues found`);
        return brokenLinks;
    }

    /**
     * Extract links from markdown content
     */
    extractLinksFromContent(content, postId) {
        const links = [];
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
            const [fullMatch, text, url] = match;
            
            if (!this.processedLinks.has(url)) {
                this.processedLinks.add(url);
                links.push({
                    postId,
                    anchorText: text,
                    url: url.trim(),
                    type: this.categorizeLink(url),
                    status: 'PENDING'
                });
            }
        }

        return links;
    }

    /**
     * Categorize link type
     */
    categorizeLink(url) {
        if (url.startsWith('#')) return 'internal-anchor';
        if (url.startsWith('/') || url.includes('brokeranalysis.com')) return 'internal';
        if (url.startsWith('http')) return 'external';
        return 'unknown';
    }

    /**
     * Validate individual link
     */
    async validateLink(link) {
        try {
            // Skip anchor links
            if (link.type === 'internal-anchor') {
                link.status = 'ANCHOR';
                return;
            }

            // For internal links, construct full URL
            let testUrl = link.url;
            if (link.type === 'internal') {
                testUrl = testUrl.startsWith('http') ? testUrl : `https://brokeranalysis.com${testUrl}`;
            }

            const response = await this.makeHttpRequest(testUrl);
            link.status = response.ok ? 'OK' : `ERROR-${response.status}`;
            link.statusCode = response.status;
            link.redirected = response.redirected;
            
        } catch (error) {
            link.status = 'ERROR';
            link.error = error.message;
        }
    }

    /**
     * Make HTTP request with timeout
     */
    makeHttpRequest(url) {
        return new Promise((resolve, reject) => {
            const timeout = 10000; // 10 seconds
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;

            const req = client.request(url, { 
                method: 'HEAD',
                timeout: timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }, (res) => {
                resolve({
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    redirected: res.statusCode >= 300 && res.statusCode < 400
                });
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.end();
        });
    }

    /**
     * Audit images for optimization opportunities
     */
    async auditImages(posts) {
        console.log('🖼️ Starting image audit...');
        const imageIssues = [];

        for (const post of posts) {
            const issues = await this.analyzePostImages(post);
            imageIssues.push(...issues);
        }

        this.auditResults.imageIssues = imageIssues;
        console.log(`✅ Image audit complete: ${imageIssues.length} optimization opportunities found`);
        return imageIssues;
    }

    /**
     * Analyze images for a specific post
     */
    async analyzePostImages(post) {
        const issues = [];

        // Check main post image
        if (post.imageUrl) {
            const imageAnalysis = await this.analyzeImage(post.imageUrl, 'hero', post.id);
            if (imageAnalysis.issues.length > 0) {
                issues.push({
                    postId: post.id,
                    imageUrl: post.imageUrl,
                    type: 'hero',
                    issues: imageAnalysis.issues,
                    suggestions: imageAnalysis.suggestions
                });
            }
        }

        // Extract and analyze inline images from content
        const inlineImages = this.extractImagesFromContent(post.content);
        for (const img of inlineImages) {
            const imageAnalysis = await this.analyzeImage(img.url, 'inline', post.id);
            if (imageAnalysis.issues.length > 0) {
                issues.push({
                    postId: post.id,
                    imageUrl: img.url,
                    altText: img.alt,
                    type: 'inline',
                    issues: imageAnalysis.issues,
                    suggestions: imageAnalysis.suggestions
                });
            }
        }

        return issues;
    }

    /**
     * Extract images from markdown content
     */
    extractImagesFromContent(content) {
        const images = [];
        const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let match;

        while ((match = imgRegex.exec(content)) !== null) {
            images.push({
                alt: match[1] || '',
                url: match[2]
            });
        }

        return images;
    }

    /**
     * Analyze individual image
     */
    async analyzeImage(imageUrl, type, postId) {
        const issues = [];
        const suggestions = [];

        try {
            // Basic URL analysis
            if (!imageUrl.startsWith('http')) {
                issues.push('Invalid image URL');
                suggestions.push('Use full HTTP/HTTPS URL');
            }

            // Check if it's a stock photo service (Unsplash detection)
            if (imageUrl.includes('unsplash.com')) {
                // Extract image ID for quality check
                const unsplashId = this.extractUnsplashId(imageUrl);
                if (unsplashId) {
                    // Check if we can suggest higher quality version
                    const currentParams = new URL(imageUrl).searchParams;
                    const width = currentParams.get('w') || '1470';
                    const quality = currentParams.get('q') || '80';

                    if (parseInt(width) < 1200 && type === 'hero') {
                        issues.push('Hero image resolution below 1200px');
                        suggestions.push(`Upgrade to higher resolution: increase w parameter to 1200`);
                    }

                    if (parseInt(quality) < 85) {
                        issues.push('Image quality below recommended 85%');
                        suggestions.push('Increase q parameter to 85-90');
                    }

                    // SEO filename suggestion
                    if (!imageUrl.includes('meaningful-keywords')) {
                        suggestions.push('Consider finding more topically relevant stock photos');
                    }
                }
            }

            // Alt text check for inline images would be done in content parsing
            
        } catch (error) {
            issues.push(`Image analysis error: ${error.message}`);
        }

        return { issues, suggestions };
    }

    /**
     * Extract Unsplash photo ID from URL
     */
    extractUnsplashId(url) {
        const match = url.match(/photo-([a-zA-Z0-9_-]+)\?/);
        return match ? match[1] : null;
    }

    /**
     * Audit author profiles
     */
    async auditAuthors(posts) {
        console.log('👥 Starting author audit...');
        
        try {
            const authorsContent = fs.readFileSync(authorsDataPath, 'utf8');
            const authors = this.extractAuthorsFromContent(authorsContent);
            const authorIssues = [];

            // Check each author used in blog posts
            const usedAuthors = new Set();
            posts.forEach(post => {
                if (post.author && post.author.slug) {
                    usedAuthors.add(post.author.slug);
                }
            });

            for (const authorSlug of usedAuthors) {
                const author = authors.find(a => a.slug === authorSlug);
                if (author) {
                    const issues = this.analyzeAuthorProfile(author);
                    if (issues.length > 0) {
                        authorIssues.push({
                            slug: authorSlug,
                            name: author.name,
                            issues
                        });
                    }
                } else {
                    authorIssues.push({
                        slug: authorSlug,
                        issues: ['Author not found in authors.ts file']
                    });
                }
            }

            this.auditResults.authorIssues = authorIssues;
            console.log(`✅ Author audit complete: ${authorIssues.length} authors with issues found`);
            return authorIssues;

        } catch (error) {
            console.error('❌ Error auditing authors:', error);
            return [];
        }
    }

    /**
     * Extract authors from TypeScript content
     */
    extractAuthorsFromContent(content) {
        const authors = [];
        const authorMatches = content.match(/{\s*slug:[^}]+}/gs);

        if (authorMatches) {
            for (const match of authorMatches) {
                const author = {
                    slug: this.extractField(match, 'slug'),
                    name: this.extractField(match, 'name'),
                    avatarUrl: this.extractField(match, 'avatarUrl'),
                    credentials: this.extractField(match, 'credentials'),
                    bio: this.extractField(match, 'bio')
                };
                
                if (author.slug) {
                    authors.push(author);
                }
            }
        }

        return authors;
    }

    /**
     * Analyze individual author profile
     */
    analyzeAuthorProfile(author) {
        const issues = [];

        // Check avatar URL
        if (!author.avatarUrl || !author.avatarUrl.startsWith('http')) {
            issues.push('Missing or invalid avatar URL');
        }

        // Check bio length (should be substantial for E-E-A-T)
        if (!author.bio || author.bio.length < 100) {
            issues.push('Bio too short (should be 100+ characters for E-E-A-T)');
        }

        // Check credentials
        if (!author.credentials) {
            issues.push('Missing credentials/title');
        }

        // Check if avatar is high quality Unsplash
        if (author.avatarUrl && author.avatarUrl.includes('unsplash.com')) {
            const urlParams = new URL(author.avatarUrl).searchParams;
            const width = urlParams.get('w') || '1374';
            
            if (parseInt(width) < 400) {
                issues.push('Avatar resolution below 400px minimum');
            }
        }

        return issues;
    }

    /**
     * Perform SEO audit on all posts
     */
    async auditSEO(posts) {
        console.log('🔍 Starting SEO audit...');
        const seoIssues = [];

        for (const post of posts) {
            const issues = this.analyzeSEO(post);
            if (issues.length > 0) {
                seoIssues.push({
                    postId: post.id,
                    title: post.title,
                    issues
                });
            }
        }

        this.auditResults.seoIssues = seoIssues;
        console.log(`✅ SEO audit complete: ${seoIssues.length} posts with SEO issues found`);
        return seoIssues;
    }

    /**
     * Analyze SEO for individual post
     */
    analyzeSEO(post) {
        const issues = [];

        // Meta title length check
        if (!post.metaTitle) {
            issues.push('Missing meta title');
        } else if (post.metaTitle.length > 60) {
            issues.push(`Meta title too long (${post.metaTitle.length} chars, max 60)`);
        } else if (post.metaTitle.length < 30) {
            issues.push(`Meta title too short (${post.metaTitle.length} chars, min 30)`);
        }

        // Meta description length check
        if (!post.metaDescription) {
            issues.push('Missing meta description');
        } else if (post.metaDescription.length > 155) {
            issues.push(`Meta description too long (${post.metaDescription.length} chars, max 155)`);
        } else if (post.metaDescription.length < 120) {
            issues.push(`Meta description too short (${post.metaDescription.length} chars, min 120)`);
        }

        // URL slug analysis
        if (post.slug.length > 75) {
            issues.push('URL slug too long (max 75 characters)');
        }

        if (!/^[a-z0-9-]+$/.test(post.slug)) {
            issues.push('URL slug contains invalid characters (should be lowercase letters, numbers, and hyphens only)');
        }

        // Content analysis
        if (post.content.length < 1500) {
            issues.push('Content too short for comprehensive coverage (aim for 1500+ words)');
        }

        // Heading structure analysis
        const headings = this.extractHeadings(post.content);
        if (headings.h1.length > 1) {
            issues.push('Multiple H1 tags found (should only have one)');
        }
        if (headings.h2.length < 3) {
            issues.push('Too few H2 headings (should have 3+ for good structure)');
        }

        // Internal linking analysis
        const internalLinks = this.extractLinksFromContent(post.content, post.id)
            .filter(link => link.type === 'internal');
        
        if (internalLinks.length < 3) {
            issues.push('Insufficient internal links (should have 3+ for good SEO)');
        }

        return issues;
    }

    /**
     * Extract heading structure from content
     */
    extractHeadings(content) {
        return {
            h1: (content.match(/^# .+$/gm) || []),
            h2: (content.match(/^## .+$/gm) || []),
            h3: (content.match(/^### .+$/gm) || [])
        };
    }

    /**
     * Generate comprehensive audit report
     */
    generateReport() {
        const report = {
            executive_summary: {
                total_posts_audited: this.auditResults.blogPosts.length,
                link_issues_found: this.auditResults.linkIssues.length,
                image_optimization_opportunities: this.auditResults.imageIssues.length,
                author_profile_issues: this.auditResults.authorIssues.length,
                seo_issues_found: this.auditResults.seoIssues.length,
                audit_timestamp: this.auditResults.timestamp
            },
            detailed_findings: this.auditResults,
            priority_recommendations: this.generatePriorityRecommendations()
        };

        return report;
    }

    /**
     * Generate priority recommendations
     */
    generatePriorityRecommendations() {
        const recommendations = [];

        // High priority: Broken links
        const brokenLinks = this.auditResults.linkIssues.filter(link => link.status.startsWith('ERROR'));
        if (brokenLinks.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: 'Links',
                issue: `${brokenLinks.length} broken external links found`,
                action: 'Fix or remove broken links immediately',
                impact: 'Broken links hurt user experience and SEO rankings'
            });
        }

        // Medium priority: SEO issues
        if (this.auditResults.seoIssues.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'SEO',
                issue: `${this.auditResults.seoIssues.length} posts with SEO optimization opportunities`,
                action: 'Optimize meta titles, descriptions, and content structure',
                impact: 'Better SEO will improve organic traffic and rankings'
            });
        }

        // Low priority: Image optimization
        if (this.auditResults.imageIssues.length > 0) {
            recommendations.push({
                priority: 'LOW',
                category: 'Images',
                issue: `${this.auditResults.imageIssues.length} image optimization opportunities`,
                action: 'Upgrade to higher resolution, more relevant images',
                impact: 'Better images improve user engagement and social sharing'
            });
        }

        return recommendations;
    }

    /**
     * Save audit results to file
     */
    saveReport(filename = null) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFilename = filename || `blog-audit-report-${timestamp}.json`;
        const report = this.generateReport();
        
        try {
            fs.writeFileSync(reportFilename, JSON.stringify(report, null, 2));
            console.log(`📋 Audit report saved to: ${reportFilename}`);
            
            // Also create a simplified CSV for link issues
            this.saveLinkIssuesCSV(`link-issues-${timestamp}.csv`);
            
        } catch (error) {
            console.error('❌ Error saving report:', error);
        }
    }

    /**
     * Save link issues as CSV
     */
    saveLinkIssuesCSV(filename) {
        try {
            const headers = 'Post ID,Anchor Text,URL,Status,Status Code,Type,Error\n';
            const rows = this.auditResults.linkIssues.map(link => 
                `"${link.postId}","${link.anchorText}","${link.url}","${link.status}","${link.statusCode || ''}","${link.type}","${link.error || ''}"`
            ).join('\n');
            
            fs.writeFileSync(filename, headers + rows);
            console.log(`📊 Link issues CSV saved to: ${filename}`);
        } catch (error) {
            console.error('❌ Error saving CSV:', error);
        }
    }

    /**
     * Utility: Add delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Main audit execution
     */
    async runFullAudit() {
        console.log('🚀 Starting comprehensive blog audit...\n');
        
        try {
            // Extract blog posts
            const posts = await this.extractBlogPosts();
            this.auditResults.blogPosts = posts;

            if (posts.length === 0) {
                console.error('❌ No blog posts found. Please check the blog data file.');
                return;
            }

            // Run all audits
            await this.auditLinks(posts);
            await this.auditImages(posts);
            await this.auditAuthors(posts);
            await this.auditSEO(posts);

            // Generate and save report
            this.saveReport();

            console.log('\n🎉 Comprehensive blog audit completed!');
            console.log('📋 Check the generated JSON report for detailed findings');
            console.log('📊 Link issues are also available in CSV format');

        } catch (error) {
            console.error('❌ Fatal error during audit:', error);
        }
    }
}

// Execute audit if run directly
if (require.main === module) {
    const auditor = new BlogAuditor();
    auditor.runFullAudit();
}

module.exports = BlogAuditor;
