'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Cake, Calendar, Clock, Heart, RefreshCw } from 'lucide-react';

export default function AgeCalculatorApp() {
    const [birthDate, setBirthDate] = useState('');
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

    const age = useMemo(() => {
        if (!birthDate) return null;

        const birth = new Date(birthDate);
        const target = new Date(targetDate);

        if (birth > target) return null;

        let years = target.getFullYear() - birth.getFullYear();
        let months = target.getMonth() - birth.getMonth();
        let days = target.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate totals
        const diffTime = Math.abs(target.getTime() - birth.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;

        // Next birthday
        const thisYearBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
        let nextBirthday = thisYearBday;
        if (thisYearBday <= target) {
            nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
        }
        const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

        // Zodiac sign
        const month = birth.getMonth() + 1;
        const day = birth.getDate();
        let zodiac = '';
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiac = '♈ Aries';
        else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiac = '♉ Taurus';
        else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiac = '♊ Gemini';
        else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiac = '♋ Cancer';
        else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiac = '♌ Leo';
        else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiac = '♍ Virgo';
        else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiac = '♎ Libra';
        else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiac = '♏ Scorpio';
        else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiac = '♐ Sagittarius';
        else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiac = '♑ Capricorn';
        else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiac = '♒ Aquarius';
        else zodiac = '♓ Pisces';

        return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysUntilBirthday, zodiac };
    }, [birthDate, targetDate]);

    return (
        <div className={styles.appContainer}>
            {/* Date Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        <Cake size={12} style={{ display: 'inline', marginRight: '4px' }} /> Birth Date
                    </label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className={styles.searchInput}
                        max={targetDate}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> As of Date
                    </label>
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {age ? (
                <>
                    {/* Main Age Display */}
                    <div style={{
                        padding: '2rem',
                        background: 'var(--gradient-primary)',
                        borderRadius: '20px',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Your Age</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            {[
                                { value: age.years, label: 'Years' },
                                { value: age.months, label: 'Months' },
                                { value: age.days, label: 'Days' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{item.value}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', textTransform: 'uppercase' }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                        {[
                            { label: 'Total Days', value: age.totalDays.toLocaleString() },
                            { label: 'Total Weeks', value: age.totalWeeks.toLocaleString() },
                            { label: 'Total Months', value: age.totalMonths.toLocaleString() },
                            { label: 'Total Hours', value: age.totalHours.toLocaleString() },
                        ].map((item) => (
                            <div key={item.label} style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                textAlign: 'center',
                            }}>
                                <div style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>{item.value}</div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', textTransform: 'uppercase' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Next Birthday & Zodiac */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                        <div style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                            borderRadius: '14px',
                            textAlign: 'center',
                        }}>
                            <Cake size={24} color="#ec4899" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800 }}>{age.daysUntilBirthday}</div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Days until birthday</div>
                        </div>
                        <div style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '14px',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{age.zodiac.split(' ')[0]}</div>
                            <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>{age.zodiac.split(' ')[1]}</div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Zodiac Sign</div>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.emptyState}>
                    <Cake size={48} color="var(--primary)" />
                    <p>Enter your birth date to calculate age</p>
                </div>
            )}
        </div>
    );
}
