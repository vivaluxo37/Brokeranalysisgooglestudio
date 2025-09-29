/**
 * MCP Server Startup Script
 * Properly configures and starts the Supabase MCP server with timeout handling
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration from .env and mcp-config.json
const SUPABASE_ACCESS_TOKEN = 'sbp_d8b84d2a17acb3603811c6961b71a1740ada5c5c';
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY';

function startMCPServer() {
    console.log('🚀 Starting Supabase MCP Server...');
    console.log('=====================================');
    
    // Set up environment variables
    const env = {
        ...process.env,
        SUPABASE_ACCESS_TOKEN,
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        PORT: '3000',
        NODE_ENV: 'development'
    };
    
    // Start the MCP server using the configuration from mcp-config.json
    const mcpProcess = spawn('npx', [
        '-y',
        '@supabase/mcp-server-supabase@latest'
    ], {
        env,
        stdio: 'pipe',
        shell: true
    });
    
    console.log(`📡 MCP Server started with PID: ${mcpProcess.pid}`);
    console.log('🌐 Server should be available at: http://localhost:3000');
    
    // Handle stdout
    mcpProcess.stdout.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
            console.log(`[MCP] ${message}`);
        }
    });
    
    // Handle stderr
    mcpProcess.stderr.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
            console.error(`[MCP Error] ${message}`);
        }
    });
    
    // Handle process exit
    mcpProcess.on('exit', (code, signal) => {
        if (code === 0) {
            console.log('✅ MCP Server exited successfully');
        } else {
            console.error(`❌ MCP Server exited with code: ${code}, signal: ${signal}`);
        }
    });
    
    // Handle process errors
    mcpProcess.on('error', (error) => {
        console.error('❌ Failed to start MCP Server:', error.message);
    });
    
    // Wait for server to be ready
    setTimeout(async () => {
        try {
            console.log('🔍 Testing server readiness...');
            const response = await fetch('http://localhost:3000/health', {
                timeout: 5000
            }).catch(() => {
                // If health endpoint doesn't exist, try a simple request
                return fetch('http://localhost:3000', { timeout: 5000 });
            });
            
            if (response.status < 500) {
                console.log('✅ MCP Server is ready and responding');
                console.log('💡 You can now use the execute SQL tools');
            } else {
                console.log(`⚠️  MCP Server responding but may have issues (status: ${response.status})`);
            }
        } catch (error) {
            console.log('⚠️  Server may still be starting up or have configuration issues');
            console.log('   Error:', error.message);
        }
    }, 3000);
    
    // Keep the process alive
    process.on('SIGINT', () => {
        console.log('\\n🛑 Shutting down MCP Server...');
        mcpProcess.kill('SIGTERM');
        setTimeout(() => {
            mcpProcess.kill('SIGKILL');
            process.exit(0);
        }, 5000);
    });
    
    return mcpProcess;
}

async function testDatabaseAfterStartup() {
    // Wait a bit for server to fully start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\\n🧪 RUNNING POST-STARTUP DATABASE TEST');
    console.log('=====================================');
    
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data, error } = await Promise.race([
            supabase.from('brokers').select('id, name').limit(1),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Query timeout')), 10000)
            )
        ]);
        
        if (error) {
            console.log('❌ Database test failed:', error.message);
        } else {
            console.log('✅ Database connection verified');
            console.log('   Sample data:', data);
        }
        
    } catch (error) {
        console.log('❌ Post-startup test failed:', error.message);
    }
}

console.log('🎯 MCP SERVER MANAGEMENT');
console.log('Press Ctrl+C to stop the server');
console.log('========================\\n');

const serverProcess = startMCPServer();
testDatabaseAfterStartup();