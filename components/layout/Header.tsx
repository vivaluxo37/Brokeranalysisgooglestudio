import React from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAV_LINKS } from '../../constants';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import AlertsDropdown from '../common/AlertsDropdown';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-card/50 backdrop-blur-lg sticky top-0 z-50 border-b border-input transition-colors duration-300">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ReactRouterDOM.Link to="/" className="text-2xl font-bold text-primary-500">
              Brokeranalysis
            </ReactRouterDOM.Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {NAV_LINKS.map((link) => (
                  <ReactRouterDOM.NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-foreground/70 hover:bg-input hover:text-foreground'
                      }`
                    }
                  >
                    {link.name}
                  </ReactRouterDOM.NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user && <AlertsDropdown />}
            <ThemeToggle />
            {user ? (
              <>
                <ReactRouterDOM.Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground">{user.name}</ReactRouterDOM.Link>
                <Button onClick={logout} variant="secondary" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <ReactRouterDOM.Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </ReactRouterDOM.Link>
                <ReactRouterDOM.Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </ReactRouterDOM.Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
