import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// All broker categories from the requirements
const CATEGORIES = [
  // General Broker Types
  {
    slug: 'top-online-trading-brokers',
    name: 'Top 10 Online Trading Brokers',
    description: 'Best overall online trading platforms offering comprehensive trading services across multiple asset classes.',
    category_type: 'broker_type',
    meta_title: 'Best Online Trading Brokers — Top 10 Trading Platforms 2025 | BrokerAnalysis',
    meta_description: 'Discover the top 10 online trading brokers in 2025. Compare fees, platforms, and features. Expert reviews of the best trading platforms.',
    keywords: ['online trading brokers', 'trading platforms', 'best brokers 2025', 'online trading'],
    sort_order: 1
  },
  {
    slug: 'top-cfd-brokers-platforms',
    name: 'Top 10 CFD Brokers & Platforms',
    description: 'Leading CFD (Contract for Difference) brokers with tight spreads, advanced platforms, and comprehensive asset coverage.',
    category_type: 'broker_type',
    meta_title: 'Best CFD Brokers — Top 10 CFD Trading Platforms 2025 | BrokerAnalysis',
    meta_description: 'Find the best CFD brokers in 2025. Compare spreads, leverage, and platforms. Expert analysis of top CFD trading services.',
    keywords: ['CFD brokers', 'contract for difference', 'CFD trading platforms', 'best CFD brokers'],
    sort_order: 2
  },
  {
    slug: 'top-forex-brokers',
    name: 'Top 10 Forex Brokers',
    description: 'Premier forex brokers offering competitive spreads, reliable execution, and comprehensive currency pair coverage.',
    category_type: 'broker_type',
    meta_title: 'Best Forex Brokers — Top 10 Forex Trading 2025 | BrokerAnalysis',
    meta_description: 'Top forex brokers in 2025 with tight spreads, regulation, and advanced platforms. Compare the best FX trading services.',
    keywords: ['forex brokers', 'FX brokers', 'currency trading', 'best forex brokers'],
    sort_order: 3
  },

  // Execution Types
  {
    slug: 'ecn-brokers',
    name: 'ECN Brokers',
    description: 'Electronic Communication Network brokers providing direct market access with transparent pricing and deep liquidity.',
    category_type: 'execution',
    meta_title: 'Best ECN Brokers — Top Electronic Communication Network 2025 | BrokerAnalysis',
    meta_description: 'Find the best ECN brokers offering true market access, transparent pricing, and institutional-grade execution.',
    keywords: ['ECN brokers', 'electronic communication network', 'market access', 'institutional trading'],
    sort_order: 10
  },
  {
    slug: 'dma-brokers',
    name: 'DMA (Direct Market Access) Brokers',
    description: 'Brokers offering direct market access without dealing desk intervention for professional and institutional traders.',
    category_type: 'execution',
    meta_title: 'Best DMA Brokers — Top Direct Market Access 2025 | BrokerAnalysis',
    meta_description: 'Top DMA brokers providing direct market access, professional trading tools, and institutional-grade execution.',
    keywords: ['DMA brokers', 'direct market access', 'professional trading', 'institutional brokers'],
    sort_order: 11
  },
  {
    slug: 'no-dealing-desk',
    name: 'No Dealing Desk',
    description: 'No Dealing Desk (NDD) brokers that route orders directly to liquidity providers without conflicts of interest.',
    category_type: 'execution',
    meta_title: 'Best No Dealing Desk Brokers — Top NDD Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best No Dealing Desk brokers with transparent execution, no conflicts of interest, and direct market access.',
    keywords: ['NDD brokers', 'no dealing desk', 'transparent execution', 'conflict-free trading'],
    sort_order: 12
  },
  {
    slug: 'forex-brokers-without-requotes',
    name: 'Forex Brokers Without Requotes',
    description: 'Forex brokers that guarantee order execution without requotes for seamless trading experience.',
    category_type: 'execution',
    meta_title: 'Best Forex Brokers Without Requotes — No Requote Trading 2025 | BrokerAnalysis',
    meta_description: 'Top forex brokers with no requotes policy, guaranteed execution, and instant order fills. Compare the best no-requote brokers.',
    keywords: ['no requote brokers', 'guaranteed execution', 'instant fills', 'forex execution'],
    sort_order: 13
  },
  {
    slug: 'fixed-spread-brokers',
    name: 'Fixed Spread Brokers',
    description: 'Brokers offering fixed spreads that remain constant regardless of market volatility and conditions.',
    category_type: 'execution',
    meta_title: 'Best Fixed Spread Brokers — Top Fixed Spread Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best fixed spread brokers with consistent pricing, predictable costs, and reliable execution.',
    keywords: ['fixed spread brokers', 'consistent pricing', 'predictable costs', 'stable spreads'],
    sort_order: 14
  },
  {
    slug: 'no-spread-forex-brokers',
    name: 'No Spread Forex Brokers',
    description: 'Forex brokers offering zero spreads on major currency pairs with commission-based pricing models.',
    category_type: 'execution',
    meta_title: 'Best No Spread Forex Brokers — Zero Spread Trading 2025 | BrokerAnalysis',
    meta_description: 'Top no spread forex brokers offering zero pips on major pairs. Compare commission-based pricing and execution quality.',
    keywords: ['zero spread brokers', 'no spread forex', 'commission trading', 'zero pip spreads'],
    sort_order: 15
  },
  {
    slug: 'a-book-forex-brokers',
    name: 'A-Book Forex Brokers',
    description: 'A-Book brokers that pass all client orders directly to liquidity providers without taking the opposite side of trades.',
    category_type: 'execution',
    meta_title: 'Best A-Book Forex Brokers — Top A-Book Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best A-Book forex brokers with transparent execution, no conflicts of interest, and direct market access.',
    keywords: ['A-Book brokers', 'transparent execution', 'liquidity providers', 'no conflict trading'],
    sort_order: 16
  },
  {
    slug: 'forex-brokers-raw-spreads',
    name: 'Forex Brokers With Raw Spreads',
    description: 'Brokers offering raw interbank spreads with minimal markup for professional and high-volume traders.',
    category_type: 'execution',
    meta_title: 'Best Raw Spread Forex Brokers — Top Raw Spread Trading 2025 | BrokerAnalysis',
    meta_description: 'Top raw spread forex brokers offering interbank pricing, minimal markup, and institutional-grade execution.',
    keywords: ['raw spread brokers', 'interbank spreads', 'institutional pricing', 'professional trading'],
    sort_order: 17
  },
  {
    slug: 'stp-forex-brokers',
    name: 'STP Forex Brokers',
    description: 'Straight Through Processing brokers that automatically route orders to liquidity providers without manual intervention.',
    category_type: 'execution',
    meta_title: 'Best STP Forex Brokers — Top Straight Through Processing 2025 | BrokerAnalysis',
    meta_description: 'Find the best STP forex brokers with automated execution, fast processing, and direct liquidity access.',
    keywords: ['STP brokers', 'straight through processing', 'automated execution', 'liquidity access'],
    sort_order: 18
  },
  {
    slug: 'instant-execution-brokers',
    name: 'Instant Execution Brokers',
    description: 'Brokers providing instant execution of orders at requested prices with minimal latency and slippage.',
    category_type: 'execution',
    meta_title: 'Best Instant Execution Brokers — Top Instant Fill Trading 2025 | BrokerAnalysis',
    meta_description: 'Top instant execution brokers offering immediate order fills, minimal slippage, and ultra-fast execution speeds.',
    keywords: ['instant execution', 'fast execution', 'minimal slippage', 'order fills'],
    sort_order: 19
  },

  // Strategy Types
  {
    slug: 'pamm-brokers',
    name: 'PAMM Brokers',
    description: 'Brokers offering Percentage Allocation Management Module (PAMM) accounts for managed trading services.',
    category_type: 'strategy',
    meta_title: 'Best PAMM Brokers — Top Managed Trading Accounts 2025 | BrokerAnalysis',
    meta_description: 'Find the best PAMM brokers for managed trading, copy trading, and professional money management services.',
    keywords: ['PAMM brokers', 'managed trading', 'copy trading', 'money management'],
    sort_order: 20
  },
  {
    slug: 'hft-brokers',
    name: 'HFT Brokers',
    description: 'High-Frequency Trading brokers with ultra-low latency, advanced execution technology, and institutional-grade infrastructure.',
    category_type: 'strategy',
    meta_title: 'Best HFT Brokers — Top High Frequency Trading 2025 | BrokerAnalysis',
    meta_description: 'Top HFT brokers offering ultra-low latency, advanced technology, and infrastructure for high-frequency trading.',
    keywords: ['HFT brokers', 'high frequency trading', 'low latency', 'algorithmic trading'],
    sort_order: 21
  },
  {
    slug: 'scalping-brokers',
    name: 'Scalping Brokers',
    description: 'Brokers that allow scalping strategies with tight spreads, fast execution, and no restrictions on short-term trading.',
    category_type: 'strategy',
    meta_title: 'Best Scalping Brokers — Top Scalping Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best scalping brokers with tight spreads, fast execution, and no scalping restrictions.',
    keywords: ['scalping brokers', 'scalping trading', 'tight spreads', 'fast execution'],
    sort_order: 22
  },
  {
    slug: 'trading-api-brokers',
    name: 'Trading API Brokers',
    description: 'Brokers offering robust APIs for algorithmic trading, automated strategies, and custom trading applications.',
    category_type: 'strategy',
    meta_title: 'Best Trading API Brokers — Top Algorithmic Trading 2025 | BrokerAnalysis',
    meta_description: 'Top brokers with trading APIs for algorithmic trading, automated strategies, and custom trading applications.',
    keywords: ['API brokers', 'algorithmic trading', 'trading APIs', 'automated trading'],
    sort_order: 23
  },
  {
    slug: 'swing-trading-brokers',
    name: 'Swing Trading Brokers',
    description: 'Brokers optimized for swing trading with competitive overnight fees, comprehensive analysis tools, and flexible account types.',
    category_type: 'strategy',
    meta_title: 'Best Swing Trading Brokers — Top Swing Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best swing trading brokers with low overnight fees, analysis tools, and swing trading-optimized accounts.',
    keywords: ['swing trading brokers', 'swing trading', 'overnight fees', 'analysis tools'],
    sort_order: 24
  },
  {
    slug: 'forex-brokers-hedging',
    name: 'Forex Brokers for Hedging',
    description: 'Brokers that allow hedging strategies including holding both long and short positions simultaneously.',
    category_type: 'strategy',
    meta_title: 'Best Hedging Forex Brokers — Top Hedging Strategies 2025 | BrokerAnalysis',
    meta_description: 'Top forex brokers allowing hedging strategies, simultaneous long/short positions, and risk management tools.',
    keywords: ['hedging brokers', 'hedging strategies', 'risk management', 'position hedging'],
    sort_order: 25
  },
  {
    slug: 'forex-brokers-beginners',
    name: 'Forex Brokers for Beginners',
    description: 'Beginner-friendly brokers with educational resources, low minimum deposits, and user-friendly trading platforms.',
    category_type: 'strategy',
    meta_title: 'Best Forex Brokers for Beginners — Top Beginner Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best forex brokers for beginners with educational resources, low deposits, and user-friendly platforms.',
    keywords: ['beginner brokers', 'forex beginners', 'educational resources', 'easy trading'],
    sort_order: 26
  },
  {
    slug: 'day-trading-brokers',
    name: 'Day Trading Broker',
    description: 'Brokers optimized for day trading with tight spreads, fast execution, professional platforms, and low commission structures.',
    category_type: 'strategy',
    meta_title: 'Best Day Trading Brokers — Top Day Trading Platforms 2025 | BrokerAnalysis',
    meta_description: 'Top day trading brokers with tight spreads, fast execution, professional platforms, and low commission structures.',
    keywords: ['day trading brokers', 'day trading', 'tight spreads', 'professional platforms'],
    sort_order: 27
  },

  // Feature Types
  {
    slug: 'most-regulated-forex-brokers',
    name: 'Most Regulated Forex Brokers',
    description: 'Highly regulated brokers with multiple regulatory licenses from top-tier financial authorities worldwide.',
    category_type: 'features',
    meta_title: 'Most Regulated Forex Brokers — Top Regulated Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the most regulated forex brokers with multiple licenses from FCA, CySEC, ASIC, and other top regulators.',
    keywords: ['regulated brokers', 'financial regulation', 'licensed brokers', 'regulatory compliance'],
    sort_order: 30
  },
  {
    slug: 'trailing-stop-loss-brokers',
    name: 'Trailing Stop Loss Brokers',
    description: 'Brokers offering advanced trailing stop loss features for automated risk management and profit protection.',
    category_type: 'features',
    meta_title: 'Best Trailing Stop Loss Brokers — Top Risk Management 2025 | BrokerAnalysis',
    meta_description: 'Top brokers with trailing stop loss features, automated risk management, and profit protection tools.',
    keywords: ['trailing stop loss', 'risk management', 'profit protection', 'automated stops'],
    sort_order: 31
  },
  {
    slug: 'micro-accounts',
    name: 'Micro Accounts',
    description: 'Brokers offering micro accounts with small lot sizes, low minimum deposits, and beginner-friendly trading conditions.',
    category_type: 'features',
    meta_title: 'Best Micro Account Brokers — Top Micro Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best micro account brokers with small lot sizes, low deposits, and beginner-friendly conditions.',
    keywords: ['micro accounts', 'small lots', 'low deposits', 'beginner trading'],
    sort_order: 32
  },
  {
    slug: 'offshore-forex-brokers',
    name: 'Offshore Forex Brokers',
    description: 'Offshore brokers offering high leverage, flexible trading conditions, and services for international clients.',
    category_type: 'features',
    meta_title: 'Best Offshore Forex Brokers — Top Offshore Trading 2025 | BrokerAnalysis',
    meta_description: 'Top offshore forex brokers with high leverage, flexible conditions, and international trading services.',
    keywords: ['offshore brokers', 'international trading', 'high leverage', 'global access'],
    sort_order: 33
  },
  {
    slug: 'corporate-accounts',
    name: 'Corporate Accounts',
    description: 'Brokers offering specialized corporate accounts with institutional pricing, dedicated support, and business-focused features.',
    category_type: 'features',
    meta_title: 'Best Corporate Account Brokers — Top Business Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best brokers for corporate accounts with institutional pricing, dedicated support, and business features.',
    keywords: ['corporate accounts', 'business trading', 'institutional pricing', 'dedicated support'],
    sort_order: 34
  },
  {
    slug: 'no-deposit-forex-brokers',
    name: 'No Deposit Forex Brokers',
    description: 'Brokers offering no deposit bonuses, welcome bonuses, and free trading credits to start trading without initial capital.',
    category_type: 'features',
    meta_title: 'Best No Deposit Forex Brokers — Top Free Trading 2025 | BrokerAnalysis',
    meta_description: 'Top no deposit forex brokers offering welcome bonuses, free credits, and risk-free trading opportunities.',
    keywords: ['no deposit brokers', 'welcome bonus', 'free trading', 'bonus offers'],
    sort_order: 35
  },
  {
    slug: 'forex-brokers-high-leverage',
    name: 'Forex Brokers With High Leverage',
    description: 'Brokers offering high leverage ratios up to 1:1000 or higher for experienced traders seeking maximum capital efficiency.',
    category_type: 'features',
    meta_title: 'Best High Leverage Forex Brokers — Top Leverage Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best high leverage forex brokers offering ratios up to 1:1000+ for maximum capital efficiency.',
    keywords: ['high leverage brokers', 'maximum leverage', 'capital efficiency', 'leverage trading'],
    sort_order: 36
  },
  {
    slug: 'forex-brokers-no-minimum-deposit',
    name: 'Forex Brokers With No Minimum Deposit',
    description: 'Brokers with no minimum deposit requirements, allowing traders to start with any amount of capital.',
    category_type: 'features',
    meta_title: 'Best No Minimum Deposit Forex Brokers — Zero Minimum 2025 | BrokerAnalysis',
    meta_description: 'Top forex brokers with no minimum deposit requirements. Start trading with any amount of capital.',
    keywords: ['no minimum deposit', 'zero minimum', 'any amount', 'accessible trading'],
    sort_order: 37
  },
  {
    slug: 'crypto-cfd-brokers',
    name: 'Crypto CFD Brokers',
    description: 'Brokers offering cryptocurrency CFD trading with leverage on Bitcoin, Ethereum, and other major digital assets.',
    category_type: 'features',
    meta_title: 'Best Crypto CFD Brokers — Top Cryptocurrency Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best crypto CFD brokers for Bitcoin, Ethereum, and cryptocurrency trading with leverage and regulation.',
    keywords: ['crypto CFD brokers', 'cryptocurrency trading', 'Bitcoin CFDs', 'crypto leverage'],
    sort_order: 38
  },
  {
    slug: 'islamic-accounts',
    name: 'Islamic Accounts',
    description: 'Brokers offering Sharia-compliant Islamic accounts without swap interest, meeting Islamic finance principles.',
    category_type: 'features',
    meta_title: 'Best Islamic Account Brokers — Top Sharia Compliant 2025 | BrokerAnalysis',
    meta_description: 'Find the best Islamic account brokers offering Sharia-compliant trading without swap interest.',
    keywords: ['Islamic accounts', 'Sharia compliant', 'swap-free', 'halal trading'],
    sort_order: 39
  },
  {
    slug: 'mt4-brokers',
    name: 'MT4 Brokers',
    description: 'Brokers offering MetaTrader 4 platform with expert advisors, custom indicators, and automated trading capabilities.',
    category_type: 'features',
    meta_title: 'Best MT4 Brokers — Top MetaTrader 4 Trading 2025 | BrokerAnalysis',
    meta_description: 'Top MT4 brokers offering MetaTrader 4 platform with EAs, indicators, and automated trading features.',
    keywords: ['MT4 brokers', 'MetaTrader 4', 'expert advisors', 'automated trading'],
    sort_order: 40
  },
  {
    slug: 'mt5-brokers',
    name: 'MT5 Brokers',
    description: 'Brokers supporting MetaTrader 5 platform with advanced features, multi-asset trading, and enhanced analytical tools.',
    category_type: 'features',
    meta_title: 'Best MT5 Brokers — Top MetaTrader 5 Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best MT5 brokers with MetaTrader 5 platform, multi-asset trading, and advanced analytical tools.',
    keywords: ['MT5 brokers', 'MetaTrader 5', 'multi-asset trading', 'advanced analytics'],
    sort_order: 41
  },
  {
    slug: 'tradingview-brokers',
    name: 'TradingView Brokers',
    description: 'Brokers integrated with TradingView platform for advanced charting, social trading, and direct execution from charts.',
    category_type: 'features',
    meta_title: 'Best TradingView Brokers — Top TradingView Integration 2025 | BrokerAnalysis',
    meta_description: 'Top brokers with TradingView integration for advanced charting, social trading, and chart-based execution.',
    keywords: ['TradingView brokers', 'TradingView integration', 'advanced charting', 'social trading'],
    sort_order: 42
  },
  {
    slug: 'stock-cfd-brokers',
    name: 'Stock CFD Brokers',
    description: 'Brokers offering stock CFD trading with access to global equity markets, leverage, and fractional shares.',
    category_type: 'features',
    meta_title: 'Best Stock CFD Brokers — Top Stock Trading 2025 | BrokerAnalysis',
    meta_description: 'Find the best stock CFD brokers for global equity trading with leverage, fractional shares, and competitive pricing.',
    keywords: ['stock CFD brokers', 'equity trading', 'stock CFDs', 'global markets'],
    sort_order: 43
  }
];

/**
 * Seed broker categories
 */
async function seedCategories() {
  console.log('🌱 Seeding broker categories...');
  
  try {
    // Insert categories in batches to avoid overwhelming the database
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < CATEGORIES.length; i += batchSize) {
      const batch = CATEGORIES.slice(i, i + batchSize);
      
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(CATEGORIES.length / batchSize)} (${batch.length} categories)...`);
      
      const { data, error } = await supabase
        .from('broker_categories')
        .upsert(batch, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errorCount += batch.length;
      } else {
        console.log(`✅ Successfully inserted batch ${Math.floor(i / batchSize) + 1}`);
        successCount += batch.length;
      }

      // Small delay to avoid rate limiting
      if (i < CATEGORIES.length - batchSize) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n📊 SEEDING SUMMARY');
    console.log('==================');
    console.log(`✅ Successfully seeded: ${successCount} categories`);
    console.log(`❌ Failed: ${errorCount} categories`);
    console.log(`📈 Total processed: ${CATEGORIES.length} categories`);

    // Verify the seeding
    const { count, error: countError } = await supabase
      .from('broker_categories')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error verifying seed data:', countError.message);
    } else {
      console.log(`🎯 Total categories in database: ${count}`);
    }

    return { success: true, seeded: successCount, failed: errorCount, total: count };

  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories()
    .then(result => {
      if (result.success) {
        console.log('🎉 Category seeding completed successfully!');
        process.exit(0);
      } else {
        console.error('💥 Category seeding failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

export { seedCategories, CATEGORIES };