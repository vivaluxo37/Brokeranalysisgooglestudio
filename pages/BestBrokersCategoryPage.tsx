import React from 'react'

import { useParams } from 'react-router-dom'

import { Broker } from '../types'

import CategoryPage from './CategoryPage'

// Category configuration mapping
const CATEGORY_CONFIG: Record<string, { title: string; description: string; filterFn: (broker: Broker) => boolean }> = {
  'top-online-trading-brokers': {
    title: 'Top Online Trading Brokers 2025',
    description: 'Discover the best online trading platforms for 2025. Compare features, fees, and regulations to find your ideal broker.',
    filterFn: (broker) => broker.score >= 4.5,
  },
  'top-cfd-brokers-platforms': {
    title: 'Best CFD Trading Platforms 2025',
    description: 'Compare leading CFD brokers with competitive spreads, advanced trading tools, and robust regulation.',
    filterFn: (broker) => broker.tradableInstruments.indices.total > 0 || broker.tradableInstruments.commodities.total > 0,
  },
  'top-forex-brokers': {
    title: 'Top Forex Brokers 2025',
    description: 'Find the most reliable forex brokers with tight spreads, fast execution, and strong regulatory oversight.',
    filterFn: (broker) => broker.tradableInstruments.forexPairs.total > 0,
  },
  'ecn-brokers': {
    title: 'Best ECN Brokers 2025',
    description: 'Trade with true ECN brokers offering direct market access, raw spreads, and no dealing desk intervention.',
    filterFn: (broker) => broker.coreInfo.brokerType === 'ECN' || broker.technology.executionType === 'ECN',
  },
  'dma-direct-market-access-brokers': {
    title: 'Direct Market Access (DMA) Brokers 2025',
    description: 'Access real market prices with DMA brokers offering direct order routing to liquidity providers.',
    filterFn: (broker) => broker.coreInfo.brokerType === 'ECN' || broker.technology.executionType === 'DMA',
  },
  'stp-brokers': {
    title: 'Best STP Brokers 2025',
    description: 'Find STP brokers that directly transmit your orders to liquidity providers without intervention.',
    filterFn: (broker) => broker.coreInfo.brokerType === 'STP' || broker.technology.executionType === 'STP',
  },
  'no-dealing-desk-brokers': {
    title: 'No Dealing Desk (NDD) Brokers 2025',
    description: 'Trade without dealer intervention using NDD brokers offering transparent pricing and execution.',
    filterFn: (broker) => ['ECN', 'STP', 'NDD'].includes(broker.coreInfo.brokerType),
  },
  'raw-spread-brokers': {
    title: 'Best Raw Spread Brokers 2025',
    description: 'Access institutional-grade spreads with raw spread brokers offering direct market access.',
    filterFn: (broker) => broker.fees.trading.spreadType === 'Raw',
  },
  'instant-execution-brokers': {
    title: 'Best Instant Execution Brokers 2025',
    description: 'Execute trades immediately with instant execution brokers offering fast order confirmation.',
    filterFn: (broker) => broker.technology.executionType === 'Instant',
  },
  'fixed-spread-brokers': {
    title: 'Best Fixed Spread Brokers 2025',
    description: 'Trade with predictable costs using fixed spread brokers offering stable pricing regardless of market conditions.',
    filterFn: (broker) => broker.fees.trading.spreadType === 'Fixed',
  },
  'no-spread-brokers': {
    title: 'Zero Spread Brokers 2025',
    description: 'Find brokers offering zero or zero-pip spreads on major currency pairs and instruments.',
    filterFn: (broker) => broker.fees.trading.averageSpreads.some(s => parseFloat(s.spread) === 0),
  },
  'pamm-brokers': {
    title: 'Best PAMM Brokers 2025',
    description: 'Invest through professional money managers with PAMM brokers offering managed account services.',
    filterFn: (broker) => broker.accountManagement.mamPammSupport,
  },
  'hft-brokers': {
    title: 'Best High-Frequency Trading Brokers 2025',
    description: 'Optimized for algorithmic trading with HFT-friendly brokers offering low latency and high execution speeds.',
    filterFn: (broker) => broker.technology.apiAccess === true || broker.platformFeatures.automatedTrading.includes('API'),
  },
  'scalping-brokers': {
    title: 'Best Scalping Brokers 2025',
    description: 'Trade short-term price movements with brokers that fully support scalping strategies.',
    filterFn: (broker) => broker.tradingConditionsExtended.scalpingAllowed,
  },
  'swing-trading-brokers': {
    title: 'Best Swing Trading Brokers 2025',
    description: 'Perfect for medium-term strategies with brokers offering competitive overnight rates and swing trading support.',
    filterFn: (broker) => broker.tradingConditionsExtended.scalpingAllowed, // Most swing trading brokers also allow scalping
  },
  'hedging-brokers': {
    title: 'Best Hedging Brokers 2025',
    description: 'Trade opposing positions freely with brokers that allow full hedging capabilities.',
    filterFn: (broker) => broker.tradingConditionsExtended.hedgingAllowed,
  },
  'brokers-for-beginners': {
    title: 'Best Forex Brokers for Beginners 2025',
    description: 'Start your trading journey with beginner-friendly brokers offering education, low minimums, and great support.',
    filterFn: (broker) => broker.accessibility.minDeposit <= 100 || broker.coreInfo.demoAccount,
  },
  'day-trading-brokers': {
    title: 'Best Day Trading Brokers 2025',
    description: 'Optimized for intraday trading with brokers offering tight spreads, fast execution, and day trading support.',
    filterFn: (broker) => broker.tradingConditionsExtended.scalpingAllowed,
  },
  'api-trading-brokers': {
    title: 'Best API Trading Brokers 2025',
    description: 'Build automated trading systems with brokers offering robust APIs and algorithmic trading support.',
    filterFn: (broker) => broker.technology.apiAccess,
  },
  'most-regulated-brokers': {
    title: 'Most Regulated Forex Brokers 2025',
    description: 'Trade with confidence using highly regulated brokers with multiple tier-1 licenses.',
    filterFn: (broker) => broker.regulation.regulators.length >= 3,
  },
  'micro-accounts-brokers': {
    title: 'Best Micro Account Brokers 2025',
    description: 'Start small with micro account brokers offering trading from 0.01 lots and minimal deposits.',
    filterFn: (broker) => broker.tradingConditions.minLotSize !== undefined && broker.tradingConditions.minLotSize <= 0.01,
  },
  'high-leverage-brokers': {
    title: 'Best High Leverage Brokers 2025',
    description: 'Amplify your trading power with brokers offering competitive leverage up to 500:1 and beyond.',
    filterFn: (broker) => parseInt(broker.tradingConditions.maxLeverage.replace(/[^0-9:]/g, '')) >= 500,
  },
  'islamic-accounts-brokers': {
    title: 'Best Islamic Account Brokers 2025',
    description: 'Trade swap-free with Islamic account brokers offering Sharia-compliant trading conditions.',
    filterFn: (broker) => broker.accountManagement.islamicAccount.available === true || broker.isIslamic === true,
  },
  'no-deposit-brokers': {
    title: 'Best No Deposit Bonus Brokers 2025',
    description: 'Start trading without risk using brokers offering generous no-deposit bonuses and promotions.',
    filterFn: (broker) => broker.promotions?.welcomeBonus?.toLowerCase().includes('no deposit') === true,
  },
  'no-minimum-deposit-brokers': {
    title: 'Best No Minimum Deposit Brokers 2025',
    description: 'Begin trading with any amount using brokers that have no minimum deposit requirements.',
    filterFn: (broker) => broker.accessibility.minDeposit === 0,
  },
  'mt4-brokers': {
    title: 'Best MT4 Brokers 2025',
    description: 'Trade on the industry-standard MetaTrader 4 platform with top-rated MT4 brokers.',
    filterFn: (broker) => broker.technology.platforms.includes('MT4'),
  },
  'mt5-brokers': {
    title: 'Best MT5 Brokers 2025',
    description: 'Experience advanced trading features with the best MetaTrader 5 brokers.',
    filterFn: (broker) => broker.technology.platforms.includes('MT5'),
  },
  'tradingview-brokers': {
    title: 'Best TradingView Brokers 2025',
    description: 'Execute trades directly from TradingView charts with brokers offering seamless integration.',
    filterFn: (broker) => broker.technology.platforms.includes('TradingView'),
  },
  'crypto-cfd-brokers': {
    title: 'Best Crypto CFD Brokers 2025',
    description: 'Trade cryptocurrency CFDs with regulated brokers offering competitive crypto spreads.',
    filterFn: (broker) => broker.tradableInstruments.cryptocurrencies.total > 0,
  },
  'stock-cfd-brokers': {
    title: 'Best Stock CFD Brokers 2025',
    description: 'Access global stock markets through CFDs with brokers offering comprehensive stock CFD trading.',
    filterFn: (broker) => broker.tradableInstruments.stocks.total > 0,
  },
  'offshore-brokers': {
    title: 'Best Offshore Forex Brokers 2025',
    description: 'Explore offshore trading options with brokers offering flexible conditions and high leverage.',
    filterFn: (broker) => broker.security.regulatedBy.some(r => r.regulator.includes('Offshore') || r.regulator.includes('International')),
  },
  'corporate-account-brokers': {
    title: 'Best Corporate Account Brokers 2025',
    description: 'Open business trading accounts with brokers offering specialized corporate account services.',
    filterFn: (broker) => broker.accountManagement.corporateAccounts,
  },
  'trailing-stop-loss-brokers': {
    title: 'Best Trailing Stop Loss Brokers 2025',
    description: 'Automate your exits with brokers offering advanced trailing stop loss functionality.',
    filterFn: (broker) => broker.tradingEnvironment.orderTypes.includes('Trailing Stop'),
  },
}

const BestBrokersCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()

  // Default config for unknown categories
  const defaultConfig = {
    title: 'Trading Brokers 2025',
    description: 'Compare the best trading brokers for 2025. Find your ideal broker based on your trading needs.',
    filterFn: (broker: Broker) => broker.overallRating >= 4.0,
  }

  const config = categorySlug && CATEGORY_CONFIG[categorySlug]
    ? CATEGORY_CONFIG[categorySlug]
    : defaultConfig

  return <CategoryPage {...config} />
}

export default BestBrokersCategoryPage
