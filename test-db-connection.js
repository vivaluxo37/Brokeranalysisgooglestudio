import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

console.log('Testing database connection...');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl ? 'present' : 'missing');
console.log('Key:', supabaseKey ? 'present' : 'missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
    } else {
      console.log('✅ Connection successful:', data);
    }
  } catch (e) {
    console.error('Connection test error:', e);
  }
}

testConnection();