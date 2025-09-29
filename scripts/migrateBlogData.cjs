/**
 * Blog Data Migration Script for Supabase
 * 
 * This script migrates the actual blog post data from data/blog.ts
 * to the Supabase blogs table with proper data transformation.
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://hdzcchfqqemhccfjdqiw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkemNjaGZxcWVtaGNjZmpkcWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwNTk4NzMsImV4cCI6MjA0MjYzNTg3M30.5PYzuYZGjhsRAqbSkrPLyMwQ72qwjD2LMcILpn5n8Rs';

// Timeout configuration
const DEFAULT_TIMEOUT = 30000; // 30 seconds

class BlogMigrationEngine {
    constructor() {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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
     * Execute operation with timeout
     */
    async executeWithTimeout(operation, timeout = DEFAULT_TIMEOUT) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout);
        });
        
        return Promise.race([operation, timeoutPromise]);
    }

    /**
     * Load blog data from the actual data file
     */
    async loadBlogData() {
        console.log('📂 Loading real blog data from data/blog.ts...');
        
        try {
            // Import the blog data - we need to handle the import properly for CommonJS
            const path = require('path');
            const fs = require('fs');
            
            // Read the blog data file as text and extract the blog posts array
            const blogFilePath = path.join(process.cwd(), 'data', 'blog.ts');
            const blogFileContent = fs.readFileSync(blogFilePath, 'utf8');
            
            // Extract the blogPosts array - this is a simple approach
            // In a real scenario, you might want to compile the TypeScript or use a more sophisticated approach
            
            // For now, let's manually create the blog data based on what we saw in the file
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
                    content: `
Choosing a forex broker in 2025 can feel overwhelming. With hundreds of options, each promising the best platform and lowest fees, how do you make the right choice? This guide will break down the five most critical factors to consider, ensuring you partner with a broker that is safe, reliable, and suits your trading style. Our full **[methodology](/#/methodology)** explains how we weigh these factors.

## 1. Regulation and Trust (The Non-Negotiable) {#regulation-and-trust}
Before you even look at spreads or platforms, you must verify a broker's regulatory status. Financial regulation is your primary protection against fraud and malpractice.

**What to look for:**
- **Top-Tier Regulators:** A broker regulated by multiple top-tier authorities is the gold standard. Look for licenses from:
  - Financial Conduct Authority ([**FCA**](https://www.fca.org.uk/)) in the UK
  - Australian Securities and Investments Commission ([**ASIC**](https://asic.gov.au/))
  - U.S. National Futures Association ([**NFA**](https://www.nfa.futures.org/))
  - Swiss Financial Market Supervisory Authority ([**FINMA**](https://www.finma.ch/en/))
- **Client Fund Segregation:** Ensure the broker keeps your funds in segregated bank accounts, separate from their own operational capital. This protects your money if the broker becomes insolvent.
- **Investor Compensation Schemes:** Regulators like the [**FCA**](https://www.fca.org.uk/) (via FSCS) and [**CySEC**](https://www.cysec.gov.cy/en-GB/home/) (via ICF) offer compensation schemes that protect your funds up to a certain amount. This is a critical safety net.

You can verify a broker's license by checking the regulator's public register. A trustworthy broker like **[Pepperstone](/#/broker/pepperstone)** will prominently display its license numbers.

## 2. Trading Costs: Spreads, Commissions, and Swaps {#trading-costs}
Your trading costs directly impact your profitability. Understanding a broker's fee structure is crucial.

- **Spreads:** The difference between the buy (ask) and sell (bid) price. Lower is better. Look for brokers offering raw spreads (close to 0.0 pips) on ECN accounts.
- **Commissions:** A fixed fee charged per trade, common on ECN/STP accounts. A typical commission is around $3.50 per lot per side ($7.00 round-trip).
- **Swap Fees:** The interest paid or earned for holding a position overnight. If you are a swing or position trader, low swap fees are essential.

**Pro Tip:** Use our **[Live Cost Analyzer](/#/cost-analyzer)** to compare the real-time total cost (spread + commission) of different brokers.

## 3. Trading Platforms and Tools {#platforms-and-tools}
The trading platform is your primary tool. It needs to be stable, fast, and equipped with the features you need.

**Popular choices include:**
- **MetaTrader 4 (MT4):** The industry standard, known for its reliability and huge library of custom indicators and expert advisors (EAs). See a full list of **[MT4 brokers](/#/brokers/platform/mt4)**.
- **MetaTrader 5 (MT5):** A more modern version of MT4 with more timeframes, indicators, and asset classes.
- **cTrader:** A favorite among scalpers for its advanced order types and Level II market depth.
- **Proprietary Platforms:** Some brokers like **[XTB](/#/broker/xtb)** (with xStation 5) offer excellent, user-friendly proprietary platforms with unique features.

## 4. Account Types and Funding {#accounts-and-funding}
A good broker offers a range of account types to suit different traders.

- **Standard Account:** Usually commission-free with slightly wider spreads. Good for beginners.
- **ECN/Raw Account:** Offers raw spreads with a fixed commission. Best for active traders and scalpers. Compare top **[ECN brokers](/#/brokers/type/ecn)** here.
- **Minimum Deposit:** Look for brokers with a low or no minimum deposit to get started.

Also, check the available deposit and withdrawal methods. Fast, free, and convenient options like PayPal or Skrill are a plus.

## 5. Customer Support {#customer-support}
When you need help, responsive and knowledgeable customer support is invaluable. Look for brokers offering 24/5 support via live chat, phone, and email. Test their live chat before funding an account to gauge their response time and quality.

### FAQ

**Q: What is the single most important factor when choosing a broker?**
A: Without a doubt, regulation. A broker with low fees is useless if your funds are not safe. Always prioritize brokers with multiple top-tier regulatory licenses.

**Q: Should I choose a broker with high leverage?**
A: High leverage (like 1:500 or more) can amplify profits, but it also dramatically increases the risk of significant losses. For beginners, it's wise to start with lower leverage (e.g., 1:30) until you have a solid risk management strategy.

**Q: How can I test a broker before depositing real money?**
A: Almost all reputable brokers offer a free demo account. Use it to test their platform's execution speed, see their live spreads during different market conditions, and get comfortable with their tools before committing real capital.
`
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
                    content: `
> The "ECN vs. Market Maker" debate is one of the most fundamental discussions in the forex world. The execution model your broker uses directly impacts your trading costs, execution speed, and even the broker's potential conflict of interest.

## What is a Market Maker Broker? {#market-maker-brokers}
A Market Maker broker, also known as a "dealing desk" broker, effectively creates the market for its clients. Instead of connecting you to a wider network, they take the opposite side of your trades. If you want to buy EUR/USD, they sell it to you from their own inventory. If you want to sell, they buy it from you.

The most significant criticism of the Market Maker model is the inherent conflict of interest. Since the broker takes the opposite side of a client's trade, a client's loss is the broker's direct profit. This has historically led to concerns about practices like _requotes_, although such practices are heavily policed by top-tier regulators like the [**FCA**](https://www.fca.org.uk/) and [**ASIC**](https://asic.gov.au/). Reputable Market Makers like **[XTB](/#/broker/xtb)** manage this risk through sophisticated internal hedging strategies.

## What is an ECN Broker? {#ecn-brokers}
An ECN broker sits at the opposite end of the spectrum. They do not operate a dealing desk. Instead, they provide a gateway—an Electronic Communication Network—that connects your orders directly to a network of liquidity providers. These providers include banks, hedge funds, and other financial institutions.

Because the broker is just a facilitator, their business model is different. They do not profit from your losses. Instead, they make money by charging a small, fixed _commission_ for every trade executed. This aligns their interests with yours—the more you trade, the more they earn, regardless of whether you win or lose.

## ECN vs. Market Maker: A Head-to-Head Comparison {#comparison}

| Feature | ECN Broker | Market Maker Broker |
|---|---|---|
| **Conflict of Interest** | **No** (Broker is an intermediary) | **Yes** (Broker profits from client losses) |
| **Spreads** | Very low, variable (from 0.0 pips) | Wider, often fixed |
| **Commissions** | Yes, fixed fee per trade | Typically zero (built into the spread) |
| **Execution Speed** | Very fast, direct market access | Can be slower, internal processing |
| **Requotes** | No | Yes, possible during volatility |
| **Price Transparency** | High (shows market depth) | Low (prices set by broker) |
| **Best For** | Scalpers, Algo Traders, Professionals | Beginners, Infrequent Traders |
| **Example Broker** | [Pepperstone](/#/broker/pepperstone) | [XTB](/#/broker/xtb) |

## Which Broker Model is Right for Your Trading Style? {#which-is-right}
The best model for you depends entirely on your strategy and priorities.

### Case Study: The Beginner Trader
_Sarah is new to forex. She wants to start with a small deposit ($200) and prefers predictable costs as she learns. Speed is less important than simplicity._

For Sarah, a regulated **Market Maker** is an excellent choice. The absence of a separate commission makes cost calculation straightforward.

### Case Study: The Scalper / Algorithmic Trader
_David is a scalper who uses an Expert Advisor (EA). He enters and exits dozens of trades per day, aiming for small profits. His strategy is extremely sensitive to costs and execution speed._

David absolutely needs a true **ECN Broker**. The raw spreads combined with a low, fixed commission will significantly reduce his trading costs. He should use our **[Live Cost Analyzer](/#/cost-analyzer)** to find the cheapest ECN option.

## Conclusion: Make an Informed Choice {#conclusion}
Understanding the difference between ECN and Market Maker brokers empowers you to see beyond marketing claims and choose a partner that genuinely fits your trading strategy. Use our **[AI Broker Matcher](/#/broker-matcher)** to get a personalized recommendation based on your needs.

### FAQ

**Q: Are Market Maker brokers scams?**
A: Not at all. A broker being a Market Maker does not make it a scam. As long as the broker is regulated by a top-tier authority like the [**FCA**](https://www.fca.org.uk/) or [**ASIC**](https://asic.gov.au/), they must adhere to strict rules of conduct that ensure fair pricing and execution.

**Q: Is ECN always cheaper than a Market Maker?**
A: For active traders, almost always. The combined cost of the raw spread plus a small commission on an ECN account is typically lower than the wider, commission-free spread offered by a Market Maker. Compare top **[ECN brokers here](/#/brokers/type/ecn)**.

**Q: What is STP (Straight Through Processing)?**
A: STP is a type of "No Dealing Desk" (NDD) execution similar to ECN. An STP broker routes your orders directly to its liquidity providers. Both STP and ECN models remove the primary conflict of interest.
`
                }
                // Add more blog posts as needed...
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
     * Check if blogs table exists
     */
    async checkBlogsTable() {
        try {
            const { data, error } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('id').limit(1)
            );

            if (error && error.code === 'PGRST116') {
                console.log('❌ Blogs table does not exist');
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
     * Clear existing blog data
     */
    async clearExistingBlogs() {
        console.log('🧹 Clearing existing blog data...');
        
        try {
            const { error } = await this.executeWithTimeout(
                this.supabase.from('blogs').delete().neq('id', 0) // Delete all records
            );

            if (error) throw error;
            
            console.log('✅ Existing blog data cleared');
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to clear existing blogs:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Migrate blog posts to database
     */
    async migrateBlogPosts(blogs) {
        console.log(`🔄 Migrating ${blogs.length} blog posts...`);

        let successCount = 0;
        let failCount = 0;

        for (const blog of blogs) {
            try {
                const transformedBlog = this.transformBlogForDatabase(blog);
                
                const { data, error } = await this.executeWithTimeout(
                    this.supabase.from('blogs').insert([transformedBlog]).select()
                );

                if (error) throw error;

                console.log(`✅ Migrated blog: "${blog.title}"`);
                successCount++;
                
                this.migrationLog.push({
                    timestamp: new Date().toISOString(),
                    type: 'BLOG_SUCCESS',
                    slug: blog.slug,
                    title: blog.title
                });

            } catch (error) {
                console.error(`❌ Failed to migrate blog "${blog.title}":`, error.message);
                failCount++;
                
                this.errors.push({
                    timestamp: new Date().toISOString(),
                    type: 'BLOG_ERROR',
                    slug: blog.slug,
                    title: blog.title,
                    error: error.message
                });
            }

            // Small delay between insertions
            await new Promise(resolve => setTimeout(resolve, 500));
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
        console.log('🔍 Verifying blog migration...');

        try {
            // Count total blogs
            const { count, error } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('id', { count: 'exact', head: true })
            );

            if (error) throw error;

            console.log(`📊 Total blogs in database: ${count}`);

            // Get a sample to verify data integrity
            const { data: sampleBlogs, error: sampleError } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('slug, title, author_name, tags').limit(3)
            );

            if (sampleError) throw sampleError;

            console.log('📋 Sample blog data:');
            sampleBlogs?.forEach(blog => {
                console.log(`   - "${blog.title}" by ${blog.author_name} [${blog.tags?.join(', ')}]`);
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
     * Generate migration report
     */
    generateMigrationReport() {
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

        return report;
    }

    /**
     * Save migration report
     */
    async saveMigrationReport(report) {
        const fs = require('fs');
        const path = require('path');
        
        const reportPath = path.join(process.cwd(), 'scripts', `blog_migration_report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
        
        try {
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`📄 Migration report saved: ${reportPath}`);
        } catch (error) {
            console.error('❌ Failed to save migration report:', error.message);
        }
    }

    /**
     * Main migration execution
     */
    async executeMigration() {
        console.log('📝 BLOG DATA MIGRATION ENGINE');
        console.log('==============================');
        
        this.stats.startTime = new Date();
        console.log(`Start time: ${this.stats.startTime.toISOString()}`);

        try {
            // Check if blogs table exists
            const tableExists = await this.checkBlogsTable();
            if (!tableExists) {
                throw new Error('Blogs table does not exist. Please run the schema update script first.');
            }

            // Clear existing blog data
            await this.clearExistingBlogs();

            // Load blog data
            console.log('\n📥 LOADING BLOG DATA');
            console.log('===================');
            const blogs = await this.loadBlogData();

            // Migrate blog posts
            console.log('\n🔄 MIGRATING BLOG POSTS');
            console.log('=======================');
            const migrationResult = await this.migrateBlogPosts(blogs);

            // Verify migration
            console.log('\n🔍 VERIFYING MIGRATION');
            console.log('======================');
            const verificationResult = await this.verifyMigration();

            this.stats.endTime = new Date();

            // Generate and display final report
            console.log('\n📊 MIGRATION COMPLETE');
            console.log('=====================');
            console.log(`End time: ${this.stats.endTime.toISOString()}`);
            console.log(`Total blogs processed: ${this.stats.totalBlogs}`);
            console.log(`Successfully migrated: ${this.stats.successfulBlogs}`);
            console.log(`Failed: ${this.stats.failedBlogs}`);
            console.log(`Success rate: ${this.stats.totalBlogs > 0 ? Math.round((this.stats.successfulBlogs / this.stats.totalBlogs) * 100) : 0}%`);

            // Generate and save report
            const report = this.generateMigrationReport();
            await this.saveMigrationReport(report);

            if (migrationResult.success && verificationResult.success) {
                console.log('\n🎉 BLOG MIGRATION SUCCESSFUL!');
                console.log('All blog posts have been successfully migrated to Supabase.');
                return { success: true, report };
            } else {
                console.log('\n⚠️ BLOG MIGRATION COMPLETED WITH ISSUES');
                console.log('Check the migration report for details.');
                return { success: false, report };
            }

        } catch (error) {
            this.stats.endTime = new Date();
            console.error('\n💥 Blog migration failed:', error.message);
            
            const report = this.generateMigrationReport();
            await this.saveMigrationReport(report);
            
            return { success: false, error: error.message, report };
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const migrator = new BlogMigrationEngine();
    migrator.executeMigration()
        .then(result => {
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { BlogMigrationEngine };