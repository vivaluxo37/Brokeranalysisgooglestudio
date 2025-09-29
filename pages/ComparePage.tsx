import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../hooks/useComparison';
import { useBrokers } from '../hooks/useBrokers';
import ComparisonTable from '../components/brokers/ComparisonTable';
import { Button } from '../components/ui/button';
import { getComparisonSummary } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Icons } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const ComparePage: React.FC = () => {
  const { comparisonList, clearComparison } = useComparison();
  const { brokers: allBrokers, loading: brokersLoading } = useBrokers();
  const { t } = useTranslation();
  
  const brokersToCompare = useMemo(() => {
    return allBrokers.filter(broker => comparisonList.includes(broker.id));
  }, [allBrokers, comparisonList]);
  
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetSummary = async () => {
      setLoadingSummary(true);
      setSummary(null);
      setError(null);
      try {
          const result = await getComparisonSummary(brokersToCompare);
          setSummary(result);
      } catch (err) {
          setError("Failed to generate AI summary. Please try again.");
          console.error(err);
      } finally {
          setLoadingSummary(false);
      }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-bold">{t('comparePage.title')}</h1>
            <p className="text-lg text-foreground/80 mt-2">{t('comparePage.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
            {brokersToCompare.length === 2 && (
                 <Link to={`/compare/${brokersToCompare[0].id}/vs/${brokersToCompare[1].id}`}>
                    <Button variant="primary">
                        <Icons.duel className="h-5 w-5 mr-2" />
                        {t('comparePage.startDuel')}
                    </Button>
                 </Link>
            )}
             {brokersToCompare.length > 0 && (
                <Button onClick={clearComparison} variant="danger">
                    {t('comparePage.clearAll')}
                </Button>
            )}
        </div>
      </div>
      
      {brokersToCompare.length > 1 && (
        <div className="text-center mb-8">
            <Button onClick={handleGetSummary} disabled={loadingSummary} size="lg">
                {loadingSummary ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/> {t('comparePage.getAiSummary')}</>}
            </Button>
        </div>
      )}
      
      {error && <p className="text-center mb-6 text-red-500">{error}</p>}

      {summary && (
        <Card className="mb-8 max-w-4xl mx-auto animate-fade-in">
            <CardHeader>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Icons.bot className="h-6 w-6 text-primary-400"/>
                    {t('comparePage.aiAnalysis')}
                </h3>
            </CardHeader>
            <CardContent>
                <div className="text-card-foreground/90 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-400">$1</strong>') }} />
            </CardContent>
        </Card>
      )}


      {brokersToCompare.length > 0 ? (
        <ComparisonTable brokers={brokersToCompare} />
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border border-input">
          <h2 className="text-2xl font-semibold text-card-foreground/90">{t('comparePage.empty.title')}</h2>
          <p className="mt-2 text-card-foreground/70">{t('comparePage.empty.subtitle')}</p>
          <Link to="/brokers" className="mt-6 inline-block">
            <Button>{t('comparePage.empty.button')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ComparePage;