import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Broker, MatcherHistoryItem } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { getBrokerRecommendations } from '../services/geminiService';
import { Icons } from '../constants';
import { useAuth } from '../hooks/useAuth';
import Tooltip from '../components/ui/Tooltip';
import { useTranslation } from '../hooks/useTranslation';

const BrokerMatcherPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    {
      name: 'experience',
      title: t('brokerMatcherPage.steps.0.title'),
      options: t('brokerMatcherPage.steps.0.options'),
    },
    {
      name: 'minDeposit',
      title: t('brokerMatcherPage.steps.1.title'),
      options: t('brokerMatcherPage.steps.1.options'),
    },
    {
      name: 'platforms',
      title: t('brokerMatcherPage.steps.2.title'),
      options: t('brokerMatcherPage.steps.2.options'),
      isTextInput: true,
      placeholder: t('brokerMatcherPage.steps.2.placeholder')
    },
    {
      name: 'priority',
      title: t('brokerMatcherPage.steps.3.title'),
      options: t('brokerMatcherPage.steps.3.options'),
      isTextInput: true,
      placeholder: t('brokerMatcherPage.steps.3.placeholder')
    },
  ];


  const [preferences, setPreferences] = useState({
    experience: '',
    platforms: '',
    minDeposit: 'Under $200',
    priority: '',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ recommendations: Broker[], reasoning: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleOptionClick = (name: string, value: string) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPreferences({ ...preferences, [e.target.name]: e.target.value });
  }

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
        const depositMapping = {
            'Under $200': '200',
            '$200 - $1000': '1000',
            '$1000 - $5000': '5000',
            '$5000+': '100000'
        };
        const apiPreferences = {
            ...preferences,
            minDeposit: depositMapping[preferences.minDeposit as keyof typeof depositMapping]
        }

        const response = await getBrokerRecommendations(apiPreferences, allBrokers);
        const recommendedBrokers = allBrokers.filter(b => response.recommendedBrokerIds.includes(b.id));

        if (recommendedBrokers.length === 0) {
            throw new Error("AI could not find matching brokers based on your criteria.");
        }

        setResults({ recommendations: recommendedBrokers, reasoning: response.reasoning });
        saveResultsToHistory(response.reasoning, response.recommendedBrokerIds);
      } catch (err: any) {
        setError(err.message || t('brokerMatcherPage.results.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
  };
  
  const isFinalStep = currentStep === steps.length -1;

  if (loading) {
      return <div className="flex flex-col items-center justify-center py-20"><Spinner size="lg"/><p className="mt-4 text-lg text-foreground/80">{t('brokerMatcherPage.loading')}</p></div>;
  }
  
  if (results) {
      return (
        <div className="mt-4 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-4">{t('brokerMatcherPage.results.title')}</h2>
          <Card className="max-w-3xl mx-auto mb-8 animate-fade-in">
            <CardHeader>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Icons.bot className="h-6 w-6 text-primary-400" />
                    {t('brokerMatcherPage.results.aiAnalysis')}
                </h3>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground/90 italic">{results.reasoning}</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.recommendations.map((broker, index) => (
              <div key={broker.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 150}ms`}}>
                <BrokerCard broker={broker} isRecommended={true} />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
              <Button variant="secondary" onClick={() => { setResults(null); setCurrentStep(0); setPreferences({ experience: '', platforms: '', minDeposit: 'Under $200', priority: '' }); }}>{t('brokerMatcherPage.results.startOver')}</Button>
          </div>
        </div>
      );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">{t('brokerMatcherPage.title')}</h1>
        <p className="text-lg text-foreground/80 mt-2">{t('brokerMatcherPage.subtitle')}</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <div className="mb-4">
              <div className="w-full bg-input rounded-full h-2.5">
                  <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
              </div>
          </div>
          <div key={currentStep} className="text-center p-8 min-h-[250px] flex flex-col justify-center animate-fade-in">
            <h2 className="text-2xl font-semibold text-card-foreground">{steps[currentStep].title}</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps[currentStep].options.map(option => (
                <Button 
                    key={option} 
                    variant={preferences[steps[currentStep].name as keyof typeof preferences] === option ? 'primary' : 'secondary'}
                    onClick={() => handleOptionClick(steps[currentStep].name, option)}
                    className="justify-center"
                >
                    {option}
                </Button>
              ))}
            </div>
            {steps[currentStep].isTextInput && (
                 <input 
                    type="text" 
                    name={steps[currentStep].name}
                    placeholder={steps[currentStep].placeholder}
                    onChange={handleTextInputChange}
                    className="mt-4 block w-full bg-background border-input rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-3 text-center"
                 />
            )}
          </div>
           <div className="flex justify-between items-center p-4 border-t border-input">
                <Button variant="ghost" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
                    {t('brokerMatcherPage.back')}
                </Button>
                {isFinalStep && (
                    <Tooltip content={t('brokerMatcherPage.tooltip')}>
                      <Button onClick={handleSubmit} size="lg" disabled={!preferences.priority}>
                          {t('brokerMatcherPage.findMyBroker')}
                      </Button>
                    </Tooltip>
                )}
           </div>
        </CardContent>
      </Card>
      
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}
    </div>
  );
};

export default BrokerMatcherPage;
