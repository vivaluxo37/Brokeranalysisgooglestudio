-- Additional database functions for promotions system
-- These functions support the promotion database operations

-- Function to increment promotion analytics safely
CREATE OR REPLACE FUNCTION increment_promotion_analytics(
    promotion_uuid UUID,
    analytics_date DATE DEFAULT CURRENT_DATE,
    field_name TEXT DEFAULT 'views'
)
RETURNS VOID AS $
BEGIN
    -- Insert or update analytics record
    INSERT INTO promotion_analytics (promotion_id, date, views, clicks, conversions, unique_visitors)
    VALUES (
        promotion_uuid, 
        analytics_date,
        CASE WHEN field_name = 'views' THEN 1 ELSE 0 END,
        CASE WHEN field_name = 'clicks' THEN 1 ELSE 0 END,
        CASE WHEN field_name = 'conversions' THEN 1 ELSE 0 END,
        CASE WHEN field_name = 'unique_visitors' THEN 1 ELSE 0 END
    )
    ON CONFLICT (promotion_id, date)
    DO UPDATE SET
        views = promotion_analytics.views + CASE WHEN field_name = 'views' THEN 1 ELSE 0 END,
        clicks = promotion_analytics.clicks + CASE WHEN field_name = 'clicks' THEN 1 ELSE 0 END,
        conversions = promotion_analytics.conversions + CASE WHEN field_name = 'conversions' THEN 1 ELSE 0 END,
        unique_visitors = promotion_analytics.unique_visitors + CASE WHEN field_name = 'unique_visitors' THEN 1 ELSE 0 END,
        updated_at = NOW();
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending promotions
CREATE OR REPLACE FUNCTION get_trending_promotions(
    days_back INTEGER DEFAULT 7,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
    promotion_id UUID,
    title TEXT,
    broker_name TEXT,
    total_views BIGINT,
    total_clicks BIGINT,
    conversion_rate DECIMAL,
    trend_score DECIMAL
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        b.name,
        COALESCE(SUM(pa.views), 0) as total_views,
        COALESCE(SUM(pa.clicks), 0) as total_clicks,
        CASE 
            WHEN COALESCE(SUM(pa.clicks), 0) > 0 
            THEN ROUND((COALESCE(SUM(pa.conversions), 0)::DECIMAL / SUM(pa.clicks)) * 100, 2)
            ELSE 0 
        END as conversion_rate,
        -- Trend score: weighted combination of views, clicks, and recency
        (
            COALESCE(SUM(pa.views), 0) * 0.3 + 
            COALESCE(SUM(pa.clicks), 0) * 0.5 + 
            COALESCE(SUM(pa.conversions), 0) * 2.0 +
            -- Recency bonus (more recent = higher score)
            EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 86400 * -0.1
        )::DECIMAL as trend_score
    FROM promotions p
    JOIN brokers b ON p.broker_id = b.id
    LEFT JOIN promotion_analytics pa ON p.id = pa.promotion_id 
        AND pa.date >= CURRENT_DATE - INTERVAL '%s days' % days_back
    WHERE p.is_active = true
    GROUP BY p.id, p.title, b.name, p.created_at
    ORDER BY trend_score DESC
    LIMIT limit_count;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get promotion performance summary
CREATE OR REPLACE FUNCTION get_promotion_performance_summary(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $
DECLARE
    summary JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_promotions', (
            SELECT COUNT(*) FROM promotions WHERE is_active = true
        ),
        'total_views', (
            SELECT COALESCE(SUM(views), 0) 
            FROM promotion_analytics 
            WHERE date BETWEEN start_date AND end_date
        ),
        'total_clicks', (
            SELECT COALESCE(SUM(clicks), 0) 
            FROM promotion_analytics 
            WHERE date BETWEEN start_date AND end_date
        ),
        'total_conversions', (
            SELECT COALESCE(SUM(conversions), 0) 
            FROM promotion_analytics 
            WHERE date BETWEEN start_date AND end_date
        ),
        'average_conversion_rate', (
            SELECT CASE 
                WHEN SUM(clicks) > 0 
                THEN ROUND((SUM(conversions)::DECIMAL / SUM(clicks)) * 100, 2)
                ELSE 0 
            END
            FROM promotion_analytics 
            WHERE date BETWEEN start_date AND end_date
        ),
        'top_performing_types', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'type', promotion_type,
                    'count', count,
                    'avg_conversion_rate', avg_conversion_rate
                )
            )
            FROM (
                SELECT 
                    p.promotion_type,
                    COUNT(p.id) as count,
                    CASE 
                        WHEN SUM(pa.clicks) > 0 
                        THEN ROUND((SUM(pa.conversions)::DECIMAL / SUM(pa.clicks)) * 100, 2)
                        ELSE 0 
                    END as avg_conversion_rate
                FROM promotions p
                LEFT JOIN promotion_analytics pa ON p.id = pa.promotion_id 
                    AND pa.date BETWEEN start_date AND end_date
                WHERE p.is_active = true
                GROUP BY p.promotion_type
                ORDER BY avg_conversion_rate DESC
                LIMIT 5
            ) sub
        )
    ) INTO summary;
    
    RETURN summary;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get broker promotion summary
CREATE OR REPLACE FUNCTION get_broker_promotion_summary(broker_id_param BIGINT)
RETURNS JSONB AS $
DECLARE
    summary JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_promotions', COUNT(*),
        'active_promotions', COUNT(*) FILTER (WHERE is_active = true),
        'featured_promotions', COUNT(*) FILTER (WHERE is_featured = true),
        'promotion_types', jsonb_agg(DISTINCT promotion_type),
        'total_views_30d', COALESCE((
            SELECT SUM(views) 
            FROM promotion_analytics pa 
            WHERE pa.promotion_id = ANY(ARRAY(SELECT id FROM promotions WHERE broker_id = broker_id_param))
            AND pa.date >= CURRENT_DATE - INTERVAL '30 days'
        ), 0),
        'total_conversions_30d', COALESCE((
            SELECT SUM(conversions) 
            FROM promotion_analytics pa 
            WHERE pa.promotion_id = ANY(ARRAY(SELECT id FROM promotions WHERE broker_id = broker_id_param))
            AND pa.date >= CURRENT_DATE - INTERVAL '30 days'
        ), 0)
    ) INTO summary
    FROM promotions 
    WHERE broker_id = broker_id_param;
    
    RETURN summary;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search promotions with full-text search
CREATE OR REPLACE FUNCTION search_promotions(
    search_query TEXT,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    broker_name TEXT,
    promotion_type promotion_type_enum,
    is_featured BOOLEAN,
    rank REAL
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        b.name as broker_name,
        p.promotion_type,
        p.is_featured,
        ts_rank(
            to_tsvector('english', p.title || ' ' || COALESCE(p.description, '') || ' ' || b.name),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM promotions p
    JOIN brokers b ON p.broker_id = b.id
    WHERE p.is_active = true
    AND (
        to_tsvector('english', p.title || ' ' || COALESCE(p.description, '') || ' ' || b.name) 
        @@ plainto_tsquery('english', search_query)
    )
    ORDER BY rank DESC, p.is_featured DESC, p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get similar promotions
CREATE OR REPLACE FUNCTION get_similar_promotions(
    promotion_uuid UUID,
    limit_count INTEGER DEFAULT 5
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    broker_name TEXT,
    promotion_type promotion_type_enum,
    similarity_score INTEGER
) AS $
DECLARE
    target_promotion RECORD;
BEGIN
    -- Get the target promotion details
    SELECT p.promotion_type, p.broker_id, p.requirements
    INTO target_promotion
    FROM promotions p
    WHERE p.id = promotion_uuid;
    
    IF target_promotion IS NULL THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        b.name as broker_name,
        p.promotion_type,
        (
            -- Same type: +3 points
            CASE WHEN p.promotion_type = target_promotion.promotion_type THEN 3 ELSE 0 END +
            -- Same broker: +2 points  
            CASE WHEN p.broker_id = target_promotion.broker_id THEN 2 ELSE 0 END +
            -- Similar requirements: +1 point (simplified check)
            CASE WHEN p.requirements::text = target_promotion.requirements::text THEN 1 ELSE 0 END
        ) as similarity_score
    FROM promotions p
    JOIN brokers b ON p.broker_id = b.id
    WHERE p.is_active = true 
    AND p.id != promotion_uuid
    AND (
        p.promotion_type = target_promotion.promotion_type OR
        p.broker_id = target_promotion.broker_id
    )
    ORDER BY similarity_score DESC, p.is_featured DESC
    LIMIT limit_count;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate promotion data
CREATE OR REPLACE FUNCTION validate_promotion_data(
    promotion_data JSONB
)
RETURNS JSONB AS $
DECLARE
    errors JSONB := '[]'::jsonb;
    warnings JSONB := '[]'::jsonb;
BEGIN
    -- Check required fields
    IF NOT (promotion_data ? 'title') OR (promotion_data->>'title') = '' THEN
        errors := errors || '["Title is required"]'::jsonb;
    END IF;
    
    IF NOT (promotion_data ? 'broker_id') THEN
        errors := errors || '["Broker ID is required"]'::jsonb;
    END IF;
    
    IF NOT (promotion_data ? 'promotion_type') THEN
        errors := errors || '["Promotion type is required"]'::jsonb;
    END IF;
    
    -- Check date logic
    IF (promotion_data ? 'end_date') AND (promotion_data ? 'start_date') THEN
        IF (promotion_data->>'end_date')::timestamp <= (promotion_data->>'start_date')::timestamp THEN
            errors := errors || '["End date must be after start date"]'::jsonb;
        END IF;
    END IF;
    
    -- Check if broker exists
    IF (promotion_data ? 'broker_id') THEN
        IF NOT EXISTS (SELECT 1 FROM brokers WHERE id = (promotion_data->>'broker_id')::bigint) THEN
            errors := errors || '["Broker does not exist"]'::jsonb;
        END IF;
    END IF;
    
    -- Warnings for best practices
    IF (promotion_data ? 'title') AND length(promotion_data->>'title') < 10 THEN
        warnings := warnings || '["Title is quite short, consider making it more descriptive"]'::jsonb;
    END IF;
    
    IF NOT (promotion_data ? 'description') OR (promotion_data->>'description') = '' THEN
        warnings := warnings || '["Description is recommended for better user understanding"]'::jsonb;
    END IF;
    
    RETURN jsonb_build_object(
        'valid', jsonb_array_length(errors) = 0,
        'errors', errors,
        'warnings', warnings
    );
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes on functions that will be called frequently
CREATE INDEX IF NOT EXISTS idx_promotion_analytics_date_range 
ON promotion_analytics(date) 
WHERE date >= CURRENT_DATE - INTERVAL '90 days';

-- Comments for documentation
COMMENT ON FUNCTION increment_promotion_analytics IS 'Safely increment promotion analytics counters';
COMMENT ON FUNCTION get_trending_promotions IS 'Get trending promotions based on recent activity';
COMMENT ON FUNCTION get_promotion_performance_summary IS 'Get overall promotion performance metrics';
COMMENT ON FUNCTION search_promotions IS 'Full-text search for promotions';
COMMENT ON FUNCTION get_similar_promotions IS 'Find similar promotions based on type and broker';
COMMENT ON FUNCTION validate_promotion_data IS 'Validate promotion data before insert/update';