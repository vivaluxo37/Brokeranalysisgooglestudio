import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

async function inspectBrokerData() {
  console.log('🔍 Inspecting broker data structure...');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get a sample broker to see the actual data structure
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Failed to fetch brokers:', error);
      return;
    }

    if (!brokers || brokers.length === 0) {
      console.log('⚠️  No brokers found in database');
      return;
    }

    const broker = brokers[0];
    console.log('\n📋 Sample Broker Structure:');
    console.log('═'.repeat(80));
    console.log(`Name: ${broker.name}`);
    console.log(`ID: ${broker.id}`);
    
    console.log('\n🔑 Available Top-Level Fields:');
    Object.keys(broker).sort().forEach(key => {
      const value = broker[key];
      const type = typeof value;
      const isNull = value === null;
      const isArray = Array.isArray(value);
      const isObject = type === 'object' && !isNull && !isArray;
      
      if (isNull) {
        console.log(`  ${key}: null`);
      } else if (isArray) {
        console.log(`  ${key}: Array[${value.length}]`);
      } else if (isObject) {
        console.log(`  ${key}: Object`);
      } else if (type === 'string') {
        const preview = value.length > 50 ? value.substring(0, 47) + '...' : value;
        console.log(`  ${key}: "${preview}"`);
      } else {
        console.log(`  ${key}: ${value} (${type})`);
      }
    });

    // Show specific nested structures that cross-verifier might need
    console.log('\n🔍 Detailed Field Analysis:');
    
    // Check regulation structure
    if (broker.regulation) {
      console.log('\n📜 Regulation:');
      console.log('  Structure:', JSON.stringify(broker.regulation, null, 2));
    }

    // Check accessibility structure (for minDeposit)
    if (broker.accessibility) {
      console.log('\n💰 Accessibility:');
      console.log('  Structure:', JSON.stringify(broker.accessibility, null, 2));
    }

    // Check technology structure (for platforms)
    if (broker.technology) {
      console.log('\n💻 Technology:');
      console.log('  Structure:', JSON.stringify(broker.technology, null, 2));
    }

    // Check tradingConditions structure (for spreads)
    if (broker.tradingConditions) {
      console.log('\n📊 Trading Conditions:');
      console.log('  Structure:', JSON.stringify(broker.tradingConditions, null, 2));
    }

    // Show some basic cross-verifiable fields
    console.log('\n🎯 Cross-Verifiable Fields:');
    console.log(`  name: ${broker.name}`);
    console.log(`  foundingYear: ${broker.foundingYear}`);
    console.log(`  headquarters: ${broker.headquarters}`);
    console.log(`  websiteUrl: ${broker.websiteUrl}`);
    console.log(`  minDeposit: ${broker.accessibility?.minDeposit}`);
    console.log(`  regulators: ${JSON.stringify(broker.regulation?.regulators)}`);
    console.log(`  platforms: ${JSON.stringify(broker.technology?.platforms)}`);
    console.log(`  eurUsdSpread: ${broker.tradingConditions?.spreads?.eurusd}`);
    console.log(`  maxLeverage: ${broker.tradingConditions?.maxLeverage}`);

  } catch (error) {
    console.error('❌ Inspection failed:', error);
  }
}

inspectBrokerData()
  .then(() => {
    console.log('\n👋 Inspection finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Inspection crashed:', error);
    process.exit(1);
  });