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

const PositionSizeCalculator: React.FC = () => {
    const { t } = useTranslation();
    const [accountBalance, setAccountBalance] = useState('10000');
    const [riskPercentage, setRiskPercentage] = useState('1');
    const [stopLossPips, setStopLossPips] = useState('20');
    const [accountCurrency, setAccountCurrency] = useState('USD');
    const [currencyPair, setCurrencyPair] = useState('EUR/USD');
    const [result, setResult] = useState<{ lots: number; units: number } | null>(null);

    const calculatePositionSize = (e: React.FormEvent) => {
        e.preventDefault();
        const balance = parseFloat(accountBalance);
        const risk = parseFloat(riskPercentage);
        const slPips = parseFloat(stopLossPips);

        if (isNaN(balance) || isNaN(risk) || isNaN(slPips) || slPips <= 0) return;

        const riskAmountInAccountCurrency = balance * (risk / 100);
        
        // This is a simplification for a demo. A real app would use live rates.
        const mockUSDRates: Record<string, number> = {
            'EUR': 1.08, 'GBP': 1.25, 'AUD': 0.66, 'NZD': 0.61, 'CAD': 1 / 1.37, 'CHF': 1 / 0.90, 'JPY': 1 / 157,
            'TRY': 1 / 32, 'MXN': 1 / 18, 'ZAR': 1 / 18.5, 'SGD': 1 / 1.35, 'HKD': 1 / 7.8, 'USD': 1
        };

        const [base, quote] = currencyPair.split('/');
        let pipSize = currencyPair.includes('JPY') ? 0.01 : 0.0001;

        const pipValuePerLotInQuote = 100000 * pipSize;
        
        let pipValuePerLotInAccountCurrency = pipValuePerLotInQuote;
        if (mockUSDRates[quote] && mockUSDRates[accountCurrency]) {
            const quoteToUsdRate = mockUSDRates[quote];
            const usdToAccountRate = 1 / mockUSDRates[accountCurrency];
            pipValuePerLotInAccountCurrency = (pipValuePerLotInQuote * quoteToUsdRate) * usdToAccountRate;
        }

        const lossPerLot = slPips * pipValuePerLotInAccountCurrency;
        const positionSizeInLots = riskAmountInAccountCurrency / lossPerLot;

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
                 <div>
                    <label htmlFor="accountCurrencyPos" className="block text-sm font-medium text-foreground/80 mb-1">{t('tools.calculators.pipValue.accountCurrency')}</label>
                    <select id="accountCurrencyPos" value={accountCurrency} onChange={e => setAccountCurrency(e.target.value)} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                        {ACCOUNT_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
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