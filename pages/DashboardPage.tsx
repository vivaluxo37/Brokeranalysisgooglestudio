
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { MatcherHistoryItem, Broker } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icons } from '../constants';

// A reusable accordion component for the dashboard
const AccordionItem: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-input last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 px-6 text-left hover:bg-input/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div>
            <span className="font-semibold text-primary-400">{title}</span>
            <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <Icons.chevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6 bg-background">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for the "Quick Actions" section
// FIX: Changed icon prop from React.ReactElement to React.ElementType and updated component to render it directly to fix a TypeScript error with React.cloneElement.
const QuickActionCard: React.FC<{ to: string, icon: React.ElementType<{ className?: string }>, title: string, description: string }> = ({ to, icon: Icon, title, description }) => (
    <Link to={to} className="block group">
        <Card className="h-full hover:border-primary-600 hover:-translate-y-1 transition-all">
            <CardContent className="flex items-start gap-4">
                <div className="p-3 bg-input rounded-lg text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
            </CardContent>
        </Card>
    </Link>
);


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { favoritesList } = useFavorites();
  const [history, setHistory] = useState<MatcherHistoryItem[]>([]);

  useEffect(() => {
    if (user) {
      const key = `matcherHistory_${user.id}`;
      try {
        const storedHistory = JSON.parse(localStorage.getItem(key) || '[]');
        setHistory(storedHistory);
      } catch (e) {
        console.error("Failed to load matcher history:", e);
        setHistory([]);
      }
    }
  }, [user]);

  const favoriteBrokers = allBrokers.filter(b => favoritesList.includes(b.id));

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-lg text-gray-400 mt-2">This is your personal dashboard to track and manage your broker research.</p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard to="/broker-matcher" icon={Icons.bot} title="New AI Match" description="Find a new broker tailored to you." />
          <QuickActionCard to="/compare" icon={Icons.layers} title="Compare Brokers" description="View your comparison list." />
          <QuickActionCard to="/cost-analyzer" icon={Icons.data} title="Cost Analyzer" description="Analyze live trading fees." />
          <QuickActionCard to="/brokers" icon={Icons.shieldCheck} title="Explore All Brokers" description="Browse our full broker list." />
      </div>


      {/* AI Match History */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Your AI Broker Match History</h2>
        </CardHeader>
        <CardContent className="p-0">
          {history.length > 0 ? (
            <div className="divide-y divide-input">
              {history.map(item => {
                const matchedBrokers = allBrokers.filter(b => item.recommendedBrokerIds.includes(b.id));
                const title = `Match for a ${item.preferences.experience} Trader`;
                const subtitle = `Priority: ${item.preferences.priority} | ${new Date(item.timestamp).toLocaleDateString()}`;
                return (
                    <AccordionItem key={item.id} title={title} subtitle={subtitle}>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-primary-400 mb-2">AI Analysis:</h4>
                                <p className="text-gray-300 italic">"{item.reasoning}"</p>
                            </div>
                            <div>
                               <h4 className="font-semibold text-primary-400 mb-4">Recommended Brokers for this Match:</h4>
                               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {matchedBrokers.map(broker => <BrokerCard key={broker.id} broker={broker} isRecommended={true} />)}
                               </div>
                            </div>
                        </div>
                    </AccordionItem>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
                <p className="text-gray-400">You haven't used the AI Broker Matcher yet.</p>
                <Link to="/broker-matcher" className="mt-4 inline-block">
                    <Button variant="primary">Find Your First Match</Button>
                </Link>
            </div>
          )}
        </CardContent>
      </Card>

       {/* Favorite Brokers */}
       <Card>
        <CardHeader>
            <h2 className="text-2xl font-semibold">Your Favorite Brokers</h2>
        </CardHeader>
        <CardContent>
            {favoriteBrokers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteBrokers.map(broker => <BrokerCard key={broker.id} broker={broker} />)}
                </div>
            ) : (
                <div className="text-center py-12 px-6">
                    <p className="text-gray-400">You haven't favorited any brokers yet. Click the star icon on a broker to save it here.</p>
                     <Link to="/brokers" className="mt-4 inline-block">
                        <Button variant="secondary">Explore Brokers</Button>
                    </Link>
                </div>
            )}
        </CardContent>
       </Card>

    </div>
  );
};

export default DashboardPage;
