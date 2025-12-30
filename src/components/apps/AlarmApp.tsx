'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { AlarmClock, Play, Pause, X } from 'lucide-react';

export default function AlarmApp() {
    const [time, setTime] = useState('');
    const [alarms, setAlarms] = useState<{ id: string; time: string; active: boolean }[]>([]);

    const addAlarm = () => {
        if (!time) return;
        setAlarms([...alarms, { id: crypto.randomUUID(), time, active: true }]);
        setTime('');
    };

    const removeAlarm = (id: string) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Set Alarm Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                    className={styles.input} style={{ fontSize: '1.25rem' }} />
            </div>

            <button onClick={addAlarm} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <AlarmClock size={18} /> Add Alarm
            </button>

            {alarms.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {alarms.map(alarm => (
                        <div key={alarm.id} style={{
                            padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <AlarmClock size={24} style={{ color: 'var(--primary)' }} />
                                <span style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'monospace' }}>{alarm.time}</span>
                            </div>
                            <button onClick={() => removeAlarm(alarm.id)}
                                style={{
                                    padding: '0.5rem', border: 'none', borderRadius: '8px',
                                    background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex'
                                }}>
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {alarms.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    No alarms set
                </div>
            )}
        </div>
    );
}
