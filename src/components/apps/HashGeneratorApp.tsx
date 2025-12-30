'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Hash, Copy, Check, X, FileText, Binary, ArrowRightLeft, Sparkles } from 'lucide-react';

type Mode = 'hash' | 'base64';

export default function HashGeneratorApp() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<Mode>('hash');
    const [hashes, setHashes] = useState<Record<string, string>>({});
    const [base64Result, setBase64Result] = useState<{ encoded: string; decoded: string } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);

    const generateHashes = async () => {
        if (!input) return;
        setLoading(true);
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
        const results: Record<string, string> = {};

        for (const algo of algorithms) {
            try {
                const hashBuffer = await crypto.subtle.digest(algo, data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                results[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch { results[algo] = 'Not supported'; }
        }
        results['MD5'] = md5(input);
        setHashes(results);
        setLoading(false);
    };

    const handleBase64 = () => {
        if (!input) return;
        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            let decoded = '';
            try { decoded = decodeURIComponent(escape(atob(input))); } catch { decoded = 'Invalid Base64'; }
            setBase64Result({ encoded, decoded });
        } catch { setBase64Result({ encoded: 'Error encoding', decoded: 'Error decoding' }); }
    };

    const md5 = (str: string): string => {
        const rotL = (x: number, n: number) => (x << n) | (x >>> (32 - n));
        const addU = (x: number, y: number) => {
            const x4 = x & 0x80000000, y4 = y & 0x80000000;
            const x8 = x & 0x40000000, y8 = y & 0x40000000;
            const res = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
            if (x8 & y8) return res ^ 0x80000000 ^ x4 ^ y4;
            if (x8 | y8) return res & 0x40000000 ? res ^ 0xC0000000 ^ x4 ^ y4 : res ^ 0x40000000 ^ x4 ^ y4;
            return res ^ x4 ^ y4;
        };
        const w2h = (v: number) => { let h = ''; for (let i = 0; i <= 3; i++) h += ('0' + ((v >>> (i * 8)) & 255).toString(16)).slice(-2); return h; };
        const S = [[7, 12, 17, 22], [5, 9, 14, 20], [4, 11, 16, 23], [6, 10, 15, 21]];
        const K = [0xD76AA478, 0xE8C7B756, 0x242070DB, 0xC1BDCEEE, 0xF57C0FAF, 0x4787C62A, 0xA8304613, 0xFD469501, 0x698098D8, 0x8B44F7AF, 0xFFFF5BB1, 0x895CD7BE, 0x6B901122, 0xFD987193, 0xA679438E, 0x49B40821, 0xF61E2562, 0xC040B340, 0x265E5A51, 0xE9B6C7AA, 0xD62F105D, 0x02441453, 0xD8A1E681, 0xE7D3FBC8, 0x21E1CDE6, 0xC33707D6, 0xF4D50D87, 0x455A14ED, 0xA9E3E905, 0xFCEFA3F8, 0x676F02D9, 0x8D2A4C8A, 0xFFFA3942, 0x8771F681, 0x6D9D6122, 0xFDE5380C, 0xA4BEEA44, 0x4BDECFA9, 0xF6BB4B60, 0xBEBFBC70, 0x289B7EC6, 0xEAA127FA, 0xD4EF3085, 0x04881D05, 0xD9D4D039, 0xE6DB99E5, 0x1FA27CF8, 0xC4AC5665, 0xF4292244, 0x432AFF97, 0xAB9423A7, 0xFC93A039, 0x655B59C3, 0x8F0CCC92, 0xFFEFF47D, 0x85845DD1, 0x6FA87E4F, 0xFE2CE6E0, 0xA3014314, 0x4E0811A1, 0xF7537E82, 0xBD3AF235, 0x2AD7D2BB, 0xEB86D391];
        const s = unescape(encodeURIComponent(str)), l = s.length;
        const w: number[] = []; for (let i = 0; i < l; i++) w[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
        w[l >> 2] |= 0x80 << ((l % 4) * 8); const n = ((l + 8) >> 6) + 1;
        const x: number[] = []; for (let i = 0; i < n * 16; i++) x[i] = w[i] || 0; x[n * 16 - 2] = l * 8;
        let [a, b, c, d] = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
        for (let k = 0; k < x.length; k += 16) {
            const [A, B, C, D] = [a, b, c, d];
            for (let i = 0; i < 64; i++) {
                let f: number, g: number;
                if (i < 16) { f = (b & c) | (~b & d); g = i; }
                else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
                else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
                else { f = c ^ (b | ~d); g = (7 * i) % 16; }
                const temp = d; d = c; c = b;
                b = addU(b, rotL(addU(addU(a, f), addU(x[k + g], K[i])), S[Math.floor(i / 16)][i % 4])); a = temp;
            }
            a = addU(a, A); b = addU(b, B); c = addU(c, C); d = addU(d, D);
        }
        return w2h(a) + w2h(b) + w2h(c) + w2h(d);
    };

    const copyHash = async (key: string, val: string) => {
        await navigator.clipboard.writeText(val);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const copyAll = async () => {
        const text = Object.entries(hashes).map(([k, v]) => `${k}: ${v}`).join('\n');
        await navigator.clipboard.writeText(text);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const hashColors: Record<string, string> = { 'MD5': '#ef4444', 'SHA-1': '#f59e0b', 'SHA-256': '#22c55e', 'SHA-384': '#3b82f6', 'SHA-512': '#8b5cf6' };

    return (
        <div className={styles.appContainer}>
            {/* Mode Tabs */}
            <div className={styles.tabs}>
                <button onClick={() => setMode('hash')} className={`${styles.tabBtn} ${mode === 'hash' ? styles.active : ''}`}>
                    <Hash size={14} /> Hash Generator
                </button>
                <button onClick={() => setMode('base64')} className={`${styles.tabBtn} ${mode === 'base64' ? styles.active : ''}`}>
                    <Binary size={14} /> Base64
                </button>
            </div>

            {/* Input */}
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'hash' ? 'Enter text to hash...' : 'Enter text to encode/decode...'}
                className={styles.searchInput}
                style={{ minHeight: '90px', resize: 'vertical', marginTop: '1rem' }}
            />

            {/* Actions */}
            <div className={styles.actions} style={{ marginTop: '1rem' }}>
                <button onClick={mode === 'hash' ? generateHashes : handleBase64} className={`${styles.actionBtn} ${styles.primaryBtn}`} disabled={loading || !input}>
                    {loading ? <div className={styles.spinner} style={{ width: 16, height: 16 }} /> : mode === 'hash' ? <Hash size={16} /> : <ArrowRightLeft size={16} />}
                    {mode === 'hash' ? 'Generate Hashes' : 'Convert'}
                </button>
                <button onClick={() => { setInput(''); setHashes({}); setBase64Result(null); }} className={styles.actionBtn}>
                    <X size={16} /> Clear
                </button>
            </div>

            {/* Hash Results */}
            {mode === 'hash' && Object.keys(hashes).length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Sparkles size={14} color="var(--primary)" /> Generated Hashes
                        </span>
                        <button onClick={copyAll} style={{ background: copiedAll ? 'rgba(34,197,94,0.1)' : 'var(--bg-secondary)', border: '1px solid', borderColor: copiedAll ? '#22c55e' : 'var(--glass-border)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', color: copiedAll ? '#22c55e' : 'var(--text-secondary)' }}>
                            {copiedAll ? <Check size={12} /> : <Copy size={12} />} {copiedAll ? 'Copied!' : 'Copy All'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {Object.entries(hashes).map(([algo, hash]) => (
                            <div key={algo} className={styles.listItem} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: hashColors[algo] || 'var(--primary)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ padding: '0.25rem 0.6rem', background: `${hashColors[algo] || 'var(--primary)'}15`, borderRadius: '6px', color: hashColors[algo] || 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                                        {algo}
                                    </span>
                                    <button onClick={() => copyHash(algo, hash)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copied === algo ? '#22c55e' : 'var(--text-tertiary)', display: 'flex', padding: '0.3rem' }}>
                                        {copied === algo ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.72rem', color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '6px' }}>
                                    {hash}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Base64 Results */}
            {mode === 'base64' && base64Result && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-tertiary)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#22c55e' }}>
                                <FileText size={14} /> Encoded (Base64)
                            </span>
                            <button onClick={() => copyHash('encoded', base64Result.encoded)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copied === 'encoded' ? '#22c55e' : 'var(--text-tertiary)' }}>
                                {copied === 'encoded' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <code style={{ display: 'block', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '10px' }}>
                            {base64Result.encoded}
                        </code>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#3b82f6' }}>
                                <Binary size={14} /> Decoded (from Base64)
                            </span>
                            <button onClick={() => copyHash('decoded', base64Result.decoded)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copied === 'decoded' ? '#22c55e' : 'var(--text-tertiary)' }}>
                                {copied === 'decoded' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <code style={{ display: 'block', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '10px' }}>
                            {base64Result.decoded}
                        </code>
                    </div>
                </div>
            )}
        </div>
    );
}
