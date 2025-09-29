const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzU4Nzk0NCwiZXhwIjoyMDQzMTYzOTQ0fQ.p2wNMfx1_8qc6wKNSkGLnUNEiJwgvCFjPk7p8Cz15pI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Import broker and blog data
// Note: We'll need to convert TS files to JS or handle them differently
// For now, we'll handle this in the script execution

async function clearExistingData() {
  console.log('Clearing existing data...');
  
  // Clear in reverse order due to foreign key constraints
  await supabase.from('reviews').delete().neq('id', 0);
  await supabase.from('blog_posts').delete().neq('id', 0);
  await supabase.from('brokers').delete().neq('id', 0);
  
  console.log('Existing data cleared.');
}

function transformBrokerData(broker, index) {
  return {
    name: broker.name,
    slug: broker.id, // Use the id as slug for consistency
    description: broker.description || broker.summary,
    website: broker.websiteUrl,
    year_founded: broker.foundingYear,
    headquarters: broker.headquarters,
    regulation_status: broker.security?.regulatedBy?.length > 0 ? 'regulated' : 'unregulated',
    minimum_deposit: broker.accessibility?.minDeposit || broker.accountTypes?.[0]?.minDeposit || 0,
    overall_rating: broker.score || 0,
    trust_score: broker.ratings?.regulation || broker.score || 0,
    is_active: true,
    is_featured: index < 10, // Mark first 10 as featured
    logo_url: broker.logoUrl,
    // Store complex data as JSONB
    account_types: JSON.stringify(broker.accountTypes || []),
    fees: JSON.stringify(broker.fees || {}),
    tradable_instruments: JSON.stringify(broker.tradableInstruments || {}),
    trading_conditions: JSON.stringify(broker.tradingConditionsExtended || broker.tradingConditions || {}),
    deposit_withdrawal: JSON.stringify(broker.depositWithdrawal || broker.accessibility || {}),
    customer_support: JSON.stringify(broker.customerSupport || {}),
    security: JSON.stringify(broker.security || {}),
    trading_environment: JSON.stringify(broker.tradingEnvironment || {}),
    platform_features: JSON.stringify(broker.platformFeatures || {}),
    account_management: JSON.stringify(broker.accountManagement || {}),
    transparency: JSON.stringify(broker.transparency || {}),
    platforms: JSON.stringify(broker.technology?.platforms || []),
    pros: JSON.stringify(broker.pros || []),
    cons: JSON.stringify(broker.cons || []),
    ratings: JSON.stringify(broker.ratings || {}),
    core_info: JSON.stringify(broker.coreInfo || {}),
    accessibility: JSON.stringify({
      minDeposit: broker.accessibility?.minDeposit || 0,
      depositMethods: broker.accessibility?.depositMethods || [],
      withdrawalMethods: broker.accessibility?.withdrawalMethods || [],
      customerSupport: broker.accessibility?.customerSupport || []
    })
  };
}

function transformBlogPostData(blogPost) {
  return {
    title: blogPost.title,
    slug: blogPost.slug,
    content: blogPost.content,
    excerpt: blogPost.summary,
    featured_image: blogPost.imageUrl,
    category: blogPost.tags?.[0] || 'forex',
    tags: blogPost.tags || [],
    read_time: blogPost.readTimeMinutes || 5,
    is_published: true,
    is_featured: blogPost.slug.includes('forex-broker') || blogPost.slug.includes('ecn-vs-market'),
    view_count: Math.floor(Math.random() * 1000) + 100, // Random view count for demonstration
    meta_title: blogPost.metaTitle,
    meta_description: blogPost.metaDescription,
    published_at: blogPost.date,
    // author_id will be null for now as we don't have user authentication set up
    author_id: null
  };
}

async function migrateBrokers() {
  console.log(`Migrating ${brokers.length} brokers...`);
  
  const transformedBrokers = brokers.map((broker, index) => transformBrokerData(broker, index));
  
  // Insert in batches to avoid timeout
  const batchSize = 10;
  for (let i = 0; i < transformedBrokers.length; i += batchSize) {
    const batch = transformedBrokers.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('brokers')
      .insert(batch);
    
    if (error) {
      console.error(`Error inserting broker batch ${i}-${i + batch.length}:`, error);
    } else {
      console.log(`Successfully inserted brokers ${i + 1}-${Math.min(i + batch.length, transformedBrokers.length)}`);
    }
  }
}

async function migrateBlogPosts() {
  console.log(`Migrating ${blogPosts.length} blog posts...`);
  
  const transformedBlogPosts = blogPosts.map(transformBlogPostData);
  
  const { error } = await supabase
    .from('blog_posts')
    .insert(transformedBlogPosts);
  
  if (error) {
    console.error('Error inserting blog posts:', error);
  } else {
    console.log(`Successfully inserted ${transformedBlogPosts.length} blog posts`);
  }
}

async function extractAndMigrateReviews() {
  console.log('Extracting and migrating reviews...');
  
  // First, get the broker IDs from the database
  const { data: dbBrokers, error: brokerError } = await supabase
    .from('brokers')
    .select('id, slug');
  
  if (brokerError) {
    console.error('Error fetching brokers:', brokerError);
    return;
  }
  
  const brokerSlugToId = {};
  dbBrokers.forEach(broker => {
    brokerSlugToId[broker.slug] = broker.id;
  });
  
  // Extract reviews from broker data
  const reviews = [];
  brokers.forEach(broker => {
    if (broker.reviews && broker.reviews.length > 0) {
      broker.reviews.forEach(review => {
        const brokerId = brokerSlugToId[broker.id];
        if (brokerId) {
          reviews.push({
            broker_id: brokerId,
            rating: review.rating,
            title: `Review of ${broker.name}`,
            content: review.comment,
            trading_experience: 'more_than_10_years', // Default value
            account_type: 'standard', // Default value
            verified_trader: review.verified || false,
            is_featured: review.rating >= 4.5,
            is_approved: true,
            created_at: review.date,
            // user_id will be null as we don't have user auth
            user_id: null
          });
        }
      });
    }
  });
  
  if (reviews.length > 0) {
    const { error } = await supabase
      .from('reviews')
      .insert(reviews);
    
    if (error) {
      console.error('Error inserting reviews:', error);
    } else {
      console.log(`Successfully inserted ${reviews.length} reviews`);
    }
  } else {
    console.log('No reviews found to migrate');
  }
}

async function verifyMigration() {
  console.log('\nVerifying migration...');
  
  const { data: brokerCount } = await supabase
    .from('brokers')
    .select('id', { count: 'exact', head: true });
  
  const { data: blogCount } = await supabase
    .from('blog_posts')
    .select('id', { count: 'exact', head: true });
  
  const { data: reviewCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true });
  
  console.log(`Final counts:`);
  console.log(`- Brokers: ${brokerCount?.length || 'N/A'}`);
  console.log(`- Blog Posts: ${blogCount?.length || 'N/A'}`);
  console.log(`- Reviews: ${reviewCount?.length || 'N/A'}`);
}

async function main() {
  try {
    console.log('Starting complete data migration...');
    
    await clearExistingData();
    await migrateBrokers();
    await migrateBlogPosts();
    await extractAndMigrateReviews();
    await verifyMigration();
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };