'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Wind, Play, Pause, RefreshCw, Settings, Heart } from 'lucide-react';

type BreathingPattern = 'relaxing' | 'energizing' | 'box' | 'sleep';

const BREATHING_PATTERNS = {
    relaxing: { name: '4-7-8 Relaxing', inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
    energizing: { name: 'Energizing', inhale: 4, hold: 0, exhale: 4, holdAfter: 0 },
    box: { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    sleep: { name: 'Sleep', inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
};

export default function BreathingApp() {
    const [isActive, setIsActive] = useState(false);
    const [pattern, setPattern] = useState<BreathingPattern>('relaxing');
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfter'>('inhale');
    const [countdown, setCountdown] = useState(0);
    const [cycles, setCycles] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const currentPattern = BREATHING_PATTERNS[pattern];

    useEffect(() => {
        if (isActive) {
            setPhase('inhale');
            setCountdown(currentPattern.inhale);
        }
    }, [isActive, currentPattern.inhale]);

    useEffect(() => {
        if (isActive && countdown > 0) {
            intervalRef.current = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (isActive && countdown === 0) {
            // Move to next phase
            if (phase === 'inhale') {
                if (currentPattern.hold > 0) {
                    setPhase('hold');
                    setCountdown(currentPattern.hold);
                } else {
                    setPhase('exhale');
                    setCountdown(currentPattern.exhale);
                }
            } else if (phase === 'hold') {
                setPhase('exhale');
                setCountdown(currentPattern.exhale);
            } else if (phase === 'exhale') {
                if (currentPattern.holdAfter > 0) {
                    setPhase('holdAfter');
                    setCountdown(currentPattern.holdAfter);
                } else {
                    setPhase('inhale');
                    setCountdown(currentPattern.inhale);
                    setCycles(c => c + 1);
                }
            } else if (phase === 'holdAfter') {
                setPhase('inhale');
                setCountdown(currentPattern.inhale);
                setCycles(c => c + 1);
            }
        }

        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [isActive, countdown, phase, currentPattern]);

    const toggleActive = () => {
        if (!isActive) {
            setCycles(0);
        }
        setIsActive(!isActive);
    };

    const reset = () => {
        setIsActive(false);
        setPhase('inhale');
        setCountdown(0);
        setCycles(0);
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In';
            case 'hold': return 'Hold';
            case 'exhale': return 'Breathe Out';
            case 'holdAfter': return 'Hold';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'inhale': return '#22c55e';
            case 'hold': return '#f59e0b';
            case 'exhale': return '#6366f1';
            case 'holdAfter': return '#ec4899';
        }
    };

    const getCircleScale = () => {
        if (!isActive) return 1;
        if (phase === 'inhale') return 1.3;
        if (phase === 'exhale') return 0.8;
        return 1;
    };

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #22c55e, #14b8a6)' }}>
                    <Wind size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <h2>Breathing Exercise</h2>
                    <p>Relax and focus with guided breathing</p>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={styles.iconButton}
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* Pattern Selection */}
            {showSettings && (
                <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Breathing Pattern</h4>
                    <div className={styles.grid2}>
                        {(Object.keys(BREATHING_PATTERNS) as BreathingPattern[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => { setPattern(p); reset(); }}
                                className={`${styles.detailCard} ${pattern === p ? styles.highlight : ''}`}
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                            >
                                <p className={styles.detailCardValue}>{BREATHING_PATTERNS[p].name}</p>
                                <p className={styles.detailCardLabel}>
                                    {BREATHING_PATTERNS[p].inhale}-{BREATHING_PATTERNS[p].hold || '0'}-{BREATHING_PATTERNS[p].exhale}
                                    {BREATHING_PATTERNS[p].holdAfter > 0 && `-${BREATHING_PATTERNS[p].holdAfter}`}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Breathing Circle */}
            <div className={styles.flexCenter} style={{ padding: '2rem 0' }}>
                <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getPhaseColor()}20, ${getPhaseColor()}40)`,
                    border: `3px solid ${getPhaseColor()}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 1s ease-in-out, background 0.5s ease',
                    transform: `scale(${getCircleScale()})`,
                    boxShadow: isActive ? `0 0 60px ${getPhaseColor()}40` : 'none',
                }}>
                    {isActive ? (
                        <>
                            <span style={{ color: getPhaseColor(), fontSize: '3rem', fontWeight: 800 }}>
                                {countdown}
                            </span>
                            <span style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                                {getPhaseText()}
                            </span>
                        </>
                    ) : (
                        <>
                            <Wind size={48} color="var(--text-tertiary)" />
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Press Start
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                    <p className={styles.detailCardLabel}>Pattern</p>
                    <p className={styles.detailCardValue}>{currentPattern.name}</p>
                </div>
                <div className={`${styles.detailCard} ${styles.success}`}>
                    <p className={styles.detailCardLabel}>Cycles</p>
                    <p className={styles.detailCardValue}>{cycles}</p>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.buttonGroup}>
                <button onClick={toggleActive} className={styles.primaryButton} style={{ flex: 1 }}>
                    {isActive ? <Pause size={18} /> : <Play size={18} />}
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={reset} className={styles.secondaryButton}>
                    <RefreshCw size={18} /> Reset
                </button>
            </div>

            {/* Info */}
            <div className={styles.infoBox}>
                <Heart size={16} /> Deep breathing reduces stress, lowers heart rate, and improves focus.
            </div>
        </div>
    );
}
