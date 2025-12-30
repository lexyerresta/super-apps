'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Radio, Copy, Volume2, Check, ArrowLeftRight } from 'lucide-react';

const MORSE_CODE: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--',
    '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
    ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.', ' ': '/'
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
    Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

export default function MorseCodeApp() {
    const [text, setText] = useState('');
    const [morse, setMorse] = useState('');
    const [mode, setMode] = useState<'textToMorse' | 'morseToText'>('textToMorse');
    const [copied, setCopied] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const textToMorse = (input: string): string => {
        return input.toUpperCase().split('').map(char => MORSE_CODE[char] || char).join(' ');
    };

    const morseToText = (input: string): string => {
        return input.split(' ').map(code => {
            if (code === '/') return ' ';
            return REVERSE_MORSE[code] || code;
        }).join('');
    };

    const handleTextChange = (value: string) => {
        setText(value);
        if (mode === 'textToMorse') {
            setMorse(textToMorse(value));
        }
    };

    const handleMorseChange = (value: string) => {
        setMorse(value);
        if (mode === 'morseToText') {
            setText(morseToText(value));
        }
    };

    const toggleMode = () => {
        if (mode === 'textToMorse') {
            setMode('morseToText');
            setText(morseToText(morse));
        } else {
            setMode('textToMorse');
            setMorse(textToMorse(text));
        }
    };

    const copyToClipboard = async (content: string) => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const playMorse = async () => {
        if (isPlaying || !morse) return;
        setIsPlaying(true);

        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const dotDuration = 100;
        const dashDuration = dotDuration * 3;
        const pauseDuration = dotDuration;
        const letterPause = dotDuration * 3;
        const wordPause = dotDuration * 7;

        let time = audioContext.currentTime;

        for (const char of morse) {
            if (char === '.') {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 600;
                gain.gain.value = 0.5;
                osc.start(time);
                osc.stop(time + dotDuration / 1000);
                time += (dotDuration + pauseDuration) / 1000;
            } else if (char === '-') {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 600;
                gain.gain.value = 0.5;
                osc.start(time);
                osc.stop(time + dashDuration / 1000);
                time += (dashDuration + pauseDuration) / 1000;
            } else if (char === ' ') {
                time += letterPause / 1000;
            } else if (char === '/') {
                time += wordPause / 1000;
            }
        }

        setTimeout(() => {
            setIsPlaying(false);
            audioContext.close();
        }, (time - audioContext.currentTime) * 1000 + 100);
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
                    <Radio size={24} />
                </div>
                <div>
                    <h2>Morse Code</h2>
                    <p>Translate to and from Morse code</p>
                </div>
            </div>

            <div className={styles.modeToggle}>
                <span className={mode === 'textToMorse' ? styles.active : ''}>Text → Morse</span>
                <button onClick={toggleMode} className={styles.toggleButton}>
                    <ArrowLeftRight size={20} />
                </button>
                <span className={mode === 'morseToText' ? styles.active : ''}>Morse → Text</span>
            </div>

            <div className={styles.converterSection}>
                <div className={styles.formGroup}>
                    <label>{mode === 'textToMorse' ? 'Text' : 'Morse Code'}</label>
                    <textarea
                        value={mode === 'textToMorse' ? text : morse}
                        onChange={(e) => mode === 'textToMorse' ? handleTextChange(e.target.value) : handleMorseChange(e.target.value)}
                        placeholder={mode === 'textToMorse' ? 'Enter text to convert...' : 'Enter morse code (use . and -)'}
                        rows={4}
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>{mode === 'textToMorse' ? 'Morse Code' : 'Text'}</label>
                    <div className={styles.outputBox}>
                        <span className={styles.morseOutput}>
                            {mode === 'textToMorse' ? morse || 'Morse code will appear here...' : text || 'Text will appear here...'}
                        </span>
                        <div className={styles.outputActions}>
                            <button onClick={() => copyToClipboard(mode === 'textToMorse' ? morse : text)} className={styles.iconButton} disabled={!(mode === 'textToMorse' ? morse : text)}>
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                            {mode === 'textToMorse' && morse && (
                                <button onClick={playMorse} className={styles.iconButton} disabled={isPlaying}>
                                    <Volume2 size={18} className={isPlaying ? styles.playing : ''} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.morseReference}>
                <h4>Morse Code Reference</h4>
                <div className={styles.morseGrid}>
                    {Object.entries(MORSE_CODE).slice(0, 36).map(([char, code]) => (
                        <div key={char} className={styles.morseItem}>
                            <span className={styles.morseChar}>{char === ' ' ? '␣' : char}</span>
                            <span className={styles.morseCode}>{code}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
