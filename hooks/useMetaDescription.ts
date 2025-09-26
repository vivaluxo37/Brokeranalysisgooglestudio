
import { useMemo } from 'react';
import { Broker } from '../types';

interface MetaDescriptionOptions {
  type: 'broker' | 'article' | 'category' | 'comparison' | 'home' | 'tools';
  title?: string;
  broker?: Broker;
  brokerName?: string;
  keyFeatures?: string[];
  targetAudience?: string;
  mainBenefit?: string;
  year?: number;
}

const useMetaDescription = (options: MetaDescriptionOptions): string => {
  return useMemo(() => {
    const { type, title, broker, brokerName, keyFeatures = [], targetAudience, mainBenefit, year = 2025 } = options;

    const currentYear = new Date().getFullYear();
    const yearText = year !== currentYear ? `for ${year}` : '';

    switch (type) {
      case 'broker':
        if (!broker && !brokerName) return 'Comprehensive forex broker review and analysis. Compare spreads, regulations, and trading conditions.';

        const name = broker?.name || brokerName;
        const regulators = broker?.regulation?.regulators?.slice(0, 2).join(', ') || 'top-tier authorities';
        const foundedYear = broker?.foundingYear || 'established';

        return `Complete ${name} review ${yearText}. Founded ${foundedYear}, regulated by ${regulators}. Compare spreads, platforms, and fees. Is ${name} right for ${targetAudience || 'your trading'}?`;

      case 'article':
        if (!title) return 'Expert forex trading insights, broker reviews, and market analysis for traders of all levels.';

        return `Learn about ${title}${yearText}. Expert forex trading guide with practical tips, strategies, and market insights for ${targetAudience || 'traders'}.`;

      case 'category':
        if (!title) return 'Compare forex brokers by category. Find the best brokers for your trading needs and preferences.';

        const featuresText = keyFeatures.length > 0 ? ` featuring ${keyFeatures.slice(0, 2).join(', ')}` : '';
        return `Best ${title} ${yearText}${featuresText}. Compare top forex brokers and find the perfect match for ${targetAudience || 'your trading needs'}.`;

      case 'comparison':
        return `Side-by-side forex broker comparison. Analyze spreads, fees, platforms, and regulations to make an informed trading decision ${yearText}.`;

      case 'home':
      default:
        return `BrokerAnalysis: Your trusted source for forex broker reviews, comparisons, and trading insights ${yearText}. Find the perfect broker with our AI-powered analysis.`;

      case 'tools':
        return `Professional forex trading tools and calculators. Analyze costs, risks, and potential returns to optimize your trading strategy ${yearText}.`;
    }
  }, [options]);
};

// Backward compatibility
export const useBrokerMetaDescription = (broker: Broker | undefined): string => {
  return useMetaDescription({
    type: 'broker',
    broker,
    targetAudience: 'your trading style'
  });
};

export default useMetaDescription;
