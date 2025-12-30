'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Binary, ArrowUpDown, Copy, Check, Trash2 } from 'lucide-react';

export default function Base64App() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleConvert = () => {
        setError('');
        try {
            if (mode === 'encode') {
                setOutput(btoa(unescape(encodeURIComponent(input))));
            } else {
                setOutput(decodeURIComponent(escape(atob(input))));
            }
        } catch (e) {
            setError('Invalid input for ' + mode + 'ing');
            setOutput('');
        }
    };

    const handleSwap = () => {
        setMode(mode === 'encode' ? 'decode' : 'encode');
        setInput(output);
        setOutput(input);
        setError('');
    };

    const copyOutput = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const clear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${mode === 'encode' ? styles.active : ''}`}
                    onClick={() => { setMode('encode'); setError(''); }}
                >
                    Encode
                </button>
                <button
                    className={`${styles.tabBtn} ${mode === 'decode' ? styles.active : ''}`}
                    onClick={() => { setMode('decode'); setError(''); }}
                >
                    Decode
                </button>
            </div>

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
                        letterSpacing: '0.5px',
                    }}>
                        {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                        className={styles.searchInput}
                        style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'monospace' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <button
                        onClick={handleSwap}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                        }}
                    >
                        <ArrowUpDown size={18} />
                    </button>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                    </label>
                    <div style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        border: error ? '1px solid var(--accent-red)' : '1px solid var(--primary)',
                        borderRadius: '14px',
                        minHeight: '100px',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: error ? 'var(--accent-red)' : 'var(--text-primary)',
                        wordBreak: 'break-all',
                        lineHeight: 1.5,
                    }}>
                        {error || output || <span style={{ color: 'var(--text-tertiary)' }}>Output will appear here...</span>}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button onClick={handleConvert} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    <Binary size={16} /> {mode === 'encode' ? 'Encode' : 'Decode'}
                </button>
                <button onClick={copyOutput} className={styles.actionBtn} disabled={!output}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={clear} className={styles.actionBtn}>
                    <Trash2 size={16} /> Clear
                </button>
            </div>
        </div>
    );
}
