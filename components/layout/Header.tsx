import React, { useState, useEffect, useRef } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icons } from '../../constants';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import AlertsDropdown from '../common/AlertsDropdown';
import { categoryPageGroups } from '../../pages/categoryPageData';
import { useTranslation } from '../../hooks/useTranslation';
import { translations } from '../../data/locales';

const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void, className?: string }> = ({ to, children, onClick, className = '' }) => (
    <ReactRouterDOM.NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary-500 ${
            isActive
                ? 'bg-primary-500 text-white'
                : 'text-foreground/70 hover:bg-input hover:text-foreground'
            } ${className}`
        }
    >
        {children}
    </ReactRouterDOM.NavLink>
);

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const availableLanguages: { [key: string]: string } = {
        en: 'English',
        de: 'Deutsch',
        ja: '日本語',
        es: 'Español',
        fr: 'Français',
        it: 'Italiano',
        pt: 'Português',
        nl: 'Nederlands',
        ru: 'Русский',
        ar: 'العربية',
        zh: '中文 (简体)',
        hi: 'हिन्दी',
        ko: '한국어',
        tr: 'Türkçe',
        id: 'Bahasa Indonesia'
    };

    const supportedLanguageCodes = Object.keys(translations);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-foreground/70 hover:bg-input hover:text-foreground flex items-center gap-1">
                <Icons.globe className="h-5 w-5" />
                <span className="text-sm uppercase">{language}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card rounded-md shadow-lg border border-input z-50 animate-fade-in max-h-60 overflow-y-auto">
                    <ul>
                        {supportedLanguageCodes.map(code => (
                            <li key={code}>
                                <button
                                    onClick={() => { setLanguage(code); setIsOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm ${language === code ? 'bg-primary-600 text-white' : 'hover:bg-input'}`}
                                >
                                    {availableLanguages[code] || code}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// New component for collapsible sections in the mobile menu
const MobileAccordionLink: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-input/50 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-3 py-3 text-left font-semibold text-card-foreground"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <Icons.chevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pt-2 pb-3 ltr:pl-4 rtl:pr-4 space-y-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};


const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Close mobile menu on route change
    const location = ReactRouterDOM.useLocation();
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <header className="bg-card/50 backdrop-blur-lg sticky top-0 z-50 border-b border-input transition-colors duration-300">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center">
                        <ReactRouterDOM.Link to="/" className="text-lg lg:text-2xl font-bold text-primary-500">
                            Brokeranalysis
                        </ReactRouterDOM.Link>
                        <div className="hidden lg:block ltr:ml-10 rtl:mr-10">
                            <div className="flex items-baseline space-x-1">
                                
                                {/* Brokers Mega Menu */}
                                <div className="group relative">
                                    <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 group-hover:bg-input group-hover:text-foreground transition-colors flex items-center">
                                        {t('header.brokers')} <Icons.chevronDown className="h-4 w-4 ltr:ml-1 rtl:mr-1" />
                                    </button>
                                    <div className="absolute ltr:left-0 rtl:right-0 mt-2 w-max max-w-2xl bg-card rounded-lg shadow-2xl border border-input opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="p-6 grid grid-cols-3 gap-x-8">
                                            <div className="col-span-1 ltr:border-r rtl:border-l border-input ltr:pr-6 rtl:pl-6">
                                                <h3 className="font-bold text-card-foreground mb-3">{t('header.megaMenu.coreTools')}</h3>
                                                <div className="flex flex-col space-y-2">
                                                    <NavLink to="/brokers">{t('header.megaMenu.allBrokers')}</NavLink>
                                                    <NavLink to="/compare">{t('header.megaMenu.compareBrokers')}</NavLink>
                                                    <NavLink to="/cost-analyzer">{t('header.megaMenu.costAnalyzer')}</NavLink>
                                                    <NavLink to="/broker-matcher">{t('header.megaMenu.aiBrokerMatcher')}</NavLink>
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <h3 className="font-bold text-card-foreground mb-3">{t('header.megaMenu.byCountry')}</h3>
                                                <ul className="space-y-1 text-sm">
                                                    {categoryPageGroups.country.slice(0, 5).map(link => <li key={link.path}><ReactRouterDOM.Link to={link.path} className="block p-1 rounded hover:bg-input hover:text-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary-500">{link.name}</ReactRouterDOM.Link></li>)}
                                                </ul>
                                            </div>
                                            <div className="col-span-1">
                                                <h3 className="font-bold text-card-foreground mb-3">{t('header.megaMenu.platformsAndTypes')}</h3>
                                                <ul className="space-y-1 text-sm">
                                                    {categoryPageGroups.platform.slice(0, 5).map(link => <li key={link.path}><ReactRouterDOM.Link to={link.path} className="block p-1 rounded hover:bg-input hover:text-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary-500">{link.name}</ReactRouterDOM.Link></li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Tools Dropdown */}
                                <div className="group relative">
                                    <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 group-hover:bg-input group-hover:text-foreground transition-colors flex items-center">
                                        {t('header.tools')} <Icons.chevronDown className="h-4 w-4 ltr:ml-1 rtl:mr-1" />
                                    </button>
                                    <div className="absolute ltr:left-0 rtl:right-0 mt-2 w-56 bg-card rounded-lg shadow-2xl border border-input opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="p-2 space-y-1">
                                            <NavLink to="/tools/economic-calendar" className="block w-full text-left">{t('header.toolsMenu.economicCalendar')}</NavLink>
                                            <NavLink to="/tools/calculators" className="block w-full text-left">{t('header.toolsMenu.calculators')}</NavLink>
                                            <NavLink to="/tools/market-data" className="block w-full text-left">{t('header.toolsMenu.marketData')}</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* Education Dropdown */}
                                <div className="group relative">
                                    <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 group-hover:bg-input group-hover:text-foreground transition-colors flex items-center">
                                        {t('header.education')} <Icons.chevronDown className="h-4 w-4 ltr:ml-1 rtl:mr-1" />
                                    </button>
                                    <div className="absolute ltr:left-0 rtl:right-0 mt-2 w-56 bg-card rounded-lg shadow-2xl border border-input opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="p-2 space-y-1">
                                            <NavLink to="/education" className="block w-full text-left">{t('education.hub.title')}</NavLink>
                                            <NavLink to="/education/quizzes" className="block w-full text-left">{t('education.quizzes.title')}</NavLink>
                                            <NavLink to="/education/webinars" className="block w-full text-left">{t('education.webinars.title')}</NavLink>
                                            <NavLink to="/education/simulators" className="block w-full text-left">{t('education.simulators.title')}</NavLink>
                                        </div>
                                    </div>
                                </div>
                                <NavLink to="/market-news">{t('header.marketNews')}</NavLink>
                                <NavLink to="/methodology">{t('header.methodology')}</NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {user && <AlertsDropdown />}
                        <ThemeToggle />
                        <LanguageSelector />
                        {user ? (
                            <>
                                <ReactRouterDOM.Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground">{user.name}</ReactRouterDOM.Link>
                                <Button onClick={logout} variant="secondary" size="sm">{t('header.logout')}</Button>
                            </>
                        ) : (
                            <>
                                <ReactRouterDOM.Link to="/login"><Button variant="ghost" size="sm">{t('header.login')}</Button></ReactRouterDOM.Link>
                                <ReactRouterDOM.Link to="/register"><Button variant="primary" size="sm">{t('header.register')}</Button></ReactRouterDOM.Link>
                            </>
                        )}
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <ThemeToggle />
                        <LanguageSelector />
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen} className="p-2 rounded-md text-foreground/70 hover:bg-input hover:text-foreground">
                            <span className="sr-only">Open main menu</span>
                            <Icons.menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Panel */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[85vh]' : 'max-h-0'}`} id="mobile-menu">
                <div className="border-t border-input overflow-y-auto max-h-[85vh] bg-card">
                    <MobileAccordionLink title={t('header.brokers')}>
                        <NavLink to="/brokers" onClick={closeMobileMenu} className="block">{t('header.megaMenu.allBrokers')}</NavLink>
                        <NavLink to="/compare" onClick={closeMobileMenu} className="block">{t('header.megaMenu.compareBrokers')}</NavLink>
                        <NavLink to="/cost-analyzer" onClick={closeMobileMenu} className="block">{t('header.megaMenu.costAnalyzer')}</NavLink>
                        <NavLink to="/broker-matcher" onClick={closeMobileMenu} className="block">{t('header.megaMenu.aiBrokerMatcher')}</NavLink>
                    </MobileAccordionLink>
                    <MobileAccordionLink title={t('header.tools')}>
                        <NavLink to="/tools/economic-calendar" onClick={closeMobileMenu} className="block">{t('header.toolsMenu.economicCalendar')}</NavLink>
                        <NavLink to="/tools/calculators" onClick={closeMobileMenu} className="block">{t('header.toolsMenu.calculators')}</NavLink>
                        <NavLink to="/tools/market-data" onClick={closeMobileMenu} className="block">{t('header.toolsMenu.marketData')}</NavLink>
                    </MobileAccordionLink>
                    <MobileAccordionLink title={t('header.education')}>
                        <NavLink to="/education" onClick={closeMobileMenu} className="block">{t('education.hub.title')}</NavLink>
                        <NavLink to="/education/quizzes" onClick={closeMobileMenu} className="block">{t('education.quizzes.title')}</NavLink>
                        <NavLink to="/education/webinars" onClick={closeMobileMenu} className="block">{t('education.webinars.title')}</NavLink>
                        <NavLink to="/education/simulators" onClick={closeMobileMenu} className="block">{t('education.simulators.title')}</NavLink>
                    </MobileAccordionLink>

                    {/* Standalone links */}
                    <div className="border-b border-input/50">
                        <NavLink to="/market-news" onClick={closeMobileMenu} className="block w-full px-3 py-3 font-semibold text-card-foreground">{t('header.marketNews')}</NavLink>
                    </div>
                    <div className="border-b border-input/50">
                        <NavLink to="/methodology" onClick={closeMobileMenu} className="block w-full px-3 py-3 font-semibold text-card-foreground">{t('header.methodology')}</NavLink>
                    </div>

                    {/* Auth links */}
                    <div className="p-4">
                        {user ? (
                            <div className="space-y-2">
                                <NavLink to="/dashboard" onClick={closeMobileMenu} className="block w-full text-center">{t('header.dashboard')}</NavLink>
                                <Button
                                    onClick={() => { logout(); closeMobileMenu(); }}
                                    variant="secondary"
                                    size="sm"
                                    className="w-full"
                                >
                                    {t('header.logout')}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <ReactRouterDOM.Link to="/login" className="flex-1" onClick={closeMobileMenu}>
                                    <Button variant="ghost" size="sm" className="w-full">{t('header.login')}</Button>
                                </ReactRouterDOM.Link>
                                <ReactRouterDOM.Link to="/register" className="flex-1" onClick={closeMobileMenu}>
                                    <Button variant="primary" size="sm" className="w-full">{t('header.register')}</Button>
                                </ReactRouterDOM.Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
