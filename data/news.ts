import { NewsArticle } from '../types';

export const mockNewsData: NewsArticle[] = [
  {
    id: 'news1',
    title: 'US Non-Farm Payrolls Exceed Expectations, Boosting Dollar',
    summary: 'The US economy added 350,000 jobs in August, significantly higher than the forecasted 180,000, causing a surge in the US Dollar and increasing expectations for a hawkish Fed stance.',
    fullContent: 'The latest jobs report from the US Bureau of Labor Statistics has sent shockwaves through the market. The addition of 350,000 jobs in the non-farm payrolls report for August far outstripped economist predictions. This robust labor market data strengthens the case for the Federal Reserve to continue its aggressive monetary tightening policy to combat inflation. As a result, the DXY (US Dollar Index) has climbed over 1.2% in early trading sessions. Traders should anticipate heightened volatility in major pairs like EUR/USD and GBP/USD.',
    date: '2025-09-05T12:30:00Z',
    category: 'Economy',
    importance: 'High',
  },
  {
    id: 'news2',
    title: 'European Central Bank Hints at Pausing Rate Hikes',
    summary: 'ECB President Christine Lagarde suggested that future rate hikes are not a given, citing slowing economic growth in the Eurozone. The Euro fell sharply against major currencies following her speech.',
    fullContent: 'In a dovish turn, ECB President Christine Lagarde indicated that the central bank might pause its cycle of interest rate hikes. "We must be mindful of the lagging effects of our policy on the broader economy," Lagarde stated. This has led to speculation that the ECB is more concerned about a potential recession than persistent inflation. The EUR/USD pair dropped below the key 1.0500 level for the first time in six months. Swing traders holding long Euro positions may face significant swap costs if the interest rate differential widens further.',
    date: '2025-09-04T09:00:00Z',
    category: 'Central Banks',
    importance: 'High',
  },
  {
    id: 'news3',
    title: 'Bank of Japan Maintains Ultra-Loose Policy Amid Yen Weakness',
    summary: 'Despite the Yen hitting a new 20-year low against the Dollar, the Bank of Japan has decided to maintain its negative interest rate policy, fueling further carry trade activity.',
    fullContent: 'The Bank of Japan remains the sole major central bank with a negative interest rate policy. Governor Ueda defended the decision, stating that Japan\'s inflation is not yet demand-driven and sustainable. This policy divergence with other central banks, particularly the Fed, makes the Yen an attractive funding currency for carry trades. However, traders should be wary of potential government intervention to prop up the currency, which could cause sudden, sharp reversals in USD/JPY and other Yen pairs.',
    date: '2025-09-03T15:00:00Z',
    category: 'Central Banks',
    importance: 'Medium',
  },
  {
    id: 'news4',
    title: 'OPEC+ Announces Surprise Production Cut, Oil Prices Surge',
    summary: 'OPEC+ has agreed to cut oil production by an additional 1 million barrels per day, sending WTI and Brent crude prices soaring by over 5% and impacting commodity-linked currencies like CAD and NOK.',
    fullContent: 'The Organization of the Petroleum Exporting Countries and its allies (OPEC+) have announced a surprise production cut, aiming to stabilize and boost oil prices. This decision has immediate implications for global inflation and economic growth. Commodity currencies, such as the Canadian Dollar (CAD) and Norwegian Krone (NOK), have strengthened significantly. Traders focusing on pairs like USD/CAD should look for brokers with low spreads on commodities and exotic pairs.',
    date: '2025-09-02T18:00:00Z',
    category: 'Commodities',
    importance: 'High',
  },
  {
    id: 'news5',
    title: 'UK Inflation Remains Stubbornly High, BoE Under Pressure',
    summary: 'The UK\'s Consumer Price Index (CPI) for August came in at 7.1%, higher than the expected 6.8%, putting immense pressure on the Bank of England to continue its rate-hiking cycle.',
    fullContent: 'Stubbornly high inflation in the United Kingdom continues to be a major concern. The latest CPI data shows that core inflation, which strips out volatile food and energy prices, also remains elevated. This makes another 25 basis point hike from the Bank of England at its next meeting almost a certainty. The British Pound (GBP) saw a volatile session, initially rising on rate hike expectations before falling on recession fears. Trading GBP pairs will likely require brokers that can handle high volatility and offer negative balance protection.',
    date: '2025-08-30T06:00:00Z',
    category: 'Economy',
    importance: 'Medium',
  },
  {
    id: 'news6',
    title: 'Geopolitical Tensions in Asia Pacific Impact AUD and NZD',
    summary: 'Increased geopolitical tensions are causing risk-off sentiment in the markets, leading to weakness in the Australian and New Zealand Dollars, which are often considered risk proxies.',
    fullContent: 'Recent events in the Asia Pacific region have spooked investors, leading to a flight to safety. Safe-haven currencies like the US Dollar and Swiss Franc are gaining, while high-beta, risk-sensitive currencies like the AUD and NZD are underperforming. Market participants are advised to monitor headlines closely, as sudden developments could cause sharp gaps in market pricing. Using a broker with reliable execution and strong regulation is paramount in such an environment.',
    date: '2025-08-28T22:00:00Z',
    category: 'Geopolitics',
    importance: 'Medium',
  }
];
