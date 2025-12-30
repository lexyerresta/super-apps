'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Percent, Calculator, RefreshCw, ArrowRight } from 'lucide-react';

type CalcType = 'whatPercent' | 'percentOf' | 'increase' | 'decrease' | 'change';

export default function PercentageApp() {
    const [calcType, setCalcType] = useState<CalcType>('percentOf');
    const [value1, setValue1] = useState('50');
    const [value2, setValue2] = useState('200');

    const result = useMemo(() => {
        const v1 = parseFloat(value1) || 0;
        const v2 = parseFloat(value2) || 0;

        switch (calcType) {
            case 'whatPercent':
                return v2 !== 0 ? ((v1 / v2) * 100).toFixed(2) + '%' : '0%';
            case 'percentOf':
                return ((v1 / 100) * v2).toFixed(2);
            case 'increase':
                return (v2 * (1 + v1 / 100)).toFixed(2);
            case 'decrease':
                return (v2 * (1 - v1 / 100)).toFixed(2);
            case 'change':
                return v1 !== 0 ? (((v2 - v1) / v1) * 100).toFixed(2) + '%' : '0%';
            default:
                return '0';
        }
    }, [calcType, value1, value2]);

    const calcTypes = [
        { id: 'percentOf', label: '% of', desc: 'What is X% of Y?' },
        { id: 'whatPercent', label: 'What %', desc: 'X is what % of Y?' },
        { id: 'increase', label: '+ %', desc: 'Increase Y by X%' },
        { id: 'decrease', label: '- %', desc: 'Decrease Y by X%' },
        { id: 'change', label: 'Δ %', desc: '% change from X to Y' },
    ];

    const getLabels = () => {
        switch (calcType) {
            case 'whatPercent': return ['Number', 'Total'];
            case 'percentOf': return ['Percentage', 'Number'];
            case 'increase': return ['Increase %', 'Original'];
            case 'decrease': return ['Decrease %', 'Original'];
            case 'change': return ['From', 'To'];
            default: return ['Value 1', 'Value 2'];
        }
    };

    const labels = getLabels();

    return (
        <div className={styles.appContainer}>
            {/* Calc Type Selector */}
            <div className={styles.tabs}>
                {calcTypes.map((t) => (
                    <button
                        key={t.id}
                        className={`${styles.tabBtn} ${calcType === t.id ? styles.active : ''}`}
                        onClick={() => setCalcType(t.id as CalcType)}
                        title={t.desc}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Description */}
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    {calcTypes.find(t => t.id === calcType)?.desc}
                </p>
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'end' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{labels[0]}</label>
                    <input
                        type="number"
                        value={value1}
                        onChange={(e) => setValue1(e.target.value)}
                        className={styles.searchInput}
                        style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center' }}
                    />
                </div>
                <div style={{ padding: '0.75rem', color: 'var(--text-tertiary)' }}>
                    <ArrowRight size={20} />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{labels[1]}</label>
                    <input
                        type="number"
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                        className={styles.searchInput}
                        style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center' }}
                    />
                </div>
            </div>

            {/* Result */}
            <div style={{
                padding: '2rem',
                background: 'var(--gradient-primary)',
                borderRadius: '20px',
                textAlign: 'center',
            }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Result</p>
                <p style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{result}</p>
            </div>

            {/* Quick Examples */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                    { v1: '10', v2: '100', label: '10% of 100' },
                    { v1: '25', v2: '200', label: '25% of 200' },
                    { v1: '15', v2: '80', label: '+15% of 80' },
                    { v1: '20', v2: '500', label: '-20% of 500' },
                ].map((ex, i) => (
                    <button
                        key={i}
                        onClick={() => { setValue1(ex.v1); setValue2(ex.v2); }}
                        style={{
                            padding: '0.6rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                        }}
                    >
                        {ex.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
