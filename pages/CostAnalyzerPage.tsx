import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../hooks/useComparison';
import { brokers as allBrokers } from '../data/brokers';
import { useLiveData, Instrument } from '../services/liveDataService';
import { getCostAnalysis, getPersonalizedCostProjection, TradingStyle } from '../services/geminiService';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Icons } from '../constants';
import { Broker } from '../types';

const PIP_VALUE_STANDARD_LOT = 10;

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    const commonProps: React.SVGProps<SVGSVGElement> = { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "inline-block ml-1" };
    if (direction === 'asc') return <svg {...commonProps}><path d="m18 15-6-6-6 6"/></svg>;
    if (direction === 'desc') return <svg {...commonProps}><path d="m6 9 6 6 6-6"/></svg>;
    return <svg {...commonProps} className={`${commonProps.className} opacity-30`}><path d="M8 9l4-4 4 4"/><path d="M16 15l-4 4-4-4"/></svg>;
};

interface EnrichedBrokerData extends Broker { spread: number; commission: number; totalCost: number; }
type SortableKeys = keyof Pick<EnrichedBrokerData, 'name' | 'spread' | 'commission' | 'totalCost'>;

const parseMarkdown = (text: string): string => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    // Check if it's an external link
    if (url.startsWith('http')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:underline">${linkText}</a>`;
    }
    // Internal link
    return `<a href="${url}" class="text-primary-400 hover:underline">${linkText}</a>`;
  });
  return html;
};


const CostAnalyzerPage: React.FC = () => {
    const { comparisonList } = useComparison();
    const [instrument, setInstrument] = useState<Instrument>('EUR/USD');
    const [tradingStyle, setTradingStyle] = useState<TradingStyle>('Day Trader');
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [loadingProjection, setLoadingProjection] = useState(false);
    const [projectionResult, setProjectionResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'totalCost', direction: 'asc' });
    
    const brokersToCompare = useMemo(() => allBrokers.filter(b => comparisonList.includes(b.id)), [comparisonList]);
    const liveData = useLiveData(comparisonList, instrument);
    
    const instruments: Instrument[] = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD'];
    const tradingStyles: TradingStyle[] = ['Scalper', 'Day Trader', 'Swing Trader'];

    const enrichedData = useMemo((): EnrichedBrokerData[] => brokersToCompare.map(broker => {
        const data = liveData.find(d => d.brokerId === broker.id);
        const totalCost = data ? (data.spread * PIP_VALUE_STANDARD_LOT) + data.commission : 0;
        return { ...broker, spread: data?.spread ?? 0, commission: data?.commission ?? 0, totalCost };
    }), [brokersToCompare, liveData]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        const sortableItems = [...enrichedData];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [enrichedData, sortConfig]);

    const minCost = useMemo(() => enrichedData.length === 0 ? Infinity : Math.min(...enrichedData.map(d => d.totalCost)), [enrichedData]);

    const handleGetAnalysis = async (type: 'general' | 'personal') => {
        const costDataForAI = sortedData.map(d => ({ name: d.name, websiteUrl: d.websiteUrl, spread: d.spread, commission: d.commission, totalCost: d.totalCost, swapCategory: d.tradingConditions.swapFeeCategory }));
        setError(null);

        if (type === 'general') {
            setLoadingAnalysis(true);
            setAnalysisResult(null);
            try {
                const generalCostData = costDataForAI.map(({ name, websiteUrl, spread, commission, totalCost }) => ({ name, websiteUrl, spread, commission, totalCost }));
                const result = await getCostAnalysis(instrument, generalCostData);
                setAnalysisResult(result);
            } catch (err) { setError('Failed to get AI analysis.'); console.error(err); }
            finally { setLoadingAnalysis(false); }
        } else {
            setLoadingProjection(true);
            setProjectionResult(null);
            try {
                const personalCostData = costDataForAI.map(({ name, websiteUrl, spread, commission, swapCategory }) => ({ name, websiteUrl, spread, commission, swapCategory }));
                const result = await getPersonalizedCostProjection({ style: tradingStyle, instrument, brokers: personalCostData });
                setProjectionResult(result);
            } catch (err) { setError('Failed to get AI projection.'); console.error(err); }
            finally { setLoadingProjection(false); }
        }
    };
    
    if (brokersToCompare.length === 0) return (
        <div className="text-center py-20 bg-card rounded-lg border border-input"><h2 className="text-2xl font-semibold text-card-foreground/90">Your comparison list is empty.</h2><p className="mt-2 text-card-foreground/70">Add brokers to the comparison list to use the Cost Analyzer.</p><Link to="/brokers" className="mt-6 inline-block"><Button>Browse Brokers</Button></Link></div>
    );
    
    const renderHeader = (label: string, key: SortableKeys, align: 'left' | 'right' = 'left') => (
        <th className={`p-4 text-${align} group`}><button className={`flex items-center w-full ${align === 'right' ? 'justify-end' : ''}`} onClick={() => requestSort(key)}><span className={sortConfig.key === key ? 'text-primary-400' : 'group-hover:text-foreground'}>{label}</span><SortIcon direction={sortConfig.key === key ? sortConfig.direction : undefined} /></button></th>
    );
    
    return (
        <div>
            <div className="text-center mb-10"><h1 className="text-4xl font-bold">Live Cost Analyzer</h1><p className="text-lg text-foreground/80 mt-2">Compare real-time trading costs for a standard lot.</p></div>
            
            <Card className="mb-8">
                <CardContent><p className="text-xs text-card-foreground/70 text-center">* Total cost is an estimate for trading 1 standard lot, assuming a pip value of $10. Data updates every 3 seconds. Swap fees are not included in this table.</p></CardContent>
            </Card>

            <div className="overflow-x-auto bg-card rounded-lg border border-input">
                <table className="w-full min-w-max text-left">
                    <thead>
                        <tr className="border-b border-input">
                            {renderHeader('Broker', 'name')}
                            {renderHeader('Live Spread (pips)', 'spread', 'right')}
                            {renderHeader('Commission ($)', 'commission', 'right')}
                            {renderHeader('Total Cost ($)', 'totalCost', 'right')}
                            <th className="p-4 text-right">Visit Site</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map(broker => {
                            const isCheapest = broker.totalCost === minCost && enrichedData.length > 1 && minCost > 0;
                            return (<tr key={broker.id} className={`border-b last:border-b-0 transition-colors ${isCheapest ? 'bg-green-900/30 border-green-800' : 'border-input'}`}>
                                <td className="p-4 flex items-center gap-3">
                                    <Link to={`/broker/${broker.id}`} className="flex items-center gap-3 group">
                                        <img src={broker.logoUrl} alt={broker.name} className="h-8 bg-white p-1 rounded-md" />
                                        <span className={`font-semibold ${isCheapest ? 'text-green-300' : ''} group-hover:underline`}>{broker.name}</span>
                                    </Link>
                                    {isCheapest && <span className="text-xs font-bold text-green-300 bg-green-800/60 px-2 py-0.5 rounded-full">Cheapest</span>}
                                </td>
                                <td className="p-4 text-right font-mono">{broker.spread.toFixed(2)}</td>
                                <td className="p-4 text-right font-mono">{broker.commission.toFixed(2)}</td>
                                <td className={`p-4 text-right font-bold text-lg font-mono ${isCheapest ? 'text-green-300' : 'text-primary-400'}`}>{broker.totalCost.toFixed(2)}</td>
                                <td className="p-4 text-right">
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
                    <CardHeader><h3 className="text-xl font-bold">General AI Analysis</h3></CardHeader>
                    <CardContent>
                         <div className="mb-4"><label htmlFor="instrument" className="block text-sm font-medium text-card-foreground/90 mb-1">Select Instrument</label><select id="instrument" value={instrument} onChange={e => setInstrument(e.target.value as Instrument)} className="bg-input border-input rounded-md w-full p-2">{instruments.map(inst => <option key={inst} value={inst}>{inst}</option>)}</select></div>
                        <Button onClick={() => handleGetAnalysis('general')} disabled={loadingAnalysis} className="w-full">{loadingAnalysis ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/>Get Instant Analysis</>}</Button>
                        {analysisResult && <div className="mt-4 text-card-foreground/90 whitespace-pre-wrap animate-fade-in" dangerouslySetInnerHTML={{ __html: parseMarkdown(analysisResult) }} />}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><h3 className="text-xl font-bold">Personalized AI Cost Projection</h3></CardHeader>
                    <CardContent>
                        <div className="mb-4"><label htmlFor="tradingStyle" className="block text-sm font-medium text-card-foreground/90 mb-1">Your Trading Style</label><select id="tradingStyle" value={tradingStyle} onChange={e => setTradingStyle(e.target.value as TradingStyle)} className="bg-input border-input rounded-md w-full p-2">{tradingStyles.map(style => <option key={style} value={style}>{style}</option>)}</select></div>
                        <Button onClick={() => handleGetAnalysis('personal')} disabled={loadingProjection} className="w-full">{loadingProjection ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/>Get My Projection</>}</Button>
                        {projectionResult && <div className="mt-4 text-card-foreground/90 whitespace-pre-wrap animate-fade-in" dangerouslySetInnerHTML={{ __html: parseMarkdown(projectionResult) }} />}
                    </CardContent>
                </Card>
            </div>
            {error && <p className="text-center mt-6 text-red-500">{error}</p>}
        </div>
    );
};

export default CostAnalyzerPage;