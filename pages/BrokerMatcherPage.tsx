import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Broker, MatcherHistoryItem, BrokerMatcherPreferences } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { getBrokerRecommendations } from '../services/geminiService';
import { Icons } from '../constants';
import { useAuth } from '../hooks/useAuth';
import Tooltip from '../components/ui/Tooltip';
import { useTranslation } from '../hooks/useTranslation';
import { countries } from '../data/countries';

const initialPreferences: BrokerMatcherPreferences = {
    country: 'United Kingdom',
    experience: '',
    feeStructure: '',
    depositMethod: '',
    currencyPairs: '',
    specialPreferences: [],
};

const BrokerMatcherPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const [preferences, setPreferences] = useState<BrokerMatcherPreferences>(initialPreferences);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ recommendations: Broker[], reasoning: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const steps = [
        { name: 'country', title: "Where do you live?", tooltip: "Brokers are regulated differently in each country. This ensures we only recommend brokers available to you.", isSelect: true, options: countries },
        { name: 'experience', title: "How familiar are you with trading?", tooltip: "This helps us match you with a platform that suits your skill level, from simple interfaces for beginners to advanced tools for experts.", options: ["I'm a first-timer", "I've made a few trades", "I have experience", "I'm a professional"] },
        { name: 'feeStructure', title: "What fee structure would you prefer?", tooltip: "Choose 'Low spreads' for scalping, 'Low overnight fee' for long-term trades, or 'Both' for a balanced approach.", options: ["Low spreads", "Low overnight fee", "Both", "I don't know"] },
        { name: 'depositMethod', title: "How would you like to deposit funds?", tooltip: "Select your preferred method to ensure a smooth and convenient funding process.", options: ["Bank transfer", "Credit/debit card", "PayPal", "Skrill", "I don't know"] },
        { name: 'currencyPairs', title: "Which currency pairs would you like to trade?", tooltip: "Majors have the lowest spreads, while exotics can offer more volatility and opportunity.", options: ["Major currencies", "Minor currencies", "Exotic currencies", "I don't know"] },
        { name: 'specialPreferences', title: "Any special preferences? (Pick up to 5)", isMultiSelect: true, options: [
            { value: 'Fast account opening', tooltip: 'Look for brokers with a fully digital and quick onboarding process.' },
            { value: 'Quick withdrawal', tooltip: 'Prioritize brokers known for processing withdrawals quickly and with low fees.' },
            { value: 'Exclude risky countries', tooltip: 'Filter out brokers regulated in jurisdictions with lower investor protection standards.' },
            { value: 'Educational resources', tooltip: 'Find brokers who provide extensive articles, videos, and webinars to help you learn.' },
            { value: 'Great research tools', tooltip: 'Get access to advanced charting, market analysis, and news feeds.' },
            { value: 'ECN account', tooltip: 'For direct market access with raw spreads and a fixed commission, ideal for scalpers.' },
            { value: 'Islamic account', tooltip: 'Find brokers offering swap-free accounts that comply with Sharia law.' },
            { value: 'Copy trading', tooltip: 'Follow and automatically copy the trades of successful traders.' },
            { value: 'Superb customer service', tooltip: 'Choose brokers with highly-rated, responsive support via live chat, phone, and email.' },
            { value: 'API access', tooltip: 'For algorithmic traders who want to connect their own custom trading software.' },
        ]}
    ];

    const handleSingleSelect = (name: keyof BrokerMatcherPreferences, value: string) => {
        setPreferences(prev => ({ ...prev, [name]: value }));
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handleMultiSelect = (value: string) => {
        setPreferences(prev => {
            const currentPrefs = prev.specialPreferences;
            if (currentPrefs.includes(value)) {
                return { ...prev, specialPreferences: currentPrefs.filter(p => p !== value) };
            }
            if (currentPrefs.length < 5) {
                return { ...prev, specialPreferences: [...currentPrefs, value] };
            }
            return prev; // Do nothing if 5 are already selected
        });
    };

    const saveResultsToHistory = (reasoning: string, recommendedBrokerIds: string[]) => {
      if (!user) return;
      const key = `matcherHistory_${user.id}`;
      const newHistoryItem: MatcherHistoryItem = {
          id: `match_${Date.now()}`,
          timestamp: new Date().toISOString(),
          preferences,
          reasoning,
          recommendedBrokerIds,
      };
      
      try {
          const existingHistory: MatcherHistoryItem[] = JSON.parse(localStorage.getItem(key) || '[]');
          const updatedHistory = [newHistoryItem, ...existingHistory];
          localStorage.setItem(key, JSON.stringify(updatedHistory));
      } catch (e) {
          console.error("Failed to save matcher history to localStorage:", e);
      }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const response = await getBrokerRecommendations(preferences, allBrokers);
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

    const isFinalStep = currentStep === steps.length - 1;

    if (loading) return <div className="flex flex-col items-center justify-center py-20"><Spinner size="lg"/><p className="mt-4 text-lg text-foreground/80">Our AI is finding your perfect broker...</p></div>;
    
    if (results) return (
        <div className="mt-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-4">Your Top Matches</h2>
            <Card className="max-w-3xl mx-auto mb-8 animate-fade-in">
                <CardHeader><h3 className="text-xl font-bold flex items-center gap-2"><Icons.bot className="h-6 w-6 text-primary-400" /> AI Analysis</h3></CardHeader>
                <CardContent><p className="text-card-foreground/90 italic">{results.reasoning}</p></CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.recommendations.map((broker, index) => (
                    <div key={broker.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 150}ms`}}>
                        <BrokerCard broker={broker} isRecommended={true} />
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <Button variant="secondary" onClick={() => { setResults(null); setCurrentStep(0); setPreferences(initialPreferences); }}>Start Over</Button>
            </div>
        </div>
    );
    
    const currentStepData = steps[currentStep];

    return (
        <div>
            <div className="text-center mb-10"><h1 className="text-4xl font-bold">AI Broker Matcher</h1><p className="text-lg text-foreground/80 mt-2">Answer a few questions and let our AI do the work.</p></div>
            <Card className="max-w-3xl mx-auto">
                <CardContent>
                    <div className="mb-4"><div className="w-full bg-input rounded-full h-2.5"><div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div></div></div>
                    <div key={currentStep} className="text-center p-4 md:p-8 min-h-[300px] flex flex-col justify-center animate-fade-in">
                        <h2 className="text-2xl font-semibold text-card-foreground flex justify-center items-center gap-2">
                            {currentStepData.title}
                            {currentStepData.tooltip && <Tooltip content={currentStepData.tooltip}><span className="text-foreground/50 cursor-help"><Icons.helpCircle className="h-5 w-5" /></span></Tooltip>}
                        </h2>
                        <div className={`mt-6 gap-3 ${currentStepData.isMultiSelect ? 'flex flex-wrap justify-center' : 'grid grid-cols-1 sm:grid-cols-2'}`}>
                            {currentStepData.isSelect && (
                                <select value={preferences.country} onChange={(e) => handleSingleSelect('country', e.target.value)} className="w-full sm:col-span-2 bg-input border-input rounded-md shadow-sm p-3">
                                    {currentStepData.options.map(option => <option key={option} value={option}>{option}</option>)}
                                </select>
                            )}
                            {!currentStepData.isSelect && !currentStepData.isMultiSelect && currentStepData.options.map(option => (
                                <Button key={option} variant={preferences[currentStepData.name as keyof typeof preferences] === option ? 'primary' : 'secondary'} onClick={() => handleSingleSelect(currentStepData.name as keyof BrokerMatcherPreferences, option)} className="justify-center h-12 text-base">{option}</Button>
                            ))}
                            {currentStepData.isMultiSelect && currentStepData.options.map(option => (
                                <Tooltip key={option.value} content={option.tooltip}>
                                <button
                                    onClick={() => handleMultiSelect(option.value)}
                                    disabled={preferences.specialPreferences.length >= 5 && !preferences.specialPreferences.includes(option.value)}
                                    className={`px-4 py-2 rounded-full border-2 transition-colors text-sm font-semibold
                                        ${preferences.specialPreferences.includes(option.value) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-card border-input hover:border-primary-400'}
                                        ${preferences.specialPreferences.length >= 5 && !preferences.specialPreferences.includes(option.value) ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >{option.value}</button>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border-t border-input">
                        <Button variant="ghost" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>Back</Button>
                        {isFinalStep ? (
                            <Button onClick={handleSubmit} size="lg">Find My Broker</Button>
                        ) : (
                             <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!preferences[currentStepData.name as keyof BrokerMatcherPreferences]}>Next</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            {error && <p className="text-center mt-6 text-red-500">{error}</p>}
        </div>
    );
};

export default BrokerMatcherPage;