#!/usr/bin/env node

/**
 * Blog Converter - Converts markdown blog posts to React BlogPost interface format
 * Automatically converts markdown files from /blog directory to TypeScript format for blog.ts
 */

const fs = require('fs');
const path = require('path');

class BlogConverter {
    constructor(blogDir = './blog', reactBlogDir = './Brokeranalysisgooglestudio/data') {
        this.blogDir = path.resolve(__dirname, blogDir);
        this.reactBlogDir = path.resolve(__dirname, reactBlogDir);
        this.authorsPath = path.join(this.reactBlogDir, 'authors.ts');
        this.blogPath = path.join(this.reactBlogDir, 'blog.ts');
        this.authors = this.loadAuthors();
    }

    loadAuthors() {
        try {
            const authorsContent = fs.readFileSync(this.authorsPath, 'utf8');
            // Simple regex to extract author slugs and names
            const authorMatches = authorsContent.match(/slug: '([^']+)',\s*name: '([^']+)'/g);
            const authors = {};

            if (authorMatches) {
                authorMatches.forEach(match => {
                    const slugMatch = match.match(/slug: '([^']+)'/);
                    const nameMatch = match.match(/name: '([^']+)'/);
                    if (slugMatch && nameMatch) {
                        authors[slugMatch[1]] = nameMatch[1];
                    }
                });
            }

            return authors;
        } catch (error) {
            console.error('Error loading authors:', error.message);
            return {};
        }
    }

    extractMetadata(content) {
        const metadata = {};

        // Extract title (first H1)
        const titleMatch = content.match(/^# (.+)$/m);
        metadata.title = titleMatch ? titleMatch[1] : 'Untitled';

        // Extract author
        const authorMatch = content.match(/\*\*Author:\*\* (.+) – (.+)/);
        if (authorMatch) {
            metadata.authorName = authorMatch[1].trim();
            metadata.authorTitle = authorMatch[2].trim();

            // Find author slug by name
            metadata.authorSlug = this.findAuthorSlug(metadata.authorName);
        }

        // Extract fact checker
        const factCheckerMatch = content.match(/\*\*Fact Checker:\*\* (.+) – (.+)/);
        if (factCheckerMatch) {
            metadata.factCheckerName = factCheckerMatch[1].trim();
            metadata.factCheckerSlug = this.findAuthorSlug(factCheckerMatch[1].trim());
        }

        // Extract reading time
        const readingTimeMatch = content.match(/\*\*Estimated Reading Time:\*\* (\d+) minutes/);
        metadata.readTimeMinutes = readingTimeMatch ? parseInt(readingTimeMatch[1]) : 5;

        // Extract published date (use file modification time as fallback)
        metadata.date = new Date().toISOString();
        metadata.lastUpdated = new Date().toISOString();

        // Generate slug from title
        metadata.slug = this.generateSlug(metadata.title);

        // Generate ID
        metadata.id = this.generateId();

        return metadata;
    }

    findAuthorSlug(authorName) {
        for (const [slug, name] of Object.entries(this.authors)) {
            if (name.toLowerCase() === authorName.toLowerCase()) {
                return slug;
            }
        }
        return 'unknown-author';
    }

    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    generateId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `bp${timestamp}${random}`;
    }

    extractKeyTakeaways(content) {
        const keyTakeawaysMatch = content.match(/## \*\*Key Takeaways\*\*\s*\n([\s\S]*?)(?=##|$)/m);
        if (!keyTakeawaysMatch) return [];

        const takeawaysText = keyTakeawaysMatch[1];
        const takeaways = takeawaysText
            .split('\n')
            .filter(line => line.startsWith('* '))
            .map(line => line.replace(/^\* \*\*/, '').replace('\*\*', '').trim())
            .filter(takeaway => takeaway.length > 0);

        return takeaways;
    }

    extractMainContent(content) {
        // Remove front matter and metadata
        let cleanContent = content
            .replace(/^# .+?\n/, '') // Remove title
            .replace(/\*\*Author:\*\*.*?\n/, '')
            .replace(/\*\*Fact Checker:\*\*.*?\n/, '')
            .replace(/\*\*Estimated Reading Time:\*\*.*?\n/, '')
            .replace(/---\n/g, '');

        // Convert markdown headers to proper format
        cleanContent = cleanContent
            .replace(/## \*\*([^*]+)\*\*/g, '## $1')
            .replace(/\*\*([^*]+)\*\*/g, '**$1**');

        // Convert internal links to proper format
        cleanContent = cleanContent
            .replace(/\*Check out our.*?\*/g, (match) => {
                if (match.includes('AI Broker Matcher')) {
                    return 'Check out our **[AI Broker Matcher](/ai-matcher)** to find your perfect match.';
                } else if (match.includes('interactive cost analyzer')) {
                    return 'Use our **[Live Cost Analyzer](/cost-analyzer)** to simulate different trading scenarios.';
                }
                return match;
            });

        return cleanContent.trim();
    }

    generateBlogPost(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const metadata = this.extractMetadata(content);
            const keyTakeaways = this.extractKeyTakeaways(content);
            const mainContent = this.extractMainContent(content);

            // Generate meta title and description
            const metaTitle = `${metadata.title} | BrokerAnalysis`;
            const metaDescription = this.generateMetaDescription(mainContent);

            // Generate summary from first paragraph
            const summary = this.generateSummary(mainContent);

            // Generate tags
            const tags = this.generateTags(mainContent);

            const blogPost = {
                id: metadata.id,
                slug: metadata.slug,
                title: metadata.title,
                metaTitle: metaTitle,
                metaDescription: metaDescription,
                summary: summary,
                keyTakeaways: keyTakeaways,
                author: {
                    name: metadata.authorName || 'Unknown Author',
                    slug: metadata.authorSlug || 'unknown-author',
                    avatarUrl: this.getAuthorAvatarUrl(metadata.authorSlug)
                },
                date: metadata.date,
                lastUpdated: metadata.lastUpdated,
                reviewedBy: metadata.factCheckerName ? {
                    name: metadata.factCheckerName,
                    slug: metadata.factCheckerSlug || 'unknown-reviewer'
                } : undefined,
                tags: tags,
                imageUrl: this.generateImageUrl(),
                readTimeMinutes: metadata.readTimeMinutes,
                content: `\n${mainContent}\n`
            };

            return blogPost;
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error.message);
            return null;
        }
    }

    generateMetaDescription(content) {
        const firstParagraph = content.split('\n\n')[0].replace(/\*\*/g, '').replace(/'/g, "\\'").replace(/\n/g, ' ');
        return firstParagraph.length > 160
            ? firstParagraph.substring(0, 157) + '...'
            : firstParagraph;
    }

    generateSummary(content) {
        const firstParagraph = content.split('\n\n')[0].replace(/\*\*/g, '').replace(/'/g, "\\'").replace(/\n/g, ' ');
        return firstParagraph.length > 200
            ? firstParagraph.substring(0, 197) + '...'
            : firstParagraph;
    }

    generateTags(content) {
        const tags = new Set();
        const contentLower = content.toLowerCase();

        // Auto-generate tags based on content
        const tagKeywords = {
            'Beginner Guide': ['beginner', 'new trader', 'getting started', 'first time'],
            'Regulation': ['regulation', 'regulatory', 'cftc', 'nfa', 'fca', 'asic'],
            'Educational Resources': ['education', 'learning', 'tutorial', 'guide', 'academy'],
            'Risk Management': ['risk', 'management', 'stop loss', 'position sizing'],
            'Trading Costs': ['costs', 'fees', 'spreads', 'commissions', 'swap'],
            'Trading Strategy': ['strategy', 'trading strategy', 'approach'],
            'Technical Analysis': ['technical', 'analysis', 'indicators', 'charts'],
            'Market Analysis': ['market analysis', 'news', 'economic', 'trends']
        };

        for (const [tag, keywords] of Object.entries(tagKeywords)) {
            if (keywords.some(keyword => contentLower.includes(keyword))) {
                tags.add(tag);
            }
        }

        return Array.from(tags).slice(0, 5); // Limit to 5 tags
    }

    generateImageUrl() {
        const imageKeywords = [
            'forex-trading-desk',
            'financial-markets',
            'currency-trading',
            'forex-analysis',
            'trading-screens',
            'financial-analysis'
        ];

        const randomKeyword = imageKeywords[Math.floor(Math.random() * imageKeywords.length)];
        return `https://images.unsplash.com/photo-${Date.now()}?q=90&w=1200&h=630&fit=crop&ixlib=rb-4.0.3&auto=format`;
    }

    getAuthorAvatarUrl(authorSlug) {
        // Return a default avatar URL based on author slug
        const avatarUrls = {
            'elena-price': 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'darren-cole': 'https://images.unsplash.com/photo-1610999143372-2fc3b8a2e2e7?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'maya-torres': 'https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        };

        return avatarUrls[authorSlug] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&auto=format';
    }

    convertToTypeScript(blogPost) {
        const escapeString = (str) => str.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        const escapeContent = (str) => str.replace(/`/g, '\\`').replace(/\${/g, '\\${');

        return `  {
    id: '${blogPost.id}',
    slug: '${blogPost.slug}',
    title: '${escapeString(blogPost.title)}',
    metaTitle: '${escapeString(blogPost.metaTitle)}',
    metaDescription: '${escapeString(blogPost.metaDescription)}',
    summary: '${escapeString(blogPost.summary)}',
    keyTakeaways: [
${blogPost.keyTakeaways.map(takeaway => `        "${escapeString(takeaway)}"`).join(',\n')}
    ],
    author: {
      name: ${blogPost.author.slug === 'unknown-author' ? `"${escapeString(blogPost.author.name)}"` : `${blogPost.author.slug}.name`},
      slug: '${blogPost.author.slug}',
      avatarUrl: '${blogPost.author.avatarUrl}',
    },
    date: '${blogPost.date}',
    lastUpdated: '${blogPost.lastUpdated}',
    ${blogPost.reviewedBy ? `reviewedBy: {
        name: ${blogPost.reviewedBy.slug === 'unknown-reviewer' ? `"${escapeString(blogPost.reviewedBy.name)}"` : `${blogPost.reviewedBy.slug}.name`},
        slug: '${blogPost.reviewedBy.slug}',
    },` : ''}
    tags: [${blogPost.tags.map(tag => `'${tag}'`).join(', ')}],
    imageUrl: '${blogPost.imageUrl}',
    readTimeMinutes: ${blogPost.readTimeMinutes},
    content: \`${escapeContent(blogPost.content)}\`
  }`;
    }

    addToBlogTs(blogPost) {
        try {
            const blogContent = fs.readFileSync(this.blogPath, 'utf8');

            // Find the position before the closing bracket and semicolon
            const insertPosition = blogContent.lastIndexOf('];');
            if (insertPosition === -1) {
                throw new Error('Could not find blogPosts array end');
            }

            // Insert the new blog post
            const newContent = blogContent.slice(0, insertPosition) +
                ',\n  {\n' +
                this.convertToTypeScript(blogPost).slice(6) + // Remove the first 6 chars "  {" to avoid double braces
                blogContent.slice(insertPosition);

            fs.writeFileSync(this.blogPath, newContent);
            console.log(`✅ Added blog post "${blogPost.title}" to blog.ts`);
            return true;
        } catch (error) {
            console.error(`Error adding to blog.ts:`, error.message);
            return false;
        }
    }

    convertFile(filePath) {
        console.log(`🔄 Converting ${path.basename(filePath)}...`);
        const blogPost = this.generateBlogPost(filePath);

        if (!blogPost) {
            console.error(`❌ Failed to convert ${filePath}`);
            return false;
        }

        const success = this.addToBlogTs(blogPost);
        if (success) {
            console.log(`✅ Successfully converted and added "${blogPost.title}"`);
        }

        return success;
    }

    convertAll() {
        console.log('🚀 Starting blog conversion...\n');

        const markdownFiles = fs.readdirSync(this.blogDir)
            .filter(file => file.endsWith('.md') && file !== 'index.md' && file !== 'README.md')
            .map(file => path.join(this.blogDir, file));

        if (markdownFiles.length === 0) {
            console.log('📝 No markdown files found to convert');
            return;
        }

        let successCount = 0;
        markdownFiles.forEach(filePath => {
            if (this.convertFile(filePath)) {
                successCount++;
            }
        });

        console.log(`\n✨ Conversion complete: ${successCount}/${markdownFiles.length} files converted successfully`);
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const blogDir = args[0] || '../blog';
    const reactBlogDir = args[1] || '../Brokeranalysisgooglestudio/data';

    const converter = new BlogConverter(blogDir, reactBlogDir);

    if (args.includes('--file')) {
        const filePath = args[args.indexOf('--file') + 1];
        if (filePath) {
            converter.convertFile(filePath);
        } else {
            console.error('Please provide a file path after --file');
        }
    } else {
        converter.convertAll();
    }
}

module.exports = BlogConverter;