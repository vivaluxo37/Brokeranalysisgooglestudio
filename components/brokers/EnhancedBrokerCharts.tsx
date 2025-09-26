import React, { useState } from 'react';
import { Broker } from '../../types';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTheme } from '../../hooks/useTheme';

interface EnhancedBrokerChartsProps {
  broker: Broker;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const EnhancedBrokerCharts: React.FC<EnhancedBrokerChartsProps> = ({ broker }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'risk' | 'performance'>('overview');

  // Radar chart data
  const radarData = [
    { subject: 'Regulation', A: broker.ratings.regulation, fullMark: 10 },
    { subject: 'Costs', A: broker.ratings.costs, fullMark: 10 },
    { subject: 'Platforms', A: broker.ratings.platforms, fullMark: 10 },
    { subject: 'Support', A: broker.ratings.support, fullMark: 10 },
  ];

  // Spread comparison data
  const spreadData = [
    { pair: 'EUR/USD', broker: broker.tradingConditions.spreads.eurusd, industry: 0.6 },
    { pair: 'GBP/USD', broker: broker.tradingConditions.spreads.gbpusd, industry: 0.9 },
    { pair: 'USD/JPY', broker: broker.tradingConditions.spreads.usdjpy, industry: 0.7 },
  ];

  // Fee structure data
  const feeData = [
    { type: 'Spread (EUR/USD)', amount: broker.tradingConditions.spreads.eurusd },
    { type: 'Commission', amount: broker.tradingConditions.commission || 0 },
    { type: 'Inactivity Fee', amount: broker.fees?.inactivity || 0 },
    { type: 'Withdrawal Fee', amount: broker.fees?.withdrawal || 0 },
  ];

  // Platform usage data (simulated)
  const platformData = [
    { platform: 'MT4', usage: 85 },
    { platform: 'MT5', usage: 70 },
    { platform: 'cTrader', usage: 45 },
    { platform: 'Web Platform', usage: 60 },
  ];

  // Risk assessment data
  const riskData = [
    { category: 'Leverage Risk', score: 7 },
    { category: 'Market Risk', score: 6 },
    { category: 'Liquidity Risk', score: 4 },
    { category: 'Counterparty Risk', score: 3 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {(['overview', 'fees', 'risk', 'performance'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ratings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: 'hsl(var(--foreground))' }} />
                  <Radar
                    name={broker.name}
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spread Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spread Comparison (pips)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={spreadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="pair" tick={{ fill: 'hsl(var(--foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="broker" name={broker.name} fill="hsl(var(--primary))" />
                  <Bar dataKey="industry" name="Industry Average" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fees Tab */}
      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fee Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={feeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" tick={{ fill: 'hsl(var(--foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ platform, usage }) => `${platform}: ${usage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="usage"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Tab */}
      {activeTab === 'risk' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fill: 'hsl(var(--foreground))' }} />
                <YAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--destructive))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {broker.ratings.regulation}/10
                </div>
                <div className="text-sm text-muted-foreground">Regulation</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {broker.tradingConditions.spreads.eurusd.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">EUR/USD Spread</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  1:{broker.tradingConditions.leverage}
                </div>
                <div className="text-sm text-muted-foreground">Max Leverage</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {broker.tradingConditions.minDeposit}
                </div>
                <div className="text-sm text-muted-foreground">Min Deposit</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedBrokerCharts;