'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Image, Download, Upload, RefreshCw, Check, FileImage, Maximize, Minimize } from 'lucide-react';

const FORMATS = ['png', 'jpeg', 'webp', 'bmp'] as const;
type ImageFormat = typeof FORMATS[number];

export default function ImageConverterApp() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [convertedUrl, setConvertedUrl] = useState<string>('');
    const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
    const [quality, setQuality] = useState(90);
    const [loading, setLoading] = useState(false);
    const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setConvertedUrl('');

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setPreview(result);

                // Get original dimensions
                const img = new window.Image();
                img.onload = () => {
                    setOriginalSize({ width: img.width, height: img.height });
                };
                img.src = result;
            };
            reader.readAsDataURL(file);
        }
    };

    const convertImage = async () => {
        if (!preview) return;
        setLoading(true);

        try {
            const img = new window.Image();
            img.src = preview;

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);

                const mimeType = `image/${targetFormat}`;
                const qualityValue = targetFormat === 'png' ? undefined : quality / 100;

                const dataUrl = canvas.toDataURL(mimeType, qualityValue);
                setConvertedUrl(dataUrl);
            }
        } catch (error) {
            console.error('Conversion failed:', error);
        }

        setLoading(false);
    };

    const downloadImage = () => {
        if (!convertedUrl) return;

        const link = document.createElement('a');
        link.href = convertedUrl;
        link.download = `converted-image.${targetFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reset = () => {
        setSelectedFile(null);
        setPreview('');
        setConvertedUrl('');
        setOriginalSize(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileSize = (dataUrl: string) => {
        const base64 = dataUrl.split(',')[1];
        const bytes = atob(base64).length;
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
                accept="image/*"
                style={{ display: 'none' }}
            />

            {!selectedFile ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '3rem 2rem',
                        border: '2px dashed var(--glass-border)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--bg-secondary)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Click to upload image
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        Supports PNG, JPEG, WebP, GIF, BMP
                    </p>
                </div>
            ) : (
                <>
                    {/* Preview */}
                    <div style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                objectFit: 'contain',
                            }}
                        />
                        {originalSize && (
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                {selectedFile.name} • {originalSize.width}x{originalSize.height} • {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        )}
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            <FileImage size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Convert To
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {FORMATS.map((format) => (
                                <button
                                    key={format}
                                    onClick={() => setTargetFormat(format)}
                                    style={{
                                        padding: '0.75rem',
                                        background: targetFormat === format ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: targetFormat === format ? 'white' : 'var(--text-secondary)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quality Slider (for JPEG/WebP) */}
                    {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                        <div>
                            <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                <span>Quality</span>
                                <span style={{ color: 'var(--primary)' }}>{quality}%</span>
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>
                    )}

                    {/* Convert Button */}
                    <button
                        onClick={convertImage}
                        disabled={loading}
                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                        style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                    >
                        <Image size={18} />
                        {loading ? 'Converting...' : 'Convert Image'}
                    </button>

                    {/* Converted Result */}
                    {convertedUrl && (
                        <div style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1))',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '12px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Check size={16} /> Converted Successfully!
                                </span>
                                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                                    {getFileSize(convertedUrl)}
                                </span>
                            </div>
                            <button
                                onClick={downloadImage}
                                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                style={{ width: '100%' }}
                            >
                                <Download size={16} /> Download {targetFormat.toUpperCase()}
                            </button>
                        </div>
                    )}

                    {/* Reset Button */}
                    <button onClick={reset} className={styles.actionBtn} style={{ width: '100%' }}>
                        <RefreshCw size={16} /> Upload New Image
                    </button>
                </>
            )}
        </div>
    );
}
