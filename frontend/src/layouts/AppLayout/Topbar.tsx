import React from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import styles from './Topbar.module.css';

/* ── Route → Page title map ─────────────────────────────────────────────── */

const pageTitles: Record<string, string> = {
  '/app': 'NomEagle',
  '/app/map': 'Map',
  '/app/search': 'Search Countries',
  '/app/stats': 'Statistics',
  '/app/dashboard': 'Dashboard',
  '/app/achievements': 'Achievements',
  '/app/leaderboard': 'Leaderboard',
  '/app/profile': 'Profile',
  '/app/settings': 'Settings',
};

/* ── Component ──────────────────────────────────────────────────────────── */

export const Topbar: React.FC = () => {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'NomEagle';

  return (
    <header className={styles.topbar} role="banner">
      {/* Left – page title only */}
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      {/* Right – actions */}
      <div className={styles.actions}>
        {/* Language selector placeholder */}
        <button
          type="button"
          className={styles.langSelect}
          aria-label="Select language"
        >
          🌐
          <span>EN</span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>

        {/* User dropdown placeholder */}
        <button
          type="button"
          className={styles.userTrigger}
          aria-label="User menu"
        >
          <Avatar name="Nurlybek" size="sm" />
          <span className={styles.userName}>Nurlybek</span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>
      </div>
    </header>
  );
};
