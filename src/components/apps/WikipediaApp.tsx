'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Search, ExternalLink } from 'lucide-react';

export default function WikipediaApp() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const searchWikipedia = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=10`);
            const data = await response.json();
            setResults(data.query?.search || []);
        } catch (error) {
            console.error('Failed to search Wikipedia:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchWikipedia()} placeholder="Search Wikipedia..." className={styles.input} style={{ fontSize: '1.125rem' }} />
            </div>

            <button onClick={searchWikipedia} disabled={loading || !query} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Search size={18} /> {loading ? 'Searching...' : 'Search Wikipedia'}
            </button>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {results.map((result) => (
                    <div key={result.pageid} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', cursor: 'pointer' }} onClick={() => window.open(`https://en.wikipedia.org/?curid=${result.pageid}`, '_blank')}>
                        <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                            {result.title}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: result.snippet + '...' }} />
                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '500' }}>
                            Read on Wikipedia <ExternalLink size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
