import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brokers } from '../data/brokers';
import { allSEOPageConfigs } from '../data/seoPageConfigs';
import ProgrammaticSEOGenerator from '../components/seo/ProgrammaticSEOGenerator';
import SEOContainer from '../components/seo/SEOContainer';
import useMetaDescription from '../hooks/useMetaDescription';
import NotFoundPage from './NotFoundPage';

const SEOPage: React.FC = () => {
  const { seoSlug } = useParams<{ seoSlug: string }>();

  // Find the matching configuration
  const config = useMemo(() => {
    return allSEOPageConfigs.find(page =>
      page.path === `/${seoSlug}` || page.path === `/brokers/${seoSlug}`
    );
  }, [seoSlug]);

  // Filter brokers based on configuration
  const filteredBrokers = useMemo(() => {
    if (!config) return [];

    return brokers.filter(broker => {
      // Apply all filters from the configuration
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

  // Generate meta description
  const metaDescription = useMetaDescription({
    type: 'category',
    title: config?.title || '',
    keyFeatures: config?.highlights || [],
    targetAudience: 'forex traders'
  });

  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!config) return [];

    const segments = config.path.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      name: segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace('And', '&')
        .replace('Usa', 'USA')
        .replace('Uk', 'UK'),
      url: '/' + segments.slice(0, index + 1).join('/')
    }));
  }, [config]);

  if (!config) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SEOContainer
        type="category"
        title={config.title}
        description={metaDescription}
        canonicalUrl={`https://brokeranalysis.com${config.path}`}
        breadcrumbs={breadcrumbs}
        faqs={config.faqs}
        keywords={[
          ...config.highlights,
          'forex broker',
          'online trading',
          'currency trading',
          'broker comparison'
        ]}
        noIndex={false}
      />

      <ProgrammaticSEOGenerator
        config={config}
        brokers={filteredBrokers}
        baseUrl="https://brokeranalysis.com"
      />
    </>
  );
};

export default SEOPage;