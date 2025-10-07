-- ============================================
-- Complete Data Import Script
-- ============================================
-- Master script to import all data into Supabase database
-- Run this script to populate all tables with sample data

-- Set transaction isolation level for consistency
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Start transaction for atomic import
BEGIN;

-- Display import information
RAISE NOTICE 'Starting complete data import...';
RAISE NOTICE 'This script will import:';
RAISE NOTICE '  - Alerts data (8 alerts)';
RAISE NOTICE '  - News articles (6 articles)');
RAISE NOTICE '  - Quiz data (8 quizzes with questions)');
RAISE NOTICE '  - User preferences and progress (3 sample users)');
RAISE NOTICE '';

-- Step 1: Import alerts data
RAISE NOTICE 'Step 1: Importing alerts data...';
\i import_alerts.sql

-- Verify alerts import
DO $$
DECLARE
    alert_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO alert_count FROM alerts;
    RAISE NOTICE 'Alerts imported: % records', alert_count;
END $$;

-- Step 2: Import news articles data
RAISE NOTICE 'Step 2: Importing news articles data...';
\i import_news_articles.sql

-- Verify news articles import
DO $$
DECLARE
    news_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO news_count FROM news_articles;
    RAISE NOTICE 'News articles imported: % records', news_count;
END $$;

-- Step 3: Import quiz data
RAISE NOTICE 'Step 3: Importing quiz data...';
\i import_quiz_data.sql

-- Verify quiz data import
DO $$
DECLARE
    quiz_count INTEGER;
    question_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO quiz_count FROM quiz_data;
    SELECT COALESCE(SUM(total_questions), 0) INTO question_count FROM quiz_data;
    RAISE NOTICE 'Quizzes imported: % quizzes with % total questions', quiz_count, question_count;
END $$;

-- Step 4: Import user preferences and progress data
RAISE NOTICE 'Step 4: Importing user preferences and progress data...';
\i import_user_preferences.sql

-- Verify user data import
DO $$
DECLARE
    user_prefs_count INTEGER;
    edu_progress_count INTEGER;
    quiz_results_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_prefs_count FROM user_alert_preferences;
    SELECT COUNT(*) INTO edu_progress_count FROM education_progress;
    SELECT COUNT(*) INTO quiz_results_count FROM quiz_results;
    RAISE NOTICE 'User preferences imported: % records', user_prefs_count;
    RAISE NOTICE 'Education progress records: % records', edu_progress_count;
    RAISE NOTICE 'Quiz results: % records', quiz_results_count;
END $$;

-- Final validation and data consistency checks
RAISE NOTICE '';
RAISE NOTICE 'Performing final validation checks...';

DO $$
DECLARE
    broker_check INTEGER;
    quiz_broker_check INTEGER;
    orphaned_alerts INTEGER;
    orphaned_progress INTEGER;
BEGIN
    -- Check if required brokers exist
    SELECT COUNT(*) INTO broker_check FROM brokers WHERE id IN ('pepperstone', 'ic-markets', 'xtb', 'forex-com', 'etoro', 'ironfx', 'bitget');

    -- Check if quizzes reference valid quiz data
    SELECT COUNT(*) INTO quiz_broker_check FROM quiz_data;

    -- Check for orphaned alerts (alerts without valid broker references)
    SELECT COUNT(*) INTO orphaned_alerts FROM alerts WHERE broker_id NOT IN (SELECT id FROM brokers);

    -- Check for orphaned progress records (progress without valid quiz references)
    SELECT COUNT(*) INTO orphaned_progress FROM education_progress WHERE quiz_id NOT IN (SELECT id FROM quiz_data);

    RAISE NOTICE 'Data validation results:';
    RAISE NOTICE '  Required brokers found: %', broker_check;
    RAISE NOTICE '  Quizzes in database: %', quiz_broker_check;
    RAISE NOTICE '  Orphaned alerts: %', orphaned_alerts;
    RAISE NOTICE '  Orphaned progress records: %', orphaned_progress;

    IF orphaned_alerts > 0 THEN
        RAISE WARNING 'Warning: Found % orphaned alerts (invalid broker references)', orphaned_alerts;
    END IF;

    IF orphaned_progress > 0 THEN
        RAISE WARNING 'Warning: Found % orphaned progress records (invalid quiz references)', orphaned_progress;
    END IF;

    IF broker_check < 7 THEN
        RAISE WARNING 'Warning: Only % out of 7 required brokers found in database', broker_check;
    END IF;
END $$;

-- Generate summary statistics
RAISE NOTICE '';
RAISE NOTICE 'Import Summary:';
RAISE NOTICE '================';

DO $$
DECLARE
    total_alerts INTEGER;
    total_news INTEGER;
    total_quizzes INTEGER;
    total_questions INTEGER;
    total_users INTEGER;
    high_severity_alerts INTEGER;
    featured_articles INTEGER;
    published_quizzes INTEGER;
    avg_quiz_score NUMERIC;
BEGIN
    -- Overall counts
    SELECT COUNT(*) INTO total_alerts FROM alerts;
    SELECT COUNT(*) INTO total_news FROM news_articles;
    SELECT COUNT(*) INTO total_quizzes FROM quiz_data;
    SELECT COALESCE(SUM(total_questions), 0) INTO total_questions FROM quiz_data;
    SELECT COUNT(DISTINCT user_id) INTO total_users FROM user_alert_preferences;

    -- Alert severity breakdown
    SELECT COUNT(*) INTO high_severity_alerts FROM alerts WHERE severity = 'High';

    -- News and quiz stats
    SELECT COUNT(*) INTO featured_articles FROM news_articles WHERE is_featured = true;
    SELECT COUNT(*) INTO published_quizzes FROM quiz_data WHERE is_published = true;

    -- Average quiz score
    SELECT COALESCE(AVG(percentage), 0) INTO avg_quiz_score FROM quiz_results;

    RAISE NOTICE 'Total records imported:';
    RAISE NOTICE '  Alerts: %', total_alerts;
    RAISE NOTICE '  News articles: %', total_news;
    RAISE NOTICE '  Quizzes: % (with % total questions)', total_quizzes, total_questions;
    RAISE NOTICE '  Sample users: %', total_users;
    RAISE NOTICE '';
    RAISE NOTICE 'Content quality metrics:';
    RAISE NOTICE '  High-severity alerts: %', high_severity_alerts;
    RAISE NOTICE '  Featured articles: %', featured_articles;
    RAISE NOTICE '  Published quizzes: %', published_quizzes;
    RAISE NOTICE '  Average quiz score: %%%', ROUND(avg_quiz_score, 1);

    -- Category breakdowns
    RAISE NOTICE '';
    RAISE NOTICE 'Alert severity distribution:';
    FOR severity_rec IN SELECT severity, COUNT(*) as count FROM alerts GROUP BY severity ORDER BY count DESC LOOP
        RAISE NOTICE '  %: %', severity_rec.severity, severity_rec.count;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE 'News categories:';
    FOR cat_rec IN SELECT category, COUNT(*) as count FROM news_articles GROUP BY category ORDER BY count DESC LOOP
        RAISE NOTICE '  %: %', cat_rec.category, cat_rec.count;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE 'Quiz difficulty distribution:';
    FOR diff_rec IN SELECT difficulty_level, COUNT(*) as count FROM quiz_data GROUP BY difficulty_level ORDER BY count DESC LOOP
        RAISE NOTICE '  %: %', diff_rec.difficulty_level, diff_rec.count;
    END LOOP;
END $$;

-- Create helpful views for common queries
RAISE NOTICE '';
RAISE NOTICE 'Creating helpful database views...';

CREATE OR REPLACE VIEW vw_alert_summary AS
SELECT
    severity,
    COUNT(*) as total_count,
    COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count,
    COUNT(CASE WHEN alert_type = 'regulatory' THEN 1 END) as regulatory_count,
    COUNT(CASE WHEN alert_type = 'security' THEN 1 END) as security_count,
    COUNT(CASE WHEN alert_type = 'maintenance' THEN 1 END) as maintenance_count,
    COUNT(CASE WHEN status = 'critical' THEN 1 END) as critical_count
FROM alerts
GROUP BY severity
ORDER BY
    CASE severity
        WHEN 'High' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Low' THEN 3
    END;

CREATE OR REPLACE VIEW vw_user_progress_summary AS
SELECT
    ep.user_id,
    COUNT(DISTINCT ep.quiz_id) as unique_quizzes_attempted,
    COUNT(*) as total_attempts,
    MAX(ep.best_score) as highest_score,
    AVG(ep.last_score) as average_score,
    SUM(ep.time_spent_minutes) as total_minutes_spent,
    MAX(ep.completed_at) as last_activity,
    COUNT(DISTINCT q.category) as categories_explored
FROM education_progress ep
JOIN quiz_data q ON ep.quiz_id = q.id
GROUP BY ep.user_id;

CREATE OR REPLACE VIEW vw_quiz_performance AS
SELECT
    q.id,
    q.title,
    q.category,
    q.difficulty_level,
    q.total_questions,
    COUNT(ep.user_id) as total_attempts,
    AVG(ep.best_score) as average_best_score,
    AVG(ep.last_score) as average_last_score,
    AVG(ep.time_spent_minutes) as average_time_spent,
    MAX(ep.best_score) as highest_score_achieved,
    MIN(ep.best_score) as lowest_score_achieved
FROM quiz_data q
LEFT JOIN education_progress ep ON q.id = ep.quiz_id
GROUP BY q.id, q.title, q.category, q.difficulty_level, q.total_questions
ORDER BY q.difficulty_level, q.title;

RAISE NOTICE 'Database views created successfully';

-- Update materialized view for search if applicable (PostgreSQL feature)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_news_search AS
SELECT
    id,
    title,
    summary,
    category,
    importance,
    publication_date,
    to_tsvector('english', title || ' ' || summary || ' ' || full_content) as search_vector
FROM news_articles;

-- Create index for the materialized view
CREATE INDEX IF NOT EXISTS idx_mv_news_search_vector ON mv_news_search USING GIN(search_vector);

RAISE NOTICE 'Search optimization completed';

-- Final transaction commit
COMMIT;

RAISE NOTICE '';
RAISE NOTICE '🎉 Data import completed successfully!';
RAISE NOTICE '';
RAISE NOTICE 'You can now use the following verification queries to check your data:';
RAISE NOTICE '';
RAISE NOTICE '-- Check overall record counts:';
RAISE NOTICE 'SELECT COUNT(*) FROM alerts;';
RAISE NOTICE 'SELECT COUNT(*) FROM news_articles;';
RAISE NOTICE 'SELECT COUNT(*) FROM quiz_data;';
RAISE NOTICE 'SELECT COUNT(*) FROM user_alert_preferences;';
RAISE NOTICE '';
RAISE NOTICE '-- View alert summaries:';
RAISE NOTICE 'SELECT * FROM vw_alert_summary;';
RAISE NOTICE '';
RAISE NOTICE '-- Check user progress:';
RAISE NOTICE 'SELECT * FROM vw_user_progress_summary;';
RAISE NOTICE '';
RAISE NOTICE '-- View quiz performance:';
RAISE NOTICE 'SELECT * FROM vw_quiz_performance;';
RAISE NOTICE '';
RAISE NOTICE '-- Test full-text search on news:';
RAISE NOTICE 'SELECT id, title, category FROM mv_news_search WHERE search_vector @@ to_tsquery(''english'', ''fed & rate'');';
RAISE NOTICE '';
RAISE NOTICE 'Database is ready for use! 🚀';