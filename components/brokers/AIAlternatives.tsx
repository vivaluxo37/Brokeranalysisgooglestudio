import React, { useState, useEffect } from 'react';
import { Broker } from '../../types';
import { getBrokerAlternatives } from '../../services/geminiService';
import { useBrokers } from '../../hooks/useBrokers';
import { Icons } from '../../constants';
import MiniBrokerCard from '../news/MiniBrokerCard';
import Spinner from '../ui/Spinner';

interface AIAlternativesProps {
    targetBroker: Broker;
}

const AIAlternatives: React.FC<AIAlternativesProps> = ({ targetBroker }) => {
    const { brokers: allBrokers } = useBrokers();
    const [recommendations, setRecommendations] = useState<{ broker: Broker; reasoning: string; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlternatives = async () => {
            if (!allBrokers || allBrokers.length === 0) {
                setIsLoading(true);
                return;
            }
            
            setIsLoading(true);
            setError(null);
            try {
                const result = await getBrokerAlternatives(targetBroker, allBrokers);
                const enrichedRecs = result.recommendations
                    .map(rec => {
                        const broker = allBrokers.find(b => b.id === rec.brokerId);
                        return broker ? { broker, reasoning: rec.reasoning } : null;
                    })
                    .filter((r): r is { broker: Broker; reasoning: string } => r !== null)
                    .slice(0, 3); // Ensure max 3 are shown

                setRecommendations(enrichedRecs);
            } catch (err) {
                console.error("Failed to fetch AI alternatives:", err);
                setError("AI Analyst could not generate alternatives at this time.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlternatives();
    }, [targetBroker, allBrokers]);

    if (isLoading) {
        return (
            <div className="pt-16 -mt-16" id="alternatives">
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-primary-400 mb-4 flex items-center gap-2">
                        <Icons.bot className="h-6 w-6" />
                        Finding Alternatives...
                    </h2>
                    <div className="flex justify-center p-8"><Spinner /></div>
                </div>
            </div>
        );
    }
    
    if (error || recommendations.length === 0) {
        return null; // Don't render the section if there's an error or no recommendations
    }

    return (
        <div id="alternatives" className="pt-16 -mt-16">
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-primary-400 mb-4 flex items-center gap-2">
                    <Icons.bot className="h-6 w-6" />
                    Alternatives to {targetBroker.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map(({ broker, reasoning }) => (
                        <div key={`ai-alternative-${broker.id}`} className="flex flex-col gap-2">
                            <MiniBrokerCard broker={broker} />
                            <p className="text-xs text-center italic text-card-foreground/70 p-2 bg-input/40 rounded-md">
                                "{reasoning}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIAlternatives;
