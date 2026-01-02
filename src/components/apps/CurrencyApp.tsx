'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { ArrowLeftRight, RefreshCw, AlertCircle, TrendingUp, Clock, Info } from 'lucide-react';

interface ExchangeRates {
    provider: string;
    WARNING_UPGRADE_TO_V6?: string;
    terms: string;
    base: string;
    date: string;
    time_last_updated: number;
    rates: Record<string, number>;
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
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
];

export default function CurrencyApp() {
    const [amount, setAmount] = useState('1');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('IDR');

    // Using exchangerate-api v4 which is reliable and updated efficiently
    const { data, loading, error, execute } = useAsync<ExchangeRates>(
        () => httpClient<ExchangeRates>(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`),
        [fromCurrency]
    );

    const rate = data?.rates?.[toCurrency] || 0;
    const convertedAmount = amount ? (parseFloat(amount) * rate) : 0;

    // Format date for "Last Updated"
    const lastUpdated = data?.date ? new Date(data.date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : 'Today';

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const formatNumber = (num: number, isCurrency = true) => {
        return num.toLocaleString('id-ID', {
            maximumFractionDigits: 2,
            minimumFractionDigits: isCurrency ? 0 : 0
        });
    };

    const getCurrencySymbol = (code: string) => {
        return popularCurrencies.find(c => c.code === code)?.symbol || code;
    };

    return (
        <div className={styles.appContainer} style={{ background: 'var(--bg-primary)' }}>

            {/* Main Converter Card */}
            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '24px',
                padding: '1.5rem',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Background Blob */}
                <div style={{
                    position: 'absolute', top: '-50px', right: '-50px',
                    width: '150px', height: '150px', background: 'var(--primary)',
                    filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>

                    {/* From Section */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600 }}>YOU PAY</label>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={10} /> Market Rate
                            </span>
                        </div>
                        <div style={{
                            display: 'flex', gap: '0.75rem', alignItems: 'center',
                            background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '16px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{ flex: 1, padding: '0 0.5rem' }}>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    style={{
                                        width: '100%', border: 'none', background: 'transparent',
                                        fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)',
                                        outline: 'none', padding: '0.5rem 0'
                                    }}
                                />
                            </div>
                            <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)' }} />
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                style={{
                                    border: 'none', background: 'transparent',
                                    fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
                                    cursor: 'pointer', padding: '0 0.5rem', outline: 'none'
                                }}
                            >
                                {popularCurrencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </select>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', paddingLeft: '0.5rem' }}>
                            {popularCurrencies.find(c => c.code === fromCurrency)?.name}
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '-10px 0' }}>
                        <button
                            onClick={handleSwap}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                                color: 'var(--primary)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 2
                            }}
                        >
                            <ArrowLeftRight size={18} />
                        </button>
                    </div>

                    {/* To Section */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>YOU GET</label>
                        <div style={{
                            display: 'flex', gap: '0.75rem', alignItems: 'center',
                            background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '16px',
                            border: '1px solid transparent' // Highlight border could go here
                        }}>
                            <div style={{ flex: 1, padding: '0.5rem 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                {loading ? <span className={styles.skeleton} style={{ width: '100px', display: 'inline-block' }} /> : formatNumber(convertedAmount)}
                            </div>
                            <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)' }} />
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                style={{
                                    border: 'none', background: 'transparent',
                                    fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
                                    cursor: 'pointer', padding: '0 0.5rem', outline: 'none'
                                }}
                            >
                                {popularCurrencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </select>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', paddingLeft: '0.5rem' }}>
                            {popularCurrencies.find(c => c.code === toCurrency)?.name}
                        </div>
                    </div>

                </div>
            </div>

            {/* Info Footer */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '16px',
                    border: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Info size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Exchange Rate</span>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        1 {fromCurrency} ≈ {formatNumber(rate)} {toCurrency}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{
                        flex: 1, padding: '0.8rem', background: 'var(--bg-secondary)',
                        borderRadius: '12px', textAlign: 'center', border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Last Updated</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <Clock size={12} /> {lastUpdated}
                        </div>
                    </div>
                    <button
                        onClick={execute}
                        style={{
                            padding: '0 1rem', background: 'var(--bg-secondary)',
                            borderRadius: '12px', border: '1px solid var(--glass-border)',
                            color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center'
                        }}
                    >
                        <RefreshCw size={18} className={loading ? styles.spinning : ''} />
                    </button>
                </div>
            </div>
        </div>
    );
}
