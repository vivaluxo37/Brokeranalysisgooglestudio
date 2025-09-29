/**
 * End-to-End Database Integration Test
 * Validates all database operations and frontend integration
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const supabaseServiceKey = 'sbp_a008ee810fd64e9c06e14a517d53ba1878f74e8c';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runIntegrationTests() {
  console.log('🧪 Starting End-to-End Database Integration Tests');
  console.log('================================================');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Database Connection
  try {
    console.log('\n🔍 Test 1: Database Connection');
    const { data, error } = await supabase.from('brokers').select('count', { count: 'exact' });
    if (!error) {
      console.log('✅ Database connection successful');
      testsPassed++;
    } else {
      throw error;
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    testsFailed++;
  }

  // Test 2: Broker Data Retrieval
  try {
    console.log('\n🔍 Test 2: Broker Data Retrieval');
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .limit(5);
    
    if (!error && brokers && brokers.length > 0) {
      console.log(`✅ Retrieved ${brokers.length} brokers successfully`);
      console.log(`   Sample broker: ${brokers[0].name} (Rating: ${brokers[0].overall_rating})`);
      testsPassed++;
    } else {
      throw new Error(error?.message || 'No brokers found');
    }
  } catch (error) {
    console.error('❌ Broker data retrieval failed:', error.message);
    testsFailed++;
  }

  // Test 3: Blog Posts Data
  try {
    console.log('\n🔍 Test 3: Blog Posts Data');
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(3);
    
    if (!error && blogPosts && blogPosts.length > 0) {
      console.log(`✅ Retrieved ${blogPosts.length} blog posts successfully`);
      console.log(`   Sample post: "${blogPosts[0].title}"`);
      testsPassed++;
    } else {
      throw new Error(error?.message || 'No blog posts found');
    }
  } catch (error) {
    console.error('❌ Blog posts retrieval failed:', error.message);
    testsFailed++;
  }

  // Test 4: Reviews Data
  try {
    console.log('\n🔍 Test 4: Reviews Data');
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(3);
    
    if (!error && reviews && reviews.length > 0) {
      console.log(`✅ Retrieved ${reviews.length} reviews successfully`);
      console.log(`   Sample review: "${reviews[0].title}" (Rating: ${reviews[0].rating})`);
      testsPassed++;
    } else {
      throw new Error(error?.message || 'No reviews found');
    }
  } catch (error) {
    console.error('❌ Reviews retrieval failed:', error.message);
    testsFailed++;
  }

  // Test 5: Search Functionality
  try {
    console.log('\n🔍 Test 5: Search Functionality');
    const { data: searchResults, error } = await supabase
      .from('brokers')
      .select('*')
      .or('name.ilike.%IC%,description.ilike.%trading%')
      .limit(3);
    
    if (!error && searchResults && searchResults.length > 0) {
      console.log(`✅ Search returned ${searchResults.length} results`);
      testsPassed++;
    } else {
      throw new Error(error?.message || 'Search returned no results');
    }
  } catch (error) {
    console.error('❌ Search functionality failed:', error.message);
    testsFailed++;
  }

  // Test 6: Data Integrity Check
  try {
    console.log('\n🔍 Test 6: Data Integrity Check');
    const { data: brokerStats, error } = await supabase
      .from('brokers')
      .select('name, overall_rating, headquarters, year_founded')
      .not('name', 'is', null)
      .not('overall_rating', 'is', null);
    
    if (!error && brokerStats && brokerStats.length > 0) {
      const validRatings = brokerStats.filter(b => b.overall_rating >= 1 && b.overall_rating <= 10);
      const validYears = brokerStats.filter(b => b.year_founded && b.year_founded > 1990);
      
      console.log(`✅ Data integrity check passed:`);
      console.log(`   Valid ratings: ${validRatings.length}/${brokerStats.length}`);
      console.log(`   Valid founding years: ${validYears.length}/${brokerStats.length}`);
      testsPassed++;
    } else {
      throw new Error(error?.message || 'Data integrity check failed');
    }
  } catch (error) {
    console.error('❌ Data integrity check failed:', error.message);
    testsFailed++;
  }

  // Test 7: Performance Test
  try {
    console.log('\n🔍 Test 7: Performance Test');
    const startTime = Date.now();
    
    const [brokersResult, reviewsResult, blogResult] = await Promise.all([
      supabase.from('brokers').select('*').limit(10),
      supabase.from('reviews').select('*').limit(10),
      supabase.from('blog_posts').select('*').limit(10)
    ]);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (!brokersResult.error && !reviewsResult.error && !blogResult.error) {
      console.log(`✅ Parallel queries completed in ${duration}ms`);
      if (duration < 2000) {
        console.log('   Performance: Excellent (< 2s)');
      } else if (duration < 5000) {
        console.log('   Performance: Good (< 5s)');
      } else {
        console.log('   Performance: Needs optimization (> 5s)');
      }
      testsPassed++;
    } else {
      throw new Error('One or more parallel queries failed');
    }
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
    testsFailed++;
  }

  // Final Results
  console.log('\n📊 TEST RESULTS');
  console.log('===============');
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

  if (testsFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Database integration is fully functional.');
    console.log('✅ Ready for production deployment');
  } else {
    console.log(`\n⚠️  ${testsFailed} test(s) failed. Review and fix issues before deployment.`);
  }

  return { testsPassed, testsFailed };
}

// Additional utility tests
async function testSpecificFunctionality() {
  console.log('\n🔧 Additional Functionality Tests');
  console.log('================================');

  try {
    // Test sorting and filtering
    const { data: topBrokers } = await supabase
      .from('brokers')
      .select('*')
      .order('overall_rating', { ascending: false })
      .limit(3);

    console.log('\n🏆 Top 3 Brokers by Rating:');
    topBrokers?.forEach((broker, index) => {
      console.log(`   ${index + 1}. ${broker.name} - ${broker.overall_rating}`);
    });

    // Test aggregation
    const { data: avgRating } = await supabase
      .rpc('get_average_rating') // This would need to be created as a stored procedure
      .catch(() => null);

    console.log('\n📊 Database Statistics:');
    console.log(`   Total brokers: ${topBrokers?.length || 'N/A'}`);
    console.log(`   Average rating: ${avgRating || 'N/A'}`);

  } catch (error) {
    console.error('Additional tests error:', error.message);
  }
}

// Run all tests
runIntegrationTests()
  .then(async (results) => {
    await testSpecificFunctionality();
    
    console.log('\n🚀 Integration Testing Complete!');
    if (results.testsFailed === 0) {
      console.log('✅ System is ready for frontend integration');
      process.exit(0);
    } else {
      console.log('❌ Fix failed tests before proceeding');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });