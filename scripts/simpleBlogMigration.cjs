/**
 * Simple Blog Migration Script
 * 
 * Attempts to migrate blogs directly without table checks
 */

const { createClient } = require('@supabase/supabase-js');

// Correct Supabase credentials
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const blogPosts = [
    {
        slug: 'how-to-choose-a-forex-broker-2025',
        title: 'How to Choose a Forex Broker in 2025: The Ultimate Guide',
        meta_title: 'How to Choose a Forex Broker (2025) | The Ultimate Guide',
        meta_description: 'Our comprehensive 2025 guide to choosing a forex broker. We cover regulation, fees, platforms, and AI tools to help you find the best broker for your needs.',
        summary: 'Choosing the right forex broker is the most important decision you\'ll make as a trader. In this guide, we break down the key factors to consider in 2025, from regulatory safety to understanding the true cost of trading.',
        content: 'Choosing a forex broker in 2025 can feel overwhelming. With hundreds of options, each promising the best platform and lowest fees, how do you make the right choice? This guide will break down the five most critical factors to consider, ensuring you partner with a broker that is safe, reliable, and suits your trading style.',
        author_name: 'Darren Cole',
        author_slug: 'darren-cole',
        author_avatar: '/avatars/darren-cole.jpg',
        date: new Date('2025-09-20T10:00:00Z'),
        last_updated: new Date('2025-09-22T11:00:00Z'),
        tags: ['Beginner Guide', 'Regulation', 'Trading Costs'],
        image_url: 'https://images.unsplash.com/photo-1642052519154-15f333333642?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        read_time_minutes: 8,
        key_takeaways: [
            "Regulation is the most critical factor; always choose brokers with top-tier licenses (FCA, ASIC, NFA).",
            "Understand all trading costs, including spreads, commissions, and overnight swap fees.",
            "The best trading platform (MT4, MT5, cTrader) depends on your individual trading style and needs.",
            "Always test a broker with a demo account before committing real capital.",
            "Use tools like our AI Broker Matcher to simplify the selection process based on your preferences."
        ],
        reviewed_by: {
            name: 'Maya Torres',
            slug: 'maya-torres'
        }
    },
    {
        slug: 'ecn-vs-market-maker-broker',
        title: 'ECN vs. Market Maker Broker: Which is Best for You?',
        meta_title: 'ECN vs. Market Maker Broker | Which is Better for Trading?',
        meta_description: 'A detailed 2025 comparison of ECN and Market Maker forex brokers. Learn the pros and cons of each model regarding spreads, commissions, execution speed, and conflicts of interest to find the best fit for your trading style.',
        summary: 'The terms "ECN" and "Market Maker" are thrown around a lot, but what do they actually mean for you as a trader? This article demystifies the two main broker models and helps you decide which one aligns with your trading strategy.',
        content: 'The "ECN vs. Market Maker" debate is one of the most fundamental discussions in the forex world. The execution model your broker uses directly impacts your trading costs, execution speed, and even the broker\'s potential conflict of interest.',
        author_name: 'Darren Cole',
        author_slug: 'darren-cole', 
        author_avatar: '/avatars/darren-cole.jpg',
        date: new Date('2025-09-15T14:30:00Z'),
        last_updated: new Date('2025-09-18T09:00:00Z'),
        tags: ['Broker Types', 'ECN', 'Advanced'],
        image_url: 'https://images.unsplash.com/photo-1554224155-8d04421cd6e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        read_time_minutes: 9,
        key_takeaways: [
            "Market Maker brokers act as the counterparty to your trades, creating a potential conflict of interest.",
            "ECN brokers connect you directly to a liquidity network, eliminating the main conflict of interest.",
            "ECN accounts typically offer raw spreads plus a commission, which is often cheaper for active traders.",
            "Market Maker accounts usually have wider, commission-free spreads, which can be simpler for beginners.",
            "Your trading style (e.g., scalping vs. long-term) is the most important factor in choosing a broker model."
        ],
        reviewed_by: {
            name: 'Maya Torres',
            slug: 'maya-torres'
        }
    }
];

async function migrateBlogs() {
    console.log('🚀 SIMPLE BLOG MIGRATION');
    console.log('========================');
    console.log(`Starting migration of ${blogPosts.length} blog posts...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < blogPosts.length; i++) {
        const blog = blogPosts[i];
        console.log(`\nMigrating blog ${i + 1}/${blogPosts.length}: "${blog.title}"`);

        try {
            const { data, error } = await supabase
                .from('blogs')
                .insert([blog])
                .select();

            if (error) {
                console.error(`❌ Failed: ${error.message}`);
                failCount++;
            } else {
                console.log(`✅ Success: Blog migrated with ID ${data[0]?.id}`);
                successCount++;
            }
        } catch (error) {
            console.error(`❌ Exception: ${error.message}`);
            failCount++;
        }

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n📊 MIGRATION SUMMARY`);
    console.log(`====================`);
    console.log(`Total processed: ${blogPosts.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Success rate: ${Math.round((successCount / blogPosts.length) * 100)}%`);

    if (successCount > 0) {
        console.log(`\n🎉 ${successCount} blogs successfully migrated!`);
        
        // Verify by querying
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('slug, title, author_name')
                .limit(5);

            if (error) {
                console.log(`❌ Verification failed: ${error.message}`);
            } else {
                console.log(`\n📋 Verification - Sample migrated blogs:`);
                data?.forEach((blog, index) => {
                    console.log(`   ${index + 1}. "${blog.title}" by ${blog.author_name}`);
                });
            }
        } catch (error) {
            console.log(`❌ Verification error: ${error.message}`);
        }
    }

    return successCount === blogPosts.length;
}

// Run migration
migrateBlogs()
    .then(success => {
        if (success) {
            console.log('\n✅ Blog migration completed successfully!');
            process.exit(0);
        } else {
            console.log('\n⚠️ Blog migration completed with some failures.');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    });