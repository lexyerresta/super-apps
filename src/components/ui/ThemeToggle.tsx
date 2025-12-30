'use client';

import React from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
    return (
        <button
            className={styles.toggle}
            onClick={onToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className={styles.track}>
                <span className={`${styles.icon} ${styles.sun}`}>☀️</span>
                <span className={`${styles.icon} ${styles.moon}`}>🌙</span>
                <div className={`${styles.thumb} ${theme === 'dark' ? styles.dark : ''}`} />
            </div>
        </button>
    );
}
