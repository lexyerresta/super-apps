'use client';
import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { TrendingUp, TrendingDown, Search, RefreshCw, BarChart2, Activity, ExternalLink, AlertCircle } from 'lucide-react';

interface StockData {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketVolume: number;
}

export default function StockMarketApp() {
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Common stocks to display
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'NFLX', 'AMD', 'INTC', 'DIS', 'COIN', 'PLTR', 'BABA'];

    // Header Indices
    interface MarketIndex { name: string; symbol: string; change: number; color: string }
    const [indices, setIndices] = useState<MarketIndex[]>([
        { name: 'S&P 500', symbol: 'ES=F', change: 0, color: 'var(--text-tertiary)' },
        { name: 'Nasdaq', symbol: 'NQ=F', change: 0, color: 'var(--text-tertiary)' },
        { name: 'Dow', symbol: 'YM=F', change: 0, color: 'var(--text-tertiary)' }
    ]);

    const fetchStocks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch everything in ONE optimized batch request
            const allSymbols = [...symbols, 'ES=F', 'NQ=F', 'YM=F'].join(',');
            const response = await fetch(`/api/stocks?symbols=${allSymbols}`);

            if (!response.ok) throw new Error('Failed to fetch market data');

            const data = await response.json();
            const items: any[] = data.items || [];

            // Separate stocks from indices
            const stockItems = items.filter(item => symbols.includes(item.symbol));
            const indexItems = items.filter(item => ['ES=F', 'NQ=F', 'YM=F'].includes(item.symbol));

            const formattedStocks = stockItems.map(item => ({
                symbol: item.symbol,
                shortName: item.shortName || item.longName || item.symbol,
                regularMarketPrice: item.regularMarketPrice || 0,
                regularMarketChange: item.regularMarketChange || 0,
                regularMarketChangePercent: item.regularMarketChangePercent || 0,
                regularMarketVolume: item.regularMarketVolume || 0
            }));

            // Update Indices State
            const updatedIndices = indices.map(idx => {
                const data = indexItems.find(i => i.symbol === idx.symbol);
                if (!data) return idx;
                const change = data.regularMarketChangePercent || 0;
                return {
                    ...idx,
                    change: change,
                    color: change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'
                };
            });

            setStocks(formattedStocks);
            setIndices(updatedIndices);

        } catch (err: any) {
            console.error('Stock fetch error:', err);
            setError('Unable to load real-time data. Retrying...');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
        const interval = setInterval(fetchStocks, 10000); // 10s auto-refresh (fast!)
        return () => clearInterval(interval);
    }, []);

    const filteredStocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStockClick = (symbol: string) => {
        window.open(`https://finance.yahoo.com/quote/${symbol}`, '_blank');
    };

    return (
        <div className={styles.appContainer} style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Header Stats (Real Data Indices) */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem',
                marginBottom: '1rem', padding: '0.75rem',
                background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)',
                flexShrink: 0
            }}>
                {indices.map((idx, i) => (
                    <div key={idx.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Activity size={12} /> {idx.name}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: idx.color, transition: 'color 0.3s' }}>
                            {idx.change > 0 ? '+' : ''}{idx.change.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search ticker (e.g. NVDA)..."
                        style={{
                            width: '100%',
                            padding: '0.7rem 1rem 0.7rem 2.5rem',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)',
                            background: 'var(--bg-secondary)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
                <button
                    onClick={fetchStocks}
                    disabled={loading}
                    style={{
                        padding: '0.6rem 0.8rem',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <RefreshCw size={18} className={loading ? styles.spinning : ''} />
                </button>
            </div>

            {/* Stock List */}
            <div style={{
                flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                paddingRight: '4px', paddingBottom: '1rem'
            }}>
                {error && (
                    <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--accent-red)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={20} />
                        {error}
                        <button onClick={fetchStocks} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Retry</button>
                    </div>
                )}

                {loading && stocks.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        Loading market data...
                    </div>
                ) : (
                    filteredStocks.map((stock) => {
                        const isPositive = stock.regularMarketChange >= 0;
                        return (
                            <div
                                key={stock.symbol}
                                onClick={() => handleStockClick(stock.symbol)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '45px 1fr auto', // Avatar | Info | Price
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.1s',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                }}
                            >
                                {/* Symbol Container */}
                                <div style={{
                                    width: '45px', height: '45px', borderRadius: '10px',
                                    background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    {stock.symbol[0]}
                                </div>

                                {/* Info */}
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '2px', color: 'var(--text-primary)' }}>
                                        {stock.symbol}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {stock.shortName}
                                    </div>
                                </div>

                                {/* Price Data */}
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                        ${stock.regularMarketPrice.toFixed(2)}
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem', fontWeight: 700,
                                        color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px',
                                        background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        padding: '2px 6px', borderRadius: '6px', display: 'inline-flex'
                                    }}>
                                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {stock.regularMarketChangePercent.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {stocks.length > 0 && filteredStocks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-tertiary)' }}>No stocks found</div>
                )}
            </div>

            {/* Footer Tip */}
            <div style={{
                marginTop: 'auto', padding: '0.5rem',
                textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)',
                borderTop: '1px solid var(--glass-border)', flexShrink: 0
            }}>
                Real-time market data via Yahoo Finance <ExternalLink size={8} style={{ display: 'inline' }} />
            </div>
        </div>
    );
}
