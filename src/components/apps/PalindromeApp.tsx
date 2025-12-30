'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PalindromeApp() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<boolean | null>(null);

    const check = () => {
        const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const reversed = cleaned.split('').reverse().join('');
        setResult(cleaned === reversed && cleaned.length > 0);
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && check()}
                    placeholder="Enter text to check" className={styles.input} style={{ fontSize: '1.25rem' }} />
            </div>
            <button onClick={check} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>Check Palindrome</button>
            {result !== null && (
                <div style={{
                    padding: '2rem', background: result ? 'linear-gradient(135deg, #10b981, #14b8a6)' : 'linear-gradient(135deg, #ef4444, #f97316)',
                    borderRadius: '16px', textAlign: 'center', color: 'white'
                }}>
                    {result ? <CheckCircle size={48} style={{ marginBottom: '1rem' }} /> : <XCircle size={48} style={{ marginBottom: '1rem' }} />}
                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                        {result ? 'Yes, it\'s a palindrome!' : 'Not a palindrome'}
                    </div>
                </div>
            )}
        </div>
    );
}
