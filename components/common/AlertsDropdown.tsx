import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { useAlerts } from '../../hooks/useAlerts';
import { brokers } from '../../data/brokers';
import { Icons } from '../../constants';
import Button from '../ui/Button';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';

const SeverityIndicator: React.FC<{ severity: 'High' | 'Medium' | 'Low' }> = ({ severity }) => {
    const severityClasses = {
        High: 'bg-red-500',
        Medium: 'bg-yellow-500',
        Low: 'bg-green-500',
    };
    return <span className={`flex-shrink-0 block h-2.5 w-2.5 rounded-full ${severityClasses[severity]}`} />;
};

const AlertsDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const { favoritesList } = useFavorites();
    const { getAlertsForFavorites, unreadCount, markAllAsRead } = useAlerts();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;
    
    const unreadAlerts = getAlertsForFavorites(favoritesList).filter(a => !a.read).slice(0, 5); // Show latest 5 unread

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-foreground/70 hover:bg-input hover:text-foreground transition-colors"
                aria-label="View notifications"
            >
                <Icons.bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-2xl border border-input z-50 animate-fade-in">
                    <div className="p-3 border-b border-input flex justify-between items-center">
                        <h4 className="font-semibold text-card-foreground">Notifications</h4>
                        {unreadAlerts.length > 0 && 
                            <button onClick={markAllAsRead} className="text-xs text-primary-400 hover:underline">Mark all as read</button>
                        }
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {unreadAlerts.length > 0 ? (
                            unreadAlerts.map(alert => {
                                const broker = brokers.find(b => b.id === alert.brokerId);
                                return (
                                    <ReactRouterDOM.Link key={alert.id} to="/dashboard" onClick={() => setIsOpen(false)} className="block p-3 hover:bg-input/50 border-b border-input last:border-b-0">
                                        <div className="flex items-start gap-3">
                                            <SeverityIndicator severity={alert.severity} />
                                            <div>
                                                <p className="text-sm font-semibold text-card-foreground leading-tight">
                                                   {broker?.name}: {alert.title}
                                                </p>
                                                <p className="text-xs text-card-foreground/70 mt-1">
                                                    {new Date(alert.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </ReactRouterDOM.Link>
                                );
                            })
                        ) : (
                            <p className="p-6 text-center text-sm text-card-foreground/70">You're all caught up!</p>
                        )}
                    </div>
                    <div className="p-2 bg-input/30 rounded-b-lg">
                        <ReactRouterDOM.Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" size="sm" className="w-full">
                                View all alerts
                            </Button>
                        </ReactRouterDOM.Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertsDropdown;
