import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useTranslation } from '../hooks/useTranslation';

interface TradeLog {
    id: number;
    type: 'Market Buy' | 'Market Sell' | 'Buy Limit' | 'Sell Limit';
    price: number;
    status: 'Executed' | 'Pending';
}

const OrderExecutionSimulatorPage: React.FC = () => {
    const { t } = useTranslation();
    const [price, setPrice] = useState(1.07345);
    const [bid, setBid] = useState(1.07345);
    const [ask, setAsk] = useState(1.07352);
    const [tradeLog, setTradeLog] = useState<TradeLog[]>([]);
    const [limitPrice, setLimitPrice] = useState('');
    const [pendingOrders, setPendingOrders] = useState<TradeLog[]>([]);
    
    const priceDirection = useRef(1);

    useEffect(() => {
        const interval = setInterval(() => {
            const spread = 0.00007;
            const movement = (Math.random() - 0.49) * 0.0001;
            
            setPrice(prev => {
                const newPrice = prev + movement;
                const newBid = parseFloat(newPrice.toFixed(5));
                const newAsk = parseFloat((newPrice + spread).toFixed(5));
                
                setBid(newBid);
                setAsk(newAsk);

                // Check for limit order execution
                setPendingOrders(prevOrders => {
                    const updatedOrders = prevOrders.filter(order => {
                        let executed = false;
                        if (order.type === 'Buy Limit' && newAsk <= order.price) {
                            executed = true;
                        } else if (order.type === 'Sell Limit' && newBid >= order.price) {
                            executed = true;
                        }
                        
                        if (executed) {
                            setTradeLog(prevLog => [{ ...order, status: 'Executed', price: order.price }, ...prevLog]);
                            return false; // remove from pending
                        }
                        return true; // keep in pending
                    });
                    return updatedOrders;
                });
                
                return newPrice;
            });

        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleMarketOrder = (type: 'Market Buy' | 'Market Sell') => {
        const executionPrice = type === 'Market Buy' ? ask : bid;
        const newTrade: TradeLog = {
            id: Date.now(),
            type,
            price: executionPrice,
            status: 'Executed'
        };
        setTradeLog(prev => [newTrade, ...prev]);
    };

    const handleLimitOrder = (type: 'Buy Limit' | 'Sell Limit') => {
        const priceValue = parseFloat(limitPrice);
        if (isNaN(priceValue) || priceValue <= 0) return;

        const newOrder: TradeLog = {
            id: Date.now(),
            type,
            price: priceValue,
            status: 'Pending'
        };
        setPendingOrders(prev => [newOrder, ...prev]);
        setTradeLog(prev => [newOrder, ...prev]);
        setLimitPrice('');
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">{t('education.simulators.execution.title')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Price Feed */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader><h2 className="font-bold text-center">EUR/USD Price Feed</h2></CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-foreground/70">BID</p>
                            <p className="text-4xl font-mono text-red-400">{bid.toFixed(5)}</p>
                            <p className="text-sm text-foreground/70 mt-4">ASK</p>
                            <p className="text-4xl font-mono text-green-400">{ask.toFixed(5)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Panel */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><h2 className="font-bold">Market Order</h2></CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-card-foreground/80">Executes immediately at the best available market price.</p>
                            <Button onClick={() => handleMarketOrder('Market Buy')} className="w-full bg-green-600 hover:bg-green-700">Buy at {ask.toFixed(5)}</Button>
                            <Button onClick={() => handleMarketOrder('Market Sell')} className="w-full bg-red-600 hover:bg-red-700">Sell at {bid.toFixed(5)}</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><h2 className="font-bold">Limit Order</h2></CardHeader>
                        <CardContent className="space-y-4">
                             <p className="text-sm text-card-foreground/80">Executes only if the market reaches your specified price.</p>
                             <Input 
                                type="number"
                                placeholder="Enter desired price"
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(e.target.value)}
                                step="0.00001"
                             />
                             <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => handleLimitOrder('Buy Limit')} variant="secondary" disabled={!limitPrice}>Buy Limit</Button>
                                <Button onClick={() => handleLimitOrder('Sell Limit')} variant="secondary" disabled={!limitPrice}>Sell Limit</Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>
                 {/* Trade Log */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader><h2 className="font-bold">Trade Log</h2></CardHeader>
                        <CardContent className="max-h-60 overflow-y-auto">
                            {tradeLog.length === 0 ? (
                                <p className="text-center text-sm text-card-foreground/70">Your executed and pending orders will appear here.</p>
                            ) : (
                                <div className="space-y-2">
                                    {tradeLog.map(trade => (
                                        <div key={trade.id} className="p-2 bg-input/50 rounded-md flex justify-between items-center text-sm">
                                            <span className={`font-semibold ${trade.type.includes('Buy') ? 'text-green-400' : 'text-red-400'}`}>{trade.type}</span>
                                            <span>@ {trade.price.toFixed(5)}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${trade.status === 'Executed' ? 'bg-primary-600 text-white' : 'bg-yellow-800 text-yellow-200'}`}>{trade.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderExecutionSimulatorPage;
