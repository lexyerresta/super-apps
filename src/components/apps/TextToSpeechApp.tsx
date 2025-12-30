'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Volume2, Play, Pause, Square, Settings, Copy, Check } from 'lucide-react';

const VOICES_BY_LANG = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'id-ID': 'Indonesian',
    'es-ES': 'Spanish',
    'fr-FR': 'French',
    'de-DE': 'German',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
    'zh-CN': 'Chinese',
};

export default function TextToSpeechApp() {
    const [text, setText] = useState('');
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const [lang, setLang] = useState('en-US');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            speechSynthesis.cancel();
        };
    }, []);

    const speak = () => {
        if (!text.trim()) return;

        if (paused) {
            speechSynthesis.resume();
            setPaused(false);
            return;
        }

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        // Find matching voice
        const voice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => { setSpeaking(false); setPaused(false); };
        utterance.onerror = () => { setSpeaking(false); setPaused(false); };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
    };

    const pauseResume = () => {
        if (speaking && !paused) {
            speechSynthesis.pause();
            setPaused(true);
        } else if (paused) {
            speechSynthesis.resume();
            setPaused(false);
        }
    };

    const stop = () => {
        speechSynthesis.cancel();
        setSpeaking(false);
        setPaused(false);
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const estimatedTime = Math.ceil(wordCount / (150 * rate));

    return (
        <div className={styles.appContainer}>
            {/* Text Input */}
            <div style={{ position: 'relative' }}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste text to convert to speech..."
                    className={styles.searchInput}
                    style={{ minHeight: '140px', resize: 'vertical', lineHeight: 1.6 }}
                />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                        {wordCount} words • ~{estimatedTime} min
                    </span>
                </div>
            </div>

            {/* Language Selection */}
            <div>
                <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Language / Voice
                </label>
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                    }}
                >
                    {Object.entries(VOICES_BY_LANG).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Settings Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                        <span>Speed</span>
                        <span style={{ color: 'var(--primary)' }}>{rate}x</span>
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                        <span>Pitch</span>
                        <span style={{ color: 'var(--primary)' }}>{pitch}</span>
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                        <span>Volume</span>
                        <span style={{ color: 'var(--primary)' }}>{Math.round(volume * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                </div>
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={speak}
                    disabled={!text.trim()}
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    style={{ flex: 2, padding: '1rem', fontSize: '1rem' }}
                >
                    {speaking && !paused ? <Pause size={18} /> : <Play size={18} />}
                    {speaking && !paused ? 'Speaking...' : paused ? 'Resume' : 'Speak'}
                </button>

                {speaking && (
                    <>
                        <button
                            onClick={pauseResume}
                            className={styles.actionBtn}
                            style={{ padding: '1rem' }}
                        >
                            {paused ? <Play size={18} /> : <Pause size={18} />}
                        </button>
                        <button
                            onClick={stop}
                            className={styles.actionBtn}
                            style={{ padding: '1rem' }}
                        >
                            <Square size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* Speaking Indicator */}
            {speaking && (
                <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    textAlign: 'center',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Volume2 size={20} color="var(--primary)" />
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            {paused ? 'Paused' : 'Speaking...'}
                        </span>
                    </div>
                    {!paused && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '4px',
                                        height: '20px',
                                        background: 'var(--primary)',
                                        borderRadius: '2px',
                                        animation: `pulse 0.5s ease-in-out ${i * 0.1}s infinite alternate`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    from { transform: scaleY(0.5); opacity: 0.5; }
                    to { transform: scaleY(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
