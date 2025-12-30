'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { httpClient } from '@/lib/http-client';
import { Search, Zap, Heart, Shield, Swords, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: { type: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
    height: number;
    weight: number;
    abilities: { ability: { name: string } }[];
}

const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

export default function PokemonApp() {
    const [searchId, setSearchId] = useState(25);
    const [inputValue, setInputValue] = useState('');

    const { data: pokemon, loading, error, execute } = useAsync<Pokemon>(
        () => httpClient<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${searchId}`),
        [searchId]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const value = inputValue.trim().toLowerCase();
        if (value) {
            setSearchId(parseInt(value) || value as unknown as number);
        }
    };

    const navigate = (direction: 'prev' | 'next') => {
        if (typeof searchId === 'number') {
            const newId = direction === 'prev' ? Math.max(1, searchId - 1) : searchId + 1;
            setSearchId(newId);
        }
    };

    const getStatIcon = (statName: string) => {
        switch (statName) {
            case 'hp': return <Heart size={14} />;
            case 'attack': return <Swords size={14} />;
            case 'defense': return <Shield size={14} />;
            case 'speed': return <Zap size={14} />;
            default: return null;
        }
    };

    const primaryType = pokemon?.types[0]?.type.name || 'normal';
    const primaryColor = typeColors[primaryType];

    return (
        <div className={styles.appContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search by name or ID..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                    <Search size={18} />
                </button>
            </form>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Loading Pokémon...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                    <p>Pokémon not found</p>
                </div>
            ) : pokemon ? (
                <div style={{
                    background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}40)`,
                    border: `1px solid ${primaryColor}50`,
                    borderRadius: '24px',
                    padding: '1.5rem',
                    position: 'relative',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{
                                color: 'var(--text-tertiary)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                            }}>
                                #{String(pokemon.id).padStart(3, '0')}
                            </span>
                            <h2 style={{
                                color: 'var(--text-primary)',
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                textTransform: 'capitalize',
                            }}>
                                {pokemon.name}
                            </h2>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {pokemon.types.map((t) => (
                                    <span
                                        key={t.type.name}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            background: typeColors[t.type.name],
                                            borderRadius: '50px',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {t.type.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <img
                            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                            alt={pokemon.name}
                            style={{ width: '140px', height: '140px', objectFit: 'contain' }}
                        />
                    </div>

                    <div className={styles.statsGrid} style={{ marginTop: '1rem' }}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{(pokemon.height / 10).toFixed(1)}m</span>
                            <span className={styles.statLabel}>Height</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{(pokemon.weight / 10).toFixed(1)}kg</span>
                            <span className={styles.statLabel}>Weight</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue} style={{ textTransform: 'capitalize' }}>
                                {pokemon.abilities[0]?.ability.name.replace('-', ' ')}
                            </span>
                            <span className={styles.statLabel}>Ability</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Base Stats</p>
                        {pokemon.stats.slice(0, 4).map((stat) => (
                            <div key={stat.stat.name} style={{ marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                                        {getStatIcon(stat.stat.name)} {stat.stat.name.replace('-', ' ')}
                                    </span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8rem' }}>{stat.base_stat}</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.min(100, (stat.base_stat / 150) * 100)}%`,
                                        height: '100%',
                                        background: primaryColor,
                                        borderRadius: '3px',
                                        transition: 'width 0.3s ease',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.actions} style={{ marginTop: '1rem' }}>
                        <button onClick={() => navigate('prev')} className={styles.actionBtn} disabled={searchId === 1}>
                            <ChevronLeft size={18} /> Prev
                        </button>
                        <button onClick={() => navigate('next')} className={styles.actionBtn}>
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
