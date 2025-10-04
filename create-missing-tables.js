import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

console.log('Creating missing database tables...');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTablesWithSQL() {
  // Create tables using raw SQL
  const createStatements = [
    // Create ranking_weights table
    `CREATE TABLE IF NOT EXISTS ranking_weights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      factor_name VARCHAR(100) UNIQUE NOT NULL,
      weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Create broker_categories table
    `CREATE TABLE IF NOT EXISTS broker_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category_type VARCHAR(50) NOT NULL,
      meta_title TEXT,
      meta_description TEXT,
      keywords TEXT[],
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Create broker_category_map table
    `CREATE TABLE IF NOT EXISTS broker_category_map (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      broker_id INTEGER NOT NULL,
      category_id UUID NOT NULL,
      rank_position INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT false,
      match_reason TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Create countries table
    `CREATE TABLE IF NOT EXISTS countries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      iso2 VARCHAR(2) UNIQUE NOT NULL,
      iso3 VARCHAR(3),
      flag_emoji TEXT,
      region TEXT,
      population BIGINT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Create broker_country_availability table
    `CREATE TABLE IF NOT EXISTS broker_country_availability (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      broker_id INTEGER NOT NULL,
      country_id UUID NOT NULL,
      available BOOLEAN DEFAULT null,
      confidence_level VARCHAR(20) DEFAULT 'unknown',
      evidence_urls TEXT[],
      evidence_summary TEXT,
      search_queries TEXT[],
      last_checked_at TIMESTAMP WITH TIME ZONE,
      checked_by VARCHAR(50),
      manual_override BOOLEAN DEFAULT false,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  ];

  for (let i = 0; i < createStatements.length; i++) {
    const sql = createStatements[i];
    console.log(`Creating table ${i + 1}/${createStatements.length}...`);

    try {
      // Try to use pgql extension
      const { error } = await supabase.rpc('exec_sql', { sql });

      if (error) {
        console.warn(`Table creation failed, trying alternative method: ${error.message}`);
      } else {
        console.log(`✅ Table ${i + 1} created successfully`);
        continue;
      }
    } catch (e) {
      console.warn(`Table creation failed: ${e}`);
    }
  }
}

async function insertDefaultData() {
  console.log('Inserting default ranking weights...');

  const weights = [
    { factor_name: 'regulation', weight: 0.25, description: 'Regulatory compliance and investor protection' },
    { factor_name: 'execution_spreads', weight: 0.20, description: 'Execution speed and spread competitiveness' },
    { factor_name: 'fees_commissions', weight: 0.15, description: 'Trading costs and commission structure' },
    { factor_name: 'withdrawal_reliability', weight: 0.10, description: 'Withdrawal processing and reliability' },
    { factor_name: 'platform_features', weight: 0.10, description: 'Trading platform features and tools' },
    { factor_name: 'country_availability', weight: 0.10, description: 'Availability in user\'s country' },
    { factor_name: 'user_reviews', weight: 0.10, description: 'User satisfaction and reviews' }
  ];

  try {
    const { error } = await supabase
      .from('ranking_weights')
      .upsert(weights, { onConflict: 'factor_name' });

    if (error) {
      console.warn('Failed to insert ranking weights:', error);
    } else {
      console.log('✅ Default ranking weights inserted');
    }
  } catch (e) {
    console.warn('Failed to insert ranking weights:', e);
  }

  // Insert some sample categories
  console.log('Inserting sample categories...');

  const categories = [
    {
      slug: 'ecn-brokers',
      name: 'ECN Brokers',
      description: 'True ECN brokers providing direct market access',
      category_type: 'execution',
      is_active: true,
      sort_order: 1
    },
    {
      slug: 'mt4-brokers',
      name: 'MT4 Brokers',
      description: 'Brokers supporting MetaTrader 4 platform',
      category_type: 'features',
      is_active: true,
      sort_order: 2
    },
    {
      slug: 'islamic-accounts-brokers',
      name: 'Islamic Account Brokers',
      description: 'Brokers offering Sharia-compliant accounts',
      category_type: 'features',
      is_active: true,
      sort_order: 3
    }
  ];

  try {
    const { error: catError } = await supabase
      .from('broker_categories')
      .upsert(categories, { onConflict: 'slug' });

    if (catError) {
      console.warn('Failed to insert categories:', catError);
    } else {
      console.log('✅ Sample categories inserted');
    }
  } catch (e) {
    console.warn('Failed to insert categories:', e);
  }

  // Insert sample countries
  console.log('Inserting sample countries...');

  const countries = [
    { slug: 'united-states', name: 'United States', iso2: 'US', iso3: 'USA', region: 'North America', is_active: true },
    { slug: 'united-kingdom', name: 'United Kingdom', iso2: 'GB', iso3: 'GBR', region: 'Europe', is_active: true },
    { slug: 'australia', name: 'Australia', iso2: 'AU', iso3: 'AUS', region: 'Oceania', is_active: true },
    { slug: 'canada', name: 'Canada', iso2: 'CA', iso3: 'CAN', region: 'North America', is_active: true },
    { slug: 'germany', name: 'Germany', iso2: 'DE', iso3: 'DEU', region: 'Europe', is_active: true }
  ];

  try {
    const { error: countryError } = await supabase
      .from('countries')
      .upsert(countries, { onConflict: 'iso2' });

    if (countryError) {
      console.warn('Failed to insert countries:', countryError);
    } else {
      console.log('✅ Sample countries inserted');
    }
  } catch (e) {
    console.warn('Failed to insert countries:', e);
  }
}

async function verifyTables() {
  const tables = ['ranking_weights', 'broker_categories', 'broker_category_map', 'countries', 'broker_country_availability'];

  console.log('Verifying table creation...');

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Table '${table}' not accessible: ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' accessible`);
      }
    } catch (e) {
      console.log(`❌ Table '${table}' not accessible: ${e.message}`);
    }
  }
}

async function main() {
  await createTablesWithSQL();
  await insertDefaultData();
  await verifyTables();
  console.log('Database setup completed!');
}

main().catch(console.error);