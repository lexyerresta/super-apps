'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { useAsync, useDebounce, useInterval, useLocalStorage } from '@/hooks';
import { CryptoService } from '@/services/api.service';
import type { CryptoData } from '@/types';
import { Search, RefreshCw, TrendingUp, TrendingDown, AlertCircle, Star, BarChart3, DollarSign, Activity, ArrowUpDown } from 'lucide-react';

type SortField = 'rank' | 'price' | 'change_24h' | 'market_cap';
type SortDirection = 'asc' | 'desc';

export default function CryptoApp() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sortField, setSortField] = useState<SortField>('rank');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
    const [watchlist, setWatchlist] = useLocalStorage<string[]>('crypto_watchlist', []);
    const debouncedSearch = useDebounce(searchTerm, 300);

    const { data: cryptos, loading, error, execute } = useAsync<CryptoData[]>(
        () => CryptoService.getTopCryptos(30),
        []
    );

    useInterval(() => { execute(); }, 60000);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await execute();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const toggleWatchlist = (id: string) => {
        setWatchlist(watchlist.includes(id) ? watchlist.filter(w => w !== id) : [...watchlist, id]);
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
        <button onClick={() => handleSort(field)} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.35rem 0.5rem', background: sortField === field ? 'var(--primary)' : 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: sortField === field ? 'white' : 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer' }}>
            {label} {sortField === field && <ArrowUpDown size={10} style={{ transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none' }} />}
        </button>
    );

    return (
        <div className={styles.appContainer}>
            {stats && (
                <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className={styles.statItem}><DollarSign size={14} color="var(--primary)" /><span className={styles.statValue} style={{ fontSize: '0.85rem' }}>{formatMCap(stats.totalMCap)}</span><span className={styles.statLabel}>Total MCap</span></div>
                    <div className={styles.statItem}><TrendingUp size={14} color="var(--accent-green)" /><span className={styles.statValue} style={{ fontSize: '0.85rem' }}>{stats.gainers}/{cryptos?.length}</span><span className={styles.statLabel}>Gainers</span></div>
                    <div className={styles.statItem}><Activity size={14} color={stats.avgChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'} /><span className={styles.statValue} style={{ fontSize: '0.85rem', color: stats.avgChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%</span><span className={styles.statLabel}>Avg 24h</span></div>
                </div>
            )}

            <div className={styles.cryptoHeader}>
                <div className={styles.searchWrapper} style={{ flex: 1 }}><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className={styles.searchInput} style={{ paddingLeft: '1rem' }} /></div>
                <button onClick={() => setShowWatchlistOnly(!showWatchlistOnly)} className={styles.refreshBtn} style={{ background: showWatchlistOnly ? 'var(--gradient-primary)' : undefined, color: showWatchlistOnly ? 'white' : undefined, borderColor: showWatchlistOnly ? 'transparent' : undefined }}><Star size={18} fill={showWatchlistOnly ? 'currentColor' : 'none'} /></button>
                <button onClick={handleRefresh} className={`${styles.refreshBtn} ${isRefreshing ? styles.spinning : ''}`}><RefreshCw size={18} /></button>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', alignSelf: 'center' }}>Sort:</span>
                <SortBtn field="rank" label="Rank" /><SortBtn field="price" label="Price" /><SortBtn field="change_24h" label="24h" /><SortBtn field="market_cap" label="MCap" />
            </div>

            {loading && !cryptos ? (
                <div className={styles.loading}><div className={styles.spinner} /><p>Loading...</p></div>
            ) : error ? (
                <div className={styles.error}><div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div><p>Failed to load</p><button onClick={execute} className={styles.actionBtn}><RefreshCw size={14} /> Retry</button></div>
            ) : (
                <>
                    <div className={styles.cryptoList}>
                        {filteredCryptos.map((c) => (
                            <div key={c.id} className={styles.cryptoItem} style={{ borderColor: watchlist.includes(c.id) ? 'var(--primary)' : undefined }}>
                                <button onClick={() => toggleWatchlist(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: watchlist.includes(c.id) ? 'var(--accent-yellow)' : 'var(--text-tertiary)' }}><Star size={14} fill={watchlist.includes(c.id) ? 'currentColor' : 'none'} /></button>
                                <span className={styles.cryptoRank}>#{c.market_cap_rank}</span>
                                <img src={c.image} alt={c.name} className={styles.cryptoLogo} loading="lazy" />
                                <div className={styles.cryptoInfo}><span className={styles.cryptoName}>{c.name}</span><span className={styles.cryptoSymbol}>{c.symbol}</span></div>
                                <div style={{ width: '50px', height: '20px', borderRadius: '4px', overflow: 'hidden', background: c.price_change_percentage_24h >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                                    <svg width="50" height="20" viewBox="0 0 50 20"><path d={c.price_change_percentage_24h >= 0 ? 'M0,15 L12,12 L25,8 L38,10 L50,5' : 'M0,5 L12,8 L25,12 L38,10 L50,15'} fill="none" stroke={c.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="1.5" /></svg>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: '60px' }}><span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>MCap</span><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>{formatMCap(c.market_cap)}</span></div>
                                <div className={styles.cryptoPrice}><span className={styles.priceValue}>{formatPrice(c.current_price)}</span><span className={`${styles.priceChange} ${c.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}`}>{c.price_change_percentage_24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{Math.abs(c.price_change_percentage_24h).toFixed(2)}%</span></div>
                            </div>
                        ))}
                    </div>
                    {filteredCryptos.length === 0 && <div className={styles.emptyState}><div className={styles.emptyIcon}>{showWatchlistOnly ? <Star size={36} color="var(--primary)" /> : <Search size={36} color="var(--primary)" />}</div><p>{showWatchlistOnly ? 'Empty watchlist' : 'No results'}</p></div>}
                    <div className={styles.footer}>Showing {filteredCryptos.length} of {cryptos?.length || 0} • {watchlist.length} watchlisted</div>
                </>
            )}
        </div>
    );
}
