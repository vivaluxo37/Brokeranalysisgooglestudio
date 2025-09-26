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

const PositionSizeCalculator: React.FC = () => {
    const { t } = useTranslation();
    const [accountBalance, setAccountBalance] = useState('10000');
    const [riskPercentage, setRiskPercentage] = useState('1');
    const [stopLossPips, setStopLossPips] = useState('20');
    const [currencyPair, setCurrencyPair] = useState('EUR/USD');
    const [result, setResult] = useState<{ lots: number; units: number } | null>(null);

    const calculatePositionSize = (e: React.FormEvent) => {
        e.preventDefault();
        const balance = parseFloat(accountBalance);
        const risk = parseFloat(riskPercentage);
        const slPips = parseFloat(stopLossPips);

        if (isNaN(balance) || isNaN(risk) || isNaN(slPips) || slPips <= 0) return;

        const riskAmount = balance * (risk / 100);
        
        // Enhanced pip value calculation for all currency pairs
        const pipValuePerLot = (baseCurrency: string, quoteCurrency: string): number => {
            // JPY pairs have pip at 2nd decimal place
            const isJPYPair = baseCurrency === 'JPY' || quoteCurrency === 'JPY';
            const pipSize = isJPYPair ? 0.01 : 0.0001;

            // For standard lot (100,000 units)
            const pipValueInQuote = pipSize * 100000;

            // Convert to USD (base currency for position sizing)
            const conversionRates: Record<string, number> = {
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

                'EUR/USD': 1.09,
                'EUR/GBP': 0.86,
                'EUR/JPY': 162.50,
                'EUR/CHF': 0.96,

                'GBP/USD': 1.27,
                'GBP/JPY': 189.25,
                'GBP/CHF': 1.12,

                'JPY/USD': 0.0067,
                'JPY/EUR': 0.0062,
                'JPY/GBP': 0.0053,

                'AUD/USD': 0.65,
                'CAD/USD': 0.74,
                'CHF/USD': 1.14,
                'NZD/USD': 0.60,
            };

            // Convert pip value to USD
            if (quoteCurrency === 'USD') {
                return pipValueInQuote;
            } else {
                const conversionKey = `USD/${quoteCurrency}`;
                let conversionRate = conversionRates[conversionKey];

                // If direct conversion not found, try inverse
                if (!conversionRate) {
                    const inverseKey = `${quoteCurrency}/USD`;
                    conversionRate = 1 / (conversionRates[inverseKey] || 1);
                }

                return pipValueInQuote / conversionRate;
            }
        };

        const [baseCurrency, quoteCurrency] = currencyPair.split('/');
        const pipValuePerLotValue = pipValuePerLot(baseCurrency, quoteCurrency);

        const lossPerLot = slPips * pipValuePerLotValue;
        const positionSizeInLots = riskAmount / lossPerLot;

        setResult({
            lots: parseFloat(positionSizeInLots.toFixed(2)),
            units: Math.round(positionSizeInLots * 100000)
        });
    };

    return (
        <div className="animate-fade-in">
            <form onSubmit={calculatePositionSize} className="space-y-4">
                <Input
                    label={t('tools.calculators.positionSize.accountBalance')}
                    id="accountBalance"
                    type="number"
                    value={accountBalance}
                    onChange={e => setAccountBalance(e.target.value)}
                    min="0"
                />
                 <Input
                    label={t('tools.calculators.positionSize.riskPercentage')}
                    id="riskPercentage"
                    type="number"
                    value={riskPercentage}
                    onChange={e => setRiskPercentage(e.target.value)}
                    min="0.1"
                    max="100"
                    step="0.1"
                />
                 <Input
                    label={t('tools.calculators.positionSize.stopLoss')}
                    id="stopLossPips"
                    type="number"
                    value={stopLossPips}
                    onChange={e => setStopLossPips(e.target.value)}
                    min="1"
                />
                 <div>
                    <label htmlFor="currencyPairPos" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.calculators.pipValue.currencyPair')}</label>
                    <select id="currencyPairPos" value={currencyPair} onChange={e => setCurrencyPair(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                        {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                 <Button type="submit" className="w-full">{t('tools.calculators.positionSize.calculate')}</Button>
            </form>
             {result !== null && (
                <div className="mt-6 p-4 bg-primary-900/40 rounded-lg text-center animate-fade-in">
                    <p className="text-foreground/80">
                        {t('tools.calculators.positionSize.result', {risk: riskPercentage, sl: stopLossPips})}
                    </p>
                    <div className="flex justify-center items-baseline gap-8 mt-2">
                        <div>
                            <p className="text-3xl font-bold text-primary-400">{result.lots}</p>
                            <p className="text-sm text-foreground/70">{t('tools.calculators.positionSize.lots')}</p>
                        </div>
                         <div>
                            <p className="text-3xl font-bold text-primary-400">{result.units.toLocaleString()}</p>
                            <p className="text-sm text-foreground/70">{t('tools.calculators.positionSize.units')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PositionSizeCalculator;