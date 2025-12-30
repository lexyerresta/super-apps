'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Diff } from 'lucide-react';

export default function TextDiffApp() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');

    const similarity = (): string => {
        if (!text1 || !text2) return '0';
        const longer = text1.length > text2.length ? text1 : text2;
        const shorter = text1.length > text2.length ? text2 : text1;

        if (longer.length === 0) return '100';

        let matches = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (shorter[i] === longer[i]) matches++;
        }

        return ((matches / longer.length) * 100).toFixed(1);
    };

    const percent = similarity();

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Text 1</label>
                <textarea value={text1} onChange={(e) => setText1(e.target.value)}
                    placeholder="Enter first text..." className={styles.input} rows={4} style={{ resize: 'vertical' }} />
            </div>

            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Text 2</label>
                <textarea value={text2} onChange={(e) => setText2(e.target.value)}
                    placeholder="Enter second text..." className={styles.input} rows={4} style={{ resize: 'vertical' }} />
            </div>

            {text1 && text2 && (
                <div style={{
                    padding: '2rem',
                    background: `linear-gradient(135deg, ${parseFloat(percent) > 70 ? '#10b981' : parseFloat(percent) > 40 ? '#f59e0b' : '#ef4444'}, #6366f1)`,
                    borderRadius: '16px',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Similarity</div>
                    <div style={{ fontSize: '3rem', fontWeight: '700' }}>{percent}%</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '1rem' }}>
                        {parseFloat(percent) > 70 ? '✓ Very Similar' : parseFloat(percent) > 40 ? '~ Somewhat Similar' : '✗ Different'}
                    </div>
                </div>
            )}
        </div>
    );
}
