'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { FileText, Upload, Download, ArrowRight, Check, RefreshCw, File, FileSpreadsheet } from 'lucide-react';

const CONVERSIONS = [
    { from: 'PDF', to: 'Word', fromColor: '#ef4444', toColor: '#3b82f6', icon: FileText },
    { from: 'Word', to: 'PDF', fromColor: '#3b82f6', toColor: '#ef4444', icon: FileText },
    { from: 'Excel', to: 'PDF', fromColor: '#22c55e', toColor: '#ef4444', icon: FileSpreadsheet },
    { from: 'PDF', to: 'Excel', fromColor: '#ef4444', toColor: '#22c55e', icon: FileSpreadsheet },
    { from: 'Word', to: 'TXT', fromColor: '#3b82f6', toColor: '#6366f1', icon: File },
    { from: 'PDF', to: 'TXT', fromColor: '#ef4444', toColor: '#6366f1', icon: FileText },
];

export default function DocumentConverterApp() {
    const [selectedConversion, setSelectedConversion] = useState(CONVERSIONS[0]);
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [converted, setConverted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setConverted(false);
        }
    };

    const getAcceptTypes = () => {
        switch (selectedConversion.from) {
            case 'PDF': return '.pdf';
            case 'Word': return '.doc,.docx';
            case 'Excel': return '.xls,.xlsx';
            default: return '*';
        }
    };

    const convert = async () => {
        if (!file) return;
        setConverting(true);

        // Simulate conversion
        await new Promise(resolve => setTimeout(resolve, 2500));

        setConverting(false);
        setConverted(true);
    };

    const reset = () => {
        setFile(null);
        setConverted(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className={styles.appContainer}>
            {/* Conversion Type Selection */}
            <div>
                <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Select Conversion Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                    {CONVERSIONS.map((conv, index) => (
                        <button
                            key={index}
                            onClick={() => { setSelectedConversion(conv); reset(); }}
                            style={{
                                padding: '0.75rem',
                                background: selectedConversion === conv ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                border: selectedConversion === conv ? 'none' : '1px solid var(--glass-border)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span style={{ color: selectedConversion === conv ? 'white' : conv.fromColor, fontWeight: 700, fontSize: '0.8rem' }}>
                                {conv.from}
                            </span>
                            <ArrowRight size={14} color={selectedConversion === conv ? 'white' : 'var(--text-tertiary)'} />
                            <span style={{ color: selectedConversion === conv ? 'white' : conv.toColor, fontWeight: 700, fontSize: '0.8rem' }}>
                                {conv.to}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={getAcceptTypes()}
                style={{ display: 'none' }}
            />

            {/* Upload Area */}
            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '2.5rem 2rem',
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '14px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--bg-secondary)',
                    }}
                >
                    <Upload size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Upload {selectedConversion.from} File
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        Click or drag & drop your file here
                    </p>
                </div>
            ) : (
                <>
                    {/* Selected File */}
                    <div style={{
                        padding: '1.25rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            background: `linear-gradient(135deg, ${selectedConversion.fromColor}20, ${selectedConversion.fromColor}40)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <FileText size={24} color={selectedConversion.fromColor} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>
                                {file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name}
                            </p>
                            <p style={{ color: 'var(--text-tertiary)', margin: 0, fontSize: '0.75rem' }}>
                                {formatSize(file.size)}
                            </p>
                        </div>
                        <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                            <RefreshCw size={18} />
                        </button>
                    </div>

                    {/* Conversion Visual */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        padding: '1.5rem',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${selectedConversion.fromColor}30, ${selectedConversion.fromColor}50)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 0.5rem',
                            }}>
                                <FileText size={28} color={selectedConversion.fromColor} />
                            </div>
                            <span style={{ color: selectedConversion.fromColor, fontWeight: 700 }}>{selectedConversion.from}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {converting ? (
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid var(--glass-border)',
                                    borderTopColor: 'var(--primary)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                }} />
                            ) : (
                                <ArrowRight size={32} color="var(--primary)" />
                            )}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                background: converted ? `linear-gradient(135deg, ${selectedConversion.toColor}30, ${selectedConversion.toColor}50)` : 'var(--bg-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 0.5rem',
                                border: converted ? 'none' : '2px dashed var(--glass-border)',
                            }}>
                                {converted ? <Check size={28} color={selectedConversion.toColor} /> : <FileText size={28} color="var(--text-tertiary)" />}
                            </div>
                            <span style={{ color: converted ? selectedConversion.toColor : 'var(--text-tertiary)', fontWeight: 700 }}>{selectedConversion.to}</span>
                        </div>
                    </div>

                    {/* Convert/Download Button */}
                    {!converted ? (
                        <button
                            onClick={convert}
                            disabled={converting}
                            className={`${styles.actionBtn} ${styles.primaryBtn}`}
                            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                        >
                            {converting ? 'Converting...' : `Convert to ${selectedConversion.to}`}
                        </button>
                    ) : (
                        <button
                            onClick={() => { /* Download logic */ }}
                            className={`${styles.actionBtn} ${styles.primaryBtn}`}
                            style={{ width: '100%', padding: '1rem', fontSize: '1rem', background: 'linear-gradient(135deg, #22c55e, #14b8a6)' }}
                        >
                            <Download size={18} /> Download {selectedConversion.to} File
                        </button>
                    )}
                </>
            )}

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
