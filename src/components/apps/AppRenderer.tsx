'use client';

import React, { Suspense, lazy } from 'react';
import styles from './MiniApps.module.css';
import { Loader2 } from 'lucide-react';

const TodoListApp = lazy(() => import('./TodoListApp'));
const ExpenseTrackerApp = lazy(() => import('./ExpenseTrackerApp'));
const WeatherApp = lazy(() => import('./WeatherApp'));
const CryptoApp = lazy(() => import('./CryptoApp'));
const QuotesApp = lazy(() => import('./QuotesApp'));
const JokesApp = lazy(() => import('./JokesApp'));
const CountriesApp = lazy(() => import('./CountriesApp'));
const QRCodeApp = lazy(() => import('./QRCodeApp'));
const PokemonApp = lazy(() => import('./PokemonApp'));
const CurrencyApp = lazy(() => import('./CurrencyApp'));
const DogGalleryApp = lazy(() => import('./DogGalleryApp'));
const CatFactsApp = lazy(() => import('./CatFactsApp'));
const DictionaryApp = lazy(() => import('./DictionaryApp'));
const GitHubApp = lazy(() => import('./GitHubApp'));
const NotesApp = lazy(() => import('./NotesApp'));
const TriviaApp = lazy(() => import('./TriviaApp'));
const PasswordGeneratorApp = lazy(() => import('./PasswordGeneratorApp'));
const Base64App = lazy(() => import('./Base64App'));
const RegexTesterApp = lazy(() => import('./RegexTesterApp'));
const ImageConverterApp = lazy(() => import('./ImageConverterApp'));
const PDFToolsApp = lazy(() => import('./PDFToolsApp'));
const DocumentConverterApp = lazy(() => import('./DocumentConverterApp'));
const AudioConverterApp = lazy(() => import('./AudioConverterApp'));
const VideoConverterApp = lazy(() => import('./VideoConverterApp'));
const HashGeneratorApp = lazy(() => import('./HashGeneratorApp'));
const ProductSearchApp = lazy(() => import('./ProductSearchApp'));
const StockMarketApp = lazy(() => import('./StockMarketApp'));
const NPMSearchApp = lazy(() => import('./NPMSearchApp'));
const NewsApp = lazy(() => import('./NewsApp'));
const MovieDatabaseApp = lazy(() => import('./MovieDatabaseApp'));
const BookSearchApp = lazy(() => import('./BookSearchApp'));
const WikipediaApp = lazy(() => import('./WikipediaApp'));
const RedditBrowserApp = lazy(() => import('./RedditBrowserApp'));
const APITesterApp = lazy(() => import('./APITesterApp'));
const TimestampConverterApp = lazy(() => import('./TimestampConverterApp'));
const JWTDecoderApp = lazy(() => import('./JWTDecoderApp'));
const UUIDGeneratorApp = lazy(() => import('./UUIDGeneratorApp'));
const JsonFormatterApp = lazy(() => import('./JsonFormatterApp'));
const IPInfoApp = lazy(() => import('./IPInfoApp'));

const appComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
    TodoListApp,
    ExpenseTrackerApp,
    WeatherApp,
    CryptoApp,
    QuotesApp,
    JokesApp,
    CountriesApp,
    QRCodeApp,
    PokemonApp,
    CurrencyApp,
    DogGalleryApp,
    CatFactsApp,
    DictionaryApp,
    GitHubApp,
    NotesApp,
    TriviaApp,
    PasswordGeneratorApp,
    Base64App,
    RegexTesterApp,
    ImageConverterApp,
    PDFToolsApp,
    DocumentConverterApp,
    AudioConverterApp,
    VideoConverterApp,
    HashGeneratorApp,
    ProductSearchApp,
    StockMarketApp,
    NPMSearchApp,
    NewsApp,
    MovieDatabaseApp,
    BookSearchApp,
    WikipediaApp,
    RedditBrowserApp,
    APITesterApp,
    TimestampConverterApp,
    JWTDecoderApp,
    UUIDGeneratorApp,
    JsonFormatterApp,
    IPInfoApp,
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
