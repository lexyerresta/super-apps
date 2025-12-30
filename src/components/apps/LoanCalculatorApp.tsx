'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { DollarSign, Percent, TrendingUp, PiggyBank, Wallet } from 'lucide-react';

type CalculationType = 'loan' | 'savings' | 'investment';

export default function LoanCalculatorApp() {
    const [calcType, setCalcType] = useState<CalculationType>('loan');
    const [principal, setPrincipal] = useState('100000000');
    const [rate, setRate] = useState('12');
    const [term, setTerm] = useState('12');
    const [termUnit, setTermUnit] = useState<'months' | 'years'>('months');

    const calculate = () => {
        const P = parseFloat(principal) || 0;
        const annualRate = parseFloat(rate) || 0;
        const monthlyRate = annualRate / 100 / 12;
        const totalMonths = termUnit === 'years' ? (parseInt(term) || 0) * 12 : parseInt(term) || 0;

        if (P <= 0 || totalMonths <= 0) return null;

        if (calcType === 'loan') {
            if (monthlyRate === 0) {
                const monthlyPayment = P / totalMonths;
                return { monthlyPayment, totalPayment: P, totalInterest: 0 };
            }
            const monthlyPayment = P * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
            const totalPayment = monthlyPayment * totalMonths;
            const totalInterest = totalPayment - P;
            return { monthlyPayment, totalPayment, totalInterest };
        } else {
            const futureValue = P * Math.pow(1 + monthlyRate, totalMonths);
            const totalInterest = futureValue - P;
            return { futureValue, totalInterest, principal: P };
        }
    };

    const result = calculate();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const tabs = [
        { id: 'loan' as const, label: 'Loan', icon: Wallet },
        { id: 'savings' as const, label: 'Savings', icon: PiggyBank },
        { id: 'investment' as const, label: 'Investment', icon: TrendingUp },
    ];

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    <Wallet size={24} />
                </div>
                <div>
                    <h2>Loan Calculator</h2>
                    <p>Calculate loan payments & interest</p>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${calcType === tab.id ? styles.active : ''}`}
                            onClick={() => setCalcType(tab.id)}
                        >
                            <IconComponent size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Inputs */}
            <div className={styles.flexColumn}>
                <div className={styles.formGroup}>
                    <label>
                        <DollarSign size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {calcType === 'loan' ? 'Loan Amount' : 'Principal Amount'}
                    </label>
                    <input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(e.target.value)}
                        className={styles.input}
                        placeholder="100000000"
                    />
                </div>

                <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                        <label>
                            <Percent size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Annual Rate (%)
                        </label>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            className={styles.input}
                            placeholder="12"
                            step="0.1"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Term</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                className={styles.input}
                                placeholder="12"
                                style={{ flex: 1 }}
                            />
                            <select
                                value={termUnit}
                                onChange={(e) => setTermUnit(e.target.value as 'months' | 'years')}
                                className={styles.select}
                                style={{ width: 'auto', minWidth: '70px' }}
                            >
                                <option value="months">Mo</option>
                                <option value="years">Yr</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className={styles.flexColumn}>
                    {/* Main Result */}
                    <div className={`${styles.resultCard} ${styles.primary}`}>
                        <p className={styles.resultLabel}>
                            {calcType === 'loan' ? 'Monthly Payment' : 'Future Value'}
                        </p>
                        <p className={styles.resultValue}>
                            {formatCurrency(calcType === 'loan' ? result.monthlyPayment! : result.futureValue!)}
                        </p>
                    </div>

                    {/* Details */}
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailCard}>
                            <p className={styles.detailCardLabel}>
                                {calcType === 'loan' ? 'Total Payment' : 'Principal'}
                            </p>
                            <p className={styles.detailCardValue}>
                                {formatCurrency(calcType === 'loan' ? result.totalPayment! : result.principal!)}
                            </p>
                        </div>
                        <div className={`${styles.detailCard} ${calcType === 'loan' ? styles.danger : styles.success}`}>
                            <p className={styles.detailCardLabel}>Total Interest</p>
                            <p className={styles.detailCardValue}>
                                {formatCurrency(result.totalInterest)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className={styles.infoBox}>
                💡 {calcType === 'loan'
                    ? 'This calculates monthly payments using compound interest formula.'
                    : 'This calculates compound interest growth over time.'}
            </div>
        </div>
    );
}
