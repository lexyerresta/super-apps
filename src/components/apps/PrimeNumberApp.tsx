'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Hash, CheckCircle, XCircle } from 'lucide-react';

export default function PrimeNumberApp() {
    const [number, setNumber] = useState('');
    const [result, setResult] = useState<{ isPrime: boolean; factors?: number[] } | null>(null);

    const isPrime = (n: number): boolean => {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    };

    const getFactors = (n: number): number[] => {
        const factors = [];
        for (let i = 2; i <= n; i++) {
            if (n % i === 0) factors.push(i);
        }
        return factors;
    };

    const check = () => {
        const num = parseInt(number);
        if (isNaN(num) || num < 1) {
            setResult(null);
            return;
        }
        setResult({
            isPrime: isPrime(num),
            factors: getFactors(num)
        });
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="number" value={number} onChange={(e) => setNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && check()}
                    placeholder="Enter number" className={styles.input} style={{ fontSize: '1.25rem', textAlign: 'center' }} />
            </div>
            <button onClick={check} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Hash size={18} /> Check if Prime
            </button>
            {result && (
                <div style={{
                    padding: '2rem', background: result.isPrime ? 'linear-gradient(135deg, #10b981, #14b8a6)' : 'var(--bg-secondary)',
                    borderRadius: '16px', textAlign: 'center', color: result.isPrime ? 'white' : 'var(--text-primary)'
                }}>
                    {result.isPrime ? <CheckCircle size={48} style={{ marginBottom: '1rem' }} /> : <XCircle size={48} style={{ marginBottom: '1rem', color: '#ef4444' }} />}
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                        {result.isPrime ? `${number} is Prime!` : `${number} is Not Prime`}
                    </div>
                    {!result.isPrime && result.factors && (
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                            Factors: {result.factors.join(', ')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
