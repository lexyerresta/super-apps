'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { ShoppingBag, Star, DollarSign, Search } from 'lucide-react';

export default function ProductSearchApp() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('all');

    const searchProducts = async () => {
        setLoading(true);
        try {
            // Using Fake Store API (free, no key needed)
            let url = 'https://fakestoreapi.com/products';
            if (category !== 'all') {
                url = `https://fakestoreapi.com/products/category/${category}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            const filtered = query
                ? data.filter((p: any) => p.title.toLowerCase().includes(query.toLowerCase()))
                : data;

            setProducts(filtered);
        } catch (error) {
            console.error('Failed to search products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        searchProducts();
    }, [category]);

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchProducts()} placeholder="Search products..." className={styles.input} style={{ fontSize: '1.125rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"].map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} className={styles.actionBtn} style={{
                        background: category === cat ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: category === cat ? 'white' : 'var(--text-primary)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize'
                    }}>
                        {cat}
                    </button>
                ))}
            </div>

            <button onClick={searchProducts} disabled={loading} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <Search size={18} /> {loading ? 'Searching...' : 'Search Products'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {products.map((product) => (
                    <div key={product.id} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                        <div style={{ aspectRatio: '1', background: 'white', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.3', height: '2.6em', overflow: 'hidden' }}>
                                {product.title}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                                <Star size={12} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                                <span style={{ fontWeight: '600' }}>{product.rating?.rate}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>({product.rating?.count})</span>
                            </div>
                            <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--primary)' }}>
                                ${product.price}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
