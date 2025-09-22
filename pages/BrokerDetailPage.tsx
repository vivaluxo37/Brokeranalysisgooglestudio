import React, { useState, useMemo, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { brokers } from '../data/brokers';
import NotFoundPage from './NotFoundPage';
import Button from '../components/ui/Button';
import { useComparison } from '../hooks/useComparison';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { Icons } from '../constants';
import StarRating from '../components/ui/StarRating';
import StarRatingInput from '../components/ui/StarRatingInput';
import { Review } from '../types';
import ReviewCard from '../components/brokers/ReviewCard';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { getReviewSummary, ReviewSummary, getRegulatoryTrustScore, TrustScore } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import BrokerCharts from '../components/brokers/BrokerCharts';
import MetaTags from '../components/common/MetaTags';
import useMetaDescription from '../hooks/useMetaDescription';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useReviews } from '../hooks/useReviews';
import Tooltip from '../components/ui/Tooltip';

const DetailRow: React.FC<{ label: string; children: React.ReactNode; helpText?: string }> = ({ label, children, helpText }) => (
  <tr className="border-b border-input last:border-b-0">
    <td className="p-3 font-semibold text-card-foreground/80 align-top">
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
    </td>
    <td className="p-3 text-card-foreground align-top">{children}</td>
  </tr>
);

const BooleanIcon: React.FC<{ value: boolean }> = ({ value }) => (
  value ? <Icons.checkCircle className="h-5 w-5 text-green-500" /> : <Icons.xCircle className="h-5 w-5 text-red-500" />
);

const AIReviewSummary: React.FC<{ brokerName: string; reviews: Review[] }> = ({ brokerName, reviews }) => {
    const [summary, setSummary] = useState<ReviewSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (reviews.length === 0) {
            setLoading(false);
            setSummary(null);
            return;
        }
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const result = await getReviewSummary(brokerName, reviews);
                setSummary(result);
            } catch (error) {
                console.error("Failed to get review summary:", error);
                // Handle error state if needed
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [brokerName, reviews]);

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Spinner /></div>;
    }

    if (!summary || (summary.pros.length === 0 && summary.cons.length === 0)) {
        return null;
    }

    return (
        <Card className="mt-8 animate-fade-in">
            <CardHeader><h3 className="text-xl font-bold flex items-center gap-2"><Icons.bot className="h-6 w-6 text-primary-400"/> AI Review Analysis</h3></CardHeader>
            <CardContent>
                <p className="text-card-foreground/90 italic mb-6">{summary.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-green-400 mb-2">Common Pros</h4>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground/70">
                            {summary.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-400 mb-2">Common Cons</h4>
                        <ul className="list-disc list-inside space-y-1 text-card-foreground/70">
                            {summary.cons.map((con, i) => <li key={i}>{con}</li>)}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const RegulatoryTrustScore: React.FC<{ brokerName: string; regulators: string[] }> = ({ brokerName, regulators }) => {
    const [trustInfo, setTrustInfo] = useState<TrustScore | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScore = async () => {
            setLoading(true);
            try {
                const result = await getRegulatoryTrustScore(brokerName, regulators);
                setTrustInfo(result);
            } catch (error) {
                console.error("Failed to get trust score:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScore();
    }, [brokerName, regulators]);

    if (loading) {
        return <div className="flex items-center gap-2 text-sm text-foreground/70"><Spinner size="sm" /> <span>Analyzing regulatory status...</span></div>;
    }

    if (!trustInfo) return null;
    
    const scoreColor = trustInfo.score >= 8.5 ? 'text-green-400' : trustInfo.score >= 6 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="mt-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-primary-400 mb-2">AI Regulatory Trust Score</h3>
            <div className="p-4 bg-input/50 rounded-lg">
                <div className="flex items-baseline gap-2">
                     <span className={`text-3xl font-bold ${scoreColor}`}>{trustInfo.score.toFixed(1)}</span>
                     <span className="text-foreground/70">/ 10</span>
                </div>
                <p className="text-sm text-foreground/90 mt-1 italic">{trustInfo.reasoning}</p>
                {trustInfo.sources && trustInfo.sources.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-foreground/60">Sources found by AI:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {trustInfo.sources.slice(0, 3).map((source, i) => (
                                <a href={source.uri} key={i} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline bg-background px-2 py-1 rounded-md">
                                   {new URL(source.uri).hostname}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable Section Component
const Section: React.FC<{ title: string; id: string; children: React.ReactNode; className?: string }> = ({ title, id, children, className = '' }) => (
  <div id={id} className={`pt-16 -mt-16 ${className}`}> {/* Offset for sticky nav */}
    <Card className="mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold text-primary-400">{title}</h2>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        {children}
      </CardContent>
    </Card>
  </div>
);

const TableOfContents: React.FC<{ items: { id: string; title: string }[] }> = ({ items }) => (
    <div className="hidden lg:block sticky top-24 self-start">
        <h3 className="font-semibold mb-3 text-card-foreground">On this page</h3>
        <ul className="space-y-2 ltr:border-l-2 rtl:border-r-2 border-input">
            {items.map(item => (
                <li key={item.id}>
                    <a href={`#${item.id}`} className="block ltr:pl-4 rtl:pr-4 text-foreground/70 hover:text-primary-400 hover:border-primary-400 ltr:border-l-2 rtl:border-r-2 border-transparent ltr:-ml-px rtl:-mr-px transition-colors">
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);


const BrokerDetailPage: React.FC = () => {
  const { brokerId } = ReactRouterDOM.useParams<{ brokerId: string }>();
  const broker = brokers.find(b => b.id === brokerId);
  
  const { addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison } = useComparison();
  const { addBrokerToFavorites, removeBrokerFromFavorites, isBrokerInFavorites } = useFavorites();
  const { user } = useAuth();
  const { getReviewsByBrokerId, addReview } = useReviews();

  const reviews = useMemo(() => getReviewsByBrokerId(broker?.id || ''), [getReviewsByBrokerId, broker]);
  
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [filterRating, setFilterRating] = useState(0);

  const description = useMetaDescription(broker);

  const brokerJsonLd = useMemo(() => {
    if (!broker) return null;

    const schema: any = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": broker.name,
      "url": `https://brokeranalysis.com/#/broker/${broker.id}`,
      "logo": broker.logoUrl,
      "description": broker.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": broker.headquarters.split(',')[0].trim(),
        "addressCountry": broker.headquarters.split(',').pop()?.trim() || "Unknown"
      },
      "review": reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.userName
        },
        "datePublished": review.date,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating.toString(),
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": review.comment
      }))
    };
    
    const reviewCount = reviews.length;
    if (reviewCount > 0) {
      const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2);
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": averageRating,
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": reviewCount.toString()
      };
    }

    return schema;
  }, [broker, reviews]);

  const tableOfContents = useMemo(() => {
    if (!broker) return [];
    const toc = [
        { id: 'glance', title: 'At a Glance', show: true },
        { id: 'verdict', title: 'Our Verdict', show: !!broker.summary },
        { id: 'pros-cons', title: 'Pros & Cons', show: !!broker.pros && !!broker.cons },
        { id: 'ratings', title: 'Ratings Breakdown', show: true },
        { id: 'safety', title: 'Regulation & Safety', show: true },
        { id: 'fees', title: 'Fees & Costs', show: true },
        { id: 'accounts', title: 'Account Types', show: !!broker.accountTypes },
        { id: 'platforms', title: 'Platforms & Technology', show: true },
        { id: 'instruments', title: 'Tradable Instruments', show: true },
        { id: 'deposits', title: 'Deposit & Withdrawal', show: true },
        { id: 'support', title: 'Customer Support', show: true },
        { id: 'reviews', title: 'User Reviews', show: true },
    ];
    return toc.filter(item => item.show);
  }, [broker]);

  if (!broker) {
    return <NotFoundPage />;
  }
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim() || !user) return;

    setIsSubmitting(true);
    setTimeout(() => {
        addReview({
            brokerId: broker.id,
            userId: user.id,
            userName: user.name,
            rating: newRating,
            comment: newComment,
        });
        setNewRating(0);
        setNewComment('');
        setIsSubmitting(false);
    }, 500);
  };

  const inCompare = isBrokerInComparison(broker.id);
  const handleCompareClick = () => {
      if (inCompare) removeBrokerFromComparison(broker.id);
      else addBrokerToComparison(broker.id);
  };

  const isFavorite = isBrokerInFavorites(broker.id);
  const handleFavoriteClick = () => {
      if (isFavorite) removeBrokerFromFavorites(broker.id);
      else addBrokerToFavorites(broker.id);
  };
  
  const displayedReviews = useMemo(() => {
    return reviews
      .filter(review => filterRating === 0 || review.rating === filterRating)
      .sort((a, b) => {
        switch (sortOrder) {
          case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'rating-desc': return b.rating - a.rating;
          case 'rating-asc': return a.rating - b.rating;
          case 'date-desc': default: return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [reviews, sortOrder, filterRating]);

  return (
    <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-4 lg:gap-12">
       <MetaTags
        title={`${broker.name} Review & Analysis (Updated 2025) | Brokeranalysis`}
        description={description}
        canonicalUrl={`https://brokeranalysis.com/#/broker/${broker.id}`}
        imageUrl={broker.logoUrl}
      />
      {brokerJsonLd && <JsonLdSchema data={brokerJsonLd} />}

      <div className="lg:col-span-3">
        {/* --- HERO SECTION --- */}
        <div className="bg-card rounded-lg shadow-xl overflow-hidden border border-input">
          <div className="p-6 md:flex md:items-center md:justify-between bg-input/30">
              <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                      <img className="h-16 w-16 bg-white p-2 rounded-md" src={broker.logoUrl} alt={`${broker.name} logo`} />
                      <div className="ltr:ml-4 rtl:mr-4">
                          <h1 className="text-3xl font-bold leading-7 text-card-foreground sm:truncate">{broker.name} Review</h1>
                          <p className="text-foreground/70 mt-1">{broker.headquarters} &bull; Est. {broker.foundingYear}</p>
                      </div>
                  </div>
              </div>
              <div className="mt-6 flex flex-col items-center md:mt-0 ltr:md:ml-4 rtl:md:mr-4">
                  <span className="text-5xl font-bold text-primary-400">{broker.score.toFixed(1)}</span>
                  <StarRating score={broker.score} className="mt-1" size="lg" />
              </div>
          </div>

          <div className="p-6">
              <div className="mt-2 flex flex-wrap justify-center items-center gap-4">
                  <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="lg" className="shadow-lg shadow-primary-900/50 animate-pulse">
                          Visit {broker.name}
                      </Button>
                  </a>
                  <Tooltip content={inCompare ? 'Remove from your comparison list' : 'Add to your comparison list'}>
                    <Button onClick={handleCompareClick} variant="secondary">
                        {inCompare ? <Icons.compareRemove className="h-5 w-5 ltr:mr-2 rtl:ml-2" /> : <Icons.compare className="h-5 w-5 ltr:mr-2 rtl:ml-2" />}
                        {inCompare ? "Remove from Compare" : "Add to Compare"}
                    </Button>
                  </Tooltip>
                   <Tooltip content={isFavorite ? 'Remove from your favorites' : 'Add this broker to your favorites'}>
                    <Button onClick={handleFavoriteClick} variant="secondary">
                        {isFavorite ? <Icons.starFull className="h-5 w-5 ltr:mr-2 rtl:ml-2 text-yellow-400" /> : <Icons.star className="h-5 w-5 ltr:mr-2 rtl:ml-2" />}
                        {isFavorite ? "Favorited" : "Add to Favorites"}
                    </Button>
                  </Tooltip>
              </div>
          </div>
        </div>

        <Section title="At a Glance" id="glance">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                <DetailRow label="Founded">{broker.foundingYear}</DetailRow>
                <DetailRow label="Headquarters">{broker.headquarters}</DetailRow>
                <DetailRow label="Broker Type">{broker.coreInfo.brokerType}</DetailRow>
                <DetailRow label="Regulation">{broker.regulation.regulators.join(', ')}</DetailRow>
                <DetailRow label="Minimum Deposit">{`$${broker.accessibility.minDeposit}`}</DetailRow>
                <DetailRow label="Max Leverage">{broker.tradingConditions.maxLeverage}</DetailRow>
                <DetailRow label="Platforms">{broker.technology.platforms.join(', ')}</DetailRow>
              </tbody>
            </table>
          </div>
        </Section>

        {broker.summary && (
          <Section title="Our Verdict" id="verdict">
            <p className="text-lg italic text-foreground/90">{broker.summary}</p>
          </Section>
        )}

        {broker.pros && broker.cons && (
          <Section title="Pros & Cons" id="pros-cons">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {broker.pros.map(pro => (
                  <div key={pro} className="flex items-start gap-3">
                    <Icons.checkCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                 {broker.cons.map(con => (
                  <div key={con} className="flex items-start gap-3">
                    <Icons.xCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        <Section title="Ratings Breakdown" id="ratings">
            <BrokerCharts broker={broker} />
        </Section>

        <Section title="Regulation & Safety" id="safety">
            <RegulatoryTrustScore brokerName={broker.name} regulators={broker.regulation.regulators} />
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-sm">
                <tbody>
                  <DetailRow label="Regulated By">
                    <ul className="list-disc list-inside">
                      {broker.security.regulatedBy.map(reg => <li key={reg.regulator}>{reg.regulator} {reg.licenseNumber && `(${reg.licenseNumber})`}</li>)}
                    </ul>
                  </DetailRow>
                  <DetailRow label="Segregated Accounts"><BooleanIcon value={broker.security.segregatedAccounts} /></DetailRow>
                  <DetailRow label="Investor Compensation"><BooleanIcon value={broker.security.investorCompensationScheme.available} /> {broker.security.investorCompensationScheme.amount && `(${broker.security.investorCompensationScheme.amount})`}</DetailRow>
                  <DetailRow label="Negative Balance Protection"><BooleanIcon value={broker.tradingConditionsExtended.negativeBalanceProtection} /></DetailRow>
                   <DetailRow label="Two-Factor Authentication (2FA)"><BooleanIcon value={broker.security.twoFactorAuth} /></DetailRow>
                </tbody>
              </table>
            </div>
        </Section>
        
        <Section title="Fees & Costs" id="fees">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-input/30"><th className="p-3 font-semibold" colSpan={2}>Trading Fees</th></tr>
                </thead>
                <tbody>
                  <DetailRow label="Spread Type">{broker.fees.trading.spreadType}</DetailRow>
                  <DetailRow label="Average Spreads">
                    <ul className="list-disc list-inside">
                        {broker.fees.trading.averageSpreads.map(s => <li key={s.pair}><strong>{s.pair}:</strong> {s.spread}</li>)}
                    </ul>
                  </DetailRow>
                  <DetailRow label="Commission Structure">{broker.fees.trading.commissionStructure}</DetailRow>
                  <DetailRow label="Overnight / Swap Fees">{broker.fees.trading.overnightSwapFees}</DetailRow>
                </tbody>
                <thead>
                  <tr className="bg-input/30"><th className="p-3 font-semibold" colSpan={2}>Non-Trading Fees</th></tr>
                </thead>
                <tbody>
                   <DetailRow label="Inactivity Fee">{broker.fees.nonTrading.inactivityFee}</DetailRow>
                   <DetailRow label="Withdrawal Fee">{broker.fees.nonTrading.withdrawalFee}</DetailRow>
                   <DetailRow label="Deposit Fee">{broker.fees.nonTrading.depositFee}</DetailRow>
                   {broker.fees.nonTrading.conversionFee && <DetailRow label="Currency Conversion Fee">{broker.fees.nonTrading.conversionFee}</DetailRow>}
                </tbody>
              </table>
            </div>
             <div className="mt-6 p-4 bg-input/50 rounded-lg text-center">
                <p className="text-foreground/80">Need help calculating your potential costs?</p>
                <ReactRouterDOM.Link to="/tools/calculators">
                    <Button variant="secondary" className="mt-2">
                        Use our Forex Calculators <Icons.chevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </ReactRouterDOM.Link>
            </div>
        </Section>
        
        {broker.accountTypes && (
            <Section title="Account Types" id="accounts">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-input/50">
                            <tr>
                                <th className="p-3">Account</th><th className="p-3">Best For</th><th className="p-3">Min. Deposit</th><th className="p-3">Spreads</th><th className="p-3">Commission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {broker.accountTypes.map(acc => (
                                <tr key={acc.name} className="border-b border-input last:border-b-0">
                                    <td className="p-3 font-semibold">{acc.name}</td><td className="p-3">{acc.bestFor}</td><td className="p-3">${acc.minDeposit}</td><td className="p-3">{acc.spreads}</td><td className="p-3">{acc.commission}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        )}
        
         <Section title="Platforms & Technology" id="platforms">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead>
                  <tr className="bg-input/30"><th className="p-3 font-semibold" colSpan={2}>Platform Features</th></tr>
                </thead>
                <tbody>
                  <DetailRow label="Platforms">{broker.technology.platforms.join(', ')}</DetailRow>
                  <DetailRow label="Charting Indicators">{broker.platformFeatures.charting.indicators}+</DetailRow>
                  <DetailRow label="Automated Trading">{broker.platformFeatures.automatedTrading.join(', ')}</DetailRow>
                  <DetailRow label="Copy Trading"><BooleanIcon value={broker.platformFeatures.copyTrading.available} /> {broker.platformFeatures.copyTrading.available && `(${broker.platformFeatures.copyTrading.platforms.join(', ')})`}</DetailRow>
                </tbody>
                 <thead>
                  <tr className="bg-input/30"><th className="p-3 font-semibold" colSpan={2}>Trading Environment</th></tr>
                </thead>
                <tbody>
                   <DetailRow label="Execution Type">{broker.technology.executionType}</DetailRow>
                   {broker.tradingEnvironment.executionSpeedMs && <DetailRow label="Execution Speed">{`< ${broker.tradingEnvironment.executionSpeedMs}ms`}</DetailRow>}
                   <DetailRow label="Scalping Allowed"><BooleanIcon value={broker.tradingConditionsExtended.scalpingAllowed} /></DetailRow>
                   <DetailRow label="EAs / Algo Trading"><BooleanIcon value={broker.tradingConditionsExtended.eaAllowed} /></DetailRow>
                   <DetailRow label="Order Types">{broker.tradingEnvironment.orderTypes.join(', ')}</DetailRow>
                </tbody>
              </table>
            </div>
        </Section>
        
        <Section title="Tradable Instruments" id="instruments">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  <DetailRow label="Forex Pairs">{`${broker.tradableInstruments.forexPairs.total} (${broker.tradableInstruments.forexPairs.details})`}</DetailRow>
                  <DetailRow label="Indices">{`${broker.tradableInstruments.indices.total} (${broker.tradableInstruments.indices.details})`}</DetailRow>
                  <DetailRow label="Commodities">{`${broker.tradableInstruments.commodities.total} (${broker.tradableInstruments.commodities.details})`}</DetailRow>
                  <DetailRow label="Stock CFDs">{`${broker.tradableInstruments.stocks.total} (${broker.tradableInstruments.stocks.details})`}</DetailRow>
                  <DetailRow label="Cryptocurrencies">{`${broker.tradableInstruments.cryptocurrencies.total} (${broker.tradableInstruments.cryptocurrencies.details})`}</DetailRow>
                  {broker.tradableInstruments.etfs && <DetailRow label="ETFs">{`${broker.tradableInstruments.etfs.total} (${broker.tradableInstruments.etfs.details})`}</DetailRow>}
                </tbody>
              </table>
            </div>
        </Section>

        <Section title="Deposit & Withdrawal" id="deposits">
             <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  <DetailRow label="Deposit Methods">{broker.depositWithdrawal.depositMethods.join(', ')}</DetailRow>
                  <DetailRow label="Withdrawal Methods">{broker.depositWithdrawal.withdrawalMethods.join(', ')}</DetailRow>
                  <DetailRow label="Deposit Fees">{broker.depositWithdrawal.depositFees}</DetailRow>
                   <DetailRow label="Withdrawal Fees">{broker.depositWithdrawal.withdrawalFees}</DetailRow>
                   <DetailRow label="Avg. Withdrawal Time">{broker.depositWithdrawal.processingTime.withdrawals}</DetailRow>
                </tbody>
              </table>
            </div>
        </Section>

         <Section title="Customer Support" id="support">
             <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  <DetailRow label="Support Hours">{broker.customerSupport.hours}</DetailRow>
                  <DetailRow label="Support Channels">{broker.customerSupport.channels.join(', ')}</DetailRow>
                  <DetailRow label="Support Languages">{broker.customerSupport.languages.slice(0, 5).join(', ')}{broker.customerSupport.languages.length > 5 ? '...' : ''}</DetailRow>
                </tbody>
              </table>
            </div>
        </Section>
        
        {/* --- REVIEWS SECTION --- */}
        <div id="reviews" className="pt-16 -mt-16">
          <div className="flex flex-col md:flex-row justify-between md:items-center my-6 gap-4 pt-8">
              <h2 className="text-3xl font-bold">User Reviews ({reviews.length})</h2>
               {reviews.length > 0 && (
                  <div className="flex items-center gap-4">
                      <div>
                          <label htmlFor="filter-rating" className="text-sm font-medium text-foreground/80 ltr:mr-2 rtl:ml-2">Filter:</label>
                          <select id="filter-rating" value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))} className="bg-input border-input rounded-md shadow-sm p-2">
                              <option value="0">All Ratings</option> <option value="5">5 Stars</option> <option value="4">4 Stars</option> <option value="3">3 Stars</option> <option value="2">2 Stars</option> <option value="1">1 Star</option>
                          </select>
                      </div>
                       <div>
                          <label htmlFor="sort-order" className="text-sm font-medium text-foreground/80 ltr:mr-2 rtl:ml-2">Sort by:</label>
                          <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-input border-input rounded-md shadow-sm p-2">
                              <option value="date-desc">Newest First</option> <option value="date-asc">Oldest First</option> <option value="rating-desc">Highest Rating</option> <option value="rating-asc">Lowest Rating</option>
                          </select>
                      </div>
                  </div>
              )}
          </div>
          
          {reviews.length > 0 && <AIReviewSummary brokerName={broker.name} reviews={reviews} />}
          
          {user ? (
              <Card className="my-8">
                  <CardContent>
                      <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                      <form onSubmit={handleReviewSubmit}>
                          <div className="mb-4"><label className="block text-sm font-medium text-card-foreground/90 mb-2">Your Rating</label><StarRatingInput rating={newRating} setRating={setNewRating} /></div>
                          <div className="mb-4"><label htmlFor="comment" className="block text-sm font-medium text-card-foreground/90 mb-2">Your Comment</label><textarea id="comment" rows={4} className="block w-full bg-input border-input rounded-md shadow-sm p-2 placeholder:text-foreground/60" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={`Share your experience with ${broker.name}...`} required></textarea></div>
                          <Button type="submit" disabled={isSubmitting || newRating === 0 || !newComment.trim()}>{isSubmitting ? 'Submitting...' : 'Submit Review'}</Button>
                      </form>
                  </CardContent>
              </Card>
          ) : (
              <div className="text-center p-6 bg-card rounded-lg border border-input my-8"><p className="text-card-foreground/80"><ReactRouterDOM.Link to="/login" className="text-primary-400 font-semibold hover:underline">Log in</ReactRouterDOM.Link> to leave a review.</p></div>
          )}

          <div className="space-y-6">
              {displayedReviews.length > 0 ? (
                  displayedReviews.map(review => <ReviewCard key={review.id} review={review} />)
              ) : (<p className="text-center text-foreground/70 py-8">{reviews.length > 0 ? 'No reviews match your selected filters.' : 'No reviews yet for this broker. Be the first to leave one!'}</p>)}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <TableOfContents items={tableOfContents} />
      </div>

    </div>
  );
};

export default BrokerDetailPage;