'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Percent } from 'lucide-react';

export default function DiscountApp() {
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');

    const calculate = () => {
        const p = parseFloat(price);
        const d = parseFloat(discount);
        if (isNaN(p) || isNaN(d)) return null;

        const discountAmount = (p * d) / 100;
        const finalPrice = p - discountAmount;
        const savings = discountAmount;

        return {
            original: p.toFixed(2),
            discount: d.toFixed(0),
            savings: savings.toFixed(2),
            final: finalPrice.toFixed(2)
        };
    };

    const result = calculate();

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Original Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                    placeholder="100.00" className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Discount %</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
                    placeholder="20" className={styles.input} />
            </div>

            {result && (
                <>
                    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #10b981, #14b8a6)', borderRadius: '16px', textAlign: 'center', color: 'white', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Final Price</div>
                        <div style={{ fontSize: '3rem', fontWeight: '700' }}>${result.final}</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
                            You save ${result.savings} ({result.discount}%)
                        </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Original Price</span>
                            <span style={{ fontWeight: '600' }}>${result.original}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#ef4444' }}>
                            <span style={{ fontSize: '0.875rem' }}>Discount ({result.discount}%)</span>
                            <span style={{ fontWeight: '600' }}>-${result.savings}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--bg-tertiary)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>You Pay</span>
                            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--primary)' }}>${result.final}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
