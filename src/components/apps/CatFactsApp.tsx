'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { Cat, RefreshCw, Copy, Check, AlertCircle, Heart } from 'lucide-react';

interface CatFact {
    fact: string;
    length: number;
}

export default function CatFactsApp() {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);

    const { data: fact, loading, error, execute } = useAsync<CatFact>(
        () => httpClient<CatFact>('https://catfact.ninja/fact'),
        []
    );

    const copyFact = async () => {
        if (fact) {
            await navigator.clipboard.writeText(fact.fact);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getNewFact = () => {
        setLiked(false);
        execute();
    };

    return (
        <div className={styles.appContainer}>
            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Finding a cat fact...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                    <p>Failed to fetch fact</p>
                    <button onClick={execute} className={styles.actionBtn}>
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            ) : fact ? (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.08))',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: '24px',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)',
                    }}>
                        <Cat size={36} color="white" />
                    </div>

                    <p style={{
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem',
                        maxWidth: '500px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        {fact.fact}
                    </p>

                    <div className={styles.actions}>
                        <button onClick={getNewFact} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                            <RefreshCw size={16} /> New Fact
                        </button>
                        <button onClick={copyFact} className={styles.actionBtn}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={() => setLiked(!liked)}
                            className={styles.actionBtn}
                            style={liked ? { background: 'rgba(236, 72, 153, 0.1)', borderColor: '#ec4899', color: '#ec4899' } : {}}
                        >
                            <Heart size={16} fill={liked ? '#ec4899' : 'transparent'} />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
