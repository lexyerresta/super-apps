'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { Search, Volume2, Book, AlertCircle, ExternalLink } from 'lucide-react';

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

export default function DictionaryApp() {
    const [word, setWord] = useState('');
    const [searchedWord, setSearchedWord] = useState('');

    const fetchDefinition = async () => {
        if (!searchedWord) return null;
        const data = await httpClient<DictionaryEntry[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`);
        return data[0];
    };

    const { data: entry, loading, error, execute } = useAsync<DictionaryEntry | null>(
        fetchDefinition,
        [searchedWord]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (word.trim()) {
            setSearchedWord(word.trim().toLowerCase());
        }
    };

    const playAudio = (audioUrl: string) => {
        const audio = new Audio(audioUrl);
        audio.play();
    };

    const audioUrl = entry?.phonetics.find(p => p.audio)?.audio;

    return (
        <div className={styles.appContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Search for a word..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                    <Search size={18} />
                </button>
            </form>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Looking up definition...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                    <p>Word not found</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Try searching for another word</p>
                </div>
            ) : entry ? (
                <div style={{ animation: 'slideUp 0.3s ease' }}>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        border: '1px solid var(--glass-border)',
                        marginBottom: '1rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 800 }}>
                                    {entry.word}
                                </h2>
                                {entry.phonetic && (
                                    <p style={{ color: 'var(--primary)', fontSize: '1rem' }}>{entry.phonetic}</p>
                                )}
                            </div>
                            {audioUrl && (
                                <button
                                    onClick={() => playAudio(audioUrl)}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'var(--gradient-primary)',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                    }}
                                >
                                    <Volume2 size={22} />
                                </button>
                            )}
                        </div>

                        {entry.meanings.map((meaning, idx) => (
                            <div key={idx} style={{ marginBottom: '1.25rem' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '50px',
                                    color: 'var(--primary)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    marginBottom: '0.75rem',
                                }}>
                                    {meaning.partOfSpeech}
                                </div>
                                <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                                    {meaning.definitions.slice(0, 3).map((def, defIdx) => (
                                        <li key={defIdx} style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                            {def.definition}
                                            {def.example && (
                                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
                                                    "{def.example}"
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}

                        {entry.sourceUrls?.[0] && (
                            <a
                                href={entry.sourceUrls[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    color: 'var(--text-tertiary)',
                                    fontSize: '0.8rem',
                                }}
                            >
                                Source <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Book size={36} color="var(--primary)" />
                    </div>
                    <p>Search for any English word</p>
                    <p className={styles.emptyHint}>Get definitions, phonetics, and examples</p>
                </div>
            )}
        </div>
    );
}
