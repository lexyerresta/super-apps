'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Shuffle, Copy, Check, RefreshCw, Sparkles, CircleDot, Lock, Hash, AtSign } from 'lucide-react';

interface PasswordOptions {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
}

export default function PasswordGeneratorAppV2() {
    const [password, setPassword] = useState('');
    const [copied, setCopied] = useState(false);
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [history, setHistory] = useState<string[]>([]);

    const generatePassword = () => {
        let chars = '';
        if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (options.numbers) chars += '0123456789';
        if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!chars) {
            chars = 'abcdefghijklmnopqrstuvwxyz';
        }

        let result = '';
        const array = new Uint32Array(options.length);
        crypto.getRandomValues(array);

        for (let i = 0; i < options.length; i++) {
            result += chars[array[i] % chars.length];
        }

        setPassword(result);
        setHistory(prev => [result, ...prev.slice(0, 4)]);
        setCopied(false);
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStrength = () => {
        let score = 0;
        if (options.length >= 12) score++;
        if (options.length >= 16) score++;
        if (options.uppercase) score++;
        if (options.lowercase) score++;
        if (options.numbers) score++;
        if (options.symbols) score++;

        if (score <= 2) return { label: 'Weak', color: '#ef4444', width: '25%' };
        if (score <= 4) return { label: 'Medium', color: '#f59e0b', width: '50%' };
        if (score <= 5) return { label: 'Strong', color: '#22c55e', width: '75%' };
        return { label: 'Very Strong', color: '#14b8a6', width: '100%' };
    };

    const strength = getStrength();

    const toggleOption = (key: keyof PasswordOptions) => {
        if (key === 'length') return;
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                    <Lock size={24} />
                </div>
                <div>
                    <h2>Password Generator</h2>
                    <p>Create secure, random passwords</p>
                </div>
            </div>

            {/* Password Display */}
            <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.08))',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
            }}>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: password ? '1.1rem' : '0.9rem',
                    color: password ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    wordBreak: 'break-all',
                    lineHeight: 1.5,
                    minHeight: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {password || 'Click Generate to create a password'}
                </div>

                {password && (
                    <div style={{ marginTop: '1rem' }}>
                        <div className={styles.flexBetween} style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Strength</span>
                            <span style={{ color: strength.color, fontSize: '0.75rem', fontWeight: 600 }}>{strength.label}</span>
                        </div>
                        <div style={{
                            height: '6px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                width: strength.width,
                                background: strength.color,
                                transition: 'width 0.3s ease',
                                borderRadius: '3px',
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className={styles.buttonGroup}>
                <button onClick={generatePassword} className={styles.primaryButton} style={{ flex: 1 }}>
                    <Shuffle size={18} /> Generate
                </button>
                <button
                    onClick={() => copyToClipboard(password)}
                    className={styles.secondaryButton}
                    disabled={!password}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            {/* Options */}
            <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                    <Sparkles size={16} /> Options
                </h4>

                {/* Length Slider */}
                <div className={styles.formGroup}>
                    <div className={styles.flexBetween}>
                        <label>Password Length</label>
                        <span className={styles.badge}>{options.length}</span>
                    </div>
                    <input
                        type="range"
                        min="6"
                        max="64"
                        value={options.length}
                        onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                        className={styles.slider}
                    />
                </div>

                {/* Character Options */}
                <div className={styles.grid2}>
                    <button
                        onClick={() => toggleOption('uppercase')}
                        className={`${styles.detailCard} ${options.uppercase ? styles.highlight : ''}`}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                        <Hash size={20} style={{ marginBottom: '0.25rem' }} />
                        <p className={styles.detailCardValue}>ABC</p>
                        <p className={styles.detailCardLabel}>Uppercase</p>
                    </button>
                    <button
                        onClick={() => toggleOption('lowercase')}
                        className={`${styles.detailCard} ${options.lowercase ? styles.highlight : ''}`}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                        <CircleDot size={20} style={{ marginBottom: '0.25rem' }} />
                        <p className={styles.detailCardValue}>abc</p>
                        <p className={styles.detailCardLabel}>Lowercase</p>
                    </button>
                    <button
                        onClick={() => toggleOption('numbers')}
                        className={`${styles.detailCard} ${options.numbers ? styles.highlight : ''}`}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                        <Hash size={20} style={{ marginBottom: '0.25rem' }} />
                        <p className={styles.detailCardValue}>123</p>
                        <p className={styles.detailCardLabel}>Numbers</p>
                    </button>
                    <button
                        onClick={() => toggleOption('symbols')}
                        className={`${styles.detailCard} ${options.symbols ? styles.highlight : ''}`}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                        <AtSign size={20} style={{ marginBottom: '0.25rem' }} />
                        <p className={styles.detailCardValue}>!@#</p>
                        <p className={styles.detailCardLabel}>Symbols</p>
                    </button>
                </div>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className={styles.formSection}>
                    <h4 className={styles.sectionTitle}>
                        <RefreshCw size={16} /> Recent
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {history.slice(0, 3).map((pwd, i) => (
                            <div
                                key={i}
                                className={styles.flexBetween}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: '10px',
                                }}
                            >
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-secondary)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '70%',
                                }}>
                                    {pwd}
                                </span>
                                <button
                                    onClick={() => copyToClipboard(pwd)}
                                    className={styles.iconButton}
                                    style={{ width: '28px', height: '28px' }}
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info */}
            <div className={styles.infoBox}>
                🔐 Uses cryptographically secure random number generation for maximum security.
            </div>
        </div>
    );
}
