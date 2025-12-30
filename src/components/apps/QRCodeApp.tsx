'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { QrCode, Copy, Check, Download, RefreshCw, Palette, Smartphone, Link2, Mail, Wifi, Phone, FileText, Sparkles } from 'lucide-react';

type Template = 'website' | 'email' | 'phone' | 'wifi' | 'vcard' | 'custom';

const templates: { id: Template; label: string; icon: React.ReactNode; placeholder: string; prefix?: string }[] = [
    { id: 'custom', label: 'Custom', icon: <FileText size={14} />, placeholder: 'Enter any text or URL...' },
    { id: 'website', label: 'Website', icon: <Link2 size={14} />, placeholder: 'https://example.com', prefix: '' },
    { id: 'email', label: 'Email', icon: <Mail size={14} />, placeholder: 'hello@example.com', prefix: 'mailto:' },
    { id: 'phone', label: 'Phone', icon: <Phone size={14} />, placeholder: '+1234567890', prefix: 'tel:' },
    { id: 'wifi', label: 'WiFi', icon: <Wifi size={14} />, placeholder: 'Network Name' },
    { id: 'vcard', label: 'Contact', icon: <Smartphone size={14} />, placeholder: 'John Doe' },
];

const colorPresets = [
    { fg: '#000000', bg: '#FFFFFF', name: 'Classic' },
    { fg: '#1e293b', bg: '#f8fafc', name: 'Slate' },
    { fg: '#6366f1', bg: '#eef2ff', name: 'Indigo' },
    { fg: '#ec4899', bg: '#fdf2f8', name: 'Pink' },
    { fg: '#22c55e', bg: '#f0fdf4', name: 'Green' },
    { fg: '#f59e0b', bg: '#fffbeb', name: 'Amber' },
    { fg: '#FFFFFF', bg: '#0f172a', name: 'Dark' },
    { fg: '#a855f7', bg: '#faf5ff', name: 'Purple' },
];

const sizes = [150, 200, 250, 300, 400];

export default function QRCodeApp() {
    const [template, setTemplate] = useState<Template>('custom');
    const [text, setText] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [vcardEmail, setVcardEmail] = useState('');
    const [vcardPhone, setVcardPhone] = useState('');
    const [copied, setCopied] = useState(false);
    const [size, setSize] = useState(250);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [showColors, setShowColors] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const generateQRData = () => {
        if (!text) return '';
        const t = templates.find(t => t.id === template);

        if (template === 'wifi') {
            return `WIFI:T:WPA;S:${text};P:${wifiPassword};;`;
        }
        if (template === 'vcard') {
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${text}\nEMAIL:${vcardEmail}\nTEL:${vcardPhone}\nEND:VCARD`;
        }
        return (t?.prefix || '') + text;
    };

    const qrData = generateQRData();
    const qrUrl = qrData ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}` : '';

    const copyUrl = async () => {
        await navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadQR = () => {
        if (!qrUrl) return;
        const a = document.createElement('a');
        a.href = qrUrl;
        a.download = `qrcode-${Date.now()}.png`;
        a.click();
    };

    const applyPreset = (preset: typeof colorPresets[0]) => {
        setFgColor(preset.fg);
        setBgColor(preset.bg);
    };

    const currentTemplate = templates.find(t => t.id === template);

    return (
        <div className={styles.appContainer}>
            {/* Template Selector */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '14px' }}>
                {templates.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => { setTemplate(t.id); setText(''); }}
                        style={{
                            padding: '0.5rem 0.85rem',
                            background: template === t.id ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                            border: '1px solid',
                            borderColor: template === t.id ? 'transparent' : 'var(--glass-border)',
                            borderRadius: '10px',
                            color: template === t.id ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Input Fields */}
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={currentTemplate?.placeholder}
                    className={styles.searchInput}
                    style={{ marginBottom: template === 'wifi' || template === 'vcard' ? '0.5rem' : 0 }}
                />

                {template === 'wifi' && (
                    <input
                        type="password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="WiFi Password"
                        className={styles.searchInput}
                    />
                )}

                {template === 'vcard' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                            type="email"
                            value={vcardEmail}
                            onChange={(e) => setVcardEmail(e.target.value)}
                            placeholder="Email"
                            className={styles.searchInput}
                        />
                        <input
                            type="tel"
                            value={vcardPhone}
                            onChange={(e) => setVcardPhone(e.target.value)}
                            placeholder="Phone"
                            className={styles.searchInput}
                        />
                    </div>
                )}
            </div>

            {/* Color Customization Toggle */}
            <button
                onClick={() => setShowColors(!showColors)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1rem',
                    background: showColors ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                    border: '1px solid',
                    borderColor: showColors ? 'transparent' : 'var(--glass-border)',
                    borderRadius: '10px',
                    color: showColors ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    width: '100%',
                    justifyContent: 'center',
                }}
            >
                <Palette size={16} /> Customize Colors
            </button>

            {/* Color Options */}
            {showColors && (
                <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={12} color="var(--primary)" /> Color Presets
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {colorPresets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                title={preset.name}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    border: fgColor === preset.fg && bgColor === preset.bg ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
                                    cursor: 'pointer',
                                    background: preset.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                }}
                            >
                                <div style={{ width: '16px', height: '16px', background: preset.fg, borderRadius: '4px' }} />
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem', display: 'block' }}>Foreground</span>
                            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: '100%', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                        </label>
                        <label style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem', display: 'block' }}>Background</span>
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '100%', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                        </label>
                    </div>
                </div>
            )}

            {/* QR Display */}
            <div ref={qrRef} style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '24px',
                padding: '2rem',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {text ? (
                    <>
                        <div style={{
                            background: bgColor,
                            padding: '1.25rem',
                            borderRadius: '20px',
                            marginBottom: '1.5rem',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            border: '1px solid var(--glass-border)',
                        }}>
                            <img src={qrUrl} alt="QR Code" style={{ display: 'block', borderRadius: '8px' }} />
                        </div>

                        {/* Size Selector */}
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
                            {sizes.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        background: size === s ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                        border: '1px solid',
                                        borderColor: size === s ? 'transparent' : 'var(--glass-border)',
                                        borderRadius: '8px',
                                        color: size === s ? 'white' : 'var(--text-secondary)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {s}px
                                </button>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <button onClick={downloadQR} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                                <Download size={16} /> Download PNG
                            </button>
                            <button onClick={copyUrl} className={styles.actionBtn}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy URL'}
                            </button>
                            <button onClick={() => { setText(''); setWifiPassword(''); setVcardEmail(''); setVcardPhone(''); }} className={styles.actionBtn}>
                                <RefreshCw size={16} /> Clear
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState} style={{ padding: '2rem 0' }}>
                        <div className={styles.emptyIcon} style={{ marginBottom: '1rem' }}>
                            <QrCode size={40} color="var(--primary)" />
                        </div>
                        <p style={{ fontWeight: 600 }}>Create Your QR Code</p>
                        <p className={styles.emptyHint}>Select a template and enter your content</p>
                    </div>
                )}
            </div>
        </div>
    );
}
