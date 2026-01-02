'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, Search, Loader2, RefreshCw, TrendingUp, Clock, MessageSquare } from 'lucide-react';

interface NewsArticle {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    source: string;
    score: number;
    comments: number;
    id: string;
}

type NewsCategory = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

const CATEGORIES: Record<NewsCategory, { endpoint: string; label: string; icon: string }> = {
    top: { endpoint: 'topstories', label: 'Top Stories', icon: '🔥' },
    new: { endpoint: 'newstories', label: 'Latest', icon: '✨' },
    best: { endpoint: 'beststories', label: 'Best', icon: '⭐' },
    ask: { endpoint: 'askstories', label: 'Ask HN', icon: '❓' },
    show: { endpoint: 'showstories', label: 'Show HN', icon: '🚀' },
    job: { endpoint: 'jobstories', label: 'Jobs', icon: '💼' },
};

const ITEMS_PER_PAGE = 10;
const HN_API = 'https://hacker-news.firebaseio.com/v0';

export default function NewsApp() {
    const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
    const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [category, setCategory] = useState<NewsCategory>('top');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchNews = useCallback(async (cat: NewsCategory) => {
        setLoading(true);
        setError('');
        setPage(1);
        setAllArticles([]);
        setDisplayedArticles([]);
        setHasMore(true);

        try {
            const endpoint = CATEGORIES[cat].endpoint;
            const response = await fetch(`${HN_API}/${endpoint}.json`);

            if (!response.ok) {
                throw new Error('Failed to fetch story IDs');
            }

            const storyIds: number[] = await response.json();

            // Fetch first 40 stories in parallel (batched)
            const batchSize = 40;
            const idsToFetch = storyIds.slice(0, batchSize);

            const stories = await Promise.all(
                idsToFetch.map(async (id) => {
                    try {
                        const storyRes = await fetch(`${HN_API}/item/${id}.json`);
                        return storyRes.json();
                    } catch {
                        return null;
                    }
                })
            );

            const newsArticles: NewsArticle[] = stories
                .filter((story): story is NonNullable<typeof story> =>
                    story !== null && story.title && !story.deleted && !story.dead
                )
                .map((story) => {
                    const domain = story.url ? new URL(story.url).hostname.replace('www.', '') : 'news.ycombinator.com';
                    return {
                        id: String(story.id),
                        title: story.title,
                        link: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                        pubDate: new Date(story.time * 1000).toISOString(),
                        description: story.text?.replace(/<[^>]*>/g, '').slice(0, 150) || '',
                        source: domain,
                        score: story.score || 0,
                        comments: story.descendants || 0
                    };
                });

            setAllArticles(newsArticles);
            setDisplayedArticles(newsArticles.slice(0, ITEMS_PER_PAGE));
            setHasMore(newsArticles.length > ITEMS_PER_PAGE);

        } catch (err) {
            console.error('Failed to fetch news:', err);
            setError('Failed to load news. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load more articles
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        const endIndex = nextPage * ITEMS_PER_PAGE;

        const filtered = searchQuery
            ? allArticles.filter(a =>
                a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.source.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : allArticles;

        setTimeout(() => {
            setDisplayedArticles(filtered.slice(0, endIndex));
            setPage(nextPage);
            setHasMore(endIndex < filtered.length);
            setLoadingMore(false);
        }, 200);
    }, [page, loadingMore, hasMore, allArticles, searchQuery]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [loadMore, hasMore, loadingMore, loading]);

    useEffect(() => {
        fetchNews(category);
    }, [category, fetchNews]);

    // Filter when search changes
    useEffect(() => {
        if (allArticles.length > 0) {
            const filtered = searchQuery
                ? allArticles.filter(a =>
                    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.source.toLowerCase().includes(searchQuery.toLowerCase())
                )
                : allArticles;

            setDisplayedArticles(filtered.slice(0, ITEMS_PER_PAGE));
            setPage(1);
            setHasMore(filtered.length > ITEMS_PER_PAGE);
        }
    }, [searchQuery, allArticles]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        return `${Math.floor(diffHours / 24)}d`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📰</span>
                    <span style={{ fontWeight: '600' }}>Hacker News</span>
                </div>
                <button
                    onClick={() => fetchNews(category)}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.4rem 0.75rem',
                        background: 'var(--bg-secondary)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    Refresh
                </button>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            paddingLeft: '36px',
                            fontSize: '0.9rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.4rem',
                marginBottom: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                paddingRight: '1rem',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'none'
            }}>
                {(Object.entries(CATEGORIES) as [NewsCategory, typeof CATEGORIES[NewsCategory]][]).map(([key, cat], index, arr) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: category === key ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: category === key ? 'white' : 'var(--text-primary)',
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontWeight: category === key ? '600' : '400',
                            flexShrink: 0,
                            marginRight: index === arr.length - 1 ? '1rem' : 0
                        }}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255,100,100,0.1)',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    <div style={{ color: '#ff6b6b', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{error}</div>
                    <button
                        onClick={() => fetchNews(category)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 1.2rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                    <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Loading stories...</div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : displayedArticles.length === 0 && !error ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                    {searchQuery ? 'No stories match your search' : 'No stories available'}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {displayedArticles.map((article, index) => (
                        <div
                            key={article.id}
                            style={{
                                display: 'flex',
                                gap: '0.75rem',
                                padding: '0.85rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                alignItems: 'flex-start'
                            }}
                            onClick={() => window.open(article.link, '_blank')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--bg-tertiary)';
                                e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--bg-secondary)';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            {/* Rank */}
                            <div style={{
                                width: '24px',
                                height: '24px',
                                background: 'var(--primary)',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                color: 'white',
                                flexShrink: 0
                            }}>
                                {(page - 1) * ITEMS_PER_PAGE + index + 1}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    marginBottom: '0.4rem',
                                    lineHeight: '1.35',
                                    color: 'var(--text-primary)'
                                }}>
                                    {article.title}
                                </div>

                                {/* Meta info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.7rem',
                                    color: 'var(--text-secondary)',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        background: 'rgba(var(--primary-rgb), 0.15)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        color: 'var(--primary)',
                                        fontWeight: '500'
                                    }}>
                                        {article.source.length > 25 ? article.source.slice(0, 25) + '...' : article.source}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <TrendingUp size={11} /> {article.score}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <MessageSquare size={11} /> {article.comments}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <Clock size={11} /> {formatDate(article.pubDate)}
                                    </span>
                                </div>
                            </div>

                            {/* External link icon */}
                            <ExternalLink size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0, marginTop: '3px' }} />
                        </div>
                    ))}

                    {/* Load More Trigger */}
                    <div ref={loadMoreRef} style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {loadingMore && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                                <span>Loading more...</span>
                            </div>
                        )}
                        {!hasMore && displayedArticles.length > 0 && (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                ✓ End of stories
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
