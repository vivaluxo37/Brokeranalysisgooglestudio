import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

// Major pairs
const MAJOR_PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD"];

// Minor pairs (crosses)
const MINOR_PAIRS = ["EUR/GBP", "EUR/JPY", "EUR/CHF", "GBP/JPY", "GBP/CHF", "AUD/JPY", "CAD/JPY", "CHF/JPY", "NZD/JPY", "AUD/NZD", "AUD/CHF", "CAD/CHF"];

// Exotic pairs
const EXOTIC_PAIRS = ["USD/TRY", "USD/MXN", "USD/PLN", "USD/HUF", "USD/CZK", "USD/SEK", "USD/NOK", "USD/DKK", "USD/ZAR", "EUR/TRY", "GBP/SEK", "GBP/NOK", "AUD/SGD", "USD/SGD", "USD/HKD", "USD/CNH"];

const CURRENCY_PAIRS = [...MAJOR_PAIRS, ...MINOR_PAIRS, ...EXOTIC_PAIRS];
const ACCOUNT_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "ZAR", "TRY", "MXN", "SGD", "HKD", "CNH"];
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

        // Enhanced conversion rates for all supported currencies
        const conversionRates: Record<string, number> = {
            // USD conversions
            'USD/EUR': 0.92,
            'USD/GBP': 0.79,
            'USD/JPY': 149.50,
            'USD/AUD': 1.53,
            'USD/CAD': 1.36,
            'USD/CHF': 0.88,
            'USD/NZD': 1.68,
            'USD/SEK': 10.75,
            'USD/NOK': 10.65,
            'USD/DKK': 6.85,
            'USD/PLN': 3.95,
            'USD/CZK': 23.15,
            'USD/HUF': 360.50,
            'USD/ZAR': 18.95,
            'USD/TRY': 31.25,
            'USD/MXN': 17.15,
            'USD/SGD': 1.35,
            'USD/HKD': 7.83,
            'USD/CNH': 7.25,

            // EUR conversions
            'EUR/USD': 1.09,
            'EUR/GBP': 0.86,
            'EUR/JPY': 162.50,
            'EUR/CHF': 0.96,

            // GBP conversions
            'GBP/USD': 1.27,
            'GBP/JPY': 189.25,
            'GBP/CHF': 1.12,

            // JPY conversions
            'JPY/USD': 0.0067,
            'JPY/EUR': 0.0062,
            'JPY/GBP': 0.0053,

            // Other major currencies
            'AUD/USD': 0.65,
            'CAD/USD': 0.74,
            'CHF/USD': 1.14,
            'NZD/USD': 0.60,
        };

        const [baseCurrency, quoteCurrency] = currencyPair.split('/');
        let conversionRateToBase = 1;

        // Calculate conversion rate from base currency to account currency
        if (baseCurrency === accountCurrency) {
            conversionRateToBase = 1;
        } else {
            const conversionKey = `${baseCurrency}/${accountCurrency}`;
            conversionRateToBase = conversionRates[conversionKey] || 1;

            // If direct conversion not found, try converting via USD
            if (conversionRateToBase === 1) {
                const toUsd = conversionRates[`${baseCurrency}/USD`] || (1 / conversionRates[`USD/${baseCurrency}`] || 1);
                const fromUsd = conversionRates[`USD/${accountCurrency}`] || (1 / conversionRates[`${accountCurrency}/USD`] || 1);
                conversionRateToBase = toUsd * fromUsd;
            }
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