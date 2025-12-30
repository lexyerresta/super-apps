'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Swords, RotateCcw, Trophy, User, Bot } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw';

const CHOICES: { id: Choice; emoji: string; label: string }[] = [
    { id: 'rock', emoji: '🪨', label: 'Rock' },
    { id: 'paper', emoji: '📄', label: 'Paper' },
    { id: 'scissors', emoji: '✂️', label: 'Scissors' },
];

const WINNING_MOVES: Record<Choice, Choice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
};

export default function RockPaperScissorsApp() {
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    const play = (choice: Choice) => {
        if (isPlaying) return;

        setIsPlaying(true);
        setPlayerChoice(choice);
        setResult(null);
        setComputerChoice(null);

        // Animate computer choice
        let count = 0;
        const interval = setInterval(() => {
            const randomChoice = CHOICES[Math.floor(Math.random() * 3)].id;
            setComputerChoice(randomChoice);
            count++;
            if (count >= 10) {
                clearInterval(interval);
                // Final choice
                const finalChoice = CHOICES[Math.floor(Math.random() * 3)].id;
                setComputerChoice(finalChoice);

                // Determine result
                let gameResult: Result;
                if (choice === finalChoice) {
                    gameResult = 'draw';
                    setStats(s => ({ ...s, draws: s.draws + 1 }));
                    setStreak(0);
                } else if (WINNING_MOVES[choice] === finalChoice) {
                    gameResult = 'win';
                    setStats(s => ({ ...s, wins: s.wins + 1 }));
                    setStreak(s => {
                        const newStreak = s + 1;
                        if (newStreak > bestStreak) setBestStreak(newStreak);
                        return newStreak;
                    });
                } else {
                    gameResult = 'lose';
                    setStats(s => ({ ...s, losses: s.losses + 1 }));
                    setStreak(0);
                }
                setResult(gameResult);
                setIsPlaying(false);
            }
        }, 100);
    };

    const reset = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
        setStats({ wins: 0, losses: 0, draws: 0 });
        setStreak(0);
        setBestStreak(0);
    };

    const getResultColor = () => {
        if (result === 'win') return 'var(--accent-green)';
        if (result === 'lose') return 'var(--accent-red)';
        return 'var(--accent-yellow)';
    };

    const getResultText = () => {
        if (result === 'win') return '🎉 You Win!';
        if (result === 'lose') return '😢 You Lose!';
        return '🤝 Draw!';
    };

    const total = stats.wins + stats.losses + stats.draws;
    const winRate = total > 0 ? ((stats.wins / total) * 100).toFixed(0) : 0;

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
                    <Swords size={24} />
                </div>
                <div>
                    <h2>Rock Paper Scissors</h2>
                    <p>Challenge the computer!</p>
                </div>
            </div>

            {/* Battle Arena */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(249, 115, 22, 0.08))',
                borderRadius: '20px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
                {/* Player */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        boxShadow: result === 'win' ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none',
                        border: result === 'win' ? '3px solid var(--accent-green)' : '2px solid var(--glass-border)',
                        transition: 'all 0.3s ease',
                    }}>
                        {playerChoice ? CHOICES.find(c => c.id === playerChoice)?.emoji : '❓'}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>
                        <User size={14} style={{ display: 'inline', marginRight: '0.25rem' }} /> You
                    </p>
                </div>

                {/* VS */}
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: result ? getResultColor() : 'var(--text-tertiary)',
                }}>
                    {result ? getResultText() : 'VS'}
                </div>

                {/* Computer */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        boxShadow: result === 'lose' ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
                        border: result === 'lose' ? '3px solid var(--accent-red)' : '2px solid var(--glass-border)',
                        transition: 'all 0.3s ease',
                        animation: isPlaying ? 'shake 0.1s infinite' : 'none',
                    }}>
                        {computerChoice ? CHOICES.find(c => c.id === computerChoice)?.emoji : '🤖'}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>
                        <Bot size={14} style={{ display: 'inline', marginRight: '0.25rem' }} /> CPU
                    </p>
                </div>
            </div>

            {/* Choice Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {CHOICES.map(choice => (
                    <button
                        key={choice.id}
                        onClick={() => play(choice.id)}
                        disabled={isPlaying}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            border: playerChoice === choice.id ? '3px solid var(--primary)' : '2px solid var(--glass-border)',
                            background: playerChoice === choice.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-secondary)',
                            fontSize: '2.5rem',
                            cursor: isPlaying ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: isPlaying ? 0.5 : 1,
                        }}
                    >
                        {choice.emoji}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className={styles.grid2}>
                <div className={`${styles.detailCard} ${styles.success}`}>
                    <Trophy size={18} style={{ marginBottom: '0.25rem' }} />
                    <p className={styles.detailCardLabel}>Wins</p>
                    <p className={styles.detailCardValue}>{stats.wins}</p>
                </div>
                <div className={styles.detailCard}>
                    <p className={styles.detailCardLabel}>Win Rate</p>
                    <p className={styles.detailCardValue}>{winRate}%</p>
                </div>
            </div>

            {/* Streak */}
            {(streak > 0 || bestStreak > 0) && (
                <div className={styles.flexBetween} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        🔥 Current Streak: <strong>{streak}</strong>
                    </span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                        Best: <strong>{bestStreak}</strong>
                    </span>
                </div>
            )}

            {/* Reset */}
            {total > 0 && (
                <button onClick={reset} className={styles.secondaryButton} style={{ width: '100%' }}>
                    <RotateCcw size={16} /> Reset Stats
                </button>
            )}

            {/* Info */}
            <div className={styles.infoBox}>
                ✊ Rock beats Scissors, ✋ Paper beats Rock, ✌️ Scissors beats Paper
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}
