'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Tag, DollarSign, Percent, ShoppingCart, TrendingDown } from 'lucide-react';

export default function DiscountCalculatorApp() {
    const [originalPrice, setOriginalPrice] = useState('1000000');
    const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
    const [discountValue, setDiscountValue] = useState('20');
    const [quantity, setQuantity] = useState('1');

    const result = useMemo(() => {
        const price = parseFloat(originalPrice) || 0;
        const discount = parseFloat(discountValue) || 0;
        const qty = parseInt(quantity) || 1;

        if (price <= 0) return null;

        let discountAmount: number;
        let discountPercent: number;

        if (discountType === 'percent') {
            discountPercent = Math.min(discount, 100);
            discountAmount = price * (discountPercent / 100);
        } else {
            discountAmount = Math.min(discount, price);
            discountPercent = (discountAmount / price) * 100;
        }

        const finalPrice = price - discountAmount;
        const totalOriginal = price * qty;
        const totalDiscount = discountAmount * qty;
        const totalFinal = finalPrice * qty;

        return { discountAmount, discountPercent, finalPrice, totalOriginal, totalDiscount, totalFinal };
    }, [originalPrice, discountType, discountValue, quantity]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const presetDiscounts = [10, 15, 20, 25, 30, 50];

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)' }}>
                    <Tag size={24} />
                </div>
                <div>
                    <h2>Discount Calculator</h2>
                    <p>Calculate savings instantly</p>
                </div>
            </div>

            {/* Original Price */}
            <div className={styles.formGroup}>
                <label>
                    <DollarSign size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Original Price
                </label>
                <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className={styles.input}
                    placeholder="1000000"
                    style={{ fontSize: '1.25rem', fontWeight: 600 }}
                />
            </div>

            {/* Discount Type Toggle */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${discountType === 'percent' ? styles.active : ''}`}
                    onClick={() => setDiscountType('percent')}
                >
                    <Percent size={14} /> Percentage
                </button>
                <button
                    className={`${styles.tabBtn} ${discountType === 'fixed' ? styles.active : ''}`}
                    onClick={() => setDiscountType('fixed')}
                >
                    <DollarSign size={14} /> Fixed Amount
                </button>
            </div>

            {/* Discount Value */}
            <div className={styles.formGroup}>
                <label>Discount {discountType === 'percent' ? '(%)' : '(Amount)'}</label>
                <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className={styles.input}
                    placeholder={discountType === 'percent' ? '20' : '200000'}
                />
            </div>

            {/* Quick Discounts */}
            {discountType === 'percent' && (
                <div className={styles.presetsContainer}>
                    {presetDiscounts.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDiscountValue(d.toString())}
                            className={`${styles.presetButton} ${discountValue === d.toString() ? styles.active : ''}`}
                        >
                            {d}%
                        </button>
                    ))}
                </div>
            )}

            {/* Quantity */}
            <div className={styles.formGroup}>
                <label>
                    <ShoppingCart size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Quantity
                </label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={styles.input}
                    min="1"
                    style={{ width: '120px' }}
                />
            </div>

            {/* Results */}
            {result && (
                <div className={styles.flexColumn}>
                    {/* Final Price */}
                    <div className={`${styles.resultCard} ${styles.primary}`}>
                        <p className={styles.resultLabel}>Final Price</p>
                        <p className={styles.resultValue}>{formatCurrency(result.finalPrice)}</p>
                        <p className={styles.resultSubtext} style={{ textDecoration: 'line-through' }}>
                            {formatCurrency(parseFloat(originalPrice) || 0)}
                        </p>
                    </div>

                    {/* Savings */}
                    <div className={`${styles.infoBox} ${styles.success}`} style={{ justifyContent: 'center', padding: '1rem' }}>
                        <TrendingDown size={24} />
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                                {formatCurrency(result.discountAmount)}
                            </span>
                            <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>
                                saved ({result.discountPercent.toFixed(1)}% off)
                            </span>
                        </div>
                    </div>

                    {/* Total for Quantity */}
                    {parseInt(quantity) > 1 && (
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailCard}>
                                <p className={styles.detailCardLabel}>Total ({quantity} items)</p>
                                <p className={styles.detailCardValue}>{formatCurrency(result.totalFinal)}</p>
                            </div>
                            <div className={`${styles.detailCard} ${styles.success}`}>
                                <p className={styles.detailCardLabel}>Total Saved</p>
                                <p className={styles.detailCardValue}>{formatCurrency(result.totalDiscount)}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
