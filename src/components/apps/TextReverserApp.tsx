'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { RotateCcw, Copy } from 'lucide-react';

export default function TextReverserApp() {
    const [text, setText] = useState('');
    const reversed = text.split('').reverse().join('');

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Input Text</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to reverse..." className={styles.input} rows={4} style={{ resize: 'vertical' }} />
            </div>

            {reversed && (
                <>
                    <div className={styles.inputGroup}>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Reversed Text</label>
                        <textarea value={reversed} readOnly className={styles.input} rows={4}
                            style={{ resize: 'vertical', background: 'var(--bg-secondary)', fontFamily: 'monospace' }} />
                    </div>

                    <button onClick={() => navigator.clipboard.writeText(reversed)}
                        className={styles.actionBtn} style={{ width: '100%', background: 'var(--bg-secondary)' }}>
                        <Copy size={18} /> Copy Reversed
                    </button>
                </>
            )}
        </div>
    );
}
