'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { User, Shuffle } from 'lucide-react';

export default function RandomNameApp() {
    const [count, setCount] = useState(5);
    const [gender, setGender] = useState<'any' | 'male' | 'female'>('any');
    const [names, setNames] = useState<string[]>([]);

    const firstNamesMale = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher'];
    const firstNamesFemale = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez'];

    const generate = () => {
        const results = [];
        for (let i = 0; i < count; i++) {
            let firstNamePool = gender === 'male' ? firstNamesMale : gender === 'female' ? firstNamesFemale : [...firstNamesMale, ...firstNamesFemale];
            const firstName = firstNamePool[Math.floor(Math.random() * firstNamePool.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            results.push(`${firstName} ${lastName}`);
        }
        setNames(results);
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Count</label>
                    <input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        min="1" max="50" className={styles.input} style={{ marginBottom: 0 }} />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className={styles.select} style={{ marginBottom: 0 }}>
                        <option value="any">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>

            <button onClick={generate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Shuffle size={18} /> Generate Names
            </button>

            {names.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {names.map((name, i) => (
                        <div key={i} style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <User size={20} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontWeight: '600' }}>{name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
