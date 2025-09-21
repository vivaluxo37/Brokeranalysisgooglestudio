

import React, { useState, useMemo } from 'react';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { getAIRecommendation } from '../services/geminiService';
import { AIRecommendation, Broker } from '../types';
import { Icons } from '../constants';
import Spinner from '../components/ui/Spinner';
import Card, { CardContent, CardHeader } from '../components/ui/Card';


// Utility to parse leverage string like "1:500" into a number 500
const parseLeverage = (leverageStr: string): number => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  if (leverageStr.toLowerCase().includes('unlimited')) return Infinity;
  const num = parseInt(leverageStr.split(':')[1], 10);
  return isNaN(num) ? 0 : num;
};

// Get unique list of regulators for the filter dropdown
const allRegulators = [...new Set(allBrokers.flatMap(b => b.regulation.regulators))].sort();

const initialFilters = {
    searchTerm: '',
    minDeposit: 'any',
    maxLeverage: 'any',
    regulator: 'any',
    executionTypes: [] as string[],
    spread: 'any',
    commission: 'any',
    platforms: [] as string[],
    algoSupport: [] as string[],
    copyTrading: 'any',
    minLotSize: 'any',
};

type TradingStyle = 'Scalping' | 'Algorithmic' | 'Copy Trading' | 'Swing Trading';
type FilterKeys = keyof typeof initialFilters;

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-input last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-3 text-left font-semibold text-card-foreground"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <Icons.chevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pb-4 pt-2 space-y-3">{children}</div>
                </div>
            </div>
        </div>
    );
};

const AllBrokersPage: React.FC = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleCheckboxChange = (group: FilterKeys, value: string) => {
    setFilters(prev => {
        const currentGroup = prev[group as 'executionTypes' | 'platforms' | 'algoSupport'];
        const newGroup = currentGroup.includes(value)
            ? currentGroup.filter(item => item !== value)
            : [...currentGroup, value];
        return { ...prev, [group]: newGroup };
    });
  };

  const handleRadioChange = (group: FilterKeys, value: string) => {
      setFilters(prev => ({ ...prev, [group]: value }));
  };

  const applyStylePreset = (style: TradingStyle) => {
      let newFilters = { ...initialFilters };
      switch(style) {
          case 'Scalping':
              newFilters = { ...newFilters, executionTypes: ['ECN', 'STP'], spread: 'ultra-low', commission: 'commission', minLotSize: 'micro' };
              break;
          case 'Algorithmic':
              newFilters = { ...newFilters, executionTypes: ['ECN'], algoSupport: ['eaSupport', 'apiAccess'] };
              break;
          case 'Copy Trading':
              newFilters = { ...newFilters, copyTrading: 'yes' };
              break;
          case 'Swing Trading':
               newFilters = { ...newFilters, maxLeverage: 'low' }; // Low leverage for long-term holds
              break;
      }
      setFilters(newFilters);
  };

  const filteredBrokers = useMemo(() => {
    setAiRecommendation(null);
    setAiError(null);

    return allBrokers.filter(broker => {
        if (filters.searchTerm && !broker.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
        if (filters.minDeposit !== 'any') {
            if (broker.accessibility.minDeposit > parseInt(filters.minDeposit, 10)) return false;
        }
        if (filters.maxLeverage !== 'any') {
            const leverage = parseLeverage(broker.tradingConditions.maxLeverage);
            if (filters.maxLeverage === 'low' && leverage > 100) return false;
            if (filters.maxLeverage === 'medium' && (leverage <= 100 || leverage >= 500)) return false;
            if (filters.maxLeverage === 'high' && leverage < 500) return false;
        }
        if (filters.regulator !== 'any' && !broker.regulation.regulators.includes(filters.regulator)) return false;
        if (filters.executionTypes.length > 0 && !filters.executionTypes.some(et => broker.technology.executionType.includes(et))) return false;
        if (filters.spread !== 'any') {
            const spread = broker.tradingConditions.spreads.eurusd;
            if (filters.spread === 'ultra-low' && spread > 0.5) return false;
            if (filters.spread === 'low' && (spread <= 0.5 || spread > 1.0)) return false;
            if (filters.spread === 'standard' && spread <= 1.0) return false;
        }
        if (filters.commission !== 'any') {
             const hasCommission = !broker.tradingConditions.commission.toLowerCase().includes('zero');
             if (filters.commission === 'commission' && !hasCommission) return false;
             if (filters.commission === 'zero' && hasCommission) return false;
        }
        if (filters.platforms.length > 0 && !filters.platforms.every(p => broker.technology.platforms.includes(p))) return false;
        if (filters.algoSupport.length > 0) {
            if (filters.algoSupport.includes('eaSupport') && !broker.technology.eaSupport) return false;
            if (filters.algoSupport.includes('apiAccess') && !broker.technology.apiAccess) return false;
        }
        if (filters.copyTrading !== 'any') {
             if (filters.copyTrading === 'yes' && !broker.copyTrading) return false;
             if (filters.copyTrading === 'no' && broker.copyTrading) return false;
        }
        if (filters.minLotSize !== 'any') {
            const lotSize = broker.tradingConditions.minLotSize || 0.01;
            if (filters.minLotSize === 'micro' && lotSize > 0.01) return false;
            if (filters.minLotSize === 'mini' && lotSize > 0.1) return false;
        }
        return true;
    });
  }, [filters]);

  const handleReset = () => {
    setFilters(initialFilters);
    setAiRecommendation(null);
    setAiError(null);
  };
  
  const handleGetAIRecommendation = async () => {
    setIsAiLoading(true);
    setAiError(null);
    setAiRecommendation(null);
    try {
        const result = await getAIRecommendation(filteredBrokers);
        setAiRecommendation(result);
    } catch (err) {
        setAiError("Sorry, the AI couldn't make a recommendation. Please try again with a different filter.");
        console.error(err);
    } finally {
        setIsAiLoading(false);
    }
  };

  const recommendedBrokers = useMemo(() => {
    if (!aiRecommendation) return [];
    return aiRecommendation.recommendedBrokerIds
        .map(id => allBrokers.find(b => b.id === id))
        .filter((b): b is Broker => !!b);
  }, [aiRecommendation]);

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">All Forex Brokers</h1>
        <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">Use our advanced filters to find the broker that perfectly matches your trading style and needs.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        <aside className="lg:col-span-1 sticky top-24">
            <Card className="flex flex-col max-h-[calc(100vh-8rem)]">
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
                </CardHeader>
                <CardContent className="overflow-y-auto">
                    <Input 
                        type="text"
                        placeholder="Search by broker name..."
                        value={filters.searchTerm}
                        onChange={(e) => setFilters(p => ({...p, searchTerm: e.target.value}))}
                        className="mb-4"
                    />
                    <Accordion title="Trading Style Presets">
                        <div className="grid grid-cols-2 gap-2">
                            {(['Scalping', 'Algorithmic', 'Copy Trading', 'Swing Trading'] as TradingStyle[]).map(style => (
                                <Button key={style} variant="secondary" size="sm" onClick={() => applyStylePreset(style)}>{style}</Button>
                            ))}
                        </div>
                    </Accordion>
                    <Accordion title="General">
                        <label className="text-sm font-semibold">Minimum Deposit</label>
                        <select value={filters.minDeposit} onChange={(e) => setFilters(p => ({...p, minDeposit: e.target.value}))} className="w-full mt-1 bg-input border-input rounded-md shadow-sm p-2">
                            <option value="any">Any Amount</option><option value="100">Up to $100</option><option value="250">Up to $250</option><option value="1000">Up to $1000</option>
                        </select>
                        <label className="text-sm font-semibold mt-3 block">Regulator</label>
                        <select value={filters.regulator} onChange={(e) => setFilters(p => ({...p, regulator: e.target.value}))} className="w-full mt-1 bg-input border-input rounded-md shadow-sm p-2">
                            <option value="any">Any Regulator</option>
                            {allRegulators.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                        </select>
                    </Accordion>
                     <Accordion title="Execution & Costs">
                        <h4 className="font-semibold text-sm mb-2">Execution Type</h4>
                        {['ECN', 'STP', 'NDD', 'Market Maker'].map(val => <label key={val} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.executionTypes.includes(val)} onChange={() => handleCheckboxChange('executionTypes', val)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{val}</label>)}
                        
                        <h4 className="font-semibold text-sm mb-2 mt-4">EUR/USD Spread</h4>
                        {[{v: 'any', l: 'Any'}, {v: 'ultra-low', l: 'Ultra Low (≤ 0.5 pips)'}, {v: 'low', l: 'Low (0.6 - 1.0 pips)'}, {v: 'standard', l: 'Standard ( > 1.0 pips)'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="spread" value={opt.v} checked={filters.spread === opt.v} onChange={(e) => handleRadioChange('spread', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                       
                        <h4 className="font-semibold text-sm mb-2 mt-4">Commissions</h4>
                        {[{v: 'any', l: 'Any'}, {v: 'commission', l: 'Commission-based'}, {v: 'zero', l: 'Zero Commission'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="commission" value={opt.v} checked={filters.commission === opt.v} onChange={(e) => handleRadioChange('commission', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                     <Accordion title="Technology & Platforms">
                        <h4 className="font-semibold text-sm mb-2">Platform</h4>
                        {['MT4', 'MT5', 'cTrader', 'TradingView'].map(val => <label key={val} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.platforms.includes(val)} onChange={() => handleCheckboxChange('platforms', val)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{val}</label>)}

                        <h4 className="font-semibold text-sm mb-2 mt-4">Algorithmic Trading</h4>
                        {[{v: 'eaSupport', l: 'MQL5/EA Support'}, {v: 'apiAccess', l: 'API Access'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.algoSupport.includes(opt.v)} onChange={() => handleCheckboxChange('algoSupport', opt.v)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}

                        <h4 className="font-semibold text-sm mb-2 mt-4">Social Trading</h4>
                        {[{v: 'any', l: 'Any'}, {v: 'yes', l: 'Supports Copy Trading'}, {v: 'no', l: 'No Copy Trading'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="copyTrading" value={opt.v} checked={filters.copyTrading === opt.v} onChange={(e) => handleRadioChange('copyTrading', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                     <Accordion title="Trading Conditions">
                         <h4 className="font-semibold text-sm mb-2">Minimum Lot Size</h4>
                        {[{v: 'any', l: 'Any'}, {v: 'micro', l: 'Micro (0.01)'}, {v: 'mini', l: 'Mini (0.1)'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="minLotSize" value={opt.v} checked={filters.minLotSize === opt.v} onChange={(e) => handleRadioChange('minLotSize', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                         
                         <h4 className="font-semibold text-sm mb-2 mt-4">Max Leverage</h4>
                        {[{v: 'any', l: 'Any'}, {v: 'low', l: 'Up to 1:100'}, {v: 'medium', l: '1:101 - 1:499'}, {v: 'high', l: '1:500+'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="maxLeverage" value={opt.v} checked={filters.maxLeverage === opt.v} onChange={(e) => handleRadioChange('maxLeverage', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                </CardContent>
            </Card>
        </aside>

        <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <p className="text-sm text-foreground/70">
                    Showing {filteredBrokers.length} of {allBrokers.length} brokers
                </p>
                <Button 
                    onClick={handleGetAIRecommendation} 
                    disabled={isAiLoading || filteredBrokers.length < 2}
                >
                    {isAiLoading ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/>Get AI Recommendation</>}
                </Button>
            </div>
             {filteredBrokers.length < 2 && !isAiLoading && <p className="text-xs text-center sm:text-right mt-1 text-foreground/60">Filter to at least 2 brokers to get a recommendation.</p>}
            
            {aiError && <p className="text-center text-red-500 my-6">{aiError}</p>}
      
            {aiRecommendation && recommendedBrokers.length > 0 && (
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">AI Top Picks From Your Selection</h2>
                    <div className="max-w-4xl mx-auto mb-6">
                       <Card className="h-full flex flex-col">
                            <CardHeader><h3 className="text-xl font-bold flex items-center gap-2"><Icons.bot className="h-6 w-6 text-primary-400"/> AI Analysis</h3></CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-card-foreground/90 italic">{aiRecommendation.reasoning}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedBrokers.map(broker => (
                            <BrokerCard key={broker.id} broker={broker} isRecommended={true} />
                        ))}
                    </div>
                    <hr className="my-8 border-input"/>
                </div>
            )}


            {filteredBrokers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredBrokers.map(broker => <BrokerCard key={broker.id} broker={broker} />)}
                </div>
            ) : (
                <div className="text-center py-20 bg-card rounded-lg border border-input">
                    <h3 className="text-xl font-semibold">No Brokers Match Your Criteria</h3>
                    <p className="mt-2 text-card-foreground/70">Try adjusting your filters to find more results.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default AllBrokersPage;