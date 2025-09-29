const { createClient } = require('@supabase/supabase-js');
const { brokers } = require('../data/brokers');

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
 * Main migration function
 */
async function migrateBrokers() {
  console.log('🚀 Starting broker data migration...');
  console.log(`📊 Found ${brokers.length} brokers to migrate`);

  let successCount = 0;
  let errorCount = 0;

  // Clear existing data
  console.log('🧹 Clearing existing broker data...');
  try {
    await supabase.from('broker_regulations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('brokers').delete().neq('id', 0);
    console.log('✅ Cleared existing data');
  } catch (error) {
    console.log('⚠️ Warning: Could not clear existing data:', error.message);
  }

  // Migrate each broker
  for (const broker of brokers.slice(0, 5)) { // Start with first 5 for testing
    try {
      console.log(`📦 Migrating: ${broker.name} (${broker.id})`);
      
      const dbBroker = transformBrokerData(broker);
      
      // Insert main broker data
      const { data: insertedBroker, error: brokerError } = await supabase
        .from('brokers')
        .upsert(dbBroker, { onConflict: 'slug' });

      if (brokerError) {
        throw new Error(`Broker insert failed: ${brokerError.message}`);
      }

      successCount++;
      console.log(`✅ Successfully migrated: ${broker.name}`);

    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate ${broker.name}:`, error.message);
    }
  }

  console.log('\n📊 MIGRATION SUMMARY');
  console.log('====================================');
  console.log(`✅ Successful migrations: ${successCount}`);
  console.log(`❌ Failed migrations: ${errorCount}`);

  // Verify final count
  const { count } = await supabase
    .from('brokers')
    .select('*', { count: 'exact', head: true });

  console.log(`🎯 Final database count: ${count} brokers`);
  console.log('🎉 Initial migration test completed!');
}

// Run migration
migrateBrokers()
  .catch(console.error);