-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create authors table
CREATE TABLE authors (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    credentials TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    summary TEXT,
    key_takeaways TEXT[] DEFAULT '{}',
    content TEXT,
    author_id BIGINT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    reviewed_by JSONB DEFAULT '{}',
    date DATE NOT NULL,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    read_time_minutes INTEGER,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    seo_keywords TEXT[] DEFAULT '{}',
    canonical_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_authors_slug ON authors(slug);
CREATE INDEX idx_authors_is_featured ON authors(is_featured);
CREATE INDEX idx_authors_post_count ON authors(post_count);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_date ON blog_posts(date);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX idx_blog_posts_is_pinned ON blog_posts(is_pinned);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_seo_keywords ON blog_posts USING GIN(seo_keywords);
CREATE INDEX idx_blog_posts_view_count ON blog_posts(view_count DESC);
CREATE INDEX idx_blog_posts_date_desc ON blog_posts(date DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to both tables
CREATE TRIGGER set_authors_timestamp
BEFORE UPDATE ON authors
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_blog_posts_timestamp
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create slug generation function
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT, existing_table TEXT, existing_column TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  counter INTEGER := 1;
  new_slug TEXT;
BEGIN
  -- Generate base slug by converting to lowercase, replacing spaces with hyphens, and removing special chars
  base_slug := LOWER(REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
  base_slug := TRIM(BOTH '-' FROM base_slug);

  -- Check if base slug exists
  new_slug := base_slug;
  LOOP
    -- Check if slug already exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = existing_table
      AND table_schema = 'public'
    ) THEN
      RETURN new_slug;
    END IF;

    EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)',
                   existing_table, existing_column, new_slug) INTO new_slug;

    IF NOT new_slug THEN
      RETURN new_slug;
    END IF;

    -- If exists, append number
    new_slug := base_slug || '-' || counter::TEXT;
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authors
-- Allow public to read authors
CREATE POLICY "Allow public to read authors" ON authors
    FOR SELECT USING (true);

-- Allow authenticated users to insert authors (if needed for content management)
CREATE POLICY "Allow authenticated to insert authors" ON authors
    FOR INSERT WITH CHECK (true);

-- Allow authors to update their own profiles
CREATE POLICY "Allow authors to update own profile" ON authors
    FOR UPDATE USING (auth.uid()::text = (SELECT id FROM auth.users WHERE auth.users.id = auth.uid()::text)::text);

-- Allow admin to manage authors
CREATE POLICY "Allow admin to manage authors" ON authors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()::text
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create RLS policies for blog_posts
-- Allow public to read published posts
CREATE POLICY "Allow public to read published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to read all posts (for content management)
CREATE POLICY "Allow authenticated to read all posts" ON blog_posts
    FOR SELECT USING (true);

-- Allow authors to create posts
CREATE POLICY "Allow authors to create posts" ON blog_posts
    FOR INSERT WITH CHECK (true);

-- Allow authors to update their own posts
CREATE POLICY "Allow authors to update own posts" ON blog_posts
    FOR UPDATE USING (
        author_id = (SELECT id FROM auth.users WHERE auth.users.id = auth.uid()::text)::bigint
    );

-- Allow admin to manage all posts
CREATE POLICY "Allow admin to manage all posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()::text
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create function to update author post count
CREATE OR REPLACE FUNCTION update_author_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
        UPDATE authors SET post_count = post_count + 1 WHERE id = NEW.author_id;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Check if status changed to published
        IF OLD.status <> 'published' AND NEW.status = 'published' THEN
            UPDATE authors SET post_count = post_count + 1 WHERE id = NEW.author_id;
        -- Check if status changed from published
        ELSIF OLD.status = 'published' AND NEW.status <> 'published' THEN
            UPDATE authors SET post_count = post_count - 1 WHERE id = NEW.author_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
        UPDATE authors SET post_count = post_count - 1 WHERE id = OLD.author_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post count updates
CREATE TRIGGER update_author_post_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_author_post_count();

-- Create view for featured posts with author info
CREATE VIEW featured_posts_with_authors AS
SELECT
    bp.id,
    bp.slug,
    bp.title,
    bp.summary,
    bp.image_url,
    bp.date,
    bp.view_count,
    bp.like_count,
    bp.read_time_minutes,
    bp.tags,
    a.name as author_name,
    a.avatar_url as author_avatar,
    a.slug as author_slug
FROM blog_posts bp
JOIN authors a ON bp.author_id = a.id
WHERE bp.status = 'published' AND bp.is_featured = true
ORDER BY bp.date DESC;

-- Create view for recent posts
CREATE VIEW recent_posts_with_authors AS
SELECT
    bp.id,
    bp.slug,
    bp.title,
    bp.summary,
    bp.image_url,
    bp.date,
    bp.view_count,
    bp.like_count,
    bp.read_time_minutes,
    bp.tags,
    a.name as author_name,
    a.avatar_url as author_avatar,
    a.slug as author_slug
FROM blog_posts bp
JOIN authors a ON bp.author_id = a.id
WHERE bp.status = 'published'
ORDER BY bp.date DESC
LIMIT 10;

-- Create view for popular posts
CREATE VIEW popular_posts_with_authors AS
SELECT
    bp.id,
    bp.slug,
    bp.title,
    bp.summary,
    bp.image_url,
    bp.date,
    bp.view_count,
    bp.like_count,
    bp.share_count,
    bp.read_time_minutes,
    bp.tags,
    a.name as author_name,
    a.avatar_url as author_avatar,
    a.slug as author_slug
FROM blog_posts bp
JOIN authors a ON bp.author_id = a.id
WHERE bp.status = 'published'
ORDER BY (bp.view_count * 0.6 + bp.like_count * 0.3 + bp.share_count * 0.1) DESC
LIMIT 10;