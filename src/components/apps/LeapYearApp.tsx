'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Calendar } from 'lucide-react';

export default function LeapYearApp() {
    const [year, setYear] = useState('');
    const [result, setResult] = useState<boolean | null>(null);

    const isLeapYear = (y: number): boolean => {
        return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    };

    const check = () => {
        const y = parseInt(year);
        if (isNaN(y) || y < 1) {
            setResult(null);
            return;
        }
        setResult(isLeapYear(y));
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && check()}
                    placeholder={`Enter year (e.g., ${currentYear})`}
                    className={styles.input} style={{ fontSize: '1.25rem', textAlign: 'center' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                    <button key={y} onClick={() => { setYear(y.toString()); setResult(isLeapYear(y)); }}
                        style={{
                            padding: '0.5rem', border: 'none', borderRadius: '8px',
                            background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: '0.875rem'
                        }}>
                        {y}
                    </button>
                ))}
            </div>

            <button onClick={check} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Calendar size={18} /> Check Leap Year
            </button>

            {result !== null && (
                <div style={{
                    padding: '2rem',
                    background: result ? 'linear-gradient(135deg, #10b981, #14b8a6)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '16px', textAlign: 'center', color: 'white'
                }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {year}
                    </div>
                    <div style={{ fontSize: '1.25rem', opacity: 0.95 }}>
                        {result ? '✓ Is a Leap Year' : '✗ Not a Leap Year'}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
                        {result ? '366 days (Feb has 29)' : '365 days'}
                    </div>
                </div>
            )}
        </div>
    );
}
