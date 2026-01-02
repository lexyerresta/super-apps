'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { useLocalStorage, useDebounce } from '@/hooks';
import { Search, RefreshCw, TrendingUp, TrendingDown, Star, BarChart3, Activity, Filter, ArrowUp, ArrowDown } from 'lucide-react';

// Type for Crypto Data with Sparkline
interface CryptoCoin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
    sparkline_in_7d?: {
        price: number[];
    };
}

type SortOption = 'market_cap_desc' | 'volume_desc' | 'id_desc' | 'gainers' | 'losers';

export default function CryptoApp() {
    const [coins, setCoins] = useState<CryptoCoin[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortOption, setSortOption] = useState<SortOption>('market_cap_desc');
    const [watchlist, setWatchlist] = useLocalStorage<string[]>('crypto_watchlist', []);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastCoinElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const debouncedSearch = useDebounce(searchTerm, 500);

    const fetchCoins = async (pageNum: number, sort: SortOption, isReset: boolean = false) => {
        if (loading) return;
        setLoading(true);
        try {
            // Determine API sort parameter
            let apiSort = 'market_cap_desc';
            if (sort === 'volume_desc') apiSort = 'volume_desc';
            if (sort === 'id_desc') apiSort = 'id_desc'; // Closest to 'New'

            // Fetch with sparkline
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${apiSort}&per_page=50&page=${pageNum}&sparkline=true&price_change_percentage=24h`
            );

            if (!response.ok) throw new Error('Rate limit');

            let data: CryptoCoin[] = await response.json();

            // Client-side sorting for Gainers/Losers (not supported by API sort param)
            if (sort === 'gainers') {
                data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
            } else if (sort === 'losers') {
                data.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
            }

            setCoins(prev => isReset ? data : [...prev, ...data]);
            setHasMore(data.length > 0);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and sort change
    useEffect(() => {
        setPage(1);
        setCoins([]);
        fetchCoins(1, sortOption, true);
    }, [sortOption]);

    // Infinite scroll fetch
    useEffect(() => {
        if (page > 1) {
            fetchCoins(page, sortOption, false);
        }
    }, [page]);

    const handleSortChange = (option: SortOption) => {
        if (option === sortOption) return; // No change
        setSortOption(option);
    };

    const toggleWatchlist = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setWatchlist(watchlist.includes(id) ? watchlist.filter(w => w !== id) : [...watchlist, id]);
    };

    // Filter Logic
    const displayedCoins = coins.filter(c => {
        if (debouncedSearch) {
            return c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase());
        }
        return true;
    });

    const Sparkline = ({ data, color }: { data?: number[], color: string }) => {
        if (!data || data.length < 5) return null;
        // Simple SVG sparkline
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const width = 60;
        const height = 20;

        const points = data.filter((_, i) => i % 5 === 0) // Downsample
            .map((val, i, arr) => {
                const x = (i / (arr.length - 1)) * width;
                const y = height - ((val - min) / range) * height;
                return `${x},${y}`;
            }).join(' ');

        return (
            <svg width={width} height={height} style={{ overflow: 'visible' }}>
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    return (
        <div className={styles.appContainer} style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Header Controls */}
            <div style={{ padding: '0 0.25rem 0.75rem', flexShrink: 0 }}>
                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search coins..."
                        style={{
                            width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem',
                            background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                            borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none'
                        }}
                    />
                </div>

                {/* Filters - DexScreener Style */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
                    {[
                        { id: 'market_cap_desc', label: 'Trending', icon: <Activity size={12} /> },
                        { id: 'volume_desc', label: 'Volume', icon: <BarChart3 size={12} /> },
                        { id: 'gainers', label: 'Top Gainers', icon: <TrendingUp size={12} /> },
                        { id: 'losers', label: 'Top Losers', icon: <TrendingDown size={12} /> },
                        { id: 'id_desc', label: 'Newest', icon: <Star size={12} /> },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSortChange(opt.id as SortOption)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.5rem 0.8rem', borderRadius: '20px',
                                background: sortOption === opt.id ? 'var(--primary)' : 'var(--bg-secondary)',
                                color: sortOption === opt.id ? 'white' : 'var(--text-secondary)',
                                border: sortOption === opt.id ? 'none' : '1px solid var(--glass-border)',
                                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                                transition: 'all 0.2s', flexShrink: 0
                            }}
                        >
                            {opt.icon} {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Crypto List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '4px', paddingBottom: '1rem' }}>
                {displayedCoins.map((coin, index) => {
                    const isLast = index === displayedCoins.length - 1;
                    const isPositive = coin.price_change_percentage_24h >= 0;

                    return (
                        <div
                            ref={isLast ? lastCoinElementRef : null}
                            key={`${coin.id}-${index}`}
                            onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank')}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '30px 1fr 60px 80px', // simplified grid
                                alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                cursor: 'pointer', position: 'relative'
                            }}
                        >
                            <img src={coin.image} alt={coin.symbol} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />

                            <div style={{ minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{coin.symbol.toUpperCase()}</span>
                                    <span style={{ fontSize: '0.8rem', color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                        {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Vol: ${(coin.total_volume / 1e6).toFixed(1)}M
                                </div>
                            </div>

                            {/* Sparkline */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkline
                                    data={coin.sparkline_in_7d?.price}
                                    color={isPositive ? '#10B981' : '#EF4444'}
                                />
                            </div>

                            {/* Price */}
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    ${coin.current_price < 1
                                        ? coin.current_price.toFixed(6)
                                        : coin.current_price.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                    MCap ${(coin.market_cap / 1e9).toFixed(1)}B
                                </div>
                            </div>

                            {/* Watchlist Star Absolute */}
                            <button
                                onClick={(e) => toggleWatchlist(e, coin.id)}
                                style={{
                                    position: 'absolute', top: '8px', right: '8px',
                                    padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: watchlist.includes(coin.id) ? 'var(--accent-yellow)' : 'transparent',
                                }}
                            >
                                <Star size={12} fill="currentColor" stroke={watchlist.includes(coin.id) ? 'none' : 'var(--text-tertiary)'} />
                            </button>
                        </div>
                    );
                })}

                {loading && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        Loading more assets...
                    </div>
                )}

                {!loading && displayedCoins.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                        No coins found
                    </div>
                )}
            </div>
        </div>
    );
}
