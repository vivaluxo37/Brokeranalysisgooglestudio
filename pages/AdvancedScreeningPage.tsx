import React, { useState, useMemo } from 'react';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../constants';
import { Broker } from '../types';
import BrokerQuickViewModal from '../components/brokers/BrokerQuickViewModal';

const parseLeverage = (leverageStr: string): number => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  if (leverageStr.toLowerCase().includes('unlimited')) return Infinity;
  const num = parseInt(leverageStr.split(':')[1], 10);
  return isNaN(num) ? 0 : num;
};

const initialFilters = {
    executionTypes: [] as string[],
    spread: 'any',
    commission: 'any',
    platforms: [] as string[],
    algoSupport: [] as string[],
    copyTrading: 'any',
    minLotSize: 'any',
    maxLeverage: 'any',
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

const AdvancedScreeningPage: React.FC = () => {
    const [filters, setFilters] = useState(initialFilters);
    const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

    const handleOpenQuickView = (broker: Broker) => {
        setSelectedBroker(broker);
    };

    const handleCloseQuickView = () => {
        setSelectedBroker(null);
    };

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
        return allBrokers.filter(broker => {
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
            if (filters.maxLeverage !== 'any') {
                const leverage = parseLeverage(broker.tradingConditions.maxLeverage);
                if (filters.maxLeverage === 'low' && leverage > 100) return false;
                if (filters.maxLeverage === 'medium' && (leverage <= 100 || leverage > 500)) return false;
                if (filters.maxLeverage === 'high' && leverage <= 500) return false;
            }
            return true;
        });
    }, [filters]);

    return (
        <div>
            <BrokerQuickViewModal broker={selectedBroker} onClose={handleCloseQuickView} />
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">Advanced Broker Screening</h1>
                <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">Filter by trading style, technology, and execution to find your perfect match.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 items-start">
                <aside className="lg:col-span-1 sticky top-24">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Reset</Button>
                        </CardHeader>
                        <CardContent>
                            <Accordion title="Trading Style Presets">
                                <div className="grid grid-cols-2 gap-2">
                                    {(['Scalping', 'Algorithmic', 'Copy Trading', 'Swing Trading'] as TradingStyle[]).map(style => (
                                        <Button key={style} variant="secondary" size="sm" onClick={() => applyStylePreset(style)}>{style}</Button>
                                    ))}
                                </div>
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
                                {[{v: 'any', l: 'Any'}, {v: 'low', l: 'Up to 1:100'}, {v: 'medium', l: '1:101 - 1:500'}, {v: 'high', l: '1:501+'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="maxLeverage" value={opt.v} checked={filters.maxLeverage === opt.v} onChange={(e) => handleRadioChange('maxLeverage', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                             </Accordion>
                        </CardContent>
                    </Card>
                </aside>
                <main className="lg:col-span-3">
                    <p className="text-sm text-foreground/70 mb-4">
                        Showing {filteredBrokers.length} of {allBrokers.length} brokers
                    </p>
                    {filteredBrokers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredBrokers.map(broker => <BrokerCard key={`screening-${broker.id}`} broker={broker} onQuickView={handleOpenQuickView} />)}
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

export default AdvancedScreeningPage;