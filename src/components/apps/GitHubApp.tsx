'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { Search, Users, MapPin, Building, Link as LinkIcon, Calendar, GitFork, Star, AlertCircle, ExternalLink } from 'lucide-react';

interface GitHubUser {
    login: string;
    avatar_url: string;
    name: string | null;
    bio: string | null;
    location: string | null;
    company: string | null;
    blog: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    html_url: string;
}

export default function GitHubApp() {
    const [username, setUsername] = useState('');
    const [searchedUser, setSearchedUser] = useState('');

    const fetchUser = async () => {
        if (!searchedUser) return null;
        return httpClient<GitHubUser>(`https://api.github.com/users/${searchedUser}`);
    };

    const { data: user, loading, error } = useAsync<GitHubUser | null>(
        fetchUser,
        [searchedUser]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            setSearchedUser(username.trim().toLowerCase());
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className={styles.appContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                    <Search size={18} />
                </button>
            </form>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Searching user...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                    <p>User not found</p>
                </div>
            ) : user ? (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid var(--glass-border)',
                    animation: 'slideUp 0.3s ease',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <img
                            src={user.avatar_url}
                            alt={user.login}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '3px solid var(--primary)',
                            }}
                        />
                        <div>
                            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>
                                {user.name || user.login}
                            </h2>
                            <a
                                href={user.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                @{user.login} <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>

                    {user.bio && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                            {user.bio}
                        </p>
                    )}

                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <GitFork size={20} color="var(--primary)" />
                            <span className={styles.statValue}>{user.public_repos}</span>
                            <span className={styles.statLabel}>Repos</span>
                        </div>
                        <div className={styles.statItem}>
                            <Users size={20} color="var(--accent-cyan)" />
                            <span className={styles.statValue}>{user.followers}</span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.statItem}>
                            <Star size={20} color="var(--accent-yellow)" />
                            <span className={styles.statValue}>{user.following}</span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {user.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <MapPin size={16} /> {user.location}
                            </div>
                        )}
                        {user.company && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <Building size={16} /> {user.company}
                            </div>
                        )}
                        {user.blog && (
                            <a
                                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.875rem' }}
                            >
                                <LinkIcon size={16} /> {user.blog}
                            </a>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                            <Calendar size={14} /> Joined {formatDate(user.created_at)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Search size={36} color="var(--primary)" />
                    </div>
                    <p>Search for a GitHub user</p>
                    <p className={styles.emptyHint}>View their profile, repos, and stats</p>
                </div>
            )}
        </div>
    );
}
