'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Calendar, Clock, Timer, ArrowRight, RefreshCw } from 'lucide-react';

export default function DateCalculatorApp() {
    const [tab, setTab] = useState<'diff' | 'add'>('diff');
    const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
    const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);
    const [addDays, setAddDays] = useState(30);
    const [addUnit, setAddUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');

    const calculateDiff = () => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffMs = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);
        const diffYears = Math.floor(diffDays / 365.25);

        return { days: diffDays, weeks: diffWeeks, months: diffMonths, years: diffYears };
    };

    const calculateAdd = () => {
        const d = new Date(date1);
        switch (addUnit) {
            case 'days':
                d.setDate(d.getDate() + addDays);
                break;
            case 'weeks':
                d.setDate(d.getDate() + addDays * 7);
                break;
            case 'months':
                d.setMonth(d.getMonth() + addDays);
                break;
            case 'years':
                d.setFullYear(d.getFullYear() + addDays);
                break;
        }
        return d;
    };

    const diff = calculateDiff();
    const addResult = calculateAdd();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${tab === 'diff' ? styles.active : ''}`}
                    onClick={() => setTab('diff')}
                >
                    <Timer size={16} /> Date Difference
                </button>
                <button
                    className={`${styles.tabBtn} ${tab === 'add' ? styles.active : ''}`}
                    onClick={() => setTab('add')}
                >
                    <Calendar size={16} /> Add/Subtract
                </button>
            </div>

            {tab === 'diff' ? (
                <>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        border: '1px solid var(--glass-border)',
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-tertiary)',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                }}>
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={date1}
                                    onChange={(e) => setDate1(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                            <ArrowRight size={24} color="var(--primary)" style={{ marginTop: '1.5rem' }} />
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-tertiary)',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                }}>
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={date2}
                                    onChange={(e) => setDate2(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{diff.days.toLocaleString()}</span>
                            <span className={styles.statLabel}>Days</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{diff.weeks.toLocaleString()}</span>
                            <span className={styles.statLabel}>Weeks</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{diff.months.toLocaleString()}</span>
                            <span className={styles.statLabel}>Months</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{diff.years.toLocaleString()}</span>
                            <span className={styles.statLabel}>Years</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        border: '1px solid var(--glass-border)',
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: 'var(--text-tertiary)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                            }}>
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={date1}
                                onChange={(e) => setDate1(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-tertiary)',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                }}>
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={addDays}
                                    onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
                                    className={styles.searchInput}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-tertiary)',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                }}>
                                    Unit
                                </label>
                                <select
                                    value={addUnit}
                                    onChange={(e) => setAddUnit(e.target.value as typeof addUnit)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '14px',
                                        color: 'var(--text-primary)',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Result</p>
                        <p style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>
                            {formatDate(addResult)}
                        </p>
                    </div>
                </>
            )}

            <div className={styles.actions}>
                <button
                    onClick={() => {
                        setDate1(new Date().toISOString().split('T')[0]);
                        setDate2(new Date().toISOString().split('T')[0]);
                    }}
                    className={styles.actionBtn}
                >
                    <Clock size={16} /> Today
                </button>
            </div>
        </div>
    );
}
