import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { seedCategories } from './seed/seedCategories.js';
import { seedCountries } from './seed/seedCountries.js';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

/**
 * Setup Best Brokers Directory system
 */
async function setupBestBrokersDirectory() {
  console.log('🚀 Setting up Best Brokers Directory system...\n');
  
  try {
    // Step 1: Check database connection
    console.log('📡 Checking database connection...');
    const { data: testData, error: testError } = await supabase
      .from('brokers')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    
    console.log('✅ Database connection successful\n');

    // Step 2: Check if migration tables exist
    console.log('🔍 Checking for required tables...');
    const tablesToCheck = [
      'broker_categories',
      'broker_category_map', 
      'countries',
      'broker_country_availability',
      'ranking_weights'
    ];

    const tableChecks = await Promise.all(
      tablesToCheck.map(async (tableName) => {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        return { table: tableName, exists: !error };
      })
    );

    const missingTables = tableChecks.filter(check => !check.exists);
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables.map(t => t.table).join(', '));
      console.log('\n📋 Please run the migration SQL first:');
      console.log('   1. Open Supabase Dashboard');
      console.log('   2. Go to SQL Editor');
      console.log('   3. Run: supabase/migrations/20250930_best_brokers_directory.sql');
      console.log('   4. Then run this setup script again\n');
      return false;
    }
    
    console.log('✅ All required tables exist\n');

    // Step 3: Seed categories
    console.log('🌱 Seeding broker categories...');
    const categoryResult = await seedCategories();
    
    if (!categoryResult.success) {
      throw new Error(`Category seeding failed: ${categoryResult.error}`);
    }
    
    console.log(`✅ Seeded ${categoryResult.seeded} categories\n`);

    // Step 4: Seed countries
    console.log('🌍 Seeding countries...');
    const countryResult = await seedCountries();
    
    if (!countryResult.success) {
      throw new Error(`Country seeding failed: ${countryResult.error}`);
    }
    
    console.log(`✅ Seeded ${countryResult.seeded} countries\n`);

    // Step 5: Check broker data
    console.log('🏢 Checking broker data...');
    const { data: brokers, error: brokerError } = await supabase
      .from('brokers')
      .select('count', { count: 'exact' });
    
    if (brokerError) {
      throw new Error(`Failed to check broker data: ${brokerError.message}`);
    }
    
    // @ts-ignore - count is available on the response
    const brokerCount = brokers.count || 0;
    console.log(`✅ Found ${brokerCount} brokers in database\n`);

    // Step 6: Summary
    console.log('🎉 SETUP COMPLETE!');
    console.log('==================');
    console.log(`Categories: ${categoryResult.total}`);
    console.log(`Countries: ${countryResult.total}`);
    console.log(`Brokers: ${brokerCount}`);
    console.log('\n📋 Next steps:');
    console.log('   1. Add Best Brokers routes to your App.tsx');
    console.log('   2. Navigate to /best-brokers to see the directory');
    console.log('   3. Use the ranking API to get category-specific broker lists');
    console.log('   4. Set up country verification if needed\n');

    return true;

  } catch (error) {
    console.error('💥 Setup failed:', error);
    return false;
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupBestBrokersDirectory()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

export { setupBestBrokersDirectory };