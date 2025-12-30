'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { Globe, Plus, Trash2, Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

const TIMEZONES = [
    { id: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩' },
    { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
    { id: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
    { id: 'Asia/Seoul', city: 'Seoul', country: 'South Korea', flag: '🇰🇷' },
    { id: 'Asia/Shanghai', city: 'Shanghai', country: 'China', flag: '🇨🇳' },
    { id: 'Asia/Dubai', city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
    { id: 'Europe/London', city: 'London', country: 'UK', flag: '🇬🇧' },
    { id: 'Europe/Paris', city: 'Paris', country: 'France', flag: '🇫🇷' },
    { id: 'Europe/Berlin', city: 'Berlin', country: 'Germany', flag: '🇩🇪' },
    { id: 'America/New_York', city: 'New York', country: 'USA', flag: '🇺🇸' },
    { id: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
    { id: 'America/Chicago', city: 'Chicago', country: 'USA', flag: '🇺🇸' },
    { id: 'Australia/Sydney', city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
    { id: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand', flag: '🇳🇿' },
];

export default function WorldClockApp() {
    const [selectedZones, setSelectedZones] = useState(['Asia/Jakarta', 'America/New_York', 'Europe/London', 'Asia/Tokyo']);
    const [now, setNow] = useState(new Date());
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getTimeInZone = (tz: string) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(now);
    };

    const getDateInZone = (tz: string) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }).format(now);
    };

    const getHourInZone = (tz: string) => {
        const hour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(now));
        return hour;
    };

    const getDayPeriod = (hour: number) => {
        if (hour >= 6 && hour < 12) return { icon: Sunrise, color: '#f59e0b', label: 'Morning' };
        if (hour >= 12 && hour < 18) return { icon: Sun, color: '#eab308', label: 'Afternoon' };
        if (hour >= 18 && hour < 21) return { icon: Sunset, color: '#f97316', label: 'Evening' };
        return { icon: Moon, color: '#6366f1', label: 'Night' };
    };

    const addZone = (tz: string) => {
        if (!selectedZones.includes(tz)) {
            setSelectedZones([...selectedZones, tz]);
        }
        setShowAdd(false);
    };

    const removeZone = (tz: string) => {
        setSelectedZones(selectedZones.filter(z => z !== tz));
    };

    return (
        <div className={styles.appContainer}>
            {/* Selected Clocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflow: 'auto' }}>
                {selectedZones.map((tz) => {
                    const zone = TIMEZONES.find(t => t.id === tz);
                    if (!zone) return null;
                    const hour = getHourInZone(tz);
                    const period = getDayPeriod(hour);
                    const PeriodIcon = period.icon;

                    return (
                        <div key={tz} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.25rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '14px',
                        }}>
                            <div style={{ fontSize: '2rem' }}>{zone.flag}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>{zone.city}</span>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{zone.country}</span>
                                </div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{getDateInZone(tz)}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <PeriodIcon size={18} color={period.color} />
                                <span style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace' }}>
                                    {getTimeInZone(tz)}
                                </span>
                            </div>
                            <button onClick={() => removeZone(tz)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.5rem' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Add Button */}
            <button onClick={() => setShowAdd(!showAdd)} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%' }}>
                <Plus size={16} /> Add Timezone
            </button>

            {/* Add Zone Selector */}
            {showAdd && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', maxHeight: '200px', overflow: 'auto', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '14px' }}>
                    {TIMEZONES.filter(tz => !selectedZones.includes(tz.id)).map((tz) => (
                        <button
                            key={tz.id}
                            onClick={() => addZone(tz.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                            }}
                        >
                            <span>{tz.flag}</span>
                            <span>{tz.city}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
