'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Timer, Clock, Play, Pause, RotateCcw } from 'lucide-react';

export default function TimerApp() {
    const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timerMinutes, setTimerMinutes] = useState(5);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (mode === 'timer') {
                        if (prev <= 1) {
                            setIsRunning(false);
                            return 0;
                        }
                        return prev - 1;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, mode]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        if (mode === 'timer' && time === 0) {
            setTime(timerMinutes * 60);
        }
        setIsRunning(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(mode === 'timer' ? timerMinutes * 60 : 0);
    };

    const handleModeChange = (newMode: 'stopwatch' | 'timer') => {
        setMode(newMode);
        setIsRunning(false);
        setTime(newMode === 'timer' ? timerMinutes * 60 : 0);
    };

    const presetMinutes = [1, 5, 10, 15, 25, 30];

    return (
        <div className={styles.appContainer}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${mode === 'stopwatch' ? styles.active : ''}`}
                    onClick={() => handleModeChange('stopwatch')}
                >
                    <Timer size={16} /> Stopwatch
                </button>
                <button
                    className={`${styles.tabBtn} ${mode === 'timer' ? styles.active : ''}`}
                    onClick={() => handleModeChange('timer')}
                >
                    <Clock size={16} /> Timer
                </button>
            </div>

            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '20px',
                padding: '2.5rem',
                textAlign: 'center',
                border: '1px solid var(--glass-border)',
            }}>
                <div style={{
                    fontSize: 'clamp(3rem, 10vw, 5rem)',
                    fontWeight: 800,
                    color: isRunning ? 'var(--accent-green)' : 'var(--text-primary)',
                    fontFamily: 'monospace',
                    letterSpacing: '-0.02em',
                    transition: 'color 0.3s ease',
                }}>
                    {formatTime(time)}
                </div>

                {mode === 'timer' && !isRunning && time === 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ color: 'var(--text-tertiary)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            Set duration
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {presetMinutes.map((min) => (
                                <button
                                    key={min}
                                    onClick={() => {
                                        setTimerMinutes(min);
                                        setTime(min * 60);
                                    }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: timerMinutes === min ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                        border: '1px solid',
                                        borderColor: timerMinutes === min ? 'transparent' : 'var(--glass-border)',
                                        borderRadius: '50px',
                                        color: timerMinutes === min ? 'white' : 'var(--text-secondary)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {min}m
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                {!isRunning ? (
                    <button onClick={handleStart} className={`${styles.actionBtn} ${styles.successBtn}`} style={{ padding: '1rem 2rem' }}>
                        <Play size={18} /> Start
                    </button>
                ) : (
                    <button onClick={() => setIsRunning(false)} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ padding: '1rem 2rem' }}>
                        <Pause size={18} /> Pause
                    </button>
                )}
                <button onClick={handleReset} className={styles.actionBtn} style={{ padding: '1rem 2rem' }}>
                    <RotateCcw size={18} /> Reset
                </button>
            </div>
        </div>
    );
}
