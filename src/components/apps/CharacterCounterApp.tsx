'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Type } from 'lucide-react';

export default function CharacterCounterApp() {
    const [text, setText] = useState('');

    const stats = {
        characters: text.length,
        charactersNoSpaces: text.replace(/\s/g, '').length,
        words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
        sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
        paragraphs: text.split(/\n+/).filter(p => p.trim().length > 0).length,
        lines: text.split(/\n/).length,
        readTime: Math.ceil(text.trim().split(/\s+/).filter(w => w.length > 0).length / 200) || 0
    };

    return (
        <div className={styles.appContainer}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing..."
                className={styles.input}
                rows={8}
                style={{ resize: 'vertical', marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key} style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {value}{key === 'readTime' ? ' min' : ''}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
