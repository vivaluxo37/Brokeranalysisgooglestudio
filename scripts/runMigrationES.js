import { createClient } from '@supabase/supabase-js';
// Import will be handled via a workaround since we have TS files

// Supabase configuration
const supabaseUrl = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const supabaseServiceKey = 'sbp_a008ee810fd64e9c06e14a517d53ba1878f74e8c';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Transform TypeScript broker data to database format
 */
function transformBrokerData(broker) {
  return {
    name: broker.name,
    slug: broker.id, // Use broker.id as slug
    description: broker.description || '',
    website: broker.websiteUrl || '',
    year_founded: broker.foundingYear || null,
    headquarters: broker.headquarters || '',
    regulation_status: 'regulated',
    minimum_deposit: broker.accessibility?.minDeposit || 0,
    overall_rating: broker.score || broker.ratings?.regulation || 0,
    trust_score: broker.score || 0,
    is_active: true,
    is_featured: broker.id === 'pepperstone' || broker.id === 'ic-markets' || (broker.score && broker.score >= 9.0),
    logo_url: broker.logoUrl || '',
    founding_year: broker.foundingYear || null,
    broker_type: broker.coreInfo?.brokerType || broker.technology?.executionType || 'Market Maker',
    mobile_trading: broker.coreInfo?.mobileTrading ?? true,
    demo_account: broker.coreInfo?.demoAccount ?? true,
    pros: broker.pros || [],
    cons: broker.cons || [],
    account_types: broker.accountTypes || null,
    fees: broker.fees || null,
    tradable_instruments: broker.tradableInstruments || null,
    trading_conditions: broker.tradingConditions || broker.tradingConditionsExtended || null,
    security: broker.security || null,
  };
}

/**
 * Main migration function - processes all 83 brokers
 */
async function migrateBrokers() {
  console.log('🚀 Starting COMPLETE broker data migration...');
  console.log(`📊 Found ${brokers.length} brokers to migrate`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Clear existing data
  console.log('🧹 Clearing existing broker data...');
  try {
    await supabase.from('broker_regulations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('brokers').delete().neq('id', 0);
    console.log('✅ Cleared existing data');
  } catch (error) {
    console.log('⚠️ Warning: Could not clear existing data:', error.message);
  }

  // Process all brokers in batches of 10 for better performance
  const batchSize = 10;
  for (let i = 0; i < brokers.length; i += batchSize) {
    const batch = brokers.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(brokers.length/batchSize)} (${batch.length} brokers)`);

    const batchData = [];

    // Prepare batch data
    for (const broker of batch) {
      try {
        const dbBroker = transformBrokerData(broker);
        batchData.push(dbBroker);
        console.log(`  ✓ Prepared: ${broker.name}`);
      } catch (error) {
        errorCount++;
        const errorMsg = `Failed to prepare ${broker.name}: ${error.message}`;
        console.error(`  ❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Insert batch
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
        console.error(`  💥 Batch insert failed:`, error.message);
        errors.push(`Batch ${Math.floor(i/batchSize) + 1} failed: ${error.message}`);
      }
    }

    // Small delay between batches to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

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
    console.log('⚠️ Warning: Broker count mismatch. Please review failed migrations.');
  }

  return { successCount, errorCount, totalBrokers: brokers.length };
}

// Run migration
migrateBrokers()
  .then((result) => {
    console.log('\n🚀 Migration process completed!');
    console.log(`Final result: ${result.successCount}/${result.totalBrokers} brokers migrated successfully`);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });