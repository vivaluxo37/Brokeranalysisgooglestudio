import type { Broker } from '../types'
import type { CategoryConfig } from './constants/categories'

const normalize = (value: unknown): string =>
  typeof value === 'string' ? value.toLowerCase().trim() : ''

const includesNormalized = (haystack: string | string[] | undefined, needle: string): boolean => {
  if (!haystack) {return false}
  if (Array.isArray(haystack)) {
    return haystack.some((item) => normalize(item).includes(needle))
  }
  return normalize(haystack).includes(needle)
}

const parseNumericValue = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const match = value.match(/(\d+\.?\d*)/)
    return match ? parseFloat(match[1]) : NaN
  }

  return NaN
}

const parseLeverageString = (value: unknown): number => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value !== 'string') {
    return 0
  }

  const normalized = value.toLowerCase()
  if (normalized.includes('unlimited')) {
    return 10000
  }

  const match = normalized.match(/1\s*[:\-/]\s*(\d{1,5})/)
  if (match) {
    return parseInt(match[1], 10) || 0
  }

  const numeric = parseInt(normalize(value).replace(/[^0-9]/g, ''), 10)
  return Number.isFinite(numeric) ? numeric : 0
}

const hasAccountType = (broker: Broker, predicate: (account: Broker['accountTypes'][number]) => boolean): boolean => {
  const accounts = broker.accountTypes
  if (!Array.isArray(accounts)) {
    return false
  }

  return accounts.some((account) => predicate(account))
}

const supportsPlatform = (broker: Broker, platform: string): boolean => {
  const normalized = normalize(platform)
  const platforms = broker.technology?.platforms
  if (!Array.isArray(platforms)) {
    return false
  }
  return platforms.some((p) => normalize(p).includes(normalized))
}

const getSpread = (broker: Broker, pair: string): number => {
  const spreads = broker.tradingConditions?.spreads
  if (!spreads) {
    return NaN
  }
  return parseNumericValue((spreads as Record<string, unknown>)[pair])
}

const getMinDeposit = (broker: Broker): number => {
  const deposits: number[] = []

  if (typeof broker.accessibility?.minDeposit !== 'undefined') {
    deposits.push(parseNumericValue(broker.accessibility?.minDeposit))
  }

  if (Array.isArray(broker.accountTypes)) {
    broker.accountTypes.forEach((account) => {
      if (typeof account?.minDeposit !== 'undefined') {
        deposits.push(parseNumericValue(account.minDeposit))
      }
    })
  }

  const numericDeposits = deposits.filter((value) => Number.isFinite(value))
  if (numericDeposits.length === 0) {
    return Number.POSITIVE_INFINITY
  }

  return Math.min(...numericDeposits)
}

const hasRegulator = (broker: Broker, regulator: string): boolean => {
  const normalizedRegulator = normalize(regulator)
  if (!normalizedRegulator) {
    return false
  }

  const regulators = broker.regulation?.regulators
  if (!Array.isArray(regulators)) {
    return false
  }

  return regulators.some((reg) => normalize(reg) === normalizedRegulator)
}

const hasMinRegulation = (broker: Broker, minimum: number): boolean => {
  const rating = broker.ratings?.regulation
  if (typeof rating === 'number') {
    return rating >= minimum
  }
  return false
}

const hasFeature = (broker: Broker, feature: string): boolean => {
  const normalized = normalize(feature)
  if (!normalized) {
    return false
  }

  switch (normalized) {
    case 'islamic':
    case 'islamic-account':
    case 'swap-free':
      return broker.isIslamic === true || broker.accountManagement?.islamicAccount?.available === true
    case 'copytrading':
    case 'copy-trading':
    case 'copy':
    case 'social-trading':
      return broker.copyTrading === true || broker.platformFeatures?.copyTrading?.available === true
    case 'scalping':
    case 'scalping-allowed':
      return broker.tradingConditionsExtended?.scalpingAllowed === true
    case 'hedging':
      return broker.tradingConditionsExtended?.hedgingAllowed === true
    case 'pamm':
    case 'mam':
      return broker.accountManagement?.mamPammSupport === true
    case 'micro-accounts':
    case 'micro':
      return hasAccountType(broker, (account) => parseNumericValue(account?.minDeposit) <= 50)
    case 'corporate':
    case 'corporate-accounts':
      return broker.accountManagement?.corporateAccounts === true
    case 'no-deposit-bonus':
      return Boolean(broker.promotions?.welcomeBonus && normalize(broker.promotions?.welcomeBonus).includes('no deposit'))
    case 'high-leverage':
      return parseLeverageString(broker.tradingConditions?.maxLeverage) >= 500
    case 'zero-spread':
    case 'raw-spreads':
      return hasAccountType(broker, (account) => includesNormalized(account?.spreads, '0.0') || includesNormalized(account?.spreads, 'raw'))
    case 'fixed-spreads':
      return hasAccountType(broker, (account) => includesNormalized(account?.spreads, 'fixed'))
    case 'no-requotes':
      return broker.tradingEnvironment?.requotes === false
    case 'api-trading':
    case 'api':
      return broker.technology?.apiAccess === true
    default:
      return includesNormalized(broker.summary, normalized) || includesNormalized(broker.description, normalized)
  }
}

export function filterBrokersByCategory(
  brokers: Broker[],
  category: CategoryConfig,
  options: { limit?: number } = {},
): Broker[] {
  if (!Array.isArray(brokers) || !category) {
    return []
  }

  const criteria = category.filterCriteria ?? {}

  const results = brokers.filter((broker) => {
    if (criteria.isActive === true) {
      if (typeof broker.score !== 'number' || broker.score <= 0) {
        return false
      }
    }

    if (criteria.score?.min && broker.score < criteria.score.min) {
      return false
    }
    if (criteria.score?.max && broker.score > criteria.score.max) {
      return false
    }

    if (criteria.executionType) {
      if (!includesNormalized(broker.technology?.executionType, String(criteria.executionType))) {
        return false
      }
    }

    if (criteria.stpExecution && !includesNormalized(broker.technology?.executionType, 'stp')) {
      return false
    }

    if (criteria.noDealingDesk) {
      const execution = normalize(broker.technology?.executionType)
      if (!execution.includes('ecn') && !execution.includes('stp') && !execution.includes('ndd')) {
        return false
      }
    }

    if (criteria.supportsMt4 && !supportsPlatform(broker, 'mt4')) {
      return false
    }

    if (criteria.supportsMt5 && !supportsPlatform(broker, 'mt5')) {
      return false
    }

    if (criteria.supportsTradingview && !supportsPlatform(broker, 'tradingview')) {
      return false
    }

    if (criteria.offersIslamicAccounts && !hasFeature(broker, 'islamic')) {
      return false
    }

    if (criteria.offersCfds && broker.score < (criteria.score?.min ?? 7.0)) {
      return false
    }

    if (criteria.supportsScalping && !hasFeature(broker, 'scalping')) {
      return false
    }

    if (criteria.supportsHedging && !hasFeature(broker, 'hedging')) {
      return false
    }

    if (criteria.supportsHft && broker.technology?.apiAccess !== true) {
      return false
    }

    if (criteria.supportsApiTrading && broker.technology?.apiAccess !== true) {
      return false
    }

    if (criteria.offersPamm && !hasFeature(broker, 'pamm')) {
      return false
    }

    if (criteria.hasRawSpreads) {
      const hasRaw = hasAccountType(broker, (account) => includesNormalized(account?.spreads, '0.0') || includesNormalized(account?.spreads, 'raw'))
      if (!hasRaw) {
        return false
      }
    }

    if (criteria.eurusdSpread?.max) {
      const spread = getSpread(broker, 'eurusd')
      if (Number.isFinite(spread) && spread > criteria.eurusdSpread.max) {
        return false
      }
    }

    if (criteria.minDepositAmount?.max) {
      if (getMinDeposit(broker) > criteria.minDepositAmount.max) {
        return false
      }
    }

    if (criteria.noDepositRequired && getMinDeposit(broker) > 0) {
      return false
    }

    if (criteria.maxLeverage?.min) {
      const leverage = parseLeverageString(broker.tradingConditions?.maxLeverage)
      if (leverage < criteria.maxLeverage.min) {
        return false
      }
    }

    if (criteria.offersMicroAccounts && !hasFeature(broker, 'micro-accounts')) {
      return false
    }

    if (criteria.regulationRating?.min && !hasMinRegulation(broker, criteria.regulationRating.min)) {
      return false
    }

    if (criteria.supportsCryptoCfds) {
      const cryptoTotal = parseNumericValue(broker.tradableInstruments?.cryptocurrencies?.total)
      if (!(cryptoTotal > 0)) {
        return false
      }
    }

    if (criteria.offersStockCfds) {
      const stockTotal = parseNumericValue(broker.tradableInstruments?.stocks?.total)
      if (!(stockTotal > 0)) {
        return false
      }
    }

    if (criteria.fixedSpreads && !hasFeature(broker, 'fixed-spreads')) {
      return false
    }

    if (criteria.instantExecution) {
      const speed = broker.tradingEnvironment?.executionSpeedMs
      if (typeof speed === 'number' && speed > 100) {
        return false
      }
    }

    if (criteria.hasTrailingStops) {
      const orderTypes = broker.tradingEnvironment?.orderTypes
      if (!Array.isArray(orderTypes) || !orderTypes.some((type) => normalize(type) === 'trailing stop')) {
        return false
      }
    }

    if (criteria.isOffshore) {
      const regulators = broker.regulation?.regulators?.map(normalize)
      if (!Array.isArray(regulators)) {
        return false
      }
      const hasTierOneLicense = regulators.some((reg) => ['fca', 'asic', 'nfa', 'cftc', 'cysec', 'bafin'].includes(reg))
      if (hasTierOneLicense) {
        return false
      }
    }

    if (criteria.offersCorporateAccounts && broker.accountManagement?.corporateAccounts !== true) {
      return false
    }

    if (criteria.swapFeeCategory && broker.tradingConditions?.swapFeeCategory !== criteria.swapFeeCategory) {
      return false
    }

    if (criteria.suitableForBeginners) {
      const minimumDeposit = getMinDeposit(broker)
      if (!(minimumDeposit <= 100 && broker.score >= 8.0)) {
        return false
      }
    }

    if (criteria.supportsCryptoCfds && broker.tradableInstruments?.cryptocurrencies?.total === 0) {
      return false
    }

    if (criteria.supportsTradingview && !supportsPlatform(broker, 'tradingview')) {
      return false
    }

    if (criteria.regulators?.length) {
      const matchesRegulators = criteria.regulators.some((regulator: string) => hasRegulator(broker, regulator))
      if (!matchesRegulators) {
        return false
      }
    }

    if (criteria.features?.length) {
      const matchesFeatures = criteria.features.every((feature: string) => hasFeature(broker, feature))
      if (!matchesFeatures) {
        return false
      }
    }

    return true
  }).sort((a, b) => (b.score || 0) - (a.score || 0))

  const limit = typeof options.limit === 'number' && options.limit > 0 ? options.limit : undefined
  return typeof limit === 'number' ? results.slice(0, limit) : results
}
