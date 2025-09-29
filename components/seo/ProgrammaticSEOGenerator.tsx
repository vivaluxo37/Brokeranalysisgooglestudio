import React from 'react';
import { Link } from 'react-router-dom';
import { Broker } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, TrendingUp, Shield, Zap } from 'lucide-react';
import AIOptimizedContent from './AIOptimizedContent';
import { useAIOptimizedContent } from '../../hooks/useAIOptimizedContent';
import { createFAQSchema, createHowToSchema, createWebPageSchema } from '../common/JsonLdSchema';

interface SEOPageConfig {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  path?: string;
  filters: {
    regulators?: string[];
    platforms?: string[];
    accountTypes?: string[];
    minDeposit?: number;
    maxDeposit?: number;
    leverage?: number;
    features?: string[];
    regions?: string[];
  };
  highlights: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedPages?: Array<{ title: string; url: string }>;
}

interface ProgrammaticSEOGeneratorProps {
  config: SEOPageConfig;
  brokers: Broker[];
  baseUrl: string;
}

const ProgrammaticSEOGenerator: React.FC<ProgrammaticSEOGeneratorProps> = ({
  config,
  brokers,
  baseUrl
}) => {
  // Filter brokers based on configuration
  const filteredBrokers = brokers.filter(broker => {
    // Regulatory filter
    if (config.filters.regulators && config.filters.regulators.length > 0) {
      const hasRequiredRegulator = config.filters.regulators.some(regulator =>
        broker.regulation.regulators.includes(regulator)
      );
      if (!hasRequiredRegulator) return false;
    }

    // Platform filter
    if (config.filters.platforms && config.filters.platforms.length > 0) {
      const hasRequiredPlatform = config.filters.platforms.some(platform =>
        broker.technology.platforms.includes(platform)
      );
      if (!hasRequiredPlatform) return false;
    }

    // Account type filter
    if (config.filters.accountTypes && config.filters.accountTypes.length > 0) {
      const hasRequiredAccountType = config.filters.accountTypes.some(type =>
        broker.accountTypes.some(account => account.type.toLowerCase().includes(type.toLowerCase()))
      );
      if (!hasRequiredAccountType) return false;
    }

    // Deposit filter
    if (config.filters.minDeposit !== undefined) {
      if (broker.accessibility.minDeposit < config.filters.minDeposit) return false;
    }
    if (config.filters.maxDeposit !== undefined) {
      if (broker.accessibility.minDeposit > config.filters.maxDeposit) return false;
    }

    // Leverage filter
    if (config.filters.leverage !== undefined) {
      const leverageMatch = broker.tradingConditions.maxLeverage.match(/1:(\d+)/);
      if (leverageMatch) {
        const leverage = parseInt(leverageMatch[1]);
        if (leverage < config.filters.leverage) return false;
      }
    }

    // Features filter
    if (config.filters.features && config.filters.features.length > 0) {
      const hasRequiredFeatures = config.filters.features.every(feature => {
        switch (feature.toLowerCase()) {
          case 'copytrading':
            return broker.copyTrading || broker.platformFeatures.copyTrading.available;
          case 'islamic':
            return broker.isIslamic || broker.accountManagement.islamicAccount.available;
          case 'scalping':
            return broker.technology.executionType.includes('ECN') || broker.tradingConditions.spreads.eurusd < 1.0;
          case 'signals':
            return broker.providesSignals;
          default:
            return true;
        }
      });
      if (!hasRequiredFeatures) return false;
    }

    return true;
  });

  // Sort brokers by score (descending)
  const sortedBrokers = [...filteredBrokers].sort((a, b) => b.score - a.score);

  // Generate AI-optimized content
  const aiContent = useAIOptimizedContent(filteredBrokers, config);

  // Generate structured data for AI understanding
  const structuredData = [
    createWebPageSchema({
      title: config.title,
      description: config.description,
      url: `${baseUrl}${config.path}`,
      lastModified: new Date().toISOString(),
      breadcrumbs: []
    }),
    createFAQSchema(aiContent.commonQuestions || []),
    createHowToSchema({
      name: aiContent.stepByStep?.title || 'How to Choose a Forex Broker',
      description: 'Step-by-step guide to selecting the right forex broker',
      steps: aiContent.stepByStep?.steps || []
    })
  ];

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'regulated':
        return <Shield className="h-4 w-4" />;
      case 'low spread':
        return <TrendingUp className="h-4 w-4" />;
      case 'fast execution':
        return <Zap className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="programmatic-seo-page max-w-7xl mx-auto px-4 py-8">
      {/* AI-Optimized Content Section */}
      <AIOptimizedContent
        title={config.heading}
        description={config.subheading}
        content={aiContent}
        structuredData={structuredData}
        brokers={filteredBrokers}
        config={config}
      />
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.heading}</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {config.subheading}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {config.highlights.map((highlight, index) => (
            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
              {highlight}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Top-Tier Regulation</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              All brokers are regulated by FCA, ASIC, NFA, or other major financial authorities, ensuring the highest level of safety for your funds.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Competitive Pricing</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Find brokers with tight spreads, low commissions, and transparent fee structures to maximize your trading profitability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold">Advanced Technology</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Access cutting-edge trading platforms, fast execution, and innovative tools to enhance your trading experience.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brokers List */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Top Recommended Brokers</h2>

        {sortedBrokers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No brokers found matching your criteria.</p>
              <Button asChild>
                <Link to="/brokers">View All Brokers</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {sortedBrokers.slice(0, 10).map((broker, index) => (
              <Card key={`seo-${broker.id}`} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Broker Info */}
                    <div className="lg:w-1/4">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={broker.logoUrl}
                          alt={broker.name}
                          className="h-12 w-auto"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{broker.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{broker.score}</span>
                            <span className="text-gray-500 text-sm">/10</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Founded:</strong> {broker.foundingYear}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Min Deposit:</strong> {formatCurrency(broker.accessibility.minDeposit)}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {broker.regulation.regulators.slice(0, 2).map(regulator => (
                            <Badge key={regulator} variant="outline" className="text-xs">
                              {regulator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Trading Conditions */}
                    <div className="lg:w-1/4">
                      <h4 className="font-semibold mb-3">Trading Conditions</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Spread:</strong> {broker.tradingConditions.spreads.eurusd} on EUR/USD</p>
                        <p><strong>Commission:</strong> {broker.tradingConditions.commission}</p>
                        <p><strong>Leverage:</strong> {broker.tradingConditions.maxLeverage}</p>
                        <p><strong>Platforms:</strong> {broker.technology.platforms.join(', ')}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="lg:w-1/4">
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {broker.accountTypes.slice(0, 2).map((account, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {getFeatureIcon('regulated')}
                            <span>{account.name}</span>
                          </div>
                        ))}
                        {(broker.copyTrading || broker.platformFeatures.copyTrading.available) && (
                          <div className="flex items-center gap-2 text-sm">
                            {getFeatureIcon('copytrading')}
                            <span>Copy Trading</span>
                          </div>
                        )}
                        {(broker.isIslamic || broker.accountManagement.islamicAccount.available) && (
                          <div className="flex items-center gap-2 text-sm">
                            {getFeatureIcon('islamic')}
                            <span>Islamic Account</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="lg:w-1/4 flex items-center">
                      <div className="space-y-3 w-full">
                        <Button asChild className="w-full">
                          <Link to={`/broker/${broker.id}`}>Read Full Review</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                            Visit Broker
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Related Pages */}
      {config.relatedPages && config.relatedPages.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Related Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.relatedPages.map((page, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Link to={page.url} className="text-blue-600 hover:text-blue-800 font-medium">
                    {page.title}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="text-center bg-blue-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Choose Your Broker?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Use our advanced broker matching tool to find the perfect broker based on your trading style, experience level, and preferences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/broker-matcher">Find Your Perfect Broker</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/compare">Compare Brokers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgrammaticSEOGenerator;