'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Image, Upload, Download, Trash2, RefreshCw, Check, Crop, Move } from 'lucide-react';

export default function ImageCompressorApp() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [compressedUrl, setCompressedUrl] = useState<string>('');
    const [quality, setQuality] = useState(80);
    const [loading, setLoading] = useState(false);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setCompressedUrl('');
            setCompressedSize(0);

            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const compressImage = async () => {
        if (!preview) return;
        setLoading(true);

        try {
            const img = new window.Image();
            img.src = preview;

            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
                setCompressedUrl(dataUrl);

                // Calculate compressed size
                const base64 = dataUrl.split(',')[1];
                const bytes = atob(base64).length;
                setCompressedSize(bytes);
            }
        } catch (error) {
            console.error('Compression failed:', error);
        }

        setLoading(false);
    };

    const downloadImage = () => {
        if (!compressedUrl) return;

        const link = document.createElement('a');
        link.href = compressedUrl;
        link.download = `compressed-${quality}q.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reset = () => {
        setFile(null);
        setPreview('');
        setCompressedUrl('');
        setOriginalSize(0);
        setCompressedSize(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const reduction = compressedSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

    return (
        <div className={styles.appContainer}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
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
                    <Crop size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Upload Image to Compress
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        Reduce file size while maintaining quality
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
                            src={compressedUrl || preview}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }}
                        />
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            {file.name}
                        </p>
                    </div>

                    {/* Original vs Compressed Size */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={{
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '10px',
                            textAlign: 'center',
                        }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', margin: 0 }}>Original</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{formatSize(originalSize)}</p>
                        </div>
                        <div style={{
                            padding: '1rem',
                            background: compressedSize > 0 ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1))' : 'var(--bg-tertiary)',
                            borderRadius: '10px',
                            textAlign: 'center',
                            border: compressedSize > 0 ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
                        }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', margin: 0 }}>Compressed</p>
                            <p style={{ color: compressedSize > 0 ? 'var(--accent-green)' : 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                {compressedSize > 0 ? formatSize(compressedSize) : '---'}
                            </p>
                        </div>
                    </div>

                    {/* Reduction Badge */}
                    {compressedSize > 0 && (
                        <div style={{
                            padding: '0.75rem',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1))',
                            borderRadius: '10px',
                            textAlign: 'center',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}>
                            <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '1.5rem' }}>
                                -{reduction}%
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                                file size reduced
                            </span>
                        </div>
                    )}

                    {/* Quality Slider */}
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
                            onChange={(e) => { setQuality(Number(e.target.value)); setCompressedUrl(''); }}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                            <span>Smaller</span>
                            <span>Better Quality</span>
                        </div>
                    </div>

                    {/* Compress Button */}
                    {!compressedUrl ? (
                        <button
                            onClick={compressImage}
                            disabled={loading}
                            className={`${styles.actionBtn} ${styles.primaryBtn}`}
                            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                        >
                            <Crop size={18} />
                            {loading ? 'Compressing...' : 'Compress Image'}
                        </button>
                    ) : (
                        <button onClick={downloadImage} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                            <Download size={18} /> Download Compressed Image
                        </button>
                    )}

                    <button onClick={reset} className={styles.actionBtn} style={{ width: '100%' }}>
                        <RefreshCw size={16} /> Upload New Image
                    </button>
                </>
            )}
        </div>
    );
}
