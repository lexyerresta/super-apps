'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Ruler, Calculator } from 'lucide-react';

export default function AreaCalculatorApp() {
    const [shape, setShape] = useState<'square' | 'rectangle' | 'circle' | 'triangle'>('square');
    const [values, setValues] = useState({ a: '', b: '', r: '' });
    const [result, setResult] = useState('');

    const calculate = () => {
        const a = parseFloat(values.a);
        const b = parseFloat(values.b);
        const r = parseFloat(values.r);

        let area = 0;
        switch (shape) {
            case 'square':
                area = a * a;
                break;
            case 'rectangle':
                area = a * b;
                break;
            case 'circle':
                area = Math.PI * r * r;
                break;
            case 'triangle':
                area = (a * b) / 2;
                break;
        }

        setResult(area.toFixed(2));
    };

    return (
        <div className={styles.appContainer}>
            <select
                value={shape}
                onChange={(e) => { setShape(e.target.value as any); setResult(''); }}
                className={styles.select}
                style={{ marginBottom: '1.5rem' }}
            >
                <option value="square">Square</option>
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
            </select>

            {shape === 'square' && (
                <div className={styles.inputGroup}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Side</label>
                    <input
                        type="number"
                        value={values.a}
                        onChange={(e) => setValues({ ...values, a: e.target.value })}
                        placeholder="Side length"
                        className={styles.input}
                    />
                </div>
            )}

            {shape === 'rectangle' && (
                <>
                    <div className={styles.inputGroup}>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Length</label>
                        <input
                            type="number"
                            value={values.a}
                            onChange={(e) => setValues({ ...values, a: e.target.value })}
                            placeholder="Length"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Width</label>
                        <input
                            type="number"
                            value={values.b}
                            onChange={(e) => setValues({ ...values, b: e.target.value })}
                            placeholder="Width"
                            className={styles.input}
                        />
                    </div>
                </>
            )}

            {shape === 'circle' && (
                <div className={styles.inputGroup}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Radius</label>
                    <input
                        type="number"
                        value={values.r}
                        onChange={(e) => setValues({ ...values, r: e.target.value })}
                        placeholder="Radius"
                        className={styles.input}
                    />
                </div>
            )}

            {shape === 'triangle' && (
                <>
                    <div className={styles.inputGroup}>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Base</label>
                        <input
                            type="number"
                            value={values.a}
                            onChange={(e) => setValues({ ...values, a: e.target.value })}
                            placeholder="Base"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Height</label>
                        <input
                            type="number"
                            value={values.b}
                            onChange={(e) => setValues({ ...values, b: e.target.value })}
                            placeholder="Height"
                            className={styles.input}
                        />
                    </div>
                </>
            )}

            <button onClick={calculate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Calculator size={18} />
                Calculate Area
            </button>

            {result && (
                <div style={{
                    padding: '2rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Area
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {result} {shape === 'circle' ? 'units²' : 'units²'}
                    </div>
                </div>
            )}
        </div>
    );
}
