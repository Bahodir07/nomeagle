import React from 'react';
import { SidebarSection } from '../../components/navigation';
import type { NavItemProps } from '../../components/navigation';
import sidebarHideIcon from '../../assets/icons/actions/sidebar-hide-svgrepo-com.svg';
import sidebarShowIcon from '../../assets/icons/actions/sidebar-show-svgrepo-com.svg';
import siteLogo from '../../assets/images/nomeagle_site_logo.png';
import siteText from '../../assets/images/nomeagle_site_text.png';
import styles from './Sidebar.module.css';

/* ── Sidebar props ──────────────────────────────────────────────────────── */

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/* ── Nav config ─────────────────────────────────────────────────────────── */

const mainNavItems: NavItemProps[] = [
  { label: 'Map',          to: '/app/map',          iconName: 'map' },
  { label: 'Search',       to: '/app/search',       iconName: 'search' },
  { label: 'Stats',        to: '/app/stats',        iconName: 'statistics' },
  { label: 'Dashboard',    to: '/app/dashboard',    iconName: 'dashboard', end: true },
  { label: 'Games',        to: '/app/games',        iconName: 'games' },
  { label: 'Achievements', to: '/app/achievements', iconName: 'achievements' },
  { label: 'Leaderboard',  to: '/app/leaderboard',  iconName: 'leaderboard' },
  { label: 'Profile',      to: '/app/profile',      iconName: 'profile' },
];

const bottomNavItems: NavItemProps[] = [
  { label: 'Settings', to: '/app/settings', iconName: 'settings' },
];

/* ── Component ──────────────────────────────────────────────────────────── */

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      aria-label="Main navigation"
      data-collapsed={collapsed || undefined}
    >
      {/* Logo: two separate images so the sidebar can collapse.
          - Site logo (symbol): always visible; stays when collapsed.
          - Site text (wordmark): only when expanded; hidden when collapsed. */}
      <div className={styles.logo}>
        <img
          src={siteLogo}
          alt=""
          className={styles.logoSymbol}
          width={50}
          height={50}
          aria-hidden
        />
        <img
          src={siteText}
          alt="NomEagle"
          className={styles.logoTextImg}
          height={100}
          aria-hidden={collapsed}
        />
      </div>

      {/* Main nav */}
      <nav className={styles.nav}>
        <SidebarSection items={mainNavItems} collapsed={collapsed} />
      </nav>

      {/* Bottom section */}
      <div className={styles.bottom}>
        <SidebarSection items={bottomNavItems} collapsed={collapsed} />
      </div>

      {/* Toggle on the sidebar edge – visible only on sidebar hover */}
      <button
        type="button"
        className={styles.toggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
      >
        <img
          src={collapsed ? sidebarShowIcon : sidebarHideIcon}
          alt=""
          width={20}
          height={20}
          aria-hidden
        />
      </button>
    </aside>
  );
};
