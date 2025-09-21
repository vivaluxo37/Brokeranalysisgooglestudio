import React from 'react';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import TradingViewWidget from '../components/tools/tradingview/TradingViewWidget';
import { useTranslation } from '../hooks/useTranslation';

const EconomicCalendarPage: React.FC = () => {
  const { t } = useTranslation();

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": t('tools.calendar.title'),
    "url": "https://brokeranalysis.com/#/tools/economic-calendar",
    "description": t('tools.calendar.subtitle'),
  };

  return (
    <div>
      <MetaTags
        title={`${t('tools.calendar.title')} | Brokeranalysis`}
        description={t('tools.calendar.subtitle')}
        canonicalUrl="https://brokeranalysis.com/#/tools/economic-calendar"
      />
      <JsonLdSchema data={pageJsonLd} />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">{t('tools.calendar.title')}</h1>
        <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">{t('tools.calendar.subtitle')}</p>
      </div>

      <div className="h-[800px] rounded-xl overflow-hidden border border-input">
          <TradingViewWidget
              widgetType="economic_calendar"
              options={{
                  "autosize": true,
                  "height": "100%",
                  "width": "100%",
                  "locale": "en",
                  "importance_filter": "-1,0,1"
              }}
          />
      </div>
    </div>
  );
};

export default EconomicCalendarPage;