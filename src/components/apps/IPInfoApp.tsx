'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { httpClient } from '@/lib/http-client';
import { Wifi, MapPin, Globe, Building, Clock, Copy, Check, AlertCircle } from 'lucide-react';

interface IPInfo {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    country_code: string;
    continent_name: string;
    latitude: number;
    longitude: number;
    timezone: string;
    org: string;
    asn: string;
}

export default function IPInfoApp() {
    const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchIPInfo = async () => {
            try {
                const data = await httpClient<IPInfo>('https://ipapi.co/json/');
                setIpInfo(data);
            } catch (err) {
                setError('Failed to get IP info');
            } finally {
                setLoading(false);
            }
        };
        fetchIPInfo();
    }, []);

    const copyIP = async () => {
        if (ipInfo) {
            await navigator.clipboard.writeText(ipInfo.ip);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Getting your IP info...</p>
            </div>
        );
    }

    if (error || !ipInfo) {
        return (
            <div className={styles.error}>
                <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                <p>{error || 'Failed to load'}</p>
            </div>
        );
    }

    return (
        <div className={styles.appContainer}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.08))',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '24px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '1rem',
            }}>
                <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)',
                }}>
                    <Wifi size={36} color="white" />
                </div>

                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Your IP Address</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <span style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        fontFamily: 'monospace',
                    }}>
                        {ipInfo.ip}
                    </span>
                    <button
                        onClick={copyIP}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            color: copied ? 'var(--accent-green)' : 'var(--text-tertiary)',
                            display: 'flex',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className={styles.listItem}>
                    <MapPin size={20} color="var(--accent-red)" />
                    <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', display: 'block' }}>Location</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            {ipInfo.city}, {ipInfo.region}, {ipInfo.country_name}
                        </span>
                    </div>
                </div>

                <div className={styles.listItem}>
                    <Globe size={20} color="var(--accent-cyan)" />
                    <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', display: 'block' }}>Coordinates</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            {ipInfo.latitude.toFixed(4)}, {ipInfo.longitude.toFixed(4)}
                        </span>
                    </div>
                </div>

                <div className={styles.listItem}>
                    <Clock size={20} color="var(--accent-purple)" />
                    <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', display: 'block' }}>Timezone</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            {ipInfo.timezone}
                        </span>
                    </div>
                </div>

                <div className={styles.listItem}>
                    <Building size={20} color="var(--accent-orange)" />
                    <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', display: 'block' }}>ISP / Organization</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            {ipInfo.org}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
