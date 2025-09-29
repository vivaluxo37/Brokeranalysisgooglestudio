/**
 * Database Connection Diagnostic Script
 * Diagnoses hanging SQL execution issues with Supabase MCP server
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1Njk5ODAsImV4cCI6MjA0MzE0NTk4MH0.hCQNiPBvmNhPNkwCWYHwJRJ9xRW2F_s1EKSz9OOTCws';

async function testDatabaseConnection() {
    console.log('🔍 DATABASE CONNECTION DIAGNOSTIC');
    console.log('=====================================');
    
    // Test 1: Basic Supabase client connection
    console.log('\n1️⃣ Testing Supabase client connection...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client created successfully');
        
        // Test 2: Simple query with timeout
        console.log('\n2️⃣ Testing simple query with timeout...');
        const startTime = Date.now();
        
        const { data, error } = await Promise.race([
            supabase.from('brokers').select('id, name').limit(1),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
            )
        ]);
        
        const elapsed = Date.now() - startTime;
        
        if (error) {
            console.log('❌ Query failed:', error.message);
        } else {
            console.log(`✅ Query succeeded in ${elapsed}ms`);
            console.log('   Data:', data);
        }
        
    } catch (error) {
        console.log('❌ Connection test failed:', error.message);
    }
    
    // Test 3: Check database health
    console.log('\n3️⃣ Testing database health endpoint...');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (response.ok) {
            console.log('✅ Database REST API is responsive');
        } else {
            console.log(`❌ Database REST API returned status: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Database health check failed:', error.message);
    }
    
    // Test 4: Check specific table existence
    console.log('\n4️⃣ Testing table schema...');
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase
            .from('brokers')
            .select('*')
            .limit(0); // Just get schema, no data
            
        if (error) {
            console.log('❌ Table schema test failed:', error.message);
        } else {
            console.log('✅ Brokers table is accessible');
        }
    } catch (error) {
        console.log('❌ Schema test failed:', error.message);
    }
    
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('- If queries are timing out, the MCP server might need restarting');
    console.log('- If connection fails, check network connectivity');
    console.log('- If schema fails, verify table permissions');
}

async function testMCPServerConnection() {
    console.log('\n🌐 MCP SERVER CONNECTION TEST');
    console.log('=====================================');
    
    try {
        // Test if MCP server is responsive
        const testCommand = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'supabase/query',
                params: {
                    query: 'SELECT 1 as test_value'
                }
            })
        };
        
        console.log('Testing MCP server on localhost:3000...');
        const response = await Promise.race([
            fetch('http://localhost:3000', testCommand),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('MCP server timeout')), 5000)
            )
        ]);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ MCP server is responsive');
            console.log('   Response:', result);
        } else {
            console.log(`❌ MCP server returned status: ${response.status}`);
        }
        
    } catch (error) {
        console.log('❌ MCP server connection failed:', error.message);
        console.log('   This might indicate the server is hanging or not responding');
    }
}

async function main() {
    try {
        await testDatabaseConnection();
        await testMCPServerConnection();
        
        console.log('\n🎯 DIAGNOSIS COMPLETE');
        console.log('Check the results above to identify the hanging issue.');
        
    } catch (error) {
        console.error('Diagnostic script failed:', error);
    }
    
    // Force exit to prevent hanging
    setTimeout(() => {
        console.log('\n⏰ Diagnostic complete, exiting...');
        process.exit(0);
    }, 1000);
}

main();