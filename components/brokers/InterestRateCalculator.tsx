import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PiggyBank,
  AlertCircle,
  Info,
  ArrowUpRight
} from 'lucide-react';

interface InterestRate {
  currency: string;
  ibkrLite: number;
  ibkrPro: number;
  flag: string;
  minBalance: number;
  maxRate: number;
}

interface InterestCalculation {
  currency: string;
  balance: number;
  plan: 'lite' | 'pro';
  annualRate: number;
  monthlyInterest: number;
  annualInterest: number;
}

const InterestRateCalculator: React.FC = () => {
  const [accountType, setAccountType] = useState<'lite' | 'pro'>('pro');
  const [balance, setBalance] = useState(50000);
  const [currency, setCurrency] = useState('USD');

  const interestRates: InterestRate[] = [
    { currency: 'USD', ibkrLite: 2.8, ibkrPro: 3.8, flag: '🇺🇸', minBalance: 10000, maxRate: 3.8 },
    { currency: 'EUR', ibkrLite: 0.4, ibkrPro: 1.4, flag: '🇪🇺', minBalance: 10000, maxRate: 1.4 },
    { currency: 'GBP', ibkrLite: 3.0, ibkrPro: 3.7, flag: '🇬🇧', minBalance: 10000, maxRate: 3.7 },
    { currency: 'AED', ibkrLite: 2.9, ibkrPro: 3.9, flag: '🇦🇪', minBalance: 10000, maxRate: 3.9 },
    { currency: 'AUD', ibkrLite: 2.9, ibkrPro: 4.2, flag: '🇦🇺', minBalance: 10000, maxRate: 4.2 },
    { currency: 'CAD', ibkrLite: 2.1, ibkrPro: 3.1, flag: '🇨🇦', minBalance: 10000, maxRate: 3.1 },
    { currency: 'CHF', ibkrLite: 0.0, ibkrPro: 0.3, flag: '🇨🇭', minBalance: 10000, maxRate: 0.3 },
    { currency: 'CNH', ibkrLite: 0.5, ibkrPro: 0.5, flag: '🇨🇳', minBalance: 10000, maxRate: 0.5 },
    { currency: 'CZK', ibkrLite: 0.7, ibkrPro: 1.7, flag: '🇨🇿', minBalance: 10000, maxRate: 1.7 },
    { currency: 'DKK', ibkrLite: 1.3, ibkrPro: 2.3, flag: '🇩🇰', minBalance: 10000, maxRate: 2.3 },
    { currency: 'HKD', ibkrLite: 2.5, ibkrPro: 3.5, flag: '🇭🇰', minBalance: 10000, maxRate: 3.5 },
    { currency: 'HUF', ibkrLite: 2.3, ibkrPro: 3.3, flag: '🇭🇺', minBalance: 10000, maxRate: 3.3 },
    { currency: 'ILS', ibkrLite: 0.0, ibkrPro: 0.0, flag: '🇮🇱', minBalance: 10000, maxRate: 0.0 },
    { currency: 'INR', ibkrLite: 0.0, ibkrPro: 0.0, flag: '🇮🇳', minBalance: 10000, maxRate: 0.0 },
    { currency: 'JPY', ibkrLite: -1.2, ibkrPro: -0.2, flag: '🇯🇵', minBalance: 10000, maxRate: -0.2 },
    { currency: 'KRW', ibkrLite: 0.5, ibkrPro: 1.5, flag: '🇰🇷', minBalance: 10000, maxRate: 1.5 },
    { currency: 'MXN', ibkrLite: 8.4, ibkrPro: 9.4, flag: '🇲🇽', minBalance: 10000, maxRate: 9.4 },
    { currency: 'NOK', ibkrLite: 1.5, ibkrPro: 2.5, flag: '🇳🇴', minBalance: 10000, maxRate: 2.5 },
    { currency: 'NZD', ibkrLite: 1.1, ibkrPro: 2.1, flag: '🇳🇿', minBalance: 10000, maxRate: 2.1 },
    { currency: 'PLN', ibkrLite: 2.7, ibkrPro: 3.7, flag: '🇵🇱', minBalance: 10000, maxRate: 3.7 },
    { currency: 'SAR', ibkrLite: 3.3, ibkrPro: 4.3, flag: '🇸🇦', minBalance: 10000, maxRate: 4.3 },
    { currency: 'SEK', ibkrLite: 1.1, ibkrPro: 2.1, flag: '🇸🇪', minBalance: 10000, maxRate: 2.1 },
    { currency: 'SGD', ibkrLite: 1.4, ibkrPro: 2.4, flag: '🇸🇬', minBalance: 10000, maxRate: 2.4 },
    { currency: 'TRY', ibkrLite: 4.0, ibkrPro: 5.0, flag: '🇹🇷', minBalance: 10000, maxRate: 5.0 },
    { currency: 'ZAR', ibkrLite: 6.6, ibkrPro: 6.8, flag: '🇿🇦', minBalance: 10000, maxRate: 6.8 }
  ];

  const calculateInterest = (currency: string, balance: number, plan: 'lite' | 'pro'): InterestCalculation => {
    const rate = interestRates.find(r => r.currency === currency);
    if (!rate) return {
      currency, balance, plan,
      annualRate: 0,
      monthlyInterest: 0,
      annualInterest: 0
    };

    const annualRate = plan === 'lite' ? rate.ibkrLite : rate.ibkrPro;

    // No interest on first $10,000
    const eligibleBalance = Math.max(0, balance - 10000);

    // Proportional rate based on balance (full rate at $100,000+)
    const rateMultiplier = Math.min(1, eligibleBalance / 90000);
    const effectiveRate = annualRate * rateMultiplier;

    const annualInterest = (eligibleBalance * effectiveRate) / 100;
    const monthlyInterest = annualInterest / 12;

    return {
      currency,
      balance,
      plan,
      annualRate: effectiveRate,
      monthlyInterest,
      annualInterest
    };
  };

  const calculations = useMemo(() => {
    return interestRates.map(rate => ({
      currency: rate.currency,
      flag: rate.flag,
      lite: calculateInterest(rate.currency, balance, 'lite'),
      pro: calculateInterest(rate.currency, balance, 'pro')
    }));
  }, [balance]);

  const currentCalculation = useMemo(() => {
    return calculateInterest(currency, balance, accountType);
  }, [currency, balance, accountType]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const topRates = useMemo(() => {
    return calculations
      .sort((a, b) => (b.pro.annualRate || -10) - (a.pro.annualRate || -10))
      .slice(0, 5);
  }, [calculations]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Interest Rate Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculate potential interest earnings on your idle cash balances. Interactive Brokers pays competitive rates on uninvested cash.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Calculator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Type</label>
            <Select value={accountType} onValueChange={(value: 'lite' | 'pro') => setAccountType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lite">IBKR Lite</SelectItem>
                <SelectItem value="pro">IBKR Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cash Balance</label>
            <Input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              min={0}
              step={1000}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {interestRates.map((rate) => (
                  <SelectItem key={rate.currency} value={rate.currency}>
                    {rate.flag} {rate.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Calculation Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Balance</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(balance, currency)}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Annual Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {currentCalculation.annualRate.toFixed(2)}%
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              IBKR {accountType.toUpperCase()}
            </Badge>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Monthly Interest</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(currentCalculation.monthlyInterest, currency)}
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Annual Interest</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(currentCalculation.annualInterest, currency)}
            </div>
          </div>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="rates">All Rates</TabsTrigger>
            <TabsTrigger value="top">Top Rates</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            {/* Rate Comparison */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3">Rate Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IBKR Lite</span>
                    <Badge variant="outline">
                      {calculateInterest(currency, balance, 'lite').annualRate.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IBKR Pro</span>
                    <Badge variant="default">
                      {calculateInterest(currency, balance, 'pro').annualRate.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Difference: <span className="font-medium text-green-600">
                    {Math.abs(calculateInterest(currency, balance, 'pro').annualInterest - calculateInterest(currency, balance, 'lite').annualInterest).toFixed(2)} {currency}/year
                  </span></div>
                  <div>Recommended: <span className="font-medium">IBKR Pro</span></div>
                </div>
              </div>
            </div>

            {/* Balance Tiers */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3">Balance Tiers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>First $10,000</span>
                  <Badge variant="secondary">0% interest</Badge>
                </div>
                <div className="flex justify-between">
                  <span>$10,000 - $100,000</span>
                  <Badge variant="outline">Proportional rate</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Above $100,000</span>
                  <Badge variant="default">Maximum rate</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rates" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Currency</th>
                    <th className="text-right p-3 font-semibold">IBKR Lite</th>
                    <th className="text-right p-3 font-semibold">IBKR Pro</th>
                    <th className="text-right p-3 font-semibold">Monthly at ${formatNumber(balance)}</th>
                    <th className="text-right p-3 font-semibold">Annual at ${formatNumber(balance)}</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.map((calc) => (
                    <tr key={calc.currency} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span>{calc.flag}</span>
                          <span className="font-medium">{calc.currency}</span>
                        </div>
                      </td>
                      <td className="text-right p-3">
                        <span className={calc.lite.annualRate > 0 ? 'text-green-600' : 'text-red-600'}>
                          {calc.lite.annualRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span className={calc.pro.annualRate > 0 ? 'text-green-600' : 'text-red-600'}>
                          {calc.pro.annualRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right p-3">
                        {formatCurrency(calc.pro.monthlyInterest, calc.currency)}
                      </td>
                      <td className="text-right p-3">
                        {formatCurrency(calc.pro.annualInterest, calc.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="top" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topRates.map((calc, index) => (
                <div key={calc.currency} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{calc.flag}</span>
                      <div>
                        <div className="font-semibold">{calc.currency}</div>
                        <div className="text-xs text-muted-foreground">
                          #{index + 1} highest rate
                        </div>
                      </div>
                    </div>
                    <Badge variant="default" className="text-lg">
                      {calc.pro.annualRate.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Monthly: {formatCurrency(calc.pro.monthlyInterest, calc.currency)}</div>
                    <div>Annual: {formatCurrency(calc.pro.annualInterest, calc.currency)}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Important Notes */}
        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1">Important Notes:</div>
            <ul className="text-blue-700 space-y-1">
              <li>• No interest paid on first $10,000 of cash balance</li>
              <li>• Rates are proportional between $10,000 - $100,000</li>
              <li>• Maximum rates apply to balances above $100,000</li>
              <li>• Rates are subject to change and may vary by client type</li>
              <li>• Interest is paid monthly and compounds daily</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestRateCalculator;