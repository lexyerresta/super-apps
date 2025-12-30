'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Dices, Copy, Check, RefreshCw, Plus, Trash2, History } from 'lucide-react';

export default function RandomNumberApp() {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [count, setCount] = useState(1);
    const [results, setResults] = useState<number[]>([]);
    const [history, setHistory] = useState<number[][]>([]);
    const [copied, setCopied] = useState(false);
    const [isRolling, setIsRolling] = useState(false);

    const generate = () => {
        setIsRolling(true);
        setTimeout(() => {
            const nums = Array.from({ length: count }, () =>
                Math.floor(Math.random() * (max - min + 1)) + min
            );
            setResults(nums);
            setHistory(prev => [nums, ...prev].slice(0, 10));
            setIsRolling(false);
        }, 300);
    };

    const copyResults = async () => {
        await navigator.clipboard.writeText(results.join(', '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const presets = [
        { label: 'Coin', min: 0, max: 1, count: 1 },
        { label: 'Dice', min: 1, max: 6, count: 1 },
        { label: 'D20', min: 1, max: 20, count: 1 },
        { label: '1-100', min: 1, max: 100, count: 1 },
        { label: 'Lottery', min: 1, max: 49, count: 6 },
    ];

    return (
        <div className={styles.appContainer}>
            {/* Result Display */}
            <div style={{
                padding: '2rem',
                background: 'var(--gradient-primary)',
                borderRadius: '20px',
                textAlign: 'center',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
            }}>
                {results.length === 0 ? (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                        Click Generate to start
                    </span>
                ) : (
                    results.map((num, i) => (
                        <div key={i} style={{
                            width: '60px', height: '60px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: 'white',
                            animation: isRolling ? 'pulse 0.3s ease-in-out' : 'none',
                        }}>
                            {num}
                        </div>
                    ))
                )}
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {presets.map((p) => (
                    <button
                        key={p.label}
                        onClick={() => { setMin(p.min); setMax(p.max); setCount(p.count); }}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Settings */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Min</label>
                    <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value) || 0)} className={styles.searchInput} />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Max</label>
                    <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value) || 100)} className={styles.searchInput} />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Count</label>
                    <input type="number" min="1" max="20" value={count} onChange={(e) => setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))} className={styles.searchInput} />
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button onClick={generate} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    <Dices size={16} className={isRolling ? 'animate-spin' : ''} /> Generate
                </button>
                <button onClick={copyResults} className={styles.actionBtn} disabled={results.length === 0}>
                    {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        <History size={12} style={{ display: 'inline', marginRight: '4px' }} /> Recent
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {history.slice(1, 6).map((nums, i) => (
                            <div key={i} style={{ padding: '0.4rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {nums.join(', ')}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
