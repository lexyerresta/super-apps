'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Volume2, Book, AlertCircle, ExternalLink, ChevronDown, Loader2, Lightbulb, History, Star } from 'lucide-react';

interface DictionaryEntry {
    word: string;
    phonetic?: string;
    phonetics: { text?: string; audio?: string }[];
    meanings: {
        partOfSpeech: string;
        definitions: { definition: string; example?: string; synonyms?: string[] }[];
    }[];
    sourceUrls?: string[];
}

interface Language {
    code: string;
    name: string;
    flag: string;
    apiSupported: boolean;
}

const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', apiSupported: true },
    { code: 'es', name: 'Español', flag: '🇪🇸', apiSupported: true },
    { code: 'fr', name: 'Français', flag: '🇫🇷', apiSupported: true },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', apiSupported: true },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', apiSupported: true },
    { code: 'pt', name: 'Português', flag: '🇧🇷', apiSupported: true },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', apiSupported: true },
    { code: 'ja', name: '日本語', flag: '🇯🇵', apiSupported: true },
    { code: 'ko', name: '한국어', flag: '🇰🇷', apiSupported: true },
    { code: 'zh', name: '中文', flag: '🇨🇳', apiSupported: true },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', apiSupported: true },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', apiSupported: true },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', apiSupported: true },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱', apiSupported: true },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪', apiSupported: true },
];

// Common words for "Word of the Day" per language
const WORD_OF_DAY: Record<string, string[]> = {
    en: ['serendipity', 'ephemeral', 'eloquent', 'resilience', 'euphoria', 'luminous', 'vivacious', 'enigma'],
    es: ['mariposa', 'esperanza', 'libertad', 'alegría', 'corazón', 'amor', 'sueño', 'felicidad'],
    fr: ['papillon', 'soleil', 'étoile', 'rêve', 'bonheur', 'liberté', 'amour', 'lumière'],
    de: ['Schmetterling', 'Sehnsucht', 'Fernweh', 'Weltschmerz', 'Gemütlichkeit', 'Zeitgeist', 'Wanderlust', 'Freude'],
    it: ['farfalla', 'speranza', 'amore', 'libertà', 'bellezza', 'cuore', 'sogno', 'felicità'],
    pt: ['saudade', 'esperança', 'liberdade', 'amor', 'felicidade', 'coragem', 'alegria', 'sonho'],
    ru: ['душа', 'любовь', 'счастье', 'мечта', 'надежда', 'свобода', 'красота', 'радость'],
    ja: ['桜', '夢', '愛', '希望', '幸せ', '自由', '美しい', '光'],
    ko: ['사랑', '행복', '희망', '자유', '꿈', '별', '아름다움', '기쁨'],
    zh: ['爱', '梦想', '希望', '自由', '幸福', '美丽', '快乐', '和平'],
    ar: ['حب', 'سلام', 'حرية', 'سعادة', 'أمل', 'جمال', 'حلم', 'نور'],
    hi: ['प्यार', 'खुशी', 'आशा', 'स्वतंत्रता', 'सपना', 'सुंदरता', 'शांति', 'आनंद'],
    tr: ['aşk', 'mutluluk', 'umut', 'özgürlük', 'hayal', 'güzellik', 'barış', 'sevgi'],
    nl: ['liefde', 'geluk', 'hoop', 'vrijheid', 'droom', 'schoonheid', 'vrede', 'vreugde'],
    sv: ['kärlek', 'lycka', 'hopp', 'frihet', 'dröm', 'skönhet', 'fred', 'glädje'],
};

export default function DictionaryApp() {
    const [word, setWord] = useState('');
    const [searchedWord, setSearchedWord] = useState('');
    const [language, setLanguage] = useState<Language>(LANGUAGES[0]);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [entry, setEntry] = useState<DictionaryEntry | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [wordOfDay, setWordOfDay] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get word of the day based on current date
    useEffect(() => {
        const words = WORD_OF_DAY[language.code] || WORD_OF_DAY['en'];
        const dayIndex = new Date().getDate() % words.length;
        setWordOfDay(words[dayIndex]);
    }, [language]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`dict_recent_${language.code}`);
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        } else {
            setRecentSearches([]);
        }
    }, [language]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowLangDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchDefinition = async (searchWord: string) => {
        if (!searchWord) return;

        setLoading(true);
        setError('');
        setEntry(null);

        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/${language.code}/${encodeURIComponent(searchWord)}`
            );

            if (!response.ok) {
                throw new Error('Word not found');
            }

            const data: DictionaryEntry[] = await response.json();
            setEntry(data[0]);

            // Save to recent searches
            const newRecent = [searchWord, ...recentSearches.filter(w => w !== searchWord)].slice(0, 5);
            setRecentSearches(newRecent);
            localStorage.setItem(`dict_recent_${language.code}`, JSON.stringify(newRecent));

        } catch (err) {
            setError('Word not found in this language');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (word.trim()) {
            setSearchedWord(word.trim().toLowerCase());
            fetchDefinition(word.trim().toLowerCase());
        }
    };

    const handleQuickSearch = (w: string) => {
        setWord(w);
        setSearchedWord(w);
        fetchDefinition(w);
    };

    const playAudio = (audioUrl: string) => {
        const audio = new Audio(audioUrl);
        audio.play();
    };

    const audioUrl = entry?.phonetics.find(p => p.audio)?.audio;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header with Language Selector */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Book size={22} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Dictionary</span>
                </div>

                {/* Language Dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowLangDropdown(!showLangDropdown)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.75rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                        <ChevronDown size={14} style={{
                            transition: 'transform 0.2s',
                            transform: showLangDropdown ? 'rotate(180deg)' : 'rotate(0)'
                        }} />
                    </button>

                    {showLangDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '4px',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            zIndex: 100,
                            maxHeight: '250px',
                            overflowY: 'auto',
                            minWidth: '150px'
                        }}>
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang);
                                        setShowLangDropdown(false);
                                        setEntry(null);
                                        setError('');
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        width: '100%',
                                        padding: '0.6rem 1rem',
                                        background: language.code === lang.code ? 'var(--bg-tertiary)' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-primary)',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder={`Search ${language.name} word...`}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            paddingLeft: '38px',
                            fontSize: '0.9rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !word.trim()}
                    style={{
                        padding: '0 1.25rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: loading || !word.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        opacity: loading || !word.trim() ? 0.6 : 1
                    }}
                >
                    Search
                </button>
            </form>

            {/* Word of the Day & Recent */}
            {!entry && !loading && !error && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Word of the Day */}
                    <div
                        onClick={() => handleQuickSearch(wordOfDay)}
                        style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Lightbulb size={16} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                WORD OF THE DAY
                            </span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {wordOfDay}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                            Tap to learn this word
                        </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                <History size={14} style={{ color: 'var(--text-tertiary)' }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                                    RECENT SEARCHES
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {recentSearches.map((w, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleQuickSearch(w)}
                                        style={{
                                            padding: '0.4rem 0.75rem',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Suggestions */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                            <Star size={14} style={{ color: 'var(--text-tertiary)' }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                                TRY THESE WORDS
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {(WORD_OF_DAY[language.code] || WORD_OF_DAY['en']).slice(0, 4).map((w, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickSearch(w)}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        background: 'transparent',
                                        border: '1px solid var(--primary)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        color: 'var(--primary)'
                                    }}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                    <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
                        Looking up "{searchedWord}"...
                    </div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'rgba(255,100,100,0.1)',
                    borderRadius: '12px'
                }}>
                    <AlertCircle size={32} style={{ color: '#ff6b6b', marginBottom: '0.5rem' }} />
                    <div style={{ color: '#ff6b6b', fontWeight: '600' }}>{error}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                        Try a different word or language
                    </div>
                </div>
            )}

            {/* Result */}
            {entry && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

                    {/* Word Header */}
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        border: '1px solid var(--glass-border)',
                        marginBottom: '0.75rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                                    {entry.word}
                                </h2>
                                {entry.phonetic && (
                                    <p style={{ color: 'var(--primary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                                        {entry.phonetic}
                                    </p>
                                )}
                            </div>
                            {audioUrl && (
                                <button
                                    onClick={() => playAudio(audioUrl)}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                    }}
                                >
                                    <Volume2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Meanings */}
                    {entry.meanings.map((meaning, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                padding: '1rem',
                                marginBottom: '0.5rem'
                            }}
                        >
                            <div style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.6rem',
                                background: 'rgba(99, 102, 241, 0.15)',
                                borderRadius: '12px',
                                color: 'var(--primary)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                marginBottom: '0.6rem',
                                textTransform: 'uppercase'
                            }}>
                                {meaning.partOfSpeech}
                            </div>

                            <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                                {meaning.definitions.slice(0, 3).map((def, defIdx) => (
                                    <li key={defIdx} style={{
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.6rem',
                                        lineHeight: 1.45,
                                        fontSize: '0.9rem'
                                    }}>
                                        {def.definition}
                                        {def.example && (
                                            <p style={{
                                                color: 'var(--text-tertiary)',
                                                fontSize: '0.8rem',
                                                fontStyle: 'italic',
                                                marginTop: '0.2rem',
                                                marginBottom: 0
                                            }}>
                                                "{def.example}"
                                            </p>
                                        )}
                                        {def.synonyms && def.synonyms.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.3rem',
                                                flexWrap: 'wrap',
                                                marginTop: '0.4rem'
                                            }}>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Synonyms:</span>
                                                {def.synonyms.slice(0, 3).map((syn, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        onClick={() => handleQuickSearch(syn)}
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            padding: '2px 6px',
                                                            background: 'var(--bg-tertiary)',
                                                            borderRadius: '4px',
                                                            color: 'var(--primary)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {syn}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}

                    {/* Source */}
                    {entry.sourceUrls?.[0] && (
                        <a
                            href={entry.sourceUrls[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                color: 'var(--text-tertiary)',
                                fontSize: '0.75rem',
                                marginTop: '0.5rem'
                            }}
                        >
                            Source <ExternalLink size={11} />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
