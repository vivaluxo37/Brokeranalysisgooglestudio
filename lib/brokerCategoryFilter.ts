import type { Broker } from '../types';
import type { CategoryConfig } from './constants/categories';
import { parseLeverage } from './utils';
import { filterAuthorizedBrokers } from '../data/authorizedBrokers';

/**
 * Filter brokers based on category criteria
 */
export function filterBrokersByCategory(
  brokers: Broker[],
  category: CategoryConfig
): Broker[] {
  // First, filter to only include authorized brokers
  const authorizedBrokers = filterAuthorizedBrokers(brokers);

  if (!category.filterCriteria || Object.keys(category.filterCriteria).length === 0) {
    // If no criteria, return all active authorized brokers sorted by score
    return authorizedBrokers
      .filter(broker => broker.score >= 7.0)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  return authorizedBrokers.filter(broker => {
    const criteria = category.filterCriteria;

    // Score filter
    if (criteria.score?.min && broker.score < criteria.score.min) return false;
    if (criteria.score?.max && broker.score > criteria.score.max) return false;

    // Execution type filters
    if (criteria.executionType && broker.technology?.executionType !== criteria.executionType) return false;
    if (criteria.stpExecution && !broker.technology?.executionType?.includes('STP')) return false;
    if (criteria.noDealingDesk && !['ECN', 'STP'].some(type => broker.technology?.executionType?.includes(type))) return false;

    // Platform filters
    if (criteria.supportsMt4 && !broker.technology?.platforms?.includes('MT4')) return false;
    if (criteria.supportsMt5 && !broker.technology?.platforms?.includes('MT5')) return false;
    if (criteria.supportsTradingview && !broker.technology?.platforms?.some(p => p.toLowerCase().includes('tradingview'))) return false;

    // Feature filters
    if (criteria.offersIslamicAccounts && !broker.isIslamic && !broker.accountManagement?.islamicAccount?.available) return false;
    if (criteria.offersCfds !== undefined && criteria.offersCfds) {
      // Most brokers offer CFDs, so just check they have good score
      if (broker.score < 7.5) return false;
    }

    // Trading strategy filters
    if (criteria.supportsScalping && broker.tradingConditionsExtended?.scalpingAllowed !== true) return false;
    if (criteria.supportsHedging && broker.tradingConditionsExtended?.hedgingAllowed !== true) return false;
    if (criteria.supportsHft && !broker.technology?.apiAccess) return false;
    if (criteria.supportsApiTrading && !broker.technology?.apiAccess) return false;
    if (criteria.offersPamm && !broker.accountManagement?.mamPammSupport) return false;

    // Spread and commission filters
    if (criteria.hasRawSpreads) {
      const hasRaw = broker.accountTypes?.some(acc => 
        acc.spreads?.toLowerCase().includes('0.0') || 
        acc.spreads?.toLowerCase().includes('raw')
      );
      if (!hasRaw) return false;
    }

    if (criteria.eurusdSpread?.max) {
      const spread = broker.tradingConditions?.spreads?.eurusd;
      if (typeof spread === 'number' && spread > criteria.eurusdSpread.max) return false;
    }

    // Deposit filters
    if (criteria.minDepositAmount?.max) {
      if (broker.accessibility?.minDeposit > criteria.minDepositAmount.max) return false;
    }
    if (criteria.noDepositRequired && broker.accessibility?.minDeposit > 0) return false;

    // Leverage filters
    if (criteria.maxLeverage?.min) {
      const leverageStr = broker.tradingConditions?.maxLeverage || '';
      const leverageNum = parseLeverage(leverageStr);
      if (leverageNum < criteria.maxLeverage.min) return false;
    }

    // Account type filters
    if (criteria.offersMicroAccounts) {
      const hasMicro = broker.accountTypes?.some(acc => 
        acc.name?.toLowerCase().includes('micro') ||
        acc.minDeposit <= 10
      );
      if (!hasMicro) return false;
    }

    // Regulation filters
    if (criteria.regulationRating?.min) {
      if ((broker.ratings?.regulation || 0) < criteria.regulationRating.min) return false;
    }

    // Crypto filters
    if (criteria.supportsCryptoCfds) {
      if ((broker.tradableInstruments?.cryptocurrencies?.total || 0) === 0) return false;
    }

    if (criteria.offersStockCfds) {
      if ((broker.tradableInstruments?.stocks?.total || 0) === 0) return false;
    }

    // Additional criteria
    if (criteria.fixedSpreads && !broker.accountTypes?.some(acc => acc.spreads?.toLowerCase().includes('fixed'))) return false;
    if (criteria.instantExecution && broker.tradingEnvironment?.executionSpeedMs && broker.tradingEnvironment.executionSpeedMs > 100) return false;
    if (criteria.hasTrailingStops && !broker.tradingEnvironment?.orderTypes?.includes('Trailing Stop')) return false;
    if (criteria.isOffshore && broker.regulation?.regulators?.some(r => ['FCA', 'ASIC', 'NFA'].includes(r))) return false;
    if (criteria.offersCorporateAccounts && !broker.accountManagement?.corporateAccounts) return false;

    // Swap fee category filter
    if (criteria.swapFeeCategory && broker.tradingConditions?.swapFeeCategory !== criteria.swapFeeCategory) return false;

    // Beginner suitability
    if (criteria.suitableForBeginners) {
      if (broker.accessibility?.minDeposit > 100 || broker.score < 8.0) return false;
    }

    return true;
  }).sort((a, b) => (b.score || 0) - (a.score || 0));
}



/**
 * Get minimum number of brokers for a category
 */
export function getMinBrokersForCategory(categoryType: string): number {
  const minimums: { [key: string]: number } = {
    'general': 7,
    'execution': 5,
    'strategy': 5,
    'features': 5
  };
  return minimums[categoryType] || 5;
}
