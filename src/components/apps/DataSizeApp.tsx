'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { HardDrive } from 'lucide-react';

export default function DataSizeApp() {
    const [value, setValue] = useState('');
    const [from, setFrom] = useState<'B' | 'KB' | 'MB' | 'GB' | 'TB'>('MB');

    const convert = () => {
        const num = parseFloat(value);
        if (isNaN(num)) return null;

        let bytes = 0;
        switch (from) {
            case 'B': bytes = num; break;
            case 'KB': bytes = num * 1024; break;
            case 'MB': bytes = num * 1024 * 1024; break;
            case 'GB': bytes = num * 1024 * 1024 * 1024; break;
            case 'TB': bytes = num * 1024 * 1024 * 1024 * 1024; break;
        }

        return {
            bytes: bytes.toFixed(0),
            kb: (bytes / 1024).toFixed(2),
            mb: (bytes / (1024 * 1024)).toFixed(2),
            gb: (bytes / (1024 * 1024 * 1024)).toFixed(4),
            tb: (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(6)
        };
    };

    const results = value ? convert() : null;

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter size" className={styles.input} style={{ marginBottom: 0 }} />
                <select value={from} onChange={(e) => setFrom(e.target.value as any)} className={styles.select} style={{ marginBottom: 0 }}>
                    <option value="B">Bytes</option>
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                    <option value="TB">TB</option>
                </select>
            </div>

            {results && (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[
                        { key: 'bytes', label: 'Bytes', color: '#6366f1' },
                        { key: 'kb', label: 'Kilobytes (KB)', color: '#3b82f6' },
                        { key: 'mb', label: 'Megabytes (MB)', color: '#10b981' },
                        { key: 'gb', label: 'Gigabytes (GB)', color: '#f59e0b' },
                        { key: 'tb', label: 'Terabytes (TB)', color: '#ef4444' }
                    ].map(({ key, label, color }) => (
                        <div key={key} style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{label}</span>
                            <span style={{ fontSize: '1.125rem', fontWeight: '700', color }}>{results[key as keyof typeof results]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
