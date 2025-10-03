import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  TrophyIcon, 
  StarIcon, 
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import SEOHead from '../../../components/seo/SEOHead';
import BrokerCard from '../../../components/brokers/BrokerCard';
import { brokers } from '../../../data/brokers';
import { allSEOPageConfigs, SEOPageConfig } from '../../../data/seoPageConfigs';
import { Broker } from '../../../types';

const SEOCategoryPage: React.FC = () => {
  const { seoSlug } = useParams<{ seoSlug: string }>();

  // Find the matching SEO configuration
  const config = useMemo(() => {
    if (!seoSlug) return null;
    return allSEOPageConfigs.find(page => 
      page.path === `/brokers/${seoSlug}` || 
      page.path === `/${seoSlug}`
    );
  }, [seoSlug]);

  // Filter brokers based on configuration
  const filteredBrokers = useMemo(() => {
    if (!config) return [];

    return brokers.filter(broker => {
      const { filters } = config;

      // Regulatory filter
      if (filters.regulators && filters.regulators.length > 0) {
        const hasRequiredRegulator = filters.regulators.some(regulator =>
          broker.regulation.regulators.includes(regulator)
        );
        if (!hasRequiredRegulator) return false;
      }

      // Platform filter
      if (filters.platforms && filters.platforms.length > 0) {
        const hasRequiredPlatform = filters.platforms.some(platform =>
          broker.technology.platforms.includes(platform)
        );
        if (!hasRequiredPlatform) return false;
      }

      // Account type filter
      if (filters.accountTypes && filters.accountTypes.length > 0) {
        const hasRequiredAccountType = filters.accountTypes.some(type =>
          broker.accountTypes.some(account =>
            account.type.toLowerCase().includes(type.toLowerCase())
          )
        );
        if (!hasRequiredAccountType) return false;
      }

      // Deposit filter
      if (filters.minDeposit !== undefined) {
        if (broker.accessibility.minDeposit < filters.minDeposit) return false;
      }
      if (filters.maxDeposit !== undefined) {
        if (broker.accessibility.minDeposit > filters.maxDeposit) return false;
      }

      // Leverage filter
      if (filters.leverage !== undefined) {
        const leverageMatch = broker.tradingConditions.maxLeverage.match(/1:(\d+)/);
        if (leverageMatch) {
          const leverage = parseInt(leverageMatch[1]);
          if (leverage < filters.leverage) return false;
        }
      }

      // Features filter
      if (filters.features && filters.features.length > 0) {
        const hasRequiredFeatures = filters.features.every(feature => {
          switch (feature.toLowerCase()) {
            case 'copytrading':
              return broker.copyTrading || broker.platformFeatures.copyTrading.available;
            case 'islamic':
              return broker.isIslamic || broker.accountManagement.islamicAccount.available;
            case 'scalping':
              return broker.technology.executionType.includes('ECN') ||
                     broker.tradingConditions.spreads.eurusd < 1.0;
            case 'signals':
              return broker.providesSignals;
            default:
              return true;
          }
        });
        if (!hasRequiredFeatures) return false;
      }

      // Specialties filter
      if (filters.specialties && filters.specialties.length > 0) {
        const hasSpecialties = filters.specialties.some(specialty => {
          switch (specialty.toLowerCase()) {
            case 'crypto':
              return (broker.tradableInstruments?.cryptocurrencies?.total || 0) > 0;
            case 'stocks':
              return (broker.tradableInstruments?.stocks?.total || 0) > 0;
            case 'indices':
              return (broker.tradableInstruments?.indices?.total || 0) > 0;
            case 'commodities':
              return (broker.tradableInstruments?.commodities?.total || 0) > 0;
            default:
              return true;
          }
        });
        if (!hasSpecialties) return false;
      }

      // Regions filter
      if (filters.regions && filters.regions.length > 0) {
        const servesRegion = filters.regions.some(region => {
          switch (region.toLowerCase()) {
            case 'usa':
              return broker.regulation.regulators.includes('NFA');
            case 'uk':
              return broker.regulation.regulators.includes('FCA');
            case 'europe':
              return broker.regulation.regulators.some(r =>
                ['FCA', 'CySEC', 'BaFin', 'FINMA'].includes(r)
              );
            case 'australia':
              return broker.regulation.regulators.includes('ASIC');
            default:
              return true;
          }
        });
        if (!servesRegion) return false;
      }

      return true;
    });
  }, [config]);

  // Sort brokers by score
  const sortedBrokers = useMemo(() => {
    return [...filteredBrokers].sort((a, b) => b.score - a.score);
  }, [filteredBrokers]);

  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!config) return [];

    return [
      { name: 'Home', url: '/' },
      { name: 'Brokers', url: '/brokers' },
      { name: config.heading, url: config.path }
    ];
  }, [config]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (sortedBrokers.length === 0) return null;

    const avgRating = sortedBrokers.reduce((sum, b) => sum + b.score, 0) / sortedBrokers.length;
    const regulatedCount = sortedBrokers.filter(b => b.regulation.regulators.length > 0).length;
    const avgSpread = sortedBrokers.reduce((sum, b) => sum + parseFloat(b.tradingConditions.spreads.eurusd), 0) / sortedBrokers.length;
    const minDeposit = Math.min(...sortedBrokers.map(b => b.accessibility.minDeposit));

    return {
      avgRating: Math.round(avgRating * 10) / 10,
      regulatedCount,
      avgSpread: Math.round(avgSpread * 100) / 100,
      minDeposit
    };
  }, [sortedBrokers]);

  // If no config found, redirect to 404
  if (!config) {
    return <Navigate to="/404" replace />;
  }

  // Generate comprehensive structured data using the service
  const schemas = React.useMemo(() => {
    const { SchemaUtils } = require('../../../services/structuredData');
    return SchemaUtils.forCategoryPage(config, sortedBrokers, breadcrumbs);
  }, [config, sortedBrokers, breadcrumbs]);

  return (
    <>
      <SEOHead
        title={config.title}
        description={config.description}
        canonical={`https://brokeranalysis.com${config.path}`}
        structuredData={schemas}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumbs */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4 text-sm">
              {breadcrumbs.map((item, index) => (
                <div key={item.url} className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-500 dark:text-gray-400">{item.name}</span>
                  ) : (
                    <Link 
                      to={item.url}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <TrophyIcon className="h-10 w-10 text-yellow-500 mr-3" />
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                  {config.heading}
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                {config.subheading}
              </p>
              
              {/* Key highlights */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {config.highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                    {highlight}
                  </div>
                ))}
              </div>

              {/* Statistics */}
              {statistics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {sortedBrokers.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Brokers Found
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {statistics.avgRating}/5
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Rating
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {statistics.regulatedCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Regulated
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      ${statistics.minDeposit}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Min Deposit
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Picks Section */}
        {sortedBrokers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 py-12 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Top 3 Recommended Brokers
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Our algorithm has analyzed {sortedBrokers.length} brokers to bring you these top-rated options matching your criteria.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sortedBrokers.slice(0, 3).map((broker, index) => (
                  <div key={broker.id} className="relative">
                    {/* Winner badge for #1 */}
                    {index === 0 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                          <TrophyIcon className="h-4 w-4 mr-1" />
                          #1 WINNER
                        </div>
                      </div>
                    )}
                    
                    {/* Rank badge */}
                    <div className="absolute -left-3 -top-3 z-10">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}
                      `}>
                        {index + 1}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                          {broker.logo ? (
                            <img src={broker.logo} alt={broker.name} className="w-16 h-16 object-contain" />
                          ) : (
                            <BuildingOffice2Icon className="w-16 h-16 text-gray-400" />
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {broker.name}
                        </h3>
                        
                        <div className="flex items-center justify-center mb-4">
                          <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-lg font-semibold text-gray-900 dark:text-white">
                            {broker.score}/5
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                          <div className="flex justify-between">
                            <span>Min Deposit:</span>
                            <span className="font-semibold">${broker.accessibility.minDeposit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Spread from:</span>
                            <span className="font-semibold">{broker.tradingConditions.spreads.eurusd} pips</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regulated:</span>
                            <span className="font-semibold">
                              {broker.regulation.regulators.length > 0 ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Link
                            to={`/broker/${broker.slug}`}
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                          >
                            View Details
                          </Link>
                          {broker.externalUrl && (
                            <a
                              href={broker.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                            >
                              Visit Broker →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Complete Broker List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Complete Broker List ({sortedBrokers.length} brokers)
          </h2>
          
          {sortedBrokers.length > 0 ? (
            <div className="grid gap-6">
              {sortedBrokers.map((broker, index) => (
                <div key={broker.id} className="relative">
                  <div className="absolute -left-4 -top-4 z-10">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                      ${index < 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-blue-500'}
                    `}>
                      {index + 1}
                    </div>
                  </div>
                  <BrokerCard broker={broker} showRanking={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No brokers match these criteria
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try browsing our full broker directory or adjust your search criteria.
              </p>
              <Link
                to="/brokers"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Brokers
              </Link>
            </div>
          )}
        </div>

        {/* Related Categories */}
        {config.relatedPages && config.relatedPages.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Related Broker Categories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.relatedPages.map((page, index) => (
                  <Link
                    key={index}
                    to={page.url}
                    className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {page.title}
                    </h3>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span>Explore →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {config.faqs && config.faqs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="max-w-3xl mx-auto">
                {config.faqs.map((faq, index) => (
                  <details key={index} className="mb-4">
                    <summary className="cursor-pointer bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600">
                      {faq.question}
                    </summary>
                    <div className="p-4 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-l border-r border-b border-gray-200 dark:border-gray-600 rounded-b-lg">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SEOCategoryPage;