# Backend & Database Agent Setup Guide

## Project Architecture

This broker analysis platform uses a modern serverless architecture:

**Frontend:**
- React + TypeScript + Vite
- Clerk authentication
- Tailwind CSS styling
- Location: `Brokeranalysisgooglestudio/` (main directory)

**Backend API:**
- Vercel serverless functions
- Node.js + TypeScript
- Location: `Brokeranalysisgooglestudio/api/`

**Database:**
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Comprehensive schema with 20+ tables

## Current Environment Configuration

### Frontend (.env in main directory)
```bash
VITE_API_KEY=AIzaSyAjxTe_IQ11ABiHR_Es4jg_odd9CmwaEuQ
VITE_SUPABASE_URL=https://sdanjzsxwczlwsgspihb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW5hYmxpbmcta2F0eWRpZC02MC5jbGVyay5hY2NvdW50cy5kZXYk
```

### API (.env in api/ directory) - NEEDS CONFIGURATION
```bash
# Clerk Authentication (REQUIRED)
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Google AI API (CONFIGURED)
GOOGLE_AI_API_KEY=AIzaSyAjxTe_IQ11ABiHR_Es4jg_odd9CmwaEuQ

# Supabase Database (CONFIGURED)
SUPABASE_URL=https://sdanjzsxwczlwsgspihb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Vercel Blob Storage (OPTIONAL)
BLOB_READ_WRITE_TOKEN=your_blob_rw_token_here

# Security (CONFIGURED)
ALLOWED_ORIGINS=http://localhost:5184,https://your-frontend-domain.vercel.app
```

## Available API Endpoints

### Core Endpoints
- **GET /api/brokers** - List brokers with filtering and pagination
- **GET /api/brokers/[id]** - Get detailed broker information
- **POST /api/reviews** - Create reviews (auth required)
- **GET /api/reviews** - List reviews with filtering
- **GET/PUT /api/users** - User profile management
- **POST /api/chat** - AI chatbot and tutor functionality

### Advanced Features
- **GET/POST/PUT/DELETE /api/comparisons** - Broker comparisons
- **GET/POST/DELETE /api/users/[id]/favorites** - User favorites
- **GET/POST/PUT /api/promotions** - Broker promotions system

## Database Schema

### Main Tables (25+)
- `users` - Enhanced user profiles with trading preferences
- `brokers` - Broker information and ratings
- `reviews` - User reviews and ratings
- `alerts` - User alerts and notifications
- `news_articles` - Financial news content
- `quiz_data` - Educational content and quizzes
- `education_progress` - User learning tracking
- `blog_posts` - Content management
- `discussion_threads` - Community features
- `broker_regulations` - Regulatory compliance data
- `broker_fees` - Fee structures
- `broker_platforms` - Trading platforms

### Key Features
- Row Level Security (RLS) policies
- Comprehensive indexes for performance
- Foreign key relationships with CASCADE/SET NULL
- JSONB fields for flexible data storage
- Full-text search capabilities
- Materialized views for analytics

## Development Commands

### Frontend Development
```bash
cd Brokeranalysisgooglestudio
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
```

### API Development (Vercel)
```bash
cd Brokeranalysisgooglestudio/api
npm install          # Install dependencies
npm run dev          # Start Vercel dev server
npm run build        # Type check (no emit)
npm start            # Start production server
```

## Database Setup Commands

### Full Migration (Recommended)
```bash
psql -h your-db-host -U your-user -d your-database -f database_migration_script.sql
```

### Step-by-Step Setup
```bash
# Core tables first
psql -h your-db-host -U your-user -d your-database -f enhanced_users_table.sql
psql -h your-db-host -U your-user -d your-database -f broker_specialized_tables.sql
psql -h your-db-host -U your-user -d your-database -f create_content_tables.sql

# Complete setup
psql -h your-db-host -U your-user -d your-database -f comprehensive_database_setup.sql
psql -h your-db-host -U your-user -d your-database -f database_utilities_and_security.sql
```

### Import Sample Data
```bash
# In psql or Supabase SQL Editor
\i import_all_data.sql
```

## Security & Performance Features

### Security
- Clerk JWT authentication
- Rate limiting (configurable per endpoint type)
- CORS protection
- Input validation with Zod schemas
- Row Level Security (RLS) policies
- Encrypted sensitive data storage

### Performance
- Composite indexes on frequently queried columns
- GIN indexes for JSONB and array fields
- Partial indexes for active records
- Materialized views for analytics
- Connection pooling via Supabase
- CDN integration ready

### Rate Limits
- General endpoints: 100 requests/minute
- Chat endpoints: 20 requests/minute  
- Auth endpoints: 10 requests/minute

## Next Steps for Complete Setup

### 1. Configure Missing Environment Variables
- Get Clerk Secret Key from Clerk dashboard
- Get Supabase Service Role Key from Supabase dashboard
- Set up Vercel Blob Storage (optional)

### 2. Database Setup
- Run migration scripts in correct order
- Import sample data for testing
- Verify all tables and relationships
- Set up automated maintenance jobs

### 3. API Deployment
- Deploy API to Vercel
- Configure environment variables in Vercel dashboard
- Set up monitoring and error tracking
- Configure custom domain (optional)

### 4. Frontend Deployment
- Build and deploy frontend
- Configure production environment variables
- Set up CDN for static assets
- Configure monitoring and analytics

## Troubleshooting

### Common Issues
1. **TypeScript Errors**: API is designed for Vercel functions, not local dev
2. **Database Connection**: Ensure Supabase credentials are correct
3. **Authentication**: Verify Clerk keys match between frontend and API
4. **CORS Issues**: Check ALLOWED_ORIGINS configuration

### Development Tips
- Use Vercel CLI for local API development
- Test database connections before API deployment
- Monitor rate limits during development
- Use Supabase dashboard for database management
- Check Clerk dashboard for authentication issues

## Monitoring & Maintenance

### Regular Tasks
- Monitor API performance metrics
- Review database query performance
- Update security dependencies
- Clean up expired data
- Refresh materialized views
- Update search indexes

### Performance Monitoring
- API response times
- Database query performance
- Authentication success rates
- Rate limiting effectiveness
- Error rates and types

This setup provides a robust, scalable backend for the broker analysis platform with comprehensive security, performance optimization, and monitoring capabilities.