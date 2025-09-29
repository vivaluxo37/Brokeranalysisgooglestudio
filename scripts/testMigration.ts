import { brokers } from '../data/brokers';
import { BrokerDataMigration } from './migrateBrokerData';
import dotenv from 'dotenv';

// Load environment variables
if (typeof window === 'undefined') {
  dotenv.config();
}

class TestMigration {
  private migration: BrokerDataMigration;

  constructor() {
    this.migration = new BrokerDataMigration();
  }

  async runTest(): Promise<void> {
    console.log('🧪 Starting test migration with sample brokers...\n');

    // Test with first 3 brokers only
    const testBrokers = brokers.slice(0, 3);
    
    console.log(`📊 Test brokers selected:`);
    testBrokers.forEach((broker, index) => {
      console.log(`   ${index + 1}. ${broker.name} (ID: ${broker.id})`);
    });
    console.log('');

    // Validate database connection first
    console.log('🔍 Validating database connection...');
    await this.validateConnection();

    // Run migration for test brokers
    for (let i = 0; i < testBrokers.length; i++) {
      const broker = testBrokers[i];
      console.log(`\n📦 Migrating test broker ${i + 1}/${testBrokers.length}: ${broker.name}`);
      
      try {
        await this.migration.migrateSingleBroker(broker);
        console.log(`✅ Successfully migrated ${broker.name}`);
      } catch (error) {
        console.error(`❌ Failed to migrate ${broker.name}:`, error);
        throw error; // Stop on first error for testing
      }
    }

    // Validate migrated data
    console.log('\n🔍 Validating migrated data...');
    await this.validateMigratedData(testBrokers);

    console.log('\n🎉 Test migration completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Review the migrated data in your database');
    console.log('   2. If everything looks good, run the full migration');
    console.log('   3. Command: npx tsx scripts/migrateBrokerData.ts');
  }

  private async validateConnection(): Promise<void> {
    try {
      const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
      const supabase = (brokerDatabaseService as any).supabase;
      
      // Test basic connection
      const { data, error } = await supabase
        .from('brokers')
        .select('count')
        .limit(1);

      if (error) {
        throw new Error(`Database connection failed: ${error.message}`);
      }

      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  private async validateMigratedData(testBrokers: any[]): Promise<void> {
    try {
      const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
      const supabase = (brokerDatabaseService as any).supabase;

      for (const broker of testBrokers) {
        console.log(`   Validating ${broker.name}...`);

        // Check main broker record
        const { data: brokerData, error: brokerError } = await supabase
          .from('brokers')
          .select('*')
          .eq('id', broker.id)
          .single();

        if (brokerError || !brokerData) {
          throw new Error(`Broker ${broker.name} not found in database`);
        }

        // Check related data
        const queries = [
          { table: 'broker_platforms', count: broker.technology?.platforms?.length || 0 },
          { table: 'broker_regulations', count: broker.security?.regulatedBy?.length || 0 },
          { table: 'broker_customer_support', count: broker.customerSupport?.languages?.length || 0 },
          { table: 'broker_trading_instruments', count: this.countInstruments(broker.tradableInstruments) }
        ];

        for (const query of queries) {
          const { count, error } = await supabase
            .from(query.table)
            .select('*', { count: 'exact', head: true })
            .eq('broker_id', broker.id);

          if (error) {
            console.warn(`   ⚠️ Warning: Could not validate ${query.table} for ${broker.name}: ${error.message}`);
          } else {
            console.log(`   ✅ ${query.table}: ${count} records (expected: ${query.count})`);
          }
        }

        // Validate JSONB data integrity
        const jsonFields = ['pros', 'cons', 'account_types', 'fees', 'tradable_instruments'];
        jsonFields.forEach(field => {
          if (brokerData[field]) {
            console.log(`   ✅ ${field}: Data present`);
          }
        });
      }

      console.log('✅ Data validation completed');
    } catch (error) {
      console.error('❌ Data validation failed:', error);
      throw error;
    }
  }

  private countInstruments(instruments: any): number {
    if (!instruments) return 0;
    
    const types = ['forexPairs', 'stocks', 'commodities', 'indices', 'cryptocurrencies', 'etfs'];
    return types.filter(type => instruments[type]).length;
  }

  async cleanup(): Promise<void> {
    console.log('\n🧹 Cleaning up test data...');
    
    try {
      const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
      const supabase = (brokerDatabaseService as any).supabase;
      
      const testBrokers = brokers.slice(0, 3);
      const testIds = testBrokers.map(b => b.id);

      // Delete in reverse order of dependencies
      const tables = [
        'broker_customer_support',
        'broker_trading_instruments', 
        'broker_platforms',
        'broker_regulations',
        'brokers'
      ];

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .in('broker_id', testIds);

        if (error && !error.message.includes('does not exist')) {
          console.warn(`   ⚠️ Warning cleaning ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ Cleaned ${table}`);
        }
      }

      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      console.log('💡 You may need to manually clean up the test data');
    }
  }
}

// Extend BrokerDataMigration to expose single broker migration
declare module './migrateBrokerData' {
  namespace BrokerDataMigration {
    interface BrokerDataMigration {
      migrateSingleBroker(broker: any): Promise<void>;
    }
  }
}

// Add the method to the existing class
(BrokerDataMigration.prototype as any).migrateSingleBroker = async function(broker: any) {
  return this.migrateBroker(broker);
};

async function runTestMigration() {
  const testMigration = new TestMigration();
  
  try {
    await testMigration.runTest();
  } catch (error) {
    console.error('\n🚨 Test migration failed:', error);
    
    // Offer cleanup
    console.log('\n🤔 Would you like to clean up the test data?');
    console.log('Run: npx tsx scripts/testMigration.ts --cleanup');
    
    process.exit(1);
  }
}

async function runCleanup() {
  const testMigration = new TestMigration();
  await testMigration.cleanup();
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--cleanup')) {
  console.log('🧹 Running cleanup mode...');
  runCleanup().catch(console.error);
} else {
  runTestMigration().catch(console.error);
}

export { TestMigration };