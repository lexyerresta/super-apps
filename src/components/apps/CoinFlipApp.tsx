'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Coins, RotateCcw, Sparkles } from 'lucide-react';

export default function CoinFlipApp() {
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [history, setHistory] = useState<('heads' | 'tails')[]>([]);
    const [stats, setStats] = useState({ heads: 0, tails: 0 });

    const flipCoin = () => {
        if (isFlipping) return;

        setIsFlipping(true);
        setResult(null);

        // Animate for 1 second
        setTimeout(() => {
            const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
            setResult(outcome);
            setHistory(prev => [outcome, ...prev.slice(0, 9)]);
            setStats(prev => ({
                ...prev,
                [outcome]: prev[outcome] + 1
            }));
            setIsFlipping(false);
        }, 1000);
    };

    const reset = () => {
        setResult(null);
        setHistory([]);
        setStats({ heads: 0, tails: 0 });
    };

    const total = stats.heads + stats.tails;
    const headsPercent = total > 0 ? ((stats.heads / total) * 100).toFixed(1) : 0;
    const tailsPercent = total > 0 ? ((stats.tails / total) * 100).toFixed(1) : 0;

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                    <Coins size={24} />
                </div>
                <div>
                    <h2>Coin Flip</h2>
                    <p>Let fate decide for you</p>
                </div>
            </div>

            {/* Coin Display */}
            <div className={styles.flexCenter} style={{ padding: '2rem 0' }}>
                <div
                    onClick={flipCoin}
                    style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        background: result === 'heads'
                            ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                            : result === 'tails'
                                ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                                : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: isFlipping
                            ? '0 0 40px rgba(251, 191, 36, 0.5)'
                            : '0 8px 32px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease',
                        animation: isFlipping ? 'spin 0.2s linear infinite' : 'none',
                        border: '4px solid rgba(255,255,255,0.3)',
                    }}
                >
                    {isFlipping ? (
                        <Sparkles size={48} color="white" style={{ animation: 'pulse 0.3s infinite' }} />
                    ) : result ? (
                        <>
                            <span style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: 'white',
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}>
                                {result === 'heads' ? '👑' : '🦅'}
                            </span>
                            <span style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'white',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                            }}>
                                {result}
                            </span>
                        </>
                    ) : (
                        <>
                            <Coins size={48} color="#64748b" />
                            <span style={{
                                fontSize: '0.8rem',
                                color: '#64748b',
                                marginTop: '0.5rem',
                            }}>
                                Tap to flip
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Stats */}
            {total > 0 && (
                <div className={styles.detailsGrid}>
                    <div className={`${styles.detailCard} ${styles.highlight}`}>
                        <p className={styles.detailCardLabel}>👑 Heads</p>
                        <p className={styles.detailCardValue}>{stats.heads}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{headsPercent}%</p>
                    </div>
                    <div className={styles.detailCard}>
                        <p className={styles.detailCardLabel}>🦅 Tails</p>
                        <p className={styles.detailCardValue}>{stats.tails}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tailsPercent}%</p>
                    </div>
                </div>
            )}

            {/* History */}
            {history.length > 0 && (
                <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Recent Flips</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {history.map((flip, i) => (
                            <span
                                key={i}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    background: flip === 'heads'
                                        ? 'rgba(251, 191, 36, 0.2)'
                                        : 'rgba(100, 116, 139, 0.2)',
                                    color: flip === 'heads' ? '#f59e0b' : '#64748b',
                                }}
                            >
                                {flip === 'heads' ? '👑' : '🦅'} {flip}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className={styles.buttonGroup}>
                <button onClick={flipCoin} className={styles.primaryButton} style={{ flex: 1 }} disabled={isFlipping}>
                    <Coins size={18} /> Flip Coin
                </button>
                {total > 0 && (
                    <button onClick={reset} className={styles.secondaryButton}>
                        <RotateCcw size={18} /> Reset
                    </button>
                )}
            </div>

            {/* Info */}
            <div className={styles.infoBox}>
                🎲 Each flip is completely random - true 50/50 odds!
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }
            `}</style>
        </div>
    );
}
