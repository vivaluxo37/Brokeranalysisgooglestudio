import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Apply database migration for broker_discrepancies table
 */

async function applyMigration() {
  console.log('🗄️  Applying database migration...');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Read the migration SQL file
    const migrationPath = join(process.cwd(), 'database', 'migrations', 'create_broker_discrepancies_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📋 Executing migration SQL...');

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // Try direct execution instead
      console.log('⚠️  RPC failed, trying direct execution...');
      
      // Split SQL by semicolons and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: execError } = await supabase.rpc('exec', { sql: statement });
            if (execError) {
              console.warn(`⚠️  Failed to execute: ${statement.substring(0, 100)}...`);
              console.warn('Error:', execError);
            }
          } catch (e) {
            console.warn(`⚠️  Statement execution failed: ${e}`);
          }
        }
      }

      // Try to test if table was created by running a simple query
      const { error: testError } = await supabase
        .from('broker_discrepancies')
        .select('count(*)')
        .limit(1);

      if (testError) {
        console.error('❌ Migration appears to have failed:', testError);
        console.log('📝 Please manually run the SQL from: database/migrations/create_broker_discrepancies_table.sql');
        console.log('   in your Supabase dashboard SQL editor.');
      } else {
        console.log('✅ Migration completed successfully!');
        console.log('📋 broker_discrepancies table is ready');
      }

    } else {
      console.log('✅ Migration completed successfully!');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('📝 Please manually run the SQL from: database/migrations/create_broker_discrepancies_table.sql');
    console.log('   in your Supabase dashboard SQL editor.');
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  applyMigration()
    .then(() => {
      console.log('👋 Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script crashed:', error);
      process.exit(1);
    });
}

export { applyMigration };