'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Binary, ArrowLeftRight } from 'lucide-react';

export default function BinaryCalculatorApp() {
    const [mode, setMode] = useState<'dec2bin' | 'bin2dec'>('dec2bin');
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const convert = () => {
        if (!input) return;

        if (mode === 'dec2bin') {
            const num = parseInt(input);
            if (isNaN(num)) {
                setResult('Invalid');
                return;
            }
            setResult(num.toString(2));
        } else {
            if (!/^[01]+$/.test(input)) {
                setResult('Invalid binary');
                return;
            }
            setResult(parseInt(input, 2).toString());
        }
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => { setMode('dec2bin'); setInput(''); setResult(''); }}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '10px',
                        background: mode === 'dec2bin' ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                        color: mode === 'dec2bin' ? 'white' : 'var(--text-primary)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Decimal → Binary
                </button>
                <button
                    onClick={() => { setMode('bin2dec'); setInput(''); setResult(''); }}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '10px',
                        background: mode === 'bin2dec' ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                        color: mode === 'bin2dec' ? 'white' : 'var(--text-primary)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Binary → Decimal
                </button>
            </div>

            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && convert()}
                    placeholder={mode === 'dec2bin' ? 'Enter decimal number' : 'Enter binary (0s and 1s)'}
                    className={styles.input}
                    style={{ fontSize: '1.25rem', textAlign: 'center', fontFamily: 'monospace' }}
                />
            </div>

            <button onClick={convert} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <ArrowLeftRight size={18} />
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
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
