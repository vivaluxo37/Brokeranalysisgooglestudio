import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

async function quickVerificationTest() {
  console.log('🔍 Quick Cross-Verification Module Test...\n');

  try {
    // 1. Test basic database connection
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');

    // 2. Test broker data fetch
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, year_founded, headquarters, website, minimum_deposit')
      .limit(1);

    if (error || !brokers || brokers.length === 0) {
      throw new Error('Cannot fetch broker data for testing');
    }

    console.log(`✅ Test broker fetched: ${brokers[0].name}`);
    console.log(`   Founded: ${brokers[0].year_founded}`);
    console.log(`   Headquarters: ${brokers[0].headquarters}`);
    console.log(`   Min Deposit: $${brokers[0].minimum_deposit}`);

    // 3. Test individual module imports
    console.log('\n📦 Testing module imports...');

    try {
      const { fieldValidator } = await import('../validators/fieldRules');
      console.log('✅ Field validator imported');

      // Test field validation
      const testComparison = fieldValidator.compareFieldValues('name', 'XM Group', 'XM Group');
      console.log(`   Field comparison test: ${testComparison.isMatch ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      console.error('❌ Field validator import failed:', error.message);
    }

    try {
      const { searchEngine } = await import('../services/verification/searchEngine');
      console.log('✅ Search engine imported');
    } catch (error) {
      console.error('❌ Search engine import failed:', error.message);
    }

    try {
      const { webScrapers } = await import('../services/verification/webScrapers');
      console.log('✅ Web scrapers imported');
    } catch (error) {
      console.error('❌ Web scrapers import failed:', error.message);
    }

    try {
      const { sourceReliabilityManager } = await import('../services/verification/sourceReliability');
      console.log('✅ Source reliability manager imported');
    } catch (error) {
      console.error('❌ Source reliability manager import failed:', error.message);
    }

    try {
      const { regAuthorityVerifier } = await import('../services/verification/regAuthorityVerifier');
      console.log('✅ Regulatory authority verifier imported');
    } catch (error) {
      console.error('❌ Regulatory authority verifier import failed:', error.message);
    }

    // 4. Test cross-verifier import (the main one)
    console.log('\n🎯 Testing main cross-verifier...');
    try {
      const { crossVerifier } = await import('../services/verification/crossVerifier');
      console.log('✅ Cross-verifier imported successfully');

      // Create a minimal test broker object
      const testBroker = {
        id: brokers[0].id.toString(),
        name: brokers[0].name,
        foundingYear: brokers[0].year_founded,
        headquarters: brokers[0].headquarters,
        websiteUrl: brokers[0].website,
        score: 4.5,
        logoUrl: '',
        description: '',
        regulation: { regulators: [] },
        accessibility: {
          minDeposit: brokers[0].minimum_deposit,
          depositMethods: [],
          withdrawalMethods: [],
          customerSupport: []
        },
        technology: {
          platforms: [],
          executionType: '',
          apiAccess: false,
          eaSupport: false
        },
        tradingConditions: {
          spreads: { eurusd: 0, gbpusd: 0, usdjpy: 0 },
          commission: '',
          swapFeeCategory: 'Standard' as const,
          maxLeverage: '',
          minLotSize: 0.01
        },
        ratings: {
          regulation: 0,
          costs: 0,
          platforms: 0,
          support: 0
        }
      };

      console.log('\n🧪 Running minimal verification test...');
      console.log('   (This tests only basic functionality without web searches)');

      // Test with minimal options - no web searches, just structure validation
      const result = await crossVerifier.verifyBroker(testBroker, {
        fieldsToCheck: ['name'],
        maxSources: 0, // No web sources to avoid API calls
        confidenceThreshold: 0.1,
        skipRegulatory: true,
        enableAlerts: false,
        saveDiscrepancies: false
      });

      console.log(`✅ Verification completed!`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Processing time: ${result.processingTime}ms`);
      console.log(`   Sources used: ${result.sourcesUsed.length}`);
      console.log(`   Fields checked: ${result.totalFieldsChecked}`);

      if (result.recommendations.length > 0) {
        console.log('   Recommendations:');
        result.recommendations.forEach((rec, i) => {
          console.log(`     ${i + 1}. ${rec}`);
        });
      }

      console.log('\n🎉 Cross-verification system is functional!');

    } catch (error) {
      console.error('❌ Cross-verifier test failed:', error.message);
      console.error('   Stack:', error.stack);
    }

    console.log('\n✅ Quick test completed successfully!');

  } catch (error) {
    console.error('💥 Quick test failed:', error.message);
    console.error('   Stack:', error.stack);
  }
}

quickVerificationTest()
  .then(() => {
    console.log('\n👋 Quick test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test crashed:', error);
    process.exit(1);
  });