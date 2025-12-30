'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Video, Upload, Download, Play, Pause, RefreshCw, Check, Settings } from 'lucide-react';

const VIDEO_FORMATS = ['mp4', 'webm', 'avi', 'mov', 'mkv'] as const;
type VideoFormat = typeof VIDEO_FORMATS[number];

const RESOLUTIONS = [
    { label: '480p', value: '854x480' },
    { label: '720p', value: '1280x720' },
    { label: '1080p', value: '1920x1080' },
    { label: '4K', value: '3840x2160' },
];

export default function VideoConverterApp() {
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [targetFormat, setTargetFormat] = useState<VideoFormat>('mp4');
    const [resolution, setResolution] = useState('1280x720');
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [converted, setConverted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setConverted(false);
            setProgress(0);
            const url = URL.createObjectURL(selectedFile);
            setVideoUrl(url);
        }
    };

    const convert = async () => {
        if (!file) return;
        setConverting(true);
        setProgress(0);

        // Simulate conversion with progress
        for (let i = 0; i <= 100; i += 5) {
            await new Promise(resolve => setTimeout(resolve, 150));
            setProgress(i);
        }

        setConverting(false);
        setConverted(true);
    };

    const reset = () => {
        setFile(null);
        setVideoUrl('');
        setConverted(false);
        setProgress(0);
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
            {/* File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="video/*"
                style={{ display: 'none' }}
            />

            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '3rem 2rem',
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--bg-secondary)',
                    }}
                >
                    <Video size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Upload Video File
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        Supports MP4, WebM, AVI, MOV, MKV
                    </p>
                </div>
            ) : (
                <>
                    {/* Video Preview */}
                    <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: 'black',
                    }}>
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            controls
                            style={{ width: '100%', maxHeight: '200px', display: 'block' }}
                        />
                    </div>

                    {/* File Info */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '10px',
                    }}>
                        <div>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: 0, fontSize: '0.85rem' }}>
                                {file.name.length > 25 ? file.name.slice(0, 25) + '...' : file.name}
                            </p>
                            <p style={{ color: 'var(--text-tertiary)', margin: 0, fontSize: '0.7rem' }}>
                                {formatSize(file.size)}
                            </p>
                        </div>
                        <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                            <RefreshCw size={18} />
                        </button>
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            <Video size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Output Format
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                            {VIDEO_FORMATS.map((format) => (
                                <button
                                    key={format}
                                    onClick={() => setTargetFormat(format)}
                                    style={{
                                        padding: '0.65rem 0.4rem',
                                        background: targetFormat === format ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: targetFormat === format ? 'white' : 'var(--text-secondary)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resolution Selection */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            <Settings size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Resolution
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {RESOLUTIONS.map((res) => (
                                <button
                                    key={res.value}
                                    onClick={() => setResolution(res.value)}
                                    style={{
                                        padding: '0.65rem 0.4rem',
                                        background: resolution === res.value ? 'var(--primary)' : 'var(--bg-tertiary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: resolution === res.value ? 'white' : 'var(--text-secondary)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {res.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {converting && (
                        <div>
                            <div style={{
                                height: '8px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    background: 'var(--gradient-primary)',
                                    transition: 'width 0.2s ease',
                                }} />
                            </div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem' }}>
                                Converting... {progress}%
                            </p>
                        </div>
                    )}

                    {/* Convert Button */}
                    {!converted ? (
                        <button
                            onClick={convert}
                            disabled={converting}
                            className={`${styles.actionBtn} ${styles.primaryBtn}`}
                            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                        >
                            <Video size={18} />
                            {converting ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
                        </button>
                    ) : (
                        <button
                            className={`${styles.actionBtn} ${styles.primaryBtn}`}
                            style={{ width: '100%', padding: '1rem', fontSize: '1rem', background: 'linear-gradient(135deg, #22c55e, #14b8a6)' }}
                        >
                            <Download size={18} /> Download {targetFormat.toUpperCase()}
                        </button>
                    )}

                    {converted && (
                        <div style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1))',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '10px',
                            textAlign: 'center',
                        }}>
                            <Check size={24} color="var(--accent-green)" style={{ marginBottom: '0.5rem' }} />
                            <p style={{ color: 'var(--accent-green)', fontWeight: 600, margin: 0 }}>
                                Conversion Complete!
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
