import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const CURRENCY_PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD"];
const ACCOUNT_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];
const LEVERAGE_OPTIONS = ["1:1", "1:10", "1:30", "1:50", "1:100", "1:200", "1:500"];

const MarginCalculator: React.FC = () => {
    const { t } = useTranslation();
    const [accountCurrency, setAccountCurrency] = useState('USD');
    const [currencyPair, setCurrencyPair] = useState('EUR/USD');
    const [leverage, setLeverage] = useState('1:100');
    const [tradeSize, setTradeSize] = useState('1');
    const [result, setResult] = useState<number | null>(null);

    const calculateMargin = (e: React.FormEvent) => {
        e.preventDefault();
        const lots = parseFloat(tradeSize);
        const leverageRatio = parseInt(leverage.split(':')[1], 10);
        if (isNaN(lots) || lots <= 0 || isNaN(leverageRatio)) return;

        const contractSize = 100000;
        const totalTradeValue = lots * contractSize;

        // Simplification: Assume current rate of EUR/USD is ~1.08
        // A real app would fetch the live rate of the base currency vs account currency.
        let conversionRateToBase = 1;
        if (currencyPair.startsWith('EUR') && accountCurrency === 'USD') {
            conversionRateToBase = 1.08;
        }

        const marginRequired = (totalTradeValue / leverageRatio) * conversionRateToBase;
        setResult(marginRequired);
    };

    return (
         <div className="animate-fade-in">
            <form onSubmit={calculateMargin} className="space-y-4">
                 <div>
                    <label htmlFor="accountCurrencyMargin" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.calculators.pipValue.accountCurrency')}</label>
                    <select id="accountCurrencyMargin" value={accountCurrency} onChange={e => setAccountCurrency(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                        {ACCOUNT_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="leverage" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.calculators.margin.leverage')}</label>
                    <select id="leverage" value={leverage} onChange={e => setLeverage(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                        {LEVERAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="currencyPairMargin" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.calculators.pipValue.currencyPair')}</label>
                    <select id="currencyPairMargin" value={currencyPair} onChange={e => setCurrencyPair(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                        {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                 <Input
                    label={t('tools.calculators.margin.tradeSize')}
                    id="tradeSize"
                    type="number"
                    value={tradeSize}
                    onChange={e => setTradeSize(e.target.value)}
                    min="0.01"
                    step="0.01"
                />
                <Button type="submit" className="w-full">{t('tools.calculators.margin.calculate')}</Button>
            </form>
            {result !== null && (
                <div className="mt-6 p-4 bg-primary-900/40 rounded-lg text-center animate-fade-in">
                    <p className="text-foreground/80">
                        {t('tools.calculators.margin.result', {lots: tradeSize, pair: currencyPair, leverage: leverage})}
                    </p>
                     <p className="text-3xl font-bold text-primary-400 mt-1">
                        {result.toLocaleString(undefined, { style: 'currency', currency: accountCurrency })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MarginCalculator;