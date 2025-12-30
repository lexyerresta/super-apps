'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Package, Search, ExternalLink } from 'lucide-react';

export default function NPMSearchApp() {
    const [query, setQuery] = useState('');
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const searchPackages = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=20`);
            const data = await response.json();
            setPackages(data.objects || []);
        } catch (error) {
            console.error('Failed to search NPM:', error);
            setPackages([]);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchPackages()} placeholder="Search NPM packages..." className={styles.input} style={{ fontSize: '1.125rem' }} />
            </div>

            <button onClick={searchPackages} disabled={loading || !query} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Search size={18} /> {loading ? 'Searching...' : 'Search NPM'}
            </button>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {packages.map((pkg) => {
                    const p = pkg.package;
                    return (
                        <div key={p.name} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
                                <Package size={24} color="var(--primary)" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                                        {p.name}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                                        {p.description}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                                        <div style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                                            v{p.version}
                                        </div>
                                        {p.keywords && p.keywords.slice(0, 3).map((keyword: string) => (
                                            <div key={keyword} style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                                                {keyword}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div>⬇️ {formatNumber(pkg.score?.detail?.popularity * 1000000 || 0)} downloads</div>
                                <div>📦 {p.publisher?.username || 'Unknown'}</div>
                                <button onClick={() => window.open(`https://www.npmjs.com/package/${p.name}`, '_blank')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}>
                                    NPM <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
