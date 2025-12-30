'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Barcode, Download } from 'lucide-react';

export default function BarcodeApp() {
    const [text, setText] = useState('');

    const generateBarcode = () => {
        if (!text) return null;
        // Simple barcode-like representation
        return text.split('').map((char, i) => ({
            char,
            width: (char.charCodeAt(0) % 5) + 1
        }));
    };

    const barcode = generateBarcode();

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Enter Text/Number</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="123456789" className={styles.input}
                    style={{ fontSize: '1.25rem', textAlign: 'center', fontFamily: 'monospace' }} />
            </div>

            {barcode && (
                <div style={{
                    padding: '2rem',
                    background: 'white',
                    borderRadius: '16px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        gap: '2px',
                        height: '120px',
                        marginBottom: '1rem'
                    }}>
                        {barcode.map((item, i) => (
                            <div key={i} style={{
                                width: `${item.width * 8}px`,
                                height: '100%',
                                background: i % 2 === 0 ? '#000' : '#fff',
                                border: i % 2 === 0 ? 'none' : '1px solid #ddd'
                            }} />
                        ))}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
                        {text}
                    </div>
                </div>
            )}

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                ℹ️ Simplified barcode visualization. For production use, integrate a proper barcode library.
            </div>
        </div>
    );
}
