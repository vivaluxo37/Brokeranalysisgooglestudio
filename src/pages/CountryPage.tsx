import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from '../../components/seo/HelmetAsync';
import { supabase } from '../lib/supabase';
import { getContentGenerator, type ContentTemplate, type BrokerSummary } from '../lib/contentGeneration';
import { getBrokerRanking } from '../lib/brokerRanking';
import { getCached, setCached } from '../lib/cache';
import BrokerCard from '../components/BrokerCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface CountryPageData {
  country: {
    id: string;
    name: string;
    slug: string;
    flag: string;
    iso_code: string;
    population?: number;
    currency?: string;
  };
  brokers: any[];
  rankedBrokers: any[];
  content: ContentTemplate;
  verificationStats: {
    total: number;
    verified: number;
    lastUpdated: string;
  };
}

interface VerificationEvidence {
  broker_id: string;
  broker_name: string;
  is_available: boolean;
  confidence: number;
  evidence: string[];
  last_verified: string;
}

const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const [data, setData] = useState<CountryPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationEvidence, setVerificationEvidence] = useState<VerificationEvidence[]>([]);
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    if (countrySlug) {
      loadCountryData(countrySlug);
    }
  }, [countrySlug]);

  const loadCountryData = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = `country-page-${slug}`;
      
      // Try to get from cache first
      const cached = await getCached<CountryPageData>(cacheKey);
      if (cached) {
        setData(cached);
        await loadVerificationEvidence(cached.country.id);
        setLoading(false);
        return;
      }

      // Extract country name from slug (e.g., 'united-kingdom-2025' -> 'united-kingdom')
      const countrySlugBase = slug.replace(/-2025$/, '');

      // Fetch country info
      const { data: country, error: countryError } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', countrySlugBase)
        .single();

      if (countryError || !country) {
        throw new Error(`Country not found: ${slug}`);
      }

      // Fetch broker availability for this country
      const { data: availability, error: availabilityError } = await supabase
        .from('broker_country_availability')
        .select(`
          broker_id,
          is_available,
          confidence,
          evidence,
          last_verified,
          brokers (
            id,
            name,
            website,
            logo_url,
            rating,
            min_deposit,
            max_leverage,
            spreads_from,
            regulation,
            platforms,
            account_types,
            description
          )
        `)
        .eq('country_id', country.id)
        .eq('is_available', true)
        .gte('confidence', 0.7); // Only include brokers with high confidence

      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
      }

      const availableBrokers = availability?.map(a => a.brokers).filter(Boolean) || [];

      if (availableBrokers.length === 0) {
        // Fallback: get all brokers if no specific availability data
        const { data: allBrokers, error: brokersError } = await supabase
          .from('brokers')
          .select('*')
          .limit(20);

        if (brokersError) {
          throw new Error('Failed to fetch brokers');
        }

        const fallbackData = await createCountryData(country, allBrokers || [], slug, true);
        setData(fallbackData);
        setLoading(false);
        return;
      }

      const countryData = await createCountryData(country, availableBrokers, slug, false);

      // Cache the result
      await setCached(cacheKey, countryData, 3600); // Cache for 1 hour

      setData(countryData);
      await loadVerificationEvidence(country.id);
    } catch (err) {
      console.error('Error loading country data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load country');
    } finally {
      setLoading(false);
    }
  };

  const createCountryData = async (
    country: any, 
    brokers: any[], 
    slug: string, 
    isFallback: boolean
  ): Promise<CountryPageData> => {
    // Rank brokers for this country
    const rankedBrokers = await getBrokerRanking(brokers, {
      countryId: country.id,
      limit: 50
    });

    // Convert to BrokerSummary format for content generation
    const brokerSummaries: BrokerSummary[] = rankedBrokers.map(broker => ({
      name: broker.name,
      rating: broker.rating || 8.0,
      minDeposit: broker.min_deposit || 100,
      regulation: broker.regulation || 'International',
      keyFeatures: [
        broker.platforms?.split(',')[0] || 'Trading Platform',
        `Min Deposit: $${broker.min_deposit || 100}`,
        broker.account_types?.split(',')[0] || 'Standard Account'
      ].filter(Boolean)
    }));

    // Generate content
    const contentGenerator = getContentGenerator();
    const content = await contentGenerator.generateCountryContent(slug, country.name, brokerSummaries);

    return {
      country,
      brokers,
      rankedBrokers,
      content,
      verificationStats: {
        total: brokers.length,
        verified: isFallback ? 0 : brokers.length,
        lastUpdated: new Date().toISOString()
      }
    };
  };

  const loadVerificationEvidence = async (countryId: string) => {
    try {
      const { data: evidence, error } = await supabase
        .from('broker_country_availability')
        .select(`
          broker_id,
          is_available,
          confidence,
          evidence,
          last_verified,
          brokers!inner (
            name
          )
        `)
        .eq('country_id', countryId)
        .order('confidence', { ascending: false })
        .limit(10);

      if (!error && evidence) {
        const formattedEvidence: VerificationEvidence[] = evidence.map(e => ({
          broker_id: e.broker_id,
          broker_name: e.brokers?.name || 'Unknown',
          is_available: e.is_available,
          confidence: e.confidence,
          evidence: Array.isArray(e.evidence) ? e.evidence : [],
          last_verified: e.last_verified || new Date().toISOString()
        }));
        
        setVerificationEvidence(formattedEvidence);
      }
    } catch (err) {
      console.error('Error loading verification evidence:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Country Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested country could not be found.'}</p>
          <Link
            to="/best-brokers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const { country, rankedBrokers, content, verificationStats } = data;

  // Generate JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": content.h1,
    "description": content.metaDescription,
    "url": `${window.location.origin}/best-forex-brokers/${country.slug}-2025`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Best Brokers",
          "item": `${window.location.origin}/best-brokers`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `Best Forex Brokers in ${country.name}`
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `Best Forex Brokers in ${country.name} 2025`,
      "description": content.intro,
      "numberOfItems": rankedBrokers.length,
      "itemListElement": rankedBrokers.slice(0, 10).map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "FinancialProduct",
          "name": broker.name,
          "description": broker.description || `${broker.name} forex broker available in ${country.name}`,
          "url": broker.website,
          "provider": {
            "@type": "Organization",
            "name": broker.name
          },
          "aggregateRating": broker.rating ? {
            "@type": "AggregateRating",
            "ratingValue": broker.rating,
            "bestRating": 10,
            "worstRating": 1
          } : undefined
        }
      }))
    }
  };

  // Generate FAQ structured data
  const faqStructuredData = content.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{content.h1}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.keywords.join(', ')} />
        <link rel="canonical" href={`${window.location.origin}/best-forex-brokers/${country.slug}-2025`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={content.h1} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/best-forex-brokers/${country.slug}-2025`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.h1} />
        <meta name="twitter:description" content={content.metaDescription} />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        {faqStructuredData && (
          <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        )}
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/best-brokers" className="text-blue-600 hover:text-blue-800">
              Best Brokers
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Best Forex Brokers in {country.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Country Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="text-6xl mr-4">{country.flag}</div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {content.h1}
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span className="mr-4">ISO: {country.iso_code}</span>
                {country.population && (
                  <span className="mr-4">Population: {country.population.toLocaleString()}</span>
                )}
                {country.currency && (
                  <span>Currency: {country.currency}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed mb-8">
            {content.intro}
          </div>

          {/* Verification Stats */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{verificationStats.verified}</div>
                <div className="text-sm text-gray-600">Verified Brokers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{verificationStats.total}</div>
                <div className="text-sm text-gray-600">Total Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {((verificationStats.verified / verificationStats.total) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Acceptance Rate</div>
              </div>
            </div>
            
            {verificationEvidence.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowEvidence(!showEvidence)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showEvidence ? 'Hide' : 'Show'} Verification Evidence
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Verification Evidence */}
        {showEvidence && verificationEvidence.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Verification Evidence</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {verificationEvidence.slice(0, 5).map((evidence) => (
                  <div key={evidence.broker_id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{evidence.broker_name}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          evidence.is_available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {evidence.is_available ? 'Available' : 'Not Available'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {(evidence.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    </div>
                    {evidence.evidence.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Evidence:</span> {evidence.evidence.slice(0, 2).join(', ')}
                        {evidence.evidence.length > 2 && '...'}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Last verified: {new Date(evidence.last_verified).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Broker Results */}
        {rankedBrokers.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Forex Brokers in {country.name} ({rankedBrokers.length} brokers)
              </h2>
              <div className="text-sm text-gray-500">
                Rankings updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Quick Comparison Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Broker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Deposit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Max Leverage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spreads From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Regulation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rankedBrokers.slice(0, 10).map((broker, index) => (
                      <tr key={broker.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {broker.logo_url && (
                              <img 
                                className="h-8 w-8 rounded-full mr-3" 
                                src={broker.logo_url} 
                                alt={`${broker.name} logo`}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {broker.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {broker.rating ? broker.rating.toFixed(1) : 'N/A'}
                            </span>
                            {broker.rating && (
                              <span className="text-xs text-gray-500 ml-1">/10</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${broker.min_deposit || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.max_leverage ? `1:${broker.max_leverage}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.spreads_from ? `${broker.spreads_from} pips` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {broker.regulation || 'International'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Broker Cards */}
            <div className="grid gap-6 lg:gap-8">
              {rankedBrokers.map((broker, index) => (
                <div key={broker.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full z-10">
                      #{index + 1} BEST
                    </div>
                  )}
                  <BrokerCard 
                    broker={broker} 
                    showRanking={true}
                    ranking={index + 1}
                    countryContext={country.name}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No verified brokers found</h3>
            <p className="text-gray-600">
              We're currently verifying broker availability in {country.name}. Check back soon!
            </p>
          </div>
        )}

        {/* FAQ Section */}
        {content.faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {content.faqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Trading in {country.name}?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              All featured brokers have been verified to accept traders from {country.name} and comply with local financial regulations.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/best-brokers"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Compare All Brokers
              </Link>
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Verification Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryPage;