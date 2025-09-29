import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function testImports() {
  console.log('🔍 Testing imports...');

  try {
    // Test basic dependencies first
    console.log('✅ dotenv imported');
    console.log('✅ supabase-js imported');

    // Test Supabase connection
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase configuration');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created');

    // Test database connection
    const { count, error } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }

    console.log('✅ Database connection successful');

    // Test getting a sample broker
    const { data: brokers, error: brokerError } = await supabase
      .from('brokers')
      .select('*')
      .limit(1);

    if (brokerError) {
      console.error('❌ Failed to fetch brokers:', brokerError);
      return;
    }

    if (brokers && brokers.length > 0) {
      console.log(`✅ Found sample broker: ${brokers[0].name}`);
      
      // Test types import
      try {
        const { Broker } = await import('../types');
        console.log('✅ Types imported successfully');
      } catch (typeError) {
        console.error('❌ Failed to import types:', typeError);
      }

      // Test field validator import
      try {
        const { fieldValidator } = await import('../validators/fieldRules');
        console.log('✅ Field validator imported successfully');
      } catch (validatorError) {
        console.error('❌ Failed to import field validator:', validatorError);
      }

      // Test verification services imports
      const services = [
        '../services/verification/searchEngine',
        '../services/verification/webScrapers', 
        '../services/verification/regAuthorityVerifier',
        '../services/verification/sourceReliability'
      ];

      for (const servicePath of services) {
        try {
          await import(servicePath);
          console.log(`✅ ${servicePath.split('/').pop()} imported successfully`);
        } catch (serviceError) {
          console.error(`❌ Failed to import ${servicePath}:`, serviceError);
        }
      }

      // Finally try cross-verifier
      try {
        const { crossVerifier } = await import('../services/verification/crossVerifier');
        console.log('✅ Cross-verifier imported successfully');

        // Try to run a very simple test
        console.log('\n🧪 Running basic verification test...');
        console.log('  (This may take a while as it involves web searches)');

        const result = await crossVerifier.verifyBroker(brokers[0], {
          fieldsToCheck: ['name'], // Just test one field
          maxSources: 1, // Just one source
          confidenceThreshold: 0.3,
          skipRegulatory: true,
          enableAlerts: false,
          saveDiscrepancies: false
        });

        console.log('🎉 Cross-verification test completed!');
        console.log(`   Status: ${result.status}`);
        console.log(`   Confidence: ${result.overallConfidence.toFixed(3)}`);
        console.log(`   Processing Time: ${result.processingTime}ms`);
        console.log(`   Sources Used: ${result.sourcesUsed.length}`);

      } catch (crossVerifierError) {
        console.error('❌ Failed to import or run cross-verifier:', crossVerifierError);
      }

    } else {
      console.log('⚠️  No brokers found in database');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test when this file is executed directly
testImports()
  .then(() => {
    console.log('\n👋 Import test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import test crashed:', error);
    process.exit(1);
  });

export { testImports };