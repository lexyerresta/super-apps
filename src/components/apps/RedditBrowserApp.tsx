'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { MessageCircle, ExternalLink, TrendingUp } from 'lucide-react';

export default function RedditBrowserApp() {
    const [subreddit, setSubreddit] = useState('popular');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=15`);
            const data = await response.json();
            setPosts(data.data?.children || []);
        } catch (error) {
            console.error('Failed to fetch Reddit posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPosts();
    }, [subreddit]);

    const formatNumber = (num: number) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return num.toString();
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Subreddit</label>
                <input type="text" value={subreddit} onChange={(e) => setSubreddit(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && fetchPosts()} placeholder="popular" className={styles.input} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['popular', 'all', 'programming', 'technology', 'news', 'worldnews'].map(sub => (
                    <button key={sub} onClick={() => setSubreddit(sub)} className={styles.actionBtn} style={{
                        background: subreddit === sub ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: subreddit === sub ? 'white' : 'var(--text-primary)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem'
                    }}>
                        r/{sub}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {posts.map((post) => {
                        const data = post.data;
                        return (
                            <div key={data.id} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                        <TrendingUp size={16} color="var(--primary)" />
                                        <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{formatNumber(data.ups)}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            r/{data.subreddit} • {data.author}
                                        </div>
                                        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                                            {data.title}
                                        </div>
                                        {data.selftext && (
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                                                {data.selftext.substring(0, 200)}{data.selftext.length > 200 ? '...' : ''}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            <div><MessageCircle size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />{data.num_comments} comments</div>
                                            <button onClick={() => window.open(`https://reddit.com${data.permalink}`, '_blank')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                View <ExternalLink size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
