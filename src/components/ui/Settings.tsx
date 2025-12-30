'use client';

import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { n8n } from '@/lib/n8n';
import { useApp } from '@/context/AppContext';
import {
    X, Sun, Moon, Workflow, Save, ExternalLink,
    CheckCircle, Info, Trash2, Bell, Database
} from 'lucide-react';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
    const { state, toggleTheme } = useApp();
    const [webhookUrl, setWebhookUrl] = useState('');
    const [n8nEnabled, setN8nEnabled] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setWebhookUrl(n8n.getWebhookUrl() || '');
        setN8nEnabled(n8n.isEnabled());
    }, [isOpen]);

    const handleSaveN8n = () => {
        if (webhookUrl) {
            n8n.configure(webhookUrl);
            if (!n8nEnabled) n8n.disable();
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleToggleN8n = () => {
        if (n8nEnabled) {
            n8n.disable();
        } else {
            n8n.enable();
        }
        setN8nEnabled(!n8nEnabled);
    };

    const handleClearData = () => {
        if (confirm('Clear all local data? This will remove favorites, notes, and settings.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>Settings</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Appearance</h3>
                        <div className={styles.option}>
                            <div className={styles.optionInfo}>
                                {state.theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                                <div>
                                    <span className={styles.optionLabel}>Theme</span>
                                    <span className={styles.optionDesc}>
                                        Currently using {state.theme} mode
                                    </span>
                                </div>
                            </div>
                            <button className={styles.toggleBtn} onClick={toggleTheme}>
                                {state.theme === 'light' ? 'Dark' : 'Light'}
                            </button>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Workflow size={18} />
                            n8n Integration
                        </h3>
                        <p className={styles.sectionDesc}>
                            Connect to n8n to automate workflows. Events like app opens,
                            completed pomodoros, and new notes will be sent to your webhook.
                        </p>

                        <div className={styles.option}>
                            <div className={styles.optionInfo}>
                                <Bell size={20} />
                                <div>
                                    <span className={styles.optionLabel}>Enable Events</span>
                                    <span className={styles.optionDesc}>Send events to n8n</span>
                                </div>
                            </div>
                            <button
                                className={`${styles.toggleBtn} ${n8nEnabled ? styles.active : ''}`}
                                onClick={handleToggleN8n}
                            >
                                {n8nEnabled ? 'On' : 'Off'}
                            </button>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Webhook URL</label>
                            <input
                                type="url"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder="https://your-n8n.com/webhook/..."
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.saveBtn} onClick={handleSaveN8n}>
                                {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                                {saved ? 'Saved!' : 'Save'}
                            </button>
                            <a
                                href="https://n8n.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.linkBtn}
                            >
                                Learn more <ExternalLink size={14} />
                            </a>
                        </div>

                        <div className={styles.infoBox}>
                            <Info size={16} />
                            <div>
                                <strong>Events sent to n8n:</strong>
                                <ul>
                                    <li>App opened</li>
                                    <li>Pomodoro session completed</li>
                                    <li>Note created</li>
                                    <li>Favorite added/removed</li>
                                    <li>Feedback submitted</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Database size={18} />
                            Data
                        </h3>
                        <div className={styles.option}>
                            <div className={styles.optionInfo}>
                                <Trash2 size={20} color="var(--accent-red)" />
                                <div>
                                    <span className={styles.optionLabel}>Clear All Data</span>
                                    <span className={styles.optionDesc}>
                                        Remove favorites, notes, and settings
                                    </span>
                                </div>
                            </div>
                            <button className={styles.dangerBtn} onClick={handleClearData}>
                                Clear
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
