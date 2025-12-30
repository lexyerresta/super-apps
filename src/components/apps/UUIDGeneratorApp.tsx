'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Key, Copy, Check, RefreshCw, Plus, Trash2 } from 'lucide-react';

export default function UUIDGeneratorApp() {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(5);
    const [format, setFormat] = useState<'standard' | 'uppercase' | 'no-dashes'>('standard');
    const [copied, setCopied] = useState('');

    const generateUUID = (): string => {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
        switch (format) {
            case 'uppercase': return uuid.toUpperCase();
            case 'no-dashes': return uuid.replace(/-/g, '');
            default: return uuid;
        }
    };

    const generateMultiple = () => setUuids(Array.from({ length: count }, () => generateUUID()));
    const addOne = () => setUuids([generateUUID(), ...uuids]);
    const copyUUID = async (uuid: string) => {
        await navigator.clipboard.writeText(uuid);
        setCopied(uuid);
        setTimeout(() => setCopied(''), 2000);
    };
    const copyAll = async () => {
        await navigator.clipboard.writeText(uuids.join('\n'));
        setCopied('all');
        setTimeout(() => setCopied(''), 2000);
    };

    React.useEffect(() => { generateMultiple(); }, []);
    React.useEffect(() => { if (uuids.length > 0) setUuids(uuids.map(() => generateUUID())); }, [format]);

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ flex: 1, minWidth: '100px' }}>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Count</label>
                    <input type="number" min="1" max="50" value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} className={styles.searchInput} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 2, minWidth: '180px' }}>
                    <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Format</label>
                    <div className={styles.tabs}>
                        {(['standard', 'uppercase', 'no-dashes'] as const).map((f) => (
                            <button key={f} className={`${styles.tabBtn} ${format === f ? styles.active : ''}`} onClick={() => setFormat(f)}>
                                {f === 'standard' ? 'Standard' : f === 'uppercase' ? 'UPPER' : 'No Dashes'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <button onClick={generateMultiple} className={`${styles.actionBtn} ${styles.primaryBtn}`}><RefreshCw size={16} /> Generate {count}</button>
                <button onClick={addOne} className={styles.actionBtn}><Plus size={16} /> Add One</button>
                <button onClick={copyAll} className={styles.actionBtn} disabled={uuids.length === 0}>{copied === 'all' ? <Check size={16} /> : <Copy size={16} />} {copied === 'all' ? 'Copied!' : 'Copy All'}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflow: 'auto' }}>
                {uuids.map((uuid, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: copied === uuid ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, minWidth: '24px' }}>#{i + 1}</span>
                        <code style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', color: copied === uuid ? 'var(--accent-green)' : 'var(--text-primary)', fontWeight: 500 }}>{uuid}</code>
                        <button onClick={() => copyUUID(uuid)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', border: 'none', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>{copied === uuid ? <Check size={14} /> : <Copy size={14} />}</button>
                        <button onClick={() => setUuids(uuids.filter((_, j) => j !== i))} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '6px', color: 'var(--text-tertiary)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                ))}
            </div>
            <div className={styles.footer}><p>UUID v4 (Random) • {uuids.length} generated</p></div>
        </div>
    );
}
