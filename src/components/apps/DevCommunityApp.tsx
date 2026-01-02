'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, ExternalLink, TrendingUp, Heart, Bookmark, Clock, User, Tag, Loader2, Code, Lightbulb, Flame, Star } from 'lucide-react';

interface Article {
    id: number;
    title: string;
    description?: string;
    url: string;
    user: {
        name: string;
        username: string;
        profile_image?: string;
    };
    published_at: string;
    tag_list: string[];
    positive_reactions_count: number;
    comments_count: number;
    reading_time_minutes: number;
    cover_image?: string;
}

type Category = 'top' | 'latest' | 'week' | 'month' | 'year' | 'infinity';

const CATEGORIES: Record<Category, { label: string; icon: React.ReactNode; param: string }> = {
    top: { label: '🔥 Hot', icon: <Flame size={14} />, param: 'top=1' },
    latest: { label: '✨ Latest', icon: <Clock size={14} />, param: '' },
    week: { label: '📅 Week', icon: <TrendingUp size={14} />, param: 'top=7' },
    month: { label: '📆 Month', icon: <Star size={14} />, param: 'top=30' },
    year: { label: '🗓️ Year', icon: <TrendingUp size={14} />, param: 'top=365' },
    infinity: { label: '♾️ All Time', icon: <Lightbulb size={14} />, param: 'top=1000' },
};

const TAGS = ['javascript', 'webdev', 'react', 'python', 'beginners', 'tutorial', 'programming', 'ai'];

const ITEMS_PER_PAGE = 10;
const DEV_API = 'https://dev.to/api/articles';

export default function DevCommunityApp() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [category, setCategory] = useState<Category>('top');
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [page, setPage] = useState(1);
    const [apiPage, setApiPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchArticles = useCallback(async (cat: Category, tag: string, pageNum: number = 1, append: boolean = false) => {
        if (pageNum === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError('');

        try {
            let url = `${DEV_API}?per_page=30&page=${pageNum}`;

            // Add category param
            if (CATEGORIES[cat].param) {
                url += `&${CATEGORIES[cat].param}`;
            }

            // Add tag filter
            if (tag) {
                url += `&tag=${tag}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');

            const data: Article[] = await response.json();

            if (append) {
                setArticles(prev => [...prev, ...data]);
            } else {
                setArticles(data);
                setDisplayedArticles(data.slice(0, ITEMS_PER_PAGE));
            }

            setApiPage(pageNum);
            setHasMore(data.length === 30);

        } catch (err) {
            console.error('Failed to fetch articles:', err);
            setError('Failed to load articles. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Load more
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const nextPage = page + 1;
        const endIndex = nextPage * ITEMS_PER_PAGE;

        if (endIndex <= articles.length) {
            setDisplayedArticles(articles.slice(0, endIndex));
            setPage(nextPage);
            setHasMore(endIndex < articles.length || articles.length === 30);
        } else if (articles.length >= apiPage * 30) {
            fetchArticles(category, selectedTag, apiPage + 1, true);
        } else {
            setHasMore(false);
        }
    }, [page, loadingMore, hasMore, articles, apiPage, category, selectedTag, fetchArticles]);

    // Intersection Observer
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
        return () => observerRef.current?.disconnect();
    }, [loadMore, hasMore, loadingMore, loading]);

    // Fetch on category or tag change
    useEffect(() => {
        setPage(1);
        fetchArticles(category, selectedTag);
    }, [category, selectedTag, fetchArticles]);

    // Update displayed when articles change
    useEffect(() => {
        if (articles.length > 0) {
            const endIndex = page * ITEMS_PER_PAGE;
            setDisplayedArticles(articles.slice(0, endIndex));
        }
    }, [articles, page]);

    const handleImageError = (id: number) => {
        setImageErrors(prev => new Set(prev).add(id));
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffHours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <Code size={22} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>DEV Community</span>
                <span style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-secondary)',
                    padding: '3px 8px',
                    borderRadius: '10px'
                }}>
                    dev.to
                </span>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                paddingRight: '1rem',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'none'
            }}>
                {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat], index, arr) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.45rem 0.8rem',
                            background: category === key ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: category === key ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: category === key ? '600' : '500',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            marginRight: index === arr.length - 1 ? '1rem' : 0
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Tags */}
            <div style={{
                display: 'flex',
                gap: '0.35rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                paddingRight: '1rem',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'none'
            }}>
                <button
                    onClick={() => setSelectedTag('')}
                    style={{
                        padding: '0.35rem 0.7rem',
                        background: !selectedTag ? 'var(--bg-tertiary)' : 'transparent',
                        color: !selectedTag ? 'var(--primary)' : 'var(--text-tertiary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All
                </button>
                {TAGS.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.35rem 0.7rem',
                            background: selectedTag === tag ? 'var(--bg-tertiary)' : 'transparent',
                            color: selectedTag === tag ? 'var(--primary)' : 'var(--text-tertiary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        <Tag size={10} />
                        {tag}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(255,100,100,0.1)',
                    borderRadius: '10px',
                    color: '#ff6b6b',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                    <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>Loading articles...</div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : displayedArticles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No articles found
                </div>
            ) : (
                <>
                    {/* Articles List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {displayedArticles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => window.open(article.url, '_blank')}
                                style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    padding: '0.9rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                {/* Cover Image */}
                                <div style={{
                                    flexShrink: 0,
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(135deg, #3B49DF, #6366F1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {article.cover_image && !imageErrors.has(article.id) ? (
                                        <img
                                            src={article.cover_image}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                            onError={() => handleImageError(article.id)}
                                        />
                                    ) : (
                                        <Code size={24} style={{ color: 'white', opacity: 0.8 }} />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Author & Date */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.3rem',
                                        fontSize: '0.7rem',
                                        color: 'var(--text-tertiary)'
                                    }}>
                                        {article.user.profile_image && (
                                            <img
                                                src={article.user.profile_image}
                                                alt=""
                                                style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                                            />
                                        )}
                                        <span style={{ fontWeight: '500' }}>{article.user.name}</span>
                                        <span>•</span>
                                        <span>{formatDate(article.published_at)}</span>
                                    </div>

                                    {/* Title */}
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        marginBottom: '0.35rem',
                                        lineHeight: '1.3',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {article.title}
                                    </div>

                                    {/* Tags */}
                                    {article.tag_list.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.3rem',
                                            marginBottom: '0.35rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            {article.tag_list.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    style={{
                                                        fontSize: '0.6rem',
                                                        padding: '2px 6px',
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        color: 'var(--primary)',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontSize: '0.65rem',
                                        color: 'var(--text-tertiary)'
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <Heart size={11} /> {article.positive_reactions_count}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <MessageCircle size={11} /> {article.comments_count}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <Clock size={11} /> {article.reading_time_minutes} min read
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Trigger */}
                    <div ref={loadMoreRef} style={{ padding: '1rem', textAlign: 'center' }}>
                        {loadingMore && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                                <span style={{ fontSize: '0.85rem' }}>Loading more...</span>
                            </div>
                        )}
                        {!hasMore && displayedArticles.length > 0 && (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                ✓ End of articles
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
