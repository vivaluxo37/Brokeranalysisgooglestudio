#!/usr/bin/env node
/**
 * Comprehensive Broker Data Migration Script
 * Migrates all 83 brokers from TypeScript files to Supabase database
 * 
 * Usage: npm run migrate:brokers
 */

import { createClient } from '@supabase/supabase-js';
import { brokers } from '../data/brokers';
import type { Broker } from '../types';

// Supabase configuration
const supabaseUrl = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sbp_a008ee810fd64e9c06e14a517d53ba1878f74e8c';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DatabaseBroker {
  name: string;
  slug: string;
  description: string;
  website: string;
  year_founded: number;
  headquarters: string;
  regulation_status: string;
  minimum_deposit: number;
  overall_rating: number;
  trust_score: number;
  is_active: boolean;
  is_featured: boolean;
  logo_url: string;
  founding_year: number;
  broker_type: string;
  mobile_trading: boolean;
  demo_account: boolean;
  pros: string[];
  cons: string[];
  account_types: any;
  fees: any;
  tradable_instruments: any;
  trading_conditions: any;
  security: any;
}

/**
 * Transform TypeScript broker data to database format
 */
function transformBrokerData(broker: Broker): DatabaseBroker {
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
    is_featured: broker.id === 'pepperstone' || broker.id === 'ic-markets' || broker.score >= 9.0,
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
 * Migrate broker regulations to separate table
 */
async function migrateRegulations(brokerSlug: string, regulations: any[]) {
  if (!regulations || regulations.length === 0) return;

  const regulationData = regulations.map(reg => ({
    broker_id: brokerSlug,
    authority: reg.regulator || reg.authority,
    license_number: reg.licenseNumber || reg.license_number || '',
    status: 'Active',
    year_obtained: null,
  }));

  const { error } = await supabase
    .from('broker_regulations')
    .upsert(regulationData, { onConflict: 'broker_id,authority' });

  if (error) {
    console.warn(`Warning: Could not migrate regulations for ${brokerSlug}:`, error.message);
  }
}

/**
 * Main migration function
 */
async function migrateBrokers() {
  console.log('🚀 Starting broker data migration...');
  console.log(`📊 Found ${brokers.length} brokers to migrate`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // First, let's clear existing data to avoid conflicts
  console.log('🧹 Clearing existing broker data...');
  await supabase.from('broker_regulations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('brokers').delete().neq('id', 0);

  for (const broker of brokers) {
    try {
      console.log(`📦 Migrating: ${broker.name} (${broker.id})`);
      
      const dbBroker = transformBrokerData(broker);
      
      // Insert main broker data
      const { data: insertedBroker, error: brokerError } = await supabase
        .from('brokers')
        .upsert(dbBroker, { onConflict: 'slug' })
        .select('id, slug')
        .single();

      if (brokerError) {
        throw new Error(`Broker insert failed: ${brokerError.message}`);
      }

      // Migrate regulations if available
      if (broker.security?.regulatedBy) {
        await migrateRegulations(broker.id, broker.security.regulatedBy);
      }

      successCount++;
      console.log(`✅ Successfully migrated: ${broker.name}`);

    } catch (error) {
      errorCount++;
      const errorMsg = `❌ Failed to migrate ${broker.name}: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  // Migration summary
  console.log('\n📊 MIGRATION SUMMARY');
  console.log('====================================');
  console.log(`✅ Successful migrations: ${successCount}`);
  console.log(`❌ Failed migrations: ${errorCount}`);
  console.log(`📈 Success rate: ${((successCount / brokers.length) * 100).toFixed(1)}%`);

  if (errors.length > 0) {
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
}

/**
 * Verify migration integrity
 */
async function verifyMigration() {
  console.log('\n🔍 Verifying migration integrity...');

  // Check total count
  const { count } = await supabase
    .from('brokers')
    .select('*', { count: 'exact', head: true });

  console.log(`Database contains ${count} brokers`);

  // Check for missing critical data
  const { data: brokersWithoutRating } = await supabase
    .from('brokers')
    .select('name, slug')
    .is('overall_rating', null);

  if (brokersWithoutRating && brokersWithoutRating.length > 0) {
    console.log(`⚠️  ${brokersWithoutRating.length} brokers missing ratings`);
  }

  // Check regulations
  const { count: regulationCount } = await supabase
    .from('broker_regulations')
    .select('*', { count: 'exact', head: true });

  console.log(`Database contains ${regulationCount} regulation records`);
}

// Run migration
if (require.main === module) {
  migrateBrokers()
    .then(() => verifyMigration())
    .then(() => {
      console.log('\n🚀 Migration process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { migrateBrokers, verifyMigration };