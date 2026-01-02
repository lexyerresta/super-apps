import { MiniApp } from '@/types';

export const MINI_APPS: MiniApp[] = [
    // Info & Content
    {
        id: 'news-headlines',
        name: 'News',
        description: 'Latest news headlines by category',
        icon: 'newspaper',
        gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        category: 'info',
        badge: { type: 'popular', text: 'Popular' },
        component: 'NewsApp',
    },
    {
        id: 'movie-db',
        name: 'Movies',
        description: 'Search movies and TV shows',
        icon: 'film',
        gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
        category: 'entertainment',
        badge: { type: 'new', text: 'New' },
        component: 'MovieDatabaseApp',
    },
    {
        id: 'book-search',
        name: 'Books',
        description: 'Search books from Open Library',
        icon: 'book-open',
        gradient: 'linear-gradient(135deg, #f59e0b, #eab308)',
        category: 'info',
        badge: { type: 'new', text: 'New' },
        component: 'BookSearchApp',
    },
    {
        id: 'wikipedia',
        name: 'Wikipedia',
        description: 'Search Wikipedia articles',
        icon: 'globe',
        gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
        category: 'info',
        badge: { type: 'new', text: 'New' },
        component: 'WikipediaApp',
    },
    {
        id: 'dev-community',
        name: 'DEV Community',
        description: 'Developer articles & discussions from dev.to',
        icon: 'code',
        gradient: 'linear-gradient(135deg, #3B49DF, #6366F1)',
        category: 'info',
        badge: { type: 'popular', text: 'Popular' },
        component: 'DevCommunityApp',
    },
    {
        id: 'dictionary',
        name: 'Dictionary',
        description: 'Look up words with definitions & audio',
        icon: 'book-open',
        gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
        category: 'info',
        component: 'DictionaryApp',
    },
    {
        id: 'countries',
        name: 'World Atlas',
        description: 'Explore 250+ countries with detailed info',
        icon: 'globe',
        gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
        category: 'info',
        component: 'CountriesApp',
    },
    {
        id: 'quotes',
        name: 'Daily Quotes',
        description: 'Inspirational quotes with save feature',
        icon: 'quote',
        gradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
        category: 'info',
        component: 'QuotesApp',
    },


    // Finance & Data
    {
        id: 'weather',
        name: 'Weather',
        description: 'Real-time weather forecast with 7-day predictions',
        icon: 'cloud-sun',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        category: 'productivity',
        badge: { type: 'popular', text: 'Popular' },
        component: 'WeatherApp',
    },
    {
        id: 'crypto',
        name: 'Crypto Tracker',
        description: 'Top 20 cryptocurrencies with live prices',
        icon: 'trending-up',
        gradient: 'linear-gradient(135deg, #f7931a, #f59e0b)',
        category: 'finance',
        badge: { type: 'popular', text: 'Popular' },
        component: 'CryptoApp',
    },
    {
        id: 'stock-market',
        name: 'Stock Market',
        description: 'Live stock prices and market data',
        icon: 'trending-up',
        gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
        category: 'finance',
        badge: { type: 'hot', text: 'Hot' },
        component: 'StockMarketApp',
    },
    {
        id: 'currency',
        name: 'Currency Exchange',
        description: 'Live exchange rates for 150+ currencies',
        icon: 'banknote',
        gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
        category: 'finance',
        component: 'CurrencyApp',
    },
    {
        id: 'npm-search',
        name: 'NPM Search',
        description: 'Search NPM packages',
        icon: 'package',
        gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
        category: 'utility',
        badge: { type: 'new', text: 'New' },
        component: 'NPMSearchApp',
    },
    {
        id: 'github',
        name: 'GitHub Finder',
        description: 'Search GitHub users and profiles',
        icon: 'github',
        gradient: 'linear-gradient(135deg, #374151, #1f2937)',
        category: 'productivity',
        component: 'GitHubApp',
    },



    // Productivity



];

export const CATEGORIES = [
    { id: 'all', name: 'All Apps', icon: 'grid' },
    { id: 'productivity', name: 'Productivity', icon: 'briefcase' },
    { id: 'finance', name: 'Finance', icon: 'dollar-sign' },
    { id: 'entertainment', name: 'Entertainment', icon: 'tv' },
    { id: 'info', name: 'Information', icon: 'info' },
    { id: 'fun', name: 'Fun', icon: 'smile' },
    { id: 'utility', name: 'Utilities', icon: 'tool' },
] as const;
