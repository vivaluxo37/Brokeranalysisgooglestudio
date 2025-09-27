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
import useMetaDescription from '../hooks/useMetaDescription';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useReviews } from '../hooks/useReviews';
import Tooltip from '../components/ui/Tooltip';
import RiskProfileCard from '../components/brokers/RiskProfileCard';
import ReportBrokerModal from '../components/brokers/ReportBrokerModal';
import { Input } from '../components/ui/input';
import { DiscussionContext } from '../contexts/DiscussionContext';
import DiscussionPostCard from '../components/brokers/DiscussionPostCard';
import AIAlternatives from '../components/brokers/AIAlternatives';

// SEO Components Integration
import { SEOProvider, useSEO } from '../components/seo/SEOContext';
import BrokerSEOTemplate from '../components/seo/BrokerSEOTemplate';
import GenerativeEngineSEO from '../components/seo/GenerativeEngineSEO';
import GEOMultilingualSEO from '../components/seo/GEOMultilingualSEO';
import PerformanceMonitor from '../components/seo/PerformanceMonitor';
import SEOChecklist from '../components/seo/SEOChecklist';
import { useLanguage } from '../hooks/useLanguage';

// New component for responsive key-value tables
const DetailTable: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="md:table w-full text-left text-sm border-separate md:border-spacing-0">
    <div className="md:table-row-group">{children}</div>
  </div>
);

// Modified DetailRow to stack on mobile
const DetailRow: React.FC<{ label: string; children: React.ReactNode; helpText?: string }> = ({ label, children, helpText }) => (
  <div className="md:table-row flex flex-col md:flex-none py-3 md:py-0 border-b border-input last:border-b-0 md:border-b">
    <div className="md:table-cell px-3 pt-3 md:p-3 font-semibold text-card-foreground/80 align-top md:w-1/3">
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {helpText && (
          <Tooltip content={helpText}>
            <span className="text-foreground/50 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </span>
          </Tooltip>
        )}
      </div>
    </div>
    <div className="md:table-cell px-3 pb-3 md:p-3 align-top md:w-2/3">{children}</div>
  </div>
);

const BrokerDetailPage: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { comparisonList, addToComparison, removeFromComparison } = useComparison();
  const { reviews, addReview, updateReview, deleteReview } = useReviews();
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

  const isFavorite = useMemo(() => favorites.some(fav => fav.id === brokerId), [favorites, brokerId]);
  const isInComparison = useMemo(() => comparisonList.some(item => item.id === brokerId), [comparisonList, brokerId]);

  useEffect(() => {
    if (broker) {
      // Generate review summary and trust score
      const fetchReviewSummary = async () => {
        setIsLoadingReviewSummary(true);
        try {
          const summary = await getReviewSummary(broker);
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
          const score = await getRegulatoryTrustScore(broker);
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
      answer: `${broker.name} offers ${broker.tradingConditions.platforms.join(', ')} for trading forex, CFDs, and other instruments.`
    },
    {
      question: `What are the spreads at ${broker.name}?`,
      answer: `${broker.name} offers spreads starting from ${broker.tradingConditions.spreads.eurusd} pips on EUR/USD, with ${broker.tradingConditions.spreadType === 'fixed' ? 'fixed' : 'variable'} spreads.`
    },
    {
      question: `What is the minimum deposit at ${broker.name}?`,
      answer: `The minimum deposit at ${broker.name} is $${broker.accountTypes.minDeposit}, making it accessible for most traders.`
    }
  ];

  const brokerKeyTakeaways = [
    `${broker.name} is a ${broker.tradingConditions.spreadType === 'fixed' ? 'fixed' : 'variable'} spread broker with spreads from ${broker.tradingConditions.spreads.eurusd} pips`,
    `Regulated by ${broker.regulation.regulators.join(', ')} for maximum trader protection`,
    `Minimum deposit of $${broker.accountTypes.minDeposit} with leverage up to 1:${broker.tradingConditions.leverage}`,
    `Offers ${broker.tradingConditions.platforms.join(', ')} trading platforms`,
    `${broker.accountTypes.demoAvailable ? 'Free demo account available for practice trading' : 'No demo account available'}`
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
      text: `Deposit minimum $${broker.accountTypes.minDeposit} using available payment methods (bank wire, credit card, e-wallets).`
    },
    {
      name: 'Download Platform',
      text: `Download and install ${broker.tradingConditions.platforms[0]} or use web trader for instant access.`
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
      description: `Lee nuestra revisión completa de ${broker.name}. Aprende sobre spreads, comisiones, regulación y plataformas.`
    },
    fr: {
      title: `Avis ${broker.name} - Courtier Forex`,
      description: `Lisez notre avis complet sur ${broker.name}. Découvrez les spreads, commissions, réglementation et plateformes.`
    },
    de: {
      title: `${broker.name} Bewertung - Forex Broker`,
      description: `Lesen Sie unsere umfassende ${broker.name} Bewertung. Erfahren Sie mehr über Spreads, Kommissionen und Regulierung.`
    }
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const imageUrl = broker.logo || 'https://brokeranalysis.com/images/broker-default.jpg';

  return (
    <SEOProvider baseUrl="https://brokeranalysis.com">
      {/* GEO & Multilingual SEO */}
      <GEOMultilingualSEO
        title={`${broker.name} Review - ${new Date().getFullYear()} Forex Broker Analysis`}
        description={brokerSEODescription}
        keywords={brokerSEOKeywords}
        imageUrl={imageUrl}
        geoTargeting={geoTargeting}
        translations={translations}
      />

      {/* Meta Tags */}
      <MetaTags
        title={`${broker.name} Review - ${new Date().getFullYear()} Forex Broker Analysis`}
        description={brokerSEODescription}
        keywords={brokerSEOKeywords}
        canonical={generateCanonicalUrl(`/broker/${broker.id}`)}
        ogImage={imageUrl}
        ogType="article"
        twitterCard="summary_large_image"
      />

      {/* Structured Data */}
      <JsonLdSchema
        data={{
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'Organization',
            name: broker.name,
            image: imageUrl,
            address: broker.headquarters
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: broker.rating?.toString() || '4.5',
            bestRating: '5'
          },
          author: {
            '@type': 'Organization',
            name: 'BrokerAnalysis'
          },
          datePublished: new Date().toISOString(),
          description: brokerSEODescription
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Broker Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={broker.logo}
                      alt={`${broker.name} logo`}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://brokeranalysis.com/images/broker-default.jpg';
                      }}
                    />
                    <div>
                      <h1 className="text-3xl font-bold">{broker.name} Review {new Date().getFullYear()}</h1>
                      <div className="flex items-center gap-4 mt-2">
                        <StarRating rating={broker.rating || 4.5} size={20} />
                        <span className="text-sm text-muted-foreground">
                          {broker.rating?.toFixed(1) || '4.5'} out of 5
                        </span>
                        {trustScore && (
                          <span className="text-sm text-green-600 font-medium">
                            Trust Score: {trustScore.score}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={isFavorite ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => isFavorite ? removeFavorite(broker) : addFavorite(broker)}
                    >
                      <Icons.heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Remove' : 'Add to Favorites'}
                    </Button>
                    <Button
                      variant={isInComparison ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => isInComparison ? removeFromComparison(broker) : addToComparison(broker)}
                    >
                      <Icons.barChart className="w-4 h-4 mr-2" />
                      {isInComparison ? 'Remove' : 'Compare'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {brokerSEODescription}
                </p>
              </CardContent>
            </Card>

            {/* Broker SEO Template */}
            <BrokerSEOTemplate
              broker={broker}
              baseUrl="https://brokeranalysis.com"
              marketAnalysis={{
                marketTrend: ' bullish',
                volatility: 'medium',
                recommendedStrategies: ['scalping', 'swing trading']
              }}
            />

            {/* Generative Engine SEO */}
            <GenerativeEngineSEO
              title={`${broker.name} Review - ${new Date().getFullYear()} Analysis`}
              description={brokerSEODescription}
              content={broker.longDescription || broker.description}
              keyTakeaways={brokerKeyTakeaways}
              faqs={brokerFAQs}
              howToSteps={brokerHowToSteps}
              internalLinks={[
                { text: 'Compare with other brokers', url: '/compare' },
                { text: 'View all brokers', url: '/brokers' },
                { text: 'Trading education', url: '/education' },
                { text: 'Trading tools', url: '/tools' }
              ]}
              citations={[
                { text: 'Regulatory Information', url: broker.regulation.licenseUrl },
                { text: 'Trading Conditions', url: broker.website },
                { text: 'Platform Information', url: broker.website }
              ]}
              canonicalUrl={generateCanonicalUrl(`/broker/${broker.id}`)}
            />

            {/* Performance Monitor */}
            <PerformanceMonitor
              pageUrl={pageUrl}
              enableRealTime={true}
            />

            {/* SEO Checklist */}
            <SEOChecklist
              pageType="broker"
              pagePath={`/broker/${broker.id}`}
              pageData={broker}
              onChecklistComplete={(results) => {
                console.log('SEO Audit Results:', results);
              }}
            />

            {/* Rest of the existing content... */}
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
                    <span className="font-medium capitalize">{broker.tradingConditions.spreadType}</span>
                  </DetailRow>
                  <DetailRow label="Commission" helpText="Per standard lot (100,000 units)">
                    <span className="font-medium">${broker.tradingConditions.commission.roundTurn}</span>
                  </DetailRow>
                  <DetailRow label="Leverage" helpText="Maximum leverage offered">
                    <span className="font-medium">1:{broker.tradingConditions.leverage}</span>
                  </DetailRow>
                  <DetailRow label="Minimum Deposit">
                    <span className="font-medium">${broker.accountTypes.minDeposit}</span>
                  </DetailRow>
                </DetailTable>
              </CardContent>
            </Card>

            {/* Additional existing components... */}
            {broker.rating && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Rating Summary</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{broker.rating.toFixed(1)}</div>
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
                        onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
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
                              id: Date.now().toString(),
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
                          canEdit={user?.id === review.userId}
                          canDelete={user?.id === review.userId}
                          onEdit={(updatedReview) => updateReview(updatedReview)}
                          onDelete={(reviewId) => deleteReview(reviewId)}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this broker!</p>
                )}
              </CardContent>
            </Card>

            {/* AI Alternatives */}
            <AIAlternatives broker={broker} />

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
                          brokerId: broker.id,
                          userId: user.id,
                          userName: user.name || 'Anonymous',
                          content: newDiscussionPost,
                          date: new Date().toISOString(),
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
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => window.open(broker.website, '_blank')}>
                  Visit Website
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowReportModal(true)}>
                  <Icons.flag className="w-4 h-4 mr-2" />
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
                    License: {broker.regulation.licenseNumber}
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
                    <div className="text-muted-foreground">{broker.founded}</div>
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
          broker={broker}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </SEOProvider>
  );
};

export default BrokerDetailPage;