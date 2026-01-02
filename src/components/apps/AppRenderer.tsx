'use client';

import React, { Suspense, lazy } from 'react';
import styles from './MiniApps.module.css';
import { Loader2 } from 'lucide-react';


const WeatherApp = lazy(() => import('./WeatherApp'));
const CryptoApp = lazy(() => import('./CryptoApp'));
const QuotesApp = lazy(() => import('./QuotesApp'));
const CountriesApp = lazy(() => import('./CountriesApp'));

const CurrencyApp = lazy(() => import('./CurrencyApp'));
const DictionaryApp = lazy(() => import('./DictionaryApp'));
const GitHubApp = lazy(() => import('./GitHubApp'));
const ProductSearchApp = lazy(() => import('./ProductSearchApp'));
const NPMSearchApp = lazy(() => import('./NPMSearchApp'));
const NewsApp = lazy(() => import('./NewsApp'));
const MovieDatabaseApp = lazy(() => import('./MovieDatabaseApp'));
const BookSearchApp = lazy(() => import('./BookSearchApp'));
const WikipediaApp = lazy(() => import('./WikipediaApp'));
const DevCommunityApp = lazy(() => import('./DevCommunityApp'));


const appComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {

    WeatherApp,
    CryptoApp,
    QuotesApp,
    CountriesApp,

    CurrencyApp,
    DictionaryApp,
    GitHubApp,

    ProductSearchApp,
    NPMSearchApp,
    NewsApp,
    MovieDatabaseApp,
    BookSearchApp,
    WikipediaApp,
    DevCommunityApp,



};

function LoadingFallback() {
    return (
        <div className={styles.loading}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <p>Loading...</p>
        </div>
    );
}

interface AppRendererProps {
    componentName: string;
}

export default function AppRenderer({ componentName }: AppRendererProps) {
    const Component = appComponents[componentName];

    if (!Component) {
        return (
            <div className={styles.error}>
                <p>App not found</p>
            </div>
        );
    }

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Component />
        </Suspense>
    );
}
