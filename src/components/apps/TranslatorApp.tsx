'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { Languages, ArrowLeftRight, Copy, Check, Volume2, Trash2, Star, History } from 'lucide-react';

interface Translation {
    from: string;
    to: string;
    sourceText: string;
    translatedText: string;
    timestamp: number;
}

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
];

export default function TranslatorApp() {
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('id');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState<Translation[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('translate-history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const translate = async () => {
        if (!sourceText.trim()) return;
        setLoading(true);
        let result = '';
        try {
            // Using MyMemory Translation API (free, no key required, reliable)
            const langPair = `${sourceLang}|${targetLang}`;
            const res = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${langPair}`
            );

            if (res.ok) {
                const data = await res.json();
                if (data.responseStatus === 200 && data.responseData?.translatedText) {
                    result = data.responseData.translatedText;
                } else {
                    // Fallback jika response tidak valid
                    result = `[${LANGUAGES.find(l => l.code === targetLang)?.name}] ${sourceText}`;
                }
            } else {
                result = `[${LANGUAGES.find(l => l.code === targetLang)?.name}] ${sourceText}`;
            }
        } catch (error) {
            // Fallback if API fails
            result = `[${LANGUAGES.find(l => l.code === targetLang)?.name}] ${sourceText}`;
        }

        setTranslatedText(result);

        const newTranslation: Translation = {
            from: sourceLang,
            to: targetLang,
            sourceText,
            translatedText: result,
            timestamp: Date.now(),
        };
        const newHistory = [newTranslation, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('translate-history', JSON.stringify(newHistory));
        setLoading(false);
    };

    const swapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const copyTranslation = async () => {
        await navigator.clipboard.writeText(translatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const speak = (text: string, lang: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
    };

    const getLang = (code: string) => LANGUAGES.find(l => l.code === code);

    return (
        <div className={styles.appContainer}>
            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    style={{
                        flex: '1 1 120px',
                        minWidth: '120px',
                        padding: '0.75rem 0.75rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                </select>

                <button
                    onClick={swapLanguages}
                    style={{
                        width: '40px', height: '40px',
                        flexShrink: 0,
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ArrowLeftRight size={16} />
                </button>

                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    style={{
                        flex: '1 1 120px',
                        minWidth: '120px',
                        padding: '0.75rem 0.75rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                </select>
            </div>

            {/* Source Text */}
            <div style={{ position: 'relative' }}>
                <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Enter text to translate..."
                    className={styles.searchInput}
                    style={{ minHeight: '120px', resize: 'vertical' }}
                />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => speak(sourceText, sourceLang)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <Volume2 size={14} />
                    </button>
                    <button onClick={() => setSourceText('')} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Translate Button */}
            <button
                onClick={translate}
                disabled={loading || !sourceText.trim()}
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
                <Languages size={18} />
                {loading ? 'Translating...' : 'Translate'}
            </button>

            {/* Translated Text */}
            {translatedText && (
                <div style={{
                    padding: '1.25rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '14px',
                    position: 'relative',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {getLang(targetLang)?.flag} {getLang(targetLang)?.name}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => speak(translatedText, targetLang)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <Volume2 size={14} />
                            </button>
                            <button onClick={copyTranslation} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', color: copied ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {translatedText}
                    </p>
                </div>
            )}

            {/* History Toggle */}
            <button onClick={() => setShowHistory(!showHistory)} className={styles.actionBtn} style={{ width: '100%' }}>
                <History size={16} /> {showHistory ? 'Hide' : 'Show'} History
            </button>

            {/* History */}
            {showHistory && history.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflow: 'auto' }}>
                    {history.map((item, i) => (
                        <div key={i} onClick={() => { setSourceText(item.sourceText); setSourceLang(item.from); setTargetLang(item.to); }} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-tertiary)' }}>{getLang(item.from)?.flag}→{getLang(item.to)?.flag}</span>
                            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{item.sourceText.slice(0, 30)}...</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
