'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Gauge } from 'lucide-react';

export default function SpeedConverterApp() {
    const [value, setValue] = useState('');
    const [from, setFrom] = useState<'kmh' | 'mph' | 'ms'>('kmh');
    const [results, setResults] = useState<any>(null);

    const convert = () => {
        const num = parseFloat(value);
        if (isNaN(num)) return;

        let ms = 0;
        switch (from) {
            case 'kmh': ms = num / 3.6; break;
            case 'mph': ms = num * 0.44704; break;
            case 'ms': ms = num; break;
        }

        setResults({
            kmh: (ms * 3.6).toFixed(2),
            mph: (ms / 0.44704).toFixed(2),
            ms: ms.toFixed(2)
        });
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && convert()}
                    placeholder="Enter speed" className={styles.input} style={{ marginBottom: 0 }} />
                <select value={from} onChange={(e) => setFrom(e.target.value as any)} className={styles.select} style={{ marginBottom: 0 }}>
                    <option value="kmh">km/h</option>
                    <option value="mph">mph</option>
                    <option value="ms">m/s</option>
                </select>
            </div>
            <button onClick={convert} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>Convert</button>
            {results && (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[{ key: 'kmh', label: 'km/h', color: '#3b82f6' }, { key: 'mph', label: 'mph', color: '#ef4444' }, { key: 'ms', label: 'm/s', color: '#10b981' }].map(({ key, label, color }) => (
                        <div key={key} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600' }}>{label}</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: '700', color }}>{results[key]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
