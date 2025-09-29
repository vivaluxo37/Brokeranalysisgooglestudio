import { createClient } from '@supabase/supabase-js';
import { brokers } from '../data/brokers';
import type { Broker } from '../types';

// Supabase configuration
const supabaseUrl = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const supabaseServiceKey = 'sbp_a008ee810fd64e9c06e14a517d53ba1878f74e8c';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DatabaseBroker {
  name: string;
  slug: string;
  description: string;
  website: string;
  year_founded: number | null;
  headquarters: string;
  regulation_status: string;
  minimum_deposit: number;
  overall_rating: number;
  trust_score: number;
  is_active: boolean;
  is_featured: boolean;
  logo_url: string;
  founding_year: number | null;
  broker_type: string;
  mobile_trading: boolean;
  demo_account: boolean;
  pros: string[] | null;
  cons: string[] | null;
  account_types: any;
  fees: any;
  tradable_instruments: any;
  trading_conditions: any;
  security: any;
}

function transformBrokerData(broker: Broker): DatabaseBroker {
  return {
    name: broker.name,
    slug: broker.id,
    description: broker.description || '',
    website: broker.websiteUrl || '',
    year_founded: broker.foundingYear || null,
    headquarters: broker.headquarters || '',
    regulation_status: 'regulated',
    minimum_deposit: (broker.accessibility?.minDeposit) || 0,
    overall_rating: broker.score || 0,
    trust_score: broker.score || 0,
    is_active: true,
    is_featured: broker.id === 'pepperstone' || broker.id === 'ic-markets' || (broker.score && broker.score >= 9.0),
    logo_url: broker.logoUrl || '',
    founding_year: broker.foundingYear || null,
    broker_type: broker.coreInfo?.brokerType || 'Market Maker',
    mobile_trading: broker.coreInfo?.mobileTrading ?? true,
    demo_account: broker.coreInfo?.demoAccount ?? true,
    pros: broker.pros || null,
    cons: broker.cons || null,
    account_types: broker.accountTypes || null,
    fees: broker.fees || null,
    tradable_instruments: broker.tradableInstruments || null,
    trading_conditions: broker.tradingConditions || broker.tradingConditionsExtended || null,
    security: broker.security || null,
  };
}

async function migrateBrokers() {
  console.log('🚀 Starting comprehensive broker data migration...');
  console.log(`📊 Found ${brokers.length} brokers to migrate`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Process brokers in batches of 10
  const batchSize = 10;
  for (let i = 0; i < brokers.length; i += batchSize) {
    const batch = brokers.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(brokers.length/batchSize)} (${batch.length} brokers)`);

    const batchData: DatabaseBroker[] = [];

    for (const broker of batch) {
      try {
        const dbBroker = transformBrokerData(broker);
        batchData.push(dbBroker);
        console.log(`  ✓ Prepared: ${broker.name}`);
      } catch (error) {
        errorCount++;
        const errorMsg = `Failed to prepare ${broker.name}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`  ❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Batch insert
    if (batchData.length > 0) {
      try {
        const { error: batchError } = await supabase
          .from('brokers')
          .upsert(batchData, { onConflict: 'slug' });

        if (batchError) {
          throw new Error(`Batch insert failed: ${batchError.message}`);
        }

        successCount += batchData.length;
        console.log(`  🎉 Successfully inserted ${batchData.length} brokers from batch`);
      } catch (error) {
        errorCount += batchData.length;
        const errorMsg = `Batch insert failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`  💥 ${errorMsg}`);
        errors.push(errorMsg);
      }
    }
  }

  // Migration summary
  console.log('\n📊 MIGRATION SUMMARY');
  console.log('====================================');
  console.log(`✅ Successful migrations: ${successCount}`);
  console.log(`❌ Failed migrations: ${errorCount}`);
  console.log(`📈 Success rate: ${((successCount / brokers.length) * 100).toFixed(1)}%`);

  if (errors.length > 0 && errors.length <= 10) {
    console.log('\n🔍 ERRORS ENCOUNTERED:');
    errors.forEach(error => console.log(`  • ${error}`));
  }

  // Verify final count
  const { count } = await supabase
    .from('brokers')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🎯 Final database count: ${count} brokers`);

  if (count === brokers.length) {
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY! All brokers migrated.');
  } else {
    console.log('⚠️  Warning: Broker count mismatch. Please review failed migrations.');
  }

  return { successCount, errorCount, totalBrokers: brokers.length };
}

// Run the migration
migrateBrokers()
  .then((result) => {
    console.log('\n🚀 Migration process completed!');
    console.log(`Final result: ${result.successCount}/${result.totalBrokers} brokers migrated successfully`);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });