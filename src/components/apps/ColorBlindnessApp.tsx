'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { Eye, Upload, Download, RefreshCw } from 'lucide-react';

type ColorBlindType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const COLOR_BLIND_FILTERS: Record<ColorBlindType, number[][]> = {
    normal: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
    deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
    tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
    achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]],
};

const TYPE_INFO: Record<ColorBlindType, { name: string; description: string; prevalence: string }> = {
    normal: { name: 'Normal Vision', description: 'Full color perception', prevalence: '~92%' },
    protanopia: { name: 'Protanopia', description: 'Red-blind, difficulty distinguishing red/green', prevalence: '~1% males' },
    deuteranopia: { name: 'Deuteranopia', description: 'Green-blind, most common type', prevalence: '~6% males' },
    tritanopia: { name: 'Tritanopia', description: 'Blue-blind, difficulty with blue/yellow', prevalence: '~0.01%' },
    achromatopsia: { name: 'Achromatopsia', description: 'Complete color blindness, sees only grayscale', prevalence: '~0.003%' },
};

export default function ColorBlindnessApp() {
    const [selectedType, setSelectedType] = useState<ColorBlindType>('normal');
    const [image, setImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const applyFilter = (imgSrc: string, type: ColorBlindType) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            if (type !== 'normal') {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const matrix = COLOR_BLIND_FILTERS[type];

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = Math.min(255, r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2]);
                    data[i + 1] = Math.min(255, r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2]);
                    data[i + 2] = Math.min(255, r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]);
                }
                ctx.putImageData(imageData, 0, 0);
            }
            setProcessedImage(canvas.toDataURL('image/png'));
        };
        img.src = imgSrc;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const src = event.target?.result as string;
            setImage(src);
            applyFilter(src, selectedType);
        };
        reader.readAsDataURL(file);
    };

    const handleTypeChange = (type: ColorBlindType) => {
        setSelectedType(type);
        if (image) applyFilter(image, type);
    };

    const downloadImage = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.download = `colorblind-${selectedType}.png`;
        link.href = processedImage;
        link.click();
    };

    const reset = () => {
        setImage(null);
        setProcessedImage(null);
        setSelectedType('normal');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                    <Eye size={24} />
                </div>
                <div>
                    <h2>Color Blindness Simulator</h2>
                    <p>Test accessibility for color blind users</p>
                </div>
            </div>

            <div className={styles.colorBlindTypes}>
                {(Object.keys(TYPE_INFO) as ColorBlindType[]).map(type => (
                    <button
                        key={type}
                        className={`${styles.typeButton} ${selectedType === type ? styles.active : ''}`}
                        onClick={() => handleTypeChange(type)}
                    >
                        <span className={styles.typeName}>{TYPE_INFO[type].name}</span>
                        <span className={styles.typePrevalence}>{TYPE_INFO[type].prevalence}</span>
                    </button>
                ))}
            </div>

            <div className={styles.typeDescription}>
                <p>{TYPE_INFO[selectedType].description}</p>
            </div>

            {!image ? (
                <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                    <Upload size={48} />
                    <p>Click or drop an image to simulate</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} hidden />
                </div>
            ) : (
                <div className={styles.imageComparison}>
                    <div className={styles.imagePanel}>
                        <h4>Original</h4>
                        <img src={image} alt="Original" className={styles.previewImage} />
                    </div>
                    <div className={styles.imagePanel}>
                        <h4>{TYPE_INFO[selectedType].name}</h4>
                        {processedImage && <img src={processedImage} alt="Simulated" className={styles.previewImage} />}
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {image && (
                <div className={styles.buttonGroup}>
                    <button onClick={downloadImage} className={styles.primaryButton}>
                        <Download size={18} /> Download
                    </button>
                    <button onClick={reset} className={styles.secondaryButton}>
                        <RefreshCw size={18} /> Reset
                    </button>
                </div>
            )}
        </div>
    );
}
