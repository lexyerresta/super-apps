'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Divide, Calculator } from 'lucide-react';

export default function FractionApp() {
    const [frac1, setFrac1] = useState({ num: '', den: '' });
    const [frac2, setFrac2] = useState({ num: '', den: '' });
    const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
    const [result, setResult] = useState('');

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    const calculate = () => {
        const n1 = parseInt(frac1.num);
        const d1 = parseInt(frac1.den);
        const n2 = parseInt(frac2.num);
        const d2 = parseInt(frac2.den);

        if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2) || d1 === 0 || d2 === 0) {
            setResult('Invalid input');
            return;
        }

        let resNum = 0, resDen = 1;

        switch (operation) {
            case '+':
                resNum = n1 * d2 + n2 * d1;
                resDen = d1 * d2;
                break;
            case '-':
                resNum = n1 * d2 - n2 * d1;
                resDen = d1 * d2;
                break;
            case '*':
                resNum = n1 * n2;
                resDen = d1 * d2;
                break;
            case '/':
                resNum = n1 * d2;
                resDen = d1 * n2;
                break;
        }

        const divisor = gcd(Math.abs(resNum), Math.abs(resDen));
        resNum /= divisor;
        resDen /= divisor;

        if (resDen < 0) {
            resNum *= -1;
            resDen *= -1;
        }

        setResult(`${resNum}/${resDen}`);
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                            type="number"
                            value={frac1.num}
                            onChange={(e) => setFrac1({ ...frac1, num: e.target.value })}
                            placeholder="Numerator"
                            className={styles.input}
                            style={{ textAlign: 'center', marginBottom: 0 }}
                        />
                        <input
                            type="number"
                            value={frac1.den}
                            onChange={(e) => setFrac1({ ...frac1, den: e.target.value })}
                            placeholder="Denominator"
                            className={styles.input}
                            style={{ textAlign: 'center', marginBottom: 0 }}
                        />
                    </div>
                </div>

                <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value as any)}
                    className={styles.select}
                    style={{ marginBottom: 0, textAlign: 'center', fontSize: '1.5rem' }}
                >
                    <option value="+  ">+</option>
                    <option value="-">-</option>
                    <option value="*">×</option>
                    <option value="/">÷</option>
                </select>

                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                            type="number"
                            value={frac2.num}
                            onChange={(e) => setFrac2({ ...frac2, num: e.target.value })}
                            placeholder="Numerator"
                            className={styles.input}
                            style={{ textAlign: 'center', marginBottom: 0 }}
                        />
                        <input
                            type="number"
                            value={frac2.den}
                            onChange={(e) => setFrac2({ ...frac2, den: e.target.value })}
                            placeholder="Denominator"
                            className={styles.input}
                            style={{ textAlign: 'center', marginBottom: 0 }}
                        />
                    </div>
                </div>
            </div>

            <button onClick={calculate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Calculator size={18} />
                Calculate
            </button>

            {result && (
                <div style={{
                    padding: '2rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Result (simplified)
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
