'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { ArrowLeftRight, RefreshCw, AlertCircle } from 'lucide-react';

interface ExchangeRates {
    result: string;
    base_code: string;
    conversion_rates: Record<string, number>;
}

const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'Korean Won', symbol: '₩' },
];

export default function CurrencyApp() {
    const [amount, setAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('IDR');

    const { data: rates, loading, error, execute } = useAsync<ExchangeRates>(
        () => httpClient<ExchangeRates>(`https://open.er-api.com/v6/latest/${fromCurrency}`),
        [fromCurrency]
    );

    const convertedAmount = rates && amount
        ? (parseFloat(amount) * (rates.conversion_rates[toCurrency] || 0))
        : 0;

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    const getCurrencySymbol = (code: string) => {
        return popularCurrencies.find(c => c.code === code)?.symbol || code;
    };

    if (loading && !rates) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading exchange rates...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                <p>Failed to load rates</p>
                <button onClick={execute} className={styles.actionBtn}>
                    <RefreshCw size={14} /> Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.appContainer}>
            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid var(--glass-border)',
            }}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                        display: 'block',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        Amount
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={styles.searchInput}
                            style={{ flex: 1 }}
                        />
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {popularCurrencies.map((curr) => (
                                <option key={curr.code} value={curr.code}>{curr.code}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <button
                        onClick={handleSwap}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ArrowLeftRight size={18} />
                    </button>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        Converted to
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{
                            flex: 1,
                            padding: '0.875rem 1.25rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--primary)',
                            borderRadius: '14px',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                        }}>
                            {getCurrencySymbol(toCurrency)} {formatNumber(convertedAmount)}
                        </div>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {popularCurrencies.map((curr) => (
                                <option key={curr.code} value={curr.code}>{curr.code}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                1 {fromCurrency} = {formatNumber(rates?.conversion_rates[toCurrency] || 0)} {toCurrency}
            </div>

            <div style={{ marginTop: '1rem' }}>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Quick convert</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {popularCurrencies.filter(c => c.code !== fromCurrency).slice(0, 5).map((curr) => (
                        <button
                            key={curr.code}
                            onClick={() => setToCurrency(curr.code)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: toCurrency === curr.code ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                border: '1px solid',
                                borderColor: toCurrency === curr.code ? 'transparent' : 'var(--glass-border)',
                                borderRadius: '8px',
                                color: toCurrency === curr.code ? 'white' : 'var(--text-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {curr.code}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
