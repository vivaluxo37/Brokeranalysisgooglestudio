import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const CURRENCY_PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD"];
const ACCOUNT_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];

const PipCalculator: React.FC = () => {
    const { t } = useTranslation();
    const [accountCurrency, setAccountCurrency] = useState('USD');
    const [currencyPair, setCurrencyPair] = useState('EUR/USD');
    const [positionSize, setPositionSize] = useState('1');
    const [result, setResult] = useState<number | null>(null);

    const calculatePipValue = (e: React.FormEvent) => {
        e.preventDefault();
        const lots = parseFloat(positionSize);
        if (isNaN(lots) || lots <= 0) return;

        const tradeSize = lots * 100000;
        let pipValueInQuote;

        // JPY pairs have pip at 2nd decimal place
        if (currencyPair.includes('JPY')) {
            pipValueInQuote = (0.01 / 1) * tradeSize;
        } else {
            pipValueInQuote = (0.0001 / 1) * tradeSize;
        }
        
        const quoteCurrency = currencyPair.split('/')[1];

        if (quoteCurrency === accountCurrency) {
            setResult(pipValueInQuote);
        } else {
            // This is a simplification. A real app would fetch the live exchange rate.
            // For this demo, we'll use approximate conversion rates.
            let conversionRate = 1;
            if (accountCurrency === 'USD') {
                 if (quoteCurrency === 'JPY') conversionRate = 1 / 150;
                 if (quoteCurrency === 'CAD') conversionRate = 1 / 1.35;
                 if (quoteCurrency === 'CHF') conversionRate = 1 / 0.90;
            } else {
                // For non-USD accounts, the logic would be more complex.
                // We'll just assume a 1:1 conversion for simplicity in this demo.
            }
            setResult(pipValueInQuote * conversionRate);
        }
    };
    
    return (
        <div className="animate-fade-in">
            <form onSubmit={calculatePipValue} className="space-y-4">
                 <div>
                    <label htmlFor="accountCurrency" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.calculators.pipValue.accountCurrency')}</label>
                    <select id="accountCurrency" value={accountCurrency} onChange={e => setAccountCurrency(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                        {ACCOUNT_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="currencyPair" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.calculators.pipValue.currencyPair')}</label>
                    <select id="currencyPair" value={currencyPair} onChange={e => setCurrencyPair(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                        {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <Input 
                    label={t('tools.calculators.pipValue.positionSize')}
                    id="positionSize"
                    type="number"
                    value={positionSize}
                    onChange={e => setPositionSize(e.target.value)}
                    min="0.01"
                    step="0.01"
                />
                <Button type="submit" className="w-full">{t('tools.calculators.pipValue.calculate')}</Button>
            </form>
            {result !== null && (
                <div className="mt-6 p-4 bg-primary-900/40 rounded-lg text-center animate-fade-in">
                    <p className="text-foreground/80">
                      {t('tools.calculators.pipValue.result', {lots: positionSize, pair: currencyPair})}
                    </p>
                    <p className="text-3xl font-bold text-primary-400 mt-1">
                        {result.toLocaleString(undefined, { style: 'currency', currency: accountCurrency })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PipCalculator;