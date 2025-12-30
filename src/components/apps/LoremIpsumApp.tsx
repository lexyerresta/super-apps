'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Text, Copy, Check, RefreshCw, ListOrdered, AlignLeft, Hash } from 'lucide-react';

const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'nam', 'libero', 'justo',
    'laoreet', 'blandit', 'massa', 'lacus', 'congue', 'posuere', 'cubilia', 'curae',
    'donec', 'vitae', 'sapien', 'sem', 'fringilla', 'arcu', 'ligula', 'suscipit',
    'egestas', 'maecenas', 'nec', 'purus', 'mi', 'vivamus', 'urna', 'felis', 'porta'
];

export default function LoremIpsumApp() {
    const [count, setCount] = useState(5);
    const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [startWithLorem, setStartWithLorem] = useState(true);

    const generateWord = () => {
        return loremWords[Math.floor(Math.random() * loremWords.length)];
    };

    const generateSentence = (wordCount: number = 0) => {
        const len = wordCount || Math.floor(Math.random() * 8) + 5;
        const words = [];
        for (let i = 0; i < len; i++) {
            words.push(generateWord());
        }
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return words.join(' ') + '.';
    };

    const generateParagraph = () => {
        const sentenceCount = Math.floor(Math.random() * 4) + 3;
        const sentences = [];
        for (let i = 0; i < sentenceCount; i++) {
            sentences.push(generateSentence());
        }
        return sentences.join(' ');
    };

    const generate = () => {
        let result = '';

        switch (type) {
            case 'paragraphs':
                const paragraphs = [];
                for (let i = 0; i < count; i++) {
                    paragraphs.push(generateParagraph());
                }
                result = paragraphs.join('\n\n');
                break;
            case 'sentences':
                const sentences = [];
                for (let i = 0; i < count; i++) {
                    sentences.push(generateSentence());
                }
                result = sentences.join(' ');
                break;
            case 'words':
                const words = [];
                for (let i = 0; i < count; i++) {
                    words.push(generateWord());
                }
                words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                result = words.join(' ') + '.';
                break;
        }

        if (startWithLorem && result.length > 0) {
            result = 'Lorem ipsum dolor sit amet, ' + result.slice(0, 1).toLowerCase() + result.slice(1);
        }

        setOutput(result);
    };

    const copyOutput = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    React.useEffect(() => {
        generate();
    }, []);

    const wordCount = output.split(/\s+/).filter(w => w).length;
    const charCount = output.length;

    return (
        <div className={styles.appContainer}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(217, 70, 239, 0.08))',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '20px',
                padding: '1.5rem',
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-tertiary)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                        }}>
                            Count
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                            className={styles.searchInput}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-tertiary)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                        }}>
                            Type
                        </label>
                        <div className={styles.tabs}>
                            {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                                <button
                                    key={t}
                                    className={`${styles.tabBtn} ${type === t ? styles.active : ''}`}
                                    onClick={() => setType(t)}
                                >
                                    {t === 'paragraphs' && <AlignLeft size={14} />}
                                    {t === 'sentences' && <ListOrdered size={14} />}
                                    {t === 'words' && <Hash size={14} />}
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                }}>
                    <input
                        type="checkbox"
                        checked={startWithLorem}
                        onChange={(e) => setStartWithLorem(e.target.checked)}
                        style={{ accentColor: 'var(--primary)' }}
                    />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Start with "Lorem ipsum dolor sit amet..."
                    </span>
                </label>
            </div>

            <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '0.5rem',
            }}>
                <div style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <Hash size={14} color="var(--primary)" />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{wordCount}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>words</span>
                </div>
                <div style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <Text size={14} color="var(--accent-purple)" />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{charCount}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>chars</span>
                </div>
            </div>

            <div style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                padding: '1rem',
                minHeight: '200px',
                maxHeight: '300px',
                overflow: 'auto',
            }}>
                <p style={{
                    color: 'var(--text-primary)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.9rem',
                }}>
                    {output || <span style={{ color: 'var(--text-tertiary)' }}>Click Generate to create Lorem Ipsum text...</span>}
                </p>
            </div>

            <div className={styles.actions}>
                <button onClick={generate} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    <RefreshCw size={16} /> Generate
                </button>
                <button onClick={copyOutput} className={styles.actionBtn} disabled={!output}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
}
