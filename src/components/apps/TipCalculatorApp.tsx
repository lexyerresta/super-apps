'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Receipt, Users, Split, Copy, Check, Minus, Plus } from 'lucide-react';

export default function TipCalculatorApp() {
    const [billAmount, setBillAmount] = useState('500000');
    const [tipPercent, setTipPercent] = useState(15);
    const [numPeople, setNumPeople] = useState(1);
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        const bill = parseFloat(billAmount) || 0;
        if (bill <= 0 || numPeople <= 0) return null;

        const tipAmount = bill * (tipPercent / 100);
        const total = bill + tipAmount;
        const perPerson = total / numPeople;
        const tipPerPerson = tipAmount / numPeople;

        return { tipAmount, total, perPerson, tipPerPerson };
    }, [billAmount, tipPercent, numPeople]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const copyResult = async () => {
        if (!result) return;
        const text = `Bill: ${formatCurrency(parseFloat(billAmount))}\nTip (${tipPercent}%): ${formatCurrency(result.tipAmount)}\nTotal: ${formatCurrency(result.total)}\nPer Person (${numPeople}): ${formatCurrency(result.perPerson)}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tipPresets = [0, 5, 10, 15, 20, 25];

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                    <Receipt size={24} />
                </div>
                <div>
                    <h2>Tip Calculator</h2>
                    <p>Calculate tips and split bills</p>
                </div>
            </div>

            {/* Bill Amount */}
            <div className={styles.formGroup}>
                <label>
                    <Receipt size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Bill Amount
                </label>
                <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className={styles.input}
                    placeholder="500000"
                    style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}
                />
            </div>

            {/* Tip Percentage */}
            <div className={styles.formGroup}>
                <div className={styles.flexBetween}>
                    <label>Tip Percentage</label>
                    <span className={`${styles.badge} ${styles.primary}`}>{tipPercent}%</span>
                </div>
                <div className={styles.presetsContainer}>
                    {tipPresets.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTipPercent(t)}
                            className={`${styles.presetButton} ${tipPercent === t ? styles.active : ''}`}
                            style={{ flex: 1 }}
                        >
                            {t}%
                        </button>
                    ))}
                </div>
                <input
                    type="range"
                    min="0"
                    max="50"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(Number(e.target.value))}
                    className={styles.slider}
                />
            </div>

            {/* Number of People */}
            <div className={styles.formGroup}>
                <label>
                    <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Split Between
                </label>
                <div className={styles.flexBetween} style={{ gap: '1rem' }}>
                    <button
                        onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                        className={styles.iconButton}
                        style={{ width: '48px', height: '48px' }}
                    >
                        <Minus size={20} />
                    </button>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800 }}>{numPeople}</span>
                        <span style={{ color: 'var(--text-tertiary)', marginLeft: '0.5rem' }}>people</span>
                    </div>
                    <button
                        onClick={() => setNumPeople(numPeople + 1)}
                        className={styles.iconButton}
                        style={{ width: '48px', height: '48px' }}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className={styles.flexColumn}>
                    <div className={styles.detailsGrid}>
                        <div className={`${styles.detailCard} ${styles.success}`}>
                            <p className={styles.detailCardLabel}>Tip Amount</p>
                            <p className={styles.detailCardValue}>{formatCurrency(result.tipAmount)}</p>
                        </div>
                        <div className={styles.detailCard}>
                            <p className={styles.detailCardLabel}>Total</p>
                            <p className={styles.detailCardValue}>{formatCurrency(result.total)}</p>
                        </div>
                    </div>

                    {/* Per Person */}
                    <div className={`${styles.resultCard} ${styles.primary}`}>
                        <Split size={24} style={{ marginBottom: '0.5rem' }} />
                        <p className={styles.resultLabel}>Each Person Pays</p>
                        <p className={styles.resultValue}>{formatCurrency(result.perPerson)}</p>
                        <p className={styles.resultSubtext}>
                            (incl. {formatCurrency(result.tipPerPerson)} tip)
                        </p>
                    </div>

                    <button onClick={copyResult} className={styles.primaryButton} style={{ width: '100%' }}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Summary'}
                    </button>
                </div>
            )}
        </div>
    );
}
