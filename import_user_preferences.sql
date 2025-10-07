-- ============================================
-- User Preferences and Sample Data Import Script
-- ============================================
-- This script creates sample user preferences, alert subscriptions,
-- and education progress data for testing purposes

BEGIN TRANSACTION;

-- Clear existing sample data (optional - comment out if you want to append)
-- Note: In production, you might want to be more careful with user data deletion
TRUNCATE TABLE user_alert_preferences RESTART IDENTITY CASCADE;
TRUNCATE TABLE education_progress RESTART IDENTITY CASCADE;
TRUNCATE TABLE quiz_results RESTART IDENTITY CASCADE;

-- Create sample user IDs (these would typically come from your auth system)
-- For this script, we'll use some sample UUIDs
DO $$
DECLARE
    sample_user_1 UUID := gen_random_uuid();
    sample_user_2 UUID := gen_random_uuid();
    sample_user_3 UUID := gen_random_uuid();
BEGIN
    -- Create user alert preferences
    INSERT INTO user_alert_preferences (
        user_id,
        broker_id,
        severity_filter,
        alert_types,
        email_notifications,
        push_notifications,
        created_at,
        updated_at
    ) VALUES
    -- User 1 preferences - Active forex trader interested in major brokers
    (
        sample_user_1,
        'pepperstone',
        ARRAY['High', 'Medium'],
        ARRAY['regulatory', 'maintenance', 'feature'],
        true,
        true,
        NOW(),
        NOW()
    ),
    (
        sample_user_1,
        'ic-markets',
        ARRAY['High', 'Medium'],
        ARRAY['regulatory', 'security'],
        true,
        true,
        NOW(),
        NOW()
    ),
    (
        sample_user_1,
        'xtb',
        ARRAY['High'],
        ARRAY['regulatory'],
        false,
        true,
        NOW(),
        NOW()
    ),
    -- User 2 preferences - Conservative trader focused on low-risk brokers
    (
        sample_user_2,
        'forex-com',
        ARRAY['High', 'Medium', 'Low'],
        ARRAY['regulatory', 'maintenance', 'feature', 'security'],
        true,
        false,
        NOW(),
        NOW()
    ),
    (
        sample_user_2,
        'pepperstone',
        ARRAY['High'],
        ARRAY['regulatory'],
        true,
        false,
        NOW(),
        NOW()
    ),
    -- User 3 preferences - Crypto and high-risk broker enthusiast
    (
        sample_user_3,
        'etoro',
        ARRAY['High', 'Medium'],
        ARRAY['regulatory', 'security', 'feature'],
        true,
        true,
        NOW(),
        NOW()
    ),
    (
        sample_user_3,
        'bitget',
        ARRAY['High', 'Medium', 'Low'],
        ARRAY['security', 'regulatory', 'maintenance'],
        true,
        true,
        NOW(),
        NOW()
    ),
    (
        sample_user_3,
        'ironfx',
        ARRAY['High', 'Medium'],
        ARRAY['regulatory', 'security'],
        true,
        true,
        NOW(),
        NOW()
    );

    -- Create education progress data
    INSERT INTO education_progress (
        user_id,
        quiz_key,
        quiz_id,
        best_score,
        last_score,
        attempts_count,
        completed_at,
        last_attempt_at,
        time_spent_minutes,
        created_at,
        updated_at,
        progress_data
    ) VALUES
    -- User 1 progress - Active learner, completed beginner quizzes
    (
        sample_user_1,
        'forex-basics',
        'quiz-001',
        100,
        90,
        3,
        '2025-09-15T10:30:00Z',
        '2025-09-15T10:30:00Z',
        25,
        NOW(),
        NOW(),
        '{"first_attempt_score": 70, "improvement": 20, "weak_areas": ["leverage_concept"], "strong_areas": ["currency_pairs"]}'
    ),
    (
        sample_user_1,
        'broker-fees',
        'quiz-002',
        80,
        80,
        2,
        '2025-09-16T14:15:00Z',
        '2025-09-16T14:15:00Z',
        18,
        NOW(),
        NOW(),
        '{"first_attempt_score": 75, "improvement": 5, "weak_areas": ["overnight_fees"], "strong_areas": ["spread_types"]}'
    ),
    (
        sample_user_1,
        'risk-management',
        'quiz-003',
        90,
        85,
        2,
        '2025-09-17T09:45:00Z',
        '2025-09-17T09:45:00Z',
        15,
        NOW(),
        NOW(),
        '{"first_attempt_score": 80, "improvement": 5, "weak_areas": ["position_sizing"], "strong_areas": ["stop_loss"]}'
    ),
    (
        sample_user_1,
        'charting-intro',
        'quiz-004',
        70,
        70,
        1,
        '2025-09-18T16:20:00Z',
        '2025-09-18T16:20:00Z',
        12,
        NOW(),
        NOW(),
        '{"first_attempt_score": 70, "weak_areas": ["trend_lines"], "strong_areas": ["candlestick_reading"]}'
    ),
    -- User 2 progress - Intermediate learner
    (
        sample_user_2,
        'forex-basics',
        'quiz-001',
        100,
        100,
        1,
        '2025-09-10T11:00:00Z',
        '2025-09-10T11:00:00Z',
        10,
        NOW(),
        NOW(),
        '{"first_attempt_score": 100, "perfect_score": true, "completed_quickly": true}'
    ),
    (
        sample_user_2,
        'broker-fees',
        'quiz-002',
        90,
        90,
        1,
        '2025-09-12T15:30:00Z',
        '2025-09-12T15:30:00Z',
        16,
        NOW(),
        NOW(),
        '{"first_attempt_score": 90, "weak_areas": ["inactivity_fees"], "strong_areas": ["account_types"]}'
    ),
    (
        sample_user_2,
        'candlestick-patterns',
        'quiz-005',
        60,
        60,
        1,
        '2025-09-19T13:45:00Z',
        '2025-09-19T13:45:00Z',
        20,
        NOW(),
        NOW(),
        '{"first_attempt_score": 60, "struggled_with": ["complex_patterns"], "needs_practice": true}'
    ),
    (
        sample_user_2,
        'moving-averages',
        'quiz-006',
        75,
        75,
        1,
        '2025-09-20T10:15:00Z',
        '2025-09-20T10:15:00Z',
        14,
        NOW(),
        NOW(),
        '{"first_attempt_score": 75, "understands_concepts": true, "needs_application_practice": true}'
    ),
    -- User 3 progress - Advanced learner focusing on complex topics
    (
        sample_user_3,
        'forex-basics',
        'quiz-001',
        100,
        100,
        1,
        '2025-08-25T09:00:00Z',
        '2025-08-25T09:00:00Z',
        8,
        NOW(),
        NOW(),
        '{"first_attempt_score": 100, "prior_knowledge": true, "completed_very_quickly": true}'
    ),
    (
        sample_user_3,
        'risk-management',
        'quiz-003',
        95,
        95,
        1,
        '2025-08-28T14:20:00Z',
        '2025-08-28T14:20:00Z',
        11,
        NOW(),
        NOW(),
        '{"first_attempt_score": 95, "advanced_understanding": true, "minor_mistakes": true}'
    ),
    (
        sample_user_3,
        'fibonacci-retracement',
        'quiz-007',
        80,
        75,
        3,
        '2025-09-21T11:30:00Z',
        '2025-09-21T11:30:00Z',
        25,
        NOW(),
        NOW(),
        '{"first_attempt_score": 65, "second_attempt": 70, "third_attempt": 75, "improvement": 10, "strong_areas": ["golden_ratio"], "weak_areas": ["extension_levels"]}'
    ),
    (
        sample_user_3,
        'elliott-wave',
        'quiz-008',
        70,
        70,
        2,
        '2025-09-22T16:45:00Z',
        '2025-09-22T16:45:00Z',
    30,
        NOW(),
        NOW(),
        '{"first_attempt_score": 60, "second_attempt": 70, "improvement": 10, "complex_topic": true, "needs_more_study": true}'
    );

    -- Create detailed quiz results for tracking question-level performance
    INSERT INTO quiz_results (
        user_id,
        quiz_id,
        quiz_key,
        score,
        total_questions,
        percentage,
        time_taken_minutes,
        answers,
        completed_at,
        created_at,
        session_data
    ) VALUES
    -- User 1's latest quiz results
    (
        sample_user_1,
        'quiz-001',
        'forex-basics',
        4,
        5,
        80,
        10,
        '{"answers": [{"question": 1, "correct": true, "user_answer": "Foreign Exchange", "time_spent": 30}, {"question": 2, "correct": true, "user_answer": "Two currencies traded against each other", "time_spent": 45}, {"question": 3, "correct": false, "user_answer": "A type of order", "time_spent": 60}, {"question": 4, "correct": true, "user_answer": "GBP/USD", "time_spent": 20}, {"question": 5, "correct": true, "user_answer": "Borrowing capital to control larger positions", "time_spent": 55}]}',
        '2025-09-15T10:30:00Z',
        NOW(),
        '{"device": "desktop", "browser": "chrome", "attempts_before_completion": 1, "paused": false}'
    ),
    (
        sample_user_1,
        'quiz-002',
        'broker-fees',
        4,
        5,
        80,
        18,
        '{"answers": [{"question": 1, "correct": true, "user_answer": "The difference between bid and ask prices", "time_spent": 40}, {"question": 2, "correct": true, "user_answer": "ECN Account", "time_spent": 50}, {"question": 3, "correct": true, "user_answer": "A charge for not trading", "time_spent": 35}, {"question": 4, "correct": false, "user_answer": "Commission fees", "time_spent": 70}, {"question": 5, "correct": true, "user_answer": "Islamic Account", "time_spent": 25}]}',
        '2025-09-16T14:15:00Z',
        NOW(),
        '{"device": "mobile", "browser": "safari", "attempts_before_completion": 1, "paused": false}'
    ),
    -- User 2's quiz results
    (
        sample_user_2,
        'quiz-001',
        'forex-basics',
        5,
        5,
        100,
        10,
        '{"answers": [{"question": 1, "correct": true, "user_answer": "Foreign Exchange", "time_spent": 15}, {"question": 2, "correct": true, "user_answer": "Two currencies traded against each other", "time_spent": 20}, {"question": 3, "correct": true, "user_answer": "The smallest price move", "time_spent": 18}, {"question": 4, "correct": true, "user_answer": "GBP/USD", "time_spent": 12}, {"question": 5, "correct": true, "user_answer": "Borrowing capital to control larger positions", "time_spent": 15}]}',
        '2025-09-10T11:00:00Z',
        NOW(),
        '{"device": "desktop", "browser": "firefox", "attempts_before_completion": 1, "paused": false, "perfect_score": true}'
    ),
    (
        sample_user_2,
        'quiz-005',
        'candlestick-patterns',
        3,
        5,
        60,
        20,
        '{"answers": [{"question": 1, "correct": true, "user_answer": "Market indecision", "time_spent": 45}, {"question": 2, "correct": true, "user_answer": "Bullish reversal pattern", "time_spent": 60}, {"question": 3, "correct": false, "user_answer": "Bearish reversal", "time_spent": 90}, {"question": 4, "correct": false, "user_answer": "Bullish reversal pattern", "time_spent": 120}, {"question": 5, "correct": true, "user_answer": "Rejection of price levels", "time_spent": 30}]}',
        '2025-09-19T13:45:00Z',
        NOW(),
        '{"device": "tablet", "browser": "chrome", "attempts_before_completion": 1, "paused": true, "struggled_with": "complex_patterns"}'
    ),
    -- User 3's advanced quiz results
    (
        sample_user_3,
        'quiz-007',
        'fibonacci-retracement',
        4,
        5,
        80,
        25,
        '{"answers": [{"question": 1, "correct": true, "user_answer": "23.6%, 38.2%, 50%, 61.8%, 78.6%", "time_spent": 30}, {"question": 2, "correct": true, "user_answer": "61.8%", "time_spent": 25}, {"question": 3, "correct": true, "user_answer": "From swing high to swing low", "time_spent": 40}, {"question": 4, "correct": false, "user_answer": "Finding support levels", "time_spent": 75}, {"question": 5, "correct": true, "user_answer": "Major psychological level", "time_spent": 35}]}',
        '2025-09-21T11:30:00Z',
        NOW(),
        '{"device": "desktop", "browser": "chrome", "attempts_before_completion": 3, "paused": false, "repeated_attempts": true}'
    );

    RAISE NOTICE 'Sample user preferences and education data created successfully';
    RAISE NOTICE 'Created data for % sample users', 3;
    RAISE NOTICE 'Alert preferences: %', (SELECT COUNT(*) FROM user_alert_preferences);
    RAISE NOTICE 'Education progress records: %', (SELECT COUNT(*) FROM education_progress);
    RAISE NOTICE 'Quiz results: %', (SELECT COUNT(*) FROM quiz_results);
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_alerts_user ON user_alert_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alerts_broker ON user_alert_preferences(broker_id);
CREATE INDEX IF NOT EXISTS idx_education_progress_user ON education_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_education_progress_quiz ON education_progress(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz ON quiz_results(quiz_id);

COMMIT;

-- Verification queries
-- SELECT user_id, COUNT(*) as alert_preferences FROM user_alert_preferences GROUP BY user_id;
-- SELECT user_id, COUNT(*) as completed_quizzes FROM education_progress GROUP BY user_id;
-- SELECT user_id, AVG(percentage) as average_score FROM quiz_results GROUP BY user_id;
-- SELECT quiz_key, AVG(percentage) as average_quiz_score FROM quiz_results GROUP BY quiz_key ORDER BY average_quiz_score DESC;