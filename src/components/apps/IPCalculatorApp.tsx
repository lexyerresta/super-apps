'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Network, Info } from 'lucide-react';

export default function IPCalculatorApp() {
    const [ip, setIp] = useState('192.168.1.0');
    const [cidr, setCidr] = useState('24');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const cidrNum = parseInt(cidr);
        if (cidrNum < 0 || cidrNum > 32) return;

        const mask = -1 << (32 - cidrNum);
        const maskOctets = [
            (mask >>> 24) & 255,
            (mask >>> 16) & 255,
            (mask >>> 8) & 255,
            mask & 255
        ];

        const ipOctets = ip.split('.').map(Number);
        const ipNum = (ipOctets[0] << 24) + (ipOctets[1] << 16) + (ipOctets[2] << 8) + ipOctets[3];

        const networkNum = ipNum & mask;
        const broadcastNum = networkNum | (~mask & 0xFFFFFFFF);

        const network = [
            (networkNum >>> 24) & 255,
            (networkNum >>> 16) & 255,
            (networkNum >>> 8) & 255,
            networkNum & 255
        ].join('.');

        const broadcast = [
            (broadcastNum >>> 24) & 255,
            (broadcastNum >>> 16) & 255,
            (broadcastNum >>> 8) & 255,
            broadcastNum & 255
        ].join('.');

        const hosts = Math.pow(2, 32 - cidrNum) - 2;

        setResult({
            network,
            broadcast,
            mask: maskOctets.join('.'),
            hosts: hosts > 0 ? hosts : 0,
            cidr: cidrNum
        });
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>IP Address</label>
                    <input type="text" value={ip} onChange={(e) => setIp(e.target.value)}
                        placeholder="192.168.1.0" className={styles.input} style={{ marginBottom: 0, fontFamily: 'monospace' }} />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>CIDR</label>
                    <input type="number" value={cidr} onChange={(e) => setCidr(e.target.value)}
                        min="0" max="32" className={styles.input} style={{ marginBottom: 0 }} />
                </div>
            </div>

            <button onClick={calculate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Network size={18} /> Calculate Subnet
            </button>

            {result && (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[
                        { label: 'Network Address', value: result.network },
                        { label: 'Broadcast Address', value: result.broadcast },
                        { label: 'Subnet Mask', value: result.mask },
                        { label: 'Usable Hosts', value: result.hosts.toLocaleString() },
                        { label: 'CIDR Notation', value: `/${result.cidr}` }
                    ].map(({ label, value }) => (
                        <div key={label} style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
                            <span style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--primary)' }}>{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
