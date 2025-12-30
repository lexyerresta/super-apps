'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Type, Copy } from 'lucide-react';

export default function RomanNumeralApp() {
    const [mode, setMode] = useState<'to' | 'from'>('to');
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const toRoman = (num: number): string => {
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        let roman = '';
        for (let i = 0; i < values.length; i++) {
            while (num >= values[i]) {
                roman += numerals[i];
                num -= values[i];
            }
        }
        return roman;
    };

    const fromRoman = (roman: string): number => {
        const map: any = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let result = 0;
        for (let i = 0; i < roman.length; i++) {
            const current = map[roman[i]];
            const next = map[roman[i + 1]];
            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }
        return result;
    };

    const convert = () => {
        if (!input) return;
        if (mode === 'to') {
            const num = parseInt(input);
            if (isNaN(num) || num < 1 || num > 3999) {
                setResult('Invalid (1-3999)');
                return;
            }
            setResult(toRoman(num));
        } else {
            if (!/^[IVXLCDM]+$/i.test(input.toUpperCase())) {
                setResult('Invalid roman numeral');
                return;
            }
            setResult(fromRoman(input.toUpperCase()).toString());
        }
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {(['to', 'from'] as const).map(m => (
                    <button key={m} onClick={() => { setMode(m); setInput(''); setResult(''); }}
                        style={{
                            flex: 1, padding: '0.75rem', border: 'none', borderRadius: '10px',
                            background: mode === m ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                            color: mode === m ? 'white' : 'var(--text-primary)',
                            fontWeight: '600', cursor: 'pointer'
                        }}>
                        {m === 'to' ? 'Number → Roman' : 'Roman → Number'}
                    </button>
                ))}
            </div>
            <div className={styles.inputGroup}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && convert()}
                    placeholder={mode === 'to' ? 'Enter number (1-3999)' : 'Enter roman (I, V, X, L, C, D, M)'}
                    className={styles.input} style={{ fontSize: '1.25rem', textAlign: 'center', textTransform: 'uppercase' }} />
            </div>
            <button onClick={convert} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>Convert</button>
            {result && (
                <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>{result}</div>
                </div>
            )}
        </div>
    );
}
