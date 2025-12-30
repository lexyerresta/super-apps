'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { useAsync, useLocalStorage } from '@/hooks';
import { QuotesService } from '@/services/api.service';
import type { Quote } from '@/types';
import { Quote as QuoteIcon, RefreshCw, Save, Copy, Check, Trash2, Share2, Search, Download, Palette, Sparkles } from 'lucide-react';

const bgGradients = [
    'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))',
    'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.08))',
    'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.08))',
    'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.08))',
    'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(59, 130, 246, 0.08))',
];

const borderColors = [
    'rgba(99, 102, 241, 0.2)',
    'rgba(236, 72, 153, 0.2)',
    'rgba(34, 197, 94, 0.2)',
    'rgba(245, 158, 11, 0.2)',
    'rgba(6, 182, 212, 0.2)',
];

export default function QuotesApp() {
    const [showSaved, setShowSaved] = useState(false);
    const [savedQuotes, setSavedQuotes] = useLocalStorage<Quote[]>('saved_quotes', []);
    const [copied, setCopied] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bgIndex, setBgIndex] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const { data: quote, loading, execute } = useAsync<Quote>(
        () => QuotesService.getRandomQuote(),
        []
    );

    const saveQuote = () => {
        if (quote && !savedQuotes.find(q => q.content === quote.content)) {
            setSavedQuotes([{ ...quote, savedAt: Date.now() } as Quote, ...savedQuotes]);
        }
    };

    const removeQuote = (index: number) => {
        setSavedQuotes(savedQuotes.filter((_, i) => i !== index));
    };

    const copyToClipboard = async () => {
        if (quote) {
            await navigator.clipboard.writeText(`"${quote.content}" - ${quote.author}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareToTwitter = () => {
        if (quote) {
            const text = encodeURIComponent(`"${quote.content}" - ${quote.author}`);
            window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
        }
    };

    const shareToWhatsApp = () => {
        if (quote) {
            const text = encodeURIComponent(`"${quote.content}" - ${quote.author}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        }
    };

    const cycleBg = () => {
        setBgIndex((bgIndex + 1) % bgGradients.length);
    };

    const filteredSavedQuotes = useMemo(() => {
        if (!searchTerm) return savedQuotes;
        return savedQuotes.filter(q =>
            q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [savedQuotes, searchTerm]);

    const isSaved = quote && savedQuotes.find(q => q.content === quote.content);

    return (
        <div className={styles.appContainer}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${!showSaved ? styles.active : ''}`}
                    onClick={() => setShowSaved(false)}
                >
                    <Sparkles size={14} /> Daily Quote
                </button>
                <button
                    className={`${styles.tabBtn} ${showSaved ? styles.active : ''}`}
                    onClick={() => setShowSaved(true)}
                >
                    <Save size={14} /> Saved ({savedQuotes.length})
                </button>
            </div>

            {!showSaved ? (
                <>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>Finding inspiration...</p>
                        </div>
                    ) : quote ? (
                        <div
                            className={styles.quoteCard}
                            style={{
                                background: bgGradients[bgIndex],
                                borderColor: borderColors[bgIndex],
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className={styles.quoteIcon}>
                                    <QuoteIcon size={28} color="white" />
                                </div>
                                <button
                                    onClick={cycleBg}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                    title="Change background"
                                >
                                    <Palette size={14} />
                                </button>
                            </div>

                            <p className={styles.quoteText}>{quote.content}</p>
                            <p className={styles.quoteAuthor}>— {quote.author}</p>

                            <div className={styles.actions} style={{ position: 'relative' }}>
                                <button onClick={execute} className={styles.actionBtn}>
                                    <RefreshCw size={16} /> New
                                </button>
                                <button
                                    onClick={saveQuote}
                                    className={`${styles.actionBtn} ${isSaved ? styles.successBtn : ''}`}
                                    disabled={!!isSaved}
                                >
                                    <Save size={16} /> {isSaved ? 'Saved' : 'Save'}
                                </button>
                                <button onClick={copyToClipboard} className={styles.actionBtn}>
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                    >
                                        <Share2 size={16} /> Share
                                    </button>
                                    {showShareMenu && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '0.5rem',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '10px',
                                            padding: '0.5rem',
                                            zIndex: 10,
                                            minWidth: '120px',
                                            boxShadow: 'var(--shadow-lg)',
                                        }}>
                                            <button
                                                onClick={shareToTwitter}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem 0.75rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                🐦 Twitter
                                            </button>
                                            <button
                                                onClick={shareToWhatsApp}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem 0.75rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                💬 WhatsApp
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </>
            ) : (
                <div>
                    {/* Search in saved quotes */}
                    <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-tertiary)',
                            }} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search saved quotes..."
                                className={styles.searchInput}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    {savedQuotes.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Save size={36} color="var(--primary)" />
                            </div>
                            <p>No saved quotes yet</p>
                            <p className={styles.emptyHint}>Save your favorites to see them here</p>
                        </div>
                    ) : filteredSavedQuotes.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Search size={36} color="var(--primary)" />
                            </div>
                            <p>No quotes match your search</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredSavedQuotes.map((q, index) => (
                                <div
                                    key={index}
                                    className={styles.listItem}
                                    style={{
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                                        "{q.content}"
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <p style={{ color: 'var(--primary)', margin: 0, fontSize: '0.8rem', fontWeight: 500 }}>
                                            — {q.author}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={async () => {
                                                    await navigator.clipboard.writeText(`"${q.content}" - ${q.author}`);
                                                }}
                                                style={{
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                                    borderRadius: '8px',
                                                    padding: '0.5rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--primary)',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeQuote(index)}
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    borderRadius: '8px',
                                                    padding: '0.5rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--accent-red)',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {savedQuotes.length > 0 && (
                        <div className={styles.footer}>
                            {filteredSavedQuotes.length} of {savedQuotes.length} quotes
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
