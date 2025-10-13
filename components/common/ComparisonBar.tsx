import React, { useContext } from 'react';
import { ComparisonContext } from '../../contexts/ComparisonContext';
import { brokers as allBrokers } from '../../data/brokers';
import { Button } from '../ui/button';
import { Icons } from '../../constants';
import * as ReactRouterDOM from 'react-router-dom';

const ComparisonBar: React.FC = () => {
    const location = ReactRouterDOM.useLocation();
    
    // Safely access context - return null if not available yet
    const context = useContext(ComparisonContext);
    if (!context) {
        return null; // Context not loaded yet, don't render anything
    }
    
    const { comparisonList, clearComparison, removeBrokerFromComparison } = context;

    if (comparisonList.length === 0 || location.pathname === '/compare' || location.pathname.startsWith('/compare/')) {
        return null;
    }

    const brokersToCompare = allBrokers.filter(b => comparisonList.includes(b.id));

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-fade-in" style={{ animationName: 'fadeInUp' }}>
             <style>
                {`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-card/80 backdrop-blur-lg border-t border-x border-input rounded-t-lg shadow-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-x-auto">
                        <span className="font-semibold text-card-foreground hidden md:block">Comparing:</span>
                        {brokersToCompare.map(broker => (
                            <div key={`comparison-${broker.id}`} className="relative flex-shrink-0 group">
                                <img src={broker.logoUrl} alt={broker.name} className="h-10 bg-white p-1 rounded-md" />
                                <button
                                    onClick={() => removeBrokerFromComparison(broker.id)}
                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label={`Remove ${broker.name}`}
                                >
                                    <Icons.close className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={clearComparison}>
                            Clear All
                        </Button>
                        <ReactRouterDOM.Link to="/cost-analyzer">
                            <Button variant="default" size="sm" className="flex items-center gap-2">
                                <Icons.calculator className="h-4 w-4" />
                                Cost Analyzer
                            </Button>
                        </ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/compare">
                            <Button variant="default" size="sm">
                                Compare Now ({comparisonList.length})
                            </Button>
                        </ReactRouterDOM.Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonBar;
