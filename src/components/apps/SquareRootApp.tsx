'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Hash, Calculator } from 'lucide-react';

export default function SquareRootApp() {
    const [number, setNumber] = useState('');
    const [result, setResult] = useState('');

    const calculate = () => {
        const num = parseFloat(number);
        if (isNaN(num) || num < 0) {
            setResult('Invalid input');
            return;
        }
        setResult(Math.sqrt(num).toString());
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Hash size={48} style={{ color: 'var(--primary)' }} />
            </div>

            <div className={styles.inputGroup}>
                <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && calculate()}
                    placeholder="Enter number"
                    className={styles.input}
                    style={{ fontSize: '1.25rem', textAlign: 'center' }}
                />
            </div>

            <button onClick={calculate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Calculator size={18} />
                Calculate √
            </button>

            {result && (
                <div style={{
                    padding: '2rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Result
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
