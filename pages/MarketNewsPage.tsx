import React, { useState, useEffect } from 'react';
import { Broker, NewsArticle } from '../types';
import { mockNewsData } from '../data/news';
import { getNewsAnalysis } from '../services/geminiService';
import { brokers as allBrokers } from '../data/brokers';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Icons } from '../constants';
import MiniBrokerCard from '../components/news/MiniBrokerCard';
import Badge from '../components/ui/Badge';

const MarketNewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [analysis, setAnalysis] = useState<{ analysis: string; brokers: Broker[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sortedNews = [...mockNewsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setNews(sortedNews);
    if (sortedNews.length > 0) {
      setSelectedArticle(sortedNews[0]);
    }
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!selectedArticle) return;

      setIsLoading(true);
      setError(null);
      setAnalysis(null);
      try {
        const result = await getNewsAnalysis(selectedArticle, allBrokers);
        const recommendedBrokers = allBrokers.filter(b => result.recommendedBrokerIds.includes(b.id));
        setAnalysis({
          analysis: result.analysis,
          brokers: recommendedBrokers,
        });
      } catch (err) {
        console.error("Failed to get news analysis:", err);
        setError("The AI analyst is currently unavailable. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedArticle]);

  const getImportanceBadge = (importance: 'High' | 'Medium' | 'Low') => {
    switch (importance) {
      case 'High': return <Badge variant="danger">{importance} Impact</Badge>;
      case 'Medium': return <Badge variant="warning">{importance} Impact</Badge>;
      case 'Low': return <Badge variant="primary">{importance} Impact</Badge>;
      default: return null;
    }
  };

  return (
    <div>
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Market News & AI Analysis</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
                Stay ahead of the market. Select a news event to see how our AI connects it to actionable trading insights and broker recommendations.
            </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Live News Feed</h2>
                    </CardHeader>
                    <div className="divide-y divide-input">
                        {news.map(article => (
                            <button
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className={`w-full text-left p-4 transition-colors ${selectedArticle?.id === article.id ? 'bg-primary-900/40' : 'hover:bg-input/50'}`}
                                aria-pressed={selectedArticle?.id === article.id}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            {getImportanceBadge(article.importance)}
                                            <span className="text-xs text-foreground/60">{new Date(article.date).toLocaleString()}</span>
                                        </div>
                                        <h3 className="font-bold text-card-foreground">{article.title}</h3>
                                        <p className="text-sm text-card-foreground/80 mt-1">{article.summary}</p>
                                    </div>
                                    <Icons.chevronRight className={`h-5 w-5 text-foreground/50 flex-shrink-0 mt-1 transition-transform ${selectedArticle?.id === article.id ? 'translate-x-1' : ''}`} />
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <Card className="animate-fade-in">
                        <CardHeader>
                            <h2 className="text-xl font-bold flex items-center gap-2"><Icons.bot className="h-6 w-6 text-primary-400" /> AI Analyst Desk</h2>
                        </CardHeader>
                        <CardContent className="min-h-[300px] flex flex-col justify-center">
                            {isLoading && (
                                <div className="text-center space-y-2">
                                    <Spinner />
                                    <p className="text-sm text-foreground/70">Analyzing market impact...</p>
                                </div>
                            )}
                            {error && <p className="text-center text-red-500">{error}</p>}
                            {analysis && !isLoading && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <h4 className="font-semibold text-primary-400 mb-2">Analysis</h4>
                                        <p className="text-sm text-card-foreground/90 italic">"{analysis.analysis}"</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary-400 mb-2">Recommended Brokers</h4>
                                        <div className="space-y-2">
                                            {analysis.brokers.length > 0 ? (
                                                analysis.brokers.map(broker => <MiniBrokerCard key={broker.id} broker={broker} />)
                                            ) : (
                                                <p className="text-sm text-card-foreground/70">Could not determine specific broker recommendations for this event.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!isLoading && !analysis && !error && (
                                 <p className="text-center text-sm text-foreground/70">Select an article from the feed to view AI analysis.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MarketNewsPage;
