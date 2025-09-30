import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  StarIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../components/seo/SEOHead';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BrokerCard from '../components/directory/BrokerCard';
import { getCountryBySlug, CountryConfig } from '../lib/constants/countries';
import { getBrokersForCountry } from '../lib/data/countryBrokerMappings';
import { 
  generateHeroIntro, 
  generateLocalRelevance, 
  generateFAQs, 
  generateMetaTags,
  generateBrokerCategories,
  type FAQItem,
  type BrokerCategory
} from '../utils/contentGenerators';
import { brokers as allBrokers } from '../data/brokers';
import { Broker } from '../types';

// Transform broker data to match BrokerCard interface
const transformBrokerForCard = (broker: Broker) => {
  // Extract regulators for display
  const regulators = broker.security?.regulatedBy?.map(r => r.regulator).slice(0, 3).join(', ') || 
                    broker.regulation?.regulators?.slice(0, 3).join(', ') || 
                    'Regulated';
  
  return {
    id: broker.id, // Keep as string for routing
    name: broker.name,
    overall_rating: broker.score || broker.ratings?.regulation || 0,
    logo_url: broker.logoUrl,
    minimum_deposit: broker.accessibility?.minDeposit ?? broker.accountTypes?.[0]?.minDeposit ?? 0,
    regulation_status: regulators,
    trust_score: broker.ratings?.regulation,
    website: broker.websiteUrl
  };
};

const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const [country, setCountry] = useState<CountryConfig | null>(null);
  const [countryBrokers, setCountryBrokers] = useState<any[]>([]); // Changed to any[] for transformed data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Generate content using our utilities
  const content = useMemo(() => {
    if (!country) return null;
    return {
      heroIntro: generateHeroIntro(country),
      localRelevance: generateLocalRelevance(country),
      faqs: generateFAQs(country),
      metaTags: generateMetaTags(country, countryBrokers.length),
      categories: generateBrokerCategories()
    };
  }, [country, countryBrokers.length]);

  useEffect(() => {
    loadPageData();
  }, [countrySlug]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!countrySlug) {
        throw new Error('Country slug is required');
      }

      // Get country configuration
      const countryData = getCountryBySlug(countrySlug);
      if (!countryData) {
        throw new Error('Country not found');
      }

      setCountry(countryData);

      // Get broker IDs for this country
      const brokerIds = getBrokersForCountry(countrySlug);
      
      if (brokerIds.length === 0) {
        console.warn(`No brokers mapped for country: ${countrySlug}`);
      }

      // Map broker IDs to full broker objects and transform for BrokerCard
      const mappedBrokers = brokerIds
        .map(brokerId => {
          const broker = allBrokers.find(b => b.id === brokerId);
          return broker ? transformBrokerForCard(broker) : null;
        })
        .filter((broker): broker is any => broker !== null);

      setCountryBrokers(mappedBrokers);

      console.log(`Loaded ${mappedBrokers.length} brokers for ${countryData.name}`);

    } catch (err) {
      console.error('Error loading country page data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // JSON-LD structured data with FAQs
  const jsonLd = country && content ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${country.name} Forex Brokers`,
    description: content.metaTags.description,
    url: typeof window !== 'undefined' ? window.location.href : `https://brokeranalysis.com/best-forex-brokers/${country.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://brokeranalysis.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Countries',
          item: typeof window !== 'undefined' ? `${window.location.origin}/countries` : 'https://brokeranalysis.com/countries'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: country.name,
          item: typeof window !== 'undefined' ? window.location.href : `https://brokeranalysis.com/best-forex-brokers/${country.slug}`
        }
      ]
    },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: content.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Loading Country Brokers..."
          description="Loading country-specific broker information..."
        />
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Country Not Found"
          description="The requested country page could not be found."
        />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Country Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested country could not be found.'}</p>
          <Link
            to="/countries"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Countries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title={content?.metaTags.title || country.seoTitle}
        description={content?.metaTags.description || country.metaDescription}
        keywords={country.keywords}
        jsonLd={jsonLd}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <Link to="/countries" className="text-gray-500 hover:text-gray-700">
              Countries
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{country.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">{country.flag}</span>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold">
                  {country.name}<br />
                  <span className="text-blue-200">Forex Brokers</span>
                </h1>
              </div>
            </div>
            
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {content?.heroIntro}
            </p>
            
            {/* Quick Navigation */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a 
                href="#brokers"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                View Brokers
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#info"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                Local Info
              </a>
              <a 
                href="#faq"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                FAQs
              </a>
            </div>

            {/* Country Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GlobeAltIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{countryBrokers.length} Available Brokers</h3>
                <p className="text-blue-100 text-sm">Licensed and regulated brokers</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Regulated Market</h3>
                <p className="text-blue-100 text-sm">Strong regulatory framework</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <StarIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">High Quality Service</h3>
                <p className="text-blue-100 text-sm">Top-rated broker platforms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Brokers Section */}
      <section id="brokers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Brokers Available in {country.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These brokers are verified to accept clients from {country.name} and comply with local regulations.
            </p>
          </div>

          {countryBrokers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryBrokers.map((broker, index) => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  priority={index + 1}
                  showRanking={true}
                  countryContext={country.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No brokers currently available for {country.name}</p>
            </div>
          )}
        </div>
      </section>

      {/* Country Information Section */}
      <section id="info" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trading in {country.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Important information for traders in {country.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Regulatory Environment</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content?.localRelevance.regulatory}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <BanknotesIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Methods</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content?.localRelevance.payments}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <ScaleIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tax Considerations</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content?.localRelevance.taxation}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Local Support</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content?.localRelevance.support}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Common questions about forex trading in {country.name}
            </p>
          </div>

          <div className="space-y-4">
            {content?.faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                    {faq.question}
                  </span>
                  <ChevronRightIcon 
                    className={`h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'transform rotate-90' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose from our recommended brokers that accept clients from {country.name} 
            and start your trading journey with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#brokers"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Compare Brokers
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </a>
            <Link
              to="/best-brokers"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryPage;