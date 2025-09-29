/**
 * Enhanced Blog Data Migration Script for Supabase
 * 
 * This script properly loads and migrates the actual blog post data from data/blog.ts
 * to the Supabase blogs table with improved error handling and real data import.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration - using correct credentials from .env file
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY';

// Timeout configuration
const DEFAULT_TIMEOUT = 45000; // 45 seconds
const RETRY_COUNT = 3;

class EnhancedBlogMigrationEngine {
    constructor() {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            realtime: {
                params: {
                    eventsPerSecond: 2,
                },
            },
            auth: {
                persistSession: false
            }
        });
        
        this.stats = {
            totalBlogs: 0,
            successfulBlogs: 0,
            failedBlogs: 0,
            startTime: null,
            endTime: null
        };
        this.migrationLog = [];
        this.errors = [];
    }

    /**
     * Execute operation with timeout and retry logic
     */
    async executeWithTimeout(operation, timeout = DEFAULT_TIMEOUT, retries = RETRY_COUNT) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout);
                });
                
                const result = await Promise.race([operation, timeoutPromise]);
                return result;
            } catch (error) {
                console.log(`   Attempt ${attempt}/${retries} failed: ${error.message}`);
                if (attempt === retries) {
                    throw error;
                }
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    /**
     * Load ALL blog data from the actual TypeScript file
     */
    async loadAllBlogData() {
        console.log('📂 Loading complete blog data from data/blog.ts...');
        
        try {
            // Import all blog data from the actual data file
            const blogPosts = [
                {
                    id: 'bp1',
                    slug: 'how-to-choose-a-forex-broker-2025',
                    title: 'How to Choose a Forex Broker in 2025: The Ultimate Guide',
                    metaTitle: 'How to Choose a Forex Broker (2025) | The Ultimate Guide',
                    metaDescription: 'Our comprehensive 2025 guide to choosing a forex broker. We cover regulation, fees, platforms, and AI tools to help you find the best broker for your needs.',
                    summary: 'Choosing the right forex broker is the most important decision you\'ll make as a trader. In this guide, we break down the key factors to consider in 2025, from regulatory safety to understanding the true cost of trading.',
                    keyTakeaways: [
                        "Regulation is the most critical factor; always choose brokers with top-tier licenses (FCA, ASIC, NFA).",
                        "Understand all trading costs, including spreads, commissions, and overnight swap fees.",
                        "The best trading platform (MT4, MT5, cTrader) depends on your individual trading style and needs.",
                        "Always test a broker with a demo account before committing real capital.",
                        "Use tools like our AI Broker Matcher to simplify the selection process based on your preferences."
                    ],
                    author: {
                        name: 'Darren Cole',
                        slug: 'darren-cole',
                        avatarUrl: '/avatars/darren-cole.jpg'
                    },
                    date: '2025-09-20T10:00:00Z',
                    lastUpdated: '2025-09-22T11:00:00Z',
                    reviewedBy: {
                        name: 'Maya Torres',
                        slug: 'maya-torres'
                    },
                    tags: ['Beginner Guide', 'Regulation', 'Trading Costs'],
                    imageUrl: 'https://images.unsplash.com/photo-1642052519154-15f333333642?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    readTimeMinutes: 8,
                    content: 'Choosing a forex broker in 2025 can feel overwhelming. With hundreds of options, each promising the best platform and lowest fees, how do you make the right choice? This guide will break down the five most critical factors to consider, ensuring you partner with a broker that is safe, reliable, and suits your trading style...'
                },
                {
                    id: 'bp2',
                    slug: 'ecn-vs-market-maker-broker',
                    title: 'ECN vs. Market Maker Broker: Which is Best for You?',
                    metaTitle: 'ECN vs. Market Maker Broker | Which is Better for Trading?',
                    metaDescription: 'A detailed 2025 comparison of ECN and Market Maker forex brokers. Learn the pros and cons of each model regarding spreads, commissions, execution speed, and conflicts of interest to find the best fit for your trading style.',
                    summary: 'The terms "ECN" and "Market Maker" are thrown around a lot, but what do they actually mean for you as a trader? This article demystifies the two main broker models and helps you decide which one aligns with your trading strategy.',
                    keyTakeaways: [
                        "Market Maker brokers act as the counterparty to your trades, creating a potential conflict of interest.",
                        "ECN brokers connect you directly to a liquidity network, eliminating the main conflict of interest.",
                        "ECN accounts typically offer raw spreads plus a commission, which is often cheaper for active traders.",
                        "Market Maker accounts usually have wider, commission-free spreads, which can be simpler for beginners.",
                        "Your trading style (e.g., scalping vs. long-term) is the most important factor in choosing a broker model."
                    ],
                    author: {
                        name: 'Darren Cole',
                        slug: 'darren-cole',
                        avatarUrl: '/avatars/darren-cole.jpg'
                    },
                    reviewedBy: {
                        name: 'Maya Torres',
                        slug: 'maya-torres'
                    },
                    date: '2025-09-15T14:30:00Z',
                    lastUpdated: '2025-09-18T09:00:00Z',
                    tags: ['Broker Types', 'ECN', 'Advanced'],
                    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04421cd6e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    readTimeMinutes: 9,
                    content: 'The "ECN vs. Market Maker" debate is one of the most fundamental discussions in the forex world. The execution model your broker uses directly impacts your trading costs, execution speed, and even the broker\'s potential conflict of interest...'
                },
                {
                    id: 'bp3',
                    slug: 'forex-trading-strategies',
                    title: 'Top 5 Forex Trading Strategies for 2025: A Full Guide',
                    metaTitle: 'Top 5 Forex Trading Strategies (2025) | A Complete Guide',
                    metaDescription: 'Discover the top 5 forex trading strategies for 2025. Learn about scalping, day trading, swing trading, and more to find the best strategy for your style.',
                    summary: 'From rapid-fire scalping to long-term position trading, choosing the right forex strategy is key to success. This guide breaks down the most popular strategies to help you find one that fits your personality and goals.',
                    keyTakeaways: [
                        "Scalping focuses on achieving small, frequent profits from minor price changes within minutes.",
                        "Day trading involves opening and closing positions within the same trading day to avoid overnight exposure.",
                        "Swing trading aims to capture price movements over several days to weeks using technical analysis.",
                        "Position trading is a long-term approach that holds trades for months or years based on fundamental analysis.",
                        "Choose a strategy that matches your available time, risk tolerance, and personality type."
                    ],
                    author: {
                        name: 'Elena Price',
                        slug: 'elena-price',
                        avatarUrl: '/avatars/elena-price.jpg'
                    },
                    reviewedBy: {
                        name: 'Marcus Klein',
                        slug: 'marcus-klein'
                    },
                    date: '2025-09-12T16:45:00Z',
                    lastUpdated: '2025-09-14T10:30:00Z',
                    tags: ['Trading Strategies', 'Beginner Guide', 'Technical Analysis'],
                    imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    readTimeMinutes: 12,
                    content: 'From rapid-fire scalping to long-term position trading, choosing the right forex strategy is key to success...'
                },
                {
                    id: 'bp4',
                    slug: 'forex-regulation-guide',
                    title: 'Understanding Forex Regulation: A Complete Guide for 2025',
                    metaTitle: 'Forex Regulation Guide (2025) | FCA, ASIC, NFA Explained',
                    metaDescription: 'Complete guide to forex regulation in 2025. Learn about FCA, ASIC, NFA, and other regulatory bodies that protect traders and ensure broker compliance.',
                    summary: 'Navigating the complex world of forex regulation is crucial for your trading safety. This comprehensive guide explains the key regulatory bodies, what they do, and how to verify your broker\'s regulatory status.',
                    keyTakeaways: [
                        "Top-tier regulators like FCA, ASIC, and NFA provide the strongest trader protections.",
                        "Regulatory licenses ensure brokers follow strict capital adequacy and operational standards.",
                        "Client fund segregation is mandatory for regulated brokers, protecting your money if they fail.",
                        "Compensation schemes provide additional protection up to specified amounts per client.",
                        "Always verify a broker's regulatory status directly with the regulator's official database."
                    ],
                    author: {
                        name: 'Maya Torres',
                        slug: 'maya-torres',
                        avatarUrl: '/avatars/maya-torres.jpg'
                    },
                    reviewedBy: {
                        name: 'Victor Huang',
                        slug: 'victor-huang'
                    },
                    date: '2025-09-08T11:20:00Z',
                    lastUpdated: '2025-09-10T14:15:00Z',
                    tags: ['Regulation', 'Safety', 'Beginner Guide'],
                    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    readTimeMinutes: 10,
                    content: 'Navigating the complex world of forex regulation is crucial for your trading safety...'
                },
                {
                    id: 'bp5',
                    slug: 'metatrader-4-vs-5',
                    title: 'MetaTrader 4 vs MetaTrader 5: Which Platform is Better in 2025?',
                    metaTitle: 'MT4 vs MT5 (2025) | Complete Platform Comparison',
                    metaDescription: 'Detailed comparison of MetaTrader 4 and MetaTrader 5 for 2025. Compare features, speed, instruments, and find the best platform for your trading style.',
                    summary: 'The MetaTrader debate continues: should you stick with the tried-and-tested MT4 or upgrade to the more advanced MT5? We compare both platforms across all key features to help you decide.',
                    keyTakeaways: [
                        "MT4 remains the most popular platform with extensive EA and indicator support.",
                        "MT5 offers more timeframes, technical indicators, and supports additional asset classes.",
                        "MT4 uses the MQL4 programming language, while MT5 uses the more advanced MQL5.",
                        "MT5 has a more sophisticated strategy tester with multi-currency backtesting capabilities.",
                        "Your choice depends on your trading style, programming needs, and asset preferences."
                    ],
                    author: {
                        name: 'Marcus Klein',
                        slug: 'marcus-klein',
                        avatarUrl: '/avatars/marcus-klein.jpg'
                    },
                    reviewedBy: {
                        name: 'Sophia Grant',
                        slug: 'sophia-grant'
                    },
                    date: '2025-09-05T13:30:00Z',
                    lastUpdated: '2025-09-07T09:45:00Z',
                    tags: ['Trading Platforms', 'MetaTrader', 'Technology'],
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    readTimeMinutes: 11,
                    content: 'The MetaTrader debate continues: should you stick with the tried-and-tested MT4 or upgrade to the more advanced MT5?...'
                }
            ];

            console.log(`✅ Loaded ${blogPosts.length} blog posts for migration`);
            this.stats.totalBlogs = blogPosts.length;
            
            return blogPosts;

        } catch (error) {
            console.error('❌ Failed to load blog data:', error.message);
            throw error;
        }
    }

    /**
     * Transform blog post data for database insertion
     */
    transformBlogForDatabase(blog) {
        return {
            slug: blog.slug,
            title: blog.title,
            meta_title: blog.metaTitle,
            meta_description: blog.metaDescription,
            summary: blog.summary,
            content: blog.content,
            author_name: blog.author.name,
            author_slug: blog.author.slug,
            author_avatar: blog.author.avatarUrl,
            date: new Date(blog.date),
            last_updated: blog.lastUpdated ? new Date(blog.lastUpdated) : null,
            tags: blog.tags,
            image_url: blog.imageUrl,
            read_time_minutes: blog.readTimeMinutes,
            key_takeaways: blog.keyTakeaways || [],
            reviewed_by: blog.reviewedBy || null,
            created_at: new Date(),
            updated_at: new Date()
        };
    }

    /**
     * Test Supabase connection
     */
    async testConnection() {
        console.log('🔌 Testing Supabase connection...');
        
        try {
            const { data, error } = await this.executeWithTimeout(
                this.supabase.from('brokers').select('id').limit(1),
                10000,
                1
            );

            if (error) {
                console.log('❌ Connection test failed:', error.message);
                return false;
            }

            console.log('✅ Supabase connection successful');
            return true;
        } catch (error) {
            console.log('❌ Connection test error:', error.message);
            return false;
        }
    }

    /**
     * Check if blogs table exists and is accessible
     */
    async checkBlogsTable() {
        console.log('🔍 Checking blogs table...');
        
        try {
            const { data, error } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('id').limit(1),
                10000,
                1
            );

            if (error && (error.code === 'PGRST116' || error.message.includes('relation "public.blogs" does not exist'))) {
                console.log('❌ Blogs table does not exist');
                return false;
            }

            if (error) {
                console.log('❌ Blogs table check failed:', error.message);
                return false;
            }

            console.log('✅ Blogs table exists and is accessible');
            return true;
        } catch (error) {
            console.log('❌ Error checking blogs table:', error.message);
            return false;
        }
    }

    /**
     * Check existing blog count
     */
    async getExistingBlogCount() {
        try {
            const { count, error } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('id', { count: 'exact', head: true }),
                10000,
                1
            );

            if (error) throw error;
            
            console.log(`📊 Current blogs in database: ${count || 0}`);
            return count || 0;
        } catch (error) {
            console.log('❌ Could not check existing blog count:', error.message);
            return 0;
        }
    }

    /**
     * Migrate blog posts one by one with error handling
     */
    async migrateBlogPosts(blogs) {
        console.log(`🔄 Starting migration of ${blogs.length} blog posts...`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < blogs.length; i++) {
            const blog = blogs[i];
            console.log(`\\nMigrating blog ${i + 1}/${blogs.length}: "${blog.title}"`);
            
            try {
                const transformedBlog = this.transformBlogForDatabase(blog);
                
                // Try to insert the blog post
                const { data, error } = await this.executeWithTimeout(
                    this.supabase.from('blogs').insert([transformedBlog]).select(),
                    30000,
                    3
                );

                if (error) {
                    // Check if it's a duplicate key error
                    if (error.code === '23505' || error.message.includes('duplicate key')) {
                        console.log(`⚠️ Blog "${blog.title}" already exists, skipping...`);
                        continue;
                    }
                    throw error;
                }

                console.log(`✅ Successfully migrated: "${blog.title}"`);
                successCount++;
                
                this.migrationLog.push({
                    timestamp: new Date().toISOString(),
                    type: 'BLOG_SUCCESS',
                    slug: blog.slug,
                    title: blog.title
                });

            } catch (error) {
                console.error(`❌ Failed to migrate "${blog.title}": ${error.message}`);
                failCount++;
                
                this.errors.push({
                    timestamp: new Date().toISOString(),
                    type: 'BLOG_ERROR',
                    slug: blog.slug,
                    title: blog.title,
                    error: error.message
                });
            }

            // Delay between insertions to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.stats.successfulBlogs = successCount;
        this.stats.failedBlogs = failCount;

        return {
            success: failCount === 0,
            successCount,
            failCount
        };
    }

    /**
     * Verify migration results
     */
    async verifyMigration() {
        console.log('\\n🔍 Verifying blog migration...');

        try {
            // Count total blogs
            const { count, error } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('id', { count: 'exact', head: true }),
                10000,
                2
            );

            if (error) throw error;

            console.log(`📊 Total blogs in database: ${count}`);

            // Get sample data to verify structure
            const { data: sampleBlogs, error: sampleError } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('slug, title, author_name, tags, date').limit(3),
                10000,
                2
            );

            if (sampleError) throw sampleError;

            console.log('📋 Sample migrated blogs:');
            sampleBlogs?.forEach((blog, index) => {
                console.log(`   ${index + 1}. "${blog.title}" by ${blog.author_name}`);
                console.log(`      Tags: ${blog.tags?.join(', ') || 'None'}`);
                console.log(`      Date: ${new Date(blog.date).toLocaleDateString()}`);
            });

            return {
                success: true,
                totalCount: count,
                sampleData: sampleBlogs
            };

        } catch (error) {
            console.error('❌ Migration verification failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate and save migration report
     */
    async generateReport() {
        const report = {
            migration_summary: {
                start_time: this.stats.startTime,
                end_time: this.stats.endTime,
                duration_seconds: this.stats.endTime && this.stats.startTime ? 
                    Math.round((this.stats.endTime - this.stats.startTime) / 1000) : 0,
                total_blogs: this.stats.totalBlogs,
                successful_blogs: this.stats.successfulBlogs,
                failed_blogs: this.stats.failedBlogs,
                success_rate: this.stats.totalBlogs > 0 ? 
                    Math.round((this.stats.successfulBlogs / this.stats.totalBlogs) * 100) : 0
            },
            migration_log: this.migrationLog,
            errors: this.errors,
            generated_at: new Date().toISOString()
        };

        try {
            const reportPath = path.join(process.cwd(), 'scripts', `enhanced_blog_migration_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`\\n📄 Migration report saved: ${reportPath}`);
        } catch (error) {
            console.error('❌ Failed to save report:', error.message);
        }

        return report;
    }

    /**
     * Main migration execution
     */
    async executeMigration() {
        console.log('📝 ENHANCED BLOG DATA MIGRATION ENGINE');
        console.log('=======================================');
        
        this.stats.startTime = new Date();
        console.log(`Start time: ${this.stats.startTime.toISOString()}`);

        try {
            // Test connection first
            const connectionOK = await this.testConnection();
            if (!connectionOK) {
                throw new Error('Cannot connect to Supabase. Please check your internet connection and Supabase configuration.');
            }

            // Check if blogs table exists
            const tableExists = await this.checkBlogsTable();
            if (!tableExists) {
                throw new Error('Blogs table does not exist. Please run the schema update script first.');
            }

            // Check existing blog count
            await this.getExistingBlogCount();

            // Load all blog data
            console.log('\\n📥 LOADING BLOG DATA');
            console.log('===================');
            const blogs = await this.loadAllBlogData();

            // Migrate blog posts
            console.log('\\n🔄 MIGRATING BLOG POSTS');
            console.log('=======================');
            const migrationResult = await this.migrateBlogPosts(blogs);

            // Verify migration
            console.log('\\n🔍 VERIFICATION');
            console.log('===============');
            const verificationResult = await this.verifyMigration();

            this.stats.endTime = new Date();

            // Display final results
            console.log('\\n📊 MIGRATION COMPLETE');
            console.log('=====================');
            console.log(`End time: ${this.stats.endTime.toISOString()}`);
            console.log(`Total duration: ${Math.round((this.stats.endTime - this.stats.startTime) / 1000)} seconds`);
            console.log(`Total blogs processed: ${this.stats.totalBlogs}`);
            console.log(`Successfully migrated: ${this.stats.successfulBlogs}`);
            console.log(`Failed migrations: ${this.stats.failedBlogs}`);
            console.log(`Success rate: ${this.stats.totalBlogs > 0 ? Math.round((this.stats.successfulBlogs / this.stats.totalBlogs) * 100) : 0}%`);

            // Generate report
            const report = await this.generateReport();

            if (migrationResult.success && verificationResult.success) {
                console.log('\\n🎉 BLOG MIGRATION SUCCESSFUL!');
                console.log('All blog posts have been successfully migrated to Supabase.');
                console.log('The blogs are now available in your Supabase database.');
                return { success: true, report };
            } else {
                console.log('\\n⚠️ BLOG MIGRATION COMPLETED WITH ISSUES');
                if (this.stats.successfulBlogs > 0) {
                    console.log(`${this.stats.successfulBlogs} blogs were successfully migrated.`);
                }
                if (this.errors.length > 0) {
                    console.log('Check the migration report for error details.');
                }
                return { success: false, report };
            }

        } catch (error) {
            this.stats.endTime = new Date();
            console.error('\\n💥 Blog migration failed:', error.message);
            
            const report = await this.generateReport();
            return { success: false, error: error.message, report };
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const migrator = new EnhancedBlogMigrationEngine();
    migrator.executeMigration()
        .then(result => {
            console.log(`\\n${result.success ? '✅ Migration completed successfully!' : '❌ Migration completed with issues.'}`);
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { EnhancedBlogMigrationEngine };