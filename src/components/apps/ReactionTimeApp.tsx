'use client';
import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { Activity, Play, Pause, RotateCcw } from 'lucide-react';

export default function ReactionTimeApp() {
    const [state, setState] = useState<'waiting' | 'ready' | 'click' | 'result'>('waiting');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const [attempts, setAttempts] = useState<number[]>([]);

    useEffect(() => {
        if (state === 'ready') {
            const delay = Math.random() * 3000 + 2000; // 2-5 seconds
            const timer = setTimeout(() => {
                setState('click');
                setStartTime(Date.now());
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [state]);

    const handleClick = () => {
        if (state === 'waiting') {
            setState('ready');
        } else if (state === 'click') {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setAttempts([...attempts, time]);
            setState('result');
        } else if (state === 'ready') {
            // Clicked too early
            setState('waiting');
            alert('Too early! Wait for green.');
        }
    };

    const reset = () => {
        setState('waiting');
        setReactionTime(0);
    };

    const avgTime = attempts.length > 0
        ? attempts.reduce((a, b) => a + b, 0) / attempts.length
        : 0;

    const getBackgroundColor = () => {
        switch (state) {
            case 'waiting': return '#3b82f6';
            case 'ready': return '#f59e0b';
            case 'click': return '#10b981';
            case 'result': return '#6366f1';
        }
    };

    const getMessage = () => {
        switch (state) {
            case 'waiting': return 'Click to Start';
            case 'ready': return 'Wait...';
            case 'click': return 'CLICK NOW!';
            case 'result': return `${reactionTime}ms`;
        }
    };

    return (
        <div className={styles.appContainer}>
            <div
                onClick={handleClick}
                style={{
                    width: '100%',
                    height: '300px',
                    background: getBackgroundColor(),
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }}
            >
                <Activity size={48} color="white" style={{ marginBottom: '1rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>
                    {getMessage()}
                </div>
                {state === 'result' && (
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem' }}>
                        {reactionTime < 200 ? '⚡ Lightning Fast!' :
                            reactionTime < 300 ? '🎯 Excellent!' :
                                reactionTime < 400 ? '👍 Good!' : '🐌 Try Again!'}
                    </div>
                )}
            </div>

            {attempts.length > 0 && (
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    marginBottom: '1rem'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Best
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                                {Math.min(...attempts)}ms
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Average
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                                {Math.round(avgTime)}ms
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                Attempts
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6366f1' }}>
                                {attempts.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {state === 'result' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button
                        onClick={reset}
                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    >
                        <RotateCcw size={18} />
                        Try Again
                    </button>
                    <button
                        onClick={() => setAttempts([])}
                        className={styles.actionBtn}
                        style={{ background: 'var(--bg-secondary)' }}
                    >
                        Reset Stats
                    </button>
                </div>
            )}
        </div>
    );
}
