'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { CalendarDays, Clock, RefreshCw, Trash2, Plus, AlertCircle } from 'lucide-react';

interface CountdownEvent {
    id: string;
    name: string;
    date: string;
    color: string;
}

export default function CountdownApp() {
    const [events, setEvents] = useState<CountdownEvent[]>([
        { id: '1', name: 'New Year 2026', date: '2026-01-01T00:00', color: '#6366f1' },
    ]);
    const [newName, setNewName] = useState('');
    const [newDate, setNewDate] = useState('');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const addEvent = () => {
        if (newName && newDate) {
            setEvents([...events, { id: Date.now().toString(), name: newName, date: newDate, color: `hsl(${Math.random() * 360}, 70%, 60%)` }]);
            setNewName(''); setNewDate('');
        }
    };

    const removeEvent = (id: string) => setEvents(events.filter(e => e.id !== id));

    const getTimeLeft = (targetDate: string) => {
        const target = new Date(targetDate).getTime();
        const diff = target - now.getTime();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
            passed: false
        };
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Event name..." className={styles.searchInput} style={{ flex: 2, minWidth: '120px' }} />
                <input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} className={styles.searchInput} style={{ flex: 2, minWidth: '150px' }} />
                <button onClick={addEvent} className={`${styles.actionBtn} ${styles.primaryBtn}`} disabled={!newName || !newDate}><Plus size={16} /> Add</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflow: 'auto' }}>
                {events.map((event) => {
                    const time = getTimeLeft(event.date);
                    return (
                        <div key={event.id} style={{ padding: '1.25rem', background: `linear-gradient(135deg, ${event.color}15, ${event.color}08)`, border: `1px solid ${event.color}30`, borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '10px', height: '10px', background: event.color, borderRadius: '50%' }} />
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{event.name}</span>
                                </div>
                                <button onClick={() => removeEvent(event.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                            {time.passed ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)' }}>
                                    <AlertCircle size={16} /> <span>Event has passed!</span>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                    {[{ v: time.days, l: 'Days' }, { v: time.hours, l: 'Hours' }, { v: time.minutes, l: 'Mins' }, { v: time.seconds, l: 'Secs' }].map(({ v, l }) => (
                                        <div key={l} style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: event.color }}>{v}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>{l}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                <CalendarDays size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                {new Date(event.date).toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {events.length === 0 && (
                <div className={styles.emptyState}>
                    <Clock size={40} color="var(--primary)" />
                    <p>Add an event to start counting down!</p>
                </div>
            )}
        </div>
    );
}
