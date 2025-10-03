import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  TrophyIcon, 
  StarIcon, 
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import SEOHead from '../../../components/seo/SEOHead';
import BrokerCard from '../../../components/brokers/BrokerCard';
import { brokers } from '../../../data/brokers';
import { allSEOPageConfigs, SEOPageConfig } from '../../../data/seoPageConfigs';
import { Broker } from '../../../types';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  // Find the matching SEO configuration
  const config = useMemo(() => {
    if (!category) return null;
    return allSEOPageConfigs.find(page => 
      page.path === `/best-brokers/${category}` || 
      page.path === `/brokers/${category}`
    );
  }, [category]);

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
      { name: 'Best Brokers', url: '/best-brokers' },
      { name: config.heading, url: config.path }
    ];
  }, [config]);

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
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrophyIcon className="h-8 w-8 text-yellow-500 mr-2" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {config.heading}
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {config.subheading}
              </p>
              
              {/* Highlights */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {config.highlights.map((highlight, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    <ShieldCheckIcon className="h-4 w-4 mr-1" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TrophyIcon className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sortedBrokers.length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Brokers Found</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <StarIcon className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sortedBrokers.length > 0 
                        ? (sortedBrokers.reduce((sum, b) => sum + b.score, 0) / sortedBrokers.length).toFixed(1)
                        : '0'
                      }
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sortedBrokers.filter(b => b.regulation.regulators.length > 0).length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Regulated Brokers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brokers List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Top Ranked Brokers
          </h2>
          
          {sortedBrokers.length > 0 ? (
            <div className="grid gap-6">
              {sortedBrokers.map((broker, index) => (
                <div key={broker.id} className="relative">
                  {/* Rank Badge */}
                  <div className="absolute -left-4 -top-4 z-10">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'}
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
                No brokers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>

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
                    <summary className="cursor-pointer bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                      {faq.question}
                    </summary>
                    <div className="p-4 text-gray-600 dark:text-gray-300">
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

export default CategoryPage;