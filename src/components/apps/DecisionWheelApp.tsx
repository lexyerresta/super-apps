'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { CircleDot, Play, RotateCcw, Plus, Trash2, Settings } from 'lucide-react';

interface WheelOption {
    id: string;
    text: string;
    color: string;
}

const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e',
];

const DEFAULT_OPTIONS: WheelOption[] = [
    { id: '1', text: 'Pizza 🍕', color: COLORS[0] },
    { id: '2', text: 'Burger 🍔', color: COLORS[4] },
    { id: '3', text: 'Sushi 🍣', color: COLORS[8] },
    { id: '4', text: 'Tacos 🌮', color: COLORS[12] },
];

export default function DecisionWheelApp() {
    const [options, setOptions] = useState<WheelOption[]>(DEFAULT_OPTIONS);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [newOption, setNewOption] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const wheelRef = useRef<HTMLDivElement>(null);

    const spin = () => {
        if (isSpinning || options.length < 2) return;

        setIsSpinning(true);
        setWinner(null);

        // Random rotations (5-10 full spins + random angle)
        const spins = 5 + Math.random() * 5;
        const randomAngle = Math.random() * 360;
        const totalRotation = rotation + (spins * 360) + randomAngle;

        setRotation(totalRotation);

        setTimeout(() => {
            // Calculate winner based on final angle
            const normalizedAngle = totalRotation % 360;
            const segmentAngle = 360 / options.length;
            // Wheel spins clockwise, pointer is at top
            const adjustedAngle = (360 - normalizedAngle + segmentAngle / 2) % 360;
            const winnerIndex = Math.floor(adjustedAngle / segmentAngle);
            setWinner(options[winnerIndex].text);
            setIsSpinning(false);
        }, 4000);
    };

    const addOption = () => {
        if (!newOption.trim() || options.length >= 12) return;
        const newId = Date.now().toString();
        const colorIndex = options.length % COLORS.length;
        setOptions([...options, { id: newId, text: newOption.trim(), color: COLORS[colorIndex] }]);
        setNewOption('');
    };

    const removeOption = (id: string) => {
        if (options.length <= 2) return;
        setOptions(options.filter(o => o.id !== id));
    };

    const reset = () => {
        setOptions(DEFAULT_OPTIONS);
        setRotation(0);
        setWinner(null);
    };

    const segmentAngle = 360 / options.length;

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)' }}>
                    <CircleDot size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <h2>Decision Wheel</h2>
                    <p>Spin to decide!</p>
                </div>
                <button onClick={() => setShowSettings(!showSettings)} className={styles.iconButton}>
                    <Settings size={18} />
                </button>
            </div>

            {/* Winner Display */}
            {winner && (
                <div className={styles.resultCard} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                        🎉 The winner is...
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {winner}
                    </p>
                </div>
            )}

            {/* Wheel */}
            <div style={{ position: 'relative', padding: '1.5rem 0' }}>
                {/* Pointer */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: '24px solid var(--text-primary)',
                    zIndex: 10,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }} />

                {/* Wheel Container */}
                <div className={styles.flexCenter}>
                    <div
                        ref={wheelRef}
                        style={{
                            width: '240px',
                            height: '240px',
                            borderRadius: '50%',
                            position: 'relative',
                            transform: `rotate(${rotation}deg)`,
                            transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.1)',
                            overflow: 'hidden',
                        }}
                    >
                        {options.map((option, index) => {
                            const startAngle = index * segmentAngle;
                            return (
                                <div
                                    key={option.id}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan((segmentAngle * Math.PI) / 360)}% 0%)`,
                                        transform: `rotate(${startAngle}deg)`,
                                        transformOrigin: '50% 50%',
                                        background: option.color,
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '20%',
                                        transform: `translateX(-50%) rotate(${segmentAngle / 2}deg)`,
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.7rem',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '60px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {option.text}
                                    </span>
                                </div>
                            );
                        })}
                        {/* Center circle */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <CircleDot size={20} color="#8b5cf6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Spin Button */}
            <button
                onClick={spin}
                className={styles.primaryButton}
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={isSpinning || options.length < 2}
            >
                <Play size={18} /> {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>

            {/* Settings */}
            {showSettings && (
                <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>Options ({options.length}/12)</h4>

                    {/* Add New */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addOption()}
                            placeholder="Add option..."
                            className={styles.input}
                            style={{ flex: 1 }}
                            maxLength={20}
                        />
                        <button onClick={addOption} className={styles.iconButton} disabled={options.length >= 12}>
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Options List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                        {options.map(option => (
                            <div key={option.id} className={styles.flexBetween} style={{
                                padding: '0.5rem 0.75rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '8px',
                                borderLeft: `4px solid ${option.color}`,
                            }}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{option.text}</span>
                                <button
                                    onClick={() => removeOption(option.id)}
                                    className={styles.iconButton}
                                    style={{ width: '28px', height: '28px' }}
                                    disabled={options.length <= 2}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button onClick={reset} className={styles.secondaryButton} style={{ width: '100%', marginTop: '0.75rem' }}>
                        <RotateCcw size={16} /> Reset to Default
                    </button>
                </div>
            )}

            {/* Info */}
            <div className={styles.infoBox}>
                🎡 Add 2-12 options and spin to make decisions fun!
            </div>
        </div>
    );
}
