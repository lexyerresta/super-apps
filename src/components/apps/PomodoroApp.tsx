'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './MiniApps.module.css';
import { n8n } from '@/lib/n8n';
import { Play, Pause, RotateCcw, Coffee, Palmtree, Target } from 'lucide-react';

type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

const phaseDurations: Record<PomodoroPhase, number> = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const phaseConfig: Record<PomodoroPhase, { color: string; label: string; icon: typeof Target }> = {
    work: { color: '#ef4444', label: 'Focus Time', icon: Target },
    shortBreak: { color: '#22c55e', label: 'Short Break', icon: Coffee },
    longBreak: { color: '#3b82f6', label: 'Long Break', icon: Palmtree },
};

export default function PomodoroApp() {
    const [phase, setPhase] = useState<PomodoroPhase>('work');
    const [timeLeft, setTimeLeft] = useState(phaseDurations.work);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handlePhaseComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft]);

    const handlePhaseComplete = () => {
        setIsRunning(false);

        if (phase === 'work') {
            const newCount = completedPomodoros + 1;
            setCompletedPomodoros(newCount);

            n8n.pomodoroCompleted(25, newCount);

            if (newCount % 4 === 0) {
                setPhase('longBreak');
                setTimeLeft(phaseDurations.longBreak);
            } else {
                setPhase('shortBreak');
                setTimeLeft(phaseDurations.shortBreak);
            }
        } else {
            setPhase('work');
            setTimeLeft(phaseDurations.work);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((phaseDurations[phase] - timeLeft) / phaseDurations[phase]) * 100;
    const current = phaseConfig[phase];
    const PhaseIcon = current.icon;

    const handlePhaseChange = (newPhase: PomodoroPhase) => {
        setPhase(newPhase);
        setTimeLeft(phaseDurations[newPhase]);
        setIsRunning(false);
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.tabs}>
                {(['work', 'shortBreak', 'longBreak'] as PomodoroPhase[]).map((p) => {
                    const config = phaseConfig[p];
                    const Icon = config.icon;
                    return (
                        <button
                            key={p}
                            className={`${styles.tabBtn} ${phase === p ? styles.active : ''}`}
                            onClick={() => handlePhaseChange(p)}
                            style={phase === p ? { background: config.color } : {}}
                        >
                            <Icon size={16} />
                        </button>
                    );
                })}
            </div>

            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                border: '1px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: `${progress}%`,
                    height: '4px',
                    background: current.color,
                    transition: 'width 1s linear',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <PhaseIcon size={20} color={current.color} />
                    <span style={{ color: current.color, fontWeight: 700, fontSize: '1.1rem' }}>
                        {current.label}
                    </span>
                </div>

                <div style={{
                    fontSize: 'clamp(4rem, 15vw, 6rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    letterSpacing: '-0.02em',
                }}>
                    {formatTime(timeLeft)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: i < (completedPomodoros % 4) ? '#ef4444' : 'var(--bg-secondary)',
                                border: '2px solid var(--glass-border)',
                                transition: 'background 0.3s ease',
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>{completedPomodoros}</span>
                    <span className={styles.statLabel}>Completed</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>{Math.floor(completedPomodoros * 25 / 60)}h</span>
                    <span className={styles.statLabel}>Focus Time</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>{4 - (completedPomodoros % 4)}</span>
                    <span className={styles.statLabel}>Until Break</span>
                </div>
            </div>

            <div className={styles.actions}>
                {!isRunning ? (
                    <button onClick={() => setIsRunning(true)} className={`${styles.actionBtn} ${styles.successBtn}`} style={{ padding: '1rem 2.5rem' }}>
                        <Play size={18} /> Start
                    </button>
                ) : (
                    <button onClick={() => setIsRunning(false)} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ padding: '1rem 2.5rem' }}>
                        <Pause size={18} /> Pause
                    </button>
                )}
                <button onClick={() => { setTimeLeft(phaseDurations[phase]); setIsRunning(false); }} className={styles.actionBtn}>
                    <RotateCcw size={18} /> Reset
                </button>
            </div>
        </div>
    );
}
