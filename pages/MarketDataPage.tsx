import React from 'react';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import TradingViewWidget from '../components/tools/tradingview/TradingViewWidget';
import { useTranslation } from '../hooks/useTranslation';

const MarketDataPage: React.FC = () => {
    const { t } = useTranslation();

    const pageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": t('tools.marketData.title'),
        "url": "https://brokeranalysis.com/#/tools/market-data",
        "description": t('tools.marketData.subtitle'),
    };

    return (
        <div>
            <MetaTags
                title={`${t('tools.marketData.title')} | Brokeranalysis`}
                description={t('tools.marketData.subtitle')}
                canonicalUrl="https://brokeranalysis.com/#/tools/market-data"
            />
            <JsonLdSchema data={pageJsonLd} />

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">{t('tools.marketData.title')}</h1>
                <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">{t('tools.marketData.subtitle')}</p>
            </div>

            <div className="space-y-12">
                <div className="h-[450px] md:h-[600px] rounded-xl overflow-hidden border border-input">
                     <TradingViewWidget
                        widgetType="forex_cross_rates"
                        options={{
                            "width": "100%",
                            "height": "100%",
                            "currencies": [
                                "EUR",
                                "USD",
                                "JPY",
                                "GBP",
                                "CHF",
                                "AUD",
                                "CAD",
                                "NZD",
                                "CNY"
                            ],
                            "locale": "en"
                        }}
                    />
                </div>
                <div className="h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-input">
                    <TradingViewWidget
                        widgetType="technical_analysis"
                        options={{
                             "interval": "1D",
                             "width": "100%",
                             "height": "100%",
                             "symbol": "FX:EURUSD",
                             "showIntervalTabs": true,
                             "locale": "en"
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MarketDataPage;
