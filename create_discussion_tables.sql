-- Discussion Forum Tables for Supabase
-- This script creates the discussion_posts and discussion_replies tables
-- with proper relationships, constraints, and triggers

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create discussion_posts table
CREATE TABLE discussion_posts (
    -- Primary key
    id BIGSERIAL PRIMARY KEY,

    -- Topic identification
    topic_id TEXT NOT NULL,
    topic_type TEXT NOT NULL CHECK (topic_type IN ('broker', 'blog', 'general')),

    -- Content fields
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,

    -- Author information
    user_id UUID,
    author_name TEXT NOT NULL,
    author_avatar TEXT,

    -- Engagement metrics
    upvotes BIGINT DEFAULT 0,
    downvotes BIGINT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    reply_count BIGINT DEFAULT 0,

    -- Status and moderation
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pinned', 'locked', 'deleted')),
    is_featured BOOLEAN DEFAULT FALSE,
    moderated_by UUID,
    moderation_notes TEXT,

    -- Categorization
    tags TEXT[] DEFAULT '{}',
    category TEXT,

    -- SEO fields
    slug TEXT UNIQUE NOT NULL,
    meta_description TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create discussion_replies table
CREATE TABLE discussion_replies (
    -- Primary key
    id BIGSERIAL PRIMARY KEY,

    -- Post relationship
    post_id BIGINT NOT NULL REFERENCES discussion_posts(id) ON DELETE CASCADE,

    -- Nested reply support
    parent_reply_id BIGINT REFERENCES discussion_replies(id) ON DELETE SET NULL,

    -- Content
    content TEXT NOT NULL,
    excerpt TEXT,

    -- Author information
    user_id UUID,
    author_name TEXT NOT NULL,
    author_avatar TEXT,

    -- Engagement metrics
    upvotes BIGINT DEFAULT 0,
    downvotes BIGINT DEFAULT 0,

    -- Moderation and status
    is_accepted_answer BOOLEAN DEFAULT FALSE,
    moderated_by UUID,
    moderation_notes TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_discussion_posts_topic_id ON discussion_posts(topic_id);
CREATE INDEX idx_discussion_posts_topic_type ON discussion_posts(topic_type);
CREATE INDEX idx_discussion_posts_user_id ON discussion_posts(user_id);
CREATE INDEX idx_discussion_posts_status ON discussion_posts(status);
CREATE INDEX idx_discussion_posts_category ON discussion_posts(category);
CREATE INDEX idx_discussion_posts_created_at ON discussion_posts(created_at DESC);
CREATE INDEX idx_discussion_posts_last_activity ON discussion_posts(last_activity_at DESC);
CREATE INDEX idx_discussion_posts_slug ON discussion_posts(slug);

CREATE INDEX idx_discussion_replies_post_id ON discussion_replies(post_id);
CREATE INDEX idx_discussion_replies_parent_reply_id ON discussion_replies(parent_reply_id);
CREATE INDEX idx_discussion_replies_user_id ON discussion_replies(user_id);
CREATE INDEX idx_discussion_replies_status ON discussion_replies(status);
CREATE INDEX idx_discussion_replies_created_at ON discussion_replies(created_at DESC);

-- Create full-text search indexes
CREATE INDEX idx_discussion_posts_search ON discussion_posts USING gin(
    to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, ''))
);

CREATE INDEX idx_discussion_replies_search ON discussion_replies USING gin(
    to_tsvector('english', COALESCE(content, '') || ' ' || COALESCE(excerpt, ''))
);

-- Create trigger functions for automatic updates
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE discussion_posts
        SET reply_count = reply_count + 1,
            last_activity_at = NOW()
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE discussion_posts
        SET reply_count = GREATEST(reply_count - 1, 0)
        WHERE id = OLD.post_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'active' AND NEW.status = 'deleted' THEN
            UPDATE discussion_posts
            SET reply_count = GREATEST(reply_count - 1, 0)
            WHERE id = NEW.post_id;
        ELSIF OLD.status = 'deleted' AND NEW.status = 'active' THEN
            UPDATE discussion_posts
            SET reply_count = reply_count + 1,
                last_activity_at = NOW()
            WHERE id = NEW.post_id;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE discussion_posts
        SET last_activity_at = NOW()
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.status = 'active' THEN
        UPDATE discussion_posts
        SET last_activity_at = NOW()
        WHERE id = NEW.post_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_post_reply_count
    AFTER INSERT OR UPDATE OR DELETE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

CREATE TRIGGER trigger_update_post_last_activity
    AFTER INSERT OR UPDATE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_post_last_activity();

CREATE TRIGGER trigger_update_posts_updated_at
    BEFORE UPDATE ON discussion_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_replies_updated_at
    BEFORE UPDATE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE VIEW active_discussions AS
SELECT
    dp.id,
    dp.title,
    dp.excerpt,
    dp.author_name,
    dp.author_avatar,
    dp.upvotes,
    dp.downvotes,
    dp.view_count,
    dp.reply_count,
    dp.category,
    dp.tags,
    dp.slug,
    dp.created_at,
    dp.last_activity_at,
    (dp.upvotes - dp.downvotes) as net_votes,
    CASE
        WHEN dp.reply_count > 10 THEN 'hot'
        WHEN dp.reply_count > 5 THEN 'active'
        WHEN dp.last_activity_at > NOW() - INTERVAL '24 hours' THEN 'recent'
        ELSE 'normal'
    END as activity_level
FROM discussion_posts dp
WHERE dp.status = 'active'
ORDER BY dp.last_activity_at DESC;

CREATE VIEW discussion_threads AS
SELECT
    dr.id,
    dr.post_id,
    dr.parent_reply_id,
    dr.content,
    dr.excerpt,
    dr.author_name,
    dr.author_avatar,
    dr.upvotes,
    dr.downvotes,
    dr.is_accepted_answer,
    dr.created_at,
    dr.updated_at,
    (dr.upvotes - dr.downvotes) as net_votes,
    CASE
        WHEN dr.parent_reply_id IS NULL THEN 0
        ELSE 1
    END as reply_level
FROM discussion_replies dr
WHERE dr.status = 'active'
ORDER BY dr.created_at ASC;

-- Create helper functions for discussion management
CREATE OR REPLACE FUNCTION increment_post_view_count(post_id_param BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE discussion_posts
    SET view_count = view_count + 1
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION vote_on_post(post_id_param BIGINT, vote_type TEXT, increment INTEGER)
RETURNS VOID AS $$
BEGIN
    IF vote_type = 'up' THEN
        UPDATE discussion_posts
        SET upvotes = GREATEST(upvotes + increment, 0)
        WHERE id = post_id_param;
    ELSIF vote_type = 'down' THEN
        UPDATE discussion_posts
        SET downvotes = GREATEST(downvotes + increment, 0)
        WHERE id = post_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION vote_on_reply(reply_id_param BIGINT, vote_type TEXT, increment INTEGER)
RETURNS VOID AS $$
BEGIN
    IF vote_type = 'up' THEN
        UPDATE discussion_replies
        SET upvotes = GREATEST(upvotes + increment, 0)
        WHERE id = reply_id_param;
    ELSIF vote_type = 'down' THEN
        UPDATE discussion_replies
        SET downvotes = GREATEST(downvotes + increment, 0)
        WHERE id = reply_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create RLS (Row Level Security) policies
ALTER TABLE discussion_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active posts and replies
CREATE POLICY "Anyone can view active discussions" ON discussion_posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can view active replies" ON discussion_replies
    FOR SELECT USING (status = 'active');

-- Policy: Authenticated users can create posts and replies
CREATE POLICY "Authenticated users can create posts" ON discussion_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create replies" ON discussion_replies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own posts and replies
CREATE POLICY "Users can update their own posts" ON discussion_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" ON discussion_replies
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own posts and replies
CREATE POLICY "Users can delete their own posts" ON discussion_posts
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" ON discussion_replies
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Moderators can manage posts and replies
CREATE POLICY "Moderators can manage all posts" ON discussion_posts
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'moderator'
        )
    );

CREATE POLICY "Moderators can manage all replies" ON discussion_replies
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'moderator'
        )
    );

-- Grant permissions
GRANT ALL ON discussion_posts TO authenticated;
GRANT ALL ON discussion_replies TO authenticated;
GRANT SELECT ON discussion_posts TO anon;
GRANT SELECT ON discussion_replies TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create comments for documentation
COMMENT ON TABLE discussion_posts IS 'Main discussion posts table for community forum';
COMMENT ON TABLE discussion_replies IS 'Replies to discussion posts with support for nested conversations';
COMMENT ON VIEW active_discussions IS 'View showing active discussions with activity metrics';
COMMENT ON VIEW discussion_threads IS 'View showing reply threads with hierarchy levels';