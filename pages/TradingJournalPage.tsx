import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTradingJournal } from '../hooks/useTradingJournal';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Icons } from '../constants';
import Spinner from '../components/ui/Spinner';
import { getTradingJournalAnalysis } from '../services/geminiService';
import MetaTags from '../components/common/MetaTags';

const initialFormState = {
    instrument: 'EUR/USD',
    direction: 'Buy' as 'Buy' | 'Sell',
    entryPrice: '',
    exitPrice: '',
    lotSize: '0.1',
    strategyUsed: '',
    notes: '',
};

const StatCard: React.FC<{ title: string; value: string | number; color?: string; icon: React.ReactNode }> = ({ title, value, color = 'text-card-foreground', icon }) => (
    <div className="bg-input/50 p-4 rounded-lg flex items-center gap-4">
        <div className="p-2 bg-background rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-foreground/70">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    </div>
);

const parseMarkdown = (text: string): string => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\s*-\s+(.*)/gm, '<li class="ml-4 list-disc">$1</li>')
        .replace(/(\r\n|\n|\r)/gm, '<br>')
        .replace(/<br><li/g, '<li')
        .replace(/<\/li><br>/g, '</li>');
};

const TradingJournalPage: React.FC = () => {
    const { user } = useAuth();
    const { getEntriesByUserId, addEntry, deleteEntry, getJournalStats } = useTradingJournal();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formState, setFormState] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    const userEntries = useMemo(() => user ? getEntriesByUserId(user.id) : [], [user, getEntriesByUserId]);
    const stats = useMemo(() => user ? getJournalStats(user.id) : null, [user, getJournalStats, userEntries]);

    if (!user || !stats) return null;

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addEntry({
                ...formState,
                entryPrice: parseFloat(formState.entryPrice),
                exitPrice: parseFloat(formState.exitPrice),
                lotSize: parseFloat(formState.lotSize),
            });
            setFormState(initialFormState);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Failed to add journal entry:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGetAnalysis = async () => {
        setIsLoadingAnalysis(true);
        setAnalysis(null);
        try {
            const result = await getTradingJournalAnalysis(userEntries);
            setAnalysis(result);
        } catch (error) {
            console.error("Failed to get AI analysis", error);
            setAnalysis("Sorry, the AI Coach is unavailable at the moment. Please try again later.");
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    return (
        <div>
            <MetaTags title="My Trading Journal | Brokeranalysis" description="Log and analyze your trading performance with the AI-powered trading journal." canonicalUrl="https://brokeranalysis.com/#/trading-journal" />
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">My Trading Journal</h1>
                <p className="text-lg text-foreground/80 mt-2">Track your progress, identify patterns, and improve your strategy.</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <StatCard title="Total P/L" value={stats.totalPL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} color={stats.totalPL >= 0 ? 'text-green-400' : 'text-red-400'} icon={<Icons.trendingUp className="h-6 w-6"/>} />
                <StatCard title="Win Rate" value={`${stats.winRate}%`} icon={<Icons.checkCircle className="h-6 w-6"/>} />
                <StatCard title="Total Trades" value={stats.totalTrades} icon={<Icons.layers className="h-6 w-6"/>} />
                <StatCard title="Biggest Win" value={stats.biggestWin.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} color="text-green-400" icon={<Icons.arrowUp className="h-6 w-6"/>} />
                <StatCard title="Biggest Loss" value={stats.biggestLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} color="text-red-400" icon={<Icons.chevronDown className="h-6 w-6"/>} />
            </div>

            {/* Add Trade Form */}
            <Card className="mb-8">
                <button onClick={() => setIsFormOpen(!isFormOpen)} className="w-full p-4 text-left font-semibold text-lg flex justify-between items-center" aria-expanded={isFormOpen}>
                    <span>Log a New Trade</span>
                    <Icons.chevronDown className={`h-6 w-6 transition-transform ${isFormOpen ? 'rotate-180' : ''}`} />
                </button>
                {isFormOpen && (
                    <div className="p-6 border-t border-input animate-fade-in">
                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input label="Instrument" name="instrument" value={formState.instrument} onChange={handleFormChange} required />
                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-1">Direction</label>
                                <select name="direction" value={formState.direction} onChange={handleFormChange} className="w-full bg-input border-input rounded-md shadow-sm p-2">
                                    <option value="Buy">Buy</option>
                                    <option value="Sell">Sell</option>
                                </select>
                            </div>
                            <Input label="Lot Size" name="lotSize" type="number" step="0.01" value={formState.lotSize} onChange={handleFormChange} required />
                            <Input label="Entry Price" name="entryPrice" type="number" step="any" value={formState.entryPrice} onChange={handleFormChange} required />
                            <Input label="Exit Price" name="exitPrice" type="number" step="any" value={formState.exitPrice} onChange={handleFormChange} required />
                            <Input label="Strategy Used" name="strategyUsed" value={formState.strategyUsed} onChange={handleFormChange} />
                            <div className="md:col-span-2 lg:col-span-3">
                                 <label htmlFor="notes" className="block text-sm font-medium text-foreground/80 mb-1">Notes / Comments</label>
                                <textarea id="notes" name="notes" rows={3} className="block w-full bg-input border-input rounded-md shadow-sm p-2 placeholder:text-foreground/60" value={formState.notes} onChange={handleFormChange}></textarea>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Spinner size="sm" /> : "Save Trade"}</Button>
                            </div>
                        </form>
                    </div>
                )}
            </Card>

            {/* AI Analysis Section */}
            <Card className="mb-8">
                 <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Icons.brainCircuit className="h-7 w-7 text-primary-400" /> AI Coach</h2>
                        <Button onClick={handleGetAnalysis} disabled={isLoadingAnalysis || userEntries.length < 3}>
                            {isLoadingAnalysis ? <Spinner size="sm" /> : "Analyze My Performance"}
                        </Button>
                    </div>
                 </CardHeader>
                 <CardContent>
                    {isLoadingAnalysis && <div className="flex justify-center items-center p-8"><Spinner /></div>}
                    {analysis && <div className="prose dark:prose-invert max-w-none text-card-foreground/90" dangerouslySetInnerHTML={{ __html: parseMarkdown(analysis) }}></div>}
                    {!analysis && !isLoadingAnalysis && (
                        <p className="text-center text-card-foreground/70">{userEntries.length < 3 ? "Log at least 3 trades to enable AI analysis." : "Click the button to get personalized feedback on your trading."}</p>
                    )}
                 </CardContent>
            </Card>

            {/* Trade History Table */}
            <h2 className="text-2xl font-bold mb-4">Trade History</h2>
            <div className="overflow-x-auto bg-card rounded-lg border border-input">
                <table className="w-full min-w-max text-left">
                    <thead>
                        <tr className="border-b border-input">
                            <th className="p-4">Date</th>
                            <th className="p-4">Instrument</th>
                            <th className="p-4">Direction</th>
                            <th className="p-4 text-right">P/L ($)</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userEntries.map(entry => (
                            <tr key={entry.id} className="border-b border-input last:border-b-0">
                                <td className="p-4 text-sm text-foreground/80">{new Date(entry.date).toLocaleDateString()}</td>
                                <td className="p-4 font-semibold">{entry.instrument}</td>
                                <td className={`p-4 font-semibold ${entry.direction === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{entry.direction}</td>
                                <td className={`p-4 text-right font-mono font-semibold ${entry.profitOrLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>{entry.profitOrLoss.toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                                        <Icons.trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {userEntries.length === 0 && <p className="text-center p-8 text-foreground/70">You have not logged any trades yet.</p>}
            </div>
        </div>
    );
};

export default TradingJournalPage;