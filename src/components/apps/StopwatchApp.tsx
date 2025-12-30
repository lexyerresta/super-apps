'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { Timer, Play, Pause, RotateCcw, Flag, Trash2, Clock } from 'lucide-react';

interface Lap {
    number: number;
    time: number;
    split: number;
}

export default function StopwatchApp() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<Lap[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const accumulatedRef = useRef<number>(0);

    const start = useCallback(() => {
        startTimeRef.current = Date.now() - accumulatedRef.current;
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        accumulatedRef.current = time;
        setIsRunning(false);
    }, [time]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
        accumulatedRef.current = 0;
    }, []);

    const addLap = useCallback(() => {
        if (time === 0) return;
        const lastLapTime = laps.length > 0 ? laps[0].time : 0;
        const split = time - lastLapTime;
        setLaps([{ number: laps.length + 1, time, split }, ...laps]);
    }, [time, laps]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(Date.now() - startTimeRef.current);
            }, 10);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    const getBestLap = () => {
        if (laps.length === 0) return null;
        return laps.reduce((best, lap) => lap.split < best.split ? lap : best);
    };

    const getWorstLap = () => {
        if (laps.length < 2) return null;
        return laps.reduce((worst, lap) => lap.split > worst.split ? lap : worst);
    };

    const bestLap = getBestLap();
    const worstLap = getWorstLap();

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    <Timer size={24} />
                </div>
                <div>
                    <h2>Stopwatch</h2>
                    <p>Precision timing with lap tracking</p>
                </div>
            </div>

            {/* Timer Display */}
            <div style={{
                padding: '2.5rem 1rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.08))',
                borderRadius: '24px',
                textAlign: 'center',
                border: '1px solid rgba(245, 158, 11, 0.2)',
            }}>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '2px',
                }}>
                    {formatTime(time)}
                </div>
                {laps.length > 0 && (
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        <Flag size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        {laps.length} lap{laps.length !== 1 ? 's' : ''} recorded
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className={styles.buttonGroup}>
                <button
                    onClick={isRunning ? pause : start}
                    className={styles.primaryButton}
                    style={{ flex: 1 }}
                >
                    {isRunning ? <Pause size={18} /> : <Play size={18} />}
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={addLap}
                    className={styles.secondaryButton}
                    disabled={!isRunning && time === 0}
                >
                    <Flag size={18} /> Lap
                </button>
                <button onClick={reset} className={styles.iconButton}>
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Lap List */}
            {laps.length > 0 && (
                <div className={styles.formSection}>
                    <div className={styles.flexBetween}>
                        <h4 className={styles.sectionTitle}>
                            <Clock size={16} /> Lap Times
                        </h4>
                        <button
                            onClick={() => setLaps([])}
                            className={styles.iconButton}
                            style={{ width: '32px', height: '32px' }}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {laps.map((lap) => {
                            const isBest = bestLap && lap.number === bestLap.number && laps.length >= 2;
                            const isWorst = worstLap && lap.number === worstLap.number && laps.length >= 2;
                            return (
                                <div
                                    key={lap.number}
                                    className={styles.flexBetween}
                                    style={{
                                        padding: '0.75rem',
                                        background: isBest ? 'rgba(34, 197, 94, 0.1)' : isWorst ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                                        borderRadius: '10px',
                                        marginBottom: '0.5rem',
                                        borderLeft: isBest ? '3px solid var(--accent-green)' : isWorst ? '3px solid var(--accent-red)' : 'none',
                                    }}
                                >
                                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>
                                        Lap {lap.number}
                                    </span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            color: isBest ? 'var(--accent-green)' : isWorst ? 'var(--accent-red)' : 'var(--text-primary)',
                                            fontWeight: 700,
                                            fontFamily: 'monospace',
                                            fontSize: '0.95rem',
                                        }}>
                                            +{formatTime(lap.split)}
                                        </span>
                                        <span style={{
                                            color: 'var(--text-tertiary)',
                                            fontSize: '0.75rem',
                                            display: 'block',
                                            fontFamily: 'monospace',
                                        }}>
                                            {formatTime(lap.time)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Info */}
            <div className={styles.infoBox}>
                ⏱️ Press Lap while running to record split times. Best and worst laps are highlighted.
            </div>
        </div>
    );
}
