'use client';

import React, { useState, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { useAsync } from '@/hooks';
import { WeatherService } from '@/services/api.service';
import type { WeatherData } from '@/types';
import {
    Search, Sun, Cloud, CloudRain, Snowflake, Wind,
    Thermometer, Droplets, MapPin, AlertCircle, RefreshCw
} from 'lucide-react';

export default function WeatherApp() {
    const [city, setCity] = useState('Jakarta');
    const [searchInput, setSearchInput] = useState('');

    const fetchWeather = useCallback(
        () => WeatherService.getWeatherByCity(city),
        [city]
    );

    const { data: weather, loading, error, execute } = useAsync<WeatherData | null>(
        fetchWeather,
        [city]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setCity(searchInput.trim());
            setSearchInput('');
        }
    };

    const getWeatherIcon = (code: number, size = 48) => {
        if (code === 0) return <Sun size={size} color="#f59e0b" />;
        if (code <= 3) return <Cloud size={size} color="#94a3b8" />;
        if (code <= 67) return <CloudRain size={size} color="#3b82f6" />;
        if (code <= 77) return <Snowflake size={size} color="#06b6d4" />;
        return <CloudRain size={size} color="#3b82f6" />;
    };

    const getWeatherDescription = (code: number): string => {
        if (code === 0) return 'Clear sky';
        if (code <= 3) return 'Partly cloudy';
        if (code <= 48) return 'Foggy';
        if (code <= 67) return 'Rainy';
        if (code <= 77) return 'Snowy';
        if (code <= 82) return 'Rain showers';
        if (code >= 95) return 'Thunderstorm';
        return 'Mixed conditions';
    };

    const getDayName = (dateStr: string, index: number): string => {
        if (index === 0) return 'Today';
        if (index === 1) return 'Tomorrow';
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    };

    const popularCities = ['Tokyo', 'Singapore', 'London', 'New York', 'Sydney'];

    return (
        <div className={styles.appContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search city..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                    <Search size={18} />
                </button>
            </form>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {popularCities.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCity(c)}
                        style={{
                            padding: '0.375rem 0.75rem',
                            background: city === c ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                            border: '1px solid',
                            borderColor: city === c ? 'transparent' : 'var(--glass-border)',
                            borderRadius: '50px',
                            color: city === c ? 'white' : 'var(--text-tertiary)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Fetching weather data...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <div className={styles.errorIcon}>
                        <AlertCircle size={28} color="white" />
                    </div>
                    <p>City not found or network error</p>
                    <button onClick={execute} className={styles.actionBtn}>
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            ) : weather ? (
                <>
                    <div className={styles.weatherMain}>
                        <div className={styles.weatherIcon}>
                            {getWeatherIcon(weather.current.weather_code)}
                        </div>
                        <div className={styles.weatherInfo}>
                            <div className={styles.temperature}>
                                {Math.round(weather.current.temperature_2m)}°C
                            </div>
                            <div className={styles.location}>
                                <MapPin size={16} />
                                {weather.city}, {weather.country}
                            </div>
                            <div className={styles.condition}>
                                {getWeatherDescription(weather.current.weather_code)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.weatherDetails}>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Thermometer size={20} color="var(--accent-purple)" />
                            </div>
                            <span className={styles.detailLabel}>Feels like</span>
                            <span className={styles.detailValue}>
                                {Math.round(weather.current.apparent_temperature)}°C
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Droplets size={20} color="var(--accent-cyan)" />
                            </div>
                            <span className={styles.detailLabel}>Humidity</span>
                            <span className={styles.detailValue}>
                                {weather.current.relative_humidity_2m}%
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Wind size={20} color="var(--accent-blue)" />
                            </div>
                            <span className={styles.detailLabel}>Wind</span>
                            <span className={styles.detailValue}>
                                {Math.round(weather.current.wind_speed_10m)} km/h
                            </span>
                        </div>
                    </div>

                    <div className={styles.forecast}>
                        <h4 className={styles.forecastTitle}>7-Day Forecast</h4>
                        <div className={styles.forecastList}>
                            {weather.daily.time.slice(0, 7).map((date, index) => (
                                <div key={date} className={styles.forecastItem}>
                                    <span className={styles.forecastDay}>{getDayName(date, index)}</span>
                                    <span className={styles.forecastIcon}>
                                        {getWeatherIcon(weather.daily.weather_code[index], 24)}
                                    </span>
                                    <span className={styles.forecastTemp}>
                                        <span className={styles.tempHigh}>
                                            {Math.round(weather.daily.temperature_2m_max[index])}°
                                        </span>
                                        <span className={styles.tempLow}>
                                            {Math.round(weather.daily.temperature_2m_min[index])}°
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Cloud size={36} color="var(--primary)" />
                    </div>
                    <p>Search for a city to see weather</p>
                </div>
            )}
        </div>
    );
}
