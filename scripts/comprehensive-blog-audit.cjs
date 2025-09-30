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

// Blog data import paths
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
            console.log('📁 Reading blog data file...');
            
            // Split content by blog post objects
            const posts = [];
            const postRegex = /{\s*id:\s*['"`]([^'"`]+)['"`][\s\S]*?content:\s*`([\s\S]*?)`[\s\S]*?}/g;
            let match;
            
            while ((match = postRegex.exec(content)) !== null) {
                const postId = match[1];
                const postContent = match[2];
                const fullMatch = match[0];
                
                const post = this.parseBlogPostFromString(fullMatch, postId, postContent);
                if (post) {
                    posts.push(post);
                }
            }

            console.log(`✅ Extracted ${posts.length} blog posts`);
            return posts;
        } catch (error) {
            console.error('❌ Error extracting blog posts:', error.message);
            return [];
        }
    }

    /**
     * Parse individual blog post from string match
     */
    parseBlogPostFromString(match, id, content) {
        try {
            // Extract basic fields using regex
            const slug = this.extractField(match, 'slug');
            const title = this.extractField(match, 'title');
            const metaTitle = this.extractField(match, 'metaTitle');
            const metaDescription = this.extractField(match, 'metaDescription');
            const imageUrl = this.extractField(match, 'imageUrl');
            const readTimeMinutes = this.extractField(match, 'readTimeMinutes');
            
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
            console.error('❌ Error parsing blog post:', error.message);
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
        const batchSize = 5; // Reduced batch size
        for (let i = 0; i < allLinks.length; i += batchSize) {
            const batch = allLinks.slice(i, i + batchSize);
            console.log(`⏳ Validating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allLinks.length/batchSize)}...`);
            
            await Promise.all(batch.map(link => this.validateLink(link)));
            
            // Add delay between batches
            if (i + batchSize < allLinks.length) {
                await this.delay(3000); // 3 second delay
            }
        }

        const brokenLinks = allLinks.filter(link => 
            link.status !== 'OK' && 
            link.status !== 'ANCHOR' && 
            !link.status.startsWith('REDIRECT')
        );
        
        this.auditResults.linkIssues = allLinks; // Store all for analysis
        
        console.log(`✅ Link audit complete: ${brokenLinks.length} broken links found`);
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
            if (response.ok) {
                link.status = 'OK';
            } else if (response.redirected) {
                link.status = `REDIRECT-${response.status}`;
            } else {
                link.status = `ERROR-${response.status}`;
            }
            
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
            const timeout = 15000; // 15 seconds
            
            try {
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
            } catch (error) {
                reject(error);
            }
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
            if (imageAnalysis.issues.length > 0 || imageAnalysis.suggestions.length > 0) {
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
            if (imageAnalysis.issues.length > 0 || imageAnalysis.suggestions.length > 0) {
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
                return { issues, suggestions };
            }

            // Check if it's a stock photo service (Unsplash detection)
            if (imageUrl.includes('unsplash.com')) {
                const urlObj = new URL(imageUrl);
                const currentParams = urlObj.searchParams;
                const width = parseInt(currentParams.get('w') || '1470');
                const quality = parseInt(currentParams.get('q') || '80');

                if (width < 1200 && type === 'hero') {
                    issues.push('Hero image resolution below 1200px');
                    suggestions.push(`Upgrade to higher resolution: increase w parameter to 1200`);
                }

                if (quality < 85) {
                    issues.push('Image quality below recommended 85%');
                    suggestions.push('Increase q parameter to 85-90');
                }

                // Generate HD replacement suggestion
                const betterUrl = this.generateHDUnsplashUrl(imageUrl, type);
                if (betterUrl !== imageUrl) {
                    suggestions.push(`HD replacement: ${betterUrl}`);
                }
            }
            
        } catch (error) {
            issues.push(`Image analysis error: ${error.message}`);
        }

        return { issues, suggestions };
    }

    /**
     * Generate HD Unsplash URL
     */
    generateHDUnsplashUrl(originalUrl, type) {
        try {
            const urlObj = new URL(originalUrl);
            
            // Set optimal parameters based on image type
            if (type === 'hero') {
                urlObj.searchParams.set('w', '1200');
                urlObj.searchParams.set('h', '630');
            } else {
                urlObj.searchParams.set('w', '800');
                urlObj.searchParams.set('h', '450');
            }
            
            urlObj.searchParams.set('q', '90');
            urlObj.searchParams.set('fit', 'crop');
            
            return urlObj.toString();
        } catch (error) {
            return originalUrl;
        }
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
                            issues,
                            suggestions: this.generateAuthorSuggestions(author)
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
            console.error('❌ Error auditing authors:', error.message);
            return [];
        }
    }

    /**
     * Extract authors from TypeScript content
     */
    extractAuthorsFromContent(content) {
        const authors = [];
        const authorRegex = /{\s*slug:\s*['"]([^'"]+)['"][^}]*name:\s*['"]([^'"]+)['"][^}]*avatarUrl:\s*['"]([^'"]+)['"][^}]*credentials:\s*['"]([^'"]+)['"][^}]*bio:\s*['"]([^'"]+)['"][^}]*}/gs;
        
        let match;
        while ((match = authorRegex.exec(content)) !== null) {
            authors.push({
                slug: match[1],
                name: match[2],
                avatarUrl: match[3],
                credentials: match[4],
                bio: match[5]
            });
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

        // Check if avatar is high quality
        if (author.avatarUrl && author.avatarUrl.includes('unsplash.com')) {
            try {
                const urlParams = new URL(author.avatarUrl).searchParams;
                const width = parseInt(urlParams.get('w') || '1374');
                
                if (width < 400) {
                    issues.push('Avatar resolution below 400px minimum');
                }
            } catch (error) {
                issues.push('Avatar URL parsing error');
            }
        }

        return issues;
    }

    /**
     * Generate author improvement suggestions
     */
    generateAuthorSuggestions(author) {
        const suggestions = [];
        
        if (author.avatarUrl && author.avatarUrl.includes('unsplash.com')) {
            const hdAvatar = this.generateHDUnsplashUrl(author.avatarUrl, 'avatar');
            suggestions.push(`HD avatar URL: ${hdAvatar}`);
        }
        
        if (author.bio && author.bio.length < 200) {
            suggestions.push('Consider expanding bio to 200+ characters for better E-E-A-T');
        }
        
        return suggestions;
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
                    slug: post.slug,
                    issues,
                    suggestions: this.generateSEOSuggestions(post, issues)
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
        if (post.slug && post.slug.length > 75) {
            issues.push('URL slug too long (max 75 characters)');
        }

        if (post.slug && !/^[a-z0-9-]+$/.test(post.slug)) {
            issues.push('URL slug contains invalid characters (should be lowercase letters, numbers, and hyphens only)');
        }

        // Content analysis
        if (!post.content || post.content.length < 1500) {
            issues.push('Content too short for comprehensive coverage (aim for 1500+ words)');
        }

        // Heading structure analysis
        if (post.content) {
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
        }

        return issues;
    }

    /**
     * Generate SEO improvement suggestions
     */
    generateSEOSuggestions(post, issues) {
        const suggestions = [];
        
        // Meta title suggestions
        if (issues.some(i => i.includes('Meta title'))) {
            if (post.title) {
                const suggested = post.title.length > 60 ? 
                    post.title.substring(0, 57) + '...' : 
                    post.title;
                suggestions.push(`Suggested meta title: "${suggested}"`);
            }
        }
        
        // Meta description suggestions
        if (issues.some(i => i.includes('Meta description'))) {
            suggestions.push('Consider creating a compelling 120-155 character meta description focusing on primary benefits');
        }
        
        // Content structure suggestions
        if (issues.some(i => i.includes('H2 headings'))) {
            suggestions.push('Add more H2 sections to break up content and improve readability');
        }
        
        return suggestions;
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
                link_issues_found: this.auditResults.linkIssues.filter(l => 
                    l.status.startsWith('ERROR') || l.status.startsWith('REDIRECT')
                ).length,
                image_optimization_opportunities: this.auditResults.imageIssues.length,
                author_profile_issues: this.auditResults.authorIssues.length,
                seo_issues_found: this.auditResults.seoIssues.length,
                audit_timestamp: this.auditResults.timestamp,
                posts_audited: this.auditResults.blogPosts.map(p => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    url: p.url
                }))
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
        const brokenLinks = this.auditResults.linkIssues.filter(link => 
            link.status.startsWith('ERROR') && !link.status.includes('timeout')
        );
        if (brokenLinks.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: 'Links',
                issue: `${brokenLinks.length} broken external links found`,
                action: 'Fix or remove broken links immediately',
                impact: 'Broken links hurt user experience and SEO rankings',
                affected_posts: [...new Set(brokenLinks.map(l => l.postId))]
            });
        }

        // Medium priority: SEO issues
        if (this.auditResults.seoIssues.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'SEO',
                issue: `${this.auditResults.seoIssues.length} posts with SEO optimization opportunities`,
                action: 'Optimize meta titles, descriptions, and content structure',
                impact: 'Better SEO will improve organic traffic and rankings',
                affected_posts: this.auditResults.seoIssues.map(s => s.postId)
            });
        }

        // Medium priority: Author issues
        if (this.auditResults.authorIssues.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'Authors',
                issue: `${this.auditResults.authorIssues.length} author profiles need improvement`,
                action: 'Update author bios, credentials, and profile photos',
                impact: 'Better author profiles improve E-E-A-T and trustworthiness'
            });
        }

        // Low priority: Image optimization
        if (this.auditResults.imageIssues.length > 0) {
            recommendations.push({
                priority: 'LOW',
                category: 'Images',
                issue: `${this.auditResults.imageIssues.length} image optimization opportunities`,
                action: 'Upgrade to higher resolution, more relevant images',
                impact: 'Better images improve user engagement and social sharing',
                affected_posts: [...new Set(this.auditResults.imageIssues.map(i => i.postId))]
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
            
            // Create image optimization CSV
            this.saveImageIssuesCSV(`image-optimization-${timestamp}.csv`);
            
            return reportFilename;
            
        } catch (error) {
            console.error('❌ Error saving report:', error.message);
            return null;
        }
    }

    /**
     * Save link issues as CSV
     */
    saveLinkIssuesCSV(filename) {
        try {
            const headers = 'Post ID,Anchor Text,URL,Status,Status Code,Type,Error\n';
            const rows = this.auditResults.linkIssues.map(link => 
                `"${link.postId}","${link.anchorText.replace(/"/g, '""')}","${link.url}","${link.status}","${link.statusCode || ''}","${link.type}","${(link.error || '').replace(/"/g, '""')}"`
            ).join('\n');
            
            fs.writeFileSync(filename, headers + rows);
            console.log(`📊 Link issues CSV saved to: ${filename}`);
        } catch (error) {
            console.error('❌ Error saving link CSV:', error.message);
        }
    }

    /**
     * Save image optimization opportunities as CSV
     */
    saveImageIssuesCSV(filename) {
        try {
            const headers = 'Post ID,Image URL,Type,Issues,Suggestions\n';
            const rows = this.auditResults.imageIssues.map(img => 
                `"${img.postId}","${img.imageUrl}","${img.type}","${img.issues.join('; ')}","${img.suggestions.join('; ')}"`
            ).join('\n');
            
            fs.writeFileSync(filename, headers + rows);
            console.log(`🖼️ Image optimization CSV saved to: ${filename}`);
        } catch (error) {
            console.error('❌ Error saving image CSV:', error.message);
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
                return null;
            }

            console.log(`📋 Found ${posts.length} blog posts to audit`);
            posts.forEach(post => {
                console.log(`   - ${post.id}: ${post.title}`);
            });
            console.log('');

            // Run all audits
            await this.auditLinks(posts);
            await this.auditImages(posts);
            await this.auditAuthors(posts);
            await this.auditSEO(posts);

            // Generate and save report
            const reportFile = this.saveReport();

            console.log('\n🎉 Comprehensive blog audit completed!');
            console.log('📋 Check the generated JSON report for detailed findings');
            console.log('📊 CSV files created for links and images');
            
            // Print summary
            console.log('\n📈 AUDIT SUMMARY:');
            console.log(`   Total posts: ${this.auditResults.blogPosts.length}`);
            console.log(`   Link issues: ${this.auditResults.linkIssues.filter(l => l.status.startsWith('ERROR')).length}`);
            console.log(`   Image optimization opportunities: ${this.auditResults.imageIssues.length}`);
            console.log(`   Author profile issues: ${this.auditResults.authorIssues.length}`);
            console.log(`   SEO optimization opportunities: ${this.auditResults.seoIssues.length}`);

            return reportFile;

        } catch (error) {
            console.error('❌ Fatal error during audit:', error.message);
            return null;
        }
    }
}

// Execute audit if run directly
if (require.main === module) {
    const auditor = new BlogAuditor();
    auditor.runFullAudit();
}

module.exports = BlogAuditor;