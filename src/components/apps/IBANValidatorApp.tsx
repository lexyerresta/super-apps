'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Building2, CheckCircle, XCircle } from 'lucide-react';

export default function IBANValidatorApp() {
    const [iban, setIban] = useState('');
    const [result, setResult] = useState<{ valid: boolean; country?: string } | null>(null);

    const validateIBAN = (iban: string): boolean => {
        const cleaned = iban.replace(/\s/g, '').toUpperCase();
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) return false;
        if (cleaned.length < 15 || cleaned.length > 34) return false;

        const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
        const numeric = rearranged.split('').map(char =>
            isNaN(parseInt(char)) ? (char.charCodeAt(0) - 55).toString() : char
        ).join('');

        let remainder = numeric;
        while (remainder.length > 2) {
            const block = remainder.slice(0, 9);
            remainder = (parseInt(block) % 97).toString() + remainder.slice(9);
        }

        return parseInt(remainder) % 97 === 1;
    };

    const getCountry = (iban: string): string => {
        const code = iban.slice(0, 2).toUpperCase();
        const countries: any = {
            'DE': 'Germany', 'GB': 'United Kingdom', 'FR': 'France',
            'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands',
            'BE': 'Belgium', 'CH': 'Switzerland', 'AT': 'Austria'
        };
        return countries[code] || code;
    };

    const validate = () => {
        const cleaned = iban.replace(/\s/g, '');
        const valid = validateIBAN(cleaned);
        setResult({ valid, country: valid ? getCountry(cleaned) : undefined });
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>IBAN Number</label>
                <input type="text" value={iban}
                    onChange={(e) => setIban(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && validate()}
                    placeholder="DE89 3704 0044 0532 0130 00"
                    className={styles.input}
                    style={{ fontSize: '1.125rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                />
            </div>

            <button onClick={validate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Building2 size={18} /> Validate IBAN
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
                        {result.valid ? 'Valid IBAN' : 'Invalid IBAN'}
                    </div>
                    {result.country && (
                        <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                            Country: {result.country}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
