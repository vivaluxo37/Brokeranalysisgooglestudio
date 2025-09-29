import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sdanjzsxwczlwsgspihb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY'
);

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const { data, error, count } = await supabase
      .from('brokers')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.error('❌ Database error:', error);
      return;
    }

    console.log('✅ Database connected successfully!');
    console.log(`📊 Total brokers: ${count}`);
    console.log('🔍 Sample data:');
    console.log(JSON.stringify(data[0], null, 2));
    
  } catch (err) {
    console.error('💥 Connection failed:', err);
  }
}

testConnection();