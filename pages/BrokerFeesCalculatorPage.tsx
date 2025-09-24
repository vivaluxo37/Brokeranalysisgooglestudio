
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useComparison } from '../hooks/useComparison';
import { brokers as allBrokers } from '../data/brokers';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Broker } from '../types';

const AVAILABLE_PAIRS = [
    // Majors
    "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD",
    // Minors
    "EUR/GBP", "EUR/JPY", "GBP/JPY", "EUR/CHF", "GBP/CHF", "AUD/JPY", "NZD/JPY", "CAD/JPY", "CHF/JPY",
    // Exotics
    "USD/ZAR", "USD/TRY", "USD/MXN", "EUR/TRY",
    // Metals
    "XAU/USD", // Gold
    "XAG/USD", // Silver
    // Crypto
    "BTC/USD"
];

interface CalculationResult extends Broker {
    spreadCost: number;
    commissionCost: number;
    swapCost: number;
    totalCost: number;
}

const parseCommission = (commissionStr: string): number => {
    if (!commissionStr || typeof commissionStr !== 'string' || commissionStr.toLowerCase().includes('zero') || commissionStr.toLowerCase().includes('included')) {
      return 0;
    }
    const match = commissionStr.match(/(\d+\.?\d*)/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    
    if (commissionStr.toLowerCase().includes('per lot') && !commissionStr.toLowerCase().includes('round turn')) {
         return value * 2;
    }
    
    if(commissionStr.toLowerCase().includes('per side')){
        return value * 2;
    }

    return value;
};
  
const getEstimatedSwapRate = (category: 'Low' | 'Standard' | 'High'): number => {
    switch (category) {
        case 'Low': return -2;
        case 'Standard': return -5;
        case 'High': return -8;
        default: return -5;
    }
};

const getPipValue = (pair: string): number => {
    if (pair === 'XAU/USD' || pair === 'BTC/USD') {
        // For 1 lot (100oz Gold or 1 BTC), a $1 move is a "pip" worth $1 * lot multiplier, we simplify to $1 per pip here
        return 1;
    }
    if (pair === 'XAG/USD') {
         // 1 lot = 5000oz. 1 pip = $0.001. Pip value = 5000 * 0.001 = $5.
        return 5;
    }
    // Simplification for all forex pairs. For a standard lot on a XXX/USD pair, the pip value is $10.
    return 10;
};

const getSpreadForPair = (broker: Broker, pair: string): number => {
    // 1. Check detailed averageSpreads first
    const detailedSpread = broker.fees.trading.averageSpreads.find(s => s.pair === pair);
    if (detailedSpread && detailedSpread.spread) {
        const spreadMatch = detailedSpread.spread.match(/(\d+\.?\d*)/);
        if (spreadMatch) return parseFloat(spreadMatch[1]);
    }

    // 2. Check legacy spreads object for majors
    const legacyPairKey = pair.replace('/', '').toLowerCase() as 'eurusd' | 'gbpusd' | 'usdjpy';
    if (broker.tradingConditions.spreads[legacyPairKey]) {
        return broker.tradingConditions.spreads[legacyPairKey];
    }
    
    // 3. Estimate for other types as a fallback
    const baseSpread = broker.tradingConditions.spreads.eurusd;
    const pairType = (() => {
        if (["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD"].includes(pair)) return 'major';
        if (pair === 'XAU/USD') return 'gold';
        if (pair === 'XAG/USD') return 'silver';
        if (pair === 'BTC/USD') return 'crypto';
        if (pair.includes('ZAR') || pair.includes('TRY') || pair.includes('MXN')) return 'exotic';
        return 'minor';
    })();
    
    switch (pairType) {
        case 'minor': return baseSpread * 1.5;
        case 'exotic': return baseSpread * 5;
        case 'gold': return 20; // 20 cents
        case 'silver': return 30; // 3 cents, which are 30 pips of 0.001
        case 'crypto': return 30; // $30 spread
        default: return baseSpread;
    }
};


const BrokerFeesCalculatorPage: React.FC = () => {
    const { t } = useTranslation();
    const { comparisonList } = useComparison();
    const brokersToCompare = useMemo(() => allBrokers.filter(b => comparisonList.includes(b.id)), [comparisonList]);

    const [currencyPair, setCurrencyPair] = useState<string>('EUR/USD');
    const [tradesPerMonth, setTradesPerMonth] = useState('50');
    const [avgTradeSizeLots, setAvgTradeSizeLots] = useState('0.5');
    const [avgHoldingPeriodNights, setAvgHoldingPeriodNights] = useState('1');
    const [results, setResults] = useState<CalculationResult[] | null>(null);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numTrades = parseInt(tradesPerMonth, 10);
        const tradeSize = parseFloat(avgTradeSizeLots);
        const holdNights = parseInt(avgHoldingPeriodNights, 10);

        if (isNaN(numTrades) || isNaN(tradeSize) || isNaN(holdNights)) return;

        const monthlyVolumeLots = numTrades * tradeSize;

        const calculatedResults = brokersToCompare.map(broker => {
            const spreadInPips = getSpreadForPair(broker, currencyPair);
            const pipValue = getPipValue(currencyPair);
            
            const spreadCost = monthlyVolumeLots * spreadInPips * pipValue;
            
            const commissionPerLotRT = parseCommission(broker.tradingConditions.commission);
            const commissionCost = monthlyVolumeLots * commissionPerLotRT;
            
            const swapRate = getEstimatedSwapRate(broker.tradingConditions.swapFeeCategory);
            const swapCost = numTrades * tradeSize * holdNights * swapRate;
            
            const totalMonthlyCost = spreadCost + commissionCost + Math.abs(swapCost);
            const totalAnnualCost = totalMonthlyCost * 12;

            return {
                ...broker,
                spreadCost: spreadCost * 12,
                commissionCost: commissionCost * 12,
                swapCost: swapCost * 12,
                totalCost: totalAnnualCost
            };
        });
        
        calculatedResults.sort((a, b) => a.totalCost - b.totalCost);
        setResults(calculatedResults);
    };
    
    if (brokersToCompare.length < 2) {
        return (
            <div className="text-center py-20 bg-card rounded-lg border border-input">
                <h2 className="text-2xl font-semibold text-card-foreground/90">{t('tools.brokerFeesCalculator.emptyState.title')}</h2>
                <p className="mt-2 text-card-foreground/70">{t('tools.brokerFeesCalculator.emptyState.subtitle')}</p>
                <Link to="/brokers" className="mt-6 inline-block">
                    <Button>{t('tools.brokerFeesCalculator.emptyState.button')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">{t('tools.brokerFeesCalculator.title')}</h1>
                <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">{t('tools.brokerFeesCalculator.subtitle')}</p>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <h2 className="text-xl font-bold">Your Trading Profile</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label htmlFor="currencyPair" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.brokerFeesCalculator.currencyPair')}</label>
                            <select id="currencyPair" value={currencyPair} onChange={e => setCurrencyPair(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                                {AVAILABLE_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <Input 
                            label={t('tools.brokerFeesCalculator.tradesPerMonth')}
                            id="tradesPerMonth"
                            type="number"
                            value={tradesPerMonth}
                            onChange={e => setTradesPerMonth(e.target.value)}
                            min="1"
                        />
                        <Input 
                            label={t('tools.brokerFeesCalculator.avgTradeSizeLots')}
                            id="avgTradeSizeLots"
                            type="number"
                            value={avgTradeSizeLots}
                            onChange={e => setAvgTradeSizeLots(e.target.value)}
                            min="0.01"
                            step="0.01"
                        />
                        <Input 
                            label={t('tools.brokerFeesCalculator.avgHoldingPeriodNights')}
                            id="avgHoldingPeriodNights"
                            type="number"
                            value={avgHoldingPeriodNights}
                            onChange={e => setAvgHoldingPeriodNights(e.target.value)}
                            min="0"
                            step="1"
                        />
                        <Button type="submit" className="w-full">{t('tools.brokerFeesCalculator.calculate')}</Button>
                    </form>
                </CardContent>
            </Card>

            {results && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-center mb-6">{t('tools.brokerFeesCalculator.resultsTitle')}</h2>
                     <div className="overflow-x-auto bg-card rounded-lg border border-input">
                        <table className="w-full min-w-max text-left">
                            <thead>
                                <tr className="border-b border-input">
                                    <th className="p-4">{t('tools.brokerFeesCalculator.table.broker')}</th>
                                    <th className="p-4 text-right">{t('tools.brokerFeesCalculator.table.spreadCost')}</th>
                                    <th className="p-4 text-right">{t('tools.brokerFeesCalculator.table.commissionCost')}</th>
                                    <th className="p-4 text-right">{t('tools.brokerFeesCalculator.table.swapCost')}</th>
                                    <th className="p-4 text-right">{t('tools.brokerFeesCalculator.table.totalAnnualCost')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((broker, index) => (
                                    <tr key={broker.id} className={`border-b last:border-b-0 ${index === 0 ? 'bg-green-900/30' : ''}`}>
                                        <td className="p-4 font-semibold flex items-center gap-3">
                                            <img src={broker.logoUrl} alt={broker.name} className="h-8 bg-white p-1 rounded-md" />
                                            {broker.name}
                                            {index === 0 && <span className="text-xs font-bold text-green-300 bg-green-800 px-2 py-0.5 rounded-full">{t('tools.brokerFeesCalculator.cheapest')}</span>}
                                        </td>
                                        <td className="p-4 text-right font-mono">${broker.spreadCost.toFixed(2)}</td>
                                        <td className="p-4 text-right font-mono">${broker.commissionCost.toFixed(2)}</td>
                                        <td className="p-4 text-right font-mono">${broker.swapCost.toFixed(2)}</td>
                                        <td className="p-4 text-right font-mono font-bold text-lg">${broker.totalCost.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-center text-foreground/60 mt-4">*Swap costs are estimates based on the broker's swap fee category and may vary significantly. All costs are estimates for comparison purposes only.</p>
                </div>
            )}
        </div>
    );
};

export default BrokerFeesCalculatorPage;
