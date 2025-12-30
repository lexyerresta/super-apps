'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Zap, Calculator } from 'lucide-react';

export default function PowerCalculatorApp() {
    const [base, setBase] = useState('');
    const [exponent, setExponent] = useState('');
    const [result, setResult] = useState('');

    const calculate = () => {
        const b = parseFloat(base);
        const e = parseFloat(exponent);

        if (isNaN(b) || isNaN(e)) {
            setResult('Invalid input');
            return;
        }

        const res = Math.pow(b, e);
        setResult(res.toString());
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Zap size={48} style={{ color: 'var(--primary)' }} />
            </div>

            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Base</label>
                <input
                    type="number"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    placeholder="Enter base number"
                    className={styles.input}
                    style={{ fontSize: '1.25rem', textAlign: 'center' }}
                />
            </div>

            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Exponent</label>
                <input
                    type="number"
                    value={exponent}
                    onChange={(e) => setExponent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && calculate()}
                    placeholder="Enter exponent"
                    className={styles.input}
                    style={{ fontSize: '1.25rem', textAlign: 'center' }}
                />
            </div>

            <button onClick={calculate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Calculator size={18} />
                Calculate {base && exponent ? `${base}^${exponent}` : 'Power'}
            </button>

            {result && (
                <div style={{
                    padding: '2rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {base}^{exponent} =
                    </div>
                    <div style={{
                        fontSize: result.length > 15 ? '1.5rem' : '2.5rem',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        wordBreak: 'break-all'
                    }}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
