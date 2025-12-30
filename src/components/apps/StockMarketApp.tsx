'use client';
import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function StockMarketApp() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Popular stocks to track
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM'];

    const fetchStocks = async () => {
        setLoading(true);
        try {
            // Using Alpha Vantage API (free tier) or mock data
            // For demo, using mock data that simulates real stock prices
            const mockStocks = symbols.map(symbol => ({
                symbol,
                name: getStockName(symbol),
                price: (Math.random() * 500 + 50).toFixed(2),
                change: (Math.random() * 10 - 5).toFixed(2),
                changePercent: (Math.random() * 5 - 2.5).toFixed(2),
                volume: Math.floor(Math.random() * 100000000),
                high: (Math.random() * 550 + 50).toFixed(2),
                low: (Math.random() * 500 + 40).toFixed(2)
            }));
            setStocks(mockStocks);
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStockName = (symbol: string) => {
        const names: Record<string, string> = {
            AAPL: 'Apple Inc.',
            GOOGL: 'Alphabet Inc.',
            MSFT: 'Microsoft Corp.',
            AMZN: 'Amazon.com Inc.',
            TSLA: 'Tesla Inc.',
            META: 'Meta Platforms',
            NVDA: 'NVIDIA Corp.',
            JPM: 'JPMorgan Chase'
        };
        return names[symbol] || symbol;
    };

    useEffect(() => {
        fetchStocks();
        const interval = setInterval(fetchStocks, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>Stock Market</div>
                <button onClick={fetchStocks} disabled={loading} className={styles.actionBtn} style={{ fontSize: '0.875rem' }}>
                    {loading ? 'Updating...' : 'Refresh'}
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {stocks.map((stock) => {
                    const isPositive = parseFloat(stock.change) >= 0;
                    return (
                        <div key={stock.symbol} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                                        {stock.symbol}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {stock.name}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                                        ${stock.price}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        justifyContent: 'flex-end',
                                        color: isPositive ? '#10b981' : '#ef4444',
                                        fontSize: '0.875rem',
                                        fontWeight: '600'
                                    }}>
                                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {isPositive ? '+' : ''}{stock.change} ({isPositive ? '+' : ''}{stock.changePercent}%)
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>High</div>
                                    <div style={{ fontWeight: '600' }}>${stock.high}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Low</div>
                                    <div style={{ fontWeight: '600' }}>${stock.low}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Volume</div>
                                    <div style={{ fontWeight: '600' }}>{(stock.volume / 1000000).toFixed(1)}M</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
