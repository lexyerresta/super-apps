// API Endpoints configuration with fallback values
export const ENV = {
    OPEN_METEO_GEO: process.env.NEXT_PUBLIC_API_OPEN_METEO_GEO || 'https://geocoding-api.open-meteo.com/v1/search',
    OPEN_METEO_WEATHER: process.env.NEXT_PUBLIC_API_OPEN_METEO_WEATHER || 'https://api.open-meteo.com/v1/forecast',
    COINGECKO: process.env.NEXT_PUBLIC_API_COINGECKO || 'https://api.coingecko.com/api/v3',
    QUOTABLE: process.env.NEXT_PUBLIC_API_QUOTABLE || 'https://api.quotable.io',
    REST_COUNTRIES: process.env.NEXT_PUBLIC_API_REST_COUNTRIES || 'https://restcountries.com/v3.1',
    JOKE_API: process.env.NEXT_PUBLIC_API_JOKE || 'https://v2.jokeapi.dev/joke',
    DICTIONARY: process.env.NEXT_PUBLIC_API_DICTIONARY || 'https://api.dictionaryapi.dev/api/v2/entries/en',
    GITHUB: process.env.NEXT_PUBLIC_API_GITHUB || 'https://api.github.com',
    OPEN_TRIVIA: process.env.NEXT_PUBLIC_API_OPEN_TRIVIA || 'https://opentdb.com/api.php',
    POKEAPI: process.env.NEXT_PUBLIC_API_POKEAPI || 'https://pokeapi.co/api/v2',
    EXCHANGE_RATE: process.env.NEXT_PUBLIC_API_EXCHANGE_RATE || 'https://api.exchangerate-api.com/v4/latest',
} as const;

// Cache TTL configuration (in milliseconds)
export const CACHE_TTL = {
    SHORT: 60 * 1000,        // 1 minute (crypto)
    MEDIUM: 5 * 60 * 1000,   // 5 minutes (weather)
    LONG: 30 * 60 * 1000,    // 30 minutes (quotes, jokes)
    VERY_LONG: 60 * 60 * 1000, // 1 hour (countries, pokemon)
} as const;

// HTTP request configuration
export const REQUEST_CONFIG = {
    TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
} as const;

// SWR configuration
export const SWR_CONFIG = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 3,
} as const;
