import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brokers } from '../data/brokers';
import NotFoundPage from './NotFoundPage';
import { Button } from '../components/ui/button';
import { useComparison } from '../hooks/useComparison';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { Icons } from '../constants';
import StarRating from '../components/ui/StarRating';
import StarRatingInput from '../components/ui/StarRatingInput';
import { Review, DiscussionPost } from '../types';
import ReviewCard from '../components/brokers/ReviewCard';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { getReviewSummary, ReviewSummary, getRegulatoryTrustScore, TrustScore } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import BrokerCharts from '../components/brokers/BrokerCharts';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useReviews } from '../hooks/useReviews';
import Tooltip from '../components/ui/Tooltip';
import RiskProfileCard from '../components/brokers/RiskProfileCard';
import ReportBrokerModal from '../components/brokers/ReportBrokerModal';
import { Input } from '../components/ui/input';
import DiscussionPostCard from '../components/brokers/DiscussionPostCard';
import AIAlternatives from '../components/brokers/AIAlternatives';
import { useLanguage } from '../contexts/LanguageContext';

// New components for Interactive Brokers enhancement
import FeeComparisonTable from '../components/brokers/FeeComparisonTable';
import PlatformFeatureMatrix from '../components/brokers/PlatformFeatureMatrix';
import InterestRateCalculator from '../components/brokers/InterestRateCalculator';
import SafetyRegulationSection from '../components/brokers/SafetyRegulationSection';
import AccountOpeningGuide from '../components/brokers/AccountOpeningGuide';
import ProductSelectionEnhanced from '../components/brokers/ProductSelectionEnhanced';
import EducationalResources from '../components/brokers/EducationalResources';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  TrendingUp,
  Shield,
  Calculator,
  Users,
  Star,
  Award,
  Globe,
  Settings,
  Smartphone,
  Monitor,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// SEO Components Integration
import { SEOProvider, useSEO } from '../contexts/SEOContext';
import GEOMultilingualSEO from '../components/seo/GEOMultilingualSEO';

// Enhanced responsive key-value tables with mobile-first approach
const DetailTable: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="md:table w-full text-sm md:text-left border-separate md:border-spacing-0">
    <div className="md:table-row-group">{children}</div>
  </div>
);

// Enhanced DetailRow with improved mobile layout
const DetailRow: React.FC<{ label: string; children: React.ReactNode; helpText?: string }> = ({ label, children, helpText }) => (
  <div className="md:table-row flex flex-col space-y-1 md:space-y-0 md:flex-none py-3 md:py-0 border-b border-input last:border-b-0 md:border-b">
    <div className="md:table-cell px-3 pt-3 md:p-3 font-semibold text-card-foreground/80 align-top md:w-1/3">
      <div className="flex items-start gap-1 md:items-center">
        <span className="text-sm md:text-base">{label}</span>
        {helpText && (
          <Tooltip content={helpText}>
            <span className="text-foreground/50 cursor-help mt-0.5 md:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </span>
          </Tooltip>
        )}
      </div>
    </div>
    <div className="md:table-cell px-3 pb-3 md:p-3 align-top md:w-2/3 text-sm md:text-base">{children}</div>
  </div>
);

const BrokerDetailPage: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const { user } = useAuth();
  const { favoritesList, addBrokerToFavorites, removeBrokerFromFavorites } = useFavorites();
  const { comparisonList, addBrokerToComparison, removeBrokerFromComparison } = useComparison();
  const { reviews, addReview } = useReviews();
  const { currentLanguage } = useLanguage();
  const { generateHreflangTags, generateCanonicalUrl, optimizeImagesForSEO } = useSEO();

  const [broker, setBroker] = useState(brokers.find(b => b.id === brokerId));
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isLoadingReviewSummary, setIsLoadingReviewSummary] = useState(false);
  const [isLoadingTrustScore, setIsLoadingTrustScore] = useState(false);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [newDiscussionPost, setNewDiscussionPost] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const isFavorite = useMemo(() => favoritesList && favoritesList.includes(brokerId), [favoritesList, brokerId]);
  const isInComparison = useMemo(() => comparisonList && comparisonList.includes(brokerId), [comparisonList, brokerId]);
  
  // Calculate overall rating from individual ratings
  const overallRating = useMemo(() => {
    if (!broker.ratings) return 4.5; // Default rating
    const { regulation, costs, platforms, support } = broker.ratings;
    return parseFloat(((regulation + costs + platforms + support) / 4).toFixed(1));
  }, [broker.ratings]);

  useEffect(() => {
    if (broker) {
      // Generate review summary and trust score
      const fetchReviewSummary = async () => {
        setIsLoadingReviewSummary(true);
        try {
          const summary = await getReviewSummary(broker.name, reviews.filter(r => r.brokerId === broker.id));
          setReviewSummary(summary);
        } catch (error) {
          console.error('Error fetching review summary:', error);
        } finally {
          setIsLoadingReviewSummary(false);
        }
      };

      const fetchTrustScore = async () => {
        setIsLoadingTrustScore(true);
        try {
          const score = await getRegulatoryTrustScore(broker.name, broker.regulation.regulators);
          setTrustScore(score);
        } catch (error) {
          console.error('Error fetching trust score:', error);
        } finally {
          setIsLoadingTrustScore(false);
        }
      };

      fetchReviewSummary();
      fetchTrustScore();
    }
  }, [broker]);

  if (!broker) {
    return <NotFoundPage />;
  }

  // SEO Data Generation
  const brokerSEODescription = `Read our comprehensive ${broker.name} review for ${new Date().getFullYear()}. Learn about spreads, commissions, regulation, platforms, and user experiences. Is ${broker.name} the right forex broker for you?`;

  const brokerSEOKeywords = [
    broker.name,
    `${broker.name} review`,
    `${broker.name} forex broker`,
    `${broker.name} trading`,
    `${broker.name} spreads`,
    `${broker.name} commission`,
    `forex broker review`,
    `online trading`,
    `currency trading`,
    `CFD trading`,
    ...broker.regulation.regulators.map(reg => `${reg} regulated broker`)
  ];

  const brokerFAQs = [
    {
      question: `Is ${broker.name} a regulated forex broker?`,
      answer: `Yes, ${broker.name} is regulated by ${broker.regulation.regulators.join(', ')}, ensuring trader protection and fund safety.`
    },
    {
      question: `What trading platforms does ${broker.name} offer?`,
      answer: `${broker.name} offers ${broker.technology.platforms.join(', ')} for trading forex, CFDs, and other instruments.`
    },
    {
      question: `What are the spreads at ${broker.name}?`,
      answer: `${broker.name} offers spreads starting from ${broker.tradingConditions.spreads.eurusd} pips on EUR/USD, with ${broker.fees.trading.spreadType === 'Fixed' ? 'fixed' : 'variable'} spreads.`
    },
    {
      question: `What is the minimum deposit at ${broker.name}?`,
      answer: `The minimum deposit at ${broker.name} is $${broker.accessibility.minDeposit}, making it accessible for most traders.`
    }
  ];

  const brokerKeyTakeaways = [
    `${broker.name} is a ${broker.fees.trading.spreadType === 'Fixed' ? 'fixed' : 'variable'} spread broker with spreads from ${broker.tradingConditions.spreads.eurusd} pips`,
    `Regulated by ${broker.regulation.regulators.join(', ')} for maximum trader protection`,
    `Minimum deposit of $${broker.accessibility.minDeposit} with leverage up to 1:${broker.tradingConditions.maxLeverage}`,
    `Offers ${broker.technology.platforms.join(', ')} trading platforms`,
    `${broker.coreInfo.demoAccount ? 'Free demo account available for practice trading' : 'No demo account available'}`
  ];

  const brokerHowToSteps = [
    {
      name: 'Open Account',
      text: `Visit ${broker.name} website and complete the registration form with your personal details.`
    },
    {
      name: 'Verify Identity',
      text: 'Submit required documents (passport, utility bill) for account verification and regulatory compliance.'
    },
    {
      name: 'Fund Account',
      text: `Deposit minimum $${broker.accessibility.minDeposit} using available payment methods (bank wire, credit card, e-wallets).`
    },
    {
      name: 'Download Platform',
      text: `Download and install ${broker.technology.platforms[0]} or use web trader for instant access.`
    },
    {
      name: 'Start Trading',
      text: 'Begin trading with your preferred instruments using the available leverage and risk management tools.'
    }
  ];

  const geoTargeting = {
    country: 'US',
    region: 'North America',
    city: 'New York'
  };

  const translations = {
    es: {
      title: `Revisión de ${broker.name} - Broker de Forex`,
      description: `Lee nuestra revisión completa de ${broker.name}. Aprende sobre spreads, comisiones, regulación y plataformas.`,
      keywords: brokerSEOKeywords.filter(k => k.includes(broker.name))
    },
    fr: {
      title: `Avis ${broker.name} - Courtier Forex`,
      description: `Lisez notre avis complet sur ${broker.name}. Découvrez les spreads, commissions, réglementation et plateformes.`,
      keywords: brokerSEOKeywords.filter(k => k.includes(broker.name))
    },
    de: {
      title: `${broker.name} Bewertung - Forex Broker`,
      description: `Lesen Sie unsere umfassende ${broker.name} Bewertung. Erfahren Sie mehr über Spreads, Kommissionen und Regulierung.`,
      keywords: brokerSEOKeywords.filter(k => k.includes(broker.name))
    }
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const imageUrl = broker.logoUrl || 'https://brokeranalysis.com/images/broker-default.jpg';

  return (
    <>
      {/* GEO & Multilingual SEO */}
      <GEOMultilingualSEO
        title={`${broker.name} Review - ${new Date().getFullYear()} Forex Broker Analysis`}
        description={brokerSEODescription}
        keywords={brokerSEOKeywords}
        imageUrl={imageUrl}
        geoTargeting={geoTargeting}
        translations={translations}
      />

      {/* Enhanced Meta Tags */}
      <MetaTags
        title={`${broker.name} Review - ${new Date().getFullYear()} Forex Broker Analysis`}
        description={brokerSEODescription}
        canonicalUrl={generateCanonicalUrl(`/broker/${broker.id}`)}
        imageUrl={imageUrl}
        type="article"
        keywords={brokerSEOKeywords}
        openGraph={{
          title: `${broker.name} Review ${new Date().getFullYear()} - Comprehensive Trading Platform Analysis`,
          description: brokerSEODescription,
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: `${broker.name} Trading Platform Review`
            }
          ],
          type: 'article',
          publishedTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          authors: ['BrokerAnalysis'],
          tags: brokerSEOKeywords,
          section: 'Broker Reviews'
        }}
        twitter={{
          card: 'summary_large_image',
          site: '@BrokerAnalysis',
          creator: '@BrokerAnalysis',
          title: `${broker.name} Review ${new Date().getFullYear()} | Trading Platform Analysis`,
          description: brokerSEODescription,
          image: imageUrl,
          imageAlt: `${broker.name} Trading Platform`
        }}
        additionalMeta={[
          {
            name: 'robots',
            content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
          },
          {
            name: 'googlebot',
            content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
          },
          {
            name: 'bingbot',
            content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
          },
          {
            name: 'article:published_time',
            content: new Date().toISOString()
          },
          {
            name: 'article:modified_time',
            content: new Date().toISOString()
          },
          {
            name: 'article:author',
            content: 'BrokerAnalysis Team'
          },
          {
            name: 'article:section',
            content: 'Broker Reviews'
          },
          {
            name: 'geo.region',
            content: 'US'
          },
          {
            name: 'geo.placename',
            content: 'United States'
          },
          {
            name: 'language',
            content: currentLanguage || 'en'
          }
        ]}
      />

      {/* Enhanced Structured Data */}
      <JsonLdSchema
        data={{
          '@context': 'https://schema.org',
          '@type': 'FinancialService',
          name: broker.name,
          description: brokerSEODescription,
          url: pageUrl,
          logo: imageUrl,
          image: imageUrl,
          address: {
            '@type': 'PostalAddress',
            streetAddress: broker.headquarters?.split(',')[0] || '',
            addressLocality: broker.headquarters?.split(',')[1] || '',
            addressCountry: 'United States'
          },
          foundingDate: broker.foundingYear?.toString(),
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: overallRating.toString(),
            reviewCount: reviews.filter(r => r.brokerId === broker.id).length.toString(),
            bestRating: '5'
          },
          offers: {
            '@type': 'Offer',
            price: broker.accessibility.minDeposit?.toString(),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          serviceType: [
            'Online Trading',
            'Forex Trading',
            'CFD Trading',
            'Stock Trading',
            'Options Trading',
            'Futures Trading',
            'Cryptocurrency Trading'
          ],
          areaServed: 'Worldwide',
          availableLanguage: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '00:00',
              closes: '23:59'
            }
          }
        }}
      />

      {/* Review Structured Data */}
      <JsonLdSchema
        data={{
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'FinancialService',
            name: broker.name,
            image: imageUrl,
            address: broker.headquarters
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: overallRating.toString(),
            bestRating: '5'
          },
          author: {
            '@type': 'Organization',
            name: 'BrokerAnalysis',
            url: 'https://brokeranalysis.com'
          },
          datePublished: new Date().toISOString(),
          description: brokerSEODescription,
          reviewBody: `Comprehensive review of ${broker.name} covering trading platforms, fees, regulation, and overall broker performance for ${new Date().getFullYear()}.`
        }}
      />

      {/* FAQ Structured Data */}
      <JsonLdSchema
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: brokerFAQs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        }}
      />

      {/* HowTo Structured Data */}
      <JsonLdSchema
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to Open an Account with ${broker.name}`,
          description: `Step-by-step guide to opening a trading account with ${broker.name}`,
          totalTime: 'PT30M',
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: broker.accessibility.minDeposit?.toString()
          },
          step: brokerHowToSteps.map((step, index) => ({
            '@type': 'HowToStep',
            name: step.name,
            text: step.text,
            url: `${pageUrl}#step-${index + 1}`
          }))
        }}
      />

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Enhanced Broker Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <img
                      src={broker.logoUrl}
                      alt={`${broker.name} logo`}
                      className="w-12 h-12 md:w-16 md:h-16 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://brokeranalysis.com/images/broker-default.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl md:text-3xl font-bold leading-tight">{broker.name} Review {new Date().getFullYear()}</h1>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={star <= Math.round(overallRating) ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={star <= Math.round(overallRating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {overallRating.toFixed(1)} out of 5
                          </span>
                        </div>
                        {trustScore && (
                          <Badge className="bg-green-600 text-white text-xs">
                            Trust Score: {trustScore.score}/10
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <TrendingUp className="w-3 h-3" />
                          {broker.score || '9.3'}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={isFavorite ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => isFavorite ? removeBrokerFromFavorites(broker.id) : addBrokerToFavorites(broker.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 mr-1 ${isFavorite ? 'text-red-500 fill-current' : ''}`}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      <span className="hidden sm:inline">{isFavorite ? 'Remove' : 'Add to Favorites'}</span>
                      <span className="sm:hidden">{isFavorite ? 'Remove' : 'Favorite'}</span>
                    </Button>
                    <Button
                      variant={isInComparison ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => isInComparison ? removeBrokerFromComparison(broker.id) : addBrokerToComparison(broker.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                      <span className="hidden sm:inline">{isInComparison ? 'Remove' : 'Compare'}</span>
                      <span className="sm:hidden">{isInComparison ? 'Remove' : 'Compare'}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {brokerSEODescription}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                  <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">1978</div>
                    <div className="text-xs md:text-xs text-blue-700">Founded</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-green-600">150+</div>
                    <div className="text-xs md:text-xs text-green-700">Markets</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-purple-600">$0</div>
                    <div className="text-xs md:text-xs text-purple-700">Min Deposit</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-orange-600">24/5</div>
                    <div className="text-xs md:text-xs text-orange-700">Support</div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="flex flex-wrap gap-2">
                  {broker.pros?.slice(0, 4).map((pro, index) => (
                    <Badge key={`pros-${index}-${pro.slice(0, 10)}`} variant="secondary" className="text-xs">
                      {pro}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

  
            {/* Enhanced Content Sections */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 lg:grid-cols-8 gap-1 h-auto p-1">
                <TabsTrigger value="overview" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Overview</span>
                  <span className="md:hidden">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="fees" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Fees</span>
                  <span className="md:hidden">Fees</span>
                </TabsTrigger>
                <TabsTrigger value="platforms" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Platforms</span>
                  <span className="md:hidden">Platforms</span>
                </TabsTrigger>
                <TabsTrigger value="safety" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Safety</span>
                  <span className="md:hidden">Safety</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Account</span>
                  <span className="md:hidden">Account</span>
                </TabsTrigger>
                <TabsTrigger value="interest" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Interest</span>
                  <span className="md:hidden">Interest</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Products</span>
                  <span className="md:hidden">Products</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="text-xs md:text-sm py-2 px-1 md:px-3">
                  <span className="hidden md:inline">Education</span>
                  <span className="md:hidden">Education</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Trading Conditions */}
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold">Trading Conditions</h2>
                  </CardHeader>
                  <CardContent>
                    <DetailTable>
                      <DetailRow label="Spreads (EUR/USD)" helpText="Typical spread on EUR/USD currency pair">
                        <span className="font-medium">{broker.tradingConditions.spreads.eurusd} pips</span>
                      </DetailRow>
                      <DetailRow label="Spread Type">
                        <span className="font-medium capitalize">{broker.fees.trading.spreadType}</span>
                      </DetailRow>
                      <DetailRow label="Commission" helpText="Per standard lot (100,000 units)">
                        <span className="font-medium">{broker.tradingConditions.commission}</span>
                      </DetailRow>
                      <DetailRow label="Leverage" helpText="Maximum leverage offered">
                        <span className="font-medium">1:{broker.tradingConditions.maxLeverage}</span>
                      </DetailRow>
                      <DetailRow label="Minimum Deposit">
                        <span className="font-medium">${broker.accessibility.minDeposit}</span>
                      </DetailRow>
                    </DetailTable>
                  </CardContent>
                </Card>

                {/* Why Choose Interactive Brokers */}
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold">Why Choose Interactive Brokers</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-green-700 mb-3">Key Advantages</h3>
                        <ul className="space-y-2 text-sm">
                          {broker.pros?.map((pro, index) => (
                            <li key={`pros-list-${index}-${pro.slice(0, 10)}`} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-700 mb-3">Considerations</h3>
                        <ul className="space-y-2 text-sm">
                          {broker.cons?.map((con, index) => (
                            <li key={`cons-list-${index}-${con.slice(0, 10)}`} className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fees" className="space-y-6">
                <FeeComparisonTable />
              </TabsContent>

              <TabsContent value="platforms" className="space-y-6">
                <PlatformFeatureMatrix />
              </TabsContent>

              <TabsContent value="safety" className="space-y-6">
                <SafetyRegulationSection />
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <AccountOpeningGuide />
              </TabsContent>

              <TabsContent value="interest" className="space-y-6">
                <InterestRateCalculator />
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <ProductSelectionEnhanced />
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <EducationalResources />
              </TabsContent>
            </Tabs>

            {/* Rating Summary */}
            {broker.ratings && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Rating Summary</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{overallRating.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Overall Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{trustScore?.score || '8.5'}/10</div>
                      <div className="text-sm text-muted-foreground">Trust Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{reviews.length}</div>
                      <div className="text-sm text-muted-foreground">User Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{broker.tradingConditions.spreads.eurusd}</div>
                      <div className="text-sm text-muted-foreground">EUR/USD Spreads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charts */}
            <BrokerCharts broker={broker} />

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">User Reviews</h2>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="mb-6 p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Write a Review</h3>
                    <div className="space-y-3">
                      <StarRatingInput
                        rating={newReview.rating}
                        value={newReview.rating}
                        onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                      />
                      <Input
                        placeholder="Share your experience with this broker..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      />
                      <Button
                        onClick={() => {
                          if (newReview.comment.trim()) {
                            addReview({
                              brokerId: broker.id,
                              userId: user.id,
                              userName: user.name || 'Anonymous',
                              rating: newReview.rating,
                              comment: newReview.comment,
                              date: new Date().toISOString(),
                              verified: true
                            });
                            setNewReview({ rating: 5, comment: '' });
                          }
                        }}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                )}

                {reviews.filter(review => review.brokerId === broker.id).length > 0 ? (
                  <div className="space-y-4">
                    {reviews
                      .filter(review => review.brokerId === broker.id)
                      .map(review => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this broker!</p>
                )}
              </CardContent>
            </Card>

            {/* AI Alternatives */}
            <AIAlternatives />

            {/* Discussion Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Community Discussion</h2>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="mb-4">
                    <textarea
                      className="w-full p-3 border rounded-md"
                      rows={3}
                      placeholder="Ask a question or share your thoughts about this broker..."
                      value={newDiscussionPost}
                      onChange={(e) => setNewDiscussionPost(e.target.value)}
                    />
                    <Button className="mt-2" onClick={() => {
                      if (newDiscussionPost.trim()) {
                        setDiscussionPosts(prev => [...prev, {
                          id: Date.now().toString(),
                          topicId: broker.id,
                          userId: user.id,
                          userName: user.name || 'Anonymous',
                          title: 'Question about ' + broker.name,
                          content: newDiscussionPost,
                          date: new Date().toISOString(),
                          upvotes: 0,
                          replies: []
                        }]);
                        setNewDiscussionPost('');
                      }
                    }}>
                      Post Comment
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link> to participate in the discussion.
                  </p>
                )}

                <div className="space-y-4">
                  {discussionPosts.map(post => (
                    <DiscussionPostCard key={post.id} post={post} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => window.open(broker.websiteUrl, '_blank')}>
                  Visit Website
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowReportModal(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1M4 22s1-1 4-1 5 2 8 2 4-1 4-1M4 2s1-1 4-1 5 2 8 2 4-1 4-1M4 9s1-1 4-1 5 2 8 2 4-1 4-1"/></svg>
                  Report Broker
                </Button>
              </CardContent>
            </Card>

            {/* Risk Profile */}
            <RiskProfileCard broker={broker} />

            {/* Regulation Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Regulation</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {broker.regulation.regulators.map((regulator, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icons.shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{regulator}</span>
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground mt-2">
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Contact Information</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-medium">Headquarters</div>
                    <div className="text-muted-foreground">{broker.headquarters}</div>
                  </div>
                  <div>
                    <div className="font-medium">Founded</div>
                    <div className="text-muted-foreground">{broker.foundingYear}</div>
                  </div>
                  <div>
                    <div className="font-medium">Support</div>
                    <div className="text-muted-foreground">24/7</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportBrokerModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
};

export default BrokerDetailPage;