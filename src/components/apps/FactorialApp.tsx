'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Hash, Calculator } from 'lucide-react';

export default function FactorialApp() {
    const [number, setNumber] = useState('');
    const [result, setResult] = useState('');

    const factorial = (n: number): bigint => {
        if (n === 0 || n === 1) return BigInt(1);
        let result = BigInt(1);
        for (let i = 2; i <= n; i++) {
            result *= BigInt(i);
        }
        return result;
    };

    const calculate = () => {
        const num = parseInt(number);
        if (isNaN(num) || num < 0 || num > 170) {
            setResult('Invalid (use 0-170)');
            return;
        }
        setResult(factorial(num).toString());
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
                    placeholder="Enter number (0-170)"
                    className={styles.input}
                    style={{ fontSize: '1.25rem', textAlign: 'center' }}
                />
            </div>

            <button onClick={calculate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Calculator size={18} />
                Calculate n!
            </button>

            {result && (
                <div style={{
                    padding: '2rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    wordBreak: 'break-all'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {number}! =
                    </div>
                    <div style={{ fontSize: result.length > 20 ? '1rem' : '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
