/**
 * Manual Blog Table Creation Script
 * 
 * Since the exec_sql function is not available, we'll create the table manually
 * by using the Supabase client to check and inform about the required schema.
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - correct credentials
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY';

class BlogTableManager {
    constructor() {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            realtime: {
                params: {
                    eventsPerSecond: 2,
                },
            },
            auth: {
                persistSession: false
            }
        });
    }

    async checkBlogsTable() {
        console.log('🔍 Checking if blogs table exists...');
        
        try {
            // Try to query the blogs table
            const { data, error } = await this.supabase
                .from('blogs')
                .select('id')
                .limit(1);

            if (error && error.message.includes('does not exist')) {
                console.log('❌ Blogs table does not exist');
                return false;
            } else if (error) {
                console.log('⚠️ Error checking blogs table:', error.message);
                return false;
            } else {
                console.log('✅ Blogs table exists');
                return true;
            }
        } catch (error) {
            console.log('❌ Error checking blogs table:', error.message);
            return false;
        }
    }

    async checkBrokersTable() {
        console.log('🔍 Checking brokers table...');
        
        try {
            const { data, error } = await this.supabase
                .from('brokers')
                .select('id, name')
                .limit(1);

            if (error) {
                console.log('❌ Brokers table check failed:', error.message);
                return false;
            } else {
                console.log(`✅ Brokers table exists with ${data?.length || 0} records (sample)`);
                return true;
            }
        } catch (error) {
            console.log('❌ Error checking brokers table:', error.message);
            return false;
        }
    }

    async listTables() {
        console.log('📋 Attempting to list available tables...');
        
        try {
            // Try to get information from information_schema if available
            console.log('Available table operations through Supabase client:');
            
            // Check various common tables
            const tableChecks = [
                'brokers',
                'blogs', 
                'reviews',
                'promotions'
            ];

            for (const tableName of tableChecks) {
                try {
                    const { data, error } = await this.supabase
                        .from(tableName)
                        .select('*', { count: 'exact', head: true });
                    
                    if (error) {
                        console.log(`❌ ${tableName}: ${error.message}`);
                    } else {
                        console.log(`✅ ${tableName}: ${data?.count || 0} records`);
                    }
                } catch (err) {
                    console.log(`❌ ${tableName}: ${err.message}`);
                }
            }

        } catch (error) {
            console.log('❌ Error listing tables:', error.message);
        }
    }

    displayBlogTableSchema() {
        console.log('📝 REQUIRED BLOGS TABLE SCHEMA');
        console.log('===============================');
        console.log(`
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    summary TEXT,
    content TEXT,
    author_name TEXT,
    author_slug TEXT,
    author_avatar TEXT,
    date TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    image_url TEXT,
    read_time_minutes INTEGER,
    key_takeaways JSONB,
    reviewed_by JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
        console.log('✨ You can create this table manually in your Supabase dashboard:');
        console.log('   1. Go to https://supabase.com/dashboard');
        console.log('   2. Open your project');
        console.log('   3. Go to "SQL Editor"');
        console.log('   4. Paste the above SQL');
        console.log('   5. Click "Run"');
    }

    async attemptDirectTableCreation() {
        console.log('🔧 Attempting direct table creation...');
        
        // Try to create the table by inserting a test record and seeing what happens
        const testBlog = {
            slug: 'test-blog-creation',
            title: 'Test Blog Creation',
            meta_title: 'Test',
            meta_description: 'Test description',
            summary: 'Test summary',
            content: 'Test content',
            author_name: 'Test Author',
            author_slug: 'test-author',
            author_avatar: '/test.jpg',
            date: new Date().toISOString(),
            tags: ['test'],
            image_url: '/test-image.jpg',
            read_time_minutes: 1,
            key_takeaways: ['Test takeaway'],
            reviewed_by: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        try {
            const { data, error } = await this.supabase
                .from('blogs')
                .insert([testBlog])
                .select();

            if (error) {
                if (error.message.includes('does not exist')) {
                    console.log('❌ Table does not exist - needs to be created manually');
                    return false;
                } else {
                    console.log('⚠️ Table might exist but insert failed:', error.message);
                }
            } else {
                console.log('✅ Test blog inserted successfully - table exists!');
                
                // Clean up test record
                await this.supabase
                    .from('blogs')
                    .delete()
                    .eq('slug', 'test-blog-creation');
                
                console.log('✅ Test record cleaned up');
                return true;
            }
        } catch (error) {
            console.log('❌ Direct table creation attempt failed:', error.message);
            return false;
        }

        return false;
    }

    async execute() {
        console.log('🛠️  MANUAL BLOG TABLE CREATION HELPER');
        console.log('=====================================');
        console.log(`Start time: ${new Date().toISOString()}`);

        // Check connection
        console.log('\n🔌 Testing Supabase connection...');
        const brokersOK = await this.checkBrokersTable();
        
        if (!brokersOK) {
            console.log('❌ Cannot connect to Supabase properly');
            return { success: false };
        }

        // Check if blogs table exists
        const blogsExist = await this.checkBlogsTable();
        
        if (blogsExist) {
            console.log('\n🎉 Blogs table already exists!');
            console.log('You can now run the blog migration script.');
            return { success: true, tableExists: true };
        }

        // Show available tables
        console.log('\n📋 CURRENT DATABASE STATE');
        console.log('=========================');
        await this.listTables();

        // Try direct creation
        console.log('\n🔧 ATTEMPTING DIRECT CREATION');
        console.log('==============================');
        const directCreated = await this.attemptDirectTableCreation();
        
        if (directCreated) {
            console.log('\n🎉 Blogs table created successfully!');
            return { success: true, tableCreated: true };
        }

        // Display manual instructions
        console.log('\n📝 MANUAL CREATION REQUIRED');
        console.log('============================');
        this.displayBlogTableSchema();

        console.log('\n⚠️ NEXT STEPS:');
        console.log('1. Create the blogs table manually using the SQL above');
        console.log('2. Run this script again to verify');
        console.log('3. Then run the blog migration script');

        return { success: false, needsManualCreation: true };
    }
}

// Execute if run directly
if (require.main === module) {
    const manager = new BlogTableManager();
    manager.execute()
        .then(result => {
            if (result.success) {
                console.log('\n✅ Ready to proceed with blog migration!');
                process.exit(0);
            } else {
                console.log('\n⚠️ Manual intervention required.');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { BlogTableManager };