'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Mic, MicOff, Copy, Check, Trash2, Volume2 } from 'lucide-react';

export default function SpeechToTextApp() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [copied, setCopied] = useState(false);
    const [lang, setLang] = useState('en-US');
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    const languages = [
        { code: 'en-US', name: 'English (US)' },
        { code: 'en-GB', name: 'English (UK)' },
        { code: 'id-ID', name: 'Indonesian' },
        { code: 'es-ES', name: 'Spanish' },
        { code: 'fr-FR', name: 'French' },
        { code: 'de-DE', name: 'German' },
        { code: 'ja-JP', name: 'Japanese' },
        { code: 'zh-CN', name: 'Chinese' },
        { code: 'ko-KR', name: 'Korean' },
        { code: 'pt-BR', name: 'Portuguese' },
    ];

    const startListening = () => {
        setError(null);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const windowAny = window as any;
        if (!windowAny.webkitSpeechRecognition && !windowAny.SpeechRecognition) {
            setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognitionAPI = windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => setIsListening(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript + ' ';
                } else {
                    interim += result[0].transcript;
                }
            }

            if (final) setTranscript(prev => prev + final);
            setInterimTranscript(interim);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
            setError(`Error: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
    };

    const copyTranscript = async () => {
        await navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
    };

    const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                    <Volume2 size={24} />
                </div>
                <div>
                    <h2>Speech to Text</h2>
                    <p>Convert your voice to text in real-time</p>
                </div>
            </div>

            {/* Language Selection */}
            <div className={styles.formGroup}>
                <label>Language</label>
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    disabled={isListening}
                    className={styles.select}
                >
                    {languages.map(l => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                </select>
            </div>

            {/* Microphone Button */}
            <div className={styles.flexCenter}>
                <button
                    onClick={isListening ? stopListening : startListening}
                    className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
                >
                    {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                </button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
                <div>
                    <div className={styles.listeningIndicator}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.listeningBar} />
                        ))}
                    </div>
                    <p className={styles.listeningText}>Listening...</p>
                </div>
            )}

            {/* Transcript Area */}
            <div className={styles.formGroup}>
                <div className={styles.flexBetween}>
                    <label>Transcript</label>
                    <span className={styles.badge}>{wordCount} words</span>
                </div>
                <div className={styles.transcriptBox}>
                    {transcript}
                    {interimTranscript && (
                        <span className={styles.transcriptInterim}>{interimTranscript}</span>
                    )}
                    {!transcript && !interimTranscript && (
                        <span className={styles.transcriptPlaceholder}>
                            Click the microphone to start speaking...
                        </span>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className={`${styles.infoBox} ${styles.error}`}>
                    {error}
                </div>
            )}

            {/* Actions */}
            {transcript && (
                <div className={styles.buttonGroup}>
                    <button onClick={copyTranscript} className={styles.primaryButton}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button onClick={clearTranscript} className={styles.secondaryButton}>
                        <Trash2 size={16} /> Clear
                    </button>
                </div>
            )}

            {/* Info */}
            <div className={styles.infoBox}>
                💡 Works best in Chrome or Edge. Speak clearly for better accuracy.
            </div>
        </div>
    );
}
