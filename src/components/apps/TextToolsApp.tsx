'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Type, Copy, Check, RefreshCw, CaseSensitive, CaseUpper, CaseLower, Hash, Link2, Mail, Clock, Replace, Shuffle, SortAsc, ListOrdered, FileText, AlignLeft } from 'lucide-react';

export default function TextToolsApp() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [showFindReplace, setShowFindReplace] = useState(false);

    const stats = useMemo(() => {
        const words = input.trim() ? input.trim().split(/\s+/).length : 0;
        const chars = input.length;
        const charsNoSpace = input.replace(/\s/g, '').length;
        const lines = input ? input.split('\n').length : 0;
        const sentences = input ? (input.match(/[.!?]+/g) || []).length : 0;
        const paragraphs = input ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
        const readingTime = Math.ceil(words / 200);
        const speakingTime = Math.ceil(words / 150);

        // Character frequency
        const freq: Record<string, number> = {};
        input.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(c => {
            freq[c] = (freq[c] || 0) + 1;
        });
        const topChars = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);

        // Extract URLs and emails
        const urls = input.match(/https?:\/\/[^\s]+/g) || [];
        const emails = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];

        return { words, chars, charsNoSpace, lines, sentences, paragraphs, readingTime, speakingTime, topChars, urls, emails };
    }, [input]);

    const transformations = [
        { label: 'UPPER', fn: (s: string) => s.toUpperCase(), icon: <CaseUpper size={14} /> },
        { label: 'lower', fn: (s: string) => s.toLowerCase(), icon: <CaseLower size={14} /> },
        { label: 'Title', fn: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()), icon: <CaseSensitive size={14} /> },
        { label: 'Sentence', fn: (s: string) => s.toLowerCase().replace(/(^\w|[.!?]\s+\w)/g, c => c.toUpperCase()), icon: <Type size={14} /> },
        { label: 'aLtErNaTe', fn: (s: string) => s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''), icon: <Shuffle size={14} /> },
    ];

    const tools = [
        { label: 'Remove extra spaces', fn: (s: string) => s.replace(/\s+/g, ' ').trim() },
        { label: 'Trim lines', fn: (s: string) => s.split('\n').map(l => l.trim()).join('\n') },
        { label: 'Remove duplicates', fn: (s: string) => [...new Set(s.split('\n'))].join('\n') },
        { label: 'Sort lines (A-Z)', fn: (s: string) => s.split('\n').sort().join('\n') },
        { label: 'Sort lines (Z-A)', fn: (s: string) => s.split('\n').sort().reverse().join('\n') },
        { label: 'Reverse text', fn: (s: string) => s.split('').reverse().join('') },
        { label: 'Reverse words', fn: (s: string) => s.split(' ').reverse().join(' ') },
        { label: 'Add line numbers', fn: (s: string) => s.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n') },
        { label: 'Remove empty lines', fn: (s: string) => s.split('\n').filter(l => l.trim()).join('\n') },
        { label: 'URL encode', fn: (s: string) => encodeURIComponent(s) },
        { label: 'URL decode', fn: (s: string) => decodeURIComponent(s) },
        { label: 'Slug', fn: (s: string) => s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') },
    ];

    const handleFindReplace = () => {
        if (findText) {
            setInput(input.split(findText).join(replaceText));
        }
    };

    const copyText = async () => {
        await navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const extractUrls = async () => {
        await navigator.clipboard.writeText(stats.urls.join('\n'));
    };

    const extractEmails = async () => {
        await navigator.clipboard.writeText(stats.emails.join('\n'));
    };

    return (
        <div className={styles.appContainer}>
            {/* Stats Grid - Enhanced */}
            <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className={styles.statItem}>
                    <FileText size={14} color="var(--primary)" />
                    <span className={styles.statValue}>{stats.words}</span>
                    <span className={styles.statLabel}>Words</span>
                </div>
                <div className={styles.statItem}>
                    <Type size={14} color="var(--accent-cyan)" />
                    <span className={styles.statValue}>{stats.chars}</span>
                    <span className={styles.statLabel}>Chars</span>
                </div>
                <div className={styles.statItem}>
                    <AlignLeft size={14} color="var(--accent-purple)" />
                    <span className={styles.statValue}>{stats.lines}</span>
                    <span className={styles.statLabel}>Lines</span>
                </div>
                <div className={styles.statItem}>
                    <Clock size={14} color="var(--accent-green)" />
                    <span className={styles.statValue}>{stats.readingTime}m</span>
                    <span className={styles.statLabel}>Read Time</span>
                </div>
            </div>

            {/* Extra Stats Row */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                <span>{stats.sentences} sentences</span>
                <span>•</span>
                <span>{stats.paragraphs} paragraphs</span>
                <span>•</span>
                <span>{stats.charsNoSpace} chars (no spaces)</span>
                <span>•</span>
                <span>~{stats.speakingTime}m speaking</span>
            </div>

            {/* Text Area */}
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter or paste your text here..."
                className={styles.searchInput}
                style={{ minHeight: '140px', resize: 'vertical', lineHeight: 1.6 }}
            />

            {/* Find & Replace Toggle */}
            <button
                onClick={() => setShowFindReplace(!showFindReplace)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.75rem', background: showFindReplace ? 'var(--primary)' : 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)', borderRadius: '8px',
                    color: showFindReplace ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', width: 'fit-content',
                }}
            >
                <Replace size={14} /> Find & Replace
            </button>

            {showFindReplace && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '10px' }}>
                    <input
                        type="text"
                        value={findText}
                        onChange={(e) => setFindText(e.target.value)}
                        placeholder="Find..."
                        style={{ flex: 1, minWidth: '100px', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                    />
                    <input
                        type="text"
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        placeholder="Replace with..."
                        style={{ flex: 1, minWidth: '100px', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                    />
                    <button onClick={handleFindReplace} style={{ padding: '0.5rem 1rem', background: 'var(--gradient-primary)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        Replace All
                    </button>
                </div>
            )}

            {/* Transform Buttons */}
            <div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>Transform</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {transformations.map((t) => (
                        <button
                            key={t.label}
                            onClick={() => setInput(t.fn(input))}
                            style={{ padding: '0.4rem 0.7rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s ease' }}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tools Grid */}
            <div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>Tools</p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {tools.map((t) => (
                        <button
                            key={t.label}
                            onClick={() => setInput(t.fn(input))}
                            style={{ padding: '0.35rem 0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extract URLs/Emails */}
            {(stats.urls.length > 0 || stats.emails.length > 0) && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                    {stats.urls.length > 0 && (
                        <button onClick={extractUrls} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.7rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', color: 'var(--accent-cyan)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
                            <Link2 size={12} /> Copy {stats.urls.length} URL{stats.urls.length > 1 ? 's' : ''}
                        </button>
                    )}
                    {stats.emails.length > 0 && (
                        <button onClick={extractEmails} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.7rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '6px', color: 'var(--accent-purple)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
                            <Mail size={12} /> Copy {stats.emails.length} Email{stats.emails.length > 1 ? 's' : ''}
                        </button>
                    )}
                </div>
            )}

            {/* Character Frequency */}
            {stats.topChars.length > 0 && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    <span>Top chars: </span>
                    {stats.topChars.map(([char, count], i) => (
                        <span key={char} style={{ color: 'var(--text-secondary)' }}>
                            {char.toUpperCase()}({count}){i < stats.topChars.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
                <button onClick={copyText} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={() => setInput('')} className={styles.actionBtn}>
                    <RefreshCw size={16} /> Clear
                </button>
            </div>
        </div>
    );
}
