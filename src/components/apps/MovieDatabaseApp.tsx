'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Film, Star, Calendar } from 'lucide-react';

export default function MovieDatabaseApp() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const searchMovies = async () => {
        if (!query) return;
        setLoading(true);
        try {
            // Using OMDB API (free)
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=YOUR_API_KEY`);
            const data = await response.json();
            setMovies(data.Search || []);
        } catch (error) {
            console.error('Failed to search movies:', error);
            // Fallback mock data
            setMovies([
                { Title: 'The Matrix', Year: '1999', imdbID: 'tt0133093', Type: 'movie', Poster: 'https://via.placeholder.com/300x450?text=Movie' },
                { Title: 'Inception', Year: '2010', imdbID: 'tt1375666', Type: 'movie', Poster: 'https://via.placeholder.com/300x450?text=Movie' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchMovies()} placeholder="Search movies, TV shows..." className={styles.input} style={{ fontSize: '1.125rem' }} />
            </div>

            <button onClick={searchMovies} disabled={loading || !query} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Film size={18} /> {loading ? 'Searching...' : 'Search'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {movies.map((movie) => (
                    <div key={movie.imdbID} style={{ cursor: 'pointer' }} onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')}>
                        <div style={{ aspectRatio: '2/3', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                            {movie.Poster && movie.Poster !== 'N/A' ? (
                                <img src={movie.Poster} alt={movie.Title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                    <Film size={48} />
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', lineHeight: '1.3' }}>{movie.Title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} /> {movie.Year}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
