// Authorized list of 78 forex brokers
// Only these brokers should appear in categories and search results

export const AUTHORIZED_BROKER_IDS = [
  'pepperstone',
  'ic-markets',
  'xtb',
  'forex-com',
  'ig',
  'saxo-bank',
  'interactive-brokers',
  'etoro',
  'plus500',
  'avatrade',
  'oanda',
  'fxpro',
  'axi',
  'fp-markets',
  'cmc-markets',
  'admirals',
  'tickmill',
  'swissquote',
  'dukascopy',
  'thinkmarkets',
  'fxcm',
  'xm',
  'exness',
  'hf-markets',
  'fbs',
  'octafx',
  'roboforex',
  'hycm',
  'city-index',
  'activtrades',
  'atfx',
  'lcg',
  'markets-com',
  'ironfx',
  'gmo-click',
  'gkfx',
  'bitget',
  'tradeview',
  'nordfx',
  'fxopen',
  'royal',
  'captrader',
  'mexem',
  'trading212',
  'vt-markets',
  'tmgm',
  'trade-nation',
  'fx-trading',
  'multibank',
  'tradestation-global',
  'spreadex',
  'fusion-markets',
  'eightcap',
  'hantec-markets',
  'global-prime',
  'go-markets',
  'moneta-markets',
  'blackbull',
  'startrader',
  'libertex',
  'capital-com',
  'blackbull-markets',
  'ictrading',
  'easymarkets',
  'freedom24',
  'fxoro',
  'startrader-global',
  'puprime',
  'gbe-brokers',
  'thunder-markets',
  'superforex',
  'instaforex',
  'lifefinance',
  'fxgt',
  'traderstrust',
  'freshforex',
  'windsor-broker',
  'tastyfx'
];

export const AUTHORIZED_BROKER_COUNT = AUTHORIZED_BROKER_IDS.length;

/**
 * Check if a broker ID is in the authorized list
 */
export function isAuthorizedBroker(brokerId: string): boolean {
  return AUTHORIZED_BROKER_IDS.includes(brokerId);
}

/**
 * Filter brokers to only include authorized ones
 */
export function filterAuthorizedBrokers<T extends { id: string }>(brokers: T[]): T[] {
  return brokers.filter(broker => isAuthorizedBroker(broker.id));
}