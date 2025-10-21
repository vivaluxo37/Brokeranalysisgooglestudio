# Environment Configuration Guide

## Overview
This guide outlines the required environment variables and configuration steps for the programmatic SEO system.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database Configuration
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### AI Content Generation
```bash
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### Application Settings
```bash
# Node Environment
NODE_ENV=development

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Caching Configuration
```bash
# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password_here
```

### Analytics and Monitoring
```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here

# Sentry (Error Tracking)
SENTRY_DSN=your_sentry_dsn_here
```

## Setup Instructions

### 1. Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Get API Keys**
   - Navigate to Project Settings > API
   - Copy the URL and anon key
   - Generate a service role key for admin operations

3. **Run Database Migration**
   ```sql
   -- Execute the migration script
   -- File: migrations/001_add_programmatic_fields.sql
   ```

### 2. Gemini API Configuration

1. **Get Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key for use in environment variables

2. **Test API Connection**
   ```bash
   curl -X POST \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```

### 3. Redis Configuration (Optional)

1. **Install Redis**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install redis-server
   
   # On macOS
   brew install redis
   
   # On Windows
   # Download from redis.io or use WSL
   ```

2. **Start Redis Server**
   ```bash
   redis-server
   ```

3. **Test Connection**
   ```bash
   redis-cli ping
   ```

## Environment File Template

Create a `.env` file based on this template:

```bash
# ===========================================
# Database Configuration
# ===========================================
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ===========================================
# AI Content Generation
# ===========================================
GEMINI_API_KEY=your_gemini_api_key

# ===========================================
# Application Settings
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000

# ===========================================
# Caching Configuration (Optional)
# ===========================================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# ===========================================
# Analytics and Monitoring
# ===========================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn-here

# ===========================================
# Development Settings
# ===========================================
DEBUG=true
LOG_LEVEL=info
```

## Configuration Validation

### 1. Database Connection Test
```javascript
// Test script: test-db-connection.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('countries').select('count');
    if (error) throw error;
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
```

### 2. Gemini API Test
```javascript
// Test script: test-gemini-api.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeminiAPI() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Hello, world!');
    console.log('✅ Gemini API connection successful');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error.message);
  }
}

testGeminiAPI();
```

## Security Considerations

1. **Never commit `.env` files to version control**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for template

2. **Use different keys for different environments**
   - Development keys
   - Staging keys
   - Production keys

3. **Regularly rotate API keys**
   - Set up key rotation schedule
   - Monitor API usage

4. **Restrict API key permissions**
   - Use最小权限原则
   - Limit IP addresses if possible

## Troubleshooting

### Common Issues

1. **Supabase Connection Failed**
   - Check URL format (should include https://)
   - Verify API key permissions
   - Ensure project is active

2. **Gemini API Errors**
   - Verify API key is valid
   - Check rate limits
   - Ensure proper request format

3. **Redis Connection Issues**
   - Check if Redis server is running
   - Verify URL format
   - Check firewall settings

### Debug Mode

Enable debug mode by setting:
```bash
DEBUG=true
LOG_LEVEL=debug
```

This will provide detailed logging for troubleshooting.

## Production Considerations

1. **Use environment-specific configuration**
2. **Enable all security features**
3. **Set up monitoring and alerting**
4. **Configure backup strategies**
5. **Implement rate limiting**
6. **Set up CDN for static assets**

## Next Steps

1. Create the `.env` file with the required variables
2. Test all connections using the provided test scripts
3. Run the database migration
4. Verify the application starts successfully
5. Test programmatic page generation

For additional support, refer to the main implementation guide or contact the development team.