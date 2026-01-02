'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Search, Loader2, Star, Calendar, User, TrendingUp, Sparkles, Heart, BookMarked, Library } from 'lucide-react';

interface Book {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    edition_count?: number;
    ratings_average?: number;
    subject?: string[];
}

type Category = 'trending' | 'classic' | 'science' | 'fiction' | 'fantasy' | 'romance';

const CATEGORIES: Record<Category, { query: string; label: string; icon: React.ReactNode }> = {
    trending: { query: 'subject:bestseller', label: 'Trending', icon: <TrendingUp size={14} /> },
    classic: { query: 'subject:classic literature', label: 'Classics', icon: <BookMarked size={14} /> },
    science: { query: 'subject:science', label: 'Science', icon: <Sparkles size={14} /> },
    fiction: { query: 'subject:fiction', label: 'Fiction', icon: <BookOpen size={14} /> },
    fantasy: { query: 'subject:fantasy', label: 'Fantasy', icon: <Star size={14} /> },
    romance: { query: 'subject:romance', label: 'Romance', icon: <Heart size={14} /> },
};

const ITEMS_PER_PAGE = 12;

export default function BookSearchApp() {
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [category, setCategory] = useState<Category>('trending');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [totalFound, setTotalFound] = useState(0);
    const [apiPage, setApiPage] = useState(1);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchBooks = useCallback(async (query: string, pageNum: number = 1, append: boolean = false) => {
        if (pageNum === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError('');

        try {
            const offset = (pageNum - 1) * 20;
            const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&offset=${offset}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            const results: Book[] = data.docs || [];

            if (append) {
                setAllBooks(prev => [...prev, ...results]);
            } else {
                setAllBooks(results);
                setDisplayedBooks(results.slice(0, ITEMS_PER_PAGE));
            }

            setTotalFound(data.numFound || 0);
            setApiPage(pageNum);
            setHasMore(offset + results.length < data.numFound);

        } catch (err) {
            console.error('Failed to fetch books:', err);
            setError('Failed to load books. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Load more books
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const nextPage = page + 1;
        const endIndex = nextPage * ITEMS_PER_PAGE;

        if (endIndex <= allBooks.length) {
            setDisplayedBooks(allBooks.slice(0, endIndex));
            setPage(nextPage);
            setHasMore(endIndex < allBooks.length || endIndex < totalFound);
        } else if (allBooks.length < totalFound) {
            const query = searchQuery || CATEGORIES[category].query;
            fetchBooks(query, apiPage + 1, true);
        }
    }, [page, loadingMore, hasMore, allBooks, totalFound, category, searchQuery, apiPage, fetchBooks]);

    // Intersection Observer
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

    // Fetch on category change
    useEffect(() => {
        setSearchQuery('');
        setPage(1);
        fetchBooks(CATEGORIES[category].query);
    }, [category, fetchBooks]);

    // Update displayed when allBooks change
    useEffect(() => {
        if (allBooks.length > 0) {
            const endIndex = page * ITEMS_PER_PAGE;
            setDisplayedBooks(allBooks.slice(0, endIndex));
            setHasMore(endIndex < allBooks.length || endIndex < totalFound);
        }
    }, [allBooks, page, totalFound]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setPage(1);
            fetchBooks(searchQuery);
        }
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
                <Library size={22} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Book Library</span>
                {totalFound > 0 && !loading && (
                    <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-secondary)',
                        padding: '4px 10px',
                        borderRadius: '12px'
                    }}>
                        {totalFound.toLocaleString()} books
                    </span>
                )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search books by title, author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            paddingLeft: '38px',
                            fontSize: '0.9rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !searchQuery.trim()}
                    style={{
                        padding: '0 1.25rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: loading || !searchQuery.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        opacity: loading || !searchQuery.trim() ? 0.6 : 1
                    }}
                >
                    Search
                </button>
            </form>

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
                            gap: '0.35rem',
                            padding: '0.5rem 0.9rem',
                            background: category === key ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: category === key ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: category === key ? '600' : '500',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            marginRight: index === arr.length - 1 ? '1rem' : 0
                        }}
                    >
                        {cat.icon}
                        {cat.label}
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
                    <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>Loading books...</div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : displayedBooks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No books found
                </div>
            ) : (
                <>
                    {/* Books Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '1rem'
                    }}>
                        {displayedBooks.map((book, index) => (
                            <div
                                key={`${book.key}-${index}`}
                                onClick={() => book.key && window.open(`https://openlibrary.org${book.key}`, '_blank')}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {/* Cover */}
                                <div style={{
                                    aspectRatio: '2/3',
                                    background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                                    borderRadius: '10px',
                                    marginBottom: '0.5rem',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}>
                                    {book.cover_i ? (
                                        <img
                                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                            alt={book.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0.5rem',
                                            textAlign: 'center'
                                        }}>
                                            <BookOpen size={32} style={{ color: 'var(--text-secondary)', opacity: 0.4, marginBottom: '0.5rem' }} />
                                            <div style={{
                                                fontSize: '0.65rem',
                                                color: 'var(--text-secondary)',
                                                opacity: 0.6,
                                                lineHeight: 1.2,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {book.title}
                                            </div>
                                        </div>
                                    )}

                                    {/* Edition Count Badge */}
                                    {book.edition_count && book.edition_count > 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '6px',
                                            right: '6px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '0.6rem',
                                            fontWeight: '600'
                                        }}>
                                            {book.edition_count} ed.
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <div style={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    marginBottom: '0.2rem',
                                    lineHeight: '1.25',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {book.title}
                                </div>

                                {/* Author */}
                                {book.author_name && book.author_name[0] && (
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        marginBottom: '0.15rem'
                                    }}>
                                        <User size={10} />
                                        <span style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {book.author_name[0]}
                                        </span>
                                    </div>
                                )}

                                {/* Year */}
                                {book.first_publish_year && (
                                    <div style={{
                                        fontSize: '0.65rem',
                                        color: 'var(--text-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem'
                                    }}>
                                        <Calendar size={9} />
                                        {book.first_publish_year}
                                    </div>
                                )}
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
                        {!hasMore && displayedBooks.length > 0 && (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                ✓ End of results
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
