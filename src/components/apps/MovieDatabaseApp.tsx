'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Film, Star, Calendar, Search, Loader2, TrendingUp, Play, Tv, Heart, Clapperboard } from 'lucide-react';

interface Movie {
    id: number;
    title: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    media_type?: string;
}

type Category = 'trending' | 'popular' | 'top_rated' | 'upcoming' | 'now_playing' | 'tv_popular';

const CATEGORIES: Record<Category, { endpoint: string; label: string; icon: React.ReactNode }> = {
    trending: { endpoint: 'trending/all/week', label: 'Trending', icon: <TrendingUp size={14} /> },
    popular: { endpoint: 'movie/popular', label: 'Popular', icon: <Heart size={14} /> },
    top_rated: { endpoint: 'movie/top_rated', label: 'Top Rated', icon: <Star size={14} /> },
    upcoming: { endpoint: 'movie/upcoming', label: 'Upcoming', icon: <Calendar size={14} /> },
    now_playing: { endpoint: 'movie/now_playing', label: 'Now Playing', icon: <Play size={14} /> },
    tv_popular: { endpoint: 'tv/popular', label: 'TV Shows', icon: <Tv size={14} /> },
};

const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d'; // Free public API key for demo
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p';

const ITEMS_PER_PAGE = 12;

export default function MovieDatabaseApp() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [category, setCategory] = useState<Category>('trending');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [apiPage, setApiPage] = useState(1);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchMovies = useCallback(async (cat: Category, pageNum: number = 1, append: boolean = false) => {
        if (pageNum === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError('');

        try {
            const endpoint = CATEGORIES[cat].endpoint;
            const url = `${TMDB_BASE}/${endpoint}?api_key=${TMDB_API_KEY}&page=${pageNum}&language=en-US`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            const results = data.results || [];

            if (append) {
                setMovies(prev => [...prev, ...results]);
            } else {
                setMovies(results);
                setDisplayedMovies(results.slice(0, ITEMS_PER_PAGE));
            }

            setTotalPages(data.total_pages || 1);
            setApiPage(pageNum);
            setHasMore(pageNum < data.total_pages);

        } catch (err) {
            console.error('Failed to fetch movies:', err);
            setError('Failed to load movies. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    const searchMovies = useCallback(async (query: string) => {
        if (!query.trim()) {
            fetchMovies(category);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const url = `${TMDB_BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1&language=en-US`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to search');

            const data = await response.json();
            const results = (data.results || []).filter((item: any) =>
                item.media_type === 'movie' || item.media_type === 'tv'
            );

            setMovies(results);
            setDisplayedMovies(results.slice(0, ITEMS_PER_PAGE));
            setPage(1);
            setHasMore(results.length > ITEMS_PER_PAGE);

        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [category, fetchMovies]);

    // Load more movies
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const nextPage = page + 1;
        const endIndex = nextPage * ITEMS_PER_PAGE;

        if (endIndex <= movies.length) {
            // Load from existing data
            setDisplayedMovies(movies.slice(0, endIndex));
            setPage(nextPage);
            setHasMore(endIndex < movies.length || apiPage < totalPages);
        } else if (apiPage < totalPages && !searchQuery) {
            // Fetch more from API
            fetchMovies(category, apiPage + 1, true);
        }
    }, [page, loadingMore, hasMore, movies, apiPage, totalPages, category, searchQuery, fetchMovies]);

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
        fetchMovies(category);
    }, [category, fetchMovies]);

    // Update displayed when movies change
    useEffect(() => {
        if (movies.length > 0) {
            const endIndex = page * ITEMS_PER_PAGE;
            setDisplayedMovies(movies.slice(0, endIndex));
            setHasMore(endIndex < movies.length || apiPage < totalPages);
        }
    }, [movies, page, apiPage, totalPages]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchMovies(searchQuery);
    };

    const getTitle = (movie: Movie) => movie.title || movie.name || 'Unknown';
    const getYear = (movie: Movie) => {
        const date = movie.release_date || movie.first_air_date;
        return date ? new Date(date).getFullYear() : 'N/A';
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
                <Clapperboard size={22} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Movies & TV</span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search movies & TV shows..."
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
                    disabled={loading}
                    style={{
                        padding: '0 1.25rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
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
                    <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>Loading movies...</div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : displayedMovies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No movies found
                </div>
            ) : (
                <>
                    {/* Movies Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '1rem'
                    }}>
                        {displayedMovies.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => {
                                    const type = movie.media_type === 'tv' || movie.name ? 'tv' : 'movie';
                                    window.open(`https://www.themoviedb.org/${type}/${movie.id}`, '_blank');
                                }}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {/* Poster */}
                                <div style={{
                                    aspectRatio: '2/3',
                                    background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                                    borderRadius: '12px',
                                    marginBottom: '0.5rem',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }}>
                                    {movie.poster_path ? (
                                        <img
                                            src={`${TMDB_IMG}/w342${movie.poster_path}`}
                                            alt={getTitle(movie)}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Film size={40} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                                        </div>
                                    )}

                                    {/* Rating Badge */}
                                    {movie.vote_average > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: movie.vote_average >= 7 ? 'rgba(34, 197, 94, 0.9)' :
                                                movie.vote_average >= 5 ? 'rgba(234, 179, 8, 0.9)' :
                                                    'rgba(239, 68, 68, 0.9)',
                                            color: 'white',
                                            padding: '3px 6px',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                        }}>
                                            <Star size={10} fill="white" />
                                            {movie.vote_average.toFixed(1)}
                                        </div>
                                    )}

                                    {/* Media Type Badge */}
                                    {(movie.media_type === 'tv' || movie.name) && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '8px',
                                            left: '8px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            padding: '3px 6px',
                                            borderRadius: '6px',
                                            fontSize: '0.65rem',
                                            fontWeight: '700'
                                        }}>
                                            TV
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <div style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    marginBottom: '0.25rem',
                                    lineHeight: '1.3',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {getTitle(movie)}
                                </div>

                                {/* Year */}
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <Calendar size={11} />
                                    {getYear(movie)}
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
                        {!hasMore && displayedMovies.length > 0 && (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                ✓ End of list
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
