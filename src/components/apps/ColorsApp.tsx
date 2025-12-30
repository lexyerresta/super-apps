'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { RefreshCw, Copy, Check, Lock, Unlock, Palette, Shuffle, Download, Sparkles, Eye, Droplets } from 'lucide-react';

interface Color {
    hex: string;
    locked: boolean;
}

type HarmonyMode = 'random' | 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic';

const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

const generateHarmonyColors = (mode: HarmonyMode, count: number = 5): string[] => {
    const baseHue = Math.random() * 360;
    const baseSat = 60 + Math.random() * 30;
    const baseLit = 45 + Math.random() * 20;

    switch (mode) {
        case 'complementary':
            return Array(count).fill(null).map((_, i) => {
                const hue = i % 2 === 0 ? baseHue : (baseHue + 180) % 360;
                const lightness = baseLit + (i - Math.floor(count / 2)) * 8;
                return hslToHex(hue, baseSat, Math.max(25, Math.min(75, lightness)));
            });

        case 'analogous':
            return Array(count).fill(null).map((_, i) => {
                const hue = (baseHue + (i - Math.floor(count / 2)) * 25) % 360;
                return hslToHex(hue < 0 ? hue + 360 : hue, baseSat, baseLit + (i % 2) * 10 - 5);
            });

        case 'triadic':
            return Array(count).fill(null).map((_, i) => {
                const hue = (baseHue + (Math.floor(i / 2) * 120)) % 360;
                const lightness = baseLit + (i % 2) * 15 - 7;
                return hslToHex(hue, baseSat, Math.max(25, Math.min(75, lightness)));
            });

        case 'split-complementary':
            return Array(count).fill(null).map((_, i) => {
                const hues = [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
                const hue = hues[i % 3];
                const lightness = baseLit + (i - Math.floor(count / 2)) * 10;
                return hslToHex(hue, baseSat, Math.max(25, Math.min(75, lightness)));
            });

        case 'tetradic':
            return Array(count).fill(null).map((_, i) => {
                const hue = (baseHue + (i * 90)) % 360;
                const lightness = baseLit + (i % 2) * 12 - 6;
                return hslToHex(hue, baseSat, Math.max(25, Math.min(75, lightness)));
            });

        case 'monochromatic':
            return Array(count).fill(null).map((_, i) => {
                const lightness = 25 + (i * 12);
                const saturation = baseSat - i * 5;
                return hslToHex(baseHue, Math.max(20, saturation), Math.min(80, lightness));
            });

        default:
            return Array(count).fill(null).map(() => generateRandomColor());
    }
};

const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
};

const getColorName = (hex: string): string => {
    const hsl = hexToHSL(hex);
    const hue = hsl.h;
    const sat = hsl.s;
    const lit = hsl.l;

    if (sat < 10) {
        if (lit < 20) return 'Charcoal';
        if (lit < 40) return 'Gray';
        if (lit < 60) return 'Silver';
        if (lit < 80) return 'Light Gray';
        return 'White';
    }

    let colorName = '';
    if (hue < 15 || hue >= 345) colorName = 'Red';
    else if (hue < 45) colorName = 'Orange';
    else if (hue < 75) colorName = 'Yellow';
    else if (hue < 150) colorName = 'Green';
    else if (hue < 210) colorName = 'Cyan';
    else if (hue < 270) colorName = 'Blue';
    else if (hue < 315) colorName = 'Purple';
    else colorName = 'Pink';

    if (lit < 30) return 'Dark ' + colorName;
    if (lit > 70) return 'Light ' + colorName;
    if (sat < 50) return 'Muted ' + colorName;
    return colorName;
};

export default function ColorsApp() {
    const [colors, setColors] = useState<Color[]>(
        Array(5).fill(null).map(() => ({ hex: generateRandomColor(), locked: false }))
    );
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('random');
    const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'scss' | 'json'>('css');
    const [showGradient, setShowGradient] = useState(false);
    const [gradientAngle, setGradientAngle] = useState(135);
    const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);

    const generatePalette = useCallback(() => {
        if (harmonyMode === 'random') {
            setColors(colors.map(color =>
                color.locked ? color : { ...color, hex: generateRandomColor() }
            ));
        } else {
            const newColors = generateHarmonyColors(harmonyMode, 5);
            setColors(colors.map((color, i) =>
                color.locked ? color : { ...color, hex: newColors[i] }
            ));
        }
    }, [colors, harmonyMode]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                generatePalette();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [generatePalette]);

    const toggleLock = (index: number) => {
        setColors(colors.map((color, i) =>
            i === index ? { ...color, locked: !color.locked } : color
        ));
    };

    const copyColor = async (hex: string, index: number) => {
        await navigator.clipboard.writeText(hex.toUpperCase());
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    const handleColorChange = (index: number, newHex: string) => {
        setColors(colors.map((color, i) =>
            i === index ? { ...color, hex: newHex } : color
        ));
    };

    const getExportCode = (): string => {
        switch (exportFormat) {
            case 'css':
                return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
            case 'tailwind':
                return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        'palette-${i + 1}': '${c.hex}',`).join('\n')}\n      }\n    }\n  }\n}`;
            case 'scss':
                return colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n');
            case 'json':
                return JSON.stringify(colors.map((c, i) => ({ name: `color-${i + 1}`, hex: c.hex })), null, 2);
            default:
                return '';
        }
    };

    const copyExport = async () => {
        await navigator.clipboard.writeText(getExportCode());
        setCopiedIndex(-1);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    const getGradientCSS = (): string => {
        return `linear-gradient(${gradientAngle}deg, ${colors.map(c => c.hex).join(', ')})`;
    };

    const harmonyModes: { value: HarmonyMode; label: string; icon: React.ReactNode }[] = [
        { value: 'random', label: 'Random', icon: <Shuffle size={12} /> },
        { value: 'complementary', label: 'Complement', icon: <Palette size={12} /> },
        { value: 'analogous', label: 'Analogous', icon: <Droplets size={12} /> },
        { value: 'triadic', label: 'Triadic', icon: <Sparkles size={12} /> },
        { value: 'split-complementary', label: 'Split', icon: <Eye size={12} /> },
        { value: 'monochromatic', label: 'Mono', icon: <Palette size={12} /> },
    ];

    return (
        <div className={styles.appContainer}>
            {/* Harmony Mode Selector */}
            <div style={{
                display: 'flex',
                gap: '0.375rem',
                flexWrap: 'wrap',
                padding: '0.5rem',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
            }}>
                {harmonyModes.map((mode) => (
                    <button
                        key={mode.value}
                        onClick={() => setHarmonyMode(mode.value)}
                        style={{
                            padding: '0.375rem 0.625rem',
                            background: harmonyMode === mode.value ? 'var(--gradient-primary)' : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: harmonyMode === mode.value ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {mode.icon} {mode.label}
                    </button>
                ))}
            </div>

            {/* Color Palette */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem',
            }}>
                {colors.map((color, index) => {
                    const hsl = hexToHSL(color.hex);
                    return (
                        <div
                            key={index}
                            style={{
                                background: color.hex,
                                borderRadius: '16px',
                                padding: '1rem 0.5rem',
                                minHeight: '160px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'relative',
                                boxShadow: selectedColorIndex === index
                                    ? `0 0 0 3px ${color.hex}, 0 8px 24px rgba(0,0,0,0.3)`
                                    : 'var(--shadow-md)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                transform: selectedColorIndex === index ? 'scale(1.02)' : 'scale(1)',
                            }}
                            onClick={() => setSelectedColorIndex(selectedColorIndex === index ? null : index)}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleLock(index); }}
                                style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: color.locked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.375rem',
                                    cursor: 'pointer',
                                    color: getContrastColor(color.hex),
                                    backdropFilter: 'blur(4px)',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {color.locked ? <Lock size={12} /> : <Unlock size={12} />}
                            </button>

                            {/* Color Name */}
                            <div style={{
                                color: getContrastColor(color.hex),
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                textAlign: 'center',
                                opacity: 0.8,
                                marginTop: '1.5rem',
                            }}>
                                {getColorName(color.hex)}
                            </div>

                            {/* HSL Values */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.25rem',
                                    fontSize: '0.55rem',
                                    color: getContrastColor(color.hex),
                                    opacity: 0.7,
                                }}>
                                    <span>H:{Math.round(hsl.h)}°</span>
                                    <span>S:{Math.round(hsl.s)}%</span>
                                    <span>L:{Math.round(hsl.l)}%</span>
                                </div>

                                {/* HEX Value with Copy */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); copyColor(color.hex, index); }}
                                    style={{
                                        color: getContrastColor(color.hex),
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        fontFamily: 'monospace',
                                        background: 'rgba(0,0,0,0.15)',
                                        padding: '0.375rem 0.5rem',
                                        borderRadius: '6px',
                                        backdropFilter: 'blur(4px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {copiedIndex === index ? <Check size={10} /> : <Copy size={10} />}
                                    {color.hex.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Color Picker for Selected Color */}
            {selectedColorIndex !== null && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <input
                        type="color"
                        value={colors[selectedColorIndex].hex}
                        onChange={(e) => handleColorChange(selectedColorIndex, e.target.value)}
                        style={{
                            width: '48px',
                            height: '48px',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                            Editing Color {selectedColorIndex + 1}
                        </p>
                        <input
                            type="text"
                            value={colors[selectedColorIndex].hex.toUpperCase()}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                    handleColorChange(selectedColorIndex, val);
                                }
                            }}
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '0.5rem 0.75rem',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                fontFamily: 'monospace',
                                width: '100px',
                                marginTop: '0.25rem',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Generate & Gradient Toggle */}
            <div className={styles.actions}>
                <button onClick={generatePalette} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    <RefreshCw size={16} /> Generate
                </button>
                <button
                    onClick={() => setShowGradient(!showGradient)}
                    className={styles.actionBtn}
                    style={{
                        background: showGradient ? 'var(--gradient-primary)' : undefined,
                        color: showGradient ? 'white' : undefined,
                        borderColor: showGradient ? 'transparent' : undefined,
                    }}
                >
                    <Sparkles size={16} /> Gradient
                </button>
            </div>

            {/* Gradient Preview */}
            {showGradient && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                }}>
                    <div style={{
                        height: '80px',
                        borderRadius: '12px',
                        background: getGradientCSS(),
                        marginBottom: '0.75rem',
                    }} />

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '0.75rem',
                    }}>
                        <label style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Angle</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                            style={{ flex: 1 }}
                        />
                        <span style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            minWidth: '40px',
                        }}>{gradientAngle}°</span>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        wordBreak: 'break-all',
                    }}>
                        background: {getGradientCSS()};
                    </div>
                </div>
            )}

            {/* Export Section */}
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', margin: 0 }}>
                        Export as
                    </p>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {(['css', 'tailwind', 'scss', 'json'] as const).map((format) => (
                            <button
                                key={format}
                                onClick={() => setExportFormat(format)}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: exportFormat === format ? 'var(--primary)' : 'var(--bg-secondary)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '6px',
                                    color: exportFormat === format ? 'white' : 'var(--text-tertiary)',
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {format}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                    position: 'relative',
                }}>
                    <pre style={{
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        maxHeight: '120px',
                        overflow: 'auto',
                    }}>
                        {getExportCode()}
                    </pre>
                    <button
                        onClick={copyExport}
                        style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '6px',
                            padding: '0.375rem',
                            cursor: 'pointer',
                            color: copiedIndex === -1 ? 'var(--accent-green)' : 'var(--text-tertiary)',
                        }}
                    >
                        {copiedIndex === -1 ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                </div>
            </div>

            <div className={styles.footer}>
                Press <kbd style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                }}>Space</kbd> to generate • Click color to edit
            </div>
        </div>
    );
}
