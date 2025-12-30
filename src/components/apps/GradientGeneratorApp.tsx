'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Palette, Copy, Check, RefreshCw, RotateCcw } from 'lucide-react';

export default function GradientGeneratorApp() {
    const [color1, setColor1] = useState('#6366f1');
    const [color2, setColor2] = useState('#ec4899');
    const [angle, setAngle] = useState(135);
    const [type, setType] = useState<'linear' | 'radial'>('linear');
    const [copied, setCopied] = useState(false);

    const gradient = type === 'linear'
        ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
        : `radial-gradient(circle, ${color1}, ${color2})`;

    const cssCode = `background: ${gradient};`;

    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomGradient = () => { setColor1(randomColor()); setColor2(randomColor()); setAngle(Math.floor(Math.random() * 360)); };

    const copyCSS = async () => {
        await navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const presets = [
        { c1: '#6366f1', c2: '#a855f7' },
        { c1: '#f59e0b', c2: '#ef4444' },
        { c1: '#22c55e', c2: '#06b6d4' },
        { c1: '#ec4899', c2: '#8b5cf6' },
        { c1: '#14b8a6', c2: '#3b82f6' },
        { c1: '#f97316', c2: '#fbbf24' },
    ];

    return (
        <div className={styles.appContainer}>
            <div style={{ width: '100%', height: '180px', background: gradient, borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} />

            <div className={styles.tabs}>
                <button className={`${styles.tabBtn} ${type === 'linear' ? styles.active : ''}`} onClick={() => setType('linear')}>Linear</button>
                <button className={`${styles.tabBtn} ${type === 'radial' ? styles.active : ''}`} onClick={() => setType('radial')}>Radial</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Color 1</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ width: '48px', height: '48px', border: 'none', borderRadius: '10px', cursor: 'pointer' }} />
                        <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className={styles.searchInput} style={{ flex: 1, fontFamily: 'monospace' }} />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Color 2</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ width: '48px', height: '48px', border: 'none', borderRadius: '10px', cursor: 'pointer' }} />
                        <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className={styles.searchInput} style={{ flex: 1, fontFamily: 'monospace' }} />
                    </div>
                </div>
            </div>

            {type === 'linear' && (
                <div>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Angle: {angle}°</label>
                    <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                </div>
            )}

            <div>
                <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Presets</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {presets.map((p, i) => (
                        <button key={i} onClick={() => { setColor1(p.c1); setColor2(p.c2); }} style={{ width: '40px', height: '40px', background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`, border: 'none', borderRadius: '10px', cursor: 'pointer' }} />
                    ))}
                </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <code style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{cssCode}</code>
            </div>

            <div className={styles.actions}>
                <button onClick={copyCSS} className={`${styles.actionBtn} ${styles.primaryBtn}`}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy CSS'}</button>
                <button onClick={randomGradient} className={styles.actionBtn}><RefreshCw size={16} /> Random</button>
                <button onClick={() => { setColor1('#6366f1'); setColor2('#ec4899'); setAngle(135); }} className={styles.actionBtn}><RotateCcw size={16} /> Reset</button>
            </div>
        </div>
    );
}
