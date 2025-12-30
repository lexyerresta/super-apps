'use client';

import React, { useEffect, useCallback } from 'react';
import styles from './Modal.module.css';
import Icon from './Icon';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: string;
    gradient?: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

export default function Modal({
    isOpen,
    onClose,
    title,
    icon,
    gradient,
    children,
    size = 'large'
}: ModalProps) {
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={`${styles.modal} ${styles[size]}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.glowEffect} style={{ background: gradient || 'var(--gradient-primary)' }} />

                <div className={styles.modalContent}>
                    <header className={styles.header}>
                        <div className={styles.headerInfo}>
                            {icon && (
                                <div className={styles.iconWrapper} style={{ background: gradient || 'var(--gradient-primary)' }}>
                                    <Icon name={icon} size={22} color="white" />
                                </div>
                            )}
                            <h2 className={styles.title}>{title}</h2>
                        </div>
                        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                            <X size={20} />
                        </button>
                    </header>

                    <div className={styles.body}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
