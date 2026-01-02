import { ENV, CACHE_TTL } from '@/config/env.config';
import { get, getWithSWR, prefetch } from '@/lib/http-client';
import type {
    WeatherData,
    GeoLocation,
    CryptoData,
    Quote,
    Country,
    Joke,
    DictionaryEntry,
    GitHubUser,
    TriviaQuestion,
    Pokemon,
    ExchangeRates,
} from '@/types';

/**
 * Weather-related API services
 */
export const WeatherService = {
    async searchCity(cityName: string): Promise<GeoLocation | null> {
        const data = await get<{ results?: GeoLocation[] }>(
            `${ENV.OPEN_METEO_GEO}?name=${encodeURIComponent(cityName)}&count=1`,
            { ttl: CACHE_TTL.LONG }
        );
        return data.results?.[0] || null;
    },

    async getWeather(lat: number, lon: number) {
        return get<{ current: WeatherData['current']; daily: WeatherData['daily'] }>(
            `${ENV.OPEN_METEO_WEATHER}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
            { ttl: CACHE_TTL.MEDIUM }
        );
    },

    async getWeatherByCity(cityName: string): Promise<WeatherData | null> {
        const location = await this.searchCity(cityName);
        if (!location) return null;

        const weatherData = await this.getWeather(location.latitude, location.longitude);
        return {
            city: location.name,
            country: location.country,
            current: weatherData.current,
            daily: weatherData.daily,
        };
    },

    prefetchPopularCities(): void {
        const cities = ['Jakarta', 'Singapore', 'Tokyo', 'London', 'New York'];
        cities.forEach(city => {
            prefetch(`${ENV.OPEN_METEO_GEO}?name=${encodeURIComponent(city)}&count=1`, CACHE_TTL.LONG);
        });
    },
};

/**
 * Cryptocurrency API services
 */
export const CryptoService = {
    async getTopCryptos(limit: number = 20): Promise<CryptoData[]> {
        return getWithSWR<CryptoData[]>(
            `${ENV.COINGECKO}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
            CACHE_TTL.SHORT
        );
    },

    async getCryptoById(id: string): Promise<CryptoData> {
        return get<CryptoData>(
            `${ENV.COINGECKO}/coins/${id}`,
            { ttl: CACHE_TTL.SHORT }
        );
    },

    prefetchTopCryptos(): void {
        prefetch(
            `${ENV.COINGECKO}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`,
            CACHE_TTL.SHORT
        );
    },
};

/**
 * Quotes API services
 */
export const QuotesService = {
    async getRandomQuote(): Promise<Quote> {
        try {
            return await get<Quote>(`${ENV.QUOTABLE}/random`, { ttl: 0 });
        } catch {
            const fallbacks: Quote[] = [
                { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
                { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
                { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            ];
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }
    },

    async getQuotesByTag(tag: string): Promise<Quote[]> {
        const data = await get<{ results: Quote[] }>(
            `${ENV.QUOTABLE}/quotes?tags=${encodeURIComponent(tag)}&limit=10`,
            { ttl: CACHE_TTL.LONG }
        );
        return data.results;
    },
};

/**
 * Country data API services
 */
export const CountriesService = {
    async getAllCountries(): Promise<Country[]> {
        return get<Country[]>(
            `${ENV.REST_COUNTRIES}/all?fields=name,capital,region,subregion,population,flags,languages,currencies,timezones,area`,
            { ttl: CACHE_TTL.VERY_LONG }
        );
    },

    async searchCountry(query: string): Promise<Country[]> {
        return get<Country[]>(
            `${ENV.REST_COUNTRIES}/name/${encodeURIComponent(query)}`,
            { ttl: CACHE_TTL.VERY_LONG }
        );
    },

    async getCountryByCode(code: string): Promise<Country> {
        const data = await get<Country[]>(
            `${ENV.REST_COUNTRIES}/alpha/${code}`,
            { ttl: CACHE_TTL.VERY_LONG }
        );
        return data[0];
    },

    prefetchCountries(): void {
        prefetch(
            `${ENV.REST_COUNTRIES}/all?fields=name,capital,region,subregion,population,flags,languages,currencies,timezones,area`,
            CACHE_TTL.VERY_LONG
        );
    },
};

/**
 * Dictionary API services
 */
export const DictionaryService = {
    async lookupWord(word: string): Promise<DictionaryEntry[]> {
        return get<DictionaryEntry[]>(
            `${ENV.DICTIONARY}/${encodeURIComponent(word)}`,
            { ttl: CACHE_TTL.VERY_LONG }
        );
    },
};

/**
 * GitHub API services
 */
export const GitHubService = {
    async getUser(username: string): Promise<GitHubUser> {
        return get<GitHubUser>(
            `${ENV.GITHUB}/users/${encodeURIComponent(username)}`,
            { ttl: CACHE_TTL.MEDIUM }
        );
    },

    async searchUsers(query: string): Promise<{ items: GitHubUser[] }> {
        return get<{ items: GitHubUser[] }>(
            `${ENV.GITHUB}/search/users?q=${encodeURIComponent(query)}&per_page=10`,
            { ttl: CACHE_TTL.MEDIUM }
        );
    },
};

/**
 * Exchange Rate API services
 */
export const ExchangeRateService = {
    async getRates(base: string = 'USD'): Promise<ExchangeRates> {
        return get<ExchangeRates>(
            `${ENV.EXCHANGE_RATE}/${base}`,
            { ttl: CACHE_TTL.MEDIUM }
        );
    },

    async convert(amount: number, from: string, to: string): Promise<number> {
        const rates = await this.getRates(from);
        return amount * (rates.rates[to] || 0);
    },
};

/**
 * Warm up cache by prefetching critical data
 */
export function prefetchCriticalData(): void {
    if (typeof window === 'undefined') return;

    const prefetchFn = () => {
        CryptoService.prefetchTopCryptos();
        CountriesService.prefetchCountries();
        WeatherService.prefetchPopularCities();
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(prefetchFn);
    } else {
        setTimeout(prefetchFn, 1000);
    }
}
