'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Send, Code } from 'lucide-react';

export default function APITesterApp() {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState('');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const sendRequest = async () => {
        setLoading(true);
        setResponse(null);

        try {
            const options: RequestInit = {
                method,
                headers: headers ? JSON.parse(headers) : {},
            };

            if (method !== 'GET' && body) {
                options.body = body;
            }

            const res = await fetch(url, options);
            const data = await res.json().catch(() => res.text());

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                data
            });
        } catch (error: any) {
            setResponse({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>URL</label>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint" className={styles.input} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Method</label>
                    <select value={method} onChange={(e) => setMethod(e.target.value)} className={styles.select} style={{ marginBottom: 0 }}>
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>PATCH</option>
                        <option>DELETE</option>
                    </select>
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Headers (JSON)</label>
                    <input type="text" value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder='{"Content-Type": "application/json"}' className={styles.input} style={{ marginBottom: 0, fontFamily: 'monospace', fontSize: '0.875rem' }} />
                </div>
            </div>

            {method !== 'GET' && (
                <div className={styles.inputGroup}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Body</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder='{"key": "value"}' className={styles.input} rows={4} style={{ fontFamily: 'monospace', fontSize: '0.875rem', resize: 'vertical' }} />
                </div>
            )}

            <button onClick={sendRequest} disabled={loading || !url} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Send size={18} /> {loading ? 'Sending...' : 'Send Request'}
            </button>

            {response && (
                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    {response.error ? (
                        <div style={{ color: '#ef4444' }}>Error: {response.error}</div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ padding: '0.5rem 1rem', background: response.status < 400 ? '#10b98120' : '#ef444420', borderRadius: '8px', fontWeight: '700' }}>
                                    Status: {response.status}
                                </div>
                                <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                    {response.statusText}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Response:</div>
                            <pre style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', overflow: 'auto', fontSize: '0.75rem', lineHeight: '1.5' }}>
                                {JSON.stringify(response.data, null, 2)}
                            </pre>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
