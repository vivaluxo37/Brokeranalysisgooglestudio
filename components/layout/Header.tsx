import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icons } from '../../constants';
import ThemeToggle from '../ui/ThemeToggle';
import { Button } from '../ui/button';
import AlertsDropdown from '../common/AlertsDropdown';
import { categoryPageGroups } from '../../pages/categoryPageData';
import { useTranslation } from '../../hooks/useTranslation';
import GlobalSearchBar from '../common/GlobalSearchBar';

const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void, className?: string }> = ({ to, children, onClick, className = '' }) => (
    <RRNavLink
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
    </RRNavLink>
);

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
    const location = useLocation();
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <header className="bg-card/50 backdrop-blur-lg sticky top-0 z-50 border-b border-input transition-colors duration-300">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center">
                        <Link to="/" className="text-lg lg:text-2xl font-bold text-primary-500">
                            Brokeranalysis
                        </Link>
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
                                                    <NavLink to="/brokers/advanced-screening">Advanced Screening</NavLink>
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <h3 className="font-bold text-card-foreground mb-3">{t('header.megaMenu.byRegion')}</h3>
                                                <ul className="space-y-1 text-sm">
                                                    {categoryPageGroups.region.slice(0, 5).map(link => <li key={link.path}><Link to={link.path} className="block p-1 rounded hover:bg-input hover:text-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary-500">{link.name}</Link></li>)}
                                                </ul>
                                            </div>
                                            <div className="col-span-1">
                                                <h3 className="font-bold text-card-foreground mb-3">{t('header.megaMenu.platformsAndTypes')}</h3>
                                                <ul className="space-y-1 text-sm">
                                                    {categoryPageGroups.platform.slice(0, 5).map(link => <li key={link.path}><Link to={link.path} className="block p-1 rounded hover:bg-input hover:text-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary-500">{link.name}</Link></li>)}
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
                                        <div className="p-2 flex flex-col">
                                            <NavLink to="/tools/economic-calendar">{t('header.toolsMenu.economicCalendar')}</NavLink>
                                            <NavLink to="/tools/calculators">{t('header.toolsMenu.calculators')}</NavLink>
                                            <NavLink to="/tools/market-data">{t('header.toolsMenu.marketData')}</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* Education Dropdown */}
                                <div className="group relative">
                                    <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 group-hover:bg-input group-hover:text-foreground transition-colors flex items-center">
                                        {t('header.education')} <Icons.chevronDown className="h-4 w-4 ltr:ml-1 rtl:mr-1" />
                                    </button>
                                    <div className="absolute ltr:left-0 rtl:right-0 mt-2 w-56 bg-card rounded-lg shadow-2xl border border-input opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="p-2 flex flex-col">
                                            <NavLink to="/education">{t('footer.links.educationHub')}</NavLink>
                                            <NavLink to="/education/ai-tutor">AI Tutor</NavLink>
                                            <NavLink to="/education/quizzes">{t('education.quizzes.title')}</NavLink>
                                            <NavLink to="/education/webinars">{t('education.webinars.title')}</NavLink>
                                            <NavLink to="/education/simulators">{t('education.simulators.title')}</NavLink>
                                        </div>
                                    </div>
                                </div>

                                <NavLink to="/market-news">{t('header.marketNews')}</NavLink>
                                <NavLink to="/blog">Blog</NavLink>
                                <NavLink to="/methodology">{t('header.methodology')}</NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <GlobalSearchBar />
                        <AlertsDropdown />
                        <ThemeToggle />
                        {user ? (
                            <div className="ltr:ml-3 rtl:mr-3 relative group">
                                <Button variant="ghost" size="sm" className="p-2">
                                    <Icons.user className="h-5 w-5 ltr:mr-2 rtl:ml-2"/> {user.name}
                                </Button>
                                <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-input opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="py-1">
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-card-foreground hover:bg-input">{t('header.dashboard')}</Link>
                                        <Link to="/trading-journal" className="block px-4 py-2 text-sm text-card-foreground hover:bg-input">Trading Journal</Link>
                                        <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-card-foreground hover:bg-input">{t('header.logout')}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="ltr:ml-3 rtl:mr-3 flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">{t('header.login')}</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">{t('header.register')}</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="ltr:-mr-2 rtl:-ml-2 flex lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-input focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <Icons.close className="block h-6 w-6" /> : <Icons.menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                <div className="bg-card border-b border-input shadow-lg">
                     <div className="px-4 py-3 border-b border-input/50">
                        <GlobalSearchBar />
                    </div>
                    {user ? (
                        <div className="pt-4 pb-3 border-t border-input">
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <span className="flex items-center justify-center h-10 w-10 rounded-full bg-input text-foreground"><Icons.user className="h-6 w-6"/></span>
                                </div>
                                <div className="ltr:ml-3 rtl:mr-3">
                                    <div className="text-base font-medium leading-none text-card-foreground">{user.name}</div>
                                    <div className="text-sm font-medium leading-none text-foreground/70">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                <NavLink to="/dashboard" onClick={closeMobileMenu} className="block">{t('header.dashboard')}</NavLink>
                                <NavLink to="/trading-journal" onClick={closeMobileMenu} className="block">Trading Journal</NavLink>
                                <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:bg-input hover:text-foreground">{t('header.logout')}</button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <NavLink to="/login" onClick={closeMobileMenu} className="block">{t('header.login')}</NavLink>
                            <NavLink to="/register" onClick={closeMobileMenu} className="block">{t('header.register')}</NavLink>
                        </div>
                    )}
                    <div className="border-t border-input/50">
                        <MobileAccordionLink title={t('header.brokers')}>
                           <NavLink to="/brokers" onClick={closeMobileMenu} className="block">{t('header.megaMenu.allBrokers')}</NavLink>
                           <NavLink to="/compare" onClick={closeMobileMenu} className="block">{t('header.megaMenu.compareBrokers')}</NavLink>
                           <NavLink to="/cost-analyzer" onClick={closeMobileMenu} className="block">{t('header.megaMenu.costAnalyzer')}</NavLink>
                           <NavLink to="/broker-matcher" onClick={closeMobileMenu} className="block">{t('header.megaMenu.aiBrokerMatcher')}</NavLink>
                           <NavLink to="/brokers/advanced-screening" onClick={closeMobileMenu} className="block">Advanced Screening</NavLink>
                        </MobileAccordionLink>
                        <MobileAccordionLink title={t('header.tools')}>
                           <NavLink to="/tools/economic-calendar" onClick={closeMobileMenu} className="block">{t('header.toolsMenu.economicCalendar')}</NavLink>
                           <NavLink to="/tools/calculators" onClick={closeMobileMenu} className="block">{t('header.toolsMenu.calculators')}</NavLink>
                           <NavLink to="/tools/market-data" onClick={closeMobileMenu} className="block">{t('header.toolsMenu.marketData')}</NavLink>
                        </MobileAccordionLink>
                        <MobileAccordionLink title={t('header.education')}>
                           <NavLink to="/education" onClick={closeMobileMenu} className="block">{t('footer.links.educationHub')}</NavLink>
                           <NavLink to="/education/ai-tutor" onClick={closeMobileMenu} className="block">AI Tutor</NavLink>
                           <NavLink to="/education/quizzes" onClick={closeMobileMenu} className="block">{t('education.quizzes.title')}</NavLink>
                           <NavLink to="/education/webinars" onClick={closeMobileMenu} className="block">{t('education.webinars.title')}</NavLink>
                           <NavLink to="/education/simulators" onClick={closeMobileMenu} className="block">{t('education.simulators.title')}</NavLink>
                        </MobileAccordionLink>
                        <NavLink to="/market-news" onClick={closeMobileMenu} className="block m-3">{t('header.marketNews')}</NavLink>
                        <NavLink to="/blog" onClick={closeMobileMenu} className="block m-3">Blog</NavLink>
                        <NavLink to="/methodology" onClick={closeMobileMenu} className="block m-3">{t('header.methodology')}</NavLink>
                    </div>
                     <div className="px-5 py-4 border-t border-input/50 flex items-center justify-between">
                         <span className="text-sm font-medium text-card-foreground/70">Settings</span>
                         <div className="flex items-center gap-2">
                            <ThemeToggle />
                         </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;