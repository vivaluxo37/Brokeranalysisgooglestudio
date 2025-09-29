-- Create blogs table for the broker analysis platform
-- This SQL should be run in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.blogs (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    summary TEXT,
    content TEXT,
    author_name TEXT,
    author_slug TEXT,
    author_avatar TEXT,
    date TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    image_url TEXT,
    read_time_minutes INTEGER,
    key_takeaways JSONB,
    reviewed_by JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Row Level Security (RLS) policies for the blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to blogs
CREATE POLICY "Allow public read access to blogs" ON public.blogs
    FOR SELECT USING (true);

-- Policy to allow authenticated users to insert/update blogs (if needed later)
CREATE POLICY "Allow authenticated insert/update blogs" ON public.blogs
    FOR ALL USING (auth.role() = 'authenticated');

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON public.blogs(date DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON public.blogs(author_slug);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON public.blogs USING GIN(tags);

-- Add comments for documentation
COMMENT ON TABLE public.blogs IS 'Blog posts for the broker analysis platform';
COMMENT ON COLUMN public.blogs.slug IS 'URL-friendly unique identifier for the blog post';
COMMENT ON COLUMN public.blogs.key_takeaways IS 'Array of key takeaway points from the blog post';
COMMENT ON COLUMN public.blogs.reviewed_by IS 'JSON object containing reviewer information';