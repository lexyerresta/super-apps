// ============================================
// SUPER APPS - TYPE DEFINITIONS
// ============================================

// App Category Types
export type AppCategory = 'all' | 'favorites' | 'productivity' | 'entertainment' | 'info' | 'fun' | 'finance' | 'utility';

// Badge Types
export interface AppBadge {
    type: 'new' | 'popular' | 'hot' | 'beta';
    text: string;
}

// Mini App Definition
export interface MiniApp {
    id: string;
    name: string;
    description: string;
    icon: string;
    gradient: string;
    category: AppCategory;
    badge?: AppBadge;
    component: string;
}

// Weather Types
export interface WeatherData {
    city: string;
    country: string;
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        weather_code: number;
        wind_speed_10m: number;
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
}

// Crypto Types
export interface CryptoData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
}

// Quote Types
export interface Quote {
    _id?: string;
    content: string;
    author: string;
    tags?: string[];
}

// News Types
export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    source: {
        name: string;
    };
    author?: string;
}

// Movie Types
export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
}

// Country Types
export interface Country {
    name: {
        common: string;
        official: string;
    };
    capital?: string[];
    region: string;
    subregion?: string;
    population: number;
    flags: {
        svg: string;
        png: string;
    };
    languages?: Record<string, string>;
    currencies?: Record<string, { name: string; symbol: string }>;
    timezones: string[];
    area: number;
}

// Joke Types
export interface Joke {
    id: number;
    type: 'single' | 'twopart';
    joke?: string;
    setup?: string;
    delivery?: string;
    category: string;
}

// Dictionary Types
export interface DictionaryEntry {
    word: string;
    phonetic?: string;
    phonetics: Array<{
        text?: string;
        audio?: string;
    }>;
    meanings: Array<{
        partOfSpeech: string;
        definitions: Array<{
            definition: string;
            example?: string;
            synonyms: string[];
            antonyms: string[];
        }>;
    }>;
}

// Random User Types
export interface RandomUser {
    name: {
        first: string;
        last: string;
    };
    email: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    location: {
        city: string;
        country: string;
    };
    phone: string;
    login: {
        uuid: string;
    };
}

// GitHub User Types
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    html_url: string;
}

// Trivia Types
export interface TriviaQuestion {
    category: string;
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

// NASA APOD Types
export interface NasaApod {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    date: string;
    copyright?: string;
}

// Pokemon Types
export interface Pokemon {
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
    types: Array<{
        type: {
            name: string;
        };
    }>;
    stats: Array<{
        base_stat: number;
        stat: {
            name: string;
        };
    }>;
    height: number;
    weight: number;
}

// Currency Exchange Types
export interface ExchangeRates {
    base: string;
    date: string;
    rates: Record<string, number>;
}

// API Response Types
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

// Modal State
export interface ModalState {
    isOpen: boolean;
    appId: string | null;
}

// Global App State
export interface AppState {
    searchQuery: string;
    activeCategory: AppCategory;
    favorites: string[];
    theme: 'dark' | 'light';
}
