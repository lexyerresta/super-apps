// API Endpoints configuration with fallback values
export const ENV = {
    OPEN_METEO_GEO: process.env.NEXT_PUBLIC_API_OPEN_METEO_GEO || 'https://geocoding-api.open-meteo.com/v1/search',
    OPEN_METEO_WEATHER: process.env.NEXT_PUBLIC_API_OPEN_METEO_WEATHER || 'https://api.open-meteo.com/v1/forecast',
    COINGECKO: process.env.NEXT_PUBLIC_API_COINGECKO || 'https://api.coingecko.com/api/v3',
    QUOTABLE: process.env.NEXT_PUBLIC_API_QUOTABLE || 'https://api.quotable.io',
    REST_COUNTRIES: process.env.NEXT_PUBLIC_API_REST_COUNTRIES || 'https://restcountries.com/v3.1',
    JOKE_API: process.env.NEXT_PUBLIC_API_JOKE || 'https://v2.jokeapi.dev/joke',
    DICTIONARY: process.env.NEXT_PUBLIC_API_DICTIONARY || 'https://api.dictionaryapi.dev/api/v2/entries/en',
    RANDOM_USER: process.env.NEXT_PUBLIC_API_RANDOM_USER || 'https://randomuser.me/api',
    GITHUB: process.env.NEXT_PUBLIC_API_GITHUB || 'https://api.github.com',
    OPEN_TRIVIA: process.env.NEXT_PUBLIC_API_OPEN_TRIVIA || 'https://opentdb.com/api.php',
    POKEAPI: process.env.NEXT_PUBLIC_API_POKEAPI || 'https://pokeapi.co/api/v2',
    EXCHANGE_RATE: process.env.NEXT_PUBLIC_API_EXCHANGE_RATE || 'https://api.exchangerate-api.com/v4/latest',
    CAT_FACTS: process.env.NEXT_PUBLIC_API_CAT_FACTS || 'https://catfact.ninja/fact',
    DOG_API: process.env.NEXT_PUBLIC_API_DOG || 'https://dog.ceo/api/breeds/image/random',
    ADVICE_API: process.env.NEXT_PUBLIC_API_ADVICE || 'https://api.adviceslip.slip/advice',
    BORED_API: process.env.NEXT_PUBLIC_API_BORED || 'https://www.boredapi.com/api/activity',
    QR_CODE: process.env.NEXT_PUBLIC_API_QR_CODE || 'https://api.qrserver.com/v1/create-qr-code',
    IP_API: process.env.NEXT_PUBLIC_API_IP || 'https://ipapi.co/json',
    COLOR_API: process.env.NEXT_PUBLIC_API_COLOR || 'https://www.thecolorapi.com',
    NASA_API_KEY: process.env.NEXT_PUBLIC_NASA_API_KEY || 'mCfG5Sv31Ehv0KLKwkCfV2PPYx3N4CxvYtd7hYQ6',
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
