'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Target, RotateCcw } from 'lucide-react';

export default function NumberGuessingApp() {
    const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState<number[]>([]);
    const [won, setWon] = useState(false);

    const makeGuess = () => {
        const g = parseInt(guess);
        if (isNaN(g) || g < 1 || g > 100) return;

        setAttempts([...attempts, g]);
        if (g === target) {
            setWon(true);
        }
        setGuess('');
    };

    const reset = () => {
        setTarget(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setAttempts([]);
        setWon(false);
    };

    const getHint = () => {
        if (attempts.length === 0) return 'Make your first guess!';
        const last = attempts[attempts.length - 1];
        if (last === target) return '🎉 Correct!';
        if (Math.abs(last - target) <= 5) return '🔥 Very close!';
        if (Math.abs(last - target) <= 10) return '😊 Close!';
        return last < target ? '⬆️ Higher!' : '⬇️ Lower!';
    };

    return (
        <div className={styles.appContainer}>
            {!won ? (
                <>
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                        <Target size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Guess the number (1-100)
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Attempts: {attempts.length}
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary)', marginTop: '1rem' }}>
                            {getHint()}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && makeGuess()}
                            placeholder="Enter your guess" className={styles.input}
                            style={{ fontSize: '1.5rem', textAlign: 'center' }} min="1" max="100" />
                    </div>

                    <button onClick={makeGuess} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1rem' }}>
                        Guess
                    </button>

                    {attempts.length > 0 && (
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Previous Guesses:</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {attempts.map((a, i) => (
                                    <span key={i} style={{
                                        padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)',
                                        borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600'
                                    }}>
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div style={{
                    padding: '3rem', background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                    borderRadius: '16px', textAlign: 'center', color: 'white'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        You Won!
                    </div>
                    <div style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                        The number was {target}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '2rem' }}>
                        Attempts: {attempts.length}
                    </div>
                    <button onClick={reset} style={{
                        padding: '1rem 2rem', border: 'none', borderRadius: '12px',
                        background: 'white', color: '#10b981', fontWeight: '700',
                        cursor: 'pointer', fontSize: '1rem', display: 'inline-flex',
                        alignItems: 'center', gap: '0.5rem'
                    }}>
                        <RotateCcw size={18} /> Play Again
                    </button>
                </div>
            )}
        </div>
    );
}
