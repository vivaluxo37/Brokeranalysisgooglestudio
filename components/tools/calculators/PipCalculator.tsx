import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const CURRENCY_PAIRS = [
    // Majors
    "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD",
    // Minors (Crosses)
    "EUR/GBP", "EUR/AUD", "EUR/NZD", "EUR/CAD", "EUR/CHF", "EUR/JPY",
    "GBP/JPY", "GBP/AUD", "GBP/CAD", "GBP/CHF",
    "AUD/JPY", "AUD/CAD", "AUD/CHF", "AUD/NZD",
    "CAD/JPY", "CAD/CHF",
    "NZD/JPY", "CHF/JPY",
    // Exotics
    "USD/TRY", "USD/MXN", "USD/ZAR", "USD/SGD", "USD/HKD",
    "EUR/TRY", "GBP/TRY"
];
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
        const [base, quote] = currencyPair.split('/');
        
        // For JPY pairs, pip is at 2nd decimal place.
        let pipSize = currencyPair.includes('JPY') ? 0.01 : 0.0001;

        const pipValueInQuote = tradeSize * pipSize;

        // This is a simplification for a demo. A real app would use live rates.
        // We'll calculate everything relative to USD and then convert to the account currency.
        let resultInUSD = 0;
        
        const mockUSDRates: Record<string, number> = {
            'EUR': 1.08, 'GBP': 1.25, 'AUD': 0.66, 'NZD': 0.61, 'CAD': 1 / 1.37, 'CHF': 1 / 0.90, 'JPY': 1 / 157,
            'TRY': 1 / 32, 'MXN': 1 / 18, 'ZAR': 1 / 18.5, 'SGD': 1 / 1.35, 'HKD': 1 / 7.8, 'USD': 1
        };

        if (mockUSDRates[quote]) {
            resultInUSD = pipValueInQuote * mockUSDRates[quote];
        } else {
            // Fallback for pairs where quote is not in our list
            resultInUSD = pipValueInQuote;
        }
        
        // Convert from USD to account currency
        let finalResult = resultInUSD;
        if (accountCurrency !== 'USD' && mockUSDRates[accountCurrency]) {
            const usdToAccountCurrencyRate = 1 / mockUSDRates[accountCurrency];
            finalResult = resultInUSD * usdToAccountCurrencyRate;
        }


        setResult(finalResult);
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