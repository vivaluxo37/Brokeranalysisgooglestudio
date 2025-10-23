import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brokers } from '../data/brokers';
import NotFoundPage from './NotFoundPage';
import { Button } from '../components/ui/Button';
import { useComparison } from '../hooks/useComparison';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { Icons } from '../constants';
import StarRating from '../components/ui/StarRating';
import StarRatingInput from '../components/ui/StarRatingInput';
import { Review, DiscussionPost } from '../types';
import ReviewCard from '../components/brokers/ReviewCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getReviewSummary, ReviewSummary, getRegulatoryTrustScore, TrustScore } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import BrokerCharts from '../components/brokers/BrokerCharts';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useReviews } from '../hooks/useReviews';
import Tooltip from '../components/ui/Tooltip';
import RiskProfileCard from '../components/brokers/RiskProfileCard';
import ReportBrokerModal from '../components/brokers/ReportBrokerModal';
import { Input } from '../components/ui/Input';
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
  AlertCircle,
  Heart,
  BarChart3,
  ExternalLink,
  Clock,
  DollarSign,
  Code
} from 'lucide-react';

// SEO Components Integration
import { SEOProvider, useSEO } from '../contexts/SEOContext';
import GEOMultilingualSEO from '../components/seo/GEOMultilingualSEO';

// Professional Design System
import { designSystem, getRatingColor, formatCurrency, formatNumber } from '../constants/designSystem';
import { brokerValidator } from '../utils/brokerDataValidator';
import { brokerUpdateService as updateService } from '../services/brokerDataUpdateService';

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

  const [rawBroker] = useState(brokers.find(b => b.id === brokerId));
  const [broker, setBroker] = useState<typeof rawBroker | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isLoadingReviewSummary, setIsLoadingReviewSummary] = useState(false);
  const [isLoadingTrustScore, setIsLoadingTrustScore] = useState(false);
  const [isLoadingBrokerData, setIsLoadingBrokerData] = useState(true);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [newDiscussionPost, setNewDiscussionPost] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const validationPerformed = useRef(false);

  // All hooks must be called at the top level - no conditional hook calls!
  const isFavorite = useMemo(() => favoritesList && favoritesList.includes(brokerId || ''), [favoritesList, brokerId]);
  const isInComparison = useMemo(() => comparisonList && comparisonList.includes(brokerId || ''), [comparisonList, brokerId]);
  
  // Calculate overall rating from individual ratings
  const overallRating = useMemo(() => {
    if (!broker?.ratings) return 4.5; // Default rating
    const { regulation, costs, platforms, support } = broker.ratings;
    return parseFloat(((regulation + costs + platforms + support) / 4).toFixed(1));
  }, [broker?.ratings]);

  // Get enhanced broker statistics (memoized)
  const brokerStats = useMemo(() => {
    return broker ? brokerValidator.getEnhancedStats(broker) : {
      founded: new Date().getFullYear() - 10,
      yearsInBusiness: 10,
      marketsAvailable: 100,
      minDeposit: 100,
      supportHours: '24/5',
      regulatoryScore: 7.5,
      platformsCount: 1,
      spreadFrom: 1.0
    };
  }, [broker?.id, broker?.foundingYear, broker?.accessibility?.minDeposit, broker?.regulation?.regulators]);

  // SEO Data Generation (memoized)
  const brokerSEODescription = useMemo(
    () => broker ? `Read our comprehensive ${broker.name} review for ${new Date().getFullYear()}. Learn about spreads, commissions, regulation, platforms, and user experiences. Is ${broker.name} the right forex broker for you?` : '',
    [broker?.name]
  );

  const brokerSEOKeywords = useMemo(() => {
    if (!broker) return [];
    return [
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
      ...(broker.regulation?.regulators || []).map(reg => `${reg} regulated broker`)
    ];
  }, [broker?.name, broker?.regulation?.regulators]);

  const brokerFAQs = useMemo(() => {
    if (!broker) return [];
    return [
      {
        question: `Is ${broker.name} a regulated forex broker?`,
        answer: `Yes, ${broker.name} is regulated by ${(broker.regulation?.regulators || []).join(', ')}, ensuring trader protection and fund safety.`
      },
      {
        question: `What trading platforms does ${broker.name} offer?`,
        answer: `${broker.name} offers ${(broker.technology?.platforms || ['Web Platform']).join(', ')} for trading forex, CFDs, and other instruments.`
      },
      {
        question: `What are the spreads at ${broker.name}?`,
        answer: `${broker.name} offers spreads starting from ${broker.tradingConditions?.spreads?.eurusd || '1.0'} pips on EUR/USD, with ${broker.fees?.trading?.spreadType === 'Fixed' ? 'fixed' : 'variable'} spreads.`
      },
      {
        question: `What is the minimum deposit at ${broker.name}?`,
        answer: `The minimum deposit at ${broker.name} is $${broker.accessibility?.minDeposit || 100}, making it accessible for most traders.`
      }
    ];
  }, [broker?.name, broker?.regulation?.regulators, broker?.technology?.platforms, broker?.tradingConditions?.spreads?.eurusd, broker?.fees?.trading?.spreadType, broker?.accessibility?.minDeposit]);

  const brokerKeyTakeaways = useMemo(() => {
    if (!broker) return [];
    return [
      `${broker.name} is a ${broker.fees?.trading?.spreadType === 'Fixed' ? 'fixed' : 'variable'} spread broker with spreads from ${broker.tradingConditions?.spreads?.eurusd || '1.0'} pips`,
      `Regulated by ${(broker.regulation?.regulators || []).join(', ')} for maximum trader protection`,
      `Minimum deposit of $${broker.accessibility?.minDeposit || 100} with leverage up to ${broker.tradingConditions?.maxLeverage || '1:100'}`,
      `Offers ${(broker.technology?.platforms || ['Web Platform']).join(', ')} trading platforms`,
      `${broker.coreInfo?.demoAccount ? 'Free demo account available for practice trading' : 'No demo account available'}`
    ];
  }, [broker?.name, broker?.fees?.trading?.spreadType, broker?.tradingConditions?.spreads?.eurusd, broker?.regulation?.regulators, broker?.accessibility?.minDeposit, broker?.tradingConditions?.maxLeverage, broker?.technology?.platforms, broker?.coreInfo?.demoAccount]);

  const brokerHowToSteps = useMemo(() => {
    if (!broker) return [];
    return [
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
        text: `Deposit minimum $${broker.accessibility?.minDeposit || 100} using available payment methods (bank wire, credit card, e-wallets).`
      },
      {
        name: 'Download Platform',
        text: `Download and install ${(broker.technology?.platforms || ['Web Platform'])[0]} or use web trader for instant access.`
      },
      {
        name: 'Start Trading',
        text: 'Begin trading with your preferred instruments using the available leverage and risk management tools.'
      }
    ];
  }, [broker?.name, broker?.accessibility?.minDeposit, broker?.technology?.platforms]);

  const translations = useMemo(() => {
    if (!broker) return {};
    return {
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
  }, [broker?.name, brokerSEOKeywords]);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const imageUrl = broker?.logoUrl || 'https://brokeranalysis.com/images/broker-default.jpg';

  // Enhanced broker data loading with validation and updates
  useEffect(() => {
    const loadAndValidateBrokerData = async () => {
      if (!rawBroker || validationPerformed.current) {
        setIsLoadingBrokerData(false);
        return;
      }

      setIsLoadingBrokerData(true);
      validationPerformed.current = true;
      
      try {
        // Validate and enhance broker data
        const validationResult = brokerValidator.validateBroker(rawBroker);
        const enhancedBroker = validationResult.updatedBroker;
        
        // Log validation warnings for development (only once)
        if (validationResult.warnings.length > 0) {
          console.warn(`Broker validation warnings for ${rawBroker.name}:`, validationResult.warnings);
        }
        
        // Background update disabled to prevent infinite reloading
        // TODO: Implement background updates with proper state management
        // updateService.updateBrokerData(enhancedBroker)
        
        setBroker(enhancedBroker);
      } catch (error) {
        console.error('Error processing broker data:', error);
        setBroker(rawBroker); // Fallback to original data
      } finally {
        setIsLoadingBrokerData(false);
      }
    };

    loadAndValidateBrokerData();
  }, [rawBroker]);

  useEffect(() => {
    if (broker && !reviewSummary && !isLoadingReviewSummary) {
      // Generate review summary only once
      const fetchReviewSummary = async () => {
        setIsLoadingReviewSummary(true);
        try {
          const brokerReviews = reviews.filter(r => r.brokerId === broker.id);
          const summary = await getReviewSummary(broker.name, brokerReviews);
          setReviewSummary(summary);
        } catch (error) {
          console.error('Error fetching review summary:', error);
        } finally {
          setIsLoadingReviewSummary(false);
        }
      };

      fetchReviewSummary();
    }
  }, [broker?.id, reviewSummary, isLoadingReviewSummary, reviews.length]);

  useEffect(() => {
    if (broker && !trustScore && !isLoadingTrustScore) {
      // Generate trust score only once
      const fetchTrustScore = async () => {
        setIsLoadingTrustScore(true);
        try {
          const regulators = broker.regulation?.regulators || [];
          const score = await getRegulatoryTrustScore(broker.name, regulators);
          setTrustScore(score);
        } catch (error) {
          console.error('Error fetching trust score:', error);
        } finally {
          setIsLoadingTrustScore(false);
        }
      };

      fetchTrustScore();
    }
  }, [broker?.id, trustScore, isLoadingTrustScore]);

  // Enhanced loading and error states
  if (isLoadingBrokerData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-lg font-medium" style={{ color: designSystem.colors.neutral[600] }}>
              Loading broker information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!broker) {
    return <NotFoundPage />;
  }

  const geoTargeting = {
    country: 'US',
    region: 'North America',
    city: 'New York'
  };

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
            streetAddress: (broker.headquarters || '').split(',')[0] || '',
            addressLocality: (broker.headquarters || '').split(',')[1] || '',
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
            price: (broker.accessibility?.minDeposit || 100).toString(),
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
            value: (broker.accessibility?.minDeposit || 100).toString()
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
            {/* Professional Broker Header */}
            <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-border">
              <CardHeader className="bg-background/70 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-background rounded-xl shadow-md border flex items-center justify-center p-3">
                        <img
                          src={broker.logoUrl}
                          alt={`${broker.name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/broker-logos/default-broker.svg';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
                          {broker.name}
                        </h1>
                        {broker.regulation?.regulators && broker.regulation.regulators.length > 0 && (
                          <Badge 
                            className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                          >
                            <Shield className="w-3 h-3" />
                            Regulated
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-lg mb-4 text-muted-foreground">
                        Professional Review & Analysis {new Date().getFullYear()}
                      </p>
                      
                      {/* Rating and Trust Indicators */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(overallRating) 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-foreground">
                            {overallRating.toFixed(1)}/5.0
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">
                            {broker.score?.toFixed(1) || '8.5'}/10
                          </span>
                          <span className="text-sm text-muted-foreground">Overall Score</span>
                        </div>
                        
                        {trustScore && (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {trustScore.score}/10
                            </span>
                            <span className="text-sm text-muted-foreground">Trust Score</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Key Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {broker.pros?.slice(0, 3).map((pro, index) => (
                          <Badge 
                            key={`highlight-${index}`} 
                            variant="outline"
                            className="text-sm font-medium border-primary/30 text-primary bg-primary/10"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {pro}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 lg:flex-col lg:w-48">
                    <Button
                      className="flex-1 lg:w-full transition-all duration-200 bg-primary text-primary-foreground font-semibold"
                      onClick={() => window.open(broker.websiteUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Broker
                    </Button>
                    
                    <div className="flex gap-2 lg:w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => isFavorite ? removeBrokerFromFavorites(broker.id) : addBrokerToFavorites(broker.id)}
                        className={`flex-1 ${
                          isFavorite ? 'border-red-300 text-red-600 dark:border-red-700 dark:text-red-400' : 'border-border text-muted-foreground'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => isInComparison ? removeBrokerFromComparison(broker.id) : addBrokerToComparison(broker.id)}
                        className={`flex-1 ${
                          isInComparison ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Professional Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg transition-all duration-200 hover:shadow-md bg-muted/50 border">
                    <div className="text-2xl md:text-3xl font-bold mb-1 text-primary">
                      {brokerStats.founded}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Founded
                    </div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg transition-all duration-200 hover:shadow-md bg-muted/50 border">
                    <div className="text-2xl md:text-3xl font-bold mb-1 text-primary">
                      {formatNumber(brokerStats.marketsAvailable)}+
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Markets
                    </div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg transition-all duration-200 hover:shadow-md bg-muted/50 border">
                    <div className="text-2xl md:text-3xl font-bold mb-1 text-primary">
                      {formatCurrency(brokerStats.minDeposit)}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Min Deposit
                    </div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg transition-all duration-200 hover:shadow-md bg-muted/50 border">
                    <div className="text-2xl md:text-3xl font-bold mb-1 text-primary">
                      {brokerStats.supportHours}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Support
                    </div>
                  </div>
                </div>
                
                {/* Broker Summary */}
                <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {broker.summary || broker.description}
                  </p>
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
                        <span className="font-medium">{broker.tradingConditions?.spreads?.eurusd || '1.0'} pips</span>
                      </DetailRow>
                      <DetailRow label="Spread Type">
                        <span className="font-medium capitalize">{broker.fees?.trading?.spreadType || 'Variable'}</span>
                      </DetailRow>
                      <DetailRow label="Commission" helpText="Per standard lot (100,000 units)">
                        <span className="font-medium">{broker.tradingConditions?.commission || 'No commission'}</span>
                      </DetailRow>
                      <DetailRow label="Leverage" helpText="Maximum leverage offered">
                        <span className="font-medium">{broker.tradingConditions?.maxLeverage || '1:100'}</span>
                      </DetailRow>
                      <DetailRow label="Minimum Deposit">
                        <span className="font-medium">${broker.accessibility?.minDeposit || 100}</span>
                      </DetailRow>
                    </DetailTable>
                  </CardContent>
                </Card>

                {/* Why Choose This Broker */}
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold">Why Choose {broker.name}</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3">Key Advantages</h3>
                        <ul className="space-y-2 text-sm">
                          {broker.pros?.map((pro, index) => (
                            <li key={`pros-list-${index}-${pro.slice(0, 10)}`} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">Considerations</h3>
                        <ul className="space-y-2 text-sm">
                          {broker.cons?.map((con, index) => (
                            <li key={`cons-list-${index}-${con.slice(0, 10)}`} className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
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
                {/* Dynamic Fee Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Fees & Costs</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive fee breakdown for {broker.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Trading Fees */}
                      <div>
                        <h3 className="font-semibold mb-4">Trading Fees</h3>
                        <DetailTable>
                          <DetailRow label="Spread Type">
                            <span className="font-medium">{broker.fees?.trading?.spreadType || 'Variable'}</span>
                          </DetailRow>
                          <DetailRow label="EUR/USD Spread">
                            <span className="font-medium">{broker.tradingConditions?.spreads?.eurusd || '1.0'} pips</span>
                          </DetailRow>
                          <DetailRow label="Commission Structure">
                            <span className="font-medium">{broker.fees?.trading?.commissionStructure || 'No commission'}</span>
                          </DetailRow>
                          <DetailRow label="Overnight Swap Fees">
                            <span className="font-medium">{broker.fees?.trading?.overnightSwapFees || 'Standard rates'}</span>
                          </DetailRow>
                        </DetailTable>
                      </div>
                      
                      {/* Non-Trading Fees */}
                      <div>
                        <h3 className="font-semibold mb-4">Account Fees</h3>
                        <DetailTable>
                          <DetailRow label="Inactivity Fee">
                            <span className="font-medium">{broker.fees?.nonTrading?.inactivityFee || 'None'}</span>
                          </DetailRow>
                          <DetailRow label="Withdrawal Fee">
                            <span className="font-medium">{broker.fees?.nonTrading?.withdrawalFee || 'None'}</span>
                          </DetailRow>
                          <DetailRow label="Deposit Fee">
                            <span className="font-medium">{broker.fees?.nonTrading?.depositFee || 'None'}</span>
                          </DetailRow>
                          <DetailRow label="Minimum Deposit">
                            <span className="font-medium">${broker.accessibility?.minDeposit || 100}</span>
                          </DetailRow>
                        </DetailTable>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="platforms" className="space-y-6">
                {/* Dynamic Platform Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Platforms</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Available trading platforms from {broker.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {broker.technology?.platforms && broker.technology.platforms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {broker.technology.platforms.map((platform, index) => (
                            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <Monitor className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">{platform}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                Professional trading platform with advanced features
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {broker.platformFeatures?.charting && (
                                  <Badge variant="secondary" className="text-xs">
                                    {broker.platformFeatures.charting.indicators || 50}+ Indicators
                                  </Badge>
                                )}
                                {broker.technology?.apiAccess && (
                                  <Badge variant="secondary" className="text-xs">API Access</Badge>
                                )}
                                {broker.technology?.eaSupport && (
                                  <Badge variant="secondary" className="text-xs">EA Support</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Platform information not available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="space-y-6">
                {/* Dynamic Safety Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Safety & Regulation</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Regulatory information and safety features for {broker.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Regulatory Information */}
                      <div>
                        <h3 className="font-semibold mb-4">Regulatory Authorities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {broker.security?.regulatedBy && broker.security.regulatedBy.length > 0 ? (
                            broker.security.regulatedBy.map((reg, index) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="w-4 h-4 text-green-600" />
                                  <span className="font-medium">{reg.regulator}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  License: {reg.licenseNumber || 'Licensed'}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">Regulatory information not available</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Safety Features */}
                      <div>
                        <h3 className="font-semibold mb-4">Safety Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {broker.security?.segregatedAccounts && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="font-medium">Segregated Accounts</span>
                            </div>
                          )}
                          {broker.tradingConditionsExtended?.negativeBalanceProtection && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="font-medium">Negative Balance Protection</span>
                            </div>
                          )}
                          {broker.security?.investorCompensationScheme?.available && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="font-medium">Investor Compensation: {broker.security.investorCompensationScheme.amount}</span>
                            </div>
                          )}
                          {broker.security?.twoFactorAuth && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="font-medium">Two-Factor Authentication</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                {/* Dynamic Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Account types and requirements for {broker.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Account Types */}
                      {broker.accountTypes && broker.accountTypes.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-4">Available Account Types</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {broker.accountTypes.map((account, index) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">{account.name}</h4>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Type:</strong> {account.type}</div>
                                  <div><strong>Min Deposit:</strong> ${account.minDeposit}</div>
                                  <div><strong>Spreads:</strong> {account.spreads}</div>
                                  <div><strong>Commission:</strong> {account.commission}</div>
                                  <div><strong>Best For:</strong> {account.bestFor}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Account Features */}
                      <div>
                        <h3 className="font-semibold mb-4">Account Features</h3>
                        <DetailTable>
                          <DetailRow label="Minimum Deposit">
                            <span className="font-medium">${broker.accessibility?.minDeposit || 100}</span>
                          </DetailRow>
                          <DetailRow label="Base Currencies">
                            <div className="flex flex-wrap gap-1">
                              {broker.accountManagement?.baseCurrencies?.map((currency, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{currency}</Badge>
                              )) || <span>USD, EUR</span>}
                            </div>
                          </DetailRow>
                          <DetailRow label="Islamic Account">
                            <span className="font-medium">
                              {broker.accountManagement?.islamicAccount?.available ? 'Available' : 'Not Available'}
                            </span>
                          </DetailRow>
                          <DetailRow label="Demo Account">
                            <span className="font-medium">
                              {broker.coreInfo?.demoAccount ? 'Available' : 'Not Available'}
                            </span>
                          </DetailRow>
                        </DetailTable>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interest" className="space-y-6">
                {/* Trading Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Conditions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Detailed trading conditions for {broker.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <DetailTable>
                      <DetailRow label="Maximum Leverage">
                        <span className="font-medium">{broker.tradingConditions?.maxLeverage || '1:100'}</span>
                      </DetailRow>
                      <DetailRow label="Minimum Lot Size">
                        <span className="font-medium">{broker.tradingConditions?.minLotSize || 0.01}</span>
                      </DetailRow>
                      <DetailRow label="Margin Call Level">
                        <span className="font-medium">{broker.tradingConditionsExtended?.marginCallLevel || '100%'}</span>
                      </DetailRow>
                      <DetailRow label="Stop Out Level">
                        <span className="font-medium">{broker.tradingConditionsExtended?.stopOutLevel || '50%'}</span>
                      </DetailRow>
                      <DetailRow label="Scalping Allowed">
                        <span className="font-medium">
                          {broker.tradingConditionsExtended?.scalpingAllowed ? 'Yes' : 'No'}
                        </span>
                      </DetailRow>
                      <DetailRow label="EA Support">
                        <span className="font-medium">
                          {broker.tradingConditionsExtended?.eaAllowed ? 'Yes' : 'No'}
                        </span>
                      </DetailRow>
                      <DetailRow label="Hedging Allowed">
                        <span className="font-medium">
                          {broker.tradingConditionsExtended?.hedgingAllowed ? 'Yes' : 'No'}
                        </span>
                      </DetailRow>
                    </DetailTable>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                {/* Trading Instruments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Instruments</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Available trading instruments from {broker.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {broker.tradableInstruments?.forexPairs && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Forex Pairs</h3>
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {typeof broker.tradableInstruments.forexPairs === 'object' && broker.tradableInstruments.forexPairs.total 
                              ? broker.tradableInstruments.forexPairs.total 
                              : 50}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeof broker.tradableInstruments.forexPairs === 'object' && broker.tradableInstruments.forexPairs.details 
                              ? broker.tradableInstruments.forexPairs.details 
                              : 'Major and minor pairs'}
                          </p>
                        </div>
                      )}
                      
                      {broker.tradableInstruments?.stocks && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Stocks</h3>
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {typeof broker.tradableInstruments.stocks === 'object' && broker.tradableInstruments.stocks.total 
                              ? broker.tradableInstruments.stocks.total 
                              : 1000}+
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeof broker.tradableInstruments.stocks === 'object' && broker.tradableInstruments.stocks.details 
                              ? broker.tradableInstruments.stocks.details 
                              : 'Global stock CFDs'}
                          </p>
                        </div>
                      )}
                      
                      {broker.tradableInstruments?.commodities && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Commodities</h3>
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {typeof broker.tradableInstruments.commodities === 'object' && broker.tradableInstruments.commodities.total 
                              ? broker.tradableInstruments.commodities.total 
                              : 20}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeof broker.tradableInstruments.commodities === 'object' && broker.tradableInstruments.commodities.details 
                              ? broker.tradableInstruments.commodities.details 
                              : 'Metals, energies, agricultural'}
                          </p>
                        </div>
                      )}
                      
                      {broker.tradableInstruments?.indices && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Indices</h3>
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {typeof broker.tradableInstruments.indices === 'object' && broker.tradableInstruments.indices.total 
                              ? broker.tradableInstruments.indices.total 
                              : 25}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeof broker.tradableInstruments.indices === 'object' && broker.tradableInstruments.indices.details 
                              ? broker.tradableInstruments.indices.details 
                              : 'Global stock indices'}
                          </p>
                        </div>
                      )}
                      
                      {broker.tradableInstruments?.cryptocurrencies && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Cryptocurrencies</h3>
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {typeof broker.tradableInstruments.cryptocurrencies === 'object' && broker.tradableInstruments.cryptocurrencies.total 
                              ? broker.tradableInstruments.cryptocurrencies.total 
                              : 10}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeof broker.tradableInstruments.cryptocurrencies === 'object' && broker.tradableInstruments.cryptocurrencies.details 
                              ? broker.tradableInstruments.cryptocurrencies.details 
                              : 'Major digital assets'}
                          </p>
                        </div>
                      )}
                      
                      {broker.tradableInstruments?.etfs && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">ETFs</h3>
                          </div>
                          <div className="text-2xl font-bold text-primary mb-1">
                            {typeof broker.tradableInstruments.etfs === 'object' && broker.tradableInstruments.etfs.total 
                              ? broker.tradableInstruments.etfs.total 
                              : 100}+
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeof broker.tradableInstruments.etfs === 'object' && broker.tradableInstruments.etfs.details 
                              ? broker.tradableInstruments.etfs.details 
                              : 'Exchange-traded funds'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                {/* Customer Support & Education */}
                <Card>
                  <CardHeader>
                    <CardTitle>Support & Resources</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Customer support and educational resources from {broker.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Customer Support */}
                      <div>
                        <h3 className="font-semibold mb-4">Customer Support</h3>
                        <DetailTable>
                          <DetailRow label="Support Hours">
                            <span className="font-medium">{broker.customerSupport?.hours || '24/5'}</span>
                          </DetailRow>
                          <DetailRow label="Contact Methods">
                            <div className="flex flex-wrap gap-1">
                              {broker.customerSupport?.channels?.map((channel, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{channel}</Badge>
                              )) || <span>Live Chat, Email, Phone</span>}
                            </div>
                          </DetailRow>
                          <DetailRow label="Languages">
                            <div className="flex flex-wrap gap-1">
                              {broker.customerSupport?.languages?.slice(0, 5).map((language, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{language}</Badge>
                              )) || <span>English</span>}
                              {broker.customerSupport?.languages && broker.customerSupport.languages.length > 5 && (
                                <Badge variant="secondary" className="text-xs">+{broker.customerSupport.languages.length - 5} more</Badge>
                              )}
                            </div>
                          </DetailRow>
                        </DetailTable>
                      </div>
                      
                      {/* Additional Features */}
                      <div>
                        <h3 className="font-semibold mb-4">Additional Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {broker.platformFeatures?.copyTrading?.available && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">Copy Trading Available</span>
                            </div>
                          )}
                          {broker.platformFeatures?.backtesting && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">Strategy Backtesting</span>
                            </div>
                          )}
                          {broker.technology?.apiAccess && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">API Access</span>
                            </div>
                          )}
                          {broker.platformFeatures?.newsIntegration && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">News Integration</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">{trustScore?.score || '8.5'}/10</div>
                      <div className="text-sm text-muted-foreground">Trust Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{reviews.length}</div>
                      <div className="text-sm text-muted-foreground">User Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{broker.tradingConditions?.spreads?.eurusd || '1.0'}</div>
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
            {broker && <AIAlternatives targetBroker={broker} />}

            {/* Discussion Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Community Discussion</h2>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="mb-4">
                    <textarea
                      className="w-full p-3 border rounded-md bg-background text-foreground border-border placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
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
                  {(broker.regulation?.regulators || []).map((regulator, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icons.shield className="w-4 h-4 text-green-600 dark:text-green-400" />
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