'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Binary, Copy, Check, RefreshCw, ArrowUpDown } from 'lucide-react';

type Base = 'decimal' | 'binary' | 'octal' | 'hex';

export default function NumberBaseApp() {
    const [value, setValue] = useState('255');
    const [fromBase, setFromBase] = useState<Base>('decimal');
    const [copied, setCopied] = useState('');

    const bases: { id: Base; label: string; radix: number; prefix: string }[] = [
        { id: 'decimal', label: 'Decimal', radix: 10, prefix: '' },
        { id: 'binary', label: 'Binary', radix: 2, prefix: '0b' },
        { id: 'octal', label: 'Octal', radix: 8, prefix: '0o' },
        { id: 'hex', label: 'Hexadecimal', radix: 16, prefix: '0x' },
    ];

    const conversions = useMemo(() => {
        const radix = bases.find(b => b.id === fromBase)?.radix || 10;
        const cleanValue = value.replace(/^(0x|0b|0o)/i, '');
        const decimal = parseInt(cleanValue, radix);

        if (isNaN(decimal) || decimal < 0) {
            return { decimal: '0', binary: '0', octal: '0', hex: '0' };
        }

        return {
            decimal: decimal.toString(10),
            binary: decimal.toString(2),
            octal: decimal.toString(8),
            hex: decimal.toString(16).toUpperCase(),
        };
    }, [value, fromBase]);

    const copyValue = async (key: string, val: string) => {
        await navigator.clipboard.writeText(val);
        setCopied(key);
        setTimeout(() => setCopied(''), 2000);
    };

    const formatBinary = (bin: string) => {
        return bin.replace(/(.{4})/g, '$1 ').trim();
    };

    return (
        <div className={styles.appContainer}>
            {/* Input */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    {bases.map((b) => (
                        <button
                            key={b.id}
                            onClick={() => setFromBase(b.id)}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                background: fromBase === b.id ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: fromBase === b.id ? 'white' : 'var(--text-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`Enter ${fromBase} number...`}
                    className={styles.searchInput}
                    style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center', fontFamily: 'monospace' }}
                />
            </div>

            {/* Conversions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bases.map((b) => (
                    <div
                        key={b.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.25rem',
                            background: fromBase === b.id ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' : 'var(--bg-secondary)',
                            border: fromBase === b.id ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--glass-border)',
                            borderRadius: '12px',
                        }}
                    >
                        <div style={{ width: '90px' }}>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{b.label}</span>
                            <span style={{ color: 'var(--primary)', fontSize: '0.7rem', marginLeft: '0.25rem' }}>{b.prefix}</span>
                        </div>
                        <code style={{
                            flex: 1,
                            color: 'var(--text-primary)',
                            fontSize: b.id === 'binary' ? '0.9rem' : '1.1rem',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            wordBreak: 'break-all',
                        }}>
                            {b.id === 'binary' ? formatBinary(conversions[b.id]) : conversions[b.id]}
                        </code>
                        <button
                            onClick={() => copyValue(b.id, conversions[b.id])}
                            style={{
                                width: '36px', height: '36px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'var(--bg-tertiary)',
                                border: 'none',
                                borderRadius: '8px',
                                color: copied === b.id ? 'var(--accent-green)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                            }}
                        >
                            {copied === b.id ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                ))}
            </div>

            {/* Quick Values */}
            <div>
                <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Quick Values</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['255', '256', '1024', '65535', '16777215'].map((v) => (
                        <button
                            key={v}
                            onClick={() => { setValue(v); setFromBase('decimal'); }}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '6px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                                cursor: 'pointer',
                            }}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
