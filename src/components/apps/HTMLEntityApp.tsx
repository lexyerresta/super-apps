'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Code } from 'lucide-react';

export default function HTMLEntityApp() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const encode = (str: string) => {
        return str.replace(/[&<>"']/g, (char) => {
            const entities: any = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return entities[char] || char;
        });
    };

    const decode = (str: string) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        return textarea.value;
    };

    const process = () => {
        setOutput(mode === 'encode' ? encode(input) : decode(input));
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
                    placeholder={mode === 'encode' ? 'Enter HTML to encode' : 'Enter entities to decode'}
                    className={styles.input} rows={5} style={{ resize: 'vertical', fontFamily: 'monospace' }} />
            </div>

            <button onClick={process} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1rem' }}>
                {mode === 'encode' ? 'Encode Entities' : 'Decode Entities'}
            </button>

            {output && (
                <div className={styles.inputGroup}>
                    <textarea value={output} readOnly className={styles.input} rows={5}
                        style={{ resize: 'vertical', background: 'var(--bg-secondary)', fontFamily: 'monospace' }} />
                </div>
            )}
        </div>
    );
}
