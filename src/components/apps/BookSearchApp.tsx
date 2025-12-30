'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { BookOpen, ExternalLink } from 'lucide-react';

export default function BookSearchApp() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const searchBooks = async () => {
        if (!query) return;
        setLoading(true);
        try {
            // Using Open Library API (free, no key needed)
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
            const data = await response.json();
            setBooks(data.docs || []);
        } catch (error) {
            console.error('Failed to search books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchBooks()} placeholder="Search books by title, author..." className={styles.input} style={{ fontSize: '1.125rem' }} />
            </div>

            <button onClick={searchBooks} disabled={loading || !query} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <BookOpen size={18} /> {loading ? 'Searching...' : 'Search Books'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {books.map((book, i) => (
                    <div key={i} style={{ cursor: 'pointer' }} onClick={() => book.key && window.open(`https://openlibrary.org${book.key}`, '_blank')}>
                        <div style={{ aspectRatio: '2/3', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                            {book.cover_i ? (
                                <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                    <BookOpen size={48} />
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', lineHeight: '1.3' }}>{book.title}</div>
                        {book.author_name && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                by {book.author_name[0]}
                            </div>
                        )}
                        {book.first_publish_year && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {book.first_publish_year}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
