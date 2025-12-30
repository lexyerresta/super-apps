// ============================================
// SUPER APPS - OPTIMIZED HTTP CLIENT
// Best practices: Caching, Retry, Timeout, Deduplication
// ============================================

import { REQUEST_CONFIG } from '@/config/env.config';

interface FetchOptions extends RequestInit {
    timeout?: number;
    retries?: number;
}

// Request deduplication map - prevents duplicate concurrent requests
const pendingRequests = new Map<string, Promise<unknown>>();

// In-memory cache with TTL
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// ============================================
// CORE HTTP CLIENT
// ============================================
export async function httpClient<T>(
    url: string,
    options: FetchOptions = {}
): Promise<T> {
    const {
        timeout = REQUEST_CONFIG.TIMEOUT,
        retries = 0,
        ...fetchOptions
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }

            // Retry logic
            if (retries > 0) {
                await delay(REQUEST_CONFIG.RETRY_DELAY);
                return httpClient<T>(url, { ...options, retries: retries - 1 });
            }

            throw error;
        }

        throw new Error('An unexpected error occurred');
    }
}

// ============================================
// OPTIMIZED GET WITH CACHING & DEDUPLICATION
// ============================================
export async function get<T>(
    url: string,
    options?: FetchOptions & { ttl?: number }
): Promise<T> {
    const { ttl, ...fetchOptions } = options || {};
    const cacheKey = url;

    // Check cache first
    if (ttl) {
        const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.data;
        }
    }

    // Check for pending request (deduplication)
    if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey) as Promise<T>;
    }

    // Create new request
    const request = httpClient<T>(url, {
        ...fetchOptions,
        method: 'GET',
        retries: REQUEST_CONFIG.MAX_RETRIES
    }).then(data => {
        // Store in cache if ttl is provided
        if (ttl) {
            cache.set(cacheKey, { data, timestamp: Date.now(), ttl });
        }
        return data;
    }).finally(() => {
        pendingRequests.delete(cacheKey);
    });

    pendingRequests.set(cacheKey, request);
    return request;
}

// ============================================
// STALE-WHILE-REVALIDATE PATTERN
// Returns stale data immediately, then revalidates in background
// ============================================
export async function getWithSWR<T>(
    url: string,
    ttl: number,
    onRevalidate?: (data: T) => void
): Promise<T> {
    const cacheKey = url;
    const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;

    // Return stale data immediately if available
    if (cached) {
        // Check if stale (past TTL but still usable)
        if (Date.now() - cached.timestamp > cached.ttl) {
            // Revalidate in background
            get<T>(url, { ttl }).then(freshData => {
                onRevalidate?.(freshData);
            }).catch(() => {
                // Silent fail for background revalidation
            });
        }
        return cached.data;
    }

    // No cache, fetch fresh
    return get<T>(url, { ttl });
}

// ============================================
// BATCH REQUESTS - Parallel fetching with concurrency limit
// ============================================
export async function batchGet<T>(
    urls: string[],
    options?: FetchOptions & { ttl?: number; concurrency?: number }
): Promise<T[]> {
    const { concurrency = 5, ...fetchOptions } = options || {};
    const results: T[] = [];

    for (let i = 0; i < urls.length; i += concurrency) {
        const batch = urls.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map(url => get<T>(url, fetchOptions))
        );
        results.push(...batchResults);
    }

    return results;
}

// ============================================
// PREFETCH - Preload data in background
// ============================================
export function prefetch<T>(url: string, ttl: number): void {
    // Don't prefetch if already cached
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return;
    }

    // Prefetch in background with low priority
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            get<T>(url, { ttl }).catch(() => {
                // Silent fail for prefetch
            });
        });
    } else {
        setTimeout(() => {
            get<T>(url, { ttl }).catch(() => { });
        }, 100);
    }
}

// ============================================
// CACHE UTILITIES
// ============================================
export function clearCache(key?: string): void {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
}

export function getCacheSize(): number {
    return cache.size;
}

export function isCached(url: string): boolean {
    const entry = cache.get(url);
    if (!entry) return false;
    return Date.now() - entry.timestamp < entry.ttl;
}

// ============================================
// HELPER UTILITIES
// ============================================
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Exponential backoff delay
export function getBackoffDelay(attempt: number, baseDelay: number = 1000): number {
    return Math.min(baseDelay * Math.pow(2, attempt), 30000);
}
