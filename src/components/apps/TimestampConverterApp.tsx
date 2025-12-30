'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Clock, Calendar } from 'lucide-react';

export default function TimestampConverterApp() {
    const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
    const [datetime, setDatetime] = useState('');

    const unixToHuman = (timestamp: string) => {
        const num = parseInt(timestamp);
        if (isNaN(num)) return '';
        const date = new Date(num * 1000);
        return {
            iso: date.toISOString(),
            local: date.toLocaleString(),
            utc: date.toUTCString(),
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    };

    const humanToUnix = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return Math.floor(date.getTime() / 1000).toString();
    };

    const result = unix ? unixToHuman(unix) : null;

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                    <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Unix Timestamp (seconds)
                </label>
                <input type="text" value={unix} onChange={(e) => setUnix(e.target.value)} placeholder="1704038400" className={styles.input} style={{ fontSize: '1.125rem', fontFamily: 'monospace', textAlign: 'center' }} />
            </div>

            {result && (
                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '1.5rem', display: 'grid', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Human Readable:</div>
                    {Object.entries(result).map(([key, value]) => (
                        <div key={key} style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{key}</span>
                            <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: '500' }}>{value}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                    <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Date/Time to Unix
                </label>
                <input type="datetime-local" value={datetime} onChange={(e) => { setDatetime(e.target.value); setUnix(humanToUnix(e.target.value)); }} className={styles.input} />
            </div>

            <button onClick={() => setUnix(Math.floor(Date.now() / 1000).toString())} className={styles.actionBtn} style={{ width: '100%' }}>
                Use Current Time
            </button>
        </div>
    );
}
