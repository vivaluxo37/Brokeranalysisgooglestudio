import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
if (typeof window === 'undefined') {
  dotenv.config();
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function validateDatabaseSchema() {
  console.log('🔍 Validating database schema...\n');

  const tablesToCheck = [
    'brokers',
    'broker_regulations', 
    'broker_platforms',
    'broker_fees',
    'broker_trading_instruments',
    'broker_customer_support',
    'reviews',
    'users'
  ];

  const results: { table: string; exists: boolean; error?: string }[] = [];

  for (const tableName of tablesToCheck) {
    try {
      // Try to query the table to see if it exists
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        results.push({ 
          table: tableName, 
          exists: false, 
          error: error.message 
        });
      } else {
        results.push({ 
          table: tableName, 
          exists: true 
        });
      }
    } catch (err) {
      results.push({ 
        table: tableName, 
        exists: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  }

  // Print results
  console.log('📊 Database Schema Validation Results:');
  console.log('=' .repeat(50));

  let existingTables = 0;
  let missingTables = 0;

  results.forEach(result => {
    if (result.exists) {
      console.log(`✅ ${result.table} - EXISTS`);
      existingTables++;
    } else {
      console.log(`❌ ${result.table} - MISSING`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      missingTables++;
    }
  });

  console.log('\n' + '=' .repeat(50));
  console.log(`📈 Summary: ${existingTables} tables exist, ${missingTables} tables missing`);
  
  if (missingTables === 0) {
    console.log('🎉 All required tables are present!');
    return true;
  } else {
    console.log('⚠️  Database schema needs to be deployed');
    console.log('💡 Next steps:');
    console.log('   1. Run the schema.sql file against your Supabase database');
    console.log('   2. Or use: npx supabase db reset (if using local development)');
    console.log('   3. Or deploy via Supabase dashboard SQL editor');
    return false;
  }
}

async function checkBrokerDataStructure() {
  try {
    console.log('\n🔍 Checking existing broker data structure...');
    
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Cannot access brokers table:', error.message);
      return false;
    }

    if (!data || data.length === 0) {
      console.log('📄 Brokers table is empty - ready for migration');
      return true;
    }

    console.log('📊 Found existing broker data:');
    console.log('Sample broker:', JSON.stringify(data[0], null, 2));
    
    const { count } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });

    console.log(`📈 Total brokers in database: ${count}`);
    return true;

  } catch (err) {
    console.error('❌ Error checking broker data:', err);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database validation...\n');
  
  const schemaValid = await validateDatabaseSchema();
  
  if (schemaValid) {
    await checkBrokerDataStructure();
  }
  
  console.log('\n✅ Validation complete!');
}

// Run the validation
main().catch(console.error);

export { validateDatabaseSchema, checkBrokerDataStructure };