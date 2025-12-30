'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Link, Link2 } from 'lucide-react';

export default function URLEncoderApp() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const process = () => {
        try {
            setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
        } catch (e) {
            setOutput('Invalid input');
        }
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {(['encode', 'decode'] as const).map(m => (
                    <button key={m} onClick={() => { setMode(m); setOutput(''); }}
                        style={{
                            flex: 1, padding: '0.75rem', border: 'none', borderRadius: '10px',
                            background: mode === m ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                            color: mode === m ? 'white' : 'var(--text-primary)',
                            fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize'
                        }}>
                        {m}
                    </button>
                ))}
            </div>

            <div className={styles.inputGroup}>
                <textarea value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter URL to decode'}
                    className={styles.input} rows={4} style={{ resize: 'vertical' }} />
            </div>

            <button onClick={process} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1rem' }}>
                {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>

            {output && (
                <div className={styles.inputGroup}>
                    <textarea value={output} readOnly className={styles.input} rows={4}
                        style={{ resize: 'vertical', background: 'var(--bg-secondary)', fontFamily: 'monospace' }} />
                </div>
            )}
        </div>
    );
}
