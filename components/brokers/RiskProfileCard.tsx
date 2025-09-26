import React, { useState, useEffect } from 'react';
import { Broker, Signal } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/card';
import Spinner from '../ui/Spinner';
import { Icons } from '../../constants';
import { getRiskAnalysis } from '../../services/geminiService';

interface RiskProfileCardProps {
  broker: Broker;
}

const getRiskColors = (level: 'Low' | 'Medium' | 'High' | 'Critical') => {
  switch (level) {
    case 'Low': return { text: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700', progress: 'stroke-green-500' };
    case 'Medium': return { text: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', progress: 'stroke-yellow-500' };
    case 'High': return { text: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700', progress: 'stroke-orange-500' };
    case 'Critical': return { text: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700', progress: 'stroke-red-500' };
    default: return { text: 'text-gray-400', bg: 'bg-gray-900/30', border: 'border-gray-700', progress: 'stroke-gray-500' };
  }
};

const SignalIcon: React.FC<{ type: Signal['type'] }> = ({ type }) => {
  const iconMap = {
    'REGULATOR_WARNING': Icons.shieldAlert,
    'URL_FLAG': Icons.globe,
    'BLACKLIST': Icons.list,
    'USER_COMPLAINTS': Icons.users,
    'HEURISTIC': Icons.brainCircuit,
  };
  const Icon = iconMap[type];
  return <Icon className="h-5 w-5 text-card-foreground/80 flex-shrink-0" />;
};

const RiskScoreGauge: React.FC<{ score: number, color: string }> = ({ score, color }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative h-32 w-32">
            <svg className="h-full w-full" viewBox="0 0 120 120">
                <circle
                    className="stroke-current text-input"
                    strokeWidth="10"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`stroke-current ${color}`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${color.replace('stroke', 'text')}`}>{score}</span>
                <span className="text-xs text-foreground/70">/ 100</span>
            </div>
        </div>
    );
};

const RiskProfileCard: React.FC<RiskProfileCardProps> = ({ broker }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(broker.riskProfile?.summary || null);
  const [isLoading, setIsLoading] = useState(!broker.riskProfile?.summary && (broker.riskProfile?.signals.length ?? 0) > 0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!broker.riskProfile || broker.riskProfile.signals.length === 0 || broker.riskProfile.summary) {
        setIsLoading(false);
        return;
    }

    const fetchSummary = async () => {
      try {
        const summary = await getRiskAnalysis(broker.name, broker.riskProfile!.signals);
        setAiSummary(summary);
      } catch (error) {
        console.error("Failed to get AI risk summary:", error);
        setAiSummary("AI analysis failed. Please assess the signals manually.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [broker.name, broker.riskProfile]);

  if (!broker.riskProfile) {
    return null;
  }

  const { score, level, signals } = broker.riskProfile;
  const colors = getRiskColors(level);

  return (
    <Card className={`mt-8 border-2 ${colors.border}`}>
      <CardHeader className={`flex items-center gap-3 ${colors.bg}`}>
        <Icons.shieldAlert className={`h-8 w-8 ${colors.text}`} />
        <h2 className={`text-2xl font-bold ${colors.text}`}>Scam Broker Shield: {level} Risk</h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
            <RiskScoreGauge score={score} color={colors.progress} />
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-card-foreground">AI Risk Analysis</h3>
                {isLoading ? (
                    <div className="flex items-center gap-2 mt-2"><Spinner size="sm" /> <span className="text-sm text-foreground/70">Generating summary...</span></div>
                ) : (
                    <p className="text-card-foreground/90 italic mt-1">{aiSummary}</p>
                )}
            </div>
        </div>
        
        {signals.length > 0 && (
            <div className="mt-6">
                 <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left font-semibold flex items-center justify-between">
                    <span>Detected Signals ({signals.length})</span>
                    <Icons.chevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-input pt-4 animate-fade-in">
                        {signals.map((signal, index) => (
                            <div key={index} className="flex items-start gap-4 p-3 bg-input/50 rounded-lg">
                                <SignalIcon type={signal.type} />
                                <div className="flex-1">
                                    <p className="font-semibold text-card-foreground">{signal.source}</p>
                                    <p className="text-sm text-card-foreground/80">{signal.description}</p>
                                </div>
                                {signal.evidenceUrl && (
                                    <a href={signal.evidenceUrl} target="_blank" rel="nofollow noopener" className="text-primary-400 hover:text-primary-300 flex-shrink-0">
                                        <Icons.externalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskProfileCard;
