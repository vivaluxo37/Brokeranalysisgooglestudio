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
        { name: 'country', title: t('brokerMatcherPage.steps.country.title'), tooltip: t('brokerMatcherPage.steps.country.tooltip'), isSelect: true, options: countries },
        { name: 'experience', title: t('brokerMatcherPage.steps.experience.title'), tooltip: t('brokerMatcherPage.steps.experience.tooltip'), options: t('brokerMatcherPage.steps.experience.options') },
        { name: 'feeStructure', title: t('brokerMatcherPage.steps.feeStructure.title'), tooltip: t('brokerMatcherPage.steps.feeStructure.tooltip'), options: t('brokerMatcherPage.steps.feeStructure.options') },
        { name: 'depositMethod', title: t('brokerMatcherPage.steps.depositMethod.title'), tooltip: t('brokerMatcherPage.steps.depositMethod.tooltip'), options: t('brokerMatcherPage.steps.depositMethod.options') },
        { name: 'currencyPairs', title: t('brokerMatcherPage.steps.currencyPairs.title'), tooltip: t('brokerMatcherPage.steps.currencyPairs.tooltip'), options: t('brokerMatcherPage.steps.currencyPairs.options') },
        { name: 'specialPreferences', title: t('brokerMatcherPage.steps.specialPreferences.title'), isMultiSelect: true, options: t('brokerMatcherPage.steps.specialPreferences.options')
        }
    ];

    const handleSingleSelect = (name: keyof BrokerMatcherPreferences, value: string) => {
        setPreferences(prev => ({ ...prev, [name]: value }));
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handleMultiSelect = (key: string) => {
        setPreferences(prev => {
            const currentPrefs = prev.specialPreferences;
            if (currentPrefs.includes(key)) {
                return { ...prev, specialPreferences: currentPrefs.filter(p => p !== key) };
            }
            if (currentPrefs.length < 5) {
                return { ...prev, specialPreferences: [...currentPrefs, key] };
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

    if (loading) return <div className="flex flex-col items-center justify-center py-20"><Spinner size="lg"/><p className="mt-4 text-lg text-foreground/80">{t('brokerMatcherPage.loading')}</p></div>;
    
    if (results) return (
        <div className="mt-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-4">{t('brokerMatcherPage.results.title')}</h2>
            <Card className="max-w-3xl mx-auto mb-8 animate-fade-in">
                <CardHeader><h3 className="text-xl font-bold flex items-center gap-2"><Icons.bot className="h-6 w-6 text-primary-400" /> {t('brokerMatcherPage.results.aiAnalysis')}</h3></CardHeader>
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
                <Button variant="secondary" onClick={() => { setResults(null); setCurrentStep(0); setPreferences(initialPreferences); }}>{t('brokerMatcherPage.results.startOver')}</Button>
            </div>
        </div>
    );
    
    const currentStepData = steps[currentStep];

    return (
        <div>
            <div className="text-center mb-10"><h1 className="text-4xl font-bold">{t('brokerMatcherPage.title')}</h1><p className="text-lg text-foreground/80 mt-2">{t('brokerMatcherPage.subtitle')}</p></div>
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
                            {!currentStepData.isSelect && !currentStepData.isMultiSelect && Array.isArray(currentStepData.options) && currentStepData.options.map((option: {key: string, text: string}) => (
                                <Button key={option.key} variant={preferences[currentStepData.name as keyof typeof preferences] === option.key ? 'primary' : 'secondary'} onClick={() => handleSingleSelect(currentStepData.name as keyof BrokerMatcherPreferences, option.key)} className="justify-center h-12 text-base">{option.text}</Button>
                            ))}
                            {currentStepData.isMultiSelect && Array.isArray(currentStepData.options) && currentStepData.options.map((option: { key: string, text: string, tooltip: string }) => (
                                <Tooltip key={option.key} content={option.tooltip}>
                                <button
                                    onClick={() => handleMultiSelect(option.key)}
                                    disabled={preferences.specialPreferences.length >= 5 && !preferences.specialPreferences.includes(option.key)}
                                    className={`px-4 py-2 rounded-full border-2 transition-colors text-sm font-semibold
                                        ${preferences.specialPreferences.includes(option.key) ? 'bg-primary-600 border-primary-500 text-white' : 'bg-card border-input hover:border-primary-400'}
                                        ${preferences.specialPreferences.length >= 5 && !preferences.specialPreferences.includes(option.key) ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >{option.text}</button>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border-t border-input">
                        <Button variant="ghost" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>{t('brokerMatcherPage.back')}</Button>
                        {isFinalStep ? (
                            <Button onClick={handleSubmit} size="lg">{t('brokerMatcherPage.findMyBroker')}</Button>
                        ) : (
                             <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!preferences[currentStepData.name as keyof BrokerMatcherPreferences] && currentStepData.name !== 'country'}>{t('allBrokersPage.results.noResultsSubtitle') === 'Try adjusting your filters to find more results.' ? 'Next' : 'Далее'}</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            {error && <p className="text-center mt-6 text-red-500">{error}</p>}
        </div>
    );
};

export default BrokerMatcherPage;