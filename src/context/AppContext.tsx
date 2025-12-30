'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import type { AppState, AppCategory, MiniApp } from '@/types';
import { MINI_APPS } from '@/config/apps.config';

// ============================================
// STATE & ACTIONS
// ============================================
interface AppContextState extends AppState {
    modalOpen: boolean;
    activeApp: MiniApp | null;
    filteredApps: MiniApp[];
}

type AppAction =
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_CATEGORY'; payload: AppCategory }
    | { type: 'TOGGLE_FAVORITE'; payload: string }
    | { type: 'LOAD_FAVORITES'; payload: string[] }
    | { type: 'OPEN_APP'; payload: MiniApp }
    | { type: 'CLOSE_APP' }
    | { type: 'SET_THEME'; payload: 'dark' | 'light' }
    | { type: 'TOGGLE_THEME' };

const initialState: AppContextState = {
    searchQuery: '',
    activeCategory: 'all',
    favorites: [],
    theme: 'light', // Default to light mode
    modalOpen: false,
    activeApp: null,
    filteredApps: MINI_APPS,
};

// ============================================
// REDUCER
// ============================================
function filterApps(query: string, category: AppCategory, favorites: string[]): MiniApp[] {
    return MINI_APPS.filter((app) => {
        const matchesSearch =
            app.name.toLowerCase().includes(query.toLowerCase()) ||
            app.description.toLowerCase().includes(query.toLowerCase());

        // Handle favorites category
        if (category === 'favorites') {
            return matchesSearch && favorites.includes(app.id);
        }

        const matchesCategory = category === 'all' || app.category === category;

        return matchesSearch && matchesCategory;
    });
}

function appReducer(state: AppContextState, action: AppAction): AppContextState {
    switch (action.type) {
        case 'SET_SEARCH_QUERY': {
            const filteredApps = filterApps(action.payload, state.activeCategory, state.favorites);
            return { ...state, searchQuery: action.payload, filteredApps };
        }

        case 'SET_CATEGORY': {
            const filteredApps = filterApps(state.searchQuery, action.payload, state.favorites);
            return { ...state, activeCategory: action.payload, filteredApps };
        }

        case 'TOGGLE_FAVORITE': {
            const favorites = state.favorites.includes(action.payload)
                ? state.favorites.filter(id => id !== action.payload)
                : [...state.favorites, action.payload];
            // Re-filter if currently viewing favorites
            const filteredApps = state.activeCategory === 'favorites'
                ? filterApps(state.searchQuery, state.activeCategory, favorites)
                : state.filteredApps;
            return { ...state, favorites, filteredApps };
        }

        case 'LOAD_FAVORITES':
            return { ...state, favorites: action.payload };

        case 'OPEN_APP':
            return { ...state, modalOpen: true, activeApp: action.payload };

        case 'CLOSE_APP':
            return { ...state, modalOpen: false, activeApp: null };

        case 'SET_THEME':
            return { ...state, theme: action.payload };

        case 'TOGGLE_THEME': {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            return { ...state, theme: newTheme };
        }

        default:
            return state;
    }
}

// ============================================
// CONTEXT
// ============================================
interface AppContextValue {
    state: AppContextState;
    setSearchQuery: (query: string) => void;
    setActiveCategory: (category: AppCategory) => void;
    toggleFavorite: (appId: string) => void;
    openApp: (app: MiniApp) => void;
    closeApp: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
    toggleTheme: () => void;
    isFavorite: (appId: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================
interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load preferences from localStorage on mount
    useEffect(() => {
        // Load favorites
        const savedFavorites = localStorage.getItem('superapp_favorites');
        if (savedFavorites) {
            try {
                const favorites = JSON.parse(savedFavorites);
                dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
            } catch (e) {
                console.error('Failed to load favorites', e);
            }
        }

        // Load theme - default to light
        const savedTheme = localStorage.getItem('superapp_theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            dispatch({ type: 'SET_THEME', payload: savedTheme });
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, []);

    // Persist favorites
    useEffect(() => {
        localStorage.setItem('superapp_favorites', JSON.stringify(state.favorites));
    }, [state.favorites]);

    // Persist and apply theme
    useEffect(() => {
        localStorage.setItem('superapp_theme', state.theme);
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    const setSearchQuery = useCallback((query: string) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    }, []);

    const setActiveCategory = useCallback((category: AppCategory) => {
        dispatch({ type: 'SET_CATEGORY', payload: category });
    }, []);

    const toggleFavorite = useCallback((appId: string) => {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: appId });
    }, []);

    const openApp = useCallback((app: MiniApp) => {
        dispatch({ type: 'OPEN_APP', payload: app });
    }, []);

    const closeApp = useCallback(() => {
        dispatch({ type: 'CLOSE_APP' });
    }, []);

    const setTheme = useCallback((theme: 'dark' | 'light') => {
        dispatch({ type: 'SET_THEME', payload: theme });
    }, []);

    const toggleTheme = useCallback(() => {
        dispatch({ type: 'TOGGLE_THEME' });
    }, []);

    const isFavorite = useCallback((appId: string) => {
        return state.favorites.includes(appId);
    }, [state.favorites]);

    const value: AppContextValue = {
        state,
        setSearchQuery,
        setActiveCategory,
        toggleFavorite,
        openApp,
        closeApp,
        setTheme,
        toggleTheme,
        isFavorite,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================
export function useApp(): AppContextValue {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
