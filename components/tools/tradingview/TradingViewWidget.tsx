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
        if (!container || typeof document === 'undefined') return;

        // Clear any previous widget safely
        try {
            container.innerHTML = '';
        } catch (e) {
            console.warn('Could not clear container:', e);
            return;
        }

        const finalOptions = {
            ...options,
            colorTheme: theme,
            locale: language,
        };

        if (widgetType === 'advanced_chart') {
             // The advanced chart has a different initialization method
             if (window.TradingView && container.id) {
                try {
                    new window.TradingView.widget({
                        ...finalOptions,
                        container_id: container.id,
                    });
                } catch (error) {
                    console.error('Error initializing TradingView widget:', error);
                    container.innerHTML = '<div class="p-3 text-center text-sm text-muted-foreground">Chart temporarily unavailable</div>';
                }
            }
        } else {
             // For ticker tape and other widgets, use a simpler approach
             const widgetDiv = document.createElement('div');
             widgetDiv.className = 'tradingview-widget-container';
             widgetDiv.innerHTML = `
                 <div class="tradingview-widget-container__widget"></div>
                 <div class="tradingview-widget-copyright">
                     <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                         <span class="blue-text">Track all markets on TradingView</span>
                     </a>
                 </div>
             `;
             container.appendChild(widgetDiv);

             const script = document.createElement('script');
             script.type = 'text/javascript';
             script.async = false;
             script.src = WIDGET_SCRIPT_URLS[widgetType];

             // Create configuration object
             const config = {
                 symbols: finalOptions.symbols || [],
                 showSymbolLogo: finalOptions.showSymbolLogo !== false,
                 isTransparent: finalOptions.isTransparent !== false,
                 displayMode: finalOptions.displayMode || 'adaptive',
                 colorTheme: finalOptions.colorTheme || theme,
                 locale: finalOptions.locale || language
             };

             // Set the configuration as innerHTML (TradingView's expected format)
             script.innerHTML = JSON.stringify(config, null, 2);

             script.onload = () => {
                 try {
                     console.log(`${widgetType} widget loaded`);
                 } catch (e) {
                     // Silent catch for iframe communication issues
                 }
             };

             script.onerror = (error) => {
                 console.warn(`TradingView ${widgetType} widget failed to load:`, error);
                 // Provide fallback content
                 if (widgetDiv && widgetDiv.parentNode) {
                     widgetDiv.innerHTML = `
                         <div class="p-3 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border">
                             <div class="mb-2">📊 Market Data</div>
                             <div class="text-xs">Live market ticker temporarily unavailable</div>
                         </div>
                     `;
                 }
             };

             // Add script with timeout protection
             try {
                 widgetDiv.appendChild(script);
                 
                 // Fallback timeout in case widget doesn't load
                 setTimeout(() => {
                     if (widgetDiv && !widgetDiv.querySelector('.tradingview-widget-container__widget iframe')) {
                         console.warn(`${widgetType} widget timeout - showing fallback`);
                         const fallback = widgetDiv.querySelector('.tradingview-widget-container__widget');
                         if (fallback) {
                             fallback.innerHTML = `
                                 <div class="p-3 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border">
                                     <div class="mb-2">📊 Market Data</div>
                                     <div class="text-xs">Loading market ticker...</div>
                                 </div>
                             `;
                         }
                     }
                 }, 10000); // 10 second timeout
             } catch (error) {
                 console.error('Error appending TradingView script:', error);
             }
        }
        
    }, [widgetType, options, theme, language]);

    const containerId = `tradingview_widget_${widgetType}_${Math.random().toString(36).substr(2, 9)}`;

    // Clean up function to remove scripts when component unmounts
    useEffect(() => {
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div id={containerId} ref={containerRef} className={`tradingview-widget-container ${className}`} style={{ height: '100%', width: '100%' }}>
        </div>
    );
};

export default memo(TradingViewWidget);