import { Broker } from '../types'

import brokerFlags from './generated/brokerFlags.json'

type BrokerTraitMap = Record<string, Record<string, boolean>>;
export type BrokerTraits = BrokerTraitMap[string];

const traitMap = brokerFlags as BrokerTraitMap

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/gi, '-')

const includesText = (source: string | undefined | null, keyword: string): boolean =>
  Boolean(source && source.toLowerCase().includes(keyword))

const arrayIncludesText = (values: unknown, keyword: string): boolean =>
  Array.isArray(values) && values.some((value) => includesText(String(value), keyword))

const hasTrait = (brokerId: string, trait: string): boolean => {
  const traits = traitMap[brokerId]
  return Boolean(traits && traits[trait])
}
const hasPlatform = (broker: Broker, keyword: string): boolean =>
  arrayIncludesText(broker.technology?.platforms, keyword) ||
  arrayIncludesText(
    Array.isArray(broker.platformFeatures?.platforms)
      ? (broker.platformFeatures?.platforms as unknown[])
      : broker.platformFeatures?.automatedTrading,
    keyword,
  )


const supportsCopyTrading = (broker: Broker): boolean => {
  if (broker.copyTrading === true) {return true}
  const copyTrading = broker.platformFeatures?.copyTrading
  return Boolean(copyTrading && typeof copyTrading === 'object' && copyTrading.available)
}

const hasIslamicAccount = (broker: Broker): boolean => {
  if (broker.isIslamic === true) {return true}
  const islamic = broker.accountManagement?.islamicAccount
  return Boolean(islamic && islamic.available)
}

const allowsScalping = (broker: Broker): boolean => broker.tradingConditionsExtended?.scalpingAllowed === true

const allowsHedging = (broker: Broker): boolean => broker.tradingConditionsExtended?.hedgingAllowed === true

const hasPammSupport = (broker: Broker): boolean => broker.accountManagement?.mamPammSupport === true

const hasCorporateAccounts = (broker: Broker): boolean => broker.accountManagement?.corporateAccounts === true

const hasApiAccess = (broker: Broker): boolean => {
  if (broker.technology?.apiAccess) {return true}
  return arrayIncludesText(broker.platformFeatures?.automatedTrading, 'api')
}

const offersTrailingStops = (broker: Broker): boolean =>
  arrayIncludesText(broker.tradingEnvironment?.orderTypes, 'trailing')

const hasMicroAccounts = (broker: Broker): boolean =>
  broker.accountTypes?.some((account) => account.minDeposit <= 50) === true

const hasRawSpreads = (broker: Broker): boolean => {
  if (broker.fees?.trading?.spreadType === 'Raw') {return true}
  return broker.accountTypes?.some((account) => includesText(account.spreads, '0.0')) ?? false
}

const hasFixedSpreads = (broker: Broker): boolean => broker.fees?.trading?.spreadType === 'Fixed'

const hasZeroSpread = (broker: Broker): boolean => {
  if (broker.fees?.trading?.spreadType === 'Raw') {return true}
  return broker.accountTypes?.some((account) => includesText(account.spreads, '0.0')) ?? false
}

const hasInstantExecution = (broker: Broker): boolean => {
  if (broker.tradingEnvironment?.requotes === false && broker.tradingEnvironment?.executionSpeedMs) {
    return broker.tradingEnvironment.executionSpeedMs <= 80
  }
  return includesText(broker.technology?.executionType, 'instant')
}

const isHighLeverage = (broker: Broker): boolean => {
  const leverage = broker.tradingConditions?.maxLeverage
  if (!leverage) {return false}
  if (typeof leverage === 'string') {
    if (leverage.toLowerCase().includes('unlimited')) {return true}
    const match = leverage.match(/:(\d+)/)
    if (match) {
      return parseInt(match[1], 10) >= 500
    }
  }
  return false
}

const isOffshoreBroker = (broker: Broker): boolean => {
  const headquarters = broker.headquarters?.toLowerCase() ?? ''
  if (/seychelles|belize|vanuatu|mauritius|bahamas|bvi|cayman|st\.\s?vincent|nevis|marshall islands/.test(headquarters)) {
    return true
  }
  const regulators = broker.regulation?.regulators?.map((reg) => reg.toLowerCase()) ?? []
  return regulators.some((reg) =>
    /fsc|ifsc|vfsc|labuan|mauritius|svg|st\.\s?vincent|belize|seychelles|bahamas|bvi|cayman/.test(reg),
  )
}

const featureHandlers: Record<string, (broker: Broker) => boolean> = {
  ndd: (broker) => hasTrait(broker.id, 'isNDD'),
  'no-dealing-desk': (broker) => hasTrait(broker.id, 'isNDD'),
  ecn: (broker) => hasTrait(broker.id, 'isECN'),
  stp: (broker) => hasTrait(broker.id, 'isSTP'),
  mt4: (broker) => hasPlatform(broker, 'mt4') || hasPlatform(broker, 'metatrader 4'),
  mt5: (broker) => hasPlatform(broker, 'mt5') || hasPlatform(broker, 'metatrader 5'),
  dma: (broker) => includesText(broker.technology?.executionType, 'dma') || hasTrait(broker.id, 'isDMA'),
  copytrading: supportsCopyTrading,
  'copy-trading': supportsCopyTrading,
  copy: supportsCopyTrading,
  'social-trading': supportsCopyTrading,
  islamic: hasIslamicAccount,
  'islamic-account': hasIslamicAccount,
  'swap-free': hasIslamicAccount,
  scalping: allowsScalping,
  'day-trading': (broker) => allowsScalping(broker) || hasTrait(broker.id, 'isDayTrading'),
  'swing-trading': (broker) => hasTrait(broker.id, 'isSwing'),
  hedging: allowsHedging,
  'low-swap': (broker) => broker.tradingConditions?.swapFeeCategory === 'Low',
  'raw-spreads': hasRawSpreads,
  'zero-spread': hasZeroSpread,
  'fixed-spreads': hasFixedSpreads,
  'instant-execution': hasInstantExecution,
  hft: (broker) => hasTrait(broker.id, 'isHFT') || (hasTrait(broker.id, 'isECN') && hasInstantExecution(broker)),
  pamm: hasPammSupport,
  'pamm-accounts': hasPammSupport,
  'api-trading': hasApiAccess,
  'trailing-stops': offersTrailingStops,
  'micro-accounts': hasMicroAccounts,
  offshore: isOffshoreBroker,
  corporate: hasCorporateAccounts,
  'corporate-accounts': hasCorporateAccounts,
  'no-deposit-bonus': (broker) => hasTrait(broker.id, 'isNoDeposit'),
  'high-leverage': isHighLeverage,
  leverage: isHighLeverage,
  beginner: (broker) => hasTrait(broker.id, 'isBeginnerFriendly'),
  advanced: (broker) => hasTrait(broker.id, 'isAdvanced'),
  crypto: (broker) => hasTrait(broker.id, 'isCrypto') || broker.tradableInstruments?.cryptocurrencies?.total > 0,
  gold: (broker) => hasTrait(broker.id, 'isGold') || includesText(broker.summary, 'gold'),
  stocks: (broker) => hasTrait(broker.id, 'isStocks') || broker.tradableInstruments?.stocks?.total > 0,
  'no-requotes': (broker) => broker.tradingEnvironment?.requotes === false,
}

export const supportedFeatureKeys = Object.keys(featureHandlers)

export const brokerHasFeature = (broker: Broker, feature: string): boolean => {
  const normalized = normalize(feature)
  const handler = featureHandlers[normalized] ?? featureHandlers[feature.toLowerCase()]
  if (!handler) {
    return false
  }
  return handler(broker)
}

export const getBrokerTraits = (brokerId: string): BrokerTraits | undefined => traitMap[brokerId]
