'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { JokesService } from '@/services/api.service';
import type { Joke } from '@/types';
import { Smile, RefreshCw, AlertCircle, Eye } from 'lucide-react';

const categories = [
    { id: 'Any', label: 'Any', color: '#6366f1' },
    { id: 'Programming', label: 'Programming', color: '#22d3ee' },
    { id: 'Misc', label: 'Misc', color: '#a78bfa' },
    { id: 'Pun', label: 'Pun', color: '#fb923c' },
    { id: 'Spooky', label: 'Spooky', color: '#f472b6' },
];

export default function JokesApp() {
    const [showPunchline, setShowPunchline] = useState(false);
    const [category, setCategory] = useState('Any');

    const { data: joke, loading, error, execute } = useAsync<Joke>(
        () => JokesService.getRandomJoke(category),
        [category]
    );

    const getNewJoke = () => {
        setShowPunchline(false);
        execute();
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setCategory(cat.id);
                            setShowPunchline(false);
                        }}
                        style={{
                            padding: '0.5rem 1rem',
                            background: category === cat.id ? cat.color : 'var(--bg-secondary)',
                            border: '1px solid',
                            borderColor: category === cat.id ? 'transparent' : 'var(--glass-border)',
                            borderRadius: '50px',
                            color: category === cat.id ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Finding a joke...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}>
                        <AlertCircle size={28} color="white" />
                    </div>
                    <p>No jokes available</p>
                    <button onClick={getNewJoke} className={styles.actionBtn}>
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            ) : joke ? (
                <div className={styles.jokeCard}>
                    <div className={styles.jokeEmoji}>
                        <Smile size={32} color="white" />
                    </div>

                    {joke.type === 'single' ? (
                        <p className={styles.jokeSetup}>{joke.joke}</p>
                    ) : (
                        <>
                            <p className={styles.jokeSetup}>{joke.setup}</p>
                            {showPunchline ? (
                                <p className={styles.jokeDelivery}>{joke.delivery}</p>
                            ) : (
                                <button
                                    onClick={() => setShowPunchline(true)}
                                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                    style={{ marginTop: '1.5rem' }}
                                >
                                    <Eye size={16} /> Show Punchline
                                </button>
                            )}
                        </>
                    )}

                    <div className={styles.actions} style={{ marginTop: '1.5rem' }}>
                        <button onClick={getNewJoke} className={styles.actionBtn}>
                            <RefreshCw size={16} /> Next Joke
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
