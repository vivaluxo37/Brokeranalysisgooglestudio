#!/usr/bin/env node

/**
 * Blog Sync Script - Synchronizes /blog directory with React app's blog.ts
 * Scans for new/updated markdown files and automatically syncs them to the React blog system
 */

const fs = require('fs');
const path = require('path');
const BlogConverter = require('./blog-converter');

class BlogSyncer extends BlogConverter {
    constructor(blogDir = './blog', reactBlogDir = './Brokeranalysisgooglestudio/data') {
        super(blogDir, reactBlogDir);
        this.syncLogPath = path.join(__dirname, 'sync-log.json');
        this.lastSync = this.loadSyncLog();
    }

    loadSyncLog() {
        try {
            if (fs.existsSync(this.syncLogPath)) {
                const logContent = fs.readFileSync(this.syncLogPath, 'utf8');
                return JSON.parse(logContent);
            }
        } catch (error) {
            console.warn('Could not load sync log, starting fresh');
        }
        return {};
    }

    saveSyncLog() {
        try {
            fs.writeFileSync(this.syncLogPath, JSON.stringify(this.lastSync, null, 2));
        } catch (error) {
            console.error('Error saving sync log:', error.message);
        }
    }

    getExistingBlogPosts() {
        try {
            const blogContent = fs.readFileSync(this.blogPath, 'utf8');
            const idMatches = blogContent.match(/id: '([^']+)'/g);
            const existingIds = new Set();

            if (idMatches) {
                idMatches.forEach(match => {
                    const idMatch = match.match(/id: '([^']+)'/);
                    if (idMatch) {
                        existingIds.add(idMatch[1]);
                    }
                });
            }

            return existingIds;
        } catch (error) {
            console.error('Error reading existing blog posts:', error.message);
            return new Set();
        }
    }

    getMarkdownFiles() {
        return fs.readdirSync(this.blogDir)
            .filter(file => file.endsWith('.md') && !['index.md', 'README.md'].includes(file))
            .map(file => ({
                filename: file,
                path: path.join(this.blogDir, file),
                lastModified: fs.statSync(path.join(this.blogDir, file)).mtime.getTime()
            }));
    }

    needsSync(fileInfo) {
        const lastSyncTime = this.lastSync[fileInfo.filename];
        const fileModifiedTime = fileInfo.lastModified;
        return !lastSyncTime || fileModifiedTime > lastSyncTime;
    }

    async syncFile(fileInfo) {
        console.log(`\n🔄 Processing ${fileInfo.filename}...`);

        try {
            // Check if file needs sync
            if (!this.needsSync(fileInfo)) {
                console.log(`⏭️  Skipping ${fileInfo.filename} (up to date)`);
                return { success: true, skipped: true };
            }

            // Convert the file
            const blogPost = this.generateBlogPost(fileInfo.path);
            if (!blogPost) {
                return { success: false, error: 'Failed to convert blog post' };
            }

            // Check if post already exists in React app
            const existingPosts = this.getExistingBlogPosts();
            if (existingPosts.has(blogPost.id)) {
                console.log(`⚠️  Blog post with ID ${blogPost.id} already exists, updating...`);
                await this.updateExistingPost(blogPost);
            } else {
                console.log(`➕ Adding new blog post: ${blogPost.title}`);
                const success = this.addToBlogTs(blogPost);
                if (!success) {
                    return { success: false, error: 'Failed to add to blog.ts' };
                }
            }

            // Update sync log
            this.lastSync[fileInfo.filename] = fileInfo.lastModified;
            this.saveSyncLog();

            return {
                success: true,
                title: blogPost.title,
                id: blogPost.id,
                action: existingPosts.has(blogPost.id) ? 'updated' : 'added'
            };

        } catch (error) {
            console.error(`❌ Error processing ${fileInfo.filename}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    async updateExistingPost(blogPost) {
        try {
            const blogContent = fs.readFileSync(this.blogPath, 'utf8');

            // Find the existing blog post by ID
            const postStartRegex = new RegExp(`\\s*id:\\s*'${blogPost.id}'`);
            const postStartMatch = blogContent.match(postStartRegex);

            if (!postStartMatch) {
                throw new Error(`Could not find existing post with ID ${blogPost.id}`);
            }

            const startIndex = postStartMatch.index;

            // Find the end of this blog post (next post or end of array)
            let endIndex = blogContent.indexOf('  },', startIndex + 1);
            if (endIndex === -1) {
                endIndex = blogContent.indexOf('];', startIndex);
            }
            endIndex += 4; // Include the closing part

            // Generate new content for this post
            const newPostContent = '  {\n' + this.convertToTypeScript(blogPost) + '\n  },';

            // Replace the old content
            const updatedContent = blogContent.slice(0, startIndex) +
                                newPostContent +
                                blogContent.slice(endIndex);

            fs.writeFileSync(this.blogPath, updatedContent);
            console.log(`✅ Updated existing blog post: ${blogPost.title}`);

        } catch (error) {
            console.error(`Error updating post:`, error.message);
            throw error;
        }
    }

    async syncAll(options = {}) {
        const { force = false, dryRun = false } = options;

        console.log('🚀 Starting blog synchronization...\n');

        if (dryRun) {
            console.log('🔍 DRY RUN MODE - No files will be modified\n');
        }

        const markdownFiles = this.getMarkdownFiles();

        if (markdownFiles.length === 0) {
            console.log('📝 No markdown files found in /blog directory');
            return { success: true, processed: 0, added: 0, updated: 0, skipped: 0 };
        }

        console.log(`📁 Found ${markdownFiles.length} markdown files\n`);

        const results = {
            processed: 0,
            added: 0,
            updated: 0,
            skipped: 0,
            errors: []
        };

        for (const fileInfo of markdownFiles) {
            // Override force setting for individual files
            const needsSync = force || this.needsSync(fileInfo);

            if (!needsSync && !force) {
                console.log(`⏭️  Skipping ${fileInfo.filename} (up to date)`);
                results.skipped++;
                continue;
            }

            if (dryRun) {
                console.log(`🔍 Would process: ${fileInfo.filename}`);
                results.processed++;
                continue;
            }

            const result = await this.syncFile(fileInfo);
            results.processed++;

            if (result.success) {
                if (result.skipped) {
                    results.skipped++;
                } else if (result.action === 'added') {
                    results.added++;
                } else if (result.action === 'updated') {
                    results.updated++;
                }
            } else {
                results.errors.push(`${fileInfo.filename}: ${result.error}`);
            }
        }

        // Print summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SYNC SUMMARY');
        console.log('='.repeat(50));
        console.log(`📁 Total files found: ${markdownFiles.length}`);
        console.log(`✅ Successfully processed: ${results.processed}`);
        console.log(`➕ New posts added: ${results.added}`);
        console.log(`🔄 Existing posts updated: ${results.updated}`);
        console.log(`⏭️  Files skipped: ${results.skipped}`);

        if (results.errors.length > 0) {
            console.log(`❌ Errors encountered: ${results.errors.length}`);
            results.errors.forEach(error => console.log(`   • ${error}`));
        }

        if (!dryRun && results.processed > 0) {
            console.log('\n💡 Tip: Run "npm run dev" to see changes in your React app');
        }

        return results;
    }

    async addSpecificFile(filename) {
        const filePath = path.join(this.blogDir, filename);

        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filename}`);
            return { success: false, error: 'File not found' };
        }

        if (!filename.endsWith('.md')) {
            console.error(`❌ File must be a markdown file (.md): ${filename}`);
            return { success: false, error: 'Not a markdown file' };
        }

        console.log(`🎯 Adding specific file: ${filename}`);

        const fileInfo = {
            filename: filename,
            path: filePath,
            lastModified: fs.statSync(filePath).mtime.getTime()
        };

        return await this.syncFile(fileInfo);
    }

    checkStatus() {
        console.log('📊 Blog Sync Status\n');

        const markdownFiles = this.getMarkdownFiles();
        const existingPosts = this.getExistingBlogPosts();

        console.log(`📁 Markdown files in /blog: ${markdownFiles.length}`);
        console.log(`📝 Blog posts in React app: ${existingPosts.size}\n`);

        console.log('📋 File Status:');
        markdownFiles.forEach(fileInfo => {
            const needsSync = this.needsSync(fileInfo);
            const status = needsSync ? '🔄 Needs sync' : '✅ Up to date';
            const lastSync = this.lastSync[fileInfo.filename];
            const lastSyncStr = lastSync ? new Date(lastSync).toLocaleString() : 'Never synced';

            console.log(`   ${fileInfo.filename.padEnd(30)} ${status.padEnd(15)} ${lastSyncStr}`);
        });
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const syncer = new BlogSyncer();

    const command = args[0] || 'sync';

    switch (command) {
        case 'sync':
            const options = {
                force: args.includes('--force'),
                dryRun: args.includes('--dry-run')
            };
            syncer.syncAll(options);
            break;

        case 'add':
            const filename = args[1];
            if (filename) {
                syncer.addSpecificFile(filename);
            } else {
                console.error('Please provide a filename: node sync-blog-to-react.js add <filename>');
            }
            break;

        case 'status':
            syncer.checkStatus();
            break;

        case 'help':
            console.log(`
Blog Sync Tool - Usage:

  node sync-blog-to-react.js [command] [options]

Commands:
  sync              Sync all markdown files (default)
  add <filename>    Add a specific markdown file
  status            Show sync status of all files
  help              Show this help message

Options:
  --force           Force sync all files, even if up to date
  --dry-run         Show what would be done without making changes

Examples:
  node sync-blog-to-react.js sync
  node sync-blog-to-react.js add my-new-post.md
  node sync-blog-to-react.js status
  node sync-blog-to-react.js sync --force
  node sync-blog-to-react.js sync --dry-run
            `);
            break;

        default:
            console.error(`Unknown command: ${command}`);
            console.log('Run "node sync-blog-to-react.js help" for usage information');
    }
}

module.exports = BlogSyncer;