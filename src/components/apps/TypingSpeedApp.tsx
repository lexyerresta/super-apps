'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { Keyboard, RotateCcw, Trophy, Timer, Target } from 'lucide-react';

const SAMPLE_TEXTS = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "The five boxing wizards jump quickly.",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
    "The job requires extra pluck and zeal from every young wage earner.",
    "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent.",
    "Crazy Frederick bought many very exquisite opal jewels.",
    "We promptly judged antique ivory buckles for the next prize.",
];

export default function TypingSpeedApp() {
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, time: 0 });
    const [bestWpm, setBestWpm] = useState(0);

    const generateNewText = useCallback(() => {
        const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
        setText(randomText);
        setUserInput('');
        setStartTime(null);
        setEndTime(null);
        setIsActive(false);
        setStats({ wpm: 0, accuracy: 0, time: 0 });
    }, []);

    useEffect(() => {
        generateNewText();
    }, [generateNewText]);

    useEffect(() => {
        // Load best WPM from localStorage
        const saved = localStorage.getItem('typing_best_wpm');
        if (saved) setBestWpm(parseInt(saved));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        // Start timer on first keystroke
        if (!startTime && value.length === 1) {
            setStartTime(Date.now());
            setIsActive(true);
        }

        setUserInput(value);

        // Check if completed
        if (value === text) {
            const end = Date.now();
            setEndTime(end);
            setIsActive(false);

            // Calculate stats
            const timeInMinutes = (end - (startTime || end)) / 60000;
            const timeInSeconds = (end - (startTime || end)) / 1000;
            const words = text.split(' ').length;
            const wpm = Math.round(words / timeInMinutes);

            // Calculate accuracy
            let correct = 0;
            for (let i = 0; i < text.length; i++) {
                if (value[i] === text[i]) correct++;
            }
            const accuracy = Math.round((correct / text.length) * 100);

            setStats({ wpm, accuracy, time: Math.round(timeInSeconds) });

            // Update best WPM
            if (wpm > bestWpm) {
                setBestWpm(wpm);
                localStorage.setItem('typing_best_wpm', wpm.toString());
            }
        }
    };

    const renderText = () => {
        return text.split('').map((char, index) => {
            let color = 'var(--text-tertiary)';
            let background = 'transparent';

            if (index < userInput.length) {
                if (userInput[index] === char) {
                    color = 'var(--accent-green)';
                } else {
                    color = 'white';
                    background = 'var(--accent-red)';
                }
            } else if (index === userInput.length) {
                background = 'var(--primary)';
                color = 'white';
            }

            return (
                <span
                    key={index}
                    style={{
                        color,
                        background,
                        padding: index === userInput.length ? '0 2px' : 0,
                        borderRadius: '2px',
                    }}
                >
                    {char}
                </span>
            );
        });
    };

    const progress = text ? (userInput.length / text.length) * 100 : 0;

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                    <Keyboard size={24} />
                </div>
                <div>
                    <h2>Typing Speed Test</h2>
                    <p>Test your typing skills!</p>
                </div>
            </div>

            {/* Best Score */}
            {bestWpm > 0 && (
                <div className={styles.flexBetween} style={{
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                    borderRadius: '12px',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Trophy size={16} style={{ display: 'inline', marginRight: '0.25rem', color: '#f59e0b' }} />
                        Personal Best
                    </span>
                    <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>{bestWpm} WPM</span>
                </div>
            )}

            {/* Text to Type */}
            <div style={{
                padding: '1.25rem',
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
            }}>
                {renderText()}
            </div>

            {/* Progress Bar */}
            <div style={{
                height: '6px',
                background: 'var(--bg-tertiary)',
                borderRadius: '3px',
                overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--primary)',
                    transition: 'width 0.1s ease',
                    borderRadius: '3px',
                }} />
            </div>

            {/* Input */}
            <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="Start typing here..."
                className={styles.textarea}
                style={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    letterSpacing: '0.5px',
                    minHeight: '80px',
                }}
                disabled={endTime !== null}
                autoFocus
            />

            {/* Results */}
            {endTime && (
                <div className={styles.resultCard}>
                    <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                        🎉 Test Complete!
                    </p>
                    <div className={styles.detailsGrid}>
                        <div className={`${styles.detailCard} ${styles.highlight}`}>
                            <Target size={20} style={{ marginBottom: '0.25rem' }} />
                            <p className={styles.detailCardLabel}>Speed</p>
                            <p className={styles.detailCardValue}>{stats.wpm} WPM</p>
                        </div>
                        <div className={styles.detailCard}>
                            <p className={styles.detailCardLabel}>Accuracy</p>
                            <p className={styles.detailCardValue}>{stats.accuracy}%</p>
                        </div>
                        <div className={styles.detailCard}>
                            <Timer size={20} style={{ marginBottom: '0.25rem' }} />
                            <p className={styles.detailCardLabel}>Time</p>
                            <p className={styles.detailCardValue}>{stats.time}s</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <button onClick={generateNewText} className={styles.primaryButton} style={{ width: '100%' }}>
                <RotateCcw size={18} /> {endTime ? 'Try Again' : 'New Text'}
            </button>

            {/* Info */}
            <div className={styles.infoBox}>
                ⌨️ Start typing to begin the test. Complete the text as fast as you can!
            </div>
        </div>
    );
}
