'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Maximize, Download, RefreshCw, Check } from 'lucide-react';

export default function ImageResizerApp() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
    const [newWidth, setNewWidth] = useState('');
    const [newHeight, setNewHeight] = useState('');
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [resizedUrl, setResizedUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setResizedUrl('');

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setPreview(result);

                const img = new window.Image();
                img.onload = () => {
                    setOriginalSize({ width: img.width, height: img.height });
                    setNewWidth(img.width.toString());
                    setNewHeight(img.height.toString());
                };
                img.src = result;
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleWidthChange = (value: string) => {
        setNewWidth(value);
        if (maintainAspect && originalSize && value) {
            const ratio = originalSize.height / originalSize.width;
            setNewHeight(Math.round(parseInt(value) * ratio).toString());
        }
    };

    const handleHeightChange = (value: string) => {
        setNewHeight(value);
        if (maintainAspect && originalSize && value) {
            const ratio = originalSize.width / originalSize.height;
            setNewWidth(Math.round(parseInt(value) * ratio).toString());
        }
    };

    const resizeImage = async () => {
        if (!preview || !newWidth || !newHeight) return;
        setLoading(true);

        try {
            const img = new window.Image();
            img.src = preview;
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            canvas.width = parseInt(newWidth);
            canvas.height = parseInt(newHeight);

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setResizedUrl(canvas.toDataURL('image/png'));
            }
        } catch (error) {
            console.error('Resize failed:', error);
        }

        setLoading(false);
    };

    const downloadImage = () => {
        if (!resizedUrl) return;
        const link = document.createElement('a');
        link.href = resizedUrl;
        link.download = `resized-${newWidth}x${newHeight}.png`;
        link.click();
    };

    const reset = () => {
        setFile(null);
        setPreview('');
        setResizedUrl('');
        setOriginalSize(null);
        setNewWidth('');
        setNewHeight('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const presets = [
        { label: 'Instagram Post', width: 1080, height: 1080 },
        { label: 'Instagram Story', width: 1080, height: 1920 },
        { label: 'Facebook Cover', width: 820, height: 312 },
        { label: 'Twitter Header', width: 1500, height: 500 },
        { label: '4K', width: 3840, height: 2160 },
        { label: 'Full HD', width: 1920, height: 1080 },
    ];

    return (
        <div className={styles.appContainer}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                    <Maximize size={24} />
                </div>
                <div>
                    <h2>Image Resizer</h2>
                    <p>Resize images with aspect ratio control</p>
                </div>
            </div>

            {!file ? (
                <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                    <Maximize size={48} />
                    <p>Upload Image to Resize</p>
                    <span style={{ fontSize: '0.8rem' }}>Supports PNG, JPEG, WebP, GIF</span>
                </div>
            ) : (
                <div className={styles.flexColumn}>
                    {/* Preview */}
                    <div className={styles.imagePreviewContainer}>
                        <img src={preview} alt="Preview" className={styles.imagePreview} />
                        {originalSize && (
                            <p className={styles.imageMeta}>
                                Original: {originalSize.width} × {originalSize.height}
                            </p>
                        )}
                    </div>

                    {/* Size Inputs */}
                    <div className={styles.sizeInputGroup}>
                        <div className={styles.formGroup}>
                            <label>Width (px)</label>
                            <input
                                type="number"
                                value={newWidth}
                                onChange={(e) => handleWidthChange(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <span className={styles.separator}>×</span>
                        <div className={styles.formGroup}>
                            <label>Height (px)</label>
                            <input
                                type="number"
                                value={newHeight}
                                onChange={(e) => handleHeightChange(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Maintain Aspect Ratio */}
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={maintainAspect}
                            onChange={(e) => setMaintainAspect(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>Maintain aspect ratio</span>
                    </label>

                    {/* Presets */}
                    <div className={styles.formGroup}>
                        <label>Quick Presets</label>
                        <div className={styles.presetsContainer}>
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => {
                                        setNewWidth(preset.width.toString());
                                        setNewHeight(preset.height.toString());
                                        setMaintainAspect(false);
                                    }}
                                    className={styles.presetButton}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resize Button */}
                    <button
                        onClick={resizeImage}
                        disabled={loading || !newWidth || !newHeight}
                        className={styles.primaryButton}
                        style={{ width: '100%' }}
                    >
                        <Maximize size={18} />
                        {loading ? 'Resizing...' : 'Resize Image'}
                    </button>

                    {/* Result */}
                    {resizedUrl && (
                        <div className={`${styles.infoBox} ${styles.success}`}>
                            <Check size={18} />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                                    Resized to {newWidth} × {newHeight}
                                </p>
                                <button onClick={downloadImage} className={styles.primaryButton} style={{ width: '100%' }}>
                                    <Download size={16} /> Download Resized Image
                                </button>
                            </div>
                        </div>
                    )}

                    <button onClick={reset} className={styles.secondaryButton} style={{ width: '100%' }}>
                        <RefreshCw size={16} /> Upload New Image
                    </button>
                </div>
            )}
        </div>
    );
}
