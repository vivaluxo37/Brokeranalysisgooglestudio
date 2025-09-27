-- Enhanced SEO Schema for Supabase
-- This schema supports comprehensive SEO tracking, internationalization, and performance monitoring

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- SEO Configuration Table
CREATE TABLE seo_configurations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name VARCHAR(100) NOT NULL DEFAULT 'BrokerAnalysis',
  base_url TEXT NOT NULL DEFAULT 'https://brokeranalysis.com',
  default_locale VARCHAR(10) NOT NULL DEFAULT 'en',
  supported_locales TEXT[] DEFAULT ARRAY['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'tr', 'nl', 'sv', 'da', 'no', 'fi', 'pl'],
  google_analytics_id VARCHAR(50),
  google_search_console_id VARCHAR(100),
  bing_webmaster_tools_id VARCHAR(100),
  yandex_webmaster_tools_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page SEO Metadata Table
CREATE TABLE page_seo_metadata (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  title VARCHAR(200) NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url TEXT,
  og_title VARCHAR(200),
  og_description TEXT,
  og_image_url TEXT,
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(200),
  twitter_description TEXT,
  twitter_image_url TEXT,
  noindex BOOLEAN DEFAULT FALSE,
  nofollow BOOLEAN DEFAULT FALSE,
  hreflang_tags JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT locale_path_unique UNIQUE (locale, page_path)
);

-- Structured Data Table
CREATE TABLE structured_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES page_seo_metadata(id) ON DELETE CASCADE,
  schema_type VARCHAR(50) NOT NULL, -- 'organization', 'website', 'broker', 'article', 'breadcrumb', 'faq', 'product', 'howto'
  schema_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE performance_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  lcp DECIMAL(5,2), -- Largest Contentful Paint (seconds)
  fid INTEGER, -- First Input Delay (milliseconds)
  cls DECIMAL(8,6), -- Cumulative Layout Shift
  fcp DECIMAL(5,2), -- First Contentful Paint (seconds)
  tti DECIMAL(5,2), -- Time to Interactive (seconds)
  tbt INTEGER, -- Total Blocking Time (milliseconds)
  score DECIMAL(3,2), -- Overall performance score (0-1)
  device_type VARCHAR(20) DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
  connection_type VARCHAR(20), -- '4g', '3g', '2g', 'slow-2g'
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Analytics Table
CREATE TABLE seo_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  metric_type VARCHAR(50) NOT NULL, -- 'page_view', 'click', 'impression', 'position', 'ctr'
  metric_value DECIMAL(10,2),
  query TEXT, -- Search query for impression/click data
  device VARCHAR(20),
  country VARCHAR(10),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Score Table
CREATE TABLE content_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  readability_score DECIMAL(3,2), -- 0-1 scale
  keyword_density DECIMAL(5,4),
  content_length INTEGER,
  heading_structure_score DECIMAL(3,2),
  image_optimization_score DECIMAL(3,2),
  internal_links_count INTEGER,
  external_links_count INTEGER,
  overall_seo_score DECIMAL(3,2),
  last_audited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sitemap Generation Log
CREATE TABLE sitemap_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sitemap_type VARCHAR(50) NOT NULL, -- 'main', 'brokers', 'blog', 'tools', 'education', 'international'
  file_path TEXT NOT NULL,
  urls_count INTEGER NOT NULL,
  file_size_bytes INTEGER,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'success', -- 'success', 'failed', 'partial'
  error_message TEXT
);

-- Indexing Status Table
CREATE TABLE indexing_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  search_engine VARCHAR(20) NOT NULL, -- 'google', 'bing', 'yandex', 'baidu'
  status VARCHAR(20) NOT NULL, -- 'indexed', 'not_indexed', 'pending', 'error'
  last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_indexed_at TIMESTAMP WITH TIME ZONE,
  last_indexed_at TIMESTAMP WITH TIME ZONE,
  crawl_frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly'
  priority DECIMAL(2,1) DEFAULT '0.5',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backlinks Table
CREATE TABLE backlinks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT,
  link_type VARCHAR(50), -- 'dofollow', 'nofollow', 'sponsored', 'ugc'
  domain_authority DECIMAL(3,1),
  page_authority DECIMAL(3,1),
  trust_flow DECIMAL(3,1),
  citation_flow DECIMAL(3,1),
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword Rankings Table
CREATE TABLE keyword_rankings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  keyword TEXT NOT NULL,
  page_path TEXT NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  search_engine VARCHAR(20) NOT NULL DEFAULT 'google',
  country VARCHAR(10) DEFAULT 'us',
  device_type VARCHAR(20) DEFAULT 'desktop',
  position INTEGER,
  previous_position INTEGER,
  search_volume INTEGER,
  competition DECIMAL(3,2),
  click_through_rate DECIMAL(5,4),
  impressions INTEGER,
  clicks INTEGER,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Audit Logs Table
CREATE TABLE seo_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audit_type VARCHAR(50) NOT NULL, -- 'performance', 'accessibility', 'content', 'technical', 'backlink'
  page_path TEXT,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  status VARCHAR(20) NOT NULL, -- 'passed', 'failed', 'warning'
  score DECIMAL(3,2),
  issues_count INTEGER DEFAULT 0,
  recommendations TEXT[],
  audit_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Alerts Table
CREATE TABLE seo_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alert_type VARCHAR(50) NOT NULL, -- 'performance_drop', 'indexing_issue', 'broken_link', 'duplicate_content', 'security_issue'
  severity VARCHAR(20) NOT NULL, -- 'critical', 'high', 'medium', 'low'
  title TEXT NOT NULL,
  description TEXT,
  page_path TEXT,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  metadata JSONB,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_page_seo_metadata_path_locale ON page_seo_metadata(page_path, locale);
CREATE INDEX idx_page_seo_metadata_updated_at ON page_seo_metadata(updated_at DESC);
CREATE INDEX idx_performance_metrics_path_locale ON performance_metrics(page_path, locale);
CREATE INDEX idx_performance_metrics_created_at ON performance_metrics(created_at DESC);
CREATE INDEX idx_seo_analytics_path_locale_date ON seo_analytics(page_path, locale, date);
CREATE INDEX idx_keyword_rankings_keyword_date ON keyword_rankings(keyword, date DESC);
CREATE INDEX idx_backlinks_target_url ON backlinks(target_url);
CREATE INDEX idx_backlinks_source_url ON backlinks(source_url);
CREATE INDEX idx_indexing_status_path_engine ON indexing_status(page_path, search_engine);
CREATE INDEX idx_seo_alerts_created_at ON seo_alerts(created_at DESC);
CREATE INDEX idx_seo_alerts_resolved ON seo_alerts(is_resolved);

-- Create full-text search indexes
CREATE INDEX idx_page_seo_metadata_search ON page_seo_metadata USING gin(
  to_tsvector('english', title || ' ' || COALESCE(meta_description, '') || ' ' || COALESCE(array_to_string(meta_keywords, ' '), ''))
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_seo_configurations_updated_at BEFORE UPDATE ON seo_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_seo_metadata_updated_at BEFORE UPDATE ON page_seo_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_structured_data_updated_at BEFORE UPDATE ON structured_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_scores_updated_at BEFORE UPDATE ON content_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indexing_status_updated_at BEFORE UPDATE ON indexing_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default SEO configuration
INSERT INTO seo_configurations (site_name, base_url, default_locale) VALUES
('BrokerAnalysis', 'https://brokeranalysis.com', 'en')
ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE seo_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE structured_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitemap_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE indexing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_alerts ENABLE ROW LEVEL SECURITY;

-- Public read access for SEO data
CREATE POLICY "Public read access for SEO configurations" ON seo_configurations FOR SELECT USING (true);
CREATE POLICY "Public read access for page SEO metadata" ON page_seo_metadata FOR SELECT USING (true);
CREATE POLICY "Public read access for structured data" ON structured_data FOR SELECT USING (true);
CREATE POLICY "Public read access for performance metrics" ON performance_metrics FOR SELECT USING (true);
CREATE POLICY "Public read access for content scores" ON content_scores FOR SELECT USING (true);
CREATE POLICY "Public read access for sitemap logs" ON sitemap_logs FOR SELECT USING (true);
CREATE POLICY "Public read access for indexing status" ON indexing_status FOR SELECT USING (true);
CREATE POLICY "Public read access for keyword rankings" ON keyword_rankings FOR SELECT USING (true);

-- Authenticated users can insert/update SEO data
CREATE POLICY "Authenticated users can insert page SEO metadata" ON page_seo_metadata FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update page SEO metadata" ON page_seo_metadata FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert structured data" ON structured_data FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update structured data" ON structured_data FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert performance metrics" ON performance_metrics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert SEO analytics" ON seo_analytics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert content scores" ON content_scores FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update content scores" ON content_scores FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert sitemap logs" ON sitemap_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update indexing status" ON indexing_status FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update indexing status" ON indexing_status FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert backlinks" ON backlinks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update backlinks" ON backlinks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert keyword rankings" ON keyword_rankings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert SEO audit logs" ON seo_audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert SEO alerts" ON seo_alerts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update SEO alerts" ON seo_alerts FOR UPDATE USING (auth.role() = 'authenticated');

-- Create views for common queries
CREATE VIEW seo_page_summary AS
SELECT
  psm.page_path,
  psm.locale,
  psm.title,
  psm.meta_description,
  cs.overall_seo_score,
  cs.readability_score,
  cs.content_length,
  pm.lcp,
  pm.fid,
  pm.cls,
  pm.score as performance_score,
  psm.created_at,
  psm.updated_at
FROM page_seo_metadata psm
LEFT JOIN content_scores cs ON psm.id = cs.id AND psm.locale = cs.locale
LEFT JOIN (
  SELECT page_path, locale, AVG(lcp) as lcp, AVG(fid) as fid, AVG(cls) as cls, AVG(score) as score
  FROM performance_metrics
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY page_path, locale
) pm ON psm.page_path = pm.page_path AND psm.locale = pm.locale;

CREATE VIEW seo_dashboard_metrics AS
SELECT
  COUNT(DISTINCT page_path) as total_pages,
  AVG(overall_seo_score) as avg_seo_score,
  AVG(lcp) as avg_lcp,
  AVG(fid) as avg_fid,
  AVG(cls) as avg_cls,
  COUNT(CASE WHEN overall_seo_score >= 0.8 THEN 1 END) as excellent_pages,
  COUNT(CASE WHEN overall_seo_score >= 0.6 AND overall_seo_score < 0.8 THEN 1 END) as good_pages,
  COUNT(CASE WHEN overall_seo_score < 0.6 THEN 1 END) as needs_improvement
FROM seo_page_summary;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON seo_configurations TO authenticated;
GRANT ALL ON page_seo_metadata TO authenticated;
GRANT ALL ON structured_data TO authenticated;
GRANT ALL ON performance_metrics TO authenticated;
GRANT ALL ON seo_analytics TO authenticated;
GRANT ALL ON content_scores TO authenticated;
GRANT ALL ON sitemap_logs TO authenticated;
GRANT ALL ON indexing_status TO authenticated;
GRANT ALL ON backlinks TO authenticated;
GRANT ALL ON keyword_rankings TO authenticated;
GRANT ALL ON seo_audit_logs TO authenticated;
GRANT ALL ON seo_alerts TO authenticated;

GRANT SELECT ON seo_page_summary TO authenticated;
GRANT SELECT ON seo_dashboard_metrics TO authenticated;