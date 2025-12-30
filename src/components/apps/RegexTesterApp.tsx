'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Code, Copy, Check, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Match {
    text: string;
    index: number;
    groups?: string[];
}

const COMMON_PATTERNS = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?:\\/\\/[^\\s]+' },
    { name: 'Phone', pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}' },
    { name: 'IPv4', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b' },
    { name: 'Date', pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}' },
    { name: 'Hex Color', pattern: '#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})' },
];

export default function RegexTesterApp() {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('gi');
    const [testString, setTestString] = useState('Test your regular expression here.\nEmail: test@example.com\nURL: https://example.com');
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        if (!pattern) {
            return { valid: true, matches: [], error: '' };
        }

        try {
            const regex = new RegExp(pattern, flags);
            const matches: Match[] = [];
            let match;

            if (flags.includes('g')) {
                while ((match = regex.exec(testString)) !== null) {
                    matches.push({
                        text: match[0],
                        index: match.index,
                        groups: match.slice(1).filter(g => g !== undefined),
                    });
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            } else {
                match = regex.exec(testString);
                if (match) {
                    matches.push({
                        text: match[0],
                        index: match.index,
                        groups: match.slice(1).filter(g => g !== undefined),
                    });
                }
            }

            return { valid: true, matches, error: '' };
        } catch (e) {
            return { valid: false, matches: [], error: (e as Error).message };
        }
    }, [pattern, flags, testString]);

    const highlightedText = useMemo(() => {
        if (!pattern || !result.valid || result.matches.length === 0) {
            return testString;
        }

        let lastIndex = 0;
        const parts: React.ReactNode[] = [];

        result.matches.forEach((match, i) => {
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${i}`}>
                        {testString.slice(lastIndex, match.index)}
                    </span>
                );
            }
            parts.push(
                <mark
                    key={`match-${i}`}
                    style={{
                        background: 'rgba(34, 197, 94, 0.3)',
                        color: 'var(--accent-green)',
                        padding: '0.1rem 0.2rem',
                        borderRadius: '3px',
                        fontWeight: 600,
                    }}
                >
                    {match.text}
                </mark>
            );
            lastIndex = match.index + match.text.length;
        });

        if (lastIndex < testString.length) {
            parts.push(
                <span key="text-end">
                    {testString.slice(lastIndex)}
                </span>
            );
        }

        return parts;
    }, [testString, pattern, result]);

    const copyPattern = async () => {
        if (pattern) {
            await navigator.clipboard.writeText(pattern);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={styles.appContainer}>
            {/* Pattern Input */}
            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid var(--glass-border)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                }}>
                    <Code size={16} color="var(--primary)" />
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>
                        Regular Expression
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${result.valid ? 'var(--glass-border)' : 'var(--accent-red)'}`,
                    borderRadius: '12px',
                    padding: '0.5rem 1rem',
                }}>
                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>/</span>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="Enter regex pattern..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            outline: 'none',
                        }}
                    />
                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>/</span>
                    <input
                        type="text"
                        value={flags}
                        onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
                        placeholder="gi"
                        style={{
                            width: '40px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            outline: 'none',
                        }}
                    />
                </div>

                {!result.valid && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                    }}>
                        <AlertCircle size={14} color="var(--accent-red)" />
                        <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem' }}>
                            {result.error}
                        </span>
                    </div>
                )}
            </div>

            {/* Common Patterns */}
            <div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                    Common Patterns
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {COMMON_PATTERNS.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => setPattern(p.pattern)}
                            style={{
                                padding: '0.35rem 0.6rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '6px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Test String */}
            <div>
                <label style={{
                    display: 'block',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                }}>
                    Test String
                </label>
                <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    className={styles.searchInput}
                    style={{
                        minHeight: '100px',
                        resize: 'vertical',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                    }}
                />
            </div>

            {/* Results */}
            <div style={{
                background: result.valid && result.matches.length > 0
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(20, 184, 166, 0.08))'
                    : 'var(--bg-tertiary)',
                border: result.valid && result.matches.length > 0
                    ? '1px solid rgba(34, 197, 94, 0.2)'
                    : '1px solid var(--glass-border)',
                borderRadius: '14px',
                padding: '1rem',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {result.valid && result.matches.length > 0 ? (
                            <CheckCircle size={16} color="var(--accent-green)" />
                        ) : (
                            <Info size={16} color="var(--text-tertiary)" />
                        )}
                        <span style={{
                            color: result.valid && result.matches.length > 0 ? 'var(--accent-green)' : 'var(--text-secondary)',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }}>
                            {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''} found
                        </span>
                    </div>
                </div>

                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>
                    {highlightedText}
                </div>
            </div>

            {/* Match Details */}
            {result.matches.length > 0 && (
                <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                        Match Details
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {result.matches.slice(0, 10).map((match, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.5rem 0.75rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                }}
                            >
                                <span style={{ color: 'var(--text-tertiary)', minWidth: '30px' }}>#{i + 1}</span>
                                <span style={{ color: 'var(--accent-green)', fontFamily: 'monospace', fontWeight: 600 }}>
                                    "{match.text}"
                                </span>
                                <span style={{ color: 'var(--text-tertiary)' }}>at index {match.index}</span>
                                {match.groups && match.groups.length > 0 && (
                                    <span style={{ color: 'var(--accent-purple)', marginLeft: 'auto' }}>
                                        Groups: {match.groups.join(', ')}
                                    </span>
                                )}
                            </div>
                        ))}
                        {result.matches.length > 10 && (
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', textAlign: 'center' }}>
                                ... and {result.matches.length - 10} more matches
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.actions}>
                <button onClick={copyPattern} className={`${styles.actionBtn} ${styles.primaryBtn}`} disabled={!pattern}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Pattern'}
                </button>
                <button onClick={() => { setPattern(''); setTestString(''); }} className={styles.actionBtn}>
                    <RefreshCw size={16} /> Clear
                </button>
            </div>
        </div>
    );
}
