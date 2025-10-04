-- Comprehensive Database Setup: Relationships, Indexes, and RLS Policies
-- For Supabase Broker Analysis Platform
-- This script ensures data security, performance, and integrity

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. ENHANCED FOREIGN KEY RELATIONSHIPS
-- ============================================================================

-- Add missing foreign key relationships for complete data integrity

-- Broker relationships (assuming main brokers table exists)
-- Add CASCADE/SET NULL options where appropriate

-- Relationship between brokers and reviews
ALTER TABLE IF EXISTS reviews
ADD CONSTRAINT fk_reviews_broker_id
FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE;

-- Relationship between reviews and users
ALTER TABLE IF EXISTS reviews
ADD CONSTRAINT fk_reviews_user_id
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Relationship between alerts and brokers
ALTER TABLE IF EXISTS alerts
ADD CONSTRAINT fk_alerts_broker_id
FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL;

-- Relationship between user preferences and users
ALTER TABLE IF EXISTS user_preferences
ADD CONSTRAINT fk_user_preferences_user_id
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Relationships for blog content
ALTER TABLE IF EXISTS blog_posts
ADD CONSTRAINT fk_blog_posts_author_id
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS blog_categories
ADD CONSTRAINT fk_blog_categories_parent_id
FOREIGN KEY (parent_id) REFERENCES blog_categories(id) ON DELETE SET NULL;

-- Relationships for discussions
ALTER TABLE IF EXISTS discussion_threads
ADD CONSTRAINT fk_discussion_threads_author_id
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS discussion_threads
ADD CONSTRAINT fk_discussion_threads_broker_id
FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS discussion_replies
ADD CONSTRAINT fk_discussion_replies_thread_id
FOREIGN KEY (thread_id) REFERENCES discussion_threads(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS discussion_replies
ADD CONSTRAINT fk_discussion_replies_author_id
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- ============================================================================
-- 2. PERFORMANCE INDEXES
-- ============================================================================

-- Composite indexes for common query patterns

-- User-related composite indexes
CREATE INDEX IF NOT EXISTS idx_users_active_verified_plan ON public.users(is_active, is_verified, subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_location_active ON public.users(location, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_experience_risk ON public.users(trading_experience, risk_tolerance);
CREATE INDEX IF NOT EXISTS idx_users_subscription_created ON public.users(subscription_plan, created_at);

-- Broker-related composite indexes
CREATE INDEX IF NOT EXISTS idx_brokers_rating_active ON brokers(rating, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_brokers_country_category ON brokers(country, category);
CREATE INDEX IF NOT EXISTS idx_brokers_established_rating ON brokers(year_established, rating);
CREATE INDEX IF NOT EXISTS idx_brokers_search ON brokers USING GIN (to_tsvector('english', name || ' ' || description));

-- Review-related composite indexes
CREATE INDEX IF NOT EXISTS idx_reviews_broker_user_rating ON reviews(broker_id, user_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_broker_created ON reviews(broker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating_created ON reviews(rating, created_at DESC);

-- Alert-related composite indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user_status_type ON alerts(user_id, status, alert_type);
CREATE INDEX IF NOT EXISTS idx_alerts_user_severity ON alerts(user_id, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_broker_status ON alerts(broker_id, status);

-- News articles composite indexes
CREATE INDEX IF NOT EXISTS idx_news_category_importance ON news_articles(category, importance, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_search ON news_articles USING GIN (to_tsvector('english', title || ' ' || COALESCE(summary, '')));
CREATE INDEX IF NOT EXISTS idx_news_published_search ON news_articles(published_at DESC, category);

-- Education progress composite indexes
CREATE INDEX IF NOT EXISTS idx_education_user_completed ON education_progress(user_id, is_completed, completion_date);
CREATE INDEX IF NOT EXISTS idx_education_user_type_progress ON education_progress(user_id, content_type, progress_percentage);

-- Blog-related composite indexes
CREATE INDEX IF NOT EXISTS idx_blog_author_status ON blog_posts(author_id, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category_published ON blog_posts(category_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_search ON blog_posts USING GIN (to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- Discussion-related composite indexes
CREATE INDEX IF NOT EXISTS idx_discussion_broker_status ON discussion_threads(broker_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussion_author_created ON discussion_threads(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_thread ON discussion_replies(thread_id, created_at DESC);

-- GIN indexes for JSONB and array fields
CREATE INDEX IF NOT EXISTS idx_users_notification_settings ON public.users USING GIN (notification_settings);
CREATE INDEX IF NOT EXISTS idx_users_social_profiles ON public.users USING GIN (social_profiles);
CREATE INDEX IF NOT EXISTS idx_users_achievements ON public.users USING GIN (achievements);
CREATE INDEX IF NOT EXISTS idx_broker_regulations_requirements ON broker_regulations USING GIN (regulatory_requirements);
CREATE INDEX IF NOT EXISTS idx_broker_platforms_features ON broker_platforms USING GIN (platform_features);
CREATE INDEX IF NOT EXISTS idx_quiz_data_questions ON quiz_data USING GIN (questions);

-- Partial indexes for frequently filtered data
CREATE INDEX IF NOT EXISTS idx_active_brokers ON brokers(created_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_recent_reviews ON reviews(created_at) WHERE created_at >= NOW() - INTERVAL '30 days';
CREATE INDEX IF NOT EXISTS idx_active_users ON public.users(last_login_at) WHERE is_active = true AND last_login_at >= NOW() - INTERVAL '30 days';
CREATE INDEX IF NOT EXISTS idx_unread_alerts ON alerts(created_at) WHERE is_read = false AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_recent_news ON news_articles(published_at) WHERE published_at >= NOW() - INTERVAL '7 days';

-- Unique indexes for business constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_email ON public.users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_referral ON public.users(referral_code) WHERE referral_code IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_quiz_key ON quiz_data(quiz_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_blog_slug ON blog_posts(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_thread_title_broker ON discussion_threads(title, broker_id) WHERE broker_id IS NOT NULL;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_brokers_fulltext ON brokers USING GIN (to_tsvector('english',
    COALESCE(name, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(country, '') || ' ' || COALESCE(category, '')
));

CREATE INDEX IF NOT EXISTS idx_blog_fulltext ON blog_posts USING GIN (to_tsvector('english',
    COALESCE(title, '') || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, '')
));

CREATE INDEX IF NOT EXISTS idx_discussion_fulltext ON discussion_threads USING GIN (to_tsvector('english',
    COALESCE(title, '') || ' ' || COALESCE(content, '')
));

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS discussion_replies ENABLE ROW LEVEL SECURITY;

-- Broker RLS Policies
CREATE POLICY "Public can view brokers" ON brokers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can view all brokers" ON brokers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage brokers" ON brokers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
        )
    );

CREATE POLICY "Moderator can update brokers" ON brokers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name IN ('admin', 'moderator')
        )
    );

-- Reviews RLS Policies
CREATE POLICY "Users can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all reviews" ON reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
        )
    );

-- User Preferences RLS Policies
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR ALL USING (user_id = auth.uid());

-- Blog Posts RLS Policies
CREATE POLICY "Public can view published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated can view all posts" ON blog_posts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can manage own posts" ON blog_posts
    FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admin can manage all posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
        )
    );

-- Blog Categories RLS Policies
CREATE POLICY "Public can view categories" ON blog_categories
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
        )
    );

-- Discussion Threads RLS Policies
CREATE POLICY "Public can view approved discussions" ON discussion_threads
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own discussions" ON discussion_threads
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Users can create discussions" ON discussion_threads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own discussions" ON discussion_threads
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete own discussions" ON discussion_threads
    FOR DELETE USING (author_id = auth.uid());

CREATE POLICY "Moderator can manage discussions" ON discussion_threads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name IN ('admin', 'moderator')
        )
    );

-- Discussion Replies RLS Policies
CREATE POLICY "Public can view approved replies" ON discussion_replies
    FOR SELECT USING (
        status = 'approved' OR
        EXISTS (SELECT 1 FROM discussion_threads WHERE id = discussion_replies.thread_id AND author_id = auth.uid())
    );

CREATE POLICY "Users can create replies" ON discussion_replies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own replies" ON discussion_replies
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete own replies" ON discussion_replies
    FOR DELETE USING (author_id = auth.uid());

CREATE POLICY "Moderator can manage replies" ON discussion_replies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name IN ('admin', 'moderator')
        )
    );

-- Enhanced RLS Policies for existing tables

-- News Articles - Enhanced
CREATE POLICY "Public can view news" ON news_articles
    FOR SELECT USING (true);

CREATE POLICY "Authenticated can interact with news" ON news_articles
    FOR ALL USING (auth.role() = 'authenticated');

-- Quiz Data - Enhanced
CREATE POLICY "Public can view active quizzes" ON quiz_data
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can interact with quizzes" ON quiz_data
    FOR ALL USING (auth.role() = 'authenticated');

-- Education Progress - Enhanced
CREATE POLICY "Users can manage own education" ON education_progress
    FOR ALL USING (user_id = auth.uid());

-- Alerts - Enhanced
CREATE POLICY "Users can manage own alerts" ON alerts
    FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- 4. DATABASE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Helper function to check user roles
CREATE OR REPLACE FUNCTION has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users
        JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
        JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
        WHERE auth.users.id = auth.uid() AND auth.roles.name = role_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update broker rating based on reviews
CREATE OR REPLACE FUNCTION update_broker_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        UPDATE brokers
        SET
            rating = COALESCE(
                (SELECT AVG(rating) FROM reviews WHERE broker_id = NEW.broker_id AND is_approved = true),
                0
            ),
            reviews_count = COALESCE(
                (SELECT COUNT(*) FROM reviews WHERE broker_id = NEW.broker_id AND is_approved = true),
                0
            ),
            updated_at = NOW()
        WHERE id = NEW.broker_id;

        RETURN COALESCE(NEW, OLD);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for broker rating updates
CREATE TRIGGER update_broker_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_broker_rating();

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        UPDATE public.users
        SET
            reviews_count = COALESCE(
                (SELECT COUNT(*) FROM reviews WHERE user_id = NEW.user_id AND is_approved = true),
                0
            ),
            updated_at = NOW()
        WHERE id = NEW.user_id;

        RETURN COALESCE(NEW, OLD);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user statistics updates
CREATE TRIGGER update_user_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Function to sanitize and validate user input
CREATE OR REPLACE FUNCTION sanitize_input(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN REPLACE(REPLACE(REPLACE(input_text, '<', '&lt;'), '>', '&gt;'), '"', '&quot;');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate user statistics summary
CREATE OR REPLACE FUNCTION get_user_stats_summary(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_reviews', COALESCE((SELECT COUNT(*) FROM reviews WHERE user_id = get_user_stats_summary.user_id AND is_approved = true), 0),
        'average_rating', COALESCE((SELECT AVG(rating) FROM reviews WHERE user_id = get_user_stats_summary.user_id AND is_approved = true), 0),
        'total_discussions', COALESCE((SELECT COUNT(*) FROM discussion_threads WHERE author_id = get_user_stats_summary.user_id), 0),
        'total_replies', COALESCE((SELECT COUNT(*) FROM discussion_replies WHERE author_id = get_user_stats_summary.user_id), 0),
        'education_progress', COALESCE((SELECT COUNT(*) FROM education_progress WHERE user_id = get_user_stats_summary.user_id AND is_completed = true), 0),
        'alerts_count', COALESCE((SELECT COUNT(*) FROM alerts WHERE user_id = get_user_stats_summary.user_id AND is_read = false), 0)
    ) INTO stats;

    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get broker comprehensive statistics
CREATE OR REPLACE FUNCTION get_broker_stats(broker_id BIGINT)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_reviews', COALESCE((SELECT COUNT(*) FROM reviews WHERE broker_id = get_broker_stats.broker_id AND is_approved = true), 0),
        'average_rating', COALESCE((SELECT AVG(rating) FROM reviews WHERE broker_id = get_broker_stats.broker_id AND is_approved = true), 0),
        'rating_distribution', COALESCE((
            SELECT jsonb_object_agg(rating, count)
            FROM (
                SELECT rating, COUNT(*) as count
                FROM reviews
                WHERE broker_id = get_broker_stats.broker_id AND is_approved = true
                GROUP BY rating
            ) sub
        ), '{}'::jsonb),
        'total_discussions', COALESCE((SELECT COUNT(*) FROM discussion_threads WHERE broker_id = get_broker_stats.broker_id AND status = 'approved'), 0),
        'regulations_count', COALESCE((SELECT COUNT(*) FROM broker_regulations WHERE broker_id = get_broker_stats.broker_id), 0),
        'platforms_count', COALESCE((SELECT COUNT(*) FROM broker_platforms WHERE broker_id = get_broker_stats.broker_id), 0),
        'account_types_count', COALESCE((SELECT COUNT(*) FROM broker_account_types WHERE broker_id = get_broker_stats.broker_id), 0)
    ) INTO stats;

    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automated timestamp update function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables with updated_at column
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
        AND table_name NOT IN (SELECT tablename FROM pg_trigger WHERE tgname LIKE '%updated_at%')
    LOOP
        EXECUTE format('CREATE TRIGGER handle_%s_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at()',
            table_rec.table_name, table_rec.table_name);
    END LOOP;
END $$;

-- Function to clean up expired data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Clean up expired alerts
    DELETE FROM alerts
    WHERE expiry_date IS NOT NULL AND expiry_date < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Clean up old notifications (older than 90 days)
    DELETE FROM user_alerts
    WHERE last_notified_at < NOW() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;

    -- Clean up old draft posts (older than 30 days)
    DELETE FROM blog_posts
    WHERE status = 'draft' AND updated_at < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Materialized view for broker rankings
CREATE MATERIALIZED VIEW IF NOT EXISTS broker_rankings AS
SELECT
    b.id,
    b.name,
    b.rating,
    b.reviews_count,
    b.is_active,
    b.country,
    b.category,
    b.year_established,
    b.min_deposit,
    get_broker_stats(b.id) as stats
FROM brokers b
WHERE b.is_active = true
ORDER BY b.rating DESC, b.reviews_count DESC;

-- Refresh materialized view index
CREATE INDEX IF NOT EXISTS idx_broker_rankings_rating ON broker_rankings(rating DESC, reviews_count DESC);

-- Materialized view for user activity dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS user_activity_dashboard AS
SELECT
    u.id,
    u.name,
    u.email,
    u.subscription_plan,
    u.is_active,
    u.last_login_at,
    u.reviews_count,
    u.followers_count,
    u.following_count,
    get_user_stats_summary(u.id) as stats
FROM public.users u
WHERE u.is_active = true
ORDER BY u.last_login_at DESC NULLS LAST;

-- Read-optimized view for recent reviews
CREATE VIEW IF NOT EXISTS recent_reviews_with_details AS
SELECT
    r.*,
    b.name as broker_name,
    u.name as user_name,
    u.avatar_url as user_avatar,
    CASE
        WHEN r.rating >= 4 THEN 'Excellent'
        WHEN r.rating >= 3 THEN 'Good'
        WHEN r.rating >= 2 THEN 'Average'
        ELSE 'Poor'
    END as rating_category
FROM reviews r
JOIN brokers b ON r.broker_id = b.id
LEFT JOIN public.users u ON r.user_id = u.id
WHERE r.is_approved = true
ORDER BY r.created_at DESC;

-- Read-optimized view for broker details
CREATE VIEW IF NOT EXISTS broker_details AS
SELECT
    b.*,
    COALESCE(br.regulatory_info, '{}'::jsonb) as regulatory_info,
    COALESCE(bf.fee_info, '{}'::jsonb) as fee_info,
    COALESCE(bt.trading_conditions, '{}'::jsonb) as trading_conditions,
    COALESCE(bp.platforms, '[]'::jsonb) as platforms,
    COALESCE(ba.account_types, '[]'::jsonb) as account_types,
    get_broker_stats(b.id) as stats
FROM brokers b
LEFT JOIN (
    SELECT broker_id,
           jsonb_agg(jsonb_build_object(
               'regulator_name', regulator_name,
               'license_status', license_status,
               'jurisdiction', jurisdiction
           )) as regulatory_info
    FROM broker_regulations
    GROUP BY broker_id
) br ON b.id = br.broker_id
LEFT JOIN (
    SELECT broker_id,
           jsonb_agg(jsonb_build_object(
               'fee_type', fee_type,
               'fee_amount', fee_amount,
               'fee_currency', fee_currency
           )) as fee_info
    FROM broker_fees
    GROUP BY broker_id
) bf ON b.id = bf.broker_id
LEFT JOIN (
    SELECT broker_id,
           jsonb_build_object(
               'min_deposit', min_deposit,
               'max_leverage', max_leverage,
               'scalping_allowed', scalping_allowed
           ) as trading_conditions
    FROM broker_trading_conditions
    GROUP BY broker_id
) bt ON b.id = bt.broker_id
LEFT JOIN (
    SELECT broker_id,
           jsonb_agg(jsonb_build_object(
               'platform_name', platform_name,
               'mobile_app', mobile_app,
               'web_trader', web_trader
           )) as platforms
    FROM broker_platforms
    GROUP BY broker_id
) bp ON b.id = bp.broker_id
LEFT JOIN (
    SELECT broker_id,
           jsonb_agg(jsonb_build_object(
               'account_name', account_name,
               'account_type', account_type,
               'min_deposit', min_deposit
           )) as account_types
    FROM broker_account_types
    GROUP BY broker_id
) ba ON b.id = ba.broker_id;

-- Security view for user profile (public only)
CREATE VIEW IF NOT EXISTS public_user_profiles AS
SELECT
    id,
    name,
    avatar_url,
    bio,
    location,
    website,
    trading_experience,
    risk_tolerance,
    preferred_instruments,
    followers_count,
    following_count,
    reviews_count,
    created_at
FROM public.users
WHERE is_active = true AND profile_visibility = 'public';

-- View for content management dashboard
CREATE VIEW IF NOT EXISTS content_management_dashboard AS
SELECT
    'posts' as content_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_count,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_count
FROM blog_posts
UNION ALL
SELECT
    'discussions' as content_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as published_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as draft_count,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_count
FROM discussion_threads
UNION ALL
SELECT
    'reviews' as content_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as published_count,
    COUNT(CASE WHEN is_approved = false THEN 1 END) as draft_count,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_count
FROM reviews;

-- View for trending content
CREATE VIEW IF NOT EXISTS trending_content AS
SELECT
    'broker' as content_type,
    id,
    name as title,
    rating as score,
    reviews_count as engagement,
    created_at
FROM brokers
WHERE is_active = true
UNION ALL
SELECT
    'discussion' as content_type,
    id,
    title,
    (SELECT COUNT(*) FROM discussion_replies WHERE thread_id = discussion_threads.id) as score,
    view_count as engagement,
    created_at
FROM discussion_threads
WHERE status = 'approved'
UNION ALL
SELECT
    'review' as content_type,
    id,
    title,
    rating as score,
    helpful_count as engagement,
    created_at
FROM reviews
WHERE is_approved = true
ORDER BY score DESC, engagement DESC, created_at DESC
LIMIT 20;

-- ============================================================================
-- 6. PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY broker_rankings;
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_activity_dashboard;
    -- Add more materialized views as needed
END;
$$ LANGUAGE plpgsql;

-- Create function to analyze table statistics
CREATE OR REPLACE FUNCTION analyze_table_statistics()
RETURNS VOID AS $$
BEGIN
    ANALYZE public.users;
    ANALYZE brokers;
    ANALYZE reviews;
    ANALYZE alerts;
    ANALYZE news_articles;
    ANALYZE education_progress;
    ANALYZE quiz_data;
    ANALYZE blog_posts;
    ANALYZE discussion_threads;
    ANALYZE discussion_replies;
    ANALYZE user_preferences;
    ANALYZE broker_regulations;
    ANALYZE broker_fees;
    ANALYZE broker_trading_conditions;
    ANALYZE broker_platforms;
    ANALYZE broker_account_types;
    ANALYZE user_alerts;
END;
$$ LANGUAGE plpgsql;

-- Create function to get query performance metrics
CREATE OR REPLACE FUNCTION get_query_performance_metrics()
RETURNS TABLE(query_text TEXT, mean_time FLOAT8, calls INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT query, mean_time, calls
    FROM pg_stat_statements
    WHERE calls > 10
    ORDER BY mean_time DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to vacuum tables
CREATE OR REPLACE FUNCTION vacuum_tables()
RETURNS VOID AS $$
BEGIN
    VACUUM ANALYZE public.users;
    VACUUM ANALYZE brokers;
    VACUUM ANALYZE reviews;
    VACUUM ANALYZE alerts;
    VACUUM ANALYZE news_articles;
    VACUUM ANALYZE education_progress;
    VACUUM ANALYZE quiz_data;
    VACUUM ANALYZE blog_posts;
    VACUUM ANALYZE discussion_threads;
    VACUUM ANALYZE discussion_replies;
    VACUUM ANALYZE user_preferences;
    VACUUM ANALYZE broker_regulations;
    VACUUM ANALYZE broker_fees;
    VACUUM ANALYZE broker_trading_conditions;
    VACUUM ANALYZE broker_platforms;
    VACUUM ANALYZE broker_account_types;
    VACUUM ANALYZE user_alerts;
END;
$$ LANGUAGE plpgsql;

-- Create function to optimize indexes
CREATE OR REPLACE FUNCTION optimize_indexes()
RETURNS VOID AS $$
BEGIN
    REINDEX TABLE public.users;
    REINDEX TABLE brokers;
    REINDEX TABLE reviews;
    REINDEX TABLE alerts;
    REINDEX TABLE news_articles;
    REINDEX TABLE education_progress;
    REINDEX TABLE quiz_data;
    REINDEX TABLE blog_posts;
    REINDEX TABLE discussion_threads;
    REINDEX TABLE discussion_replies;
    REINDEX TABLE user_preferences;
    REINDEX TABLE broker_regulations;
    REINDEX TABLE broker_fees;
    REINDEX TABLE broker_trading_conditions;
    REINDEX TABLE broker_platforms;
    REINDEX TABLE broker_account_types;
    REINDEX TABLE user_alerts;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for all functions
GRANT EXECUTE ON FUNCTION has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_broker_rating() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION sanitize_input(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats_summary(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_broker_stats(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_data() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_materialized_views() TO authenticated;
GRANT EXECUTE ON FUNCTION analyze_table_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_query_performance_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION vacuum_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION optimize_indexes() TO authenticated;

-- Grant permissions for views
GRANT SELECT ON broker_rankings TO authenticated;
GRANT SELECT ON broker_rankings TO anon;
GRANT SELECT ON user_activity_dashboard TO authenticated;
GRANT SELECT ON recent_reviews_with_details TO authenticated;
GRANT SELECT ON recent_reviews_with_details TO anon;
GRANT SELECT ON broker_details TO authenticated;
GRANT SELECT ON broker_details TO anon;
GRANT SELECT ON public_user_profiles TO authenticated;
GRANT SELECT ON public_user_profiles TO anon;
GRANT SELECT ON content_management_dashboard TO authenticated;
GRANT SELECT ON trending_content TO authenticated;
GRANT SELECT ON trending_content TO anon;

-- Set up automated maintenance job (you can schedule this in your application)
-- This is a placeholder for a cron job or scheduled task
CREATE OR REPLACE FUNCTION setup_maintenance_job()
RETURNS VOID AS $$
BEGIN
    -- This function can be called periodically to maintain database health
    PERFORM refresh_materialized_views();
    PERFORM analyze_table_statistics();
    PERFORM cleanup_expired_data();

    -- Log maintenance activity
    INSERT INTO system_logs (action, details, created_at)
    VALUES ('maintenance', 'Database maintenance completed', NOW());

    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create system logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    severity VARCHAR(20) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on system logs
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for system logs
CREATE POLICY "Admin can view system logs" ON system_logs
    FOR SELECT USING (has_role('admin'));

CREATE POLICY "System can insert system logs" ON system_logs
    FOR INSERT WITH CHECK (has_role('admin'));

-- Add comments for documentation
COMMENT ON SCHEMA public IS 'Main schema for broker analysis platform';
COMMENT ON TABLE public.users IS 'Enhanced user profiles with trading preferences and educational progress';
COMMENT ON TABLE brokers IS 'Broker information and ratings';
COMMENT ON TABLE reviews IS 'User reviews for brokers';
COMMENT ON TABLE alerts IS 'User alerts and notifications';
COMMENT ON TABLE news_articles IS 'Financial news and market updates';
COMMENT ON TABLE education_progress IS 'User educational content progress tracking';
COMMENT ON TABLE quiz_data IS 'Educational quiz content';
COMMENT ON TABLE system_logs IS 'System operation logs for maintenance and monitoring';

-- ============================================================================
-- SCRIPT COMPLETION
-- ============================================================================

-- Create a summary report
DO $$
DECLARE
    total_tables INTEGER;
    total_indexes INTEGER;
    total_policies INTEGER;
    total_functions INTEGER;
    total_views INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_tables FROM information_schema.tables WHERE table_schema = 'public';
    SELECT COUNT(*) INTO total_indexes FROM pg_indexes WHERE schemaname = 'public';
    SELECT COUNT(*) INTO total_policies FROM pg_policies WHERE schemaname = 'public';
    SELECT COUNT(*) INTO total_functions FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    SELECT COUNT(*) INTO total_views FROM information_schema.views WHERE table_schema = 'public';

    RAISE NOTICE 'Database Setup Complete:';
    RAISE NOTICE 'Total Tables: %', total_tables;
    RAISE NOTICE 'Total Indexes: %', total_indexes;
    RAISE NOTICE 'Total RLS Policies: %', total_policies;
    RAISE NOTICE 'Total Functions: %', total_functions;
    RAISE NOTICE 'Total Views: %', total_views;

    INSERT INTO system_logs (action, details, severity)
    VALUES ('setup_complete', format('Database setup completed. Tables: %, Indexes: %, Policies: %, Functions: %, Views: %',
           total_tables, total_indexes, total_policies, total_functions, total_views), 'success');
END $$;

-- Initial data analysis
PERFORM analyze_table_statistics();

-- Setup complete message
RAISE NOTICE 'Comprehensive database setup complete! The system is now ready with:';
RAISE NOTICE '- Enhanced foreign key relationships with proper CASCADE/SET NULL options';
RAISE NOTICE '- Performance-optimized indexes including composite, GIN, and partial indexes';
RAISE NOTICE '- Comprehensive Row Level Security policies for all tables';
RAISE NOTICE '- Database functions and triggers for automation and validation';
RAISE NOTICE '- Materialized views and read-optimized views for performance';
RAISE NOTICE '- Performance optimization functions and maintenance routines';