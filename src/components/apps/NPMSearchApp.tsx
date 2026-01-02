'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { Package, Search, ExternalLink, RefreshCw, Layers, Calendar, User, Download, Tag } from 'lucide-react';
import { useDebounce } from '@/hooks';

export default function NPMSearchApp() {
    const [query, setQuery] = useState('');
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    // Auto-search logic
    const debouncedQuery = useDebounce(query, 500);
    // Initial popular packages
    const popularQuery = 'react';

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setOffset(prev => prev + 20);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Fetch popular on init
    useEffect(() => {
        if (!query) {
            fetchPackages(popularQuery, 0, true);
        }
    }, []);

    // Fetch on query change
    useEffect(() => {
        if (debouncedQuery) {
            fetchPackages(debouncedQuery, 0, true);
        } else if (query === '') {
            fetchPackages(popularQuery, 0, true);
        }
    }, [debouncedQuery]);

    // Fetch on offset change (infinite scroll)
    useEffect(() => {
        if (offset > 0) {
            const q = query || popularQuery;
            fetchPackages(q, offset, false);
        }
    }, [offset]);

    const fetchPackages = async (searchQuery: string, currentOffset: number, isNewSearch: boolean) => {
        if (isNewSearch) {
            setLoading(true);
            setOffset(0);
        }

        try {
            const size = 20;
            const res = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(searchQuery)}&size=${size}&from=${currentOffset}`);
            const data = await res.json();

            const newPackages = data.objects || [];
            setTotal(data.total);

            if (isNewSearch) {
                setPackages(newPackages);
            } else {
                setPackages(prev => [...prev, ...newPackages]);
            }

            setHasMore(newPackages.length === size);
        } catch (error) {
            console.error('NPM fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        if (!num) return '0';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return num.toString();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className={styles.appContainer} style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ flexShrink: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#CB3837', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(203, 56, 55, 0.3)' }}>
                        <Package size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>NPM Search</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Find packages, libraries & tools</p>
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search packages (e.g., react, axios)..."
                        style={{
                            width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem',
                            background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                            borderRadius: '12px', fontSize: '1rem', outline: 'none',
                            color: 'var(--text-primary)', transition: 'border-color 0.2s',
                            fontWeight: 500
                        }}
                    />
                    {loading && (
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                            <RefreshCw size={16} className={styles.spinning} style={{ color: 'var(--primary)' }} />
                        </div>
                    )}
                </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {packages.map((pkg, index) => {
                    const p = pkg.package;
                    const isLast = index === packages.length - 1;

                    return (
                        <div
                            key={`${p.name}-${index}`}
                            ref={isLast ? lastElementRef : null}
                            style={{
                                padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '16px',
                                border: '1px solid var(--glass-border)', transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.75rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {p.name}
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>v{p.version}</span>
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{p.description}</p>
                                </div>
                                <button
                                    onClick={() => window.open(p.links.npm, '_blank')}
                                    style={{
                                        padding: '0.4rem', border: 'none', background: 'var(--bg-tertiary)',
                                        borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)',
                                        transition: 'background 0.2s'
                                    }}
                                    title="View on NPM"
                                >
                                    <ExternalLink size={18} />
                                </button>
                            </div>

                            {/* Keywords chips */}
                            {p.keywords && p.keywords.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {p.keywords.slice(0, 4).map((k: string) => (
                                        <span key={k} style={{
                                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px',
                                            background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)',
                                            display: 'flex', alignItems: 'center', gap: '3px'
                                        }}>
                                            <Tag size={10} /> {k}
                                        </span>
                                    ))}
                                    {p.keywords.length > 4 && <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>+{p.keywords.length - 4}</span>}
                                </div>
                            )}

                            {/* Footer Stats */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.75rem',
                                borderTop: '1px solid var(--glass-border)', fontSize: '0.75rem', color: 'var(--text-tertiary)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Layers size={14} /> Score: {(pkg.score.final * 100).toFixed(0)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <User size={14} /> {p.publisher?.username}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                                    <Calendar size={14} /> {formatDate(p.date)}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {loading && packages.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-tertiary)' }}>
                        Loading more...
                    </div>
                )}

                {!loading && packages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                        <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No packages found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
