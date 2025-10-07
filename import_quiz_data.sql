-- ============================================
-- Quiz Data Import Script
-- ============================================
-- This script imports quiz data from TypeScript mocks
-- into the Supabase database quiz_data table with JSONB formatted questions

BEGIN TRANSACTION;

-- Clear existing quiz data (optional - comment out if you want to append)
TRUNCATE TABLE quiz_data RESTART IDENTITY CASCADE;

-- Insert quiz metadata and sample questions
INSERT INTO quiz_data (
    id,
    quiz_key,
    title,
    description,
    category,
    difficulty_level,
    time_limit_minutes,
    passing_score,
    total_questions,
    questions,
    tags,
    is_published,
    view_count,
    created_at,
    updated_at,
    metadata
) VALUES
(
    'quiz-001',
    'forex-basics',
    'Forex Trading Basics',
    'Learn the fundamental concepts of forex trading including currency pairs, pips, and market structure.',
    'Beginner',
    1,
    10,
    70,
    5,
    '[
        {
            "question": "What does Forex stand for?",
            "options": ["Foreign Exchange", "Forward Exchange", "Financial Exchange", "Future Exchange"],
            "correctAnswer": "Foreign Exchange",
            "explanation": "Forex is short for Foreign Exchange, which is the global marketplace for trading currencies."
        },
        {
            "question": "What is a currency pair?",
            "options": ["Two currencies traded against each other", "A pair of trading strategies", "A type of financial instrument", "A currency exchange rate"],
            "correctAnswer": "Two currencies traded against each other",
            "explanation": "A currency pair represents the quotation of one currency relative to another, showing how much of the quote currency is needed to buy one unit of the base currency."
        },
        {
            "question": "What is a pip in forex trading?",
            "options": ["The smallest price move", "A trading strategy", "A type of order", "A market indicator"],
            "correctAnswer": "The smallest price move",
            "explanation": "A pip (Percentage in Point) is the smallest price move that a currency pair can make based on market convention."
        },
        {
            "question": "Which currency pair is known as ''The Cable''?",
            "options": ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"],
            "correctAnswer": "GBP/USD",
            "explanation": "The GBP/USD pair is nicknamed ''The Cable'' due to the historic transatlantic telegraph cable that connected London and New York."
        },
        {
            "question": "What is leverage in forex trading?",
            "options": ["Borrowing capital to control larger positions", "A type of currency", "A market trend", "A trading platform"],
            "correctAnswer": "Borrowing capital to control larger positions",
            "explanation": "Leverage allows traders to control larger positions with a relatively small amount of capital, amplifying both potential profits and losses."
        }
    ]',
    ARRAY['forex', 'basics', 'currency_pairs', 'pips', 'leverage'],
    true,
    1500,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "10 minutes", "prerequisites": "none", "learning_objectives": ["understand_forex_basics", "identify_currency_pairs", "know_what_pips_are"]}'
),
(
    'quiz-002',
    'broker-fees',
    'Understanding Broker Fees',
    'Learn about different types of broker fees including spreads, commissions, and hidden costs that affect your trading profitability.',
    'Beginner',
    1,
    15,
    75,
    5,
    '[
        {
            "question": "What is a spread in forex trading?",
            "options": ["The difference between bid and ask prices", "A trading strategy", "A type of fee", "A market indicator"],
            "correctAnswer": "The difference between bid and ask prices",
            "explanation": "The spread is the difference between the bid (buy) and ask (sell) prices, representing the broker''s primary compensation."
        },
        {
            "question": "Which account type typically has lower spreads but charges commissions?",
            "options": ["Standard Account", "ECN Account", "Islamic Account", "Demo Account"],
            "correctAnswer": "ECN Account",
            "explanation": "ECN (Electronic Communication Network) accounts typically offer raw spreads with separate commissions, making them ideal for high-frequency traders."
        },
        {
            "question": "What is an inactivity fee?",
            "options": ["A charge for not trading", "A fee for depositing", "A cost for withdrawals", "A spread charge"],
            "correctAnswer": "A charge for not trading",
            "explanation": "Some brokers charge inactivity fees when an account has no trading activity for a specified period, typically 3-6 months."
        },
        {
            "question": "What are overnight fees also known as?",
            "options": ["Swap fees", "Commission fees", "Spread fees", "Inactivity fees"],
            "correctAnswer": "Swap fees",
            "explanation": "Overnight fees, also called swap or rollover fees, are charged for holding positions open overnight, reflecting the interest rate differential between currencies."
        },
        {
            "question": "Which broker feature helps avoid overnight fees?",
            "options": ["Islamic Account", "ECN Account", "Standard Account", "Demo Account"],
            "correctAnswer": "Islamic Account",
            "explanation": "Islamic accounts are swap-free accounts designed for Muslim traders, avoiding interest-based overnight fees according to Sharia principles."
        }
    ]',
    ARRAY['broker_fees', 'spreads', 'commissions', 'account_types', 'trading_costs'],
    true,
    1200,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "15 minutes", "prerequisites": "forex_basics", "learning_objectives": ["understand_fee_structures", "compare_account_types", "identify_hidden_costs"]}'
),
(
    'quiz-003',
    'risk-management',
    'Risk Management Fundamentals',
    'Master essential risk management techniques including position sizing, stop-loss orders, and risk-reward ratios.',
    'Beginner',
    1,
    12,
    80,
    5,
    '[
        {
            "question": "What is the recommended risk per trade?",
            "options": ["1-2% of account balance", "5-10% of account balance", "10-20% of account balance", "As much as possible"],
            "correctAnswer": "1-2% of account balance",
            "explanation": "Professional traders typically risk 1-2% of their account balance on any single trade to ensure long-term survival in the markets."
        },
        {
            "question": "What is a stop-loss order?",
            "options": ["An order to limit losses", "An order to take profits", "An order to enter a trade", "An order to close all positions"],
            "correctAnswer": "An order to limit losses",
            "explanation": "A stop-loss order automatically closes a position when it reaches a specified price, limiting potential losses on a trade."
        },
        {
            "question": "What is a good risk-reward ratio?",
            "options": ["1:2 or higher", "1:1", "2:1", "3:1"],
            "correctAnswer": "1:2 or higher",
            "explanation": "A risk-reward ratio of 1:2 or higher means you risk $1 to make $2, which is considered good risk management for consistent profitability."
        },
        {
            "question": "What is position sizing?",
            "options": ["Determining how much to trade", "Choosing when to trade", "Selecting trading instruments", "Setting profit targets"],
            "correctAnswer": "Determining how much to trade",
            "explanation": "Position sizing is the process of determining how many lots, contracts, or shares to trade based on your risk tolerance and stop-loss level."
        },
        {
            "question": "What is drawdown in trading?",
            "options": ["Peak-to-trough decline", "Profit percentage", "Loss amount", "Win rate"],
            "correctAnswer": "Peak-to-trough decline",
            "explanation": "Drawdown measures the peak-to-trough decline during a specific period, indicating the maximum loss from a peak to a subsequent trough."
        }
    ]',
    ARRAY['risk_management', 'stop_loss', 'position_sizing', 'risk_reward', 'money_management'],
    true,
    980,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "12 minutes", "prerequisites": "forex_basics", "learning_objectives": ["apply_risk_management", "calculate_position_size", "use_stop_losses"]}'
),
(
    'quiz-004',
    'charting-intro',
    'Introduction to Technical Analysis Charts',
    'Learn to read and interpret forex charts including candlestick patterns, support and resistance levels, and basic indicators.',
    'Beginner',
    1,
    10,
    70,
    5,
    '[
        {
            "question": "What does a green candlestick represent?",
            "options": ["Price closed higher than open", "Price closed lower than open", "Price was unchanged", "Volume increased"],
            "correctAnswer": "Price closed higher than open",
            "explanation": "A green (or white) candlestick indicates that the closing price was higher than the opening price, showing bullish price action."
        },
        {
            "question": "What is support in technical analysis?",
            "options": ["Price level where buying interest exceeds selling", "Price level where selling exceeds buying", "A trend line", "A chart pattern"],
            "correctAnswer": "Price level where buying interest exceeds selling",
            "explanation": "Support is a price level where buying interest is strong enough to overcome selling pressure, potentially causing prices to bounce higher."
        },
        {
            "question": "What is resistance in technical analysis?",
            "options": ["Price level where selling exceeds buying", "Price level where buying exceeds selling", "A support level", "A trend indicator"],
            "correctAnswer": "Price level where selling exceeds buying",
            "explanation": "Resistance is a price level where selling pressure overcomes buying interest, potentially causing prices to reverse downward."
        },
        {
            "question": "What is a trend line?",
            "options": ["A line connecting price points", "A moving average", "A support level", "A resistance level"],
            "correctAnswer": "A line connecting price points",
            "explanation": "A trend line is a straight line that connects two or more price points, extending into the future to identify trend direction."
        },
        {
            "question": "What is the body of a candlestick?",
            "options": ["The difference between open and close", "The high and low points", "The volume traded", "The price range"],
            "correctAnswer": "The difference between open and close",
            "explanation": "The body of a candlestick represents the price range between the opening and closing prices, showing the net price movement."
        }
    ]',
    ARRAY['technical_analysis', 'charts', 'candlesticks', 'support_resistance', 'trend_lines'],
    true,
    850,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "10 minutes", "prerequisites": "forex_basics", "learning_objectives": ["read_candlestick_charts", "identify_support_resistance", "draw_trend_lines"]}'
),
(
    'quiz-005',
    'candlestick-patterns',
    'Candlestick Patterns Analysis',
    'Learn to identify and trade common candlestick patterns including doji, hammer, engulfing patterns, and reversal signals.',
    'Intermediate',
    2,
    15,
    75,
    5,
    '[
        {
            "question": "What does a Doji candlestick indicate?",
            "options": ["Market indecision", "Strong trend", "High volatility", "Reversal signal"],
            "correctAnswer": "Market indecision",
            "explanation": "A Doji occurs when opening and closing prices are nearly equal, indicating market indecision and potential trend reversal."
        },
        {
            "question": "What is a Hammer pattern?",
            "options": ["Bullish reversal pattern", "Bearish reversal pattern", "Continuation pattern", "Neutral pattern"],
            "correctAnswer": "Bullish reversal pattern",
            "explanation": "The Hammer is a bullish reversal pattern with a small body and long lower wick, occurring after a downtrend."
        },
        {
            "question": "What does a bullish engulfing pattern signal?",
            "options": ["Bullish reversal", "Bearish reversal", "Continuation", "Sideways movement"],
            "correctAnswer": "Bullish reversal",
            "explanation": "A bullish engulfing pattern occurs when a large green candle completely engulfs the previous red candle, signaling a bullish reversal."
        },
        {
            "question": "What is a Shooting Star pattern?",
            "options": ["Bearish reversal pattern", "Bullish reversal pattern", "Continuation pattern", "Support level"],
            "correctAnswer": "Bearish reversal pattern",
            "explanation": "The Shooting Star is a bearish reversal pattern with a small body and long upper wick, occurring after an uptrend."
        },
        {
            "question": "What is the significance of long wicks in candlesticks?",
            "options": ["Rejection of price levels", "Strong trend continuation", "Low volatility", "Confirmation signals"],
            "correctAnswer": "Rejection of price levels",
            "explanation": "Long wicks indicate rejection of price levels, with long upper wicks showing rejection of higher prices and long lower wicks showing rejection of lower prices."
        }
    ]',
    ARRAY['candlestick_patterns', 'reversal_patterns', 'doji', 'hammer', 'engulfing'],
    true,
    1100,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "15 minutes", "prerequisites": "charting_introduction", "learning_objectives": ["identify_candlestick_patterns", "recognize_reversal_signals", "apply_pattern_analysis"]}'
),
(
    'quiz-006',
    'moving-averages',
    'Moving Averages and Trend Analysis',
    'Master moving average analysis including SMA, EMA, crossover strategies, and trend identification techniques.',
    'Intermediate',
    2,
    12,
    70,
    5,
    '[
        {
            "question": "What does SMA stand for?",
            "options": ["Simple Moving Average", "Smoothed Moving Average", "Special Moving Average", "Short Moving Average"],
            "correctAnswer": "Simple Moving Average",
            "explanation": "SMA stands for Simple Moving Average, which calculates the average price over a specific number of periods, giving equal weight to each period."
        },
        {
            "question": "What is the main difference between SMA and EMA?",
            "options": ["EMA gives more weight to recent prices", "SMA gives more weight to recent prices", "EMA is simpler to calculate", "SMA is more responsive"],
            "correctAnswer": "EMA gives more weight to recent prices",
            "explanation": "EMA (Exponential Moving Average) gives more weight to recent prices, making it more responsive to recent price changes compared to SMA."
        },
        {
            "question": "What is a Golden Cross?",
            "options": ["50 SMA crossing above 200 SMA", "200 SMA crossing above 50 SMA", "EMA crossing below SMA", "Price crossing above MA"],
            "correctAnswer": "50 SMA crossing above 200 SMA",
            "explanation": "A Golden Cross is a bullish signal that occurs when the 50-period Simple Moving Average crosses above the 200-period Simple Moving Average."
        },
        {
            "question": "What is a Death Cross?",
            "options": ["50 SMA crossing below 200 SMA", "200 SMA crossing below 50 SMA", "EMA crossing above SMA", "Price crossing below MA"],
            "correctAnswer": "50 SMA crossing below 200 SMA",
            "explanation": "A Death Cross is a bearish signal that occurs when the 50-period Simple Moving Average crosses below the 200-period Simple Moving Average."
        },
        {
            "question": "What moving average period is commonly used for short-term trends?",
            "options": ["20-period", "50-period", "100-period", "200-period"],
            "correctAnswer": "20-period",
            "explanation": "The 20-period moving average is commonly used to identify short-term trends and is often part of short-term trading strategies."
        }
    ]',
    ARRAY['moving_averages', 'SMA', 'EMA', 'trend_analysis', 'crossover_strategies'],
    true,
    950,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "12 minutes", "prerequisites": "charting_introduction", "learning_objectives": ["calculate_moving_averages", "identify_trends", "use_crossover_strategies"]}'
),
(
    'quiz-007',
    'fibonacci-retracement',
    'Fibonacci Retracement Analysis',
    'Learn to apply Fibonacci retracement levels to identify potential support and resistance areas in trending markets.',
    'Advanced',
    3,
    20,
    75,
    5,
    '[
        {
            "question": "What are the key Fibonacci retracement levels?",
            "options": ["23.6%, 38.2%, 50%, 61.8%, 78.6%", "25%, 50%, 75%", "33.3%, 66.6%", "20%, 40%, 60%, 80%"],
            "correctAnswer": "23.6%, 38.2%, 50%, 61.8%, 78.6%",
            "explanation": "The key Fibonacci retracement levels are 23.6%, 38.2%, 50%, 61.8%, and 78.6%, which represent potential support and resistance areas."
        },
        {
            "question": "What is the golden ratio in Fibonacci?",
            "options": ["61.8%", "50%", "38.2%", "23.6%"],
            "correctAnswer": "61.8%",
            "explanation": "The golden ratio (61.8%) is the most important Fibonacci retracement level, representing the inverse of the golden ratio (1.618)."
        },
        {
            "question": "How do you draw Fibonacci retracement?",
            "options": ["From swing high to swing low", "From left to right", "From low to high only", "Using random points"],
            "correctAnswer": "From swing high to swing low",
            "explanation": "Fibonacci retracement is drawn from a significant swing high to a significant swing low (or vice versa) to identify potential reversal points."
        },
        {
            "question": "What is Fibonacci extension used for?",
            "options": ["Projecting potential price targets", "Finding support levels", "Measuring volatility", "Calculating position size"],
            "correctAnswer": "Projecting potential price targets",
            "explanation": "Fibonacci extensions are used to project potential price targets beyond the current price range, helping traders identify profit-taking levels."
        },
        {
            "question": "What is the significance of the 50% retracement level?",
            "options": ["Major psychological level", "Fibonacci ratio", "Random level", "Support only"],
            "correctAnswer": "Major psychological level",
            "explanation": "While 50% is not a true Fibonacci ratio, it''s a major psychological level that traders watch closely for potential reversals."
        }
    ]',
    ARRAY['fibonacci', 'retracement', 'golden_ratio', 'support_resistance', 'price_targets'],
    true,
    750,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "20 minutes", "prerequisites": ["charting_introduction", "moving_averages"], "learning_objectives": ["apply_fibonacci_retracement", "identify_support_resistance", "project_price_targets"]}'
),
(
    'quiz-008',
    'elliott-wave',
    'Elliott Wave Theory',
    'Learn the principles of Elliott Wave Theory including impulse waves, corrective waves, and wave counting techniques.',
    'Advanced',
    3,
    25,
    80,
    5,
    '[
        {
            "question": "How many waves are in a complete Elliott Wave cycle?",
            "options": ["8 waves (5 impulse + 3 corrective)", "10 waves", "6 waves", "12 waves"],
            "correctAnswer": "8 waves (5 impulse + 3 corrective)",
            "explanation": "A complete Elliott Wave cycle consists of 8 waves: 5 impulse waves in the direction of the main trend followed by 3 corrective waves."
        },
        {
            "question": "What are the three cardinal rules of Elliott Wave?",
            "options": ["Wave 2 cannot retrace more than 100% of Wave 1, Wave 3 cannot be shortest, Wave 4 cannot enter Wave 1 territory", "Wave 1 must be longest, Wave 2 must be shortest, Wave 3 must be impulsive", "Waves must alternate, waves must be equal, waves must be proportional", "Trend must be up, volume must increase, waves must be clear"],
            "correctAnswer": "Wave 2 cannot retrace more than 100% of Wave 1, Wave 3 cannot be shortest, Wave 4 cannot enter Wave 1 territory",
            "explanation": "The three unbreakable Elliott Wave rules are: Wave 2 cannot retrace more than 100% of Wave 1, Wave 3 cannot be the shortest impulse wave, and Wave 4 cannot enter the price territory of Wave 1."
        },
        {
            "question": "What is the most common Fibonacci relationship between Wave 3 and Wave 1?",
            "options": ["1.618 times", "Equal length", "2.618 times", "0.618 times"],
            "correctAnswer": "1.618 times",
            "explanation": "The most common Fibonacci relationship is that Wave 3 is 1.618 times the length of Wave 1, though other relationships like equality (1.0) also occur."
        },
        {
            "question": "What are the main corrective wave patterns?",
            "options": ["Zigzag, Flat, Triangle", "Impulse, Diagonal, Triangle", "Extension, Failure, Triangle", "Simple, Complex, Mixed"],
            "correctAnswer": "Zigzag, Flat, Triangle",
            "explanation": "The three main categories of corrective wave patterns are Zigzag (5-3-5), Flat (3-3-5), and Triangle (3-3-3-3-3)."
        },
        {
            "question": "What is a diagonal triangle in Elliott Wave?",
            "options": ["Wedge pattern that occurs in Wave 5 or C", "Reversal pattern at tops", "Continuation pattern", "Support level"],
            "correctAnswer": "Wedge pattern that occurs in Wave 5 or C",
            "explanation": "A diagonal triangle (or ending diagonal) is a wedge pattern that typically occurs in Wave 5 of an impulse or Wave C of a correction, signaling exhaustion of the current trend."
        }
    ]',
    ARRAY['elliott_wave', 'wave_theory', 'impulse_waves', 'corrective_waves', 'fibonacci_relationships'],
    true,
    600,
    NOW(),
    NOW(),
    '{"estimated_completion_time": "25 minutes", "prerequisites": ["fibonacci_retracement", "technical_analysis"], "learning_objectives": ["count_elliott_waves", "identify_wave_patterns", "apply_wave_theory"]}'
);

-- Validate quiz data integrity
DO $$
DECLARE
    total_quizzes INTEGER;
    total_questions INTEGER;
    avg_questions NUMERIC;
    category_count INTEGER;
    difficulty_count INTEGER;
BEGIN
    -- Get total quiz count
    SELECT COUNT(*) INTO total_quizzes FROM quiz_data;

    -- Get total questions across all quizzes
    SELECT SUM(total_questions) INTO total_questions FROM quiz_data;

    -- Get average questions per quiz
    SELECT AVG(total_questions) INTO avg_questions FROM quiz_data;

    -- Get category distribution
    SELECT COUNT(DISTINCT category) INTO category_count FROM quiz_data;

    -- Get difficulty distribution
    SELECT COUNT(DISTINCT difficulty_level) INTO difficulty_count FROM quiz_data;

    RAISE NOTICE 'Quiz data import completed:';
    RAISE NOTICE '  Total quizzes: %', total_quizzes;
    RAISE NOTICE '  Total questions: %', total_questions;
    RAISE NOTICE '  Average questions per quiz: %', ROUND(avg_questions, 1);
    RAISE NOTICE '  Categories: %', category_count;
    RAISE NOTICE '  Difficulty levels: %', difficulty_count;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_data_category ON quiz_data(category);
CREATE INDEX IF NOT EXISTS idx_quiz_data_difficulty ON quiz_data(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_quiz_data_key ON quiz_data(quiz_key);
CREATE INDEX IF NOT EXISTS idx_quiz_data_published ON quiz_data(is_published);

-- Create a GIN index for the JSONB questions column for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_data_questions_gin ON quiz_data USING GIN (questions);

COMMIT;

-- Verification queries
-- SELECT COUNT(*) as total_quizzes FROM quiz_data;
-- SELECT category, COUNT(*) as count FROM quiz_data GROUP BY category;
-- SELECT difficulty_level, COUNT(*) as count FROM quiz_data GROUP BY difficulty_level;
-- SELECT is_published, COUNT(*) as count FROM quiz_data GROUP BY is_published;
-- SELECT title, difficulty_level, total_questions, time_limit_minutes FROM quiz_data ORDER BY difficulty_level, title;