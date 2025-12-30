'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Sparkles, RotateCcw, MessageCircle } from 'lucide-react';

const ANSWERS = [
    // Positive
    { text: 'It is certain', type: 'positive' },
    { text: 'It is decidedly so', type: 'positive' },
    { text: 'Without a doubt', type: 'positive' },
    { text: 'Yes definitely', type: 'positive' },
    { text: 'You may rely on it', type: 'positive' },
    { text: 'As I see it, yes', type: 'positive' },
    { text: 'Most likely', type: 'positive' },
    { text: 'Outlook good', type: 'positive' },
    { text: 'Yes', type: 'positive' },
    { text: 'Signs point to yes', type: 'positive' },
    // Neutral
    { text: 'Reply hazy, try again', type: 'neutral' },
    { text: 'Ask again later', type: 'neutral' },
    { text: 'Better not tell you now', type: 'neutral' },
    { text: 'Cannot predict now', type: 'neutral' },
    { text: 'Concentrate and ask again', type: 'neutral' },
    // Negative
    { text: "Don't count on it", type: 'negative' },
    { text: 'My reply is no', type: 'negative' },
    { text: 'My sources say no', type: 'negative' },
    { text: 'Outlook not so good', type: 'negative' },
    { text: 'Very doubtful', type: 'negative' },
];

export default function Magic8BallApp() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<{ text: string; type: string } | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

    const askQuestion = () => {
        if (!question.trim() || isShaking) return;

        setIsShaking(true);
        setAnswer(null);

        setTimeout(() => {
            const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
            setAnswer(randomAnswer);
            setHistory(prev => [{ q: question, a: randomAnswer.text }, ...prev.slice(0, 4)]);
            setIsShaking(false);
        }, 1500);
    };

    const reset = () => {
        setQuestion('');
        setAnswer(null);
    };

    const getAnswerColor = () => {
        if (!answer) return 'white';
        if (answer.type === 'positive') return '#22c55e';
        if (answer.type === 'negative') return '#ef4444';
        return '#f59e0b';
    };

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)' }}>
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2>Magic 8 Ball</h2>
                    <p>Ask and you shall receive</p>
                </div>
            </div>

            {/* Question Input */}
            <div className={styles.formGroup}>
                <label>Ask a yes/no question...</label>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                    placeholder="Will I have good luck today?"
                    className={styles.input}
                    maxLength={100}
                />
            </div>

            {/* 8 Ball */}
            <div className={styles.flexCenter} style={{ padding: '1.5rem 0' }}>
                <div
                    onClick={askQuestion}
                    style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1e1b4b, #0f0826)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 -10px 30px rgba(255,255,255,0.05)',
                        animation: isShaking ? 'shake8ball 0.1s infinite' : 'none',
                        position: 'relative',
                    }}
                >
                    {/* Inner circle */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: isShaking
                            ? 'linear-gradient(135deg, #312e81, #1e1b4b)'
                            : 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1)',
                        padding: '0.75rem',
                        textAlign: 'center',
                    }}>
                        {isShaking ? (
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.3)',
                            }} />
                        ) : answer ? (
                            <span style={{
                                color: getAnswerColor(),
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                lineHeight: 1.3,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                {answer.text}
                            </span>
                        ) : (
                            <span style={{
                                color: 'white',
                                fontSize: '2rem',
                                fontWeight: 800,
                            }}>
                                8
                            </span>
                        )}
                    </div>

                    {/* Shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: '15%',
                        left: '20%',
                        width: '40px',
                        height: '20px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent)',
                        borderRadius: '50%',
                        transform: 'rotate(-30deg)',
                    }} />
                </div>
            </div>

            <p style={{
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
            }}>
                {isShaking ? '🔮 Consulting the spirits...' : 'Tap the ball or press Enter'}
            </p>

            {/* Actions */}
            <div className={styles.buttonGroup}>
                <button
                    onClick={askQuestion}
                    className={styles.primaryButton}
                    style={{ flex: 1 }}
                    disabled={!question.trim() || isShaking}
                >
                    <MessageCircle size={18} /> Ask the Ball
                </button>
                {answer && (
                    <button onClick={reset} className={styles.secondaryButton}>
                        <RotateCcw size={18} />
                    </button>
                )}
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Recent Questions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {history.map((item, i) => (
                            <div key={i} style={{
                                padding: '0.75rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '10px',
                            }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    Q: {item.q}
                                </p>
                                <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    A: {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info */}
            <div className={styles.infoBox}>
                🎱 The Magic 8 Ball knows all! Ask any yes/no question and receive mystical guidance.
            </div>

            <style jsx>{`
                @keyframes shake8ball {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-5px, 2px) rotate(-2deg); }
                    50% { transform: translate(5px, -2px) rotate(2deg); }
                    75% { transform: translate(-3px, 3px) rotate(-1deg); }
                }
            `}</style>
        </div>
    );
}
