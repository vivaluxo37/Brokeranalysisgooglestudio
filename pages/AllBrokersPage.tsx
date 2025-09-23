import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { getAIRecommendation } from '../services/geminiService';
import { AIRecommendation, Broker } from '../types';
import { Icons } from '../constants';
import Spinner from '../components/ui/Spinner';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { useTranslation } from '../hooks/useTranslation';
import BrokerCardSkeleton from '../components/brokers/BrokerCardSkeleton';
import StarRating from '../components/ui/StarRating';
import Tag from '../components/ui/Tag';
import Tooltip from '../components/ui/Tooltip';
import { useComparison } from '../hooks/useComparison';

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
    riskProfile: 'all', // New filter for risk
    socialTradingFeatures: [] as string[],
};

type TradingStyle = 'Scalping' | 'Algorithmic' | 'Copy Trading' | 'Swing Trading' | 'News Trading' | 'Low Cost';
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

type SortableBrokerKeys = 'name' | 'score' | 'minDeposit';

const BrokerTable: React.FC<{ brokers: Broker[], t: (key: string) => string }> = ({ brokers, t }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortableBrokerKeys; direction: 'asc' | 'desc' }>({ key: 'score', direction: 'desc' });
    const { addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison } = useComparison();

    const sortedBrokers = useMemo(() => {
        let sortableItems = [...brokers];
        sortableItems.sort((a, b) => {
            let aValue: string | number, bValue: string | number;

            switch (sortConfig.key) {
                case 'minDeposit':
                    aValue = a.accessibility.minDeposit;
                    bValue = b.accessibility.minDeposit;
                    break;
                case 'score':
                    aValue = a.score;
                    bValue = b.score;
                    break;
                case 'name':
                default:
                    aValue = a.name;
                    bValue = b.name;
                    break;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [brokers, sortConfig]);

    const requestSort = (key: SortableBrokerKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
      // Fix: Explicitly type commonProps to satisfy SVG attribute types.
      const commonProps: React.SVGProps<SVGSVGElement> = { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "inline-block ml-1" };
      if (direction === 'asc') return <svg {...commonProps}><path d="m18 15-6-6-6 6"/></svg>;
      if (direction === 'desc') return <svg {...commonProps}><path d="m6 9 6 6 6-6"/></svg>;
      return <svg {...commonProps} className={`${commonProps.className} opacity-30 group-hover:opacity-100`}><path d="M8 9l4-4 4 4"/><path d="M16 15l-4 4-4-4"/></svg>;
    };

    const SortableHeader: React.FC<{ children: React.ReactNode; sortKey: SortableBrokerKeys; className?: string }> = ({ children, sortKey, className = '' }) => (
      <th className={`p-4 ${className}`}>
        <button className="flex items-center group" onClick={() => requestSort(sortKey)}>
          <span className={sortConfig.key === sortKey ? 'text-primary-400' : ''}>{children}</span>
          <SortIcon direction={sortConfig.key === sortKey ? sortConfig.direction : undefined} />
        </button>
      </th>
    );

    return (
        <div className="overflow-x-auto bg-card rounded-lg border border-input animate-fade-in">
            <table className="w-full min-w-max text-left">
                <thead>
                    <tr className="border-b border-input">
                        <SortableHeader sortKey="name" className="sticky left-0 bg-card z-10">Broker</SortableHeader>
                        <SortableHeader sortKey="score">Score</SortableHeader>
                        <th className="p-4">Regulators</th>
                        <SortableHeader sortKey="minDeposit">Min. Deposit</SortableHeader>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBrokers.map(broker => {
                        const inCompare = isBrokerInComparison(broker.id);
                        return (
                            <tr key={broker.id} className="border-b border-input last:border-b-0 hover:bg-input/30 group">
                                <td className="p-4 sticky left-0 bg-card group-hover:bg-input/30 transition-colors z-10">
                                    <ReactRouterDOM.Link to={`/broker/${broker.id}`} className="flex items-center gap-3 group">
                                        <img src={broker.logoUrl} alt={broker.name} className="h-10 bg-white p-1 rounded-md" />
                                        <span className="font-semibold text-card-foreground group-hover:text-primary-400 transition-colors">{broker.name}</span>
                                    </ReactRouterDOM.Link>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-primary-400">{broker.score.toFixed(1)}</span>
                                        <StarRating score={broker.score} />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {broker.regulation.regulators.slice(0, 2).map(reg => <Tag key={reg}>{reg}</Tag>)}
                                        {broker.regulation.regulators.length > 2 && <Tag>+{broker.regulation.regulators.length - 2}</Tag>}
                                    </div>
                                </td>
                                <td className="p-4 font-semibold">${broker.accessibility.minDeposit}</td>
                                <td className="p-4">
                                    <div className="flex justify-center items-center gap-2">
                                        <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="primary" size="sm">Visit</Button>
                                        </a>
                                        <Tooltip content={inCompare ? 'Remove from comparison' : 'Add to comparison'}>
                                            <Button onClick={(e) => { e.stopPropagation(); inCompare ? removeBrokerFromComparison(broker.id) : addBrokerToComparison(broker.id) }} variant="secondary" size="sm" className="p-2">
                                                {inCompare ? <Icons.compareRemove className="h-4 w-4" /> : <Icons.compare className="h-4 w-4" />}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};


const AllBrokersPage: React.FC = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    // Simulate initial data fetching/processing delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckboxChange = (group: FilterKeys, value: string) => {
    setFilters(prev => {
        const currentGroup = prev[group as 'executionTypes' | 'platforms' | 'algoSupport' | 'socialTradingFeatures'];
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
              newFilters = { ...newFilters, socialTradingFeatures: ['copyTrading'] };
              break;
          case 'Swing Trading':
               newFilters = { ...newFilters, maxLeverage: 'low' }; // Low leverage for long-term holds
              break;
          case 'News Trading':
               newFilters = { ...newFilters, executionTypes: ['ECN', 'STP'], spread: 'ultra-low' };
               break;
          case 'Low Cost':
               newFilters = { ...newFilters, spread: 'ultra-low', commission: 'commission' };
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
             const hasCommission = !/zero|included in spread/i.test(broker.tradingConditions.commission);
             if (filters.commission === 'commission' && !hasCommission) return false;
             if (filters.commission === 'zero' && hasCommission) return false;
        }
        if (filters.platforms.length > 0 && !filters.platforms.every(p => broker.technology.platforms.includes(p))) return false;
        if (filters.algoSupport.length > 0) {
            if (filters.algoSupport.includes('eaSupport') && !broker.technology.eaSupport) return false;
            if (filters.algoSupport.includes('apiAccess') && !broker.technology.apiAccess) return false;
        }
        
        if (filters.socialTradingFeatures.length > 0) {
            const checks = {
                copyTrading: (b: Broker) => b.copyTrading || b.platformFeatures.copyTrading.available,
                pammMam: (b: Broker) => b.accountManagement.mamPammSupport,
                zuluTrade: (b: Broker) => b.platformFeatures.copyTrading.platforms.includes('ZuluTrade'),
                myfxbook: (b: Broker) => b.platformFeatures.copyTrading.platforms.includes('Myfxbook'),
            };
            if (!filters.socialTradingFeatures.every(feature => checks[feature as keyof typeof checks] && checks[feature as keyof typeof checks](broker))) {
                return false;
            }
        }
        
        if (filters.minLotSize !== 'any') {
            const lotSize = broker.tradingConditions.minLotSize || 0.01;
            if (filters.minLotSize === 'micro' && lotSize > 0.01) return false;
            if (filters.minLotSize === 'mini' && lotSize > 0.1) return false;
        }
        if (filters.riskProfile === 'exclude_high' && broker.riskProfile && broker.riskProfile.score >= 60) {
            return false;
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
        setAiError(t('allBrokersPage.results.aiError'));
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
        <h1 className="text-4xl font-bold">{t('allBrokersPage.title')}</h1>
        <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">{t('allBrokersPage.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <Card className="flex flex-col lg:max-h-[calc(100vh-8rem)]">
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('allBrokersPage.filtersTitle')}</h2>
                    <Button variant="ghost" size="sm" onClick={handleReset}>{t('allBrokersPage.reset')}</Button>
                </CardHeader>
                <CardContent className="overflow-y-auto">
                    <Input 
                        type="text"
                        placeholder={t('allBrokersPage.searchPlaceholder')}
                        value={filters.searchTerm}
                        onChange={(e) => setFilters(p => ({...p, searchTerm: e.target.value}))}
                        className="mb-4"
                    />
                     <Accordion title="Risk Profile">
                        {[{v: 'all', l: 'Show All Brokers'}, {v: 'exclude_high', l: 'Exclude High & Critical Risk'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="riskProfile" value={opt.v} checked={filters.riskProfile === opt.v} onChange={(e) => handleRadioChange('riskProfile', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                    </Accordion>
                    <Accordion title={t('allBrokersPage.presetsTitle')}>
                        <div className="grid grid-cols-2 gap-2">
                            {(['Scalping', 'Algorithmic', 'Copy Trading', 'Swing Trading', 'News Trading', 'Low Cost'] as TradingStyle[]).map(style => (
                                <Button key={style} variant="secondary" size="sm" onClick={() => applyStylePreset(style)}>{t(`allBrokersPage.presets.${style.toLowerCase().replace(' ', '')}`)}</Button>
                            ))}
                        </div>
                    </Accordion>
                    <Accordion title={t('allBrokersPage.generalTitle')}>
                        <label className="text-sm font-semibold">{t('allBrokersPage.minDeposit')}</label>
                        <select value={filters.minDeposit} onChange={(e) => setFilters(p => ({...p, minDeposit: e.target.value}))} className="w-full mt-1 bg-input border-input rounded-md shadow-sm p-2">
                            <option value="any">{t('allBrokersPage.minDepositOptions.any')}</option>
                            <option value="100">{t('allBrokersPage.minDepositOptions.100')}</option>
                            <option value="250">{t('allBrokersPage.minDepositOptions.250')}</option>
                            <option value="1000">{t('allBrokersPage.minDepositOptions.1000')}</option>
                        </select>
                        <label className="text-sm font-semibold mt-3 block">{t('allBrokersPage.regulator')}</label>
                        <select value={filters.regulator} onChange={(e) => setFilters(p => ({...p, regulator: e.target.value}))} className="w-full mt-1 bg-input border-input rounded-md shadow-sm p-2">
                            <option value="any">{t('allBrokersPage.regulatorOptions.any')}</option>
                            {allRegulators.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                        </select>
                    </Accordion>
                     <Accordion title={t('allBrokersPage.executionCostsTitle')}>
                        <h4 className="font-semibold text-sm mb-2">{t('allBrokersPage.executionType')}</h4>
                        {['ECN', 'STP', 'NDD', 'Market Maker'].map(val => <label key={val} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.executionTypes.includes(val)} onChange={() => handleCheckboxChange('executionTypes', val)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{val}</label>)}
                        
                        <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.spread')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.spreadOptions.any')}, {v: 'ultra-low', l: t('allBrokersPage.spreadOptions.ultraLow')}, {v: 'low', l: t('allBrokersPage.spreadOptions.low')}, {v: 'standard', l: t('allBrokersPage.spreadOptions.standard')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="spread" value={opt.v} checked={filters.spread === opt.v} onChange={(e) => handleRadioChange('spread', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                       
                        <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.commissions')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.commissionOptions.any')}, {v: 'commission', l: t('allBrokersPage.commissionOptions.commission')}, {v: 'zero', l: t('allBrokersPage.commissionOptions.zero')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="commission" value={opt.v} checked={filters.commission === opt.v} onChange={(e) => handleRadioChange('commission', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                     <Accordion title={t('allBrokersPage.techPlatformsTitle')}>
                        <h4 className="font-semibold text-sm mb-2">{t('allBrokersPage.platform')}</h4>
                        {['MT4', 'MT5', 'cTrader', 'TradingView'].map(val => <label key={val} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.platforms.includes(val)} onChange={() => handleCheckboxChange('platforms', val)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{val}</label>)}

                        <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.algoTrading')}</h4>
                        {[{v: 'eaSupport', l: t('allBrokersPage.algoTradingOptions.eaSupport')}, {v: 'apiAccess', l: t('allBrokersPage.algoTradingOptions.apiAccess')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.algoSupport.includes(opt.v)} onChange={() => handleCheckboxChange('algoSupport', opt.v)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                    <Accordion title="Social & Copy Trading">
                        <h4 className="font-semibold text-sm mb-2">Features</h4>
                        {[
                            { v: 'copyTrading', l: 'Supports Copy Trading' },
                            { v: 'pammMam', l: 'PAMM/MAM Accounts' },
                            { v: 'zuluTrade', l: 'ZuluTrade Integration' },
                            { v: 'myfxbook', l: 'Myfxbook Integration' },
                        ].map(opt => (
                            <label key={opt.v} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.socialTradingFeatures.includes(opt.v)}
                                    onChange={() => handleCheckboxChange('socialTradingFeatures', opt.v)}
                                    className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"
                                />
                                {opt.l}
                            </label>
                        ))}
                    </Accordion>
                     <Accordion title={t('allBrokersPage.tradingConditionsTitle')}>
                         <h4 className="font-semibold text-sm mb-2">{t('allBrokersPage.minLotSize')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.minLotSizeOptions.any')}, {v: 'micro', l: t('allBrokersPage.minLotSizeOptions.micro')}, {v: 'mini', l: t('allBrokersPage.minLotSizeOptions.mini')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="minLotSize" value={opt.v} checked={filters.minLotSize === opt.v} onChange={(e) => handleRadioChange('minLotSize', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                         
                         <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.maxLeverage')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.maxLeverageOptions.any')}, {v: 'low', l: t('allBrokersPage.maxLeverageOptions.low')}, {v: 'medium', l: t('allBrokersPage.maxLeverageOptions.medium')}, {v: 'high', l: t('allBrokersPage.maxLeverageOptions.high')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="maxLeverage" value={opt.v} checked={filters.maxLeverage === opt.v} onChange={(e) => handleRadioChange('maxLeverage', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                </CardContent>
            </Card>
        </aside>

        <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                  {!isLoading && (
                      <p className="text-sm text-foreground/70">
                          {t('allBrokersPage.results.showing', { count: filteredBrokers.length, total: allBrokers.length })}
                      </p>
                  )}
                  <div className="flex items-center bg-input p-1 rounded-md">
                    <Tooltip content="Grid View">
                      <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-card shadow-md' : 'text-foreground/60 hover:bg-card/50'}`} aria-label="Grid View">
                        <Icons.grid className="h-5 w-5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Table View">
                      <button onClick={() => setView('table')} className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-card shadow-md' : 'text-foreground/60 hover:bg-card/50'}`} aria-label="Table View">
                        <Icons.list className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <Button 
                    onClick={handleGetAIRecommendation} 
                    disabled={isAiLoading || filteredBrokers.length < 2}
                >
                    {isAiLoading ? <Spinner size="sm" /> : <><Icons.bot className="h-5 w-5 mr-2"/>{t('allBrokersPage.results.getAiRec')}</>}
                </Button>
            </div>
             {filteredBrokers.length < 2 && !isAiLoading && <p className="text-xs text-center sm:text-right mt-1 text-foreground/60">{t('allBrokersPage.results.aiRecTooltip')}</p>}
            
            {aiError && <p className="text-center text-red-500 my-6">{aiError}</p>}
      
            {aiRecommendation && recommendedBrokers.length > 0 && (
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">{t('allBrokersPage.results.aiPicksTitle')}</h2>
                    <div className="max-w-4xl mx-auto mb-6">
                       <Card className="flex flex-col">
                            <CardHeader><h3 className="text-xl font-bold flex items-center gap-2"><Icons.bot className="h-6 w-6 text-primary-400"/> {t('allBrokersPage.results.aiAnalysisTitle')}</h3></CardHeader>
                            <CardContent>
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

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <BrokerCardSkeleton key={index} />
                    ))}
                </div>
            ) : filteredBrokers.length > 0 ? (
                view === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredBrokers.map(broker => <BrokerCard key={broker.id} broker={broker} />)}
                  </div>
                ) : (
                  <BrokerTable brokers={filteredBrokers} t={t} />
                )
            ) : (
                <div className="text-center py-20 bg-card rounded-lg border border-input">
                    <h3 className="text-xl font-semibold">{t('allBrokersPage.results.noResultsTitle')}</h3>
                    <p className="mt-2 text-card-foreground/70">{t('allBrokersPage.results.noResultsSubtitle')}</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default AllBrokersPage;