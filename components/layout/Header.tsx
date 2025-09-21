import React, { useState, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icons } from '../../constants';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import AlertsDropdown from '../common/AlertsDropdown';
import { categoryPageGroups } from '../../pages/categoryPageData';

const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => (
    <ReactRouterDOM.NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-primary-500 text-white'
                : 'text-foreground/70 hover:bg-input hover:text-foreground'
            }`
        }
    >
        {children}
    </ReactRouterDOM.NavLink>
);

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                        <ReactRouterDOM.Link to="/" className="text-2xl font-bold text-primary-500">
                            Brokeranalysis
                        </ReactRouterDOM.Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-1">
                                <NavLink to="/">Home</NavLink>
                                
                                {/* Brokers Mega Menu */}
                                <div className="group relative">
                                    <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 group-hover:bg-input group-hover:text-foreground transition-colors flex items-center">
                                        Brokers <Icons.chevronDown className="h-4 w-4 ml-1" />
                                    </button>
                                    <div className="absolute left-0 mt-2 w-max max-w-2xl bg-card rounded-lg shadow-2xl border border-input opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="p-6 grid grid-cols-3 gap-x-8">
                                            <div className="col-span-1 border-r border-input pr-6">
                                                <h3 className="font-bold text-card-foreground mb-3">Core Tools</h3>
                                                <div className="flex flex-col space-y-2">
                                                    <NavLink to="/brokers">All Brokers</NavLink>
                                                    <NavLink to="/compare">Compare Brokers</NavLink>
                                                    <NavLink to="/cost-analyzer">Cost Analyzer</NavLink>
                                                    <NavLink to="/broker-matcher">AI Broker Matcher</NavLink>
                                                    <NavLink to="/advanced-screening">Advanced Screening</NavLink>
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <h3 className="font-bold text-card-foreground mb-3">By Country</h3>
                                                <ul className="space-y-1 text-sm">
                                                    {categoryPageGroups.country.slice(0, 5).map(link => <li key={link.path}><ReactRouterDOM.Link to={link.path} className="block p-1 rounded hover:bg-input hover:text-primary-400">{link.name}</ReactRouterDOM.Link></li>)}
                                                </ul>
                                            </div>
                                            <div className="col-span-1">
                                                <h3 className="font-bold text-card-foreground mb-3">Platforms & Types</h3>
                                                <ul className="space-y-1 text-sm">
                                                    {categoryPageGroups.platform.slice(0, 5).map(link => <li key={link.path}><ReactRouterDOM.Link to={link.path} className="block p-1 rounded hover:bg-input hover:text-primary-400">{link.name}</ReactRouterDOM.Link></li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <NavLink to="/market-news">Market News</NavLink>
                                <NavLink to="/methodology">Methodology</NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user && <AlertsDropdown />}
                        <ThemeToggle />
                        {user ? (
                            <>
                                <ReactRouterDOM.Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground">{user.name}</ReactRouterDOM.Link>
                                <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
                            </>
                        ) : (
                            <>
                                <ReactRouterDOM.Link to="/login"><Button variant="ghost" size="sm">Login</Button></ReactRouterDOM.Link>
                                <ReactRouterDOM.Link to="/register"><Button variant="primary" size="sm">Register</Button></ReactRouterDOM.Link>
                            </>
                        )}
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <ThemeToggle />
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen} className="p-2 rounded-md text-foreground/70 hover:bg-input hover:text-foreground">
                            <span className="sr-only">Open main menu</span>
                            <Icons.menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-input">
                        <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
                        <NavLink to="/brokers" onClick={closeMobileMenu}>All Brokers</NavLink>
                        <NavLink to="/compare" onClick={closeMobileMenu}>Compare</NavLink>
                        <NavLink to="/cost-analyzer" onClick={closeMobileMenu}>Cost Analyzer</NavLink>
                        <NavLink to="/broker-matcher" onClick={closeMobileMenu}>AI Matcher</NavLink>
                        <NavLink to="/advanced-screening" onClick={closeMobileMenu}>Advanced Screening</NavLink>
                        <NavLink to="/market-news" onClick={closeMobileMenu}>Market News</NavLink>
                        <NavLink to="/methodology" onClick={closeMobileMenu}>Methodology</NavLink>

                        <div className="pt-4 mt-4 border-t border-input">
                            {user ? (
                                <>
                                    <NavLink to="/dashboard" onClick={closeMobileMenu}>My Dashboard</NavLink>
                                    <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:bg-input hover:text-foreground">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <ReactRouterDOM.Link to="/login" className="flex-1"><Button variant="ghost" size="sm" className="w-full">Login</Button></ReactRouterDOM.Link>
                                    <ReactRouterDOM.Link to="/register" className="flex-1"><Button variant="primary" size="sm" className="w-full">Register</Button></ReactRouterDOM.Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;