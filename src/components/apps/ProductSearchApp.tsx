'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, ExternalLink, Globe, AlertCircle, RefreshCw, X, ArrowUpRight } from 'lucide-react';

// --- Configuration ---
const MARKETPLACES = [
    {
        id: 'google',
        name: 'All (Google)',
        icon: '🔍',
        color: '#4285F4',
        // Uses Google with igu=1 (Interface for Google Users) which often allows embedding
        getUrl: (q: string) => `https://www.google.com/search?igu=1&q=${encodeURIComponent(q)}`
    },
    {
        id: 'shopee',
        name: 'Shopee',
        icon: '🛒',
        color: '#EE4D2D',
        // Uses Google restricted to Shopee site as Shopee blocks direct iframes
        getUrl: (q: string) => `https://www.google.com/search?igu=1&tbm=isch&q=site:shopee.co.id+${encodeURIComponent(q)}`
    },
    {
        id: 'tokopedia',
        name: 'Tokopedia',
        icon: '🟢',
        color: '#42B549',
        // Uses Google restricted to Tokopedia
        getUrl: (q: string) => `https://www.google.com/search?igu=1&tbm=isch&q=site:tokopedia.com+${encodeURIComponent(q)}`
    },
    {
        id: 'lazada',
        name: 'Lazada',
        icon: '💙',
        color: '#0F146D',
        getUrl: (q: string) => `https://www.google.com/search?igu=1&tbm=isch&q=site:lazada.co.id+${encodeURIComponent(q)}`
    },
    {
        id: 'youtube',
        name: 'Review (YT)',
        icon: '📺',
        color: '#FF0000',
        getUrl: (q: string) => `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(q + ' review')}`
    }
];

export default function ProductSearchApp() {
    const [query, setQuery] = useState('');
    const [activeMp, setActiveMp] = useState(MARKETPLACES[1]); // Default to Shopee
    const [iframeUrl, setIframeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTip, setShowTip] = useState(true);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        // Construct the embed URL
        const url = activeMp.getUrl(query);
        setIframeUrl(url);
    };

    const handleTabChange = (mp: typeof MARKETPLACES[0]) => {
        setActiveMp(mp);
        if (query.trim()) {
            setIsLoading(true);
            setIframeUrl(mp.getUrl(query));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Inter, sans-serif', background: 'white' }}>

            {/* Header */}
            <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', background: 'white', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '6px',
                            borderRadius: '8px',
                            display: 'flex'
                        }}>
                            <Globe size={18} />
                        </div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Web Search</h1>
                    </div>
                    {iframeUrl && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => window.open(iframeUrl, '_blank')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)',
                                    background: 'var(--bg-secondary)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer'
                                }}
                            >
                                <ArrowUpRight size={14} /> Open Full
                            </button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search keywords..."
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem 0.7rem 2.5rem',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '0.9rem',
                                outline: 'none',
                                background: '#f9fafb'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0 1.25rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Go
                    </button>
                </form>

                {/* Categories / Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '2px' }}>
                    {MARKETPLACES.map(mp => (
                        <button
                            key={mp.id}
                            onClick={() => handleTabChange(mp)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                border: activeMp.id === mp.id ? `1px solid ${mp.color}` : '1px solid #e5e7eb',
                                background: activeMp.id === mp.id ? `${mp.color}10` : 'white',
                                color: activeMp.id === mp.id ? mp.color : '#4b5563',
                                fontSize: '0.85rem',
                                fontWeight: activeMp.id === mp.id ? 700 : 500,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{mp.icon}</span> {mp.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Web View (Iframe) */}
            <div style={{ flex: 1, position: 'relative', background: '#f3f4f6' }}>
                {iframeUrl ? (
                    <>
                        {isLoading && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.8)', zIndex: 5
                            }}>
                                <div style={{
                                    width: '30px', height: '30px',
                                    border: '3px solid #e5e7eb', borderTopColor: 'var(--primary)',
                                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                                }} />
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        )}
                        <iframe
                            src={iframeUrl}
                            title="Marketplace View"
                            style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)} // Basic error handling
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                        />

                        {/* Security Warning Overlay - helps user understand why it's not the 'exact' site */}
                        {showTip && (
                            <div style={{
                                position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
                                background: '#1f2937', color: 'white', padding: '0.6rem 1rem', borderRadius: '30px',
                                fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '90%', maxWidth: '300px',
                                justifyContent: 'space-between', zIndex: 20
                            }}>
                                <span>Showing results via Google Search due to marketplace security blocking direct embedding.</span>
                                <button onClick={() => setShowTip(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={14} /></button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: '#6b7280', padding: '2rem', textAlign: 'center'
                    }}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <Search size={40} color="#9ca3af" />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem' }}>Start Searching</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', maxWidth: '300px' }}>
                            View search results from Shopee, Tokopedia, and more directly in this window.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                            {['Hot Wheels', 'iPhone 15', 'Laptop'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setQuery(tag);
                                        setActiveMp(MARKETPLACES[1]);
                                        setIframeUrl(MARKETPLACES[1].getUrl(tag));
                                        setIsLoading(true);
                                    }}
                                    style={{
                                        padding: '0.4rem 0.8rem', borderRadius: '8px',
                                        background: 'white', border: '1px solid #e5e7eb',
                                        fontSize: '0.8rem', color: '#4b5563', cursor: 'pointer'
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
