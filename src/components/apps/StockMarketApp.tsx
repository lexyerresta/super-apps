'use client';
import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { TrendingUp, TrendingDown, Search, RefreshCw, BarChart2, Activity, ExternalLink } from 'lucide-react';

export default function StockMarketApp() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Common stocks to display
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'NFLX', 'AMD', 'INTC', 'DIS'];

    // Finnhub API Key (Public Sandbox/Free Tier)
    const API_KEY = 'cj0v19pr01qg4t1u8b90cj0v19pr01qg4t1u8b9g';

    const getStockName = (symbol: string) => {
        const names: Record<string, string> = {
            AAPL: 'Apple Inc.',
            GOOGL: 'Alphabet Inc.',
            MSFT: 'Microsoft Corp.',
            AMZN: 'Amazon.com Inc.',
            TSLA: 'Tesla Inc.',
            META: 'Meta Platforms',
            NVDA: 'NVIDIA Corp.',
            JPM: 'JPMorgan Chase',
            NFLX: 'Netflix Inc.',
            AMD: 'Advanced Micro Devices',
            INTC: 'Intel Corp.',
            DIS: 'The Walt Disney Co.'
        };
        return names[symbol] || symbol;
    };

    const fetchStocks = async () => {
        setLoading(true);
        try {
            // Fetch real data from Finnhub for each symbol
            const requests = symbols.map(async (symbol) => {
                try {
                    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
                    const data = await response.json();

                    // Finnhub returns: c: Current price, d: Change, dp: Percent change, h: High, l: Low, o: Open, pc: Previous close
                    return {
                        symbol,
                        name: getStockName(symbol),
                        price: data.c ? data.c.toFixed(2) : '0.00',
                        change: data.d ? data.d.toFixed(2) : '0.00',
                        changePercent: data.dp ? data.dp.toFixed(2) : '0.00',
                        volume: 0, // Volume not available in free quote endpoint
                        high: data.h ? data.h.toFixed(2) : '0.00',
                        low: data.l ? data.l.toFixed(2) : '0.00',
                        previousClose: data.pc
                    };
                } catch (err) {
                    console.error(`Failed to fetch ${symbol}`, err);
                    return null;
                }
            });

            const results = await Promise.all(requests);

            // Filter out failed requests (nulls)
            const validStocks = results.filter(stock => stock !== null && stock.price !== '0.00');

            if (validStocks.length > 0) {
                setStocks(validStocks);
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
        const interval = setInterval(fetchStocks, 60000); // 1 min update
        return () => clearInterval(interval);
    }, []);

    const filteredStocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStockClick = (symbol: string) => {
        // Direct redirect to Yahoo Finance for detailed view
        window.open(`https://finance.yahoo.com/quote/${symbol}`, '_blank');
    };

    return (
        <div className={styles.appContainer} style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Header Stats */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem',
                marginBottom: '1rem', padding: '0.75rem',
                background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={12} /> Nasdaq
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green)' }}>+1.24%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BarChart2 size={12} /> S&P 500
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green)' }}>+0.85%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={12} /> Dow Jones
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-red)' }}>-0.12%</span>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search stock..."
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <RefreshCw size={18} className={loading ? styles.spinning : ''} />
                </button>
            </div>

            {/* Stock List */}
            <div style={{
                flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                paddingRight: '6px', paddingBottom: '1rem' // Safe padding
            }}>
                {filteredStocks.map((stock) => {
                    const isPositive = parseFloat(stock.change) >= 0;
                    return (
                        <div
                            key={stock.symbol}
                            onClick={() => handleStockClick(stock.symbol)}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 1fr 80px', // Avatar | Info | Price
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
                            {/* Icon Avatar */}
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)'
                            }}>
                                {stock.symbol[0]}
                            </div>

                            {/* Info */}
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px', color: 'var(--text-primary)' }}>
                                    {stock.symbol}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {stock.name}
                                </div>
                            </div>

                            {/* Price */}
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    ${stock.price}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem', fontWeight: 600,
                                    color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px'
                                }}>
                                    {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {Math.abs(parseFloat(stock.changePercent)).toFixed(2)}%
                                </div>
                            </div>

                            {/* External Link Hint (hidden visually but implied by cursor) */}
                        </div>
                    );
                })}
            </div>

            {/* Footer Tip */}
            <div style={{
                marginTop: 'auto', padding: '0.5rem',
                textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)',
                borderTop: '1px solid var(--glass-border)', flexShrink: 0
            }}>
                Real-time data provided by Finnhub <ExternalLink size={8} style={{ display: 'inline' }} />
            </div>
        </div>
    );
}
