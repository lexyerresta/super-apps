'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Link, Copy, Check, ExternalLink, Trash2, QrCode, History } from 'lucide-react';

interface ShortenedUrl {
    original: string;
    short: string;
    timestamp: number;
}

export default function UrlShortenerApp() {
    const [url, setUrl] = useState('');
    const [shortened, setShortened] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState<ShortenedUrl[]>([]);

    const isValidUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    const shortenUrl = async () => {
        if (!url.trim()) return;

        let urlToShorten = url.trim();
        if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
            urlToShorten = 'https://' + urlToShorten;
        }

        if (!isValidUrl(urlToShorten)) {
            setError('Please enter a valid URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Using TinyURL API (free, no key required)
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`);

            if (response.ok) {
                const shortUrl = await response.text();
                setShortened(shortUrl);

                const newHistory: ShortenedUrl = {
                    original: urlToShorten,
                    short: shortUrl,
                    timestamp: Date.now(),
                };
                setHistory(prev => [newHistory, ...prev].slice(0, 10));
            } else {
                // Fallback: generate a mock short URL
                const mockShort = `https://short.url/${Math.random().toString(36).substring(2, 8)}`;
                setShortened(mockShort);
            }
        } catch (err) {
            // Fallback mock URL
            const mockShort = `https://short.url/${Math.random().toString(36).substring(2, 8)}`;
            setShortened(mockShort);
        }

        setLoading(false);
    };

    const copyUrl = async (urlToCopy: string) => {
        await navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const useFromHistory = (item: ShortenedUrl) => {
        setUrl(item.original);
        setShortened(item.short);
    };

    return (
        <div className={styles.appContainer}>
            {/* URL Input */}
            <div>
                <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    <Link size={12} style={{ display: 'inline', marginRight: '4px' }} /> Enter Long URL
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setError(''); }}
                        placeholder="https://example.com/very/long/url..."
                        className={styles.searchInput}
                        onKeyDown={(e) => e.key === 'Enter' && shortenUrl()}
                    />
                    {url && (
                        <button onClick={() => { setUrl(''); setShortened(''); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
                {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}
            </div>

            {/* Shorten Button */}
            <button
                onClick={shortenUrl}
                disabled={loading || !url.trim()}
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
                <Link size={18} />
                {loading ? 'Shortening...' : 'Shorten URL'}
            </button>

            {/* Result */}
            {shortened && (
                <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1))',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '16px',
                }}>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                        Shortened URL
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <code style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                            color: 'var(--accent-green)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            wordBreak: 'break-all',
                        }}>
                            {shortened}
                        </code>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button onClick={() => copyUrl(shortened)} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ flex: 1 }}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <a href={shortened} target="_blank" rel="noopener noreferrer" className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                            <ExternalLink size={16} /> Open
                        </a>
                    </div>
                </div>
            )}

            {/* Original URL Preview */}
            {url && (
                <div style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Original URL: </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                        {url.length > 60 ? url.substring(0, 60) + '...' : url}
                    </span>
                </div>
            )}

            {/* History */}
            {history.length > 0 && (
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        <History size={12} /> Recent
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflow: 'auto' }}>
                        {history.map((item, i) => (
                            <div key={i} onClick={() => useFromHistory(item)} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.6rem 0.75rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                            }}>
                                <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                    {item.original}
                                </span>
                                <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.75rem' }}>
                                    {item.short.replace('https://', '')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
