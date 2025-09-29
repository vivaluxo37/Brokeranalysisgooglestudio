import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function setupDiscrepanciesTable() {
  console.log('🔧 Setting up broker_discrepancies table...');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test if the table exists by trying to select from it
    const { error: testError } = await supabase
      .from('broker_discrepancies')
      .select('count(*)')
      .limit(1);

    if (!testError) {
      console.log('✅ broker_discrepancies table already exists and is accessible');
      return true;
    }

    console.log('⚠️  Table does not exist or is not accessible. Creating it now...');

    // Create the table with a simple SQL command
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS broker_discrepancies (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        broker_id UUID NOT NULL,
        field_name TEXT NOT NULL,
        db_value TEXT,
        web_value TEXT,
        confidence_score DECIMAL(3,2) NOT NULL DEFAULT 0.00,
        sources_checked TEXT[] DEFAULT '{}',
        tolerance_exceeded BOOLEAN DEFAULT FALSE,
        severity TEXT DEFAULT 'medium',
        recommended_action TEXT DEFAULT 'review',
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Try to execute via SQL editor (won't work programmatically, but we can log it)
    console.log('📝 Please run the following SQL in your Supabase SQL Editor:');
    console.log('═'.repeat(80));
    console.log(createTableSQL);
    console.log('═'.repeat(80));

    // For now, let's just return false to indicate manual setup is needed
    return false;

  } catch (error) {
    console.error('❌ Setup failed:', error);
    return false;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupDiscrepanciesTable().then((success) => {
    if (success) {
      console.log('✅ Setup completed');
    } else {
      console.log('⚠️  Manual setup required');
    }
    process.exit(success ? 0 : 1);
  });
}

export { setupDiscrepanciesTable };