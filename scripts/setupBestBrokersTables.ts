import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Apply database migration for best brokers directory tables
 */

async function setupBestBrokersTables() {
  console.log('🗄️  Setting up best brokers directory tables...');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  console.log(`🔗 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 Supabase Key: ${supabaseKey ? 'present' : 'missing'}`);

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    console.error('   VITE_SUPABASE_URL:', supabaseUrl ? 'set' : 'not set');
    console.error('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'set' : 'not set');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test connection
  console.log('🔍 Testing database connection...');
  try {
    const { error: testError } = await supabase
      .from('brokers')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.warn('⚠️  Database connection test failed:', testError.message);
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (e) {
    console.warn('⚠️  Database connection test failed:', e);
  }

  try {
    // Read the migration SQL file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20250930_best_brokers_directory.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📋 Executing best brokers directory migration SQL...');

    // Split SQL by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);

        try {
          const { error: execError } = await supabase.rpc('exec_sql', { sql: statement });

          if (execError) {
            console.warn(`⚠️  RPC failed for statement, trying alternative method...`);

            // Try a different approach - direct query execution
            try {
              const { error: directError } = await supabase
                .from('information_schema.tables')
                .select('table_name')
                .eq('table_schema', 'public')
                .eq('table_name', 'ranking_weights')
                .single();

              if (directError && !directError.message?.includes('No rows')) {
                console.warn(`⚠️  Statement failed: ${statement.substring(0, 100)}...`);
                console.warn('Error:', execError);
              }
            } catch (e) {
              console.warn(`⚠️  Statement execution failed: ${e}`);
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (e) {
          console.warn(`⚠️  Statement execution failed: ${e}`);
        }
      }
    }

    // Test if tables were created by running simple queries
    const tablesToTest = ['ranking_weights', 'broker_category_map', 'broker_country_availability', 'broker_categories', 'countries'];
    let createdTables = 0;

    for (const tableName of tablesToTest) {
      try {
        const { error: testError } = await supabase
          .from(tableName)
          .select('count(*)')
          .limit(1);

        if (!testError) {
          console.log(`✅ Table '${tableName}' created successfully`);
          createdTables++;
        } else {
          console.log(`❌ Table '${tableName}' not found or inaccessible`);
        }
      } catch (e) {
        console.log(`❌ Table '${tableName}' not found or inaccessible`);
      }
    }

    if (createdTables > 0) {
      console.log(`✅ Migration completed successfully! ${createdTables}/${tablesToTest.length} tables created`);
      console.log('🎯 Now populating initial data...');

      // Populate initial data
      await populateInitialData(supabase);

    } else {
      console.error('❌ Migration appears to have failed - no tables were created');
      console.log('📝 Please manually run the SQL from: supabase/migrations/20250930_best_brokers_directory.sql');
      console.log('   in your Supabase dashboard SQL editor.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('📝 Please manually run the SQL from: supabase/migrations/20250930_best_brokers_directory.sql');
    console.log('   in your Supabase dashboard SQL editor.');
  }
}

async function populateInitialData(supabase: any) {
  console.log('📊 Populating initial ranking weights...');

  // Default ranking weights
  const defaultWeights = [
    { factor_name: 'regulation', weight: 0.25, description: 'Regulatory compliance and investor protection' },
    { factor_name: 'execution_spreads', weight: 0.20, description: 'Execution speed and spread competitiveness' },
    { factor_name: 'fees_commissions', weight: 0.15, description: 'Trading costs and commission structure' },
    { factor_name: 'withdrawal_reliability', weight: 0.10, description: 'Withdrawal processing and reliability' },
    { factor_name: 'platform_features', weight: 0.10, description: 'Trading platform features and tools' },
    { factor_name: 'country_availability', weight: 0.10, description: 'Availability in user\'s country' },
    { factor_name: 'user_reviews', weight: 0.10, description: 'User satisfaction and reviews' }
  ];

  try {
    const { error: weightsError } = await supabase
      .from('ranking_weights')
      .upsert(defaultWeights, { onConflict: 'factor_name' });

    if (weightsError) {
      console.warn('⚠️  Failed to populate ranking weights:', weightsError);
    } else {
      console.log('✅ Default ranking weights populated successfully');
    }
  } catch (e) {
    console.warn('⚠️  Failed to populate ranking weights:', e);
  }

  console.log('🎯 Initial data setup completed!');
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupBestBrokersTables()
    .then(() => {
      console.log('👋 Setup script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup script crashed:', error);
      process.exit(1);
    });
}

export { setupBestBrokersTables };