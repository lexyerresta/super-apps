'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Palette, Copy, Check, Shuffle, Download } from 'lucide-react';

export default function RandomColorApp() {
    const [color, setColor] = useState('#6366f1');
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'hex' | 'rgb' | 'hsl'>('hex');

    const generateColor = () => {
        const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor(hex);
    };

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const hexToHsl = (hex: string) => {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 :
                max === g ? ((b - r) / d + 2) / 6 :
                    ((r - g) / d + 4) / 6;
        } else {
            s = 0;
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    const getColorValue = () => {
        switch (mode) {
            case 'rgb': return hexToRgb(color);
            case 'hsl': return hexToHsl(color);
            default: return color;
        }
    };

    const copyColor = () => {
        navigator.clipboard.writeText(getColorValue());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.appContainer}>
            <div style={{
                width: '100%',
                height: '250px',
                background: color,
                borderRadius: '16px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'background 0.3s ease'
            }}>
                <Palette size={64} color="rgba(255,255,255,0.9)" />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {(['hex', 'rgb', 'hsl'] as const).map(m => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '10px',
                            background: mode === m ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                            color: mode === m ? 'white' : 'var(--text-primary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem'
                        }}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={getColorValue()}
                    readOnly
                    className={styles.input}
                    style={{
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                    onClick={generateColor}
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                >
                    <Shuffle size={18} />
                    Generate
                </button>

                <button
                    onClick={copyColor}
                    className={styles.actionBtn}
                    style={{
                        background: copied ? '#10b981' : 'var(--bg-secondary)',
                        color: copied ? 'white' : 'var(--text-primary)'
                    }}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
}
