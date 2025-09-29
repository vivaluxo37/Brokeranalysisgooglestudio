import { brokers } from '../data/brokers';
import { brokerDatabaseService } from '../services/brokerDatabaseService';

/**
 * Migration script to move broker data from brokers.ts file to database
 * 
 * This script:
 * 1. Reads the existing broker data from brokers.ts
 * 2. Transforms it to fit the database schema
 * 3. Inserts it into the database tables
 * 4. Provides progress feedback and error handling
 */

interface MigrationResult {
  success: boolean;
  brokerId: string;
  errors: string[];
}

class BrokerDataMigration {
  private results: MigrationResult[] = [];

  async migrateAllBrokers(): Promise<void> {
    console.log(`🚀 Starting migration of ${brokers.length} brokers...`);
    
    for (let i = 0; i < brokers.length; i++) {
      const broker = brokers[i];
      console.log(`\n📊 Migrating broker ${i + 1}/${brokers.length}: ${broker.name}`);
      
      try {
        await this.migrateBroker(broker);
        this.results.push({
          success: true,
          brokerId: broker.id,
          errors: []
        });
        console.log(`✅ Successfully migrated ${broker.name}`);
      } catch (error) {
        console.error(`❌ Failed to migrate ${broker.name}:`, error);
        this.results.push({
          success: false,
          brokerId: broker.id,
          errors: [error instanceof Error ? error.message : String(error)]
        });
      }
    }

    this.printMigrationSummary();
  }

  private async migrateBroker(broker: any): Promise<void> {
    // 1. Insert main broker data (includes most data as JSONB)
    await this.insertBrokerBasicInfo(broker);
    
    // 2. Insert platforms data in separate table for querying
    if (broker.technology?.platforms) {
      await this.insertBrokerPlatforms(broker);
    }
    
    // 3. Insert regulations data in separate table for compliance tracking
    if (broker.security?.regulatedBy) {
      await this.insertBrokerRegulations(broker);
    }
    
    // 4. Insert customer support data for search/filtering
    if (broker.customerSupport) {
      await this.insertBrokerSupport(broker);
    }
    
    // 5. Insert trading instruments for detailed queries
    if (broker.tradableInstruments) {
      await this.insertBrokerInstruments(broker);
    }
    
    // 6. Insert reviews (if any exist)
    if (broker.reviews && broker.reviews.length > 0) {
      await this.insertBrokerReviews(broker);
    }
  }

  private async insertBrokerBasicInfo(broker: any): Promise<void> {
    const brokerData = {
      id: broker.id,
      name: broker.name,
      logo_url: broker.logoUrl,
      website_url: broker.websiteUrl,
      score: broker.score,
      founding_year: broker.foundingYear,
      headquarters: broker.headquarters,
      description: broker.description,
      summary: broker.summary,
      broker_type: broker.coreInfo?.brokerType || 'Market Maker',
      mobile_trading: broker.coreInfo?.mobileTrading ?? true,
      demo_account: broker.coreInfo?.demoAccount ?? true,
      min_deposit_amount: broker.accessibility?.minDeposit || 0,
      max_leverage: broker.tradingConditions?.maxLeverage || '1:100',
      
      // Store complex data as JSONB
      pros: broker.pros || [],
      cons: broker.cons || [],
      account_types: broker.accountTypes || [],
      fees: broker.fees || {},
      tradable_instruments: broker.tradableInstruments || {},
      trading_conditions: broker.tradingConditions || {},
      deposit_withdrawal: broker.depositWithdrawal || {},
      security: broker.security || {},
      trading_environment: broker.tradingEnvironment || {},
      platform_features: broker.platformFeatures || {},
      account_management: broker.accountManagement || {},
      transparency: broker.transparency || {},
      accessibility: broker.accessibility || {},
      
      // Rating breakdown
      regulation_rating: broker.ratings?.regulation || 0,
      costs_rating: broker.ratings?.costs || 0,
      platforms_rating: broker.ratings?.platforms || 0,
      support_rating: broker.ratings?.support || 0,
      average_rating: broker.ratings ? 
        (broker.ratings.regulation + broker.ratings.costs + broker.ratings.platforms + broker.ratings.support) / 4 : 0
    };

    console.log('📝 Inserting basic broker info:', brokerData.name);
    await this.insertIntoBrokerTable(brokerData);
  }

  private async insertIntoBrokerTable(brokerData: any): Promise<void> {
    // Use your Supabase client to insert data
    const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
    const supabase = (brokerDatabaseService as any).supabase;
    
    const { error } = await supabase
      .from('brokers')
      .insert([brokerData]);

    if (error) {
      console.error('Error inserting broker:', error);
      throw error;
    }
  }


  private async insertBrokerPlatforms(broker: any): Promise<void> {
    if (!broker.technology?.platforms) return;
    
    const platforms = broker.technology.platforms;
    const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
    const supabase = (brokerDatabaseService as any).supabase;
    
    for (const platformName of platforms) {
      const platformData = {
        broker_id: broker.id,
        name: platformName,
        type: this.getPlatformType(platformName),
        api_access: broker.technology?.apiAccess ?? false,
        ea_support: broker.technology?.eaSupport ?? false,
        indicators_count: broker.platformFeatures?.charting?.indicators || 50,
        drawing_tools_count: broker.platformFeatures?.charting?.drawingTools || 20
      };

      console.log(`💻 Inserting platform: ${platformName}`);
      const { error } = await supabase
        .from('broker_platforms')
        .insert([platformData]);
      
      if (error) {
        console.error(`Error inserting platform ${platformName}:`, error);
        throw error;
      }
    }
  }

  private async insertBrokerRegulations(broker: any): Promise<void> {
    if (!broker.security?.regulatedBy) return;
    
    const regulations = broker.security.regulatedBy;
    const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
    const supabase = (brokerDatabaseService as any).supabase;
    
    for (const regulation of regulations) {
      const regulationData = {
        broker_id: broker.id,
        authority: regulation.regulator,
        license_number: regulation.licenseNumber || 'Licensed',
        status: 'Active'
      };

      console.log(`🛡️ Inserting regulation: ${regulation.regulator}`);
      const { error } = await supabase
        .from('broker_regulations')
        .insert([regulationData]);
      
      if (error) {
        console.error(`Error inserting regulation ${regulation.regulator}:`, error);
        throw error;
      }
    }
  }


  private async insertBrokerInstruments(broker: any): Promise<void> {
    if (!broker.tradableInstruments) return;
    
    const instruments = broker.tradableInstruments;
    const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
    const supabase = (brokerDatabaseService as any).supabase;
    
    const instrumentTypes = [
      { key: 'forexPairs', name: 'forex' },
      { key: 'stocks', name: 'stocks' },
      { key: 'commodities', name: 'commodities' },
      { key: 'indices', name: 'indices' },
      { key: 'cryptocurrencies', name: 'crypto' },
      { key: 'etfs', name: 'etfs' }
    ];

    for (const instrumentType of instrumentTypes) {
      const instrumentData = instruments[instrumentType.key];
      if (instrumentData) {
        const data = {
          broker_id: broker.id,
          instrument_type: instrumentType.name,
          available: true,
          total_count: typeof instrumentData === 'object' ? instrumentData.total : instrumentData,
          details: typeof instrumentData === 'object' ? instrumentData.details : `${instrumentType.name} trading`
        };

        console.log(`📈 Inserting instrument: ${instrumentType.name}`);
        const { error } = await supabase
          .from('broker_trading_instruments')
          .insert([data]);
        
        if (error) {
          console.error(`Error inserting instrument ${instrumentType.name}:`, error);
          throw error;
        }
      }
    }
  }



  private async insertBrokerSupport(broker: any): Promise<void> {
    if (!broker.customerSupport) return;
    
    const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
    const supabase = (brokerDatabaseService as any).supabase;
    
    // Insert support entry for each language
    const languages = broker.customerSupport.languages || ['English'];
    
    for (const language of languages) {
      const supportData = {
        broker_id: broker.id,
        language: language,
        availability: broker.customerSupport.hours || '24/5',
        methods: broker.customerSupport.channels || ['Email']
      };

      console.log(`📞 Inserting support info for ${language}`);
      const { error } = await supabase
        .from('broker_customer_support')
        .insert([supportData]);
      
      if (error) {
        console.error(`Error inserting support for ${language}:`, error);
        throw error;
      }
    }
  }

  private async insertBrokerReviews(broker: any): Promise<void> {
    if (!broker.reviews || broker.reviews.length === 0) return;
    
    const { brokerDatabaseService } = await import('../services/brokerDatabaseService');
    const supabase = (brokerDatabaseService as any).supabase;
    
    for (const review of broker.reviews) {
      const reviewData = {
        broker_id: broker.id,
        rating: review.rating,
        title: `Review by ${review.userName}`,
        content: review.comment,
        verified: review.verified ?? false
      };

      console.log(`📝 Inserting review from ${review.userName}`);
      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);
      
      if (error) {
        console.error(`Error inserting review from ${review.userName}:`, error);
        throw error;
      }
    }
  }

  private getPlatformType(platformName: string): string {
    const name = platformName.toLowerCase();
    if (name.includes('mobile') || name.includes('app')) return 'mobile';
    if (name.includes('web') || name.includes('portal')) return 'web';
    return 'desktop';
  }

  private getRegulatorJurisdiction(regulator: string): string {
    const jurisdictionMap: { [key: string]: string } = {
      'FCA': 'United Kingdom',
      'ASIC': 'Australia',
      'CySEC': 'Cyprus',
      'SEC': 'United States',
      'FINRA': 'United States',
      'NFA': 'United States',
      'CFTC': 'United States',
      'FINMA': 'Switzerland',
      'BaFin': 'Germany',
      'MAS': 'Singapore',
      'FSA': 'Japan',
      'DFSA': 'UAE'
    };

    return jurisdictionMap[regulator] || 'International';
  }

  private printMigrationSummary(): void {
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful migrations: ${successful}`);
    console.log(`❌ Failed migrations: ${failed}`);
    console.log(`📊 Total processed: ${this.results.length}`);
    console.log(`📈 Success rate: ${((successful / this.results.length) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ FAILED MIGRATIONS:');
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`- ${result.brokerId}: ${result.errors.join(', ')}`);
        });
    }

    console.log('\n🎉 Migration completed!');
    console.log('💡 Next steps:');
    console.log('1. Update your routes to use BrokerDetailPageTemplate');
    console.log('2. Test the new database-driven broker pages');
    console.log('3. Remove the old brokers.ts file when confident');
    console.log('4. Set up database backups and maintenance');
  }
}

// Main execution
async function runMigration() {
  try {
    const migration = new BrokerDataMigration();
    await migration.migrateAllBrokers();
  } catch (error) {
    console.error('🚨 Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

export { BrokerDataMigration, runMigration };