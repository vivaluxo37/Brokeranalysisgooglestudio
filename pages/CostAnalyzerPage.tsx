import React, { useState, useMemo } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useComparison } from '../hooks/useComparison';
import { brokers as allBrokers } from '../data/brokers';
import { useLiveData, Instrument } from '../services/liveDataService';
import { getCostAnalysis } from '../services/geminiService';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Icons } from '../constants';
import { Broker } from '../types';
import Input from '../components/ui/Input';

const PIP_VALUE_STANDARD_LOT = 10;
const TRADING_DAYS_PER_MONTH = 21;

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    const commonProps: React.SVGProps<SVGSVGElement> = { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "inline-block ltr:ml-1 rtl:mr-1" };
    if (direction === 'asc') return <svg {...commonProps}><path d="m18 15-6-6-6 6"/></svg>;
    if (direction === 'desc') return <svg {...commonProps}><path d="m6 9 6 6 6-6"/></svg>;
    return <svg {...commonProps} className={`${commonProps.className} opacity-30`}><path d="M8 9l4-4 4 4"/><path d="M16 15l-4 4-4-4"/></svg>;
};

interface EnrichedBrokerData extends Broker { 
    spread: number; 
    commission: number; 
    totalCost: number;
    monthlyCost: number | null;
}
type SortableKeys = keyof Pick<EnrichedBrokerData, 'name' | 'spread' | 'commission' | 'totalCost' | 'monthlyCost'>;

const parseMarkdown = (text: string): string => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    if (url.startsWith('http')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:underline">${linkText}</a>`;
    }
    return `<a href="${url}" class="text-primary-400 hover:underline">${linkText}</a>`;
  });
  return html;
};


const CostAnalyzerPage: React.FC = () => {
    const { comparisonList } = useComparison();
    const [instrument, setInstrument] = useState<Instrument>('EUR/USD');
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'totalCost', direction: 'asc' });
    
    // State for strategy simulator
    const [tradesPerDay, setTradesPerDay] = useState('20');
    const [tradeSize, setTradeSize] = useState('0.5');
    const [monthlyCosts, setMonthlyCosts] = useState<Record<string, number | null>>({});

    const brokersToCompare = useMemo(() => allBrokers.filter(b => comparisonList.includes(b.id)), [comparisonList]);
    const liveData = useLiveData(comparisonList, instrument);
    
    const instruments: Instrument[] = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD'];

    const enrichedData = useMemo((): EnrichedBrokerData[] => brokersToCompare.map(broker => {
        const data = liveData.find(d => d.brokerId === broker.id);
        const totalCost = data ? (data.spread * PIP_VALUE_STANDARD_LOT) + data.commission : 0;
        return { 
            ...broker, 
            spread: data?.spread ?? 0, 
            commission: data?.commission ?? 0, 
            totalCost,
            monthlyCost: monthlyCosts[broker.id] ?? null
        };
    }), [brokersToCompare, liveData, monthlyCosts]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        const sortableItems = [...enrichedData];
        sortableItems.sort((a, b) => {
            const valA = a[sortConfig.key] ?? Infinity;
            const valB = b[sortConfig.key] ?? Infinity;
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [enrichedData, sortConfig]);

    const minCost = useMemo(() => enrichedData.length === 0 ? Infinity : Math.min(...enrichedData.map(d => d.totalCost)), [enrichedData]);
    const minMonthlyCost = useMemo(() => {
        const costs = Object.values(monthlyCosts).filter((c): c is number => c !== null);
        return costs.length > 0 ? Math.min(...costs) : Infinity;
    }, [monthlyCosts]);


    const handleGetAnalysis = async () => {
        const costDataForAI = sortedData.map(d => ({ name: d.name, websiteUrl: d.websiteUrl, spread: d.spread, commission: d.commission, totalCost: d.totalCost }));
        setError(null);
        setLoadingAnalysis(true);
        setAnalysisResult(null);
        try {
            const result = await getCostAnalysis(instrument, costDataForAI);
            setAnalysisResult(result);
        } catch (err) { setError('Failed to get AI analysis.'); console.error(err); }
        finally { setLoadingAnalysis(false); }
    };
    
    const handleCalculateProjections = () => {
        const perDay = parseInt(tradesPerDay, 10);
        const size = parseFloat(tradeSize);
        if (isNaN(perDay) || isNaN(size) || perDay <= 0 || size <= 0) {
            setMonthlyCosts({});
            return;
        }

        const newCosts: Record<string, number> = {};
        enrichedData.forEach(broker => {
            const costPerTrade = broker.totalCost * size;
            const monthlyCost = costPerTrade * perDay * TRADING_DAYS_PER_MONTH;
            newCosts[broker.id] = monthlyCost;
        });
        setMonthlyCosts(newCosts);
        setSortConfig({ key: 'monthlyCost', direction: 'asc' });
    };
    
    if (brokersToCompare.length === 0) return (
        <div className="text-center py-20 bg-card rounded-lg border border-input"><h2 className="text-2xl font-semibold text-card-foreground/90">Your comparison list is empty.</h2><p className="mt-2 text-card-foreground/70">Add brokers to the comparison list to use the Cost Analyzer.</p><ReactRouterDOM.Link to="/brokers" className="mt-6 inline-block"><Button>Browse Brokers</Button></ReactRouterDOM.Link></div>
    );
    
    const renderHeader = (label: string, key: SortableKeys, align: 'start' | 'end' = 'start') => (
        <th className={`p-4 text-${align} group`}><button className={`flex items-center w-full ${align === 'end' ? 'justify-end' : ''}`} onClick={() => requestSort(key)}><span className={sortConfig.key === key ? 'text-primary-400' : 'group-hover:text-foreground'}>{label}</span><SortIcon direction={sortConfig.key === key ? sortConfig.direction : undefined} /></button></th>
    );
    
    return (
        <div>
            <div className="text-center mb-10"><h1 className="text-4xl font-bold">Live Cost Analyzer</h1><p className="text-lg text-foreground/80 mt-2">Compare real-time trading costs and project your monthly expenses.</p></div>
            
            <Card className="mb-8">
                <CardContent><p className="text-xs text-card-foreground/70 text-center">* Total cost is an estimate for trading 1 standard lot, assuming a pip value of $10. Data updates every 3 seconds. Monthly projection excludes swap fees.</p></CardContent>
            </Card>

            <div className="overflow-x-auto bg-card rounded-lg border border-input">
                <table className="w-full min-w-max">
                    <thead>
                        <tr className="border-b border-input">
                            {renderHeader('Broker', 'name', 'start')}
                            {renderHeader('Live Spread (pips)', 'spread', 'end')}
                            {renderHeader('Commission ($)', 'commission', 'end')}
                            {renderHeader('Total Cost ($)', 'totalCost', 'end')}
                            {renderHeader('Projected Monthly Cost ($)', 'monthlyCost', 'end')}
                            <th className="p-4 text-end">Visit Site</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map(broker => {
                            const isCheapest = broker.totalCost === minCost && enrichedData.length > 1 && minCost > 0;
                            const isCheapestMonthly = broker.monthlyCost !== null && broker.monthlyCost === minMonthlyCost && Object.keys(monthlyCosts).length > 1;
                            const highlightClass = isCheapestMonthly ? 'bg-green-900/30 border-green-800' : (isCheapest ? 'bg-green-900/10' : 'border-input');
                            
                            return (<tr key={broker.id} className={`border-b last:border-b-0 transition-colors ${highlightClass}`}>
                                <td className="p-4 flex items-center gap-3">
                                    <ReactRouterDOM.Link to={`/broker/${broker.id}`} className="flex items-center gap-3 group">
                                        <img src={broker.logoUrl} alt={broker.name} className="h-8 bg-white p-1 rounded-md" />
                                        <span className={`font-semibold ${isCheapestMonthly ? 'text-green-300' : ''} group-hover:underline`}>{broker.name}</span>
                                    </ReactRouterDOM.Link>
                                </td>
                                <td className="p-4 text-end font-mono">{broker.spread.toFixed(2)}</td>
                                <td className="p-4 text-end font-mono">{broker.commission.toFixed(2)}</td>
                                <td className={`p-4 text-end font-bold text-lg font-mono ${isCheapest ? 'text-primary-400' : ''}`}>{broker.totalCost.toFixed(2)}</td>
                                <td className={`p-4 text-end font-bold text-lg font-mono ${isCheapestMonthly ? 'text-green-300' : 'text-primary-400'}`}>
                                    {broker.monthlyCost !== null ? broker.monthlyCost.toFixed(2) : '-'}
                                    {isCheapestMonthly && <span className="block text-xs font-bold text-green-400">Cheapest</span>}
                                </td>
                                <td className="p-4 text-end">
                                    <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="primary" size="sm">
                                            Visit
                                        </Button>
                                    </a>
                                </td>
                               </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Card>
                    <CardHeader><h3 className="text-xl font-bold">Strategy Cost Simulator</h3></CardHeader>
                    <CardContent className="space-y-4">
                        <Input 
                            label="Trades per Day"
                            id="tradesPerDay"
                            type="number"
                            value={tradesPerDay}
                            onChange={e => setTradesPerDay(e.target.value)}
                            min="1"
                        />
                        <Input 
                            label="Trade Size (Lots)"
                            id="tradeSize"
                            type="number"
                            value={tradeSize}
                            onChange={e => setTradeSize(e.target.value)}
                            min="0.01"
                            step="0.01"
                        />
                        <Button onClick={handleCalculateProjections} className="w-full">Calculate Projections</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><h3 className="text-xl font-bold">General AI Analysis</h3></CardHeader>
                    <CardContent>
                         <div className="mb-4"><label htmlFor="instrument" className="block text-sm font-medium text-card-foreground/90 mb-1">Select Instrument</label><select id="instrument" value={instrument} onChange={e => setInstrument(e.target.value as Instrument)} className="bg-input border-input rounded-md w-full p-2">{instruments.map(inst => <option key={inst} value={inst}>{inst}</option>)}</select></div>
                        <Button onClick={handleGetAnalysis} disabled={loadingAnalysis} className="w-full">{loadingAnalysis ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/>Get Instant Analysis</>}</Button>
                        {analysisResult && <div className="mt-4 text-card-foreground/90 whitespace-pre-wrap animate-fade-in" dangerouslySetInnerHTML={{ __html: parseMarkdown(analysisResult) }} />}
                    </CardContent>
                </Card>
            </div>
            {error && <p className="text-center mt-6 text-red-500">{error}</p>}
        </div>
    );
};

export default CostAnalyzerPage;