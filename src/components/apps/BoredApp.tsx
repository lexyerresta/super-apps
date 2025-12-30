'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import {
    Sparkles, RefreshCw, Users, DollarSign, AlertCircle,
    ExternalLink, Heart, History, X, Shuffle, Target
} from 'lucide-react';

interface BoredActivity {
    activity: string;
    type: string;
    participants: number;
    price: number;
    link: string;
    key: string;
    accessibility: number;
}

const activityTypes = ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'];

const typeColors: Record<string, string> = {
    education: '#3b82f6', recreational: '#22c55e', social: '#ec4899',
    diy: '#f59e0b', charity: '#a855f7', cooking: '#ef4444',
    relaxation: '#14b8a6', music: '#6366f1', busywork: '#64748b',
};

export default function BoredApp() {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<BoredActivity[]>([]);
    const [history, setHistory] = useState<BoredActivity[]>([]);
    const [activeTab, setActiveTab] = useState<'discover' | 'favorites' | 'history'>('discover');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('bored-favorites');
        const hist = localStorage.getItem('bored-history');
        if (saved) setFavorites(JSON.parse(saved));
        if (hist) setHistory(JSON.parse(hist));
    }, []);

    const { data: activity, loading, error, execute } = useAsync<BoredActivity>(
        async () => {
            const url = selectedType
                ? `https://www.boredapi.com/api/activity?type=${selectedType}`
                : 'https://www.boredapi.com/api/activity';
            return httpClient<BoredActivity>(url);
        },
        [selectedType]
    );

    useEffect(() => {
        if (activity && !loading) {
            setHistory(prev => {
                const newHist = [activity, ...prev.filter(a => a.key !== activity.key)].slice(0, 15);
                localStorage.setItem('bored-history', JSON.stringify(newHist));
                return newHist;
            });
        }
    }, [activity, loading]);

    const handleNewActivity = () => {
        setIsAnimating(true);
        execute();
        setTimeout(() => setIsAnimating(false), 500);
    };

    const toggleFavorite = (act: BoredActivity) => {
        const exists = favorites.find(f => f.key === act.key);
        const newFavs = exists ? favorites.filter(f => f.key !== act.key) : [act, ...favorites];
        setFavorites(newFavs);
        localStorage.setItem('bored-favorites', JSON.stringify(newFavs));
    };

    const isFavorite = (key: string) => favorites.some(f => f.key === key);
    const getColor = (type: string) => typeColors[type] || '#6366f1';

    const ActivityCard = ({ act }: { act: BoredActivity }) => (
        <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid var(--glass-border)',
            position: 'relative',
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: getColor(act.type), borderRadius: '20px 20px 0 0' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '50px', height: '50px',
                    background: `linear-gradient(135deg, ${getColor(act.type)}, ${getColor(act.type)}99)`,
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 8px 20px ${getColor(act.type)}30`,
                }}>
                    <Sparkles size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                    <span style={{
                        display: 'inline-block', padding: '0.2rem 0.6rem',
                        background: `${getColor(act.type)}20`, borderRadius: '50px',
                        color: getColor(act.type), fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                    }}>
                        {act.type}
                    </span>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginTop: '0.4rem' }}>
                        {act.activity}
                    </p>
                </div>
                <button onClick={() => toggleFavorite(act)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem' }}>
                    <Heart size={20} color={isFavorite(act.key) ? '#ec4899' : 'var(--text-tertiary)'} fill={isFavorite(act.key) ? '#ec4899' : 'transparent'} />
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <Users size={16} color="var(--primary)" />
                    <span className={styles.statValue}>{act.participants}</span>
                    <span className={styles.statLabel}>People</span>
                </div>
                <div className={styles.statItem}>
                    <DollarSign size={16} color="#22c55e" />
                    <span className={styles.statValue}>{act.price === 0 ? 'Free' : act.price < 0.5 ? 'Low' : 'High'}</span>
                    <span className={styles.statLabel}>Cost</span>
                </div>
                <div className={styles.statItem}>
                    <Target size={16} color="#f59e0b" />
                    <span className={styles.statValue}>{act.accessibility < 0.3 ? 'Easy' : act.accessibility < 0.6 ? 'Med' : 'Hard'}</span>
                    <span className={styles.statLabel}>Access</span>
                </div>
            </div>
            {act.link && (
                <a href={act.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '1rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 500 }}>
                    <ExternalLink size={14} /> Learn More
                </a>
            )}
        </div>
    );

    return (
        <div className={styles.appContainer}>
            {/* Tabs */}
            <div className={styles.tabs} style={{ marginBottom: '1rem' }}>
                {[
                    { id: 'discover', label: 'Discover', icon: Shuffle },
                    { id: 'favorites', label: `Favorites (${favorites.length})`, icon: Heart },
                    { id: 'history', label: 'History', icon: History },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}>
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'discover' && (
                <>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <button onClick={() => setSelectedType(null)} style={{ padding: '0.4rem 0.8rem', background: !selectedType ? 'var(--gradient-primary)' : 'var(--bg-secondary)', border: '1px solid', borderColor: !selectedType ? 'transparent' : 'var(--glass-border)', borderRadius: '50px', color: !selectedType ? 'white' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                            All
                        </button>
                        {activityTypes.map(type => (
                            <button key={type} onClick={() => setSelectedType(type)} style={{ padding: '0.4rem 0.8rem', background: selectedType === type ? getColor(type) : 'var(--bg-secondary)', border: '1px solid', borderColor: selectedType === type ? 'transparent' : 'var(--glass-border)', borderRadius: '50px', color: selectedType === type ? 'white' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>
                                {type}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className={styles.loading}><div className={styles.spinner} /><p>Finding activity...</p></div>
                    ) : error ? (
                        <div className={styles.error}><div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div><p>No activity found</p><button onClick={handleNewActivity} className={styles.actionBtn}><RefreshCw size={14} /> Try Again</button></div>
                    ) : activity ? (
                        <div style={{ animation: isAnimating ? 'slideUp 0.4s ease' : 'none' }}>
                            <ActivityCard act={activity} />
                            <div className={styles.actions} style={{ marginTop: '1rem' }}>
                                <button onClick={handleNewActivity} className={`${styles.actionBtn} ${styles.primaryBtn}`}><RefreshCw size={16} /> New Activity</button>
                                <button onClick={() => toggleFavorite(activity)} className={styles.actionBtn} style={{ background: isFavorite(activity.key) ? 'rgba(236,72,153,0.1)' : undefined, color: isFavorite(activity.key) ? '#ec4899' : undefined }}>
                                    <Heart size={16} fill={isFavorite(activity.key) ? '#ec4899' : 'transparent'} /> {isFavorite(activity.key) ? 'Saved' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </>
            )}

            {activeTab === 'favorites' && (
                favorites.length === 0 ? (
                    <div className={styles.emptyState}><div className={styles.emptyIcon}><Heart size={36} color="var(--primary)" /></div><p>No favorites yet</p><p className={styles.emptyHint}>Tap the heart to save activities!</p></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{favorites.map(f => <ActivityCard key={f.key} act={f} />)}</div>
                )
            )}

            {activeTab === 'history' && (
                history.length === 0 ? (
                    <div className={styles.emptyState}><div className={styles.emptyIcon}><History size={36} color="var(--primary)" /></div><p>No history yet</p><p className={styles.emptyHint}>Discover some activities!</p></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{history.length} viewed</span>
                            <button onClick={() => { setHistory([]); localStorage.removeItem('bored-history'); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><X size={14} /> Clear</button>
                        </div>
                        {history.map(h => <ActivityCard key={h.key} act={h} />)}
                    </div>
                )
            )}
        </div>
    );
}
