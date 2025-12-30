'use client';
import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { Shuffle, RotateCcw, CheckCircle } from 'lucide-react';

export default function WordScrambleApp() {
    const words = ['javascript', 'typescript', 'react', 'nextjs', 'programming', 'developer', 'computer', 'algorithm', 'database', 'frontend'];
    const [word, setWord] = useState('');
    const [scrambled, setScrambled] = useState('');
    const [guess, setGuess] = useState('');
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const scrambleWord = (w: string) => {
        return w.split('').sort(() => Math.random() - 0.5).join('');
    };

    const newGame = () => {
        const w = words[Math.floor(Math.random() * words.length)];
        setWord(w);
        setScrambled(scrambleWord(w));
        setGuess('');
        setWon(false);
        setAttempts(0);
    };

    useEffect(() => {
        newGame();
    }, []);

    const checkGuess = () => {
        setAttempts(attempts + 1);
        if (guess.toLowerCase() === word) {
            setWon(true);
        }
    };

    const hint = () => {
        setGuess(word[0]);
    };

    return (
        <div className={styles.appContainer}>
            {!won ? (
                <>
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Unscramble this word:
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5rem', marginBottom: '1rem' }}>
                            {scrambled.toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {word.length} letters • Attempts: {attempts}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
                            placeholder="Enter your guess" className={styles.input}
                            style={{ fontSize: '1.25rem', textAlign: 'center' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <button onClick={checkGuess} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                            <CheckCircle size={18} /> Check
                        </button>
                        <button onClick={hint} className={styles.actionBtn} style={{ background: 'var(--bg-secondary)' }}>
                            Hint (1st letter)
                        </button>
                    </div>
                </>
            ) : (
                <div style={{ padding: '3rem', background: 'linear-gradient(135deg, #10b981, #14b8a6)', borderRadius: '16px', textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Correct!</div>
                    <div style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '0.5rem' }}>{word.toUpperCase()}</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '2rem' }}>Attempts: {attempts}</div>
                    <button onClick={newGame} style={{
                        padding: '1rem 2rem', border: 'none', borderRadius: '12px',
                        background: 'white', color: '#10b981', fontWeight: '700',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                        <Shuffle size={18} /> New Word
                    </button>
                </div>
            )
            }
        </div >
    );
}
