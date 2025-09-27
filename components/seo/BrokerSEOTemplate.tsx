import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Star,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Globe,
  Users,
  Award
} from 'lucide-react';
import SEOContainer from './SEOContainer';
import GenerativeEngineSEO from './GenerativeEngineSEO';
import { Broker } from '../../types';

interface BrokerSEOTemplateProps {
  broker: Broker;
  baseUrl: string;
  relatedBrokers?: Broker[];
  reviews?: any[];
  marketAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    trends: string[];
    outlook: string;
  };
}

const BrokerSEOTemplate: React.FC<BrokerSEOTemplateProps> = ({
  broker,
  baseUrl,
  relatedBrokers = [],
  reviews = [],
  marketAnalysis
}) => {
  const canonicalUrl = `${baseUrl}/broker/${broker.id}`;

  // Generate pros and cons
  const pros = [
    broker.regulation.regulators.length > 2 && 'Multi-regulated for maximum safety',
    broker.tradingConditions.spreads.eurusd < 1.0 && 'Ultra-tight spreads on major pairs',
    broker.technology.platforms.includes('MT5') && 'Advanced MetaTrader 5 platform',
    broker.copyTrading && 'Copy trading available',
    broker.accountManagement.islamicAccount.available && 'Islamic accounts supported'
  ].filter(Boolean);

  const cons = [
    broker.accessibility.minDeposit > 500 && 'High minimum deposit',
    broker.tradingConditions.commission !== 'None' && 'Commission-based pricing',
    broker.customerSupport.phone === 'Not available' && 'No phone support',
    !broker.copyTrading && 'No copy trading features'
  ].filter(Boolean);

  // Generate key takeaways
  const keyTakeaways = [
    `${broker.name} is ${broker.regulation.regulators.length > 1 ? 'multi-regulated' : 'regulated'} by ${broker.regulation.regulators.join(', ')}`,
    `Minimum deposit of $${broker.accessibility.minDeposit.toLocaleString()} required to open an account`,
    `Spreads from ${broker.tradingConditions.spreads.eurusd} pips on EUR/USD`,
    `Maximum leverage of ${broker.tradingConditions.maxLeverage} available`,
    `Overall rating: ${broker.score}/10 based on trading conditions, regulation, and platform features`
  ];

  // Generate FAQs
  const faqs = [
    {
      question: `Is ${broker.name} a regulated forex broker?`,
      answer: `Yes, ${broker.name} is regulated by ${broker.regulation.regulators.join(', ')}. ${broker.regulation.regulators.length > 1 ? 'This multi-regulation provides enhanced safety for traders.' : 'This regulation ensures the broker follows strict financial standards.'}`
    },
    {
      question: `What is the minimum deposit at ${broker.name}?`,
      answer: `The minimum deposit to open an account with ${broker.name} is $${broker.accessibility.minDeposit.toLocaleString()}. This is ${broker.accessibility.minDeposit > 500 ? 'higher than average' : 'competitive'} compared to other brokers.`
    },
    {
      question: `What trading platforms does ${broker.name} offer?`,
      answer: `${broker.name} offers the following trading platforms: ${broker.technology.platforms.join(', ')}. ${broker.technology.platforms.includes('MT4') || broker.technology.platforms.includes('MT5') ? 'MetaTrader platforms are known for their advanced charting and automated trading capabilities.' : ''}`
    },
    {
      question: `What are the spreads at ${broker.name}?`,
      answer: `${broker.name} offers spreads starting from ${broker.tradingConditions.spreads.eurusd} pips on EUR/USD. ${broker.tradingConditions.spreads.eurusd < 1.0 ? 'These are considered very tight spreads' : 'These spreads are competitive'} in the industry.`
    },
    {
      question: `Does ${broker.name} offer copy trading?`,
      answer: broker.copyTrading
        ? `Yes, ${broker.name} offers copy trading features that allow you to automatically copy the trades of experienced traders.`
        : `No, ${broker.name} does not currently offer copy trading features. You'll need to manually execute your trades.`
    }
  ];

  // Generate how-to steps
  const howToSteps = [
    {
      name: `Visit ${broker.name}'s website`,
      text: `Navigate to ${broker.name}'s official website to begin the account opening process.`
    },
    {
      name: 'Complete the registration form',
      text: 'Fill out the online registration form with your personal details and contact information.'
    },
    {
      name: 'Verify your identity',
      text: 'Submit required identification documents (passport, driver\'s license, or national ID) and proof of address.'
    },
    {
      name: 'Fund your account',
      text: `Make your initial deposit of at least $${broker.accessibility.minDeposit.toLocaleString()} using one of the available payment methods.`
    },
    {
      name: 'Start trading',
      text: 'Download your preferred trading platform and begin trading forex, CFDs, and other available instruments.'
    }
  ];

  // Generate internal links
  const internalLinks = [
    { text: `Compare ${broker.name} with other brokers`, url: '/compare' },
    { text: 'View all regulated brokers', url: '/brokers?filter=regulated' },
    { text: 'Best brokers for beginners', url: '/brokers/best-for-beginners' },
    { text: 'Low spread brokers', url: '/brokers/low-spread' },
    { text: 'ECN brokers', url: '/brokers/ecn' },
    { text: `Read more ${broker.name} reviews`, url: `/broker/${broker.id}#reviews` }
  ];

  // Generate citations
  const citations = [
    {
      text: `${broker.name} Regulatory Information`,
      url: broker.websiteUrl,
      author: broker.name,
      date: new Date().getFullYear().toString()
    },
    {
      text: 'Forex Broker Regulation Guide',
      url: 'https://www.brokeranalysis.com/methodology',
      author: 'BrokerAnalysis Team',
      date: new Date().getFullYear().toString()
    }
  ];

  return (
    <>
      {/* SEO Meta Tags and Structured Data */}
      <SEOContainer
        type="broker"
        title={`${broker.name} Review - ${broker.score}/10 Rating & Analysis`}
        description={`Comprehensive ${broker.name} review: ${broker.description}. Learn about regulation, spreads, platforms, and trading conditions. ${broker.score}/10 rating.`}
        canonicalUrl={canonicalUrl}
        imageUrl={broker.logoUrl}
        data={broker}
        breadcrumbs={[
          { name: 'Home', url: baseUrl },
          { name: 'Brokers', url: `${baseUrl}/brokers` },
          { name: broker.name, url: canonicalUrl }
        ]}
        faqs={faqs}
        keywords={[
          broker.name,
          'forex broker',
          'broker review',
          'online trading',
          'forex trading',
          ...broker.regulation.regulators,
          ...broker.technology.platforms
        ]}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">
                {broker.name} Review {new Date().getFullYear()}
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                {broker.description}
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{broker.score}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  <span>{broker.regulation.regulators.length} Regulators</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  <span>Since {broker.foundingYear}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit {broker.name}
                  </a>
                </Button>
                <Button variant="outline" asChild size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link to="/compare">Compare Brokers</Link>
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img
                src={broker.logoUrl}
                alt={broker.name}
                className="h-32 w-auto bg-white p-4 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generative Engine SEO */}
      <GenerativeEngineSEO
        title={`${broker.name} Review ${new Date().getFullYear()}`}
        description={broker.description}
        content={broker.longDescription || broker.description}
        keyTakeaways={keyTakeaways}
        faqs={faqs}
        howToSteps={howToSteps}
        internalLinks={internalLinks}
        citations={citations}
        canonicalUrl={canonicalUrl}
      />

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Pros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <XCircle className="h-5 w-5" />
              Cons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {cons.map((con, index) => (
                <li key={index} className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Trading Conditions Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trading Conditions at a Glance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {broker.tradingConditions.spreads.eurusd}
              </div>
              <div className="text-sm text-gray-600">EUR/USD Spread</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                ${broker.accessibility.minDeposit.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Minimum Deposit</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {broker.tradingConditions.maxLeverage}
              </div>
              <div className="text-sm text-gray-600">Maximum Leverage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis (if available) */}
      {marketAnalysis && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Market Analysis for {broker.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant={marketAnalysis.sentiment === 'positive' ? 'default' : marketAnalysis.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                {marketAnalysis.sentiment.toUpperCase()} Sentiment
              </Badge>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Trends</h4>
                <div className="flex flex-wrap gap-2">
                  {marketAnalysis.trends.map((trend, index) => (
                    <Badge key={index} variant="outline">{trend}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Market Outlook</h4>
                <p className="text-gray-700">{marketAnalysis.outlook}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Brokers */}
      {relatedBrokers.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Similar Brokers to Consider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedBrokers.slice(0, 3).map(relatedBroker => (
                <div key={relatedBroker.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={relatedBroker.logoUrl}
                      alt={relatedBroker.name}
                      className="h-10 w-auto"
                    />
                    <div>
                      <h3 className="font-semibold">{relatedBroker.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{relatedBroker.score}/10</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/broker/${relatedBroker.id}`}>
                      Read Review
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Indicators */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Why Trust Our {broker.name} Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Regulatory Verification</h4>
                  <p className="text-sm text-gray-600">
                    We verify all regulatory information with official financial authorities
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Real-time Data</h4>
                  <p className="text-sm text-gray-600">
                    Trading conditions updated regularly to reflect current market conditions
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold">User Reviews</h4>
                  <p className="text-sm text-gray-600">
                    {reviews.length} verified trader reviews contribute to our rating
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Independent Testing</h4>
                  <p className="text-sm text-gray-600">
                    Our team tests each broker's platform and services firsthand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BrokerSEOTemplate;