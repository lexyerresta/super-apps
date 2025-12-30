'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { httpClient } from '@/lib/http-client';
import { Search, MapPin, Users, Globe, Landmark, Languages, Coins, AlertCircle, ArrowLeft, Map, SquareStack } from 'lucide-react';

interface Country {
    name: { common: string; official: string };
    capital?: string[];
    region: string;
    subregion?: string;
    population: number;
    flags: { png: string; svg: string };
    languages?: Record<string, string>;
    currencies?: Record<string, { name: string; symbol: string }>;
    area: number;
}

export default function CountriesApp() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                // REST Countries API has ~10 field limit - fetch only essential fields for list
                const data = await httpClient<Country[]>('https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,languages,currencies,area');
                setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
            } catch (err) {
                setError('Failed to load countries');
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    const regions = ['all', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

    const filteredCountries = countries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.capital?.[0]?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    const formatPopulation = (pop: number) => {
        if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(2) + ' Billion';
        if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + ' Million';
        if (pop >= 1_000) return (pop / 1_000).toFixed(1) + 'K';
        return pop.toLocaleString();
    };

    const formatArea = (area: number) => {
        if (area >= 1_000_000) return (area / 1_000_000).toFixed(2) + ' M km²';
        if (area >= 1_000) return (area / 1_000).toFixed(1) + 'K km²';
        return area.toLocaleString() + ' km²';
    };

    if (loading) {
        return (
            <div className={styles.appContainer}>
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Exploring the world...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.appContainer}>
                <div className={styles.error}>
                    <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #14b8a6, #06b6d4)' }}>
                    <Globe size={24} />
                </div>
                <div>
                    <h2>World Atlas</h2>
                    <p>Explore 250+ countries</p>
                </div>
            </div>

            {selectedCountry ? (
                /* Country Detail View */
                <div className={styles.flexColumn}>
                    <button
                        onClick={() => setSelectedCountry(null)}
                        className={styles.secondaryButton}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        <ArrowLeft size={16} /> Back to list
                    </button>

                    {/* Country Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(6, 182, 212, 0.08))',
                        border: '1px solid rgba(20, 184, 166, 0.2)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Flag Background */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '150px',
                            height: '100%',
                            background: `url(${selectedCountry.flags.svg}) no-repeat center`,
                            backgroundSize: 'cover',
                            opacity: 0.1,
                            filter: 'blur(2px)',
                        }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                            <img
                                src={selectedCountry.flags.svg}
                                alt={selectedCountry.name.common}
                                style={{
                                    width: '90px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                }}
                            />
                            <div>
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                    {selectedCountry.name.common}
                                </h3>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                                    {selectedCountry.name.official}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className={styles.grid2}>
                        <div className={`${styles.detailCard} ${styles.highlight}`}>
                            <Users size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                            <p className={styles.detailCardLabel}>Population</p>
                            <p className={styles.detailCardValue}>{formatPopulation(selectedCountry.population)}</p>
                        </div>
                        <div className={styles.detailCard}>
                            <Map size={20} color="var(--accent-cyan)" style={{ marginBottom: '0.5rem' }} />
                            <p className={styles.detailCardLabel}>Area</p>
                            <p className={styles.detailCardValue}>{formatArea(selectedCountry.area)}</p>
                        </div>
                        <div className={styles.detailCard}>
                            <Globe size={20} color="var(--accent-green)" style={{ marginBottom: '0.5rem' }} />
                            <p className={styles.detailCardLabel}>Region</p>
                            <p className={styles.detailCardValue}>{selectedCountry.region}</p>
                        </div>
                        <div className={styles.detailCard}>
                            <Landmark size={20} color="var(--accent-purple)" style={{ marginBottom: '0.5rem' }} />
                            <p className={styles.detailCardLabel}>Capital</p>
                            <p className={styles.detailCardValue}>{selectedCountry.capital?.[0] || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className={styles.formSection}>
                        <h4 className={styles.sectionTitle}>
                            <SquareStack size={16} /> Details
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {selectedCountry.subregion && (
                                <div className={styles.flexBetween}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Subregion</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedCountry.subregion}</span>
                                </div>
                            )}
                            {selectedCountry.languages && (
                                <div className={styles.flexBetween}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Languages size={14} /> Languages
                                    </span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                                        {Object.values(selectedCountry.languages).slice(0, 3).join(', ')}
                                        {Object.values(selectedCountry.languages).length > 3 && ` +${Object.values(selectedCountry.languages).length - 3} more`}
                                    </span>
                                </div>
                            )}
                            {selectedCountry.currencies && (
                                <div className={styles.flexBetween}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Coins size={14} /> Currency
                                    </span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                        {Object.values(selectedCountry.currencies).map(c => `${c.name} (${c.symbol})`).slice(0, 2).join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <div className={styles.flexColumn}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by country or capital..."
                            className={styles.input}
                            style={{ paddingLeft: '2.75rem' }}
                        />
                    </div>

                    {/* Region Filter */}
                    <div className={styles.presetsContainer}>
                        {regions.map(region => (
                            <button
                                key={region}
                                onClick={() => setSelectedRegion(region)}
                                className={`${styles.presetButton} ${selectedRegion === region ? styles.active : ''}`}
                            >
                                {region === 'all' ? '🌍 All' : region}
                            </button>
                        ))}
                    </div>

                    {/* Countries List */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        maxHeight: '400px',
                        overflowY: 'auto',
                    }}>
                        {filteredCountries.slice(0, 50).map(country => (
                            <div
                                key={country.name.common}
                                onClick={() => setSelectedCountry(country)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.875rem 1rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <img
                                    src={country.flags.svg}
                                    alt={country.name.common}
                                    style={{
                                        width: '44px',
                                        height: '30px',
                                        objectFit: 'cover',
                                        borderRadius: '6px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        color: 'var(--text-primary)',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {country.name.common}
                                    </p>
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MapPin size={10} /> {country.capital?.[0] || 'No capital'}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                                        {formatPopulation(country.population).split(' ')[0]}
                                    </p>
                                    <span className={`${styles.badge} ${styles.primary}`} style={{ fontSize: '0.6rem' }}>
                                        {country.region}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className={styles.infoBox}>
                        🌍 Showing {Math.min(filteredCountries.length, 50)} of {filteredCountries.length} countries
                        {selectedRegion !== 'all' && ` in ${selectedRegion}`}
                    </div>
                </div>
            )}
        </div>
    );
}
