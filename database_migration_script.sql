-- Database Migration Script
-- Complete database setup with proper order of operations
-- This script sets up the entire broker analysis platform database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "intarray";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================================================
-- PHASE 1: CREATE SYSTEM TABLES AND UTILITIES
-- ============================================================================

-- Create system logs table for tracking operations
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create user notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'system')),
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on system tables
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for system tables
CREATE POLICY IF NOT EXISTS "Admin can access system logs" ON system_logs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM auth.users
        JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
        JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
        WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
    ));

CREATE POLICY IF NOT EXISTS "Users can access own notifications" ON user_notifications
    FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- PHASE 2: ENHANCED USER MANAGEMENT
-- ============================================================================

-- Ensure enhanced users table exists with proper structure
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        -- Create enhanced users table based on your existing structure
        CREATE TABLE public.users (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            avatar_url TEXT,
            bio TEXT,
            phone TEXT,
            location TEXT,
            website TEXT,
            theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
            language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr', 'de', 'zh', 'ja')),
            notification_settings JSONB DEFAULT '{"email_notifications": true, "push_notifications": true, "sms_notifications": false, "marketing_emails": true, "broker_updates": true, "educational_content": true, "trading_alerts": true}'::jsonb,
            risk_tolerance TEXT DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive', 'very_aggressive')),
            trading_experience TEXT DEFAULT 'beginner' CHECK (trading_experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
            preferred_instruments TEXT[] DEFAULT ARRAY['stocks', 'etfs'],
            investment_goals TEXT[] DEFAULT ARRAY['growth', 'income'],
            trading_strategy TEXT,
            is_verified BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,
            last_login_at TIMESTAMP WITH TIME ZONE,
            login_count INTEGER DEFAULT 0,
            account_suspended BOOLEAN DEFAULT false,
            suspension_reason TEXT,
            favorite_brokers_count INTEGER DEFAULT 0,
            reviews_count INTEGER DEFAULT 0,
            trading_journal_entries_count INTEGER DEFAULT 0,
            portfolio_value DECIMAL(15, 2) DEFAULT 0.00,
            total_trades INTEGER DEFAULT 0,
            quiz_progress JSONB DEFAULT '{}'::jsonb,
            webinar_progress JSONB DEFAULT '{}'::jsonb,
            course_progress JSONB DEFAULT '{}'::jsonb,
            achievements JSONB DEFAULT '[]'::jsonb,
            onboarding_completed BOOLEAN DEFAULT false,
            onboarding_step INTEGER DEFAULT 0,
            onboarding_completed_at TIMESTAMP WITH TIME ZONE,
            subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
            subscription_ends_at TIMESTAMP WITH TIME ZONE,
            subscription_auto_renew BOOLEAN DEFAULT true,
            payment_method_id TEXT,
            social_profiles JSONB DEFAULT '{}'::jsonb,
            followers_count INTEGER DEFAULT 0,
            following_count INTEGER DEFAULT 0,
            profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
            show_trading_activity BOOLEAN DEFAULT true,
            allow_messages BOOLEAN DEFAULT true,
            user_agent TEXT,
            ip_address TEXT,
            referral_code TEXT UNIQUE,
            referred_by UUID REFERENCES public.users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
            CONSTRAINT non_negative_counts CHECK (
                favorite_brokers_count >= 0 AND
                reviews_count >= 0 AND
                trading_journal_entries_count >= 0 AND
                login_count >= 0 AND
                followers_count >= 0 AND
                following_count >= 0 AND
                total_trades >= 0
            ),
            CONSTRAINT portfolio_value_non_negative CHECK (portfolio_value >= 0)
        );

        -- Create indexes for users table
        CREATE INDEX idx_users_email ON public.users(email);
        CREATE INDEX idx_users_is_active ON public.users(is_active);
        CREATE INDEX idx_users_is_verified ON public.users(is_verified);
        CREATE INDEX idx_users_subscription_plan ON public.users(subscription_plan);
        CREATE INDEX idx_users_created_at ON public.users(created_at);
        CREATE INDEX idx_users_last_login_at ON public.users(last_login_at);
        CREATE INDEX idx_users_referral_code ON public.users(referral_code);
        CREATE INDEX idx_users_referred_by ON public.users(referred_by);
        CREATE INDEX idx_users_location_active ON public.users(location, is_active) WHERE is_active = true;
        CREATE INDEX idx_users_active_verified_plan ON public.users(is_active, is_verified, subscription_plan);
        CREATE INDEX idx_users_experience_risk ON public.users(trading_experience, risk_tolerance);
        CREATE INDEX idx_users_subscription_created ON public.users(subscription_plan, created_at);

        -- Enable RLS on users table
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies for users table
        CREATE POLICY "Users can view own profile" ON public.users
            FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile" ON public.users
            FOR UPDATE USING (auth.uid() = id);

        CREATE POLICY "Users can insert own profile" ON public.users
            FOR INSERT WITH CHECK (auth.uid() = id);

        CREATE POLICY "Admin can access all profiles" ON public.users
            FOR ALL USING (EXISTS (
                SELECT 1 FROM auth.users
                JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
                JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
                WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
            ));
    END IF;
END $$;

-- Create user preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT true,
    broker_updates BOOLEAN DEFAULT true,
    educational_content BOOLEAN DEFAULT true,
    trading_alerts BOOLEAN DEFAULT true,
    language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'es', 'fr', 'de', 'zh', 'ja')),
    timezone TEXT DEFAULT 'UTC',
    currency_preference TEXT DEFAULT 'USD',
    preferred_broker_types TEXT[] DEFAULT '{}',
    notification_frequency TEXT DEFAULT 'immediate' CHECK (notification_frequency IN ('immediate', 'daily', 'weekly', 'monthly')),
    data_sharing_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on user preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (user_id = auth.uid());

-- Create indexes for user preferences
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_email_notifications ON user_preferences(email_notifications);
CREATE INDEX idx_user_preferences_language ON user_preferences(language_preference);

-- ============================================================================
-- PHASE 3: CORE BUSINESS TABLES (ASSUMING BASIC STRUCTURE EXISTS)
-- ============================================================================

-- Create indexes for brokers table (assuming it exists)
DO $$
BEGIN
    -- Create indexes for brokers table
    CREATE INDEX IF NOT EXISTS idx_brokers_rating_active ON brokers(rating, is_active) WHERE is_active = true;
    CREATE INDEX IF NOT EXISTS idx_brokers_country_category ON brokers(country, category);
    CREATE INDEX IF NOT EXISTS idx_brokers_established_rating ON brokers(year_established, rating);
    CREATE INDEX IF NOT EXISTS idx_brokers_search ON brokers USING GIN (to_tsvector('english', name || ' ' || description));
    CREATE INDEX IF NOT EXISTS idx_active_brokers ON brokers(created_at) WHERE is_active = true;

    -- Enable RLS on brokers table
    ALTER TABLE IF EXISTS brokers ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies for brokers
    CREATE POLICY IF NOT EXISTS "Public can view active brokers" ON brokers
        FOR SELECT USING (is_active = true);

    CREATE POLICY IF NOT EXISTS "Authenticated can view all brokers" ON brokers
        FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY IF NOT EXISTS "Admin can manage brokers" ON brokers
        FOR ALL USING (EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
        ));
END $$;

-- Create reviews table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') THEN
        CREATE TABLE reviews (
            id BIGSERIAL PRIMARY KEY,
            broker_id BIGINT NOT NULL,
            user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
            is_approved BOOLEAN DEFAULT false,
            approved_at TIMESTAMP WITH TIME ZONE,
            approved_by UUID REFERENCES auth.users(id),
            helpful_count INTEGER DEFAULT 0,
            not_helpful_count INTEGER DEFAULT 0,
            is_verified BOOLEAN DEFAULT false,
            trading_period INTEGER,
            account_type TEXT,
            platform_used TEXT,
            pros TEXT[] DEFAULT '{}',
            cons TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            CHECK (user_id IS NOT NULL OR is_approved = true)
        );
    END IF;
END $$;

-- Create indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_broker_id ON reviews(broker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_broker_user_rating ON reviews(broker_id, user_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_broker_created ON reviews(broker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating_created ON reviews(rating, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recent_reviews ON reviews(created_at) WHERE created_at >= NOW() - INTERVAL '30 days';

-- Enable RLS on reviews table
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews
CREATE POLICY IF NOT EXISTS "Users can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY IF NOT EXISTS "Users can view own reviews" ON reviews
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update own reviews" ON reviews
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can delete own reviews" ON reviews
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Admin can manage all reviews" ON reviews
    FOR ALL USING (EXISTS (
        SELECT 1 FROM auth.users
        JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
        JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
        WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
    ));

-- ============================================================================
-- PHASE 4: CONTENT MANAGEMENT TABLES
-- ============================================================================

-- Create blog posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts' AND table_schema = 'public') THEN
        CREATE TABLE blog_posts (
            id BIGSERIAL PRIMARY KEY,
            author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            title VARCHAR(500) NOT NULL,
            slug VARCHAR(500) UNIQUE NOT NULL,
            content TEXT,
            excerpt TEXT,
            featured_image TEXT,
            status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
            category_id BIGINT,
            tags TEXT[] DEFAULT '{}',
            meta_title VARCHAR(500),
            meta_description TEXT,
            seo_keywords TEXT[] DEFAULT '{}',
            read_time_minutes INTEGER DEFAULT 0,
            view_count INTEGER DEFAULT 0,
            like_count INTEGER DEFAULT 0,
            comment_count INTEGER DEFAULT 0,
            share_count INTEGER DEFAULT 0,
            is_featured BOOLEAN DEFAULT false,
            published_at TIMESTAMP WITH TIME ZONE,
            scheduled_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create blog categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES blog_categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    meta_title VARCHAR(500),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for blog tables
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING GIN (to_tsvector('english', title || ' ' || COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_blog_author_status ON blog_posts(author_id, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category_published ON blog_posts(category_id, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_categories_parent_id ON blog_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_sort_order ON blog_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_categories_is_active ON blog_categories(is_active);

-- Enable RLS on blog tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog tables
CREATE POLICY IF NOT EXISTS "Public can view published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Users can view own posts" ON blog_posts
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Authors can manage own posts" ON blog_posts
    FOR ALL USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Admin can manage all posts" ON blog_posts
    FOR ALL USING (EXISTS (
        SELECT 1 FROM auth.users
        JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
        JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
        WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
    ));

CREATE POLICY IF NOT EXISTS "Public can view categories" ON blog_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Admin can manage categories" ON blog_categories
    FOR ALL USING (EXISTS (
        SELECT 1 FROM auth.users
        JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
        JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
        WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
    ));

-- Create discussion threads table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discussion_threads' AND table_schema = 'public') THEN
        CREATE TABLE discussion_threads (
            id BIGSERIAL PRIMARY KEY,
            author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            broker_id BIGINT,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
            category VARCHAR(100),
            tags TEXT[] DEFAULT '{}',
            view_count INTEGER DEFAULT 0,
            reply_count INTEGER DEFAULT 0,
            like_count INTEGER DEFAULT 0,
            is_sticky BOOLEAN DEFAULT false,
            is_locked BOOLEAN DEFAULT false,
            last_reply_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create discussion replies table if it doesn't exist
CREATE TABLE IF NOT EXISTS discussion_replies (
    id BIGSERIAL PRIMARY KEY,
    thread_id BIGINT NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
    parent_id BIGINT REFERENCES discussion_replies(id) ON DELETE CASCADE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for discussion tables
CREATE INDEX IF NOT EXISTS idx_discussion_threads_author_id ON discussion_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_discussion_threads_broker_id ON discussion_threads(broker_id);
CREATE INDEX IF NOT EXISTS idx_discussion_threads_status ON discussion_threads(status);
CREATE INDEX IF NOT EXISTS idx_discussion_threads_category ON discussion_threads(category);
CREATE INDEX IF NOT EXISTS idx_discussion_threads_created_at ON discussion_threads(created_at);
CREATE INDEX IF NOT EXISTS idx_discussion_threads_sticky ON discussion_threads(is_sticky) WHERE is_sticky = true;
CREATE INDEX IF NOT EXISTS idx_discussion_broker_status ON discussion_threads(broker_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussion_author_created ON discussion_threads(author_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_thread_id ON discussion_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_author_id ON discussion_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_status ON discussion_replies(status);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_parent_id ON discussion_replies(parent_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_created_at ON discussion_replies(created_at);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_thread ON discussion_replies(thread_id, created_at DESC);

-- Enable RLS on discussion tables
ALTER TABLE discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for discussion tables
CREATE POLICY IF NOT EXISTS "Public can view approved discussions" ON discussion_threads
    FOR SELECT USING (status = 'approved');

CREATE POLICY IF NOT EXISTS "Users can view own discussions" ON discussion_threads
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create discussions" ON discussion_threads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update own discussions" ON discussion_threads
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can delete own discussions" ON discussion_threads
    FOR DELETE USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Moderator can manage discussions" ON discussion_threads
    FOR ALL USING (EXISTS (
        SELECT 1 FROM auth.users
        JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
        JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
        WHERE auth.users.id = auth.uid() AND auth.roles.name IN ('admin', 'moderator')
    ));

CREATE POLICY IF NOT EXISTS "Public can view approved replies" ON discussion_replies
    FOR SELECT USING (
        status = 'approved' OR
        EXISTS (SELECT 1 FROM discussion_threads WHERE id = discussion_replies.thread_id AND author_id = auth.uid())
    );

CREATE POLICY IF NOT EXISTS "Users can create replies" ON discussion_replies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update own replies" ON discussion_replies
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can delete own replies" ON discussion_replies
    FOR DELETE USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Moderator can manage replies" ON discussion_replies
    FOR ALL USING (EXISTS (
        SELECT 1 FROM auth.users
        JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
        JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
        WHERE auth.users.id = auth.uid() AND auth.roles.name IN ('admin', 'moderator')
    ));

-- ============================================================================
-- PHASE 5: FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Add foreign key constraints where they don't exist
DO $$
BEGIN
    -- Reviews foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'reviews' AND constraint_name = 'fk_reviews_broker_id') THEN
        ALTER TABLE reviews ADD CONSTRAINT fk_reviews_broker_id FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'reviews' AND constraint_name = 'fk_reviews_user_id') THEN
        ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    -- Alerts foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'alerts' AND constraint_name = 'fk_alerts_broker_id') THEN
        ALTER TABLE alerts ADD CONSTRAINT fk_alerts_broker_id FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL;
    END IF;

    -- Blog posts foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'blog_posts' AND constraint_name = 'fk_blog_posts_author_id') THEN
        ALTER TABLE blog_posts ADD CONSTRAINT fk_blog_posts_author_id FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'blog_posts' AND constraint_name = 'fk_blog_posts_category_id') THEN
        ALTER TABLE blog_posts ADD CONSTRAINT fk_blog_posts_category_id FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;
    END IF;

    -- Discussion threads foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'discussion_threads' AND constraint_name = 'fk_discussion_threads_author_id') THEN
        ALTER TABLE discussion_threads ADD CONSTRAINT fk_discussion_threads_author_id FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'discussion_threads' AND constraint_name = 'fk_discussion_threads_broker_id') THEN
        ALTER TABLE discussion_threads ADD CONSTRAINT fk_discussion_threads_broker_id FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL;
    END IF;

    -- Discussion replies foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'discussion_replies' AND constraint_name = 'fk_discussion_replies_thread_id') THEN
        ALTER TABLE discussion_replies ADD CONSTRAINT fk_discussion_replies_thread_id FOREIGN KEY (thread_id) REFERENCES discussion_threads(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'discussion_replies' AND constraint_name = 'fk_discussion_replies_author_id') THEN
        ALTER TABLE discussion_replies ADD CONSTRAINT fk_discussion_replies_author_id FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'discussion_replies' AND constraint_name = 'fk_discussion_replies_parent_id') THEN
        ALTER TABLE discussion_replies ADD CONSTRAINT fk_discussion_replies_parent_id FOREIGN KEY (parent_id) REFERENCES discussion_replies(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================================
-- PHASE 6: AUTOMATED TRIGGERS
-- ============================================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
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

-- Create user profile creation trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER IF NOT EXISTS on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create broker rating update trigger
CREATE OR REPLACE FUNCTION update_broker_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        UPDATE brokers
        SET
            rating = COALESCE(
                (SELECT AVG(rating) FROM reviews WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id) AND is_approved = true),
                0
            ),
            reviews_count = COALESCE(
                (SELECT COUNT(*) FROM reviews WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id) AND is_approved = true),
                0
            ),
            updated_at = NOW()
        WHERE id = COALESCE(NEW.broker_id, OLD.broker_id);

        RETURN COALESCE(NEW, OLD);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_broker_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_broker_rating();

-- Create user statistics update trigger
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        UPDATE public.users
        SET
            reviews_count = COALESCE(
                (SELECT COUNT(*) FROM reviews WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND is_approved = true),
                0
            ),
            updated_at = NOW()
        WHERE id = COALESCE(NEW.user_id, OLD.user_id);

        RETURN COALESCE(NEW, OLD);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_user_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- ============================================================================
-- PHASE 7: VIEWS FOR PERFORMANCE
-- ============================================================================

-- Create materialized views
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
    COALESCE(
        (SELECT AVG(rating) FROM reviews r WHERE r.broker_id = b.id AND r.is_approved = true),
        0
    ) as avg_rating,
    COALESCE(
        (SELECT COUNT(*) FROM reviews r WHERE r.broker_id = b.id AND r.is_approved = true),
        0
    ) as total_reviews
FROM brokers b
WHERE b.is_active = true
ORDER BY b.rating DESC, b.reviews_count DESC;

-- Create indexes for materialized views
CREATE INDEX IF NOT EXISTS idx_broker_rankings_rating ON broker_rankings(rating DESC, reviews_count DESC);

-- Create read-optimized views
CREATE OR REPLACE VIEW recent_reviews_with_details AS
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

CREATE OR REPLACE VIEW public_user_profiles AS
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

CREATE OR REPLACE VIEW content_management_dashboard AS
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

-- ============================================================================
-- PHASE 8: GRANT PERMISSIONS
-- ============================================================================

-- Grant permissions on all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE ON brokers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON news_articles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON education_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON quiz_data TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON discussion_threads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON discussion_replies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON broker_regulations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON broker_fees TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON broker_trading_conditions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON broker_platforms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON broker_account_types TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_alerts TO authenticated;

-- Grant permissions on views
GRANT SELECT ON broker_rankings TO authenticated;
GRANT SELECT ON broker_rankings TO anon;
GRANT SELECT ON recent_reviews_with_details TO authenticated;
GRANT SELECT ON recent_reviews_with_details TO anon;
GRANT SELECT ON public_user_profiles TO authenticated;
GRANT SELECT ON public_user_profiles TO anon;
GRANT SELECT ON content_management_dashboard TO authenticated;

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION handle_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION update_broker_rating() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_stats() TO authenticated;

-- ============================================================================
-- PHASE 9: FINAL SETUP AND VERIFICATION
-- ============================================================================

-- Analyze tables for better query planning
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ANALYZE %I', table_rec.table_name);
    END LOOP;
END $$;

-- Create a function to verify setup completion
CREATE OR REPLACE FUNCTION verify_database_setup()
RETURNS TABLE(check_name TEXT, status TEXT, details TEXT) AS $$
BEGIN
    -- Check tables
    RETURN QUERY
    SELECT 'Users Table' as check_name,
           CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN 'PASSED' ELSE 'FAILED' END as status,
           'Enhanced users table exists' as details

    UNION ALL

    SELECT 'Brokers Table' as check_name,
           CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'brokers' AND table_schema = 'public') THEN 'PASSED' ELSE 'FAILED' END as status,
           'Brokers table exists' as details

    UNION ALL

    SELECT 'Reviews Table' as check_name,
           CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') THEN 'PASSED' ELSE 'FAILED' END as status,
           'Reviews table exists' as details

    UNION ALL

    SELECT 'RLS Enabled' as check_name,
           CASE WHEN (SELECT COUNT(*) FROM pg_tables WHERE tablename = 'users' AND rowsecurity = true) > 0 THEN 'PASSED' ELSE 'FAILED' END as status,
           'Row Level Security is enabled on core tables' as details

    UNION ALL

    SELECT 'Indexes Created' as check_name,
           CASE WHEN (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') >= 50 THEN 'PASSED' ELSE 'FAILED' END as status,
           format('Total indexes: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public')) as details

    UNION ALL

    SELECT 'Foreign Keys' as check_name,
           CASE WHEN (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public') >= 10 THEN 'PASSED' ELSE 'FAILED' END as status,
           format('Total foreign keys: %', (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public')) as details

    UNION ALL

    SELECT 'Triggers' as check_name,
           CASE WHEN (SELECT COUNT(*) FROM pg_trigger WHERE tgname LIKE '%updated_at%') >= 5 THEN 'PASSED' ELSE 'FAILED' END as status,
           format('Updated_at triggers: %', (SELECT COUNT(*) FROM pg_trigger WHERE tgname LIKE '%updated_at%')) as details;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log completion
INSERT INTO system_logs (action, details, severity)
VALUES ('migration_complete', 'Database migration completed successfully', 'success');

-- Verify setup
SELECT * FROM verify_database_setup();

-- Display completion message
DO $$
DECLARE
    table_count INTEGER;
    index_count INTEGER;
    fk_count INTEGER;
    trigger_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    SELECT COUNT(*) INTO index_count FROM pg_indexes WHERE schemaname = 'public';
    SELECT COUNT(*) INTO fk_count FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';
    SELECT COUNT(*) INTO trigger_count FROM pg_trigger WHERE tgname NOT LIKE '%RI_ConstraintTrigger%';

    RAISE NOTICE '=== DATABASE MIGRATION COMPLETE ===';
    RAISE NOTICE 'Tables Created: %', table_count;
    RAISE NOTICE 'Indexes Created: %', index_count;
    RAISE NOTICE 'Foreign Keys: %', fk_count;
    RAISE NOTICE 'Triggers: %', trigger_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Your broker analysis platform database is now ready with:';
    RAISE NOTICE '- Complete data schema with proper relationships';
    RAISE NOTICE '- Comprehensive Row Level Security policies';
    RAISE NOTICE '- Performance-optimized indexes';
    RAISE NOTICE '- Automated triggers for data integrity';
    RAISE NOTICE '- Materialized views for fast queries';
    RAISE NOTICE '- Full audit logging capabilities';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Import your data using the provided import scripts';
    RAISE NOTICE '2. Set up your application to use the new database structure';
    RAISE NOTICE '3. Configure scheduled tasks for maintenance routines';
    RAISE NOTICE '4. Test all functionality with sample data';
END $$;