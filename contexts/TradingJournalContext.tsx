import React, { createContext, useState, useEffect } from 'react';
import { TradingJournalEntry, TradingJournalContextType } from '../types';
import { useAuth } from '../hooks/useAuth';

const mockJournalEntries: TradingJournalEntry[] = [
    {
        id: 'tj1',
        userId: '1', // Corresponds to test@test.com user
        date: '2025-09-20T10:00:00Z',
        instrument: 'EUR/USD',
        direction: 'Buy',
        entryPrice: 1.0850,
        exitPrice: 1.0875,
        lotSize: 0.5,
        strategyUsed: 'Trendline Bounce',
        notes: 'Good entry on the 1H chart bounce. Followed my plan.',
        profitOrLoss: 125,
    },
    {
        id: 'tj2',
        userId: '1',
        date: '2025-09-21T14:30:00Z',
        instrument: 'GBP/USD',
        direction: 'Sell',
        entryPrice: 1.2510,
        exitPrice: 1.2540,
        lotSize: 1.0,
        strategyUsed: 'Breakout Fade',
        notes: 'Exited too early, could have held for more profit. FOMO.',
        profitOrLoss: -300,
    }
];


export const TradingJournalContext = createContext<TradingJournalContextType | null>(null);

export const TradingJournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [journalEntries, setJournalEntries] = useState<TradingJournalEntry[]>([]);
    
    useEffect(() => {
        if (user) {
            try {
                const savedEntries = localStorage.getItem(`tradingJournal_${user.id}`);
                setJournalEntries(savedEntries ? JSON.parse(savedEntries) : mockJournalEntries);
            } catch (e) {
                console.error("Failed to parse journal entries from localStorage", e);
                setJournalEntries(mockJournalEntries);
            }
        } else {
            setJournalEntries([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`tradingJournal_${user.id}`, JSON.stringify(journalEntries));
        }
    }, [journalEntries, user]);

    const getEntriesByUserId = (userId: string): TradingJournalEntry[] => {
        if (user?.id !== userId) return [];
        return journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const addEntry = async (entryData: Omit<TradingJournalEntry, 'id' | 'userId' | 'date' | 'profitOrLoss'>): Promise<void> => {
        if (!user) throw new Error("User not logged in");
        
        const pips = (entryData.direction === 'Buy' 
            ? (entryData.exitPrice - entryData.entryPrice) 
            : (entryData.entryPrice - entryData.exitPrice));

        const pipValuePerLot = entryData.instrument.toUpperCase().includes('JPY') ? 1000 : 100000;
        const pnl = pips * pipValuePerLot * entryData.lotSize;


        const newEntry: TradingJournalEntry = {
            ...entryData,
            id: `tj_${Date.now()}`,
            userId: user.id,
            date: new Date().toISOString(),
            profitOrLoss: parseFloat(pnl.toFixed(2)),
        };
        setJournalEntries(prev => [newEntry, ...prev]);
    };

    const updateEntry = async (entryId: string, updates: Partial<Omit<TradingJournalEntry, 'id' | 'userId'>>): Promise<void> => {
        // This functionality can be expanded in a future update
        console.log("Updating entry:", entryId, updates);
    };

    const deleteEntry = async (entryId: string): Promise<void> => {
        if (!user) return;
        setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
    };

    const getJournalStats = (userId: string) => {
        const entries = getEntriesByUserId(userId);
        const totalTrades = entries.length;
        if (totalTrades === 0) {
            return { totalPL: 0, winRate: 0, totalTrades: 0, biggestWin: 0, biggestLoss: 0 };
        }
        const totalPL = entries.reduce((sum, entry) => sum + entry.profitOrLoss, 0);
        const winningTrades = entries.filter(e => e.profitOrLoss > 0).length;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        const biggestWin = Math.max(0, ...entries.map(e => e.profitOrLoss));
        const biggestLoss = Math.min(0, ...entries.map(e => e.profitOrLoss));

        return {
            totalPL: parseFloat(totalPL.toFixed(2)),
            winRate: parseFloat(winRate.toFixed(1)),
            totalTrades,
            biggestWin: parseFloat(biggestWin.toFixed(2)),
            biggestLoss: parseFloat(biggestLoss.toFixed(2)),
        };
    };

    return (
        <TradingJournalContext.Provider value={{ journalEntries, getEntriesByUserId, addEntry, updateEntry, deleteEntry, getJournalStats }}>
            {children}
        </TradingJournalContext.Provider>
    );
};