'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { Telescope, Calendar, Download, ExternalLink, RefreshCw, AlertCircle, Sparkles, Info, Satellite, MapPin, Clock, Users, Orbit } from 'lucide-react';

interface APODData {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    date: string;
    media_type: 'image' | 'video';
    copyright?: string;
}

interface ISSPosition {
    latitude: string;
    longitude: string;
    timestamp: number;
}

interface AstronautData {
    people: { name: string; craft: string }[];
    number: number;
}

const NASA_API_KEY = 'mCfG5Sv31Ehv0KLKwkCfV2PPYx3N4CxvYtd7hYQ6';

export default function NasaApodApp() {
    const [activeTab, setActiveTab] = useState<'apod' | 'iss'>('apod');

    // APOD State
    const [apod, setApod] = useState<APODData | null>(null);
    const [apodLoading, setApodLoading] = useState(true);
    const [apodError, setApodError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
    const [showFullExplanation, setShowFullExplanation] = useState(false);

    // ISS State
    const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
    const [astronauts, setAstronauts] = useState<AstronautData | null>(null);
    const [issLoading, setIssLoading] = useState(false);
    const [issError, setIssError] = useState<string | null>(null);

    // Fetch APOD
    const fetchAPOD = async (date?: string) => {
        setApodLoading(true);
        setApodError(null);
        try {
            const dateParam = date ? `&date=${date}` : '';
            const response = await fetch(
                `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`
            );
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setApod(data);
        } catch {
            setApodError('Failed to load NASA picture. Try again later.');
        } finally {
            setApodLoading(false);
        }
    };

    // Fetch ISS Position
    const fetchISSPosition = useCallback(async () => {
        try {
            const response = await fetch('http://api.open-notify.org/iss-now.json');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setIssPosition({
                latitude: data.iss_position.latitude,
                longitude: data.iss_position.longitude,
                timestamp: data.timestamp,
            });
            setIssError(null);
        } catch {
            setIssError('Failed to load ISS position');
        }
    }, []);

    // Fetch Astronauts
    const fetchAstronauts = async () => {
        try {
            const response = await fetch('http://api.open-notify.org/astros.json');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setAstronauts(data);
        } catch {
            console.error('Failed to fetch astronauts');
        }
    };

    useEffect(() => {
        fetchAPOD(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        if (activeTab === 'iss') {
            setIssLoading(true);
            Promise.all([fetchISSPosition(), fetchAstronauts()]).finally(() => setIssLoading(false));

            // Update ISS position every 5 seconds
            const interval = setInterval(fetchISSPosition, 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab, fetchISSPosition]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        const today = new Date().toISOString().split('T')[0];
        if (newDate <= today && newDate >= '1995-06-16') {
            setSelectedDate(newDate);
        }
    };

    const downloadImage = () => {
        if (apod?.hdurl || apod?.url) {
            window.open(apod.hdurl || apod.url, '_blank');
        }
    };

    const getRandomDate = () => {
        const start = new Date('1995-06-16').getTime();
        const end = new Date().getTime();
        const random = new Date(start + Math.random() * (end - start));
        return random.toISOString().split('T')[0];
    };

    const formatCoordinate = (value: string, type: 'lat' | 'lon') => {
        const num = parseFloat(value);
        if (type === 'lat') {
            return `${Math.abs(num).toFixed(4)}° ${num >= 0 ? 'N' : 'S'}`;
        }
        return `${Math.abs(num).toFixed(4)}° ${num >= 0 ? 'E' : 'W'}`;
    };

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #1e3a5f, #4a90a4)' }}>
                    <Telescope size={24} />
                </div>
                <div>
                    <h2>NASA Explorer</h2>
                    <p>Astronomy Picture & ISS Tracker</p>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'apod' ? styles.active : ''}`}
                    onClick={() => setActiveTab('apod')}
                >
                    <Sparkles size={14} /> Picture of Day
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'iss' ? styles.active : ''}`}
                    onClick={() => setActiveTab('iss')}
                >
                    <Satellite size={14} /> ISS Tracker
                </button>
            </div>

            {/* APOD Tab */}
            {activeTab === 'apod' && (
                <>
                    {/* Date Picker */}
                    <div className={styles.flexBetween} style={{ gap: '0.75rem' }}>
                        <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12} /> Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                max={new Date().toISOString().split('T')[0]}
                                min="1995-06-16"
                                className={styles.input}
                            />
                        </div>
                        <button
                            onClick={() => setSelectedDate(getRandomDate())}
                            className={styles.iconButton}
                            style={{ alignSelf: 'flex-end' }}
                            title="Random date"
                        >
                            <Sparkles size={18} />
                        </button>
                        <button
                            onClick={() => fetchAPOD(selectedDate)}
                            className={styles.iconButton}
                            style={{ alignSelf: 'flex-end' }}
                            title="Refresh"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>

                    {/* APOD Content */}
                    {apodLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>Loading cosmic wonders...</p>
                        </div>
                    ) : apodError ? (
                        <div className={styles.error}>
                            <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                            <p>{apodError}</p>
                            <button onClick={() => fetchAPOD(selectedDate)} className={styles.actionBtn}>
                                <RefreshCw size={14} /> Try Again
                            </button>
                        </div>
                    ) : apod ? (
                        <div className={styles.flexColumn}>
                            {/* Image/Video */}
                            <div style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                            }}>
                                {apod.media_type === 'video' ? (
                                    <iframe
                                        src={apod.url}
                                        title={apod.title}
                                        style={{ width: '100%', height: '280px', border: 'none' }}
                                        allowFullScreen
                                    />
                                ) : (
                                    <img
                                        src={apod.url}
                                        alt={apod.title}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: '300px',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                )}
                            </div>

                            {/* Title & Date */}
                            <div>
                                <h3 style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '1.05rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                    lineHeight: 1.3,
                                }}>
                                    {apod.title}
                                </h3>
                                <div className={styles.flexBetween}>
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                                        📅 {new Date(apod.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    {apod.copyright && (
                                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                                            © {apod.copyright}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Explanation */}
                            <div style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                            }}>
                                <div className={styles.flexBetween} style={{ marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Info size={14} /> Explanation
                                    </span>
                                    <button
                                        onClick={() => setShowFullExplanation(!showFullExplanation)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--primary)',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {showFullExplanation ? 'Less' : 'More'}
                                    </button>
                                </div>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    lineHeight: 1.6,
                                    margin: 0,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: showFullExplanation ? 'unset' : 3,
                                    WebkitBoxOrient: 'vertical',
                                }}>
                                    {apod.explanation}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className={styles.buttonGroup}>
                                {apod.media_type === 'image' && (
                                    <button onClick={downloadImage} className={styles.primaryButton}>
                                        <Download size={16} /> HD Image
                                    </button>
                                )}
                                <a
                                    href={apod.hdurl || apod.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.secondaryButton}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <ExternalLink size={16} /> Full Size
                                </a>
                            </div>
                        </div>
                    ) : null}
                </>
            )}

            {/* ISS Tab */}
            {activeTab === 'iss' && (
                <>
                    {issLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>Tracking ISS...</p>
                        </div>
                    ) : issError ? (
                        <div className={styles.error}>
                            <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                            <p>{issError}</p>
                            <button onClick={fetchISSPosition} className={styles.actionBtn}>
                                <RefreshCw size={14} /> Try Again
                            </button>
                        </div>
                    ) : (
                        <div className={styles.flexColumn}>
                            {/* ISS Visual */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                                borderRadius: '20px',
                                padding: '2rem',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                {/* Stars background */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 50px 160px, white, transparent), radial-gradient(1.5px 1.5px at 90px 40px, white, transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 160px 120px, white, transparent)',
                                    opacity: 0.5,
                                }} />

                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto 1rem',
                                    background: 'linear-gradient(135deg, #4a90a4, #1e3a5f)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 40px rgba(74, 144, 164, 0.4)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    position: 'relative',
                                }}>
                                    <Satellite size={36} color="white" />
                                </div>

                                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                    International Space Station
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                                    Orbiting at ~408 km altitude • 7.66 km/s
                                </p>
                            </div>

                            {/* Position */}
                            {issPosition && (
                                <div className={styles.grid2}>
                                    <div className={styles.detailCard}>
                                        <MapPin size={20} color="var(--accent-green)" style={{ marginBottom: '0.5rem' }} />
                                        <p className={styles.detailCardLabel}>Latitude</p>
                                        <p className={styles.detailCardValue}>
                                            {formatCoordinate(issPosition.latitude, 'lat')}
                                        </p>
                                    </div>
                                    <div className={styles.detailCard}>
                                        <Orbit size={20} color="var(--accent-cyan)" style={{ marginBottom: '0.5rem' }} />
                                        <p className={styles.detailCardLabel}>Longitude</p>
                                        <p className={styles.detailCardValue}>
                                            {formatCoordinate(issPosition.longitude, 'lon')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Last Updated */}
                            {issPosition && (
                                <div className={styles.flexCenter} style={{ gap: '0.5rem' }}>
                                    <Clock size={14} color="var(--text-tertiary)" />
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                        Updated: {new Date(issPosition.timestamp * 1000).toLocaleTimeString()}
                                    </span>
                                    <span className={`${styles.badge} ${styles.success}`}>LIVE</span>
                                </div>
                            )}

                            {/* Astronauts */}
                            {astronauts && (
                                <div className={styles.formSection}>
                                    <h4 className={styles.sectionTitle}>
                                        <Users size={16} /> People in Space ({astronauts.number})
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {astronauts.people.map((person, i) => (
                                            <div key={i} className={styles.flexBetween} style={{
                                                padding: '0.75rem',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: '10px',
                                            }}>
                                                <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.85rem' }}>
                                                    👨‍🚀 {person.name}
                                                </span>
                                                <span className={`${styles.badge} ${person.craft === 'ISS' ? styles.primary : styles.warning}`}>
                                                    {person.craft}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* View on Map */}
                            {issPosition && (
                                <a
                                    href={`https://www.google.com/maps?q=${issPosition.latitude},${issPosition.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.primaryButton}
                                    style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
                                >
                                    <ExternalLink size={16} /> View on Google Maps
                                </a>
                            )}

                            {/* Info */}
                            <div className={styles.infoBox}>
                                🛰️ The ISS completes 16 orbits per day. Position updates every 5 seconds.
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
