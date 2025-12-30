'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { FileJson, Copy, Check, RefreshCw, ArrowUpDown } from 'lucide-react';

export default function JsonFormatterApp() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [indentSize, setIndentSize] = useState(2);

    const formatJson = () => {
        setError('');
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, indentSize));
        } catch (e) {
            setError('Invalid JSON: ' + (e as Error).message);
            setOutput('');
        }
    };

    const minifyJson = () => {
        setError('');
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
        } catch (e) {
            setError('Invalid JSON: ' + (e as Error).message);
            setOutput('');
        }
    };

    const copyOutput = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const sampleJson = () => {
        const sample = {
            name: "SuperApps",
            version: "1.0.0",
            features: ["weather", "crypto", "notes"],
            settings: {
                theme: "light",
                notifications: true
            }
        };
        setInput(JSON.stringify(sample));
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {[2, 4].map((size) => (
                    <button
                        key={size}
                        onClick={() => setIndentSize(size)}
                        style={{
                            padding: '0.375rem 0.75rem',
                            background: indentSize === size ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                            border: '1px solid',
                            borderColor: indentSize === size ? 'transparent' : 'var(--glass-border)',
                            borderRadius: '8px',
                            color: indentSize === size ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        {size} spaces
                    </button>
                ))}
                <button
                    onClick={sampleJson}
                    style={{
                        padding: '0.375rem 0.75rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        marginLeft: 'auto',
                    }}
                >
                    Sample
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
            }}>
                <div>
                    <label style={{
                        display: 'block',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                    }}>
                        Input
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='{"key": "value"}'
                        className={styles.searchInput}
                        style={{
                            minHeight: '300px',
                            resize: 'vertical',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                        }}
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
                        Output
                    </label>
                    <div style={{
                        minHeight: '300px',
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        border: error ? '1px solid var(--accent-red)' : '1px solid var(--glass-border)',
                        borderRadius: '14px',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        color: error ? 'var(--accent-red)' : 'var(--text-primary)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflow: 'auto',
                        lineHeight: 1.5,
                    }}>
                        {error || output || <span style={{ color: 'var(--text-tertiary)' }}>Formatted JSON will appear here...</span>}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button onClick={formatJson} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    <FileJson size={16} /> Format
                </button>
                <button onClick={minifyJson} className={styles.actionBtn}>
                    <ArrowUpDown size={16} /> Minify
                </button>
                <button onClick={copyOutput} className={styles.actionBtn} disabled={!output}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
}
