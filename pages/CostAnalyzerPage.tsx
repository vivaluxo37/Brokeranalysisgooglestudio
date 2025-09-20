import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../hooks/useComparison';
import { brokers as allBrokers } from '../data/brokers';
import { useLiveData, Instrument } from '../services/liveDataService';
import { getCostAnalysis } from '../services/geminiService';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Icons } from '../constants';
import { Broker } from '../types';

const PIP_VALUE_STANDARD_LOT = 10; // For USD based pairs, as an approximation.

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    // FIX: Explicitly type commonProps to satisfy SVGProps type requirements for properties like strokeLinecap.
    const commonProps: React.SVGProps<SVGSVGElement> = { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "inline-block ml-1" };
    if (direction === 'asc') return <svg {...commonProps}><path d="m18 15-6-6-6 6"/></svg>;
    if (direction === 'desc') return <svg {...commonProps}><path d="m6 9 6 6 6-6"/></svg>;
    return <svg {...commonProps} className={`${commonProps.className} opacity-30`}><path d="M8 9l4-4 4 4"/><path d="M16 15l-4 4-4-4"/></svg>;
};

interface EnrichedBrokerData extends Broker {
    spread: number;
    commission: number;
    totalCost: number;
}
type SortableKeys = keyof Pick<EnrichedBrokerData, 'name' | 'spread' | 'commission' | 'totalCost'>;


const CostAnalyzerPage: React.FC = () => {
    const { comparisonList } = useComparison();
    const [instrument, setInstrument] = useState<Instrument>('EUR/USD');
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({ key: 'totalCost', direction: 'asc' });
    
    const brokersToCompare = useMemo(() => allBrokers.filter(b => comparisonList.includes(b.id)), [comparisonList]);
    const liveData = useLiveData(comparisonList, instrument);
    
    const instruments: Instrument[] = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD'];

    const enrichedData = useMemo((): EnrichedBrokerData[] => {
        return brokersToCompare.map(broker => {
            const data = liveData.find(d => d.brokerId === broker.id);
            const totalCost = data ? (data.spread * PIP_VALUE_STANDARD_LOT) + data.commission : 0;
            return {
                ...broker,
                spread: data?.spread ?? 0,
                commission: data?.commission ?? 0,
                totalCost,
            };
        });
    }, [brokersToCompare, liveData]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        const sortableItems = [...enrichedData];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [enrichedData, sortConfig]);

    const minCost = useMemo(() => {
        if (enrichedData.length === 0) return Infinity;
        return Math.min(...enrichedData.map(d => d.totalCost));
    }, [enrichedData]);


    const handleGetAnalysis = async () => {
        setLoadingAnalysis(true);
        setAnalysisResult(null);
        setError(null);
        
        const costDataForAI = sortedData.map(d => ({
            brokerName: d.name,
            spread: d.spread,
            commission: d.commission,
            totalCost: d.totalCost,
        }));

        try {
            const result = await getCostAnalysis(instrument, costDataForAI);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('Failed to get AI analysis. Please try again later.');
        } finally {
            setLoadingAnalysis(false);
        }
    };
    
    if (brokersToCompare.length === 0) {
        return (
            <div className="text-center py-20 bg-card rounded-lg border border-input">
                <h2 className="text-2xl font-semibold text-gray-300">Your comparison list is empty.</h2>
                <p className="mt-2 text-gray-400">Add brokers to the comparison list to use the Cost Analyzer.</p>
                <Link to="/brokers" className="mt-6 inline-block">
                    <Button>Browse Brokers</Button>
                </Link>
            </div>
        );
    }
    
    const renderHeader = (label: string, key: SortableKeys, align: 'left' | 'right' = 'left') => {
        const isSorted = sortConfig.key === key;
        return (
            <th className={`p-4 text-${align} group`}>
                <button
                    className={`flex items-center w-full ${align === 'right' ? 'justify-end' : ''}`}
                    onClick={() => requestSort(key)}
                >
                    <span className={isSorted ? 'text-primary-400' : 'group-hover:text-gray-200'}>{label}</span>
                    <SortIcon direction={isSorted ? sortConfig.direction : undefined} />
                </button>
            </th>
        );
    };
    
    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">Live Cost Analyzer</h1>
                <p className="text-lg text-gray-400 mt-2">Compare real-time trading costs for a standard lot.</p>
            </div>
            
            <Card className="mb-8">
                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <label htmlFor="instrument" className="block text-sm font-medium text-gray-300 mb-1">Select Instrument</label>
                        <select
                            id="instrument"
                            value={instrument}
                            onChange={(e) => setInstrument(e.target.value as Instrument)}
                            className="bg-input border-input rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2"
                        >
                            {instruments.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                        </select>
                    </div>
                    <p className="text-xs text-gray-400 text-center md:text-right max-w-xs">
                        * Total cost is an estimate for trading 1 standard lot, assuming a pip value of $10. Data updates every 3 seconds.
                    </p>
                </CardContent>
            </Card>

            <div className="overflow-x-auto bg-card rounded-lg border border-input">
                <table className="w-full min-w-max text-left">
                    <thead>
                        <tr className="border-b border-input">
                            {renderHeader('Broker', 'name')}
                            {renderHeader('Live Spread (pips)', 'spread', 'right')}
                            {renderHeader('Commission ($)', 'commission', 'right')}
                            {renderHeader('Total Cost ($)', 'totalCost', 'right')}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((broker) => {
                            const isCheapest = broker.totalCost === minCost && enrichedData.length > 1 && minCost > 0;
                            return (
                                <tr key={broker.id} className={`border-b last:border-b-0 transition-colors ${isCheapest ? 'bg-green-900/30 border-green-800' : 'border-input'}`}>
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={broker.logoUrl} alt={broker.name} className="h-8 bg-white p-1 rounded-md" />
                                        <span className={`font-semibold ${isCheapest ? 'text-green-300' : ''}`}>{broker.name}</span>
                                        {isCheapest && <span className="text-xs font-bold text-green-300 bg-green-800/60 px-2 py-0.5 rounded-full">Cheapest</span>}
                                    </td>
                                    <td className="p-4 text-right font-mono">{broker.spread.toFixed(2)}</td>
                                    <td className="p-4 text-right font-mono">{broker.commission.toFixed(2)}</td>
                                    <td className={`p-4 text-right font-bold text-lg font-mono ${isCheapest ? 'text-green-300' : 'text-primary-400'}`}>{broker.totalCost.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-8">
                <Button onClick={handleGetAnalysis} disabled={loadingAnalysis} size="lg">
                    {loadingAnalysis ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/> Get AI Cost Analysis</>}
                </Button>
            </div>
            
            {error && <p className="text-center mt-6 text-red-500">{error}</p>}
            
            {analysisResult && (
                <Card className="mt-8 max-w-3xl mx-auto animate-fade-in">
                    <CardHeader>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Icons.bot className="h-6 w-6 text-primary-400"/>
                            AI Analysis for {instrument}
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-300 whitespace-pre-wrap">{analysisResult}</p>
                    </CardContent>
                </Card>
            )}

        </div>
    );
};

export default CostAnalyzerPage;
