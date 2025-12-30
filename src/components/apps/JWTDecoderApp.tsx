'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Key, Copy } from 'lucide-react';

export default function JWTDecoderApp() {
    const [jwt, setJwt] = useState('');
    const [decoded, setDecoded] = useState<any>(null);

    const decodeJWT = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                setDecoded({ error: 'Invalid JWT format' });
                return;
            }

            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

            const exp = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : null;
            const iat = payload.iat ? new Date(payload.iat * 1000).toLocaleString() : null;
            const nbf = payload.nbf ? new Date(payload.nbf * 1000).toLocaleString() : null;

            setDecoded({
                header,
                payload,
                signature: parts[2],
                timestamps: { exp, iat, nbf },
                expired: payload.exp && Date.now() > payload.exp * 1000
            });
        } catch (error) {
            setDecoded({ error: 'Failed to decode JWT' });
        }
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                    <Key size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    JWT Token
                </label>
                <textarea value={jwt} onChange={(e) => { setJwt(e.target.value); decodeJWT(e.target.value); }} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className={styles.input} rows={4} style={{ fontFamily: 'monospace', fontSize: '0.75rem', resize: 'vertical' }} />
            </div>

            {decoded && (
                decoded.error ? (
                    <div style={{ padding: '1.5rem', background: '#ef444420', borderRadius: '12px', color: '#ef4444', textAlign: 'center' }}>
                        {decoded.error}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {decoded.expired && (
                            <div style={{ padding: '1rem', background: '#f59e0b20', borderRadius: '12px', color: '#f59e0b', fontWeight: '600', textAlign: 'center' }}>
                                ⚠️ Token Expired
                            </div>
                        )}

                        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>Header:</div>
                            <pre style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', overflow: 'auto', fontSize: '0.75rem' }}>
                                {JSON.stringify(decoded.header, null, 2)}
                            </pre>
                        </div>

                        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>Payload:</div>
                            <pre style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', overflow: 'auto', fontSize: '0.75rem' }}>
                                {JSON.stringify(decoded.payload, null, 2)}
                            </pre>
                        </div>

                        {decoded.timestamps.exp && (
                            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
                                {decoded.timestamps.iat && <div>Issued: {decoded.timestamps.iat}</div>}
                                {decoded.timestamps.exp && <div>Expires: {decoded.timestamps.exp}</div>}
                                {decoded.timestamps.nbf && <div>Not Before: {decoded.timestamps.nbf}</div>}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
}
