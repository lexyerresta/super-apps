'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Type, Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'dot' | 'path' | 'alternate' | 'inverse';

const CASE_OPTIONS: { id: CaseType; label: string; description: string }[] = [
    { id: 'upper', label: 'UPPERCASE', description: 'ALL CAPS' },
    { id: 'lower', label: 'lowercase', description: 'all lowercase' },
    { id: 'title', label: 'Title Case', description: 'Capitalize Each Word' },
    { id: 'sentence', label: 'Sentence case', description: 'First letter capitalized' },
    { id: 'camel', label: 'camelCase', description: 'First word lower, rest upper' },
    { id: 'pascal', label: 'PascalCase', description: 'All words capitalized' },
    { id: 'snake', label: 'snake_case', description: 'Underscore separator' },
    { id: 'kebab', label: 'kebab-case', description: 'Dash separator' },
    { id: 'constant', label: 'CONSTANT_CASE', description: 'Upper snake case' },
    { id: 'dot', label: 'dot.case', description: 'Dot separator' },
    { id: 'alternate', label: 'aLtErNaTe', description: 'Alternating caps' },
    { id: 'inverse', label: 'iNVERSE', description: 'Swap case' },
];

export default function CaseConverterApp() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [activeCase, setActiveCase] = useState<CaseType>('upper');
    const [copied, setCopied] = useState(false);

    const convertCase = (text: string, caseType: CaseType): string => {
        if (!text) return '';

        const words = text.toLowerCase().split(/[\s_\-\.]+/);

        switch (caseType) {
            case 'upper':
                return text.toUpperCase();
            case 'lower':
                return text.toLowerCase();
            case 'title':
                return text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            case 'sentence':
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            case 'camel':
                return words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
            case 'pascal':
                return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
            case 'snake':
                return words.join('_');
            case 'kebab':
                return words.join('-');
            case 'constant':
                return words.join('_').toUpperCase();
            case 'dot':
                return words.join('.');
            case 'alternate':
                return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
            case 'inverse':
                return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
            default:
                return text;
        }
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        setOutput(convertCase(value, activeCase));
    };

    const handleCaseChange = (caseType: CaseType) => {
        setActiveCase(caseType);
        setOutput(convertCase(input, caseType));
    };

    const copyOutput = async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swapTexts = () => {
        setInput(output);
        setOutput(convertCase(output, activeCase));
    };

    const clear = () => {
        setInput('');
        setOutput('');
    };

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                    <Type size={24} />
                </div>
                <div>
                    <h2>Case Converter</h2>
                    <p>Transform text case instantly</p>
                </div>
            </div>

            {/* Input */}
            <div className={styles.formGroup}>
                <label>Input Text</label>
                <textarea
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter text to convert..."
                    className={styles.textarea}
                    style={{ minHeight: '80px' }}
                />
            </div>

            {/* Case Options */}
            <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>Select Case</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}>
                    {CASE_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            onClick={() => handleCaseChange(option.id)}
                            className={`${styles.presetButton} ${activeCase === option.id ? styles.active : ''}`}
                            style={{ fontSize: '0.7rem', padding: '0.5rem' }}
                            title={option.description}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Swap Button */}
            {input && (
                <div className={styles.flexCenter}>
                    <button onClick={swapTexts} className={styles.iconButton}>
                        <ArrowRightLeft size={18} />
                    </button>
                </div>
            )}

            {/* Output */}
            <div className={styles.formGroup}>
                <div className={styles.flexBetween}>
                    <label>Output ({CASE_OPTIONS.find(c => c.id === activeCase)?.label})</label>
                    <span className={styles.badge}>{output.length} chars</span>
                </div>
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    minHeight: '80px',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: output ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    wordBreak: 'break-word',
                }}>
                    {output || 'Converted text will appear here...'}
                </div>
            </div>

            {/* Actions */}
            <div className={styles.buttonGroup}>
                <button
                    onClick={copyOutput}
                    className={styles.primaryButton}
                    style={{ flex: 1 }}
                    disabled={!output}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                {input && (
                    <button onClick={clear} className={styles.secondaryButton}>
                        <RotateCcw size={18} /> Clear
                    </button>
                )}
            </div>

            {/* Info */}
            <div className={styles.infoBox}>
                📝 Supports 12 different case formats including programming conventions!
            </div>
        </div>
    );
}
