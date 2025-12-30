'use client';

import React from 'react';
import styles from './AppCard.module.css';
import Icon from './Icon';
import { Heart, ChevronRight } from 'lucide-react';
import type { MiniApp } from '@/types';

interface AppCardProps {
    app: MiniApp;
    onClick: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

export default function AppCard({ app, onClick, isFavorite, onToggleFavorite }: AppCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite?.();
    };

    return (
        <article
            className={styles.card}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <div className={styles.glowEffect} style={{ background: app.gradient }} />

            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <div className={styles.iconWrapper} style={{ background: app.gradient }}>
                        <Icon name={app.icon} size={28} color="white" />
                    </div>

                    <div className={styles.cardActions}>
                        {app.badge && (
                            <span className={`${styles.badge} ${styles[app.badge.type]}`}>
                                {app.badge.text}
                            </span>
                        )}
                        <button
                            className={`${styles.favoriteBtn} ${isFavorite ? styles.favorited : ''}`}
                            onClick={handleFavoriteClick}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Heart
                                size={16}
                                fill={isFavorite ? '#ec4899' : 'transparent'}
                                color={isFavorite ? '#ec4899' : 'currentColor'}
                            />
                        </button>
                    </div>
                </div>

                <div className={styles.cardBody}>
                    <h3 className={styles.title}>{app.name}</h3>
                    <p className={styles.description}>{app.description}</p>
                </div>

                <div className={styles.cardFooter}>
                    <span className={styles.category}>{app.category}</span>
                    <span className={styles.openApp}>
                        Open <ChevronRight size={14} />
                    </span>
                </div>
            </div>
        </article>
    );
}
