'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { Dog, RefreshCw, Download, ExternalLink, AlertCircle, Heart } from 'lucide-react';

interface DogImage {
    message: string;
    status: string;
}

export default function DogGalleryApp() {
    const [liked, setLiked] = useState(false);

    const { data: dog, loading, error, execute } = useAsync<DogImage>(
        () => httpClient<DogImage>('https://dog.ceo/api/breeds/image/random'),
        []
    );

    const getNewImage = () => {
        setLiked(false);
        execute();
    };

    const downloadImage = async () => {
        if (!dog) return;
        try {
            const response = await fetch(dog.message);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'dog-image.jpg';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className={styles.appContainer}>
            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Fetching a good boy...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                    <p>Failed to fetch image</p>
                    <button onClick={execute} className={styles.actionBtn}>
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            ) : dog ? (
                <div>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: '20px',
                        padding: '1rem',
                        border: '1px solid var(--glass-border)',
                        marginBottom: '1rem',
                    }}>
                        <img
                            src={dog.message}
                            alt="Random dog"
                            style={{
                                width: '100%',
                                maxHeight: '400px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                            }}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button onClick={getNewImage} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                            <RefreshCw size={16} /> New Dog
                        </button>
                        <button onClick={downloadImage} className={styles.actionBtn}>
                            <Download size={16} /> Save
                        </button>
                        <button
                            onClick={() => setLiked(!liked)}
                            className={styles.actionBtn}
                            style={liked ? { background: 'rgba(236, 72, 153, 0.1)', borderColor: '#ec4899', color: '#ec4899' } : {}}
                        >
                            <Heart size={16} fill={liked ? '#ec4899' : 'transparent'} />
                        </button>
                        <a
                            href={dog.message}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionBtn}
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Dog size={36} color="var(--primary)" />
                    </div>
                    <p>Click to see a random dog</p>
                    <button onClick={execute} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        Show Dog
                    </button>
                </div>
            )}
        </div>
    );
}
