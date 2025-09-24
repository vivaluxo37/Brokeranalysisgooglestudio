import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { categoryPageGroups } from '../../pages/categoryPageData';
import { useTranslation } from '../../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const mainLinks = [
    { name: t('footer.links.home'), path: '/' },
    { name: t('footer.links.allBrokers'), path: '/brokers' },
    { name: t('footer.links.compareBrokers'), path: '/compare' },
    { name: t('footer.links.costAnalyzer'), path: '/cost-analyzer' },
    { name: t('footer.links.brokerMatcher'), path: '/broker-matcher' },
    { name: t('footer.links.marketNews'), path: '/market-news' },
    { name: t('footer.links.educationHub'), path: '/education' },
    { name: 'Blog', path: '/blog' },
  ];

  const toolLinks = [
      { name: t('footer.links.economicCalendar'), path: '/tools/economic-calendar'},
      { name: t('footer.links.calculators'), path: '/tools/calculators'},
      { name: t('footer.links.marketData'), path: '/tools/market-data'},
  ];

  const aboutLinks = [
      { name: t('footer.links.methodology'), path: '/methodology' },
      { name: t('footer.links.sources'), path: '/sources' },
  ];

  const focusClasses = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm";

  return (
    <footer className="bg-card/50 border-t border-input mt-24 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-foreground/70">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Main Links */}
          <div className="col-span-2">
             <h3 className="text-2xl font-bold text-primary-500 mb-2">Brokeranalysis</h3>
             <p className="text-sm">{t('footer.subtitle')}</p>
          </div>
          
          {/* By Country */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">{t('footer.byCountry')}</h4>
            <ul className="space-y-2 text-sm">
              {categoryPageGroups.country.slice(0, 6).map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className={`hover:text-primary-400 transition-colors ${focusClasses}`}>{link.name}</ReactRouterDOM.Link></li>
              ))}
            </ul>
          </div>
          
          {/* Platforms & Types */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">{t('footer.platformsAndTypes')}</h4>
            <ul className="space-y-2 text-sm">
               {categoryPageGroups.platform.slice(0, 6).map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className={`hover:text-primary-400 transition-colors ${focusClasses}`}>{link.name}</ReactRouterDOM.Link></li>
              ))}
            </ul>
          </div>

           {/* Resources */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm">
               {mainLinks.map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className={`hover:text-primary-400 transition-colors ${focusClasses}`}>{link.name}</ReactRouterDOM.Link></li>
              ))}
            </ul>
          </div>
          
          {/* Tools */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">{t('footer.tools')}</h4>
            <ul className="space-y-2 text-sm">
               {toolLinks.map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className={`hover:text-primary-400 transition-colors ${focusClasses}`}>{link.name}</ReactRouterDOM.Link></li>
              ))}
               {aboutLinks.map(link => (
                <li key={link.name}><ReactRouterDOM.Link to={link.path} className={`hover:text-primary-400 transition-colors ${focusClasses}`}>{link.name}</ReactRouterDOM.Link></li>
              ))}
            </ul>
          </div>

        </div>
        <div className="text-center mt-12 border-t border-input pt-8">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;