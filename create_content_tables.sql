-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create alerts table
CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    broker_id BIGINT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('regulatory', 'technical', 'promotional', 'security')),
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    action_required BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_articles table
CREATE TABLE news_articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    full_content TEXT,
    source VARCHAR(100) NOT NULL,
    source_url TEXT,
    author VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Forex', 'Economy', 'Central Banks', 'Geopolitics', 'Commodities')),
    importance VARCHAR(10) NOT NULL CHECK (importance IN ('High', 'Medium', 'Low')),
    tags TEXT[] DEFAULT '{}',
    sentiment_score DECIMAL(3,2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    market_impact TEXT,
    related_instruments TEXT[] DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education_progress table
CREATE TABLE education_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('quiz', 'webinar', 'course', 'article')),
    content_id VARCHAR(100) NOT NULL,
    content_title VARCHAR(255) NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    score DECIMAL(5,2),
    time_spent_minutes INTEGER DEFAULT 0,
    completion_date TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_data table
CREATE TABLE quiz_data (
    id BIGSERIAL PRIMARY KEY,
    quiz_key TEXT UNIQUE NOT NULL,
    quiz_title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    description TEXT,
    questions JSONB NOT NULL,
    time_limit_minutes INTEGER,
    passing_score DECIMAL(5,2) NOT NULL CHECK (passing_score >= 0 AND passing_score <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    attempt_count INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_alerts junction table
CREATE TABLE user_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_id BIGINT NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    notification_method VARCHAR(10) NOT NULL CHECK (notification_method IN ('email', 'in_app', 'push', 'sms')),
    is_subscribed BOOLEAN DEFAULT TRUE,
    last_notified_at TIMESTAMP WITH TIME ZONE,
    notification_frequency VARCHAR(10) DEFAULT 'immediate' CHECK (notification_frequency IN ('immediate', 'daily', 'weekly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, alert_id, notification_method)
);

-- Create indexes for performance
CREATE INDEX idx_alerts_broker_id ON alerts(broker_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_alerts_expiry_date ON alerts(expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_importance ON news_articles(importance);
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX idx_news_articles_created_at ON news_articles(created_at);
CREATE INDEX idx_news_articles_tags ON news_articles USING GIN(tags);
CREATE INDEX idx_news_articles_related_instruments ON news_articles USING GIN(related_instruments);

CREATE INDEX idx_education_progress_user_id ON education_progress(user_id);
CREATE INDEX idx_education_progress_content_type ON education_progress(content_type);
CREATE INDEX idx_education_progress_is_completed ON education_progress(is_completed);
CREATE INDEX idx_education_progress_last_accessed_at ON education_progress(last_accessed_at);
CREATE UNIQUE INDEX idx_education_progress_user_content ON education_progress(user_id, content_type, content_id);

CREATE INDEX idx_quiz_data_category ON quiz_data(category);
CREATE INDEX idx_quiz_data_difficulty_level ON quiz_data(difficulty_level);
CREATE INDEX idx_quiz_data_is_active ON quiz_data(is_active);
CREATE INDEX idx_quiz_data_is_featured ON quiz_data(is_featured);
CREATE INDEX idx_quiz_data_quiz_key ON quiz_data(quiz_key);
CREATE INDEX idx_quiz_data_questions ON quiz_data USING GIN(questions);

CREATE INDEX idx_user_alerts_user_id ON user_alerts(user_id);
CREATE INDEX idx_user_alerts_alert_id ON user_alerts(alert_id);
CREATE INDEX idx_user_alerts_notification_method ON user_alerts(notification_method);
CREATE INDEX idx_user_alerts_is_subscribed ON user_alerts(is_subscribed);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_progress_updated_at BEFORE UPDATE ON education_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_data_updated_at BEFORE UPDATE ON quiz_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_alerts_updated_at BEFORE UPDATE ON user_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" ON alerts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own alerts" ON alerts
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own alerts" ON alerts
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for news_articles (public read access)
CREATE POLICY "Everyone can view news articles" ON news_articles
    FOR SELECT USING (true);

-- RLS Policies for education_progress
CREATE POLICY "Users can view their own education progress" ON education_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own education progress" ON education_progress
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own education progress" ON education_progress
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for quiz_data (public read access for active quizzes)
CREATE POLICY "Everyone can view active quizzes" ON quiz_data
    FOR SELECT USING (is_active = true);

-- RLS Policies for user_alerts
CREATE POLICY "Users can view their own alert preferences" ON user_alerts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own alert preferences" ON user_alerts
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own alert preferences" ON user_alerts
    FOR UPDATE USING (user_id = auth.uid());

-- Function to clean up expired alerts
CREATE OR REPLACE FUNCTION cleanup_expired_alerts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM alerts
    WHERE expiry_date IS NOT NULL
    AND expiry_date < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update quiz statistics
CREATE OR REPLACE FUNCTION update_quiz_statistics()
RETURNS VOID AS $$
BEGIN
    -- This would be used in conjunction with quiz attempt data
    -- For now, it's a placeholder for future functionality
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Create views for common queries
CREATE VIEW active_alerts AS
SELECT * FROM alerts
WHERE status = 'active'
AND (expiry_date IS NULL OR expiry_date > NOW())
ORDER BY severity DESC, created_at DESC;

CREATE VIEW recent_news AS
SELECT * FROM news_articles
WHERE published_at >= NOW() - INTERVAL '30 days'
ORDER BY published_at DESC;

CREATE VIEW user_education_summary AS
SELECT
    user_id,
    content_type,
    COUNT(*) as total_items,
    COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_items,
    AVG(progress_percentage) as average_progress,
    SUM(time_spent_minutes) as total_time_spent
FROM education_progress
GROUP BY user_id, content_type;

-- Grant necessary permissions
GRANT ALL ON alerts TO authenticated;
GRANT ALL ON news_articles TO authenticated;
GRANT ALL ON education_progress TO authenticated;
GRANT ALL ON quiz_data TO authenticated;
GRANT ALL ON user_alerts TO authenticated;
GRANT ALL ON active_alerts TO authenticated;
GRANT ALL ON recent_news TO authenticated;
GRANT ALL ON user_education_summary TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION cleanup_expired_alerts() TO authenticated;
GRANT EXECUTE ON FUNCTION update_quiz_statistics() TO authenticated;