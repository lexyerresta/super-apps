'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { Lightbulb, RefreshCw, Copy, Check, AlertCircle, Share2, Heart, Bookmark, Quote, Sparkles } from 'lucide-react';

interface Advice {
    slip: { id: number; advice: string; };
}

interface SavedAdvice {
    id: number;
    advice: string;
    savedAt: string;
}

export default function AdviceApp() {
    const [copied, setCopied] = useState(false);
    const [favorites, setFavorites] = useState<SavedAdvice[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('advice-favorites');
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    const { data, loading, error, execute } = useAsync<Advice>(
        () => httpClient<Advice>('https://api.adviceslip.com/advice', { cache: 'no-store' }),
        []
    );

    const advice = data?.slip?.advice;
    const adviceId = data?.slip?.id;

    // Typing effect
    useEffect(() => {
        if (advice && !loading) {
            setDisplayedText('');
            setIsTyping(true);
            let i = 0;
            const timer = setInterval(() => {
                if (i < advice.length) {
                    setDisplayedText(advice.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(timer);
                    setIsTyping(false);
                }
            }, 25);
            return () => clearInterval(timer);
        }
    }, [advice, loading]);

    const copyAdvice = async () => {
        if (advice) {
            await navigator.clipboard.writeText(advice);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareAdvice = async () => {
        if (advice && navigator.share) {
            try { await navigator.share({ title: 'Life Advice', text: advice }); }
            catch (err) { console.error('Share failed:', err); }
        }
    };

    const toggleFavorite = () => {
        if (!adviceId || !advice) return;
        const exists = favorites.find(f => f.id === adviceId);
        let newFavs: SavedAdvice[];
        if (exists) {
            newFavs = favorites.filter(f => f.id !== adviceId);
        } else {
            newFavs = [{ id: adviceId, advice, savedAt: new Date().toISOString() }, ...favorites];
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 1500);
        }
        setFavorites(newFavs);
        localStorage.setItem('advice-favorites', JSON.stringify(newFavs));
    };

    const isFavorite = adviceId ? favorites.some(f => f.id === adviceId) : false;

    const removeFavorite = (id: number) => {
        const newFavs = favorites.filter(f => f.id !== id);
        setFavorites(newFavs);
        localStorage.setItem('advice-favorites', JSON.stringify(newFavs));
    };

    const gradients = [
        'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'linear-gradient(135deg, #ec4899, #f472b6)',
        'linear-gradient(135deg, #06b6d4, #22d3ee)',
        'linear-gradient(135deg, #22c55e, #4ade80)',
        'linear-gradient(135deg, #f59e0b, #fbbf24)',
    ];
    const gradient = gradients[Math.abs((adviceId || 0) % gradients.length)];

    return (
        <div className={styles.appContainer}>
            {/* Header Tabs */}
            <div className={styles.tabs} style={{ marginBottom: '1rem' }}>
                <button onClick={() => setShowFavorites(false)} className={`${styles.tabBtn} ${!showFavorites ? styles.active : ''}`}>
                    <Lightbulb size={14} /> Get Advice
                </button>
                <button onClick={() => setShowFavorites(true)} className={`${styles.tabBtn} ${showFavorites ? styles.active : ''}`} style={{ position: 'relative' }}>
                    <Bookmark size={14} /> Saved ({favorites.length})
                </button>
            </div>

            {showFavorites ? (
                favorites.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}><Bookmark size={36} color="var(--primary)" /></div>
                        <p>No saved advice yet</p>
                        <p className={styles.emptyHint}>Save your favorite wisdom!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {favorites.map((fav, i) => (
                            <div key={fav.id} style={{
                                background: 'var(--bg-tertiary)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                border: '1px solid var(--glass-border)',
                                position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: gradients[i % gradients.length], borderRadius: '16px 16px 0 0' }} />
                                <Quote size={16} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                                <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                                    "{fav.advice}"
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                        Saved {new Date(fav.savedAt).toLocaleDateString()}
                                    </span>
                                    <button onClick={() => removeFavorite(fav.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <>
                    {loading ? (
                        <div className={styles.loading}><div className={styles.spinner} /><p>Getting wisdom...</p></div>
                    ) : error ? (
                        <div className={styles.error}>
                            <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                            <p>Failed to get advice</p>
                            <button onClick={execute} className={styles.actionBtn}><RefreshCw size={14} /> Try Again</button>
                        </div>
                    ) : advice ? (
                        <>
                            {/* Success Toast */}
                            {justSaved && (
                                <div style={{
                                    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, #22c55e, #10b981)', color: 'white',
                                    padding: '0.75rem 1.5rem', borderRadius: '50px',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
                                    zIndex: 1000, animation: 'slideUp 0.3s ease',
                                }}>
                                    <Check size={18} /> Saved!
                                </div>
                            )}

                            <div style={{
                                background: `${gradient.replace('linear-gradient(135deg,', 'linear-gradient(135deg, ').split(',')[0].replace('linear-gradient(135deg, ', '')}10`,
                                border: `1px solid ${gradient.replace('linear-gradient(135deg,', 'linear-gradient(135deg, ').split(',')[0].replace('linear-gradient(135deg, ', '')}30`,
                                borderRadius: '24px',
                                padding: '2.5rem 2rem',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                {/* Floating particles */}
                                <div style={{ position: 'absolute', top: '10%', left: '10%', opacity: 0.15 }}>
                                    <Sparkles size={24} color="var(--primary)" />
                                </div>
                                <div style={{ position: 'absolute', bottom: '15%', right: '8%', opacity: 0.1 }}>
                                    <Quote size={40} color="var(--primary)" />
                                </div>

                                <div style={{
                                    width: '80px', height: '80px',
                                    background: gradient,
                                    borderRadius: '24px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: `0 15px 40px ${gradient.includes('#6366f1') ? 'rgba(99,102,241,0.35)' : 'rgba(236,72,153,0.35)'}`,
                                    animation: 'pulse 2s ease infinite',
                                }}>
                                    <Lightbulb size={40} color="white" />
                                </div>

                                <div style={{
                                    fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)',
                                    textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem',
                                }}>
                                    Advice #{adviceId}
                                </div>

                                <p style={{
                                    fontSize: '1.35rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    lineHeight: 1.6,
                                    marginBottom: '2rem',
                                    maxWidth: '500px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    minHeight: '80px',
                                }}>
                                    "{displayedText}"
                                    {isTyping && <span style={{ animation: 'blink 0.7s infinite' }}>|</span>}
                                </p>

                                <div className={styles.actions}>
                                    <button onClick={execute} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ background: gradient }}>
                                        <RefreshCw size={16} /> New Advice
                                    </button>
                                    <button onClick={toggleFavorite} className={styles.actionBtn} style={{
                                        background: isFavorite ? 'rgba(236,72,153,0.1)' : undefined,
                                        borderColor: isFavorite ? '#ec4899' : undefined,
                                        color: isFavorite ? '#ec4899' : undefined,
                                    }}>
                                        <Heart size={16} fill={isFavorite ? '#ec4899' : 'transparent'} />
                                        {isFavorite ? 'Saved' : 'Save'}
                                    </button>
                                    <button onClick={copyAdvice} className={styles.actionBtn}>
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                                        <button onClick={shareAdvice} className={styles.actionBtn}>
                                            <Share2 size={16} /> Share
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : null}
                </>
            )}

            <style jsx>{`
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
            `}</style>
        </div>
    );
}
