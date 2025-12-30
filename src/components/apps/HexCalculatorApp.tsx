'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Binary, Hash } from 'lucide-react';

export default function HexCalculatorApp() {
    const [mode, setMode] = useState<'dec2hex' | 'hex2dec'>('dec2hex');
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const convert = () => {
        if (!input) return;

        if (mode === 'dec2hex') {
            const num = parseInt(input);
            if (isNaN(num)) {
                setResult('Invalid');
                return;
            }
            setResult(num.toString(16).toUpperCase());
        } else {
            if (!/^[0-9A-Fa-f]+$/.test(input)) {
                setResult('Invalid hex');
                return;
            }
            setResult(parseInt(input, 16).toString());
        }
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => { setMode('dec2hex'); setInput(''); setResult(''); }}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '10px',
                        background: mode === 'dec2hex' ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                        color: mode === 'dec2hex' ? 'white' : 'var(--text-primary)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Decimal → Hex
                </button>
                <button
                    onClick={() => { setMode('hex2dec'); setInput(''); setResult(''); }}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '10px',
                        background: mode === 'hex2dec' ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                        color: mode === 'hex2dec' ? 'white' : 'var(--text-primary)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Hex → Decimal
                </button>
            </div>

            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && convert()}
                    placeholder={mode === 'dec2hex' ? 'Enter decimal' : 'Enter hex (0-9, A-F)'}
                    className={styles.input}
                    style={{ fontSize: '1.25rem', textAlign: 'center', fontFamily: 'monospace' }}
                />
            </div>

            <button onClick={convert} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Hash size={18} />
                Convert
            </button>

            {result && (
                <div style={{
                    padding: '2rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Result
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
