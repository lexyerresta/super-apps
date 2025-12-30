'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Thermometer, ArrowRightLeft } from 'lucide-react';

export default function TemperatureApp() {
    const [value, setValue] = useState('');
    const [from, setFrom] = useState<'C' | 'F' | 'K'>('C');
    const [results, setResults] = useState<any>(null);

    const convert = () => {
        const num = parseFloat(value);
        if (isNaN(num)) return;

        let celsius = 0;
        switch (from) {
            case 'C': celsius = num; break;
            case 'F': celsius = (num - 32) * 5 / 9; break;
            case 'K': celsius = num - 273.15; break;
        }

        setResults({
            celsius: celsius.toFixed(2),
            fahrenheit: (celsius * 9 / 5 + 32).toFixed(2),
            kelvin: (celsius + 273.15).toFixed(2)
        });
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && convert()}
                        placeholder="Enter temperature"
                        className={styles.input}
                        style={{ marginBottom: 0, fontSize: '1.25rem' }}
                    />
                </div>
                <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value as any)}
                    className={styles.select}
                    style={{ marginBottom: 0 }}
                >
                    <option value="C">°C</option>
                    <option value="F">°F</option>
                    <option value="K">K</option>
                </select>
            </div>

            <button onClick={convert} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <ArrowRightLeft size={18} />
                Convert
            </button>

            {results && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        borderRadius: '16px',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Celsius</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{results.celsius}°C</div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #ef4444, #f97316)',
                        borderRadius: '16px',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Fahrenheit</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{results.fahrenheit}°F</div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                        borderRadius: '16px',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Kelvin</div>
                        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{results.kelvin}K</div>
                    </div>
                </div>
            )}
        </div>
    );
}
