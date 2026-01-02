'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { useAsync, useDebounce, useInterval, useLocalStorage } from '@/hooks';
import { CryptoService } from '@/services/api.service';
import type { CryptoData } from '@/types';
import { Search, RefreshCw, TrendingUp, TrendingDown, AlertCircle, Star, BarChart3, DollarSign, Activity, ArrowUpDown, ExternalLink } from 'lucide-react';

type SortField = 'rank' | 'price' | 'change_24h' | 'market_cap';
type SortDirection = 'asc' | 'desc';

export default function CryptoApp() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sortField, setSortField] = useState<SortField>('rank');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
    const [watchlist, setWatchlist] = useLocalStorage<string[]>('crypto_watchlist', []); // Store IDs
    const debouncedSearch = useDebounce(searchTerm, 300);

    const { data: cryptos, loading, error, execute } = useAsync<CryptoData[]>(
        () => CryptoService.getTopCryptos(50), // Increased fetch limit
        []
    );

    useInterval(() => { execute(); }, 60000);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await execute();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const toggleWatchlist = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent row click
        setWatchlist(watchlist.includes(id) ? watchlist.filter(w => w !== id) : [...watchlist, id]);
    };

    const handleItemClick = (id: string) => {
        // Redirect to CoinGecko for details
        window.open(`https://www.coingecko.com/en/coins/${id}`, '_blank');
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection(field === 'rank' ? 'asc' : 'desc');
        }
    };

    const filteredCryptos = useMemo(() => {
        if (!cryptos) return [];
        let result = cryptos;

        if (debouncedSearch) {
            result = result.filter((c) =>
                c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        if (showWatchlistOnly) {
            result = result.filter(c => watchlist.includes(c.id));
        }

        return [...result].sort((a, b) => {
            let cmp = 0;
            if (sortField === 'rank') cmp = a.market_cap_rank - b.market_cap_rank;
            else if (sortField === 'price') cmp = a.current_price - b.current_price;
            else if (sortField === 'change_24h') cmp = a.price_change_percentage_24h - b.price_change_percentage_24h;
            else if (sortField === 'market_cap') cmp = a.market_cap - b.market_cap;
            return sortDirection === 'asc' ? cmp : -cmp;
        });
    }, [cryptos, debouncedSearch, showWatchlistOnly, watchlist, sortField, sortDirection]);

    const formatPrice = (p: number): string => p >= 1000 ? `$${p.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : p >= 1 ? `$${p.toFixed(2)}` : `$${p.toFixed(6)}`;
    const formatMCap = (v: number): string => v >= 1e12 ? `$${(v / 1e12).toFixed(1)}T` : v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : `$${(v / 1e6).toFixed(1)}M`;

    const stats = useMemo(() => {
        if (!cryptos?.length) return null;
        return {
            totalMCap: cryptos.reduce((s, c) => s + c.market_cap, 0),
            gainers: cryptos.filter(c => c.price_change_percentage_24h > 0).length,
            avgChange: cryptos.reduce((s, c) => s + c.price_change_percentage_24h, 0) / cryptos.length
        };
    }, [cryptos]);

    const SortBtn = ({ field, label }: { field: SortField; label: string }) => (
        <button
            onClick={() => handleSort(field)}
            style={{
                display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.35rem 0.6rem',
                background: sortField === field ? 'var(--primary)' : 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: sortField === field ? 'white' : 'var(--text-secondary)',
                fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s'
            }}>
            {label} {sortField === field && <ArrowUpDown size={12} style={{ transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none' }} />}
        </button>
    );

    return (
        <div className={styles.appContainer} style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Stats Bar */}
            {stats && (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem',
                    marginBottom: '1rem', padding: '0.75rem',
                    background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                            <DollarSign size={12} /> Total MCap
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatMCap(stats.totalMCap)}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                            <TrendingUp size={12} /> Gainers
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green)' }}>{stats.gainers}/{cryptos?.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                            <Activity size={12} /> Avg 24h
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: stats.avgChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                            {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexShrink: 0 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search coin..."
                        style={{
                            width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem',
                            background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                            borderRadius: '10px', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none'
                        }}
                    />
                </div>
                <button onClick={() => setShowWatchlistOnly(!showWatchlistOnly)} style={{
                    padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--glass-border)', cursor: 'pointer',
                    background: showWatchlistOnly ? 'var(--primary)' : 'var(--bg-secondary)',
                    color: showWatchlistOnly ? 'white' : 'var(--text-secondary)',
                    flexShrink: 0
                }}>
                    <Star size={18} fill={showWatchlistOnly ? 'currentColor' : 'none'} />
                </button>
                <button onClick={handleRefresh} className={isRefreshing ? styles.spinning : ''} style={{
                    padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--glass-border)', cursor: 'pointer',
                    background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                    flexShrink: 0
                }}>
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Sort Buttons - Better Scroll */}
            <div style={{
                display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '0.25rem',
                flexShrink: 0, scrollbarWidth: 'none', paddingRight: '1rem' // Added padding right
            }}>
                <SortBtn field="rank" label="Rank" />
                <SortBtn field="price" label="Price" />
                <SortBtn field="change_24h" label="24h Change" />
                <SortBtn field="market_cap" label="Market Cap" />
            </div>

            {loading && !cryptos ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-tertiary)' }}>
                    <div className={styles.spinner} />
                    <p>Fetching market data...</p>
                </div>
            ) : error ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--accent-red)' }}>
                    <AlertCircle size={32} />
                    <p>Failed to load data</p>
                    <button onClick={execute} style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer' }}>Retry</button>
                </div>
            ) : (
                <div style={{
                    flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    paddingRight: '6px', paddingBottom: '1rem' // Added padding bottom
                }}>
                    {filteredCryptos.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => handleItemClick(c.id)}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '24px 32px 1fr 60px 80px 24px', // Fixed grid layout
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 0.5rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                cursor: 'pointer',
                                position: 'relative',
                                minWidth: '320px' // Ensure minimum width so internal elements don't crush
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--bg-tertiary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--bg-secondary)';
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                                #{c.market_cap_rank}
                            </div>

                            <img src={c.image} alt={c.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />

                            <div style={{ minWidth: 0, paddingRight: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.symbol.toUpperCase()}</span>
                                    {watchlist.includes(c.id) && <Star size={10} fill="var(--accent-yellow)" color="var(--accent-yellow)" />}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                                    {c.name}
                                </span>
                            </div>

                            {/* Mini Chart */}
                            <div style={{ width: '100%', height: '20px', display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '100%', height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden',
                                    display: 'flex', opacity: 0.7
                                }}>
                                    <div style={{
                                        width: `${Math.min(Math.abs(c.price_change_percentage_24h) * 5, 100)}%`,
                                        background: c.price_change_percentage_24h >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                                        marginLeft: c.price_change_percentage_24h < 0 ? 'auto' : 0
                                    }} />
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                    {c.current_price >= 1000 ? `$${(c.current_price / 1000).toFixed(1)}k` : formatPrice(c.current_price)}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem', fontWeight: 600,
                                    color: c.price_change_percentage_24h >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px'
                                }}>
                                    {c.price_change_percentage_24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {Math.abs(c.price_change_percentage_24h).toFixed(1)}%
                                </div>
                            </div>

                            {/* Watchlist Action */}
                            <button
                                onClick={(e) => toggleWatchlist(e, c.id)}
                                style={{
                                    padding: '0.2rem', background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: watchlist.includes(c.id) ? 'var(--accent-yellow)' : 'var(--glass-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Star size={18} fill={watchlist.includes(c.id) ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                    ))}
                    {filteredCryptos.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                            <p>No coins found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Footer Tip */}
            <div style={{
                marginTop: 'auto', padding: '0.5rem',
                textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)',
                borderTop: '1px solid var(--glass-border)', flexShrink: 0
            }}>
                Click for details on CoinGecko <ExternalLink size={8} style={{ display: 'inline' }} />
            </div>
        </div>
    );
}
