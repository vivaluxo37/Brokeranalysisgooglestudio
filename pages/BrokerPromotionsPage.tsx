import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokers as allBrokers } from '../data/brokers';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Gift, DollarSign, TrendingUp, Star, Shield, Users, Calendar, HelpCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import useMetaDescription from '../hooks/useMetaDescription';
import { Broker } from '../types';
import PromotionCard from '../components/brokers/PromotionCard';
import PromotionFilter from '../components/brokers/PromotionFilter';

interface BrokerPromotion {
  id: string;
  brokerId: string;
  brokerName: string;
  brokerLogo: string;
  brokerScore: number;
  type: 'welcome-bonus' | 'deposit-bonus' | 'no-deposit-bonus' | 'cashback' | 'loyalty-program' | 'trading-competition';
  title: string;
  description: string;
  amount: string;
  validUntil: string;
  minDeposit: number;
  terms: string;
  isExclusive: boolean;
  isPopular: boolean;
  isActive: boolean;
  regulation: string[];
}

// Sample promotion data - in production this would come from your database/API
const samplePromotions: BrokerPromotion[] = [
  {
    id: 'xm-welcome-bonus',
    brokerId: 'xm',
    brokerName: 'XM',
    brokerLogo: '/broker-logos/xm.png',
    brokerScore: 8.5,
    type: 'welcome-bonus',
    title: '50% Welcome Bonus up to $500',
    description: 'Get a 50% bonus on your first deposit up to $500. Trade with extra capital and increase your trading potential.',
    amount: '50% up to $500',
    validUntil: '2024-12-31',
    minDeposit: 5,
    terms: 'Bonus credited automatically, minimum trading volume required',
    isExclusive: false,
    isPopular: true,
    isActive: true,
    regulation: ['ASIC', 'CySEC']
  },
  {
    id: 'fbs-deposit-bonus',
    brokerId: 'fbs',
    brokerName: 'FBS',
    brokerLogo: '/broker-logos/fbs.png',
    brokerScore: 8.2,
    type: 'deposit-bonus',
    title: '100% Deposit Bonus',
    description: 'Double your deposit with a 100% bonus. Perfect for traders looking to maximize their trading capital.',
    amount: '100%',
    validUntil: '2024-11-30',
    minDeposit: 100,
    terms: '30x turnover requirement, bonus available for 90 days',
    isExclusive: false,
    isPopular: true,
    isActive: true,
    regulation: ['CySEC', 'IFSC']
  },
  {
    id: 'ironfx-cashback',
    brokerId: 'ironfx',
    brokerName: 'IronFX',
    brokerLogo: '/broker-logos/ironfx.png',
    brokerScore: 7.8,
    type: 'cashback',
    title: '15% Cashback on All Trades',
    description: 'Receive 15% cashback on all your trades, win or lose. No restrictions on trading strategies.',
    amount: '15%',
    validUntil: '2024-10-31',
    minDeposit: 500,
    terms: 'Cashback calculated daily, paid monthly',
    isExclusive: true,
    isPopular: false,
    isActive: true,
    regulation: ['CySEC']
  },
  {
    id: 'pepperstone-no-deposit',
    brokerId: 'pepperstone',
    brokerName: 'Pepperstone',
    brokerLogo: '/broker-logos/pepperstone.png',
    brokerScore: 9.2,
    type: 'no-deposit-bonus',
    title: '$30 No Deposit Bonus',
    description: 'Start trading without depositing. $30 bonus credited upon account verification.',
    amount: '$30',
    validUntil: '2024-12-15',
    minDeposit: 0,
    terms: 'Verification required, profit withdrawable after 10 lots traded',
    isExclusive: false,
    isPopular: true,
    isActive: true,
    regulation: ['FCA', 'ASIC', 'CySEC']
  }
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'highest-bonus', label: 'Highest Bonus' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'broker-score', label: 'Broker Score' }
];

const BrokerPromotionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showExclusive, setShowExclusive] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // SEO meta description
  const metaDescription = useMetaDescription({
    type: 'category',
    title: 'Forex Broker Promotions',
    keyFeatures: ['welcome bonuses', 'deposit bonuses', 'cashback offers'],
    targetAudience: 'forex traders',
    mainBenefit: 'maximize trading capital with broker bonuses'
  });

  // SEO keywords
  const seoKeywords = [
    'forex broker promotions',
    'trading bonuses',
    'welcome bonus forex',
    'deposit bonus',
    'no deposit bonus',
    'cashback forex',
    'broker offers',
    'trading promotions',
    'forex bonuses',
    'broker deals'
  ];

  const filteredAndSortedPromotions = useMemo(() => {
    let filtered = samplePromotions.filter(promo => {
      if (showActiveOnly && !promo.isActive) return false;
      if (showExclusive && !promo.isExclusive) return false;
      if (selectedType !== 'all' && promo.type !== selectedType) return false;
      if (searchTerm && !promo.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !promo.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

    // Sort promotions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
        case 'highest-bonus':
          const aAmount = parseFloat(a.amount.replace(/[^0-9.]/g, ''));
          const bAmount = parseFloat(b.amount.replace(/[^0-9.]/g, ''));
          return bAmount - aAmount;
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        case 'broker-score':
          return b.brokerScore - a.brokerScore;
        case 'newest':
        default:
          return 0; // For demo purposes
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedType, sortBy, showExclusive, showActiveOnly]);

  const hasActiveFilters = searchTerm || selectedType !== 'all' || showExclusive || !showActiveOnly;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Forex Broker Promotions & Bonuses",
    "description": metaDescription,
    "url": "https://brokeranalysis.com/brokers/promotions",
    "mainEntity": filteredAndSortedPromotions.map(promo => ({
      "@type": "Offer",
      "name": promo.title,
      "description": promo.description,
      "provider": {
        "@type": "Organization",
        "name": promo.brokerName,
        "logo": promo.brokerLogo
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": promo.minDeposit,
        "priceCurrency": "USD"
      },
      "availability": promo.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "validFrom": new Date().toISOString(),
      "validThrough": promo.validUntil,
      "itemOffered": {
        "@type": "Service",
        "name": "Trading Bonus",
        "description": `${promo.type} promotion for forex traders`
      }
    })),
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://brokeranalysis.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Brokers",
          "item": "https://brokeranalysis.com/brokers"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Promotions",
          "item": "https://brokeranalysis.com/brokers/promotions"
        }
      ]
    }
  };

  // FAQ structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are forex broker promotions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Forex broker promotions are special offers provided by brokers to attract new traders or reward existing clients. These include welcome bonuses, deposit bonuses, no-deposit bonuses, cashback offers, and loyalty programs."
        }
      },
      {
        "@type": "Question",
        "name": "Are forex broker bonuses worth it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Forex broker bonuses can provide extra trading capital, but it's essential to read the terms and conditions. Look for reasonable turnover requirements, realistic expiry dates, and bonuses from regulated brokers."
        }
      },
      {
        "@type": "Question",
        "name": "How do forex broker welcome bonuses work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Welcome bonuses are offered to new clients on their first deposit. The broker typically matches a percentage of your deposit up to a maximum amount. You'll need to meet trading volume requirements before withdrawing the bonus."
        }
      },
      {
        "@type": "Question",
        "name": "What should I look for in forex broker promotions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Key factors include: broker regulation and reputation, realistic turnover requirements, reasonable expiry dates, minimum deposit amounts, withdrawal conditions, and whether the bonus suits your trading style and volume."
        }
      },
      {
        "@type": "Question",
        "name": "Can I withdraw forex broker bonuses immediately?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most forex broker bonuses cannot be withdrawn immediately. You'll need to meet specific trading volume requirements, which vary by broker. Always check the terms and conditions before accepting any bonus offer."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Current Forex Broker Promotions & Bonuses"
        description={metaDescription}
        canonicalUrl="https://brokeranalysis.com/brokers/promotions"
        imageUrl="https://brokeranalysis.com/images/forex-promotions-social.jpg"
        type="website"
        keywords={seoKeywords}
        locale="en_US"
        breadcrumbs={[
          { name: "Home", url: "https://brokeranalysis.com" },
          { name: "Brokers", url: "https://brokeranalysis.com/brokers" },
          { name: "Promotions", url: "https://brokeranalysis.com/brokers/promotions" }
        ]}
      />
      <JsonLdSchema data={structuredData} />
      <JsonLdSchema data={faqStructuredData} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Current Forex Broker Promotions & Bonuses</h1>
            <p className="text-xl mb-6">Discover the best trading offers from regulated brokers worldwide</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                <span>{filteredAndSortedPromotions.length} Active Promotions</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <span>Up to $500 Bonus</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Regulated Brokers Only</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span>Updated Daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-card border-b py-6">
        <div className="container mx-auto px-4">
          <PromotionFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showExclusive={showExclusive}
            onExclusiveChange={setShowExclusive}
            showActiveOnly={showActiveOnly}
            onActiveOnlyChange={setShowActiveOnly}
            totalResults={filteredAndSortedPromotions.length}
            onClearFilters={() => {
              setSearchTerm('');
              setSelectedType('all');
              setShowExclusive(false);
              setShowActiveOnly(true);
              setSortBy('popular');
            }}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPromotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                {...promotion}
              />
            ))}
          </div>

          {filteredAndSortedPromotions.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No promotions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new offers.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">About Forex Broker Promotions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Types of Bonuses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Welcome Bonus:</strong> Offered to new clients on their first deposit</li>
                    <li><strong>Deposit Bonus:</strong> Additional funds added when you deposit</li>
                    <li><strong>No Deposit Bonus:</strong> Free bonus without requiring a deposit</li>
                    <li><strong>Cashback:</strong> Rebate on trading volume or losses</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Important Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>Always read terms and conditions carefully</li>
                    <li>Check turnover requirements before withdrawing</li>
                    <li>Verify broker regulation and reputation</li>
                    <li>Understand bonus expiration dates</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <HelpCircle className="h-8 w-8 text-primary-600" />
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              </div>
              <p className="text-muted-foreground">Everything you need to know about forex broker promotions</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HelpCircle className="h-5 w-5" />
                    What are forex broker promotions?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Forex broker promotions are special offers provided by brokers to attract new traders or reward existing clients. These include welcome bonuses, deposit bonuses, no-deposit bonuses, cashback offers, and loyalty programs designed to provide additional trading capital or reduce trading costs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HelpCircle className="h-5 w-5" />
                    Are forex broker bonuses worth it?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Forex broker bonuses can provide extra trading capital, but it's essential to read the terms and conditions. Look for reasonable turnover requirements, realistic expiry dates, and bonuses from regulated brokers. Consider whether the bonus structure aligns with your trading style and volume.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HelpCircle className="h-5 w-5" />
                    How do forex broker welcome bonuses work?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Welcome bonuses are offered to new clients on their first deposit. The broker typically matches a percentage of your deposit up to a maximum amount. You'll need to meet trading volume requirements before withdrawing the bonus. For example, a 50% bonus up to $500 means depositing $1,000 gives you $500 in bonus funds.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HelpCircle className="h-5 w-5" />
                    What should I look for in forex broker promotions?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Key factors include: broker regulation and reputation, realistic turnover requirements, reasonable expiry dates, minimum deposit amounts, withdrawal conditions, and whether the bonus suits your trading style and volume. Always prioritize regulated brokers and understand that larger bonuses often come with stricter conditions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HelpCircle className="h-5 w-5" />
                    Can I withdraw forex broker bonuses immediately?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Most forex broker bonuses cannot be withdrawn immediately. You'll need to meet specific trading volume requirements, which vary by broker. Always check the terms and conditions before accepting any bonus offer. Some brokers may allow you to decline the bonus if you prefer more flexible withdrawal terms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrokerPromotionsPage;