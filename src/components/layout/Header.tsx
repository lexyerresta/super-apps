'use client';

import React, { useState } from 'react';
import styles from './Header.module.css';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/config/apps.config';
import { Search, Zap, Menu, X, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import Settings from '@/components/ui/Settings';

export default function Header() {
    const { state, setSearchQuery, setActiveCategory, toggleTheme } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Zap size={20} color="white" />
                        </div>
                        <div className={styles.logoText}>
                            <span className={styles.logoPrimary}>SuperApps</span>
                            <span className={styles.logoSecondary}>ALL-IN-ONE</span>
                        </div>
                    </div>

                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={state.searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search apps..."
                            className={styles.searchInput}
                        />
                        {state.searchQuery && (
                            <button
                                className={styles.clearBtn}
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <nav className={styles.nav}>
                        {CATEGORIES.slice(0, 5).map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`${styles.navItem} ${state.activeCategory === category.id ? styles.active : ''}`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </nav>

                    <div className={styles.headerActions}>
                        <button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <button
                            className={styles.settingsBtn}
                            onClick={() => setSettingsOpen(true)}
                            aria-label="Settings"
                        >
                            <SettingsIcon size={18} />
                        </button>

                        <button
                            className={styles.mobileMenuBtn}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className={styles.mobileMenu}>
                        <nav className={styles.mobileNav}>
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`${styles.mobileNavItem} ${state.activeCategory === category.id ? styles.active : ''}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
}
