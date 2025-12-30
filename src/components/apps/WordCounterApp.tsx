'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { FileText, Copy, Check, Trash2, Clock, Hash, Type, AlignLeft, BookOpen } from 'lucide-react';

export default function WordCounterApp() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const trimmed = text.trim();
        if (!trimmed) {
            return { characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0 };
        }

        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = trimmed.split(/\s+/).filter(w => w.length > 0).length;
        const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = trimmed.split(/\n\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(words / 200); // avg 200 wpm reading
        const speakingTime = Math.ceil(words / 150); // avg 150 wpm speaking

        return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTime, speakingTime };
    }, [text]);

    const copyStats = async () => {
        const statsText = `Characters: ${stats.characters}\nCharacters (no spaces): ${stats.charactersNoSpaces}\nWords: ${stats.words}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nReading Time: ${stats.readingTime} min\nSpeaking Time: ${stats.speakingTime} min`;
        await navigator.clipboard.writeText(statsText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statItems = [
        { icon: Type, label: 'Characters', value: stats.characters.toLocaleString(), color: '#6366f1' },
        { icon: Hash, label: 'No Spaces', value: stats.charactersNoSpaces.toLocaleString(), color: '#8b5cf6' },
        { icon: FileText, label: 'Words', value: stats.words.toLocaleString(), color: '#ec4899' },
        { icon: AlignLeft, label: 'Sentences', value: stats.sentences.toLocaleString(), color: '#14b8a6' },
        { icon: BookOpen, label: 'Paragraphs', value: stats.paragraphs.toLocaleString(), color: '#f59e0b' },
        { icon: Clock, label: 'Read Time', value: `${stats.readingTime} min`, color: '#22c55e' },
    ];

    return (
        <div className={styles.appContainer}>
            {/* Text Input */}
            <div style={{ position: 'relative' }}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type your text here to count words, characters, sentences..."
                    className={styles.searchInput}
                    style={{ minHeight: '180px', resize: 'vertical', lineHeight: 1.6 }}
                />
                {text && (
                    <button
                        onClick={() => setText('')}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'var(--bg-tertiary)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.4rem',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.5rem' }}>
                {statItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.label}
                            style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                textAlign: 'center',
                            }}
                        >
                            <IconComponent size={20} color={item.color} style={{ marginBottom: '0.5rem' }} />
                            <div style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                                {item.value}
                            </div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Additional Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '0.75rem',
                padding: '1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
            }}>
                <div>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Speaking Time</span>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>~{stats.speakingTime} min</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Avg Word Length</span>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : '0'} chars
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Density</span>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0'} w/s
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button onClick={copyStats} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Stats'}
                </button>
                <button onClick={() => setText('')} className={styles.actionBtn}>
                    <Trash2 size={16} /> Clear
                </button>
            </div>
        </div>
    );
}
