'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Scale, Ruler, Activity, RefreshCw, Info } from 'lucide-react';

export default function BMICalculatorApp() {
    const [weight, setWeight] = useState('70');
    const [height, setHeight] = useState('170');
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

    const result = useMemo(() => {
        const w = parseFloat(weight) || 0;
        const h = parseFloat(height) || 0;

        if (w <= 0 || h <= 0) return null;

        let bmi: number;
        if (unit === 'metric') {
            // weight in kg, height in cm
            bmi = w / Math.pow(h / 100, 2);
        } else {
            // weight in lbs, height in inches
            bmi = (w / Math.pow(h, 2)) * 703;
        }

        let category: string;
        let color: string;
        let advice: string;

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6';
            advice = 'Consider gaining some weight through a balanced diet.';
        } else if (bmi < 25) {
            category = 'Normal';
            color = '#22c55e';
            advice = 'Great! Maintain your healthy lifestyle.';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f59e0b';
            advice = 'Consider increasing physical activity.';
        } else {
            category = 'Obese';
            color = '#ef4444';
            advice = 'Consult a healthcare professional for guidance.';
        }

        // Ideal weight range (BMI 18.5 - 24.9)
        const heightM = unit === 'metric' ? h / 100 : h * 0.0254;
        const idealMin = 18.5 * Math.pow(heightM, 2);
        const idealMax = 24.9 * Math.pow(heightM, 2);

        return { bmi: bmi.toFixed(1), category, color, advice, idealMin: idealMin.toFixed(1), idealMax: idealMax.toFixed(1) };
    }, [weight, height, unit]);

    const getBMIPosition = (bmi: number) => {
        // Scale: 15 to 40
        const min = 15;
        const max = 40;
        const percentage = ((bmi - min) / (max - min)) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    return (
        <div className={styles.appContainer}>
            {/* Unit Toggle */}
            <div className={styles.tabs}>
                <button className={`${styles.tabBtn} ${unit === 'metric' ? styles.active : ''}`} onClick={() => setUnit('metric')}>
                    Metric (kg/cm)
                </button>
                <button className={`${styles.tabBtn} ${unit === 'imperial' ? styles.active : ''}`} onClick={() => setUnit('imperial')}>
                    Imperial (lb/in)
                </button>
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        <Scale size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={styles.searchInput}
                        style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        <Ruler size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Height ({unit === 'metric' ? 'cm' : 'inches'})
                    </label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className={styles.searchInput}
                        style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center' }}
                    />
                </div>
            </div>

            {result && (
                <>
                    {/* BMI Result */}
                    <div style={{
                        padding: '2rem',
                        background: `linear-gradient(135deg, ${result.color}20, ${result.color}10)`,
                        border: `1px solid ${result.color}40`,
                        borderRadius: '20px',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Your BMI</p>
                        <p style={{ color: result.color, fontSize: '3.5rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{result.bmi}</p>
                        <p style={{ color: result.color, fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>{result.category}</p>
                    </div>

                    {/* BMI Scale */}
                    <div style={{ padding: '1rem' }}>
                        <div style={{
                            height: '12px',
                            background: 'linear-gradient(to right, #3b82f6 0%, #22c55e 25%, #f59e0b 50%, #ef4444 75%, #dc2626 100%)',
                            borderRadius: '6px',
                            position: 'relative',
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: `${getBMIPosition(parseFloat(result.bmi))}%`,
                                top: '-4px',
                                transform: 'translateX(-50%)',
                                width: '20px',
                                height: '20px',
                                background: 'white',
                                borderRadius: '50%',
                                border: `3px solid ${result.color}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                            <span>15</span>
                            <span>18.5</span>
                            <span>25</span>
                            <span>30</span>
                            <span>40</span>
                        </div>
                    </div>

                    {/* Categories */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '0.5rem' }}>
                        {[
                            { label: 'Underweight', range: '< 18.5', color: '#3b82f6' },
                            { label: 'Normal', range: '18.5 - 24.9', color: '#22c55e' },
                            { label: 'Overweight', range: '25 - 29.9', color: '#f59e0b' },
                            { label: 'Obese', range: '≥ 30', color: '#ef4444' },
                        ].map((cat) => (
                            <div key={cat.label} style={{
                                padding: '0.6rem',
                                background: result.category === cat.label ? `${cat.color}20` : 'var(--bg-secondary)',
                                border: `1px solid ${result.category === cat.label ? cat.color : 'var(--glass-border)'}`,
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}>
                                <div style={{ width: '8px', height: '8px', background: cat.color, borderRadius: '50%', margin: '0 auto 0.3rem' }} />
                                <div style={{ color: 'var(--text-primary)', fontSize: '0.7rem', fontWeight: 600 }}>{cat.label}</div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.6rem' }}>{cat.range}</div>
                            </div>
                        ))}
                    </div>

                    {/* Ideal Weight & Advice */}
                    <div style={{
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <Info size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{result.advice}</p>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                    Ideal weight range: <strong style={{ color: 'var(--text-primary)' }}>{result.idealMin} - {result.idealMax} kg</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!result && (
                <div className={styles.emptyState}>
                    <Activity size={48} color="var(--primary)" />
                    <p>Enter your weight and height to calculate BMI</p>
                </div>
            )}
        </div>
    );
}
