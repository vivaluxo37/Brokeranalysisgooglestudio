-- ============================================
-- News Articles Data Import Script
-- ============================================
-- This script imports news article data from TypeScript mocks
-- into the Supabase database news_articles table

BEGIN TRANSACTION;

-- Clear existing news articles data (optional - comment out if you want to append)
TRUNCATE TABLE news_articles RESTART IDENTITY CASCADE;

-- Insert mock news articles data
INSERT INTO news_articles (
    id,
    title,
    summary,
    full_content,
    publication_date,
    category,
    importance,
    source_url,
    author,
    sentiment_score,
    market_impact,
    related_instruments,
    tags,
    view_count,
    is_featured,
    created_at,
    updated_at,
    metadata
) VALUES
(
    'news1',
    'US Non-Farm Payrolls Exceed Expectations, Boosting Dollar',
    'The US economy added 350,000 jobs in August, significantly higher than the forecasted 180,000, causing a surge in the US Dollar and increasing expectations for a hawkish Fed stance.',
    'The latest jobs report from the US Bureau of Labor Statistics has sent shockwaves through the market. The addition of 350,000 jobs in the non-farm payrolls report for August far outstripped economist predictions. This robust labor market data strengthens the case for the Federal Reserve to continue its aggressive monetary tightening policy to combat inflation. As a result, the DXY (US Dollar Index) has climbed over 1.2% in early trading sessions. Traders should anticipate heightened volatility in major pairs like EUR/USD and GBP/USD.',
    '2025-09-05T12:30:00Z',
    'Economy',
    'High',
    'https://www.bls.gov/news.release/pdf/empsit.pdf',
    'Bureau of Labor Statistics',
    0.8,
    'high',
    ARRAY['EUR/USD', 'GBP/USD', 'USD/JPY', 'DXY'],
    ARRAY['NFP', 'Fed', 'USD', 'employment', 'inflation'],
    1250,
    true,
    NOW(),
    NOW(),
    '{"economic_indicator": "NFP", "actual": 350000, "forecast": 180000, "previous": 187000, "market_reaction": "bullish_usd", "volatility_expected": "high"}'
),
(
    'news2',
    'European Central Bank Hints at Pausing Rate Hikes',
    'ECB President Christine Lagarde suggested that future rate hikes are not a given, citing slowing economic growth in the Eurozone. The Euro fell sharply against major currencies following her speech.',
    'In a dovish turn, ECB President Christine Lagarde indicated that the central bank might pause its cycle of interest rate hikes. "We must be mindful of the lagging effects of our policy on the broader economy," Lagarde stated. This has led to speculation that the ECB is more concerned about a potential recession than persistent inflation. The EUR/USD pair dropped below the key 1.0500 level for the first time in six months. Swing traders holding long Euro positions may face significant swap costs if the interest rate differential widens further.',
    '2025-09-04T09:00:00Z',
    'Central Banks',
    'High',
    'https://www.ecb.europa.eu/press/pr/date/2025/html/ecb.pr250904~9c3a0f0c5e.en.html',
    'European Central Bank',
    -0.6,
    'high',
    ARRAY['EUR/USD', 'EUR/GBP', 'EUR/JPY'],
    ARRAY['ECB', 'Lagarde', 'interest_rates', 'Eurozone', 'recession'],
    980,
    true,
    NOW(),
    NOW(),
    '{"central_bank": "ECB", "speaker": "Christine Lagarde", "policy_stance": "dovish", "key_level_broken": "1.0500", "concern": "recession_risk"}'
),
(
    'news3',
    'Bank of Japan Maintains Ultra-Loose Policy Amid Yen Weakness',
    'Despite the Yen hitting a new 20-year low against the Dollar, the Bank of Japan has decided to maintain its negative interest rate policy, fueling further carry trade activity.',
    'The Bank of Japan remains the sole major central bank with a negative interest rate policy. Governor Ueda defended the decision, stating that Japan''s inflation is not yet demand-driven and sustainable. This policy divergence with other central banks, particularly the Fed, makes the Yen an attractive funding currency for carry trades. However, traders should be wary of potential government intervention to prop up the currency, which could cause sudden, sharp reversals in USD/JPY and other Yen pairs.',
    '2025-09-03T15:00:00Z',
    'Central Banks',
    'Medium',
    'https://www.boj.or.jp/en/announcements/minutes/2025/mpm250903a.pdf',
    'Bank of Japan',
    -0.4,
    'medium',
    ARRAY['USD/JPY', 'EUR/JPY', 'GBP/JPY'],
    ARRAY['BOJ', 'Ueda', 'negative_rates', 'yen', 'carry_trade'],
    750,
    false,
    NOW(),
    NOW(),
    '{"central_bank": "BOJ", "governor": "Ueda", "policy": "negative_rates", "yen_low": "20_year", "intervention_risk": "high"}'
),
(
    'news4',
    'OPEC+ Announces Surprise Production Cut, Oil Prices Surge',
    'OPEC+ has agreed to cut oil production by an additional 1 million barrels per day, sending WTI and Brent crude prices soaring by over 5% and impacting commodity-linked currencies like CAD and NOK.',
    'The Organization of the Petroleum Exporting Countries and its allies (OPEC+) have announced a surprise production cut, aiming to stabilize and boost oil prices. This decision has immediate implications for global inflation and economic growth. Commodity currencies, such as the Canadian Dollar (CAD) and Norwegian Krone (NOK), have strengthened significantly. Traders focusing on pairs like USD/CAD should look for brokers with low spreads on commodities and exotic pairs.',
    '2025-09-02T18:00:00Z',
    'Commodities',
    'High',
    'https://www.opec.org/opec_web/en/press-room/2025/September/announcement.htm',
    'OPEC Secretariat',
    0.7,
    'high',
    ARRAY['USD/CAD', 'CAD/JPY', 'NOK/JPY', 'WTI', 'Brent'],
    ARRAY['OPEC', 'oil', 'production_cut', 'commodities', 'inflation'],
    1100,
    true,
    NOW(),
    NOW(),
    '{"organization": "OPEC+", "production_cut": "1000000_bpd", "price_impact": "+5%", "affected_currencies": "commodity_linked", "inflation_impact": "positive"}'
),
(
    'news5',
    'UK Inflation Remains Stubbornly High, BoE Under Pressure',
    'The UK''s Consumer Price Index (CPI) for August came in at 7.1%, higher than the expected 6.8%, putting immense pressure on the Bank of England to continue its rate-hiking cycle.',
    'Stubbornly high inflation in the United Kingdom continues to be a major concern. The latest CPI data shows that core inflation, which strips out volatile food and energy prices, also remains elevated. This makes another 25 basis point hike from the Bank of England at its next meeting almost a certainty. The British Pound (GBP) saw a volatile session, initially rising on rate hike expectations before falling on recession fears. Trading GBP pairs will likely require brokers that can handle high volatility and offer negative balance protection.',
    '2025-08-30T06:00:00Z',
    'Economy',
    'Medium',
    'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/august2025',
    'Office for National Statistics',
    -0.3,
    'medium',
    ARRAY['GBP/USD', 'EUR/GBP', 'GBP/JPY'],
    ARRAY['UK', 'inflation', 'CPI', 'BoE', 'interest_rates'],
    890,
    false,
    NOW(),
    NOW(),
    '{"country": "UK", "indicator": "CPI", "actual": 7.1, "forecast": 6.8, "previous": 6.9, "central_bank": "BoE", "rate_hike_probability": "high"}'
),
(
    'news6',
    'Geopolitical Tensions in Asia Pacific Impact AUD and NZD',
    'Increased geopolitical tensions are causing risk-off sentiment in the markets, leading to weakness in the Australian and New Zealand Dollars, which are often considered risk proxies.',
    'Recent events in the Asia Pacific region have spooked investors, leading to a flight to safety. Safe-haven currencies like the US Dollar and Swiss Franc are gaining, while high-beta, risk-sensitive currencies like the AUD and NZD are underperforming. Market participants are advised to monitor headlines closely, as sudden developments could cause sharp gaps in market pricing. Using a broker with reliable execution and strong regulation is paramount in such an environment.',
    '2025-08-28T22:00:00Z',
    'Geopolitics',
    'Medium',
    'https://www.forexfactory.com/news',
    'Market Analysis Team',
    -0.5,
    'medium',
    ARRAY['AUD/USD', 'NZD/USD', 'AUD/JPY', 'NZD/JPY'],
    ARRAY['geopolitics', 'risk_off', 'AUD', 'NZD', 'Asia_Pacific'],
    670,
    false,
    NOW(),
    NOW(),
    '{"region": "Asia_Pacific", "sentiment": "risk_off", "affected_currencies": "commodity_linked", "broker_recommended": "reliable_execution"}'
);

-- Validate data integrity
DO $$
DECLARE
    total_count INTEGER;
    category_count INTEGER;
    featured_count INTEGER;
BEGIN
    -- Get total count
    SELECT COUNT(*) INTO total_count FROM news_articles;

    -- Get category distribution
    SELECT COUNT(DISTINCT category) INTO category_count FROM news_articles;

    -- Get featured articles count
    SELECT COUNT(*) INTO featured_count FROM news_articles WHERE is_featured = true;

    RAISE NOTICE 'News articles import completed:';
    RAISE NOTICE '  Total articles: %', total_count;
    RAISE NOTICE '  Categories: %', category_count;
    RAISE NOTICE '  Featured articles: %', featured_count;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_articles_date ON news_articles(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_importance ON news_articles(importance);
CREATE INDEX IF NOT EXISTS idx_news_articles_featured ON news_articles(is_featured);

-- Update search vector for full-text search (if using pgvector or similar)
-- This assumes you have a search_vector column for full-text search
UPDATE news_articles
SET search_vector = to_tsvector('english', title || ' ' || summary || ' ' || full_content)
WHERE search_vector IS NULL;

COMMIT;

-- Verification queries
-- SELECT COUNT(*) as total_articles FROM news_articles;
-- SELECT category, COUNT(*) as count FROM news_articles GROUP BY category;
-- SELECT importance, COUNT(*) as count FROM news_articles GROUP BY importance;
-- SELECT is_featured, COUNT(*) as count FROM news_articles GROUP BY is_featured;
-- SELECT publication_date, title, importance FROM news_articles ORDER BY publication_date DESC LIMIT 5;