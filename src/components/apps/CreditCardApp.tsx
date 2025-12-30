'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

export default function CreditCardApp() {
    const [cardNumber, setCardNumber] = useState('');
    const [result, setResult] = useState<{ valid: boolean; type?: string } | null>(null);

    const luhnCheck = (num: string): boolean => {
        let sum = 0;
        let isEven = false;

        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num[i]);
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    const getCardType = (num: string): string => {
        if (num.startsWith('4')) return 'Visa';
        if (num.startsWith('5')) return 'Mastercard';
        if (num.startsWith('3')) return 'American Express';
        if (num.startsWith('6')) return 'Discover';
        return 'Unknown';
    };

    const validate = () => {
        const cleaned = cardNumber.replace(/\s/g, '');
        if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
            setResult({ valid: false });
            return;
        }

        const valid = luhnCheck(cleaned);
        setResult({ valid, type: valid ? getCardType(cleaned) : undefined });
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Card Number</label>
                <input type="text" value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ''))}
                    onKeyPress={(e) => e.key === 'Enter' && validate()}
                    placeholder="1234 5678 9012 3456"
                    className={styles.input}
                    style={{ fontSize: '1.25rem', letterSpacing: '0.1em', fontFamily: 'monospace' }}
                    maxLength={19}
                />
            </div>

            <button onClick={validate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <CreditCard size={18} /> Validate Card
            </button>

            {result && (
                <div style={{
                    padding: '2rem',
                    background: result.valid ? 'linear-gradient(135deg, #10b981, #14b8a6)' : 'linear-gradient(135deg, #ef4444, #f97316)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    {result.valid ? <CheckCircle size={48} style={{ marginBottom: '1rem' }} /> : <XCircle size={48} style={{ marginBottom: '1rem' }} />}
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {result.valid ? 'Valid Card' : 'Invalid Card'}
                    </div>
                    {result.type && (
                        <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                            Type: {result.type}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
