'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Dices, Copy, Check } from 'lucide-react';

export default function DiceRollerApp() {
    const [result, setResult] = useState<number[]>([]);
    const [diceCount, setDiceCount] = useState(2);
    const [sides, setSides] = useState(6);

    const rollDice = () => {
        const rolls = Array.from({ length: diceCount }, () =>
            Math.floor(Math.random() * sides) + 1
        );
        setResult(rolls);
    };

    const total = result.reduce((sum, val) => sum + val, 0);

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        Number of Dice
                    </label>
                    <select
                        value={diceCount}
                        onChange={(e) => setDiceCount(Number(e.target.value))}
                        className={styles.select}
                    >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        Sides per Die
                    </label>
                    <select
                        value={sides}
                        onChange={(e) => setSides(Number(e.target.value))}
                        className={styles.select}
                    >
                        {[4, 6, 8, 10, 12, 20, 100].map(n => (
                            <option key={n} value={n}>D{n}</option>
                        ))}
                    </select>
                </div>
            </div>

            {result.length > 0 && (
                <div style={{
                    padding: '2rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        {result.map((val, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
                                }}
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Total
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {total}
                    </div>
                </div>
            )}

            <button
                onClick={rollDice}
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
                <Dices size={20} />
                Roll Dice
            </button>
        </div>
    );
}
