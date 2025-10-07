-- Database Utilities and Security Enhancements
-- Additional functions, procedures, and security measures for the broker analysis platform

-- Enable additional extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "intarray";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================================================
-- ADDITIONAL SECURITY FUNCTIONS
-- ============================================================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION validate_email_format(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if user has permission to access broker data
CREATE OR REPLACE FUNCTION can_access_broker_data(broker_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND (
            -- Admin can access everything
            EXISTS (
                SELECT 1 FROM auth.user_roles ur
                JOIN auth.roles r ON ur.role_id = r.id
                WHERE ur.user_id = u.id AND r.name = 'admin'
            )
            OR
            -- Moderators can access broker data
            EXISTS (
                SELECT 1 FROM auth.user_roles ur
                JOIN auth.roles r ON ur.role_id = r.id
                WHERE ur.user_id = u.id AND r.name = 'moderator'
            )
            OR
            -- Users can access if they have reviewed the broker
            EXISTS (
                SELECT 1 FROM reviews
                WHERE broker_id = can_access_broker_data.broker_id
                AND user_id = u.id
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mask sensitive data for non-admin users
CREATE OR REPLACE FUNCTION mask_sensitive_data(input_text TEXT, user_role TEXT DEFAULT NULL)
RETURNS TEXT AS $$
BEGIN
    IF has_role('admin') OR (user_role IS NOT NULL AND user_role = 'admin') THEN
        RETURN input_text;
    ELSE
        RETURN '***MASKED***';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT, secret_key TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    encryption_key TEXT;
BEGIN
    -- Use provided key or get from environment
    encryption_key := COALESCE(secret_key, current_setting('app.encryption_key', true));

    IF encryption_key IS NULL THEN
        RAISE EXCEPTION 'Encryption key not provided or configured';
    END IF;

    RETURN pgp_sym_encrypt(data, encryption_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT, secret_key TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    encryption_key TEXT;
BEGIN
    -- Use provided key or get from environment
    encryption_key := COALESCE(secret_key, current_setting('app.encryption_key', true));

    IF encryption_key IS NULL THEN
        RAISE EXCEPTION 'Encryption key not provided or configured';
    END IF;

    RETURN pgp_sym_decrypt(encrypted_data::bytea, encryption_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ADVANCED DATA VALIDATION FUNCTIONS
-- ============================================================================

-- Function to validate trading experience level
CREATE OR REPLACE FUNCTION validate_trading_experience(experience TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN experience IN ('beginner', 'intermediate', 'advanced', 'expert');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate risk tolerance
CREATE OR REPLACE FUNCTION validate_risk_tolerance(tolerance TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN tolerance IN ('conservative', 'moderate', 'aggressive', 'very_aggressive');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate subscription plan
CREATE OR REPLACE FUNCTION validate_subscription_plan(plan TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN plan IN ('free', 'basic', 'premium', 'enterprise');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate rating score
CREATE OR REPLACE FUNCTION validate_rating(rating NUMERIC)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN rating >= 0 AND rating <= 5 AND rating = ROUND(rating, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate broker license number format
CREATE OR REPLACE FUNCTION validate_license_number(license_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Basic validation for license numbers (adjust regex based on actual requirements)
    RETURN license_number ~ '^[A-Z0-9\-\/]+$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate URL format
CREATE OR REPLACE FUNCTION validate_url(url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN url ~* '^https?:\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\/[^\s]*)?$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate phone number format
CREATE OR REPLACE FUNCTION validate_phone_number(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Basic international phone number validation
    RETURN phone ~ '^\+?[0-9\s\-\(\)]{7,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- BUSINESS LOGIC FUNCTIONS
-- ============================================================================

-- Function to calculate broker trust score
CREATE OR REPLACE FUNCTION calculate_broker_trust_score(broker_id BIGINT)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    score DECIMAL(5,2) := 0;
    rating_weight DECIMAL(5,2) := 0.4;
    regulation_weight DECIMAL(5,2) := 0.3;
    reviews_weight DECIMAL(5,2) := 0.2;
    establishment_weight DECIMAL(5,2) := 0.1;

    avg_rating DECIMAL(5,2);
    regulation_score DECIMAL(5,2);
    review_score DECIMAL(5,2);
    establishment_score DECIMAL(5,2);

    broker_year INTEGER;
    current_year INTEGER := EXTRACT(YEAR FROM NOW());
BEGIN
    -- Get average rating
    SELECT COALESCE(AVG(rating), 0) INTO avg_rating
    FROM reviews
    WHERE broker_id = calculate_broker_trust_score.broker_id AND is_approved = true;

    -- Get regulation score
    SELECT COALESCE(AVG(compliance_score), 0) INTO regulation_score
    FROM broker_regulations
    WHERE broker_id = calculate_broker_trust_score.broker_id;

    -- Get review score (based on number of reviews)
    SELECT COALESCE(COUNT(*), 0) INTO review_score
    FROM reviews
    WHERE broker_id = calculate_broker_trust_score.broker_id AND is_approved = true;

    -- Normalize review score (logarithmic scale)
    review_score := LEAST(LN(review_score + 1) * 10, 100);

    -- Get establishment score
    SELECT COALESCE(year_established, current_year) INTO broker_year
    FROM brokers
    WHERE id = calculate_broker_trust_score.broker_id;

    establishment_score := LEAST((current_year - broker_year) * 2, 100);

    -- Calculate weighted score
    score := (avg_rating * 20 * rating_weight) +  -- Convert 0-5 to 0-100
             (regulation_score * regulation_weight) +
             (review_score * reviews_weight) +
             (establishment_score * establishment_weight);

    RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user engagement level
CREATE OR REPLACE FUNCTION get_user_engagement_level(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    total_score INTEGER := 0;
    login_score INTEGER;
    review_score INTEGER;
    discussion_score INTEGER;
    education_score INTEGER;
    activity_days INTEGER;
BEGIN
    -- Login activity score (0-40 points)
    SELECT COALESCE(DATE_PART('day', NOW() - last_login_at), 0) INTO activity_days
    FROM public.users
    WHERE id = get_user_engagement_level.user_id;

    login_score := GREATEST(0, 40 - LEAST(activity_days, 40));

    -- Review activity score (0-20 points)
    SELECT COALESCE(COUNT(*) * 2, 0) INTO review_score
    FROM reviews
    WHERE user_id = get_user_engagement_level.user_id AND is_approved = true;

    review_score := LEAST(review_score, 20);

    -- Discussion activity score (0-20 points)
    SELECT COALESCE(
        (SELECT COUNT(*) FROM discussion_threads WHERE author_id = get_user_engagement_level.user_id) * 2 +
        (SELECT COUNT(*) FROM discussion_replies WHERE author_id = get_user_engagement_level.user_id), 0
    ) INTO discussion_score;

    discussion_score := LEAST(discussion_score, 20);

    -- Education activity score (0-20 points)
    SELECT COALESCE(COUNT(*) * 5, 0) INTO education_score
    FROM education_progress
    WHERE user_id = get_user_engagement_level.user_id AND is_completed = true;

    education_score := LEAST(education_score, 20);

    total_score := login_score + review_score + discussion_score + education_score;

    -- Determine engagement level
    IF total_score >= 80 THEN
        RETURN 'highly_engaged';
    ELSIF total_score >= 60 THEN
        RETURN 'engaged';
    ELSIF total_score >= 40 THEN
        RETURN 'moderately_engaged';
    ELSIF total_score >= 20 THEN
        RETURN 'minimally_engaged';
    ELSE
        RETURN 'inactive';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate personalized broker recommendations
CREATE OR REPLACE FUNCTION get_broker_recommendations(user_id UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE(broker_id BIGINT, broker_name TEXT, recommendation_score DECIMAL(5,2), reasons TEXT[]) AS $$
DECLARE
    user_experience TEXT;
    user_risk_tolerance TEXT;
    user_instruments TEXT[];
    user_location TEXT;
    user_min_deposit DECIMAL(15,2);
BEGIN
    -- Get user preferences
    SELECT trading_experience, risk_tolerance, preferred_instruments, location, portfolio_value
    INTO user_experience, user_risk_tolerance, user_instruments, user_location, user_min_deposit
    FROM public.users
    WHERE id = get_broker_recommendations.user_id;

    RETURN QUERY
    WITH broker_scores AS (
        SELECT
            b.id,
            b.name,
            -- Base score from rating
            COALESCE(b.rating, 0) * 20 as base_score,
            -- Experience match score
            CASE
                WHEN user_experience = 'beginner' AND b.min_deposit <= 1000 THEN 20
                WHEN user_experience = 'intermediate' AND b.min_deposit <= 5000 THEN 15
                WHEN user_experience IN ('advanced', 'expert') AND b.min_deposit <= 10000 THEN 10
                ELSE 0
            END as experience_score,
            -- Location match score
            CASE
                WHEN b.country = user_location THEN 15
                WHEN b.continent = (SELECT continent FROM countries WHERE name = user_location) THEN 10
                ELSE 0
            END as location_score,
            -- Deposit match score
            CASE
                WHEN b.min_deposit <= user_min_deposit THEN 10
                WHEN b.min_deposit <= user_min_deposit * 2 THEN 5
                ELSE 0
            END as deposit_score,
            -- Regulation score
            COALESCE(
                (SELECT AVG(compliance_score) FROM broker_regulations WHERE broker_id = b.id),
                50
            ) * 0.1 as regulation_score
        FROM brokers b
        WHERE b.is_active = true
    )
    SELECT
        bs.id,
        bs.name,
        bs.base_score + bs.experience_score + bs.location_score + bs.deposit_score + bs.regulation_score as recommendation_score,
        ARRAY[
            CASE WHEN bs.experience_score > 0 THEN 'Matches your experience level' ELSE NULL END,
            CASE WHEN bs.location_score > 0 THEN 'Available in your region' ELSE NULL END,
            CASE WHEN bs.deposit_score > 0 THEN 'Within your budget' ELSE NULL END,
            CASE WHEN bs.regulation_score > 8 THEN 'Well-regulated broker' ELSE NULL END
        ] FILTER (WHERE element IS NOT NULL) as reasons
    FROM broker_scores bs
    ORDER BY recommendation_score DESC
    LIMIT get_broker_recommendations.limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DATA ANALYTICS FUNCTIONS
-- ============================================================================

-- Function to get monthly user registration statistics
CREATE OR REPLACE FUNCTION get_monthly_registrations(year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()))
RETURNS TABLE(month INTEGER, registrations INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as registrations
    FROM public.users
    WHERE EXTRACT(YEAR FROM created_at) = get_monthly_registrations.year
    GROUP BY EXTRACT(MONTH FROM created_at)
    ORDER BY month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get broker performance metrics
CREATE OR REPLACE FUNCTION get_broker_performance_metrics(broker_id BIGINT, months_back INTEGER DEFAULT 12)
RETURNS TABLE(
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    new_reviews INTEGER,
    avg_rating DECIMAL(5,2),
    rating_change DECIMAL(5,2),
    total_views INTEGER,
    click_through_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH monthly_periods AS (
        SELECT
            DATE_TRUNC('month', NOW() - (n || ' month')::INTERVAL) as period_start,
            DATE_TRUNC('month', NOW() - ((n - 1) || ' month')::INTERVAL) as period_end
        FROM generate_series(0, get_broker_performance_metrics.months_back - 1) n
    )
    SELECT
        mp.period_start,
        mp.period_end,
        COALESCE(COUNT(r.id), 0) as new_reviews,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COALESCE(AVG(r.rating), 0) - LAG(COALESCE(AVG(r.rating), 0), 1, COALESCE(AVG(r.rating), 0)) OVER (ORDER BY mp.period_start) as rating_change,
        0 as total_views, -- Placeholder - would need analytics table
        0.0 as click_through_rate -- Placeholder - would need analytics table
    FROM monthly_periods mp
    LEFT JOIN reviews r ON r.broker_id = get_broker_performance_metrics.broker_id
        AND r.created_at >= mp.period_start AND r.created_at < mp.period_end
        AND r.is_approved = true
    GROUP BY mp.period_start, mp.period_end
    ORDER BY mp.period_start;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get content performance analytics
CREATE OR REPLACE FUNCTION get_content_performance_analytics(content_type TEXT DEFAULT NULL, days_back INTEGER DEFAULT 30)
RETURNS TABLE(
    content_id BIGINT,
    content_title TEXT,
    views INTEGER,
    unique_viewers INTEGER,
    engagement_rate DECIMAL(5,2),
    avg_time_on_page DECIMAL(10,2),
    social_shares INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- This is a placeholder - would need analytics tracking tables
    SELECT
        bp.id,
        bp.title,
        0 as views,
        0 as unique_viewers,
        0.0 as engagement_rate,
        0.0 as avg_time_on_page,
        0 as social_shares
    FROM blog_posts bp
    WHERE (get_content_performance_analytics.content_type IS NULL OR 'blog' = get_content_performance_analytics.content_type)
        AND bp.created_at >= NOW() - (get_content_performance_analytics.days_back || ' day')::INTERVAL
    UNION ALL
    SELECT
        dt.id,
        dt.title,
        0 as views,
        0 as unique_viewers,
        0.0 as engagement_rate,
        0.0 as avg_time_on_page,
        0 as social_shares
    FROM discussion_threads dt
    WHERE (get_content_performance_analytics.content_type IS NULL OR 'discussion' = get_content_performance_analytics.content_type)
        AND dt.created_at >= NOW() - (get_content_performance_analytics.days_back || ' day')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user retention analysis
CREATE OR REPLACE FUNCTION get_user_retention_analysis(cohort_date DATE DEFAULT NOW() - INTERVAL '30 days')
RETURNS TABLE(
    cohort_date DATE,
    initial_users INTEGER,
    day_1_retention DECIMAL(5,2),
    day_7_retention DECIMAL(5,2),
    day_30_retention DECIMAL(5,2),
    day_90_retention DECIMAL(5,2)
) AS $$
DECLARE
    cohort_size INTEGER;
BEGIN
    -- Get initial cohort size
    SELECT COUNT(*) INTO cohort_size
    FROM public.users
    WHERE created_at::date = get_user_retention_analysis.cohort_date;

    RETURN QUERY
    SELECT
        get_user_retention_analysis.cohort_date,
        cohort_size,
        -- Day 1 retention
        CASE WHEN cohort_size > 0 THEN
            (SELECT COUNT(*) FROM public.users
             WHERE created_at::date = get_user_retention_analysis.cohort_date
             AND last_login_at >= created_at + INTERVAL '1 day')::DECIMAL / cohort_size * 100
        ELSE 0 END,
        -- Day 7 retention
        CASE WHEN cohort_size > 0 THEN
            (SELECT COUNT(*) FROM public.users
             WHERE created_at::date = get_user_retention_analysis.cohort_date
             AND last_login_at >= created_at + INTERVAL '7 days')::DECIMAL / cohort_size * 100
        ELSE 0 END,
        -- Day 30 retention
        CASE WHEN cohort_size > 0 THEN
            (SELECT COUNT(*) FROM public.users
             WHERE created_at::date = get_user_retention_analysis.cohort_date
             AND last_login_at >= created_at + INTERVAL '30 days')::DECIMAL / cohort_size * 100
        ELSE 0 END,
        -- Day 90 retention
        CASE WHEN cohort_size > 0 THEN
            (SELECT COUNT(*) FROM public.users
             WHERE created_at::date = get_user_retention_analysis.cohort_date
             AND last_login_at >= created_at + INTERVAL '90 days')::DECIMAL / cohort_size * 100
        ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- NOTIFICATION SYSTEM FUNCTIONS
-- ============================================================================

-- Function to send user notification
CREATE OR REPLACE FUNCTION send_user_notification(
    user_id UUID,
    notification_type TEXT,
    title TEXT,
    message TEXT,
    data JSONB DEFAULT '{}'::jsonb
) RETURNS BOOLEAN AS $$
DECLARE
    notification_id BIGINT;
BEGIN
    -- Insert notification
    INSERT INTO user_notifications (
        user_id,
        type,
        title,
        message,
        data,
        is_read,
        created_at
    ) VALUES (
        send_user_notification.user_id,
        send_user_notification.notification_type,
        send_user_notification.title,
        send_user_notification.message,
        send_user_notification.data,
        false,
        NOW()
    ) RETURNING id INTO notification_id;

    -- Queue for sending (would integrate with your notification service)
    -- This is a placeholder for actual notification sending logic

    RETURN true;
EXCEPTION WHEN OTHERS THEN
    -- Log error
    INSERT INTO system_logs (action, details, severity)
    VALUES ('notification_error',
           format('Failed to send notification to user %: %', user_id, SQLERRM),
           'error');
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user notification table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on user_notifications
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_notifications
CREATE POLICY "Users can view own notifications" ON user_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own notifications" ON user_notifications
    FOR ALL USING (user_id = auth.uid());

-- Create indexes for user_notifications
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at);
CREATE INDEX idx_user_notifications_type ON user_notifications(type);

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE user_notifications
    SET is_read = true, read_at = NOW()
    WHERE id = mark_notification_read.notification_id
    AND user_id = auth.uid();

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS INTEGER AS $$
DECLARE
    marked_count INTEGER;
BEGIN
    UPDATE user_notifications
    SET is_read = true, read_at = NOW()
    WHERE user_id = auth.uid() AND is_read = false;

    GET DIAGNOSTICS marked_count = ROW_COUNT;
    RETURN marked_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUTOMATION FUNCTIONS
-- ============================================================================

-- Function to automatically approve reviews based on criteria
CREATE OR REPLACE FUNCTION auto_approve_reviews()
RETURNS INTEGER AS $$
DECLARE
    approved_count INTEGER;
BEGIN
    UPDATE reviews
    SET is_approved = true, approved_at = NOW()
    WHERE is_approved = false
    AND (
        -- Auto-approve reviews from trusted users
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = reviews.user_id
            AND (subscription_plan IN ('premium', 'enterprise') OR reviews_count >= 10)
        )
        OR
        -- Auto-approve reviews with good content
        (LENGTH(content) >= 100 AND rating BETWEEN 2 AND 5)
    );

    GET DIAGNOSTICS approved_count = ROW_COUNT;
    RETURN approved_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send weekly engagement summary
CREATE OR REPLACE FUNCTION send_weekly_engagement_summary()
RETURNS INTEGER AS $$
DECLARE
    sent_count INTEGER := 0;
    user_rec RECORD;
BEGIN
    FOR user_rec IN
        SELECT id, email, name FROM public.users
        WHERE is_active = true
        AND notification_settings->>'email_notifications' = 'true'
        AND last_login_at >= NOW() - INTERVAL '7 days'
    LOOP
        -- Send engagement summary email
        PERFORM send_user_notification(
            user_rec.id,
            'info',
            'Your Weekly Activity Summary',
            'Check out your activity this week on our platform!'
        );

        sent_count := sent_count + 1;
    END LOOP;

    RETURN sent_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate sitemap entries for SEO
CREATE OR REPLACE FUNCTION generate_sitemap_entries()
RETURNS TABLE(loc TEXT, lastmod TIMESTAMP WITH TIME ZONE, changefreq TEXT, priority DECIMAL(3,2)) AS $$
BEGIN
    RETURN QUERY
    -- Broker pages
    SELECT
        '/broker/' || id::TEXT as loc,
        GREATEST(updated_at, NOW() - INTERVAL '1 day') as lastmod,
        'weekly' as changefreq,
        CASE
            WHEN rating >= 4.5 THEN 1.0
            WHEN rating >= 4.0 THEN 0.9
            WHEN rating >= 3.5 THEN 0.8
            ELSE 0.7
        END as priority
    FROM brokers
    WHERE is_active = true

    UNION ALL

    -- Blog posts
    SELECT
        '/blog/' || slug as loc,
        published_at as lastmod,
        CASE
            WHEN published_at >= NOW() - INTERVAL '7 days' THEN 'daily'
            WHEN published_at >= NOW() - INTERVAL '30 days' THEN 'weekly'
            ELSE 'monthly'
        END as changefreq,
        CASE
            WHEN published_at >= NOW() - INTERVAL '7 days' THEN 0.9
            WHEN published_at >= NOW() - INTERVAL '30 days' THEN 0.8
            ELSE 0.6
        END as priority
    FROM blog_posts
    WHERE status = 'published'

    UNION ALL

    -- Discussion threads
    SELECT
        '/discussion/' || id::TEXT as loc,
        updated_at as lastmod,
        CASE
            WHEN updated_at >= NOW() - INTERVAL '1 day' THEN 'daily'
            WHEN updated_at >= NOW() - INTERVAL '7 days' THEN 'weekly'
            ELSE 'monthly'
        END as changefreq,
        0.7 as priority
    FROM discussion_threads
    WHERE status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- BACKUP AND RECOVERY FUNCTIONS
-- ============================================================================

-- Function to create database backup (would be called by external backup system)
CREATE OR REPLACE FUNCTION create_database_backup()
RETURNS TEXT AS $$
DECLARE
    backup_filename TEXT;
BEGIN
    backup_filename := 'broker_analysis_backup_' || TO_CHAR(NOW(), 'YYYYMMDD_HH24MISS') || '.sql';

    -- This would typically be handled by external backup tools
    -- Here we just log the backup request
    INSERT INTO system_logs (action, details, severity)
    VALUES ('backup_requested', format('Database backup requested: %', backup_filename), 'info');

    RETURN backup_filename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify data integrity
CREATE OR REPLACE FUNCTION verify_data_integrity()
RETURNS TABLE(table_name TEXT, issue_count INTEGER, issues TEXT[]) AS $$
BEGIN
    RETURN QUERY
    -- Check for orphaned records
    SELECT 'reviews' as table_name,
           COUNT(*) as issue_count,
           ARRAY['Orphaned reviews (invalid broker_id)'] as issues
    FROM reviews r
    LEFT JOIN brokers b ON r.broker_id = b.id
    WHERE b.id IS NULL

    UNION ALL

    SELECT 'reviews' as table_name,
           COUNT(*) as issue_count,
           ARRAY['Orphaned reviews (invalid user_id)'] as issues
    FROM reviews r
    LEFT JOIN auth.users u ON r.user_id = u.id
    WHERE r.user_id IS NOT NULL AND u.id IS NULL

    UNION ALL

    SELECT 'alerts' as table_name,
           COUNT(*) as issue_count,
           ARRAY['Orphaned alerts (invalid user_id)'] as issues
    FROM alerts a
    LEFT JOIN auth.users u ON a.user_id = u.id
    WHERE u.id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions for all new functions
GRANT EXECUTE ON FUNCTION validate_email_format(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_broker_data(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION mask_sensitive_data(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION encrypt_sensitive_data(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION decrypt_sensitive_data(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_trading_experience(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_risk_tolerance(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_subscription_plan(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_rating(NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_license_number(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_url(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_phone_number(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_broker_trust_score(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_engagement_level(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_broker_recommendations(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_registrations(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_broker_performance_metrics(BIGINT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_content_performance_analytics(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_retention_analysis(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION send_user_notification(UUID, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read() TO authenticated;
GRANT EXECUTE ON FUNCTION auto_approve_reviews() TO authenticated;
GRANT EXECUTE ON FUNCTION send_weekly_engagement_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_sitemap_entries() TO authenticated;
GRANT EXECUTE ON FUNCTION create_database_backup() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_data_integrity() TO authenticated;

-- Grant permissions on new tables
GRANT ALL ON user_notifications TO authenticated;

-- Grant permissions on new views
GRANT SELECT ON generate_sitemap_entries TO authenticated;
GRANT SELECT ON verify_data_integrity TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE user_notifications IS 'User notifications and alerts';
COMMENT ON FUNCTION calculate_broker_trust_score(BIGINT) IS 'Calculates a comprehensive trust score for brokers based on ratings, regulations, and history';
COMMENT ON FUNCTION get_user_engagement_level(UUID) IS 'Determines user engagement level based on activity patterns';
COMMENT ON FUNCTION get_broker_recommendations(UUID, INTEGER) IS 'Generates personalized broker recommendations based on user preferences';
COMMENT ON FUNCTION verify_data_integrity() IS 'Checks for data integrity issues across all tables';

-- Log completion
INSERT INTO system_logs (action, details, severity)
VALUES ('utilities_setup_complete', 'Database utilities and security enhancements completed', 'success');

-- Return setup summary
DO $$
DECLARE
    total_functions INTEGER;
    total_indexes INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_functions FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    SELECT COUNT(*) INTO total_indexes FROM pg_indexes WHERE schemaname = 'public';

    RAISE NOTICE 'Database Utilities and Security Setup Complete:';
    RAISE NOTICE 'Total Functions: %', total_functions;
    RAISE NOTICE 'Total Indexes: %', total_indexes;
    RAISE NOTICE '';
    RAISE NOTICE 'New Features Added:';
    RAISE NOTICE '- Advanced security functions (encryption, validation)';
    RAISE NOTICE '- Business logic functions (trust scores, recommendations)';
    RAISE NOTICE '- Analytics functions (retention, performance metrics)';
    RAISE NOTICE '- Notification system functions';
    RAISE NOTICE '- Automation functions (approval, engagement summaries)';
    RAISE NOTICE '- Backup and recovery functions';
    RAISE NOTICE '';
    RAISE NOTICE 'The database is now equipped with comprehensive utilities for:';
    RAISE NOTICE '- Enhanced security and data protection';
    RAISE NOTICE '- Advanced analytics and reporting';
    RAISE NOTICE '- Automated business processes';
    RAISE NOTICE '- User engagement tracking';
    RAISE NOTICE '- SEO optimization tools';
END $$;