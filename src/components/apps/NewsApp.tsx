'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Newspaper, ExternalLink } from 'lucide-react';

export default function NewsApp() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('general');

    const fetchNews = async () => {
        setLoading(true);
        try {
            // Using GNews API (free tier available)
            const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=YOUR_API_KEY`);
            const data = await response.json();
            setArticles(data.articles || []);
        } catch (error) {
            console.error('Failed to fetch news:', error);
            // Fallback mock data for demo
            setArticles([
                { title: 'Breaking: Tech Innovation 2025', source: { name: 'Tech News' }, url: '#', publishedAt: new Date().toISOString(), description: 'Latest in technology...' },
                { title: 'Markets Rally on Economic Data', source: { name: 'Finance Today' }, url: '#', publishedAt: new Date().toISOString(), description: 'Stock markets show...' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNews();
    }, [category]);

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'].map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} className={styles.actionBtn} style={{
                        background: category === cat ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: category === cat ? 'white' : 'var(--text-primary)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap'
                    }}>
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📰</div>
                    <div>Loading news...</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {articles.map((article, i) => (
                        <div key={i} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', cursor: 'pointer' }} onClick={() => window.open(article.url, '_blank')}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
                            </div>
                            <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                {article.title}
                            </div>
                            {article.description && (
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                                    {article.description}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '500' }}>
                                Read more <ExternalLink size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
