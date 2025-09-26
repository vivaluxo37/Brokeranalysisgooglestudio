import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import { Broker, StrategyMatcherHistoryItem } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { getStrategyBrokerRecommendations } from '../services/geminiService';
import { Icons } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import BrokerQuickViewModal from '../components/brokers/BrokerQuickViewModal';

const exampleStrategies = [
    "I scalp EUR/USD on the 5-minute chart during the London open using MACD crossovers. I need an ECN broker with very low spreads and fast execution on MT5.",
    "I am a swing trader holding positions for several days on major pairs like GBP/USD. Low overnight swap fees are my top priority.",
    "I'm a beginner looking for a broker with a low minimum deposit, a user-friendly platform, and good educational resources to start with.",
    "I run an automated trading strategy (EA) on MT4. I need a broker with reliable EA support, fast execution, and a free VPS option.",
    "I want to copy trade successful investors. I'm looking for a broker with a large, reputable social trading network and transparent performance stats.",
    "I trade based on fundamental analysis and news events. I need a broker with low slippage, fast execution, and an integrated news feed."
];

const BrokerMatcherPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const [strategy, setStrategy] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ recommendations: Broker[], reasoning: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

    const handleOpenQuickView = (broker: Broker) => {
      setSelectedBroker(broker);
    };

    const handleCloseQuickView = () => {
      setSelectedBroker(null);
    };

    const saveResultsToHistory = (reasoning: string, recommendedBrokerIds: string[]) => {
      if (!user) return;
      const key = `strategyMatcherHistory_${user.id}`;
      const newHistoryItem: StrategyMatcherHistoryItem = {
          id: `match_${Date.now()}`,
          timestamp: new Date().toISOString(),
          strategy,
          reasoning,
          recommendedBrokerIds,
      };
      
      try {
          const existingHistory: StrategyMatcherHistoryItem[] = JSON.parse(localStorage.getItem(key) || '[]');
          const updatedHistory = [newHistoryItem, ...existingHistory].slice(0, 10); // Keep last 10
          localStorage.setItem(key, JSON.stringify(updatedHistory));
      } catch (e) {
          console.error("Failed to save matcher history to localStorage:", e);
      }
    };

    const handleSubmit = async () => {
        if (!strategy.trim()) return;
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const response = await getStrategyBrokerRecommendations(strategy, allBrokers);
            const recommendedBrokers = allBrokers.filter(b => response.recommendedBrokerIds.includes(b.id));

            if (recommendedBrokers.length === 0) throw new Error("AI could not find matching brokers based on your criteria.");

            setResults({ recommendations: recommendedBrokers, reasoning: response.reasoning });
            saveResultsToHistory(response.reasoning, response.recommendedBrokerIds);
        } catch (err: any) {
            setError(err.message || 'Failed to get recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (results) return (
        <div className="mt-4 animate-fade-in">
            <BrokerQuickViewModal broker={selectedBroker} onClose={handleCloseQuickView} />
            <h2 className="text-3xl font-bold text-center mb-4">{t('brokerMatcherPage.results.title')}</h2>
            <Card className="max-w-3xl mx-auto mb-8 animate-fade-in">
                <CardHeader><h3 className="text-xl font-bold flex items-center gap-2"><Icons.bot className="h-6 w-6 text-primary-400" /> {t('brokerMatcherPage.results.aiAnalysis')}</h3></CardHeader>
                <CardContent><p className="text-card-foreground/90 italic">{results.reasoning}</p></CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.recommendations.map((broker, index) => (
                    <div key={broker.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 150}ms`}}>
                        <BrokerCard broker={broker} isRecommended={true} onQuickView={handleOpenQuickView} />
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <Button variant="secondary" onClick={() => { setResults(null); setStrategy(''); }}>{t('brokerMatcherPage.results.startOver')}</Button>
            </div>
        </div>
    );
    
    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">AI Strategy-to-Broker Matcher</h1>
                <p className="text-lg text-foreground/80 mt-2 max-w-2xl mx-auto">Describe your trading strategy, and our AI will find the perfect broker for you.</p>
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                    <label htmlFor="strategy-input" className="block text-lg font-semibold text-card-foreground mb-3">Describe your trading style</label>
                    <textarea
                        id="strategy-input"
                        rows={5}
                        className="w-full bg-input border-input rounded-md shadow-sm p-3 placeholder:text-foreground/60 focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., I'm a beginner looking for a user-friendly platform with a low minimum deposit..."
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                    />
                    <div className="mt-4">
                        <p className="text-xs text-center text-foreground/60 mb-2">Need inspiration? Click an example:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {exampleStrategies.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => setStrategy(example)}
                                    className="px-2 py-1 text-xs rounded-full bg-input hover:bg-primary-900/50 text-foreground/80 transition-colors"
                                >
                                    {example.substring(0, 30)}...
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={loading || !strategy.trim()}
                            size="lg"
                        >
                            {loading ? <Spinner /> : "Find My Broker"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {error && <p className="text-center mt-6 text-red-500">{error}</p>}
        </div>
    );
};

export default BrokerMatcherPage;