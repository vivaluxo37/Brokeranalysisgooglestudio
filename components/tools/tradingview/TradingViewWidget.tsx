import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useTranslation } from '../../../hooks/useTranslation';

declare global {
    interface Window {
        TradingView: any;
    }
}

type WidgetType =
    | 'ticker_tape'
    | 'economic_calendar'
    | 'forex_cross_rates'
    | 'technical_analysis'
    | 'advanced_chart';

interface TradingViewWidgetProps {
    widgetType: WidgetType;
    options?: Record<string, any>;
    className?: string;
}

const WIDGET_SCRIPT_URLS: Record<WidgetType, string> = {
    ticker_tape: 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js',
    economic_calendar: 'https://s3.tradingview.com/external-embedding/embed-widget-events.js',
    forex_cross_rates: 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js',
    technical_analysis: 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js',
    advanced_chart: 'https://s3.tradingview.com/tv.js',
};


const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ widgetType, options = {}, className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const { language } = useTranslation();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // Clear any previous widget
        while(container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const finalOptions = {
            ...options,
            colorTheme: theme,
            locale: language,
        };

        if (widgetType === 'advanced_chart') {
             // The advanced chart has a different initialization method
             if (window.TradingView) {
                new window.TradingView.widget({
                    ...finalOptions,
                    container_id: container.id,
                });
            }
        } else {
             const script = document.createElement('script');
             script.src = WIDGET_SCRIPT_URLS[widgetType];
             script.type = 'text/javascript';
             script.async = true;
             script.innerHTML = JSON.stringify(finalOptions);
             container.appendChild(script);
        }
        
    }, [widgetType, options, theme, language]);

    const containerId = `tradingview_widget_${widgetType}_${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div id={containerId} ref={containerRef} className={`tradingview-widget-container ${className}`} style={{ height: '100%', width: '100%' }}>
            {/* For non-script widgets, we add a div that the library looks for */}
            {widgetType !== 'advanced_chart' && <div className={`tradingview-widget-container__widget`}></div>}
        </div>
    );
};

export default memo(TradingViewWidget);