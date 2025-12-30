'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { TrendingUp, Calculator } from 'lucide-react';

export default function StatisticsApp() {
    const [numbers, setNumbers] = useState('');
    const [stats, setStats] = useState<any>(null);

    const calculate = () => {
        const nums = numbers.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

        if (nums.length === 0) return;

        const sorted = [...nums].sort((a, b) => a - b);
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / nums.length;
        const median = nums.length % 2 === 0
            ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2
            : sorted[Math.floor(nums.length / 2)];

        const variance = nums.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / nums.length;
        const stdDev = Math.sqrt(variance);

        setStats({
            count: nums.length,
            sum: sum.toFixed(2),
            mean: mean.toFixed(2),
            median: median.toFixed(2),
            min: Math.min(...nums).toFixed(2),
            max: Math.max(...nums).toFixed(2),
            range: (Math.max(...nums) - Math.min(...nums)).toFixed(2),
            stdDev: stdDev.toFixed(2)
        });
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                    Enter numbers (comma-separated)
                </label>
                <textarea
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    placeholder="1, 2, 3, 4, 5"
                    className={styles.input}
                    rows={4}
                    style={{ resize: 'vertical', fontFamily: 'monospace' }}
                />
            </div>

            <button onClick={calculate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Calculator size={18} />
                Calculate Statistics
            </button>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {Object.entries(stats).map(([key, value]) => (
                        <div key={key} style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                                {key.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                                {value as string}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
