'use client';

import { useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import AppCard from '@/components/ui/AppCard';
import Modal from '@/components/ui/Modal';
import AppRenderer from '@/components/apps/AppRenderer';
import { useApp } from '@/context/AppContext';
import { prefetchCriticalData } from '@/services/api.service';
import { Rocket, Zap, Sparkles, Search } from 'lucide-react';

export default function Home() {
  const { state, openApp, closeApp, toggleFavorite, isFavorite } = useApp();

  useEffect(() => {
    prefetchCriticalData();
  }, []);

  return (
    <>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroOrb1} />
            <div className={styles.heroOrb2} />
            <div className={styles.heroOrb3} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Sparkles size={14} />
              <span>Powered by Open-Source APIs</span>
            </div>

            <h1 className={styles.heroTitle}>
              <span className={styles.heroHighlight}>{state.filteredApps.length}+</span> Apps
              <span className={styles.heroSubtitle}>One Platform</span>
            </h1>

            <p className={styles.heroDescription}>
              Weather, Crypto, Tools & more — all in one beautiful, blazing-fast platform.
            </p>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statIcon}>
                  <Rocket size={20} color="#06b6d4" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{state.filteredApps.length}</span>
                  <span className={styles.statLabel}>Apps</span>
                </div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statIcon}>
                  <Zap size={20} color="#f59e0b" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>Free</span>
                  <span className={styles.statLabel}>Forever</span>
                </div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statIcon}>
                  <Sparkles size={20} color="#ec4899" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>0</span>
                  <span className={styles.statLabel}>Ads</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.appsSection}>
          {state.filteredApps.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Search size={40} color="var(--primary)" />
              </div>
              <h3>No apps found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className={styles.appsGrid}>
              {state.filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={() => openApp(app)}
                  isFavorite={isFavorite(app.id)}
                  onToggleFavorite={() => toggleFavorite(app.id)}
                />
              ))}
            </div>
          )}
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerMain}>Built with Next.js & Open-Source APIs</p>
            <p className={styles.footerSub}>
              Weather by Open-Meteo • Crypto by CoinGecko • Countries by RestCountries
            </p>
          </div>
        </footer>
      </main>

      {state.activeApp && (
        <Modal
          isOpen={state.modalOpen}
          onClose={closeApp}
          title={state.activeApp.name}
          icon={state.activeApp.icon}
          gradient={state.activeApp.gradient}
          size="large"
        >
          <AppRenderer componentName={state.activeApp.component} />
        </Modal>
      )}
    </>
  );
}
