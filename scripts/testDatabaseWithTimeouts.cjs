/**
 * Database Service with Proper Timeout Handling
 * Prevents hanging SQL operations by implementing comprehensive timeout mechanisms
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration with correct API key from .env
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY';

class DatabaseService {
    constructor() {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        this.defaultTimeout = 10000; // 10 seconds default timeout
    }

    /**
     * Execute a query with timeout protection
     */
    async executeWithTimeout(queryPromise, timeoutMs = this.defaultTimeout) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Query timeout after ${timeoutMs}ms`));
            }, timeoutMs);
        });

        try {
            return await Promise.race([queryPromise, timeoutPromise]);
        } catch (error) {
            console.error('Query execution failed:', error.message);
            throw error;
        }
    }

    /**
     * Test basic database connectivity
     */
    async testConnection() {
        console.log('🔌 Testing database connection...');
        
        try {
            const queryPromise = this.supabase
                .from('brokers')
                .select('id, name')
                .limit(1);

            const { data, error } = await this.executeWithTimeout(queryPromise, 5000);

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            console.log('✅ Connection successful');
            console.log('   Sample data:', data);
            return { success: true, data };

        } catch (error) {
            console.log('❌ Connection failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Execute a custom SQL query with timeout
     */
    async executeSQL(sql, params = [], timeout = 15000) {
        console.log(`🔍 Executing SQL: ${sql.substring(0, 100)}...`);
        
        try {
            // For raw SQL, we'll use the RPC function approach
            const queryPromise = this.supabase.rpc('execute_sql', { 
                query: sql,
                params: params 
            });

            const { data, error } = await this.executeWithTimeout(queryPromise, timeout);

            if (error) {
                throw new Error(`SQL execution error: ${error.message}`);
            }

            console.log('✅ SQL executed successfully');
            return { success: true, data };

        } catch (error) {
            console.log('❌ SQL execution failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all brokers with timeout
     */
    async getAllBrokers() {
        console.log('📊 Fetching all brokers...');
        
        try {
            const queryPromise = this.supabase
                .from('brokers')
                .select('*');

            const { data, error } = await this.executeWithTimeout(queryPromise);

            if (error) {
                throw new Error(`Broker fetch error: ${error.message}`);
            }

            console.log(`✅ Retrieved ${data.length} brokers`);
            return { success: true, data, count: data.length };

        } catch (error) {
            console.log('❌ Broker fetch failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Search brokers by name with timeout
     */
    async searchBrokers(searchTerm) {
        console.log(`🔍 Searching brokers for: "${searchTerm}"`);
        
        try {
            const queryPromise = this.supabase
                .from('brokers')
                .select('id, name, short_description, rating')
                .ilike('name', `%${searchTerm}%`);

            const { data, error } = await this.executeWithTimeout(queryPromise, 8000);

            if (error) {
                throw new Error(`Search error: ${error.message}`);
            }

            console.log(`✅ Found ${data.length} matching brokers`);
            return { success: true, data, count: data.length };

        } catch (error) {
            console.log('❌ Search failed:', error.message);
            return { success: false, error: error.message };
        }
    }
}

async function runComprehensiveTest() {
    console.log('🧪 COMPREHENSIVE DATABASE TEST WITH TIMEOUT HANDLING');
    console.log('====================================================');
    
    const db = new DatabaseService();
    const results = [];

    // Test 1: Basic Connection
    console.log('\\n1️⃣ Testing basic connection...');
    const connectionTest = await db.testConnection();
    results.push({ test: 'Connection', ...connectionTest });

    // Test 2: Get all brokers
    console.log('\\n2️⃣ Testing broker retrieval...');
    const brokersTest = await db.getAllBrokers();
    results.push({ test: 'AllBrokers', ...brokersTest });

    // Test 3: Search functionality
    console.log('\\n3️⃣ Testing search functionality...');
    const searchTest = await db.searchBrokers('XM');
    results.push({ test: 'Search', ...searchTest });

    // Test 4: Custom SQL (if available)
    console.log('\\n4️⃣ Testing custom SQL...');
    const sqlTest = await db.executeSQL('SELECT COUNT(*) as broker_count FROM brokers');
    results.push({ test: 'CustomSQL', ...sqlTest });

    // Summary
    console.log('\\n📋 TEST RESULTS SUMMARY');
    console.log('========================');
    
    const passed = results.filter(r => r.success).length;
    const total = results.length;
    
    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${result.test}: ${result.success ? 'PASSED' : result.error}`);
    });
    
    console.log(`\\n🎯 Overall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('\\n🎉 ALL TESTS PASSED! Database is working properly with timeout handling.');
        console.log('💡 SQL hanging issues should be resolved.');
    } else {
        console.log('\\n⚠️  Some tests failed. Check the errors above for debugging.');
    }

    return results;
}

// Export the service for use in other files
module.exports = { DatabaseService };

// Run tests if this file is executed directly
if (require.main === module) {
    runComprehensiveTest()
        .then(() => {
            console.log('\\n✨ Test complete, exiting...');
            process.exit(0);
        })
        .catch(error => {
            console.error('\\n💥 Test suite failed:', error);
            process.exit(1);
        });
}