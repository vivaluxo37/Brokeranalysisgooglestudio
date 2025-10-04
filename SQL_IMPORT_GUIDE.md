# SQL Data Import Guide

This guide explains how to use the SQL scripts to import alerts, news articles, and quiz data into your Supabase database.

## Overview

The import package includes the following scripts:

1. **`import_alerts.sql`** - Imports alert data with broker relationships
2. **`import_news_articles.sql`** - Imports news articles with categories and importance levels
3. **`import_quiz_data.sql`** - Imports quiz data with JSONB formatted questions
4. **`import_user_preferences.sql`** - Creates sample user preferences and education progress
5. **`import_all_data.sql`** - Master script to run all imports at once
6. **`SQL_IMPORT_GUIDE.md`** - This documentation file

## Prerequisites

Before running the import scripts, ensure:

1. **Database Schema**: Your Supabase database has the required tables created:
   - `alerts`
   - `news_articles`
   - `quiz_data`
   - `user_alert_preferences`
   - `education_progress`
   - `quiz_results`
   - `brokers` (referenced by alerts)

2. **Required Data**: The `brokers` table should contain at least these broker IDs:
   - pepperstone
   - ic-markets
   - xtb
   - forex-com
   - etoro
   - ironfx
   - bitget

3. **PostgreSQL Extensions**: Ensure these extensions are enabled:
   - `uuid-ossp` (for UUID generation)
   - `pgcrypto` (for cryptographic functions)

## Quick Start

### Method 1: Import All Data at Once

Run the master script to import everything:

```sql
-- In Supabase SQL Editor or psql
\i import_all_data.sql
```

### Method 2: Import Individual Scripts

Run scripts individually for more control:

```sql
-- Import alerts first (depends on brokers)
\i import_alerts.sql

-- Import news articles
\i import_news_articles.sql

-- Import quiz data
\i import_quiz_data.sql

-- Import user preferences and progress
\i import_user_preferences.sql
```

## Script Details

### 1. Alerts Import (`import_alerts.sql`)

**Features:**
- Imports 8 sample alerts from the TypeScript mock data
- Maps alert severity levels (High, Medium, Low)
- Links alerts to specific brokers
- Includes metadata with JSONB for additional context
- Creates performance indexes for better query performance

**Alert Types:**
- Regulatory warnings and updates
- Security alerts and warnings
- Maintenance notifications
- Feature announcements

**Sample Alert:**
```sql
INSERT INTO alerts (
    id, broker_id, title, description, alert_date, severity,
    is_read, created_at, updated_at, alert_type, status, metadata
) VALUES (
    'alert1', 'pepperstone', 'FCA Issues Minor Warning',
    'Pepperstone received a minor warning from the FCA regarding marketing materials.',
    '2025-09-10T14:00:00Z', 'Medium', false, NOW(), NOW(),
    'regulatory', 'resolved',
    '{"regulator": "FCA", "issue_type": "marketing_materials"}'
);
```

### 2. News Articles Import (`import_news_articles.sql`)

**Features:**
- Imports 6 sample news articles covering major forex events
- Categorizes articles (Economy, Central Banks, Commodities, etc.)
- Includes importance levels (High, Medium, Low)
- Adds sentiment analysis and market impact data
- Creates full-text search capabilities
- Includes related financial instruments

**Categories:**
- Economy
- Central Banks
- Commodities
- Geopolitics

**Sample News Article:**
```sql
INSERT INTO news_articles (
    id, title, summary, full_content, publication_date,
    category, importance, source_url, author, sentiment_score,
    market_impact, related_instruments, tags, view_count,
    is_featured, created_at, updated_at, metadata
) VALUES (
    'news1', 'US Non-Farm Payrolls Exceed Expectations',
    'The US economy added 350,000 jobs in August...',
    'Full article content here...',
    '2025-09-05T12:30:00Z', 'Economy', 'High',
    'https://www.bls.gov/news.release/pdf/empsit.pdf',
    'Bureau of Labor Statistics', 0.8, 'high',
    ARRAY['EUR/USD', 'GBP/USD', 'USD/JPY'],
    ARRAY['NFP', 'Fed', 'USD'], 1250, true, NOW(), NOW(),
    '{"actual": 350000, "forecast": 180000}'
);
```

### 3. Quiz Data Import (`import_quiz_data.sql`)

**Features:**
- Imports 8 comprehensive quizzes with 5 questions each
- JSONB formatted questions with detailed answer tracking
- Difficulty levels (Beginner, Intermediate, Advanced)
- Categories for different trading aspects
- Time limits and passing scores
- Metadata for learning objectives

**Quiz Categories:**
- Forex Basics
- Broker Fees
- Risk Management
- Technical Analysis
- Advanced Topics

**Sample Quiz Structure:**
```json
{
  "questions": [
    {
      "question": "What does Forex stand for?",
      "options": [
        "Foreign Exchange",
        "Forward Exchange",
        "Financial Exchange",
        "Future Exchange"
      ],
      "correctAnswer": "Foreign Exchange",
      "explanation": "Forex is short for Foreign Exchange..."
    }
  ]
}
```

### 4. User Preferences Import (`import_user_preferences.sql`)

**Features:**
- Creates 3 sample users with different trading profiles
- Alert preferences with broker-specific subscriptions
- Education progress tracking
- Detailed quiz results with question-level analysis
- Performance metrics and learning analytics

**User Profiles:**
- **User 1**: Active forex trader, major broker focus
- **User 2**: Conservative trader, low-risk focus
- **User 3**: Crypto enthusiast, high-risk tolerance

## Post-Import Validation

### Check Record Counts
```sql
-- Verify all data was imported
SELECT
    (SELECT COUNT(*) FROM alerts) as alerts_count,
    (SELECT COUNT(*) FROM news_articles) as news_count,
    (SELECT COUNT(*) FROM quiz_data) as quiz_count,
    (SELECT COUNT(*) FROM user_alert_preferences) as user_prefs_count;
```

### Check Data Integrity
```sql
-- Validate broker references
SELECT broker_id, COUNT(*) as alert_count
FROM alerts
GROUP BY broker_id
ORDER BY alert_count DESC;

-- Check for orphaned records
SELECT COUNT(*) as orphaned_alerts
FROM alerts
WHERE broker_id NOT IN (SELECT id FROM brokers);

-- Verify quiz categories
SELECT category, difficulty_level, COUNT(*) as quiz_count
FROM quiz_data
GROUP BY category, difficulty_level
ORDER BY category, difficulty_level;
```

### Use the Created Views
```sql
-- Alert summary dashboard
SELECT * FROM vw_alert_summary;

-- User progress overview
SELECT * FROM vw_user_progress_summary;

-- Quiz performance metrics
SELECT * FROM vw_quiz_performance;

-- Full-text search on news
SELECT id, title, category
FROM mv_news_search
WHERE search_vector @@ to_tsquery('english', 'fed & rate');
```

## Customization

### Adding New Data
1. **Alerts**: Add new rows to the INSERT statements in `import_alerts.sql`
2. **News**: Add articles to `import_news_articles.sql` with appropriate categories
3. **Quizzes**: Create new quiz entries in `import_quiz_data.sql` with JSONB questions

### Modifying Existing Data
- Update the INSERT statements with your specific data
- Adjust metadata JSON objects to include your custom fields
- Modify time limits, passing scores, and other quiz parameters

### Security Considerations
- Review all data for sensitive information before import
- Consider using parameterized queries in production
- Validate all foreign key relationships
- Test imports in a development environment first

## Troubleshooting

### Common Issues

1. **Foreign Key Errors**: Ensure all referenced brokers exist in the `brokers` table
2. **JSONB Format Issues**: Validate JSON syntax for quiz questions and metadata
3. **Duplicate Key Errors**: Check if IDs already exist in target tables
4. **Permission Errors**: Ensure your database user has INSERT permissions

### Debug Commands
```sql
-- Check table existence
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Check column types
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'alerts';

-- Test JSONB parsing
SELECT '{"test": "value"}'::jsonb;
```

## Performance Considerations

The scripts include several performance optimizations:

- **Indexes**: Created on frequently queried columns
- **Materialized Views**: For full-text search on news articles
- **JSONB GIN Index**: For efficient querying of quiz questions
- **Composite Indexes**: For common filter combinations

## Support

If you encounter issues with the import process:

1. Check that your database schema matches the expected structure
2. Verify all foreign key relationships exist
3. Test individual scripts before running the master import
4. Review the error messages for specific guidance

The scripts are designed to be idempotent - you can run them multiple times without causing data duplication (assuming proper cleanup).