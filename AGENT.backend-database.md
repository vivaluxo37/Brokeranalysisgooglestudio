# Backend & Database Agent

Scope
- Owns the Vercel-based serverless API in Brokeranalysisgooglestudio/api and the Supabase/PostgreSQL schema defined by SQL scripts at the repo root.
- Implements/maintains REST endpoints, middleware (CORS, rate limiting, validation), and database migrations/imports.

Primary responsibilities
- Run and develop the API locally with Vercel; type-check with TypeScript.
- Implement endpoints for brokers, reviews, users, comparisons, favorites, and chat (see Brokeranalysisgooglestudio/api/README.md).
- Manage environment configuration for API integrations (Clerk, Google AI, Supabase).
- Apply database migrations and import datasets using provided SQL scripts; validate with diagnostic queries.

API commands (run in Brokeranalysisgooglestudio/api)
- Install and dev
```powershell path=null start=null
npm install
npm run dev
```
- Type-check (no emit)
```powershell path=null start=null
npm run build
```
- Start (Vercel)
```powershell path=null start=null
npm start
```

API environment
```powershell path=null start=null
CLERK_SECRET_KEY={{CLERK_SECRET_KEY}}
GOOGLE_AI_API_KEY={{GOOGLE_AI_API_KEY}}
SUPABASE_URL={{SUPABASE_URL}}
SUPABASE_SERVICE_ROLE_KEY={{SUPABASE_SERVICE_ROLE_KEY}}
# Optional rate limits
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS_GENERAL=100
RATE_LIMIT_MAX_REQUESTS_CHAT=20
RATE_LIMIT_MAX_REQUESTS_AUTH=10
```

Database commands (run from repo root against your DB)
- Full migration (recommended)
```powershell path=null start=null
psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f database_migration_script.sql
```
- Step-by-step setup
```powershell path=null start=null
psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f enhanced_users_table.sql
psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f broker_specialized_tables.sql
psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f create_content_tables.sql
psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f comprehensive_database_setup.sql
psql -h {{DB_HOST}} -U {{DB_USER}} -d {{DB_NAME}} -f database_utilities_and_security.sql
```
- Import data
```powershell path=null start=null
# In psql
\i import_all_data.sql
```
- Validation quick checks
```powershell path=null start=null
# Example counts
SELECT (SELECT COUNT(*) FROM alerts) AS alerts_count,
       (SELECT COUNT(*) FROM news_articles) AS news_count,
       (SELECT COUNT(*) FROM quiz_data) AS quiz_count;
```

Architecture notes
- API: Node + TypeScript on Vercel; security via CORS, rate-limiter-flexible, zod validation.
- Integrations: Clerk for auth, Supabase for data (with RLS policies), Google Generative AI for chat/tutor.
- Endpoints overview in Brokeranalysisgooglestudio/api/README.md (brokers, reviews, users, comparisons, favorites, chat).
- Database design documented in DATABASE_SETUP_GUIDE.md and SQL_IMPORT_GUIDE.md (indexes, RLS, materialized views, functions, maintenance routines).

Editing guidelines
- When adding endpoints, define zod schemas for inputs and enforce auth where required.
- For schema changes, update SQL migration scripts and re-run migration; keep RLS and indexes aligned with new tables.
- Prefer read-optimized views/materialized views for heavy queries as outlined in the guides.