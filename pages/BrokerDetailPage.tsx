
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brokers } from '../data/brokers';
import NotFoundPage from './NotFoundPage';
import Tag from '../components/ui/Tag';
import Button from '../components/ui/Button';
import { useComparison } from '../hooks/useComparison';
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

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">{children}</dd>
    </div>
);

const AIReviewSummary: React.FC<{ brokerName: string; reviews: Review[] }> = ({ brokerName, reviews }) => {
    const [summary, setSummary] = useState<ReviewSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                <p className="text-gray-300 italic mb-6">{summary.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-green-400 mb-2">Common Pros</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                            {summary.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-400 mb-2">Common Cons</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
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
        return <div className="flex items-center gap-2 text-sm text-gray-400"><Spinner size="sm" /> <span>Analyzing regulatory status...</span></div>;
    }

    if (!trustInfo) return null;
    
    const scoreColor = trustInfo.score >= 8.5 ? 'text-green-400' : trustInfo.score >= 6 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="mt-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-primary-400 mb-2">AI Regulatory Trust Score</h3>
            <div className="p-4 bg-input/50 rounded-lg">
                <div className="flex items-baseline gap-2">
                     <span className={`text-3xl font-bold ${scoreColor}`}>{trustInfo.score.toFixed(1)}</span>
                     <span className="text-gray-400">/ 10</span>
                </div>
                <p className="text-sm text-gray-300 mt-1 italic">{trustInfo.reasoning}</p>
                {trustInfo.sources && trustInfo.sources.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-gray-500">Sources found by AI:</p>
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


const BrokerDetailPage: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const broker = brokers.find(b => b.id === brokerId);
  
  const { addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison } = useComparison();
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>(broker?.reviews || []);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [filterRating, setFilterRating] = useState(0);

  if (!broker) {
    return <NotFoundPage />;
  }
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim() || !user) return;

    setIsSubmitting(true);
    setTimeout(() => {
        const newReview: Review = {
            id: Date.now().toString(),
            brokerId: broker.id,
            userId: user.id,
            userName: user.name,
            rating: newRating,
            comment: newComment,
            date: new Date().toISOString(),
        };
        setReviews(prev => [newReview, ...prev]);
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-xl overflow-hidden border border-input">
        <div className="p-6 md:flex md:items-center md:justify-between bg-input/30">
            <div className="flex-1 min-w-0">
                <div className="flex items-center">
                    <img className="h-16 w-16 bg-white p-2 rounded-md" src={broker.logoUrl} alt={`${broker.name} logo`} />
                    <div className="ml-4">
                        <h1 className="text-3xl font-bold leading-7 text-white sm:truncate">{broker.name}</h1>
                        <p className="text-gray-400 mt-1">{broker.headquarters} &bull; Est. {broker.foundingYear}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-col items-center md:mt-0 md:ml-4">
                <span className="text-5xl font-bold text-primary-400">{broker.score.toFixed(1)}</span>
                <StarRating score={broker.score} className="mt-1" size="lg" />
            </div>
        </div>

        <div className="p-6">
            <BrokerCharts broker={broker} />
            
            <h2 className="text-xl font-semibold mb-2 mt-8">About {broker.name}</h2>
            <p className="text-gray-300">{broker.description}</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <RegulatoryTrustScore brokerName={broker.name} regulators={broker.regulation.regulators} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-2">Accessibility</h3>
                    <dl>
                        <DetailItem label="Minimum Deposit">${broker.accessibility.minDeposit}</DetailItem>
                        <DetailItem label="Customer Support">{broker.accessibility.customerSupport.join(', ')}</DetailItem>
                    </dl>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-2">Trading Conditions</h3>
                    <dl>
                        <DetailItem label="EUR/USD Spread">{broker.tradingConditions.spreads.eurusd} pips</DetailItem>
                        <DetailItem label="Max Leverage">{broker.tradingConditions.maxLeverage}</DetailItem>
                        <DetailItem label="Commission">{broker.tradingConditions.commission}</DetailItem>
                    </dl>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-2">Technology</h3>
                    <dl>
                        <DetailItem label="Platforms">{broker.technology.platforms.join(', ')}</DetailItem>
                        <DetailItem label="Execution Type">{broker.technology.executionType}</DetailItem>
                    </dl>
                </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
                <Button onClick={handleCompareClick} variant={inCompare ? "secondary" : "primary"}>
                    {inCompare ? <Icons.compareRemove className="h-5 w-5 mr-2" /> : <Icons.compare className="h-5 w-5 mr-2" />}
                    {inCompare ? "Remove from Compare" : "Add to Compare"}
                </Button>
                <Link to="/compare">
                    <Button variant="ghost">Go to Comparison</Button>
                </Link>
            </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold">User Reviews ({reviews.length})</h2>
             {reviews.length > 0 && (
                <div className="flex items-center gap-4">
                    <div>
                        <label htmlFor="filter-rating" className="text-sm font-medium text-gray-400 mr-2">Filter:</label>
                        <select id="filter-rating" value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))} className="bg-input border-input rounded-md shadow-sm p-2">
                            <option value="0">All Ratings</option> <option value="5">5 Stars</option> <option value="4">4 Stars</option> <option value="3">3 Stars</option> <option value="2">2 Stars</option> <option value="1">1 Star</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="sort-order" className="text-sm font-medium text-gray-400 mr-2">Sort by:</label>
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
                        <div className="mb-4"><label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label><StarRatingInput rating={newRating} setRating={setNewRating} /></div>
                        <div className="mb-4"><label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">Your Comment</label><textarea id="comment" rows={4} className="block w-full bg-input border-input rounded-md shadow-sm p-2" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={`Share your experience with ${broker.name}...`} required></textarea></div>
                        <Button type="submit" disabled={isSubmitting || newRating === 0 || !newComment.trim()}>{isSubmitting ? 'Submitting...' : 'Submit Review'}</Button>
                    </form>
                </CardContent>
            </Card>
        ) : (
            <div className="text-center p-6 bg-card rounded-lg border border-input my-8"><p><Link to="/login" className="text-primary-400 font-semibold hover:underline">Log in</Link> to leave a review.</p></div>
        )}

        <div className="space-y-6">
            {displayedReviews.length > 0 ? (
                displayedReviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (<p className="text-center text-gray-400 py-8">{reviews.length > 0 ? 'No reviews match your selected filters.' : 'No reviews yet for this broker. Be the first to leave one!'}</p>)}
        </div>
      </div>
    </div>
  );
};

export default BrokerDetailPage;