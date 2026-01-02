'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Quote as QuoteIcon, RefreshCw, Copy, Check, Trash2, Heart, Loader2, Sparkles, Search, X } from 'lucide-react';

interface Quote {
    id: number;
    quote: string;
    author: string;
}

interface QuotesResponse {
    quotes: Quote[];
    total: number;
    skip: number;
    limit: number;
}

const bgGradients = [
    'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
    'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))',
    'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
    'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))',
    'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
];

// DummyJSON Quotes API - reliable and CORS-friendly
const QUOTES_API = 'https://dummyjson.com/quotes';
const ITEMS_PER_PAGE = 10;

export default function QuotesApp() {
    const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
    const [displayedQuotes, setDisplayedQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [showSaved, setShowSaved] = useState(false);
    const [totalQuotes, setTotalQuotes] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Load saved quotes from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('saved_quotes_v4');
        if (saved) {
            setSavedQuotes(JSON.parse(saved));
        }
    }, []);

    // Get unique authors for suggestions
    const uniqueAuthors = useMemo(() => {
        const authors = [...new Set(allQuotes.map(q => q.author))];
        return authors.sort();
    }, [allQuotes]);

    // Filter quotes based on search
    const filteredQuotes = useMemo(() => {
        if (!searchQuery.trim()) return allQuotes;
        const query = searchQuery.toLowerCase();
        return allQuotes.filter(q =>
            q.author.toLowerCase().includes(query) ||
            q.quote.toLowerCase().includes(query)
        );
    }, [allQuotes, searchQuery]);

    // Fetch all quotes from API
    const fetchQuotes = useCallback(async () => {
        setLoading(true);
        setError('');
        setPage(1);
        setSearchQuery('');

        try {
            // Fetch all quotes (API returns up to 100 at once)
            const response = await fetch(`${QUOTES_API}?limit=100`);
            if (!response.ok) throw new Error('Failed to fetch');

            const data: QuotesResponse = await response.json();

            // Shuffle quotes for variety
            const shuffled = [...data.quotes].sort(() => Math.random() - 0.5);

            setAllQuotes(shuffled);
            setDisplayedQuotes(shuffled.slice(0, ITEMS_PER_PAGE));
            setTotalQuotes(data.total);
            setHasMore(shuffled.length > ITEMS_PER_PAGE);

        } catch (err) {
            console.error('Failed to fetch quotes:', err);
            setError('Failed to load quotes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    // Update displayed quotes when search changes
    useEffect(() => {
        setPage(1);
        setDisplayedQuotes(filteredQuotes.slice(0, ITEMS_PER_PAGE));
        setHasMore(filteredQuotes.length > ITEMS_PER_PAGE);
    }, [filteredQuotes]);

    // Load more quotes (from already fetched/filtered data)
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        const endIndex = nextPage * ITEMS_PER_PAGE;

        setTimeout(() => {
            setDisplayedQuotes(filteredQuotes.slice(0, endIndex));
            setPage(nextPage);
            setHasMore(endIndex < filteredQuotes.length);
            setLoadingMore(false);
        }, 200);
    }, [page, loadingMore, hasMore, filteredQuotes]);

    // Intersection Observer
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && !showSaved) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
        return () => observerRef.current?.disconnect();
    }, [loadMore, hasMore, loadingMore, loading, showSaved]);

    const saveQuote = (quote: Quote) => {
        if (!savedQuotes.find(q => q.id === quote.id)) {
            const newSaved = [quote, ...savedQuotes];
            setSavedQuotes(newSaved);
            localStorage.setItem('saved_quotes_v4', JSON.stringify(newSaved));
        }
    };

    const removeQuote = (id: number) => {
        const newSaved = savedQuotes.filter(q => q.id !== id);
        setSavedQuotes(newSaved);
        localStorage.setItem('saved_quotes_v4', JSON.stringify(newSaved));
    };

    const copyQuote = async (quote: Quote) => {
        await navigator.clipboard.writeText(`"${quote.quote}" - ${quote.author}`);
        setCopiedId(quote.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const isSaved = (id: number) => savedQuotes.some(q => q.id === id);

    const displayList = showSaved ? savedQuotes : displayedQuotes;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <QuoteIcon size={22} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Daily Quotes</span>
                </div>

                {/* Saved Toggle */}
                <button
                    onClick={() => setShowSaved(!showSaved)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.75rem',
                        background: showSaved ? 'var(--primary)' : 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: showSaved ? 'white' : 'var(--text-secondary)'
                    }}
                >
                    <Heart size={12} fill={showSaved ? 'white' : 'none'} />
                    Saved ({savedQuotes.length})
                </button>
            </div>

            {/* Search Bar - only show when not in saved mode */}
            {!showSaved && !loading && (
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search by author or quote..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 2.5rem 0.75rem 38px',
                            fontSize: '0.9rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'var(--bg-tertiary)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            )}

            {/* Popular Authors - Quick filters */}
            {!showSaved && !loading && !searchQuery && (
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
                    {uniqueAuthors.slice(0, 8).map((author, index, arr) => (
                        <button
                            key={author}
                            onClick={() => setSearchQuery(author)}
                            style={{
                                padding: '0.4rem 0.75rem',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                                flexShrink: 0,
                                marginRight: index === arr.length - 1 ? '1rem' : 0
                            }}
                        >
                            {author}
                        </button>
                    ))}
                </div>
            )}

            {/* Search Results Info */}
            {!showSaved && searchQuery && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
                    borderRadius: '10px',
                    fontSize: '0.75rem'
                }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Found <strong style={{ color: 'var(--primary)' }}>{filteredQuotes.length}</strong> quotes for "{searchQuery}"
                    </span>
                    <button
                        onClick={() => setSearchQuery('')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* API Source Info */}
            {!showSaved && !loading && !searchQuery && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    color: 'var(--text-tertiary)'
                }}>
                    <Sparkles size={12} />
                    {totalQuotes} quotes from DummyJSON API
                </div>
            )}

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
                    <button
                        onClick={fetchQuotes}
                        style={{
                            marginLeft: '0.5rem',
                            color: 'var(--primary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                    <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>Fetching quotes from API...</div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : displayList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    {showSaved ? 'No saved quotes yet. Save some quotes to see them here!' :
                        searchQuery ? `No quotes found for "${searchQuery}"` : 'No quotes found'}
                </div>
            ) : (
                <>
                    {/* Quotes List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {displayList.map((quote, idx) => (
                            <div
                                key={quote.id}
                                style={{
                                    padding: '1rem',
                                    background: bgGradients[idx % bgGradients.length],
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '14px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* Quote Content */}
                                <div style={{ position: 'relative', paddingLeft: '1.5rem', marginBottom: '0.75rem' }}>
                                    <QuoteIcon
                                        size={16}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            color: 'var(--primary)',
                                            opacity: 0.6
                                        }}
                                    />
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.95rem',
                                        lineHeight: 1.5,
                                        color: 'var(--text-primary)',
                                        fontStyle: 'italic'
                                    }}>
                                        {quote.quote}
                                    </p>
                                </div>

                                {/* Author & Actions */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '0.5rem',
                                    borderTop: '1px solid var(--glass-border)'
                                }}>
                                    <button
                                        onClick={() => setSearchQuery(quote.author)}
                                        style={{
                                            margin: 0,
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: 'var(--primary)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                    >
                                        — {quote.author}
                                    </button>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => copyQuote(quote)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                color: copiedId === quote.id ? 'var(--primary)' : 'var(--text-secondary)'
                                            }}
                                        >
                                            {copiedId === quote.id ? <Check size={14} /> : <Copy size={14} />}
                                        </button>

                                        {showSaved ? (
                                            <button
                                                onClick={() => removeQuote(quote.id)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    color: '#ef4444'
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => saveQuote(quote)}
                                                disabled={isSaved(quote.id)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: isSaved(quote.id) ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)',
                                                    border: isSaved(quote.id) ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    cursor: isSaved(quote.id) ? 'default' : 'pointer',
                                                    color: isSaved(quote.id) ? '#ef4444' : 'var(--text-secondary)'
                                                }}
                                            >
                                                <Heart size={14} fill={isSaved(quote.id) ? '#ef4444' : 'none'} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Trigger */}
                    {!showSaved && (
                        <div ref={loadMoreRef} style={{ padding: '1rem', textAlign: 'center' }}>
                            {loadingMore && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                                    <span style={{ fontSize: '0.85rem' }}>Loading more...</span>
                                </div>
                            )}
                            {!hasMore && displayedQuotes.length > 0 && (
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                    ✓ All {filteredQuotes.length} quotes loaded
                                </div>
                            )}
                        </div>
                    )}

                    {/* Refresh Button */}
                    {!showSaved && (
                        <button
                            onClick={fetchQuotes}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}
                        >
                            <RefreshCw size={16} />
                            Shuffle & Reload
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
