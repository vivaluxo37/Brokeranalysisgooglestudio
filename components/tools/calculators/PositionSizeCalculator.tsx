import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const CURRENCY_PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD"];
const ACCOUNT_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];

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
        
        // This is a simplification. A real app would fetch live pip values.
        let pipValuePerLot = 10; // Assuming USD account and standard pairs
        if (currencyPair.includes("JPY")) {
             pipValuePerLot = 1000 / 150; // Approximation for USD/JPY
        }

        const lossPerLot = slPips * pipValuePerLot;
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