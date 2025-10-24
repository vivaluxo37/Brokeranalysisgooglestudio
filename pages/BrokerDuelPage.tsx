import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brokers } from '../data/brokers';
import NotFoundPage from './NotFoundPage';
import ComparisonTable from '../components/brokers/ComparisonTable';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Icons } from '../constants';
import { getDuelVerdict } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';

const BrokerDuelPage: React.FC = () => {
  const { brokerId1, brokerId2 } = useParams<{ brokerId1: string, brokerId2: string }>();
  const broker1 = brokers.find(b => b.id === brokerId1);
  const broker2 = brokers.find(b => b.id === brokerId2);

  const [loadingVerdict, setLoadingVerdict] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!broker1 || !broker2) {
    return <NotFoundPage />;
  }

  const handleGetVerdict = async () => {
      setLoadingVerdict(true);
      setVerdict(null);
      setError(null);
      try {
          const result = await getDuelVerdict(broker1, broker2);
          setVerdict(result);
      } catch (err) {
          setError("Failed to generate AI verdict. Please try again.");
          console.error(err);
      } finally {
          setLoadingVerdict(false);
      }
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4">
            <Link to={`/broker/${broker1.id}`}><img src={broker1.logoUrl} alt={broker1.name} className="h-20 bg-white p-2 rounded-md"/></Link>
            <Icons.duel className="h-12 w-12 text-primary-500" />
            <Link to={`/broker/${broker2.id}`}><img src={broker2.logoUrl} alt={broker2.name} className="h-20 bg-white p-2 rounded-md"/></Link>
        </div>
        <h1 className="text-4xl font-bold mt-4">{broker1.name} vs {broker2.name}</h1>
        <p className="text-lg text-foreground/80 mt-2">A head-to-head showdown.</p>
      </div>

       <div className="text-center mb-8">
            <Button onClick={handleGetVerdict} disabled={loadingVerdict} size="lg">
                {loadingVerdict ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/>Get AI Verdict</>}
            </Button>
        </div>

        {error && <p className="text-center mb-6 text-red-500">{error}</p>}

        {verdict && (
            <Card className="mb-8 max-w-4xl mx-auto animate-fade-in bg-gradient-to-tr from-primary-900/50 to-card">
                <CardHeader>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-yellow-400">
                        <Icons.bot className="h-6 w-6"/>
                        The Verdict is In!
                    </h3>
                </CardHeader>
                <CardContent>
                    <p className="text-card-foreground/90 text-lg whitespace-pre-wrap">{verdict}</p>
                </CardContent>
            </Card>
        )}

      <ComparisonTable brokers={[broker1, broker2]} />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a href={broker1.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" className="w-full">Visit {broker1.name}</Button>
          </a>
          <a href={broker2.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" className="w-full">Visit {broker2.name}</Button>
          </a>
      </div>

      <div className="text-center mt-8">
          <Link to="/compare">
            <Button variant="secondary">Back to Comparison</Button>
          </Link>
      </div>
    </div>
  );
};

export default BrokerDuelPage;