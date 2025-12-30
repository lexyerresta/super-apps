'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Ratio, Lock, Unlock, Copy, Check, RefreshCw } from 'lucide-react';

const COMMON_RATIOS = [
    { name: '16:9', w: 16, h: 9, desc: 'HD Video' },
    { name: '4:3', w: 4, h: 3, desc: 'Classic' },
    { name: '1:1', w: 1, h: 1, desc: 'Square' },
    { name: '9:16', w: 9, h: 16, desc: 'Stories' },
    { name: '21:9', w: 21, h: 9, desc: 'Ultrawide' },
    { name: '3:2', w: 3, h: 2, desc: 'DSLR' },
];

export default function AspectRatioApp() {
    const [width, setWidth] = useState('1920');
    const [height, setHeight] = useState('1080');
    const [locked, setLocked] = useState<'width' | 'height' | null>(null);
    const [copied, setCopied] = useState(false);

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    const ratio = useMemo(() => {
        const w = parseInt(width) || 0;
        const h = parseInt(height) || 0;
        if (w === 0 || h === 0) return { w: 0, h: 0, decimal: 0 };
        const divisor = gcd(w, h);
        return {
            w: w / divisor,
            h: h / divisor,
            decimal: w / h,
        };
    }, [width, height]);

    const applyRatio = (rw: number, rh: number) => {
        const w = parseInt(width) || 1920;
        const h = parseInt(height) || 1080;
        if (locked === 'width') {
            setHeight(Math.round(w * rh / rw).toString());
        } else {
            setWidth(Math.round(h * rw / rh).toString());
        }
    };

    const handleWidthChange = (val: string) => {
        setWidth(val);
        if (locked === 'height' && ratio.w && ratio.h) {
            const newW = parseInt(val) || 0;
            setHeight(Math.round(newW * ratio.h / ratio.w).toString());
        }
    };

    const handleHeightChange = (val: string) => {
        setHeight(val);
        if (locked === 'width' && ratio.w && ratio.h) {
            const newH = parseInt(val) || 0;
            setWidth(Math.round(newH * ratio.w / ratio.h).toString());
        }
    };

    const copyRatio = async () => {
        await navigator.clipboard.writeText(`${ratio.w}:${ratio.h}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.appContainer}>
            {/* Visual Preview */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                background: 'var(--bg-tertiary)',
                borderRadius: '16px',
                minHeight: '150px',
            }}>
                <div style={{
                    width: `${Math.min(200, 200 * ratio.decimal)}px`,
                    height: `${Math.min(200, 200 / ratio.decimal)}px`,
                    maxWidth: '200px',
                    maxHeight: '120px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                }}>
                    {ratio.w}:{ratio.h}
                </div>
            </div>

            {/* Dimensions Input */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'end' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Width</label>
                        <button onClick={() => setLocked(locked === 'width' ? null : 'width')} style={{ background: 'transparent', border: 'none', color: locked === 'width' ? 'var(--primary)' : 'var(--text-tertiary)', cursor: 'pointer' }}>
                            {locked === 'width' ? <Lock size={12} /> : <Unlock size={12} />}
                        </button>
                    </div>
                    <input type="number" value={width} onChange={(e) => handleWidthChange(e.target.value)} className={styles.searchInput} style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600 }} />
                </div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '1.5rem', fontWeight: 300, paddingBottom: '0.5rem' }}>×</div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Height</label>
                        <button onClick={() => setLocked(locked === 'height' ? null : 'height')} style={{ background: 'transparent', border: 'none', color: locked === 'height' ? 'var(--primary)' : 'var(--text-tertiary)', cursor: 'pointer' }}>
                            {locked === 'height' ? <Lock size={12} /> : <Unlock size={12} />}
                        </button>
                    </div>
                    <input type="number" value={height} onChange={(e) => handleHeightChange(e.target.value)} className={styles.searchInput} style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600 }} />
                </div>
            </div>

            {/* Result */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                <div>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase' }}>Aspect Ratio</p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{ratio.w}:{ratio.h}</p>
                </div>
                <div>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase' }}>Decimal</p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{ratio.decimal.toFixed(3)}</p>
                </div>
                <button onClick={copyRatio} className={styles.actionBtn}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>

            {/* Common Ratios */}
            <div>
                <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Common Ratios</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {COMMON_RATIOS.map((r) => (
                        <button
                            key={r.name}
                            onClick={() => applyRatio(r.w, r.h)}
                            style={{
                                padding: '0.6rem',
                                background: ratio.w === r.w && ratio.h === r.h ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: ratio.w === r.w && ratio.h === r.h ? 'white' : 'var(--text-primary)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {r.name}
                            <span style={{ display: 'block', fontSize: '0.65rem', opacity: 0.7 }}>{r.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
