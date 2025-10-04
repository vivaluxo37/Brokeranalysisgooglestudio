# Database Setup Guide

This guide explains the comprehensive database setup for your Supabase broker analysis platform.

## Overview

The database setup consists of four main SQL scripts:

1. **`comprehensive_database_setup.sql`** - Main database setup with relationships, indexes, and RLS
2. **`database_utilities_and_security.sql`** - Additional utilities, security functions, and analytics
3. **`database_migration_script.sql`** - Complete migration script with proper execution order
4. **Individual table creation scripts** - Scripts for specific tables (already provided)

## Quick Start

### Option 1: Complete Migration (Recommended)

For a new database setup, run the complete migration script:

```bash
# Connect to your Supabase database
psql -h your-db-host -U your-username -d your-database -f database_migration_script.sql
```

### Option 2: Step-by-Step Setup

If you prefer to run scripts in sequence:

1. First, run individual table creation scripts:
   ```bash
   psql -h your-db-host -U your-username -d your-database -f enhanced_users_table.sql
   psql -h your-db-host -U your-username -d your-database -f broker_specialized_tables.sql
   psql -h your-db-host -U your-username -d your-database -f create_content_tables.sql
   # ... and other table scripts
   ```

2. Then run the comprehensive setup:
   ```bash
   psql -h your-db-host -U your-username -d your-database -f comprehensive_database_setup.sql
   ```

3. Finally, add utilities and security:
   ```bash
   psql -h your-db-host -U your-username -d your-database -f database_utilities_and_security.sql
   ```

## Database Architecture

### Core Tables

- **`users`** - Enhanced user profiles with trading preferences
- **`brokers`** - Broker information and ratings
- **`reviews`** - User reviews for brokers
- **`alerts`** - User alerts and notifications
- **`news_articles`** - Financial news and market updates
- **`education_progress`** - User educational content tracking
- **`quiz_data`** - Educational quiz content
- **`blog_posts`** - Blog content management
- **`discussion_threads`** - Community discussions
- **`discussion_replies`** - Discussion replies
- **`user_preferences`** - User notification and content preferences

### Specialized Tables

- **`broker_regulations`** - Regulatory information for brokers
- **`broker_fees`** - Fee structure information
- **`broker_trading_conditions`** - Trading platform conditions
- **`broker_platforms`** - Available trading platforms
- **`broker_account_types`** - Different account types offered
- **`user_alerts`** - User alert preferences
- **`user_notifications`** - User notification history
- **`system_logs`** - System operation logs

## Key Features Implemented

### 1. Enhanced Foreign Key Relationships

- Proper CASCADE/SET NULL options for data integrity
- Comprehensive relationship constraints
- Automatic cleanup of orphaned records

### 2. Performance Optimization

- **Composite Indexes**: For common query patterns
- **GIN Indexes**: For JSONB and array fields
- **Partial Indexes**: For frequently filtered data
- **Unique Indexes**: For business constraints
- **Full-text Search**: Optimized search capabilities
- **Materialized Views**: For performance-critical queries

### 3. Row Level Security (RLS)

- **Public Access**: Non-sensitive data accessible to everyone
- **User-Specific Access**: Personal data protected
- **Admin Access**: Complete administrative control
- **Moderator Access**: Content management capabilities
- **Function-Based Policies**: Complex access rules

### 4. Database Functions and Triggers

- **Automated Timestamps**: Automatic `updated_at` maintenance
- **User Profile Creation**: Automatic profile creation on registration
- **Rating Calculations**: Automatic broker rating updates
- **Statistics Updates**: Real-time user statistics
- **Data Validation**: Input sanitization and validation

### 5. Advanced Utilities

- **Security Functions**: Data encryption and masking
- **Business Logic**: Trust scores, recommendations
- **Analytics Functions**: User engagement, retention analysis
- **Notification System**: Comprehensive user notifications
- **Automation**: Content approval, engagement summaries

## Security Implementation

### Row Level Security Policies

#### Users Table
- Users can view/update their own profile
- Admins can access all profiles
- Public can view basic profile information

#### Brokers Table
- Public can view active brokers
- Authenticated users can view all brokers
- Admins can manage all broker data

#### Reviews Table
- Users can create/edit/delete their own reviews
- Public can view approved reviews
- Admins can manage all reviews

#### Content Tables
- Different access levels for drafts, published, and archived content
- Author-specific access control
- Moderator approval workflows

### Data Protection

- Input validation and sanitization
- Sensitive data masking
- Audit logging for all operations
- Encrypted storage for sensitive information

## Performance Optimizations

### Index Strategy

1. **Composite Indexes**
   ```sql
   CREATE INDEX idx_users_active_verified_plan ON users(is_active, is_verified, subscription_plan);
   CREATE INDEX idx_reviews_broker_user_rating ON reviews(broker_id, user_id, rating);
   ```

2. **Partial Indexes**
   ```sql
   CREATE INDEX idx_active_brokers ON brokers(created_at) WHERE is_active = true;
   CREATE INDEX idx_unread_alerts ON alerts(created_at) WHERE is_read = false;
   ```

3. **GIN Indexes for JSONB**
   ```sql
   CREATE INDEX idx_users_notification_settings ON users USING GIN (notification_settings);
   CREATE INDEX idx_quiz_data_questions ON quiz_data USING GIN (questions);
   ```

### Materialized Views

- **`broker_rankings`**: Pre-computed broker performance data
- **`user_activity_dashboard`**: User activity summaries
- **Regular refresh**: Automated maintenance routines

### Query Optimization

- Full-text search capabilities
- Read-optimized views for common queries
- Function-based indexing for complex conditions
- Automated statistics maintenance

## Maintenance Routines

### Automated Functions

1. **`setup_maintenance_job()`** - Complete database maintenance
2. **`refresh_materialized_views()`** - Refresh performance-critical views
3. **`cleanup_expired_data()`** - Remove old/expired records
4. **`analyze_table_statistics()`** - Update query optimizer statistics
5. **`verify_data_integrity()`** - Check for data consistency issues

### Scheduled Tasks

Set up the following scheduled tasks:

1. **Daily**
   ```sql
   SELECT refresh_materialized_views();
   SELECT analyze_table_statistics();
   ```

2. **Weekly**
   ```sql
   SELECT setup_maintenance_job();
   SELECT cleanup_expired_data();
   ```

3. **Monthly**
   ```sql
   SELECT optimize_indexes();
   SELECT verify_data_integrity();
   ```

## Usage Examples

### User Management

```sql
-- Create user (handled automatically by auth trigger)
-- The user profile is created automatically when auth user is created

-- Update user preferences
UPDATE user_preferences
SET notification_frequency = 'daily',
    language_preference = 'es'
WHERE user_id = auth.uid();

-- Get user engagement level
SELECT get_user_engagement_level(auth.uid());
```

### Broker Operations

```sql
-- Get broker recommendations for user
SELECT * FROM get_broker_recommendations(auth.uid(), 5);

-- Calculate broker trust score
SELECT calculate_broker_trust_score(123);

-- Get broker performance metrics
SELECT * FROM get_broker_performance_metrics(123, 12);
```

### Content Management

```sql
-- Get trending content
SELECT * FROM trending_content LIMIT 10;

-- Get content management dashboard
SELECT * FROM content_management_dashboard;

-- Generate sitemap entries
SELECT * FROM generate_sitemap_entries();
```

### Analytics

```sql
-- Get monthly registration statistics
SELECT * FROM get_monthly_registrations(2024);

-- Get user retention analysis
SELECT * FROM get_user_retention_analysis(CURRENT_DATE - INTERVAL '30 days');

-- Get content performance analytics
SELECT * FROM get_content_performance_analytics('blog', 30);
```

## Best Practices

### Security

1. **Always use RLS policies** for sensitive data
2. **Validate all user inputs** using provided functions
3. **Use parameterized queries** to prevent SQL injection
4. **Enable audit logging** for critical operations
5. **Regular backup** of all data

### Performance

1. **Use materialized views** for complex, frequently-run queries
2. **Monitor query performance** using `get_query_performance_metrics()`
3. **Regular maintenance** of indexes and statistics
4. **Optimize queries** using EXPLAIN ANALYZE
5. **Use appropriate indexes** for your query patterns

### Data Integrity

1. **Use foreign key constraints** to maintain relationships
2. **Implement business rules** through triggers and functions
3. **Regular validation** of data consistency
4. **Handle edge cases** in application logic
5. **Test data migrations** thoroughly

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```sql
   -- Check RLS policies
   SELECT * FROM pg_policies WHERE tablename = 'your_table';

   -- Check user roles
   SELECT * FROM auth.users WHERE id = auth.uid();
   ```

2. **Performance Issues**
   ```sql
   -- Check slow queries
   SELECT * FROM get_query_performance_metrics();

   -- Check index usage
   EXPLAIN ANALYZE your_query;
   ```

3. **Data Integrity Issues**
   ```sql
   -- Verify foreign keys
   SELECT * FROM verify_data_integrity();

   -- Check for orphaned records
   SELECT COUNT(*) FROM reviews WHERE broker_id NOT IN (SELECT id FROM brokers);
   ```

### Maintenance Commands

```sql
-- Refresh all materialized views
SELECT refresh_materialized_views();

-- Analyze all tables
SELECT analyze_table_statistics();

-- Clean up expired data
SELECT cleanup_expired_data();

-- Optimize indexes
SELECT optimize_indexes();

-- Verify setup
SELECT * FROM verify_database_setup();
```

## Next Steps

1. **Import Data**: Use the provided import scripts to populate your database
2. **Set Up Application**: Configure your application to use the new database structure
3. **Configure Scheduling**: Set up automated maintenance routines
4. **Monitor Performance**: Set up monitoring for database performance
5. **Test Thoroughly**: Test all functionality with realistic data

## Support

For questions or issues:

1. Check the system logs: `SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 20;`
2. Verify database setup: `SELECT * FROM verify_database_setup();`
3. Review the individual table creation scripts for table-specific details

The database is now ready for your broker analysis platform!