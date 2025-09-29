import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

interface FeeData {
  broker: string;
  usStock: number;
  options: number;
  forex: number;
  marginRate: number;
  inactivityFee: number;
  withdrawalFee: string;
}

interface FeeComparisonTableProps {
  currentBroker?: string;
}

const FeeComparisonTable: React.FC<FeeComparisonTableProps> = ({ currentBroker }) => {
  const [tradeAmount, setTradeAmount] = useState(2000);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const feeData: FeeData[] = [
    {
      broker: 'Interactive Brokers',
      usStock: 0.0,
      options: 0.65,
      forex: 2.00,
      marginRate: 4.83,
      inactivityFee: 0,
      withdrawalFee: 'First free'
    },
    {
      broker: 'Saxo Bank',
      usStock: 1.6,
      options: 20.0,
      forex: 0,
      marginRate: 0,
      inactivityFee: 0,
      withdrawalFee: '0'
    },
    {
      broker: 'DEGIRO',
      usStock: 2.1,
      options: 7.5,
      forex: 0,
      marginRate: 6.9,
      inactivityFee: 0,
      withdrawalFee: '0'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Fees' },
    { id: 'trading', label: 'Trading Fees' },
    { id: 'account', label: 'Account Fees' },
    { id: 'margin', label: 'Margin Rates' }
  ];

  const calculateAnnualCost = (broker: FeeData) => {
    // Simple calculation based on 10 trades per month
    const monthlyTrades = 10;
    const annualStockFees = broker.usStock * monthlyTrades * 12;
    const annualOptionsFees = broker.options * monthlyTrades * 12;
    const annualInactivityFee = broker.inactivityFee * 12;
    return annualStockFees + annualOptionsFees + annualInactivityFee;
  };

  const getBestValue = (field: keyof FeeData) => {
    const numericFields = ['usStock', 'options', 'forex', 'marginRate', 'inactivityFee'];
    if (numericFields.includes(field)) {
      return Math.min(...feeData.map(d => d[field as keyof FeeData] as number));
    }
    return null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') return ['trading', 'account', 'margin'];
    return [selectedCategory];
  }, [selectedCategory]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Fee Comparison Analysis
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Interactive Brokers
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare Interactive Brokers fees with top competitors. Lower values are better.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trade Amount Calculator */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <label htmlFor="tradeAmount" className="text-sm font-medium">
              Trade Amount:
            </label>
            <Input
              id="tradeAmount"
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
              className="w-32"
              min={100}
              max={100000}
            />
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Based on ${tradeAmount.toLocaleString()} trade with 10 monthly trades
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Fee Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Broker</th>
                {filteredCategories.includes('trading') && (
                  <>
                    <th className="text-right p-3 font-semibold">
                      US Stock Fee
                      <div className="text-xs font-normal text-muted-foreground">
                        ${tradeAmount} trade
                      </div>
                    </th>
                    <th className="text-right p-3 font-semibold">
                      Options Fee
                      <div className="text-xs font-normal text-muted-foreground">
                        Per contract
                      </div>
                    </th>
                    <th className="text-right p-3 font-semibold">
                      Forex Commission
                      <div className="text-xs font-normal text-muted-foreground">
                        Per lot
                      </div>
                    </th>
                  </>
                )}
                {filteredCategories.includes('account') && (
                  <>
                    <th className="text-right p-3 font-semibold">
                      Inactivity Fee
                      <div className="text-xs font-normal text-muted-foreground">
                        Annual
                      </div>
                    </th>
                    <th className="text-right p-3 font-semibold">
                      Withdrawal Fee
                    </th>
                  </>
                )}
                {filteredCategories.includes('margin') && (
                  <th className="text-right p-3 font-semibold">
                    Margin Rate
                    <div className="text-xs font-normal text-muted-foreground">
                      Annual %
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {feeData.map((broker) => (
                <tr
                  key={broker.broker}
                  className={`border-b hover:bg-muted/50 transition-colors ${
                    broker.broker === 'Interactive Brokers' ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        broker.broker === 'Interactive Brokers' ? 'text-blue-600' : ''
                      }`}>
                        {broker.broker}
                      </span>
                      {broker.broker === 'Interactive Brokers' && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  </td>

                  {filteredCategories.includes('trading') && (
                    <>
                      <td className="text-right p-3">
                        <div className="flex flex-col items-end">
                          <span className={`font-medium ${
                            broker.usStock === getBestValue('usStock') ? 'text-green-600' : ''
                          }`}>
                            {formatCurrency(broker.usStock)}
                          </span>
                          {broker.usStock === 0 && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Free
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-right p-3">
                        <span className={`font-medium ${
                          broker.options === getBestValue('options') ? 'text-green-600' : ''
                        }`}>
                          {formatCurrency(broker.options)}
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span className={`font-medium ${
                          broker.forex === getBestValue('forex') ? 'text-green-600' : ''
                        }`}>
                          {broker.forex > 0 ? formatCurrency(broker.forex) : 'N/A'}
                        </span>
                      </td>
                    </>
                  )}

                  {filteredCategories.includes('account') && (
                    <>
                      <td className="text-right p-3">
                        <span className={`font-medium ${
                          broker.inactivityFee === getBestValue('inactivityFee') ? 'text-green-600' : ''
                        }`}>
                          {formatCurrency(broker.inactivityFee)}
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span className="font-medium">{broker.withdrawalFee}</span>
                      </td>
                    </>
                  )}

                  {filteredCategories.includes('margin') && (
                    <td className="text-right p-3">
                      <span className={`font-medium ${
                        broker.marginRate === getBestValue('marginRate') ? 'text-green-600' : ''
                      }`}>
                        {broker.marginRate > 0 ? `${broker.marginRate}%` : 'N/A'}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculateAnnualCost(feeData[0]))}
            </div>
            <div className="text-sm text-muted-foreground">
              Estimated Annual Cost
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              10 trades/month × 12 months
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(feeData[0].usStock)}
            </div>
            <div className="text-sm text-muted-foreground">
              US Stock Commission
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              Lowest in industry
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {feeData[0].marginRate}%
            </div>
            <div className="text-sm text-muted-foreground">
              Margin Rate
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              IBKR Pro
            </Badge>
          </div>
        </div>

        {/* Key Insights */}
        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1">Key Insights:</div>
            <ul className="text-blue-700 space-y-1">
              <li>• Interactive Brokers offers the lowest US stock trading fees in the industry</li>
              <li>• No inactivity fees or account minimums for cash accounts</li>
              <li>• Free stock and ETF trading for US clients on IBKR Lite plan</li>
              <li>• Competitive margin rates for IBKR Pro clients</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeComparisonTable;