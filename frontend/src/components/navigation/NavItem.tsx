import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../media/Icon';
import type { IconCategory } from '../../utils/icons';
import styles from './NavItem.module.css';

/* ── Props ──────────────────────────────────────────────────────────────── */

export interface NavItemProps {
  /** Route path */
  to: string;
  /** Visible label text */
  label: string;
  /** Icon name — resolved via the Icon system (e.g. "dashboard", "map") */
  iconName?: string;
  /** Icon category — defaults to "navigation" */
  iconCategory?: IconCategory;
  /** If true, NavLink only matches exact path */
  end?: boolean;
  /** Optional small badge shown on the right (e.g. "NEW") */
  badgeText?: string;
  /** Renders the item as non-interactive */
  disabled?: boolean;
  /** When true, sidebar is collapsed; only icon is shown */
  collapsed?: boolean;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const buildClassName = (
  disabled: boolean,
  collapsed: boolean,
  { isActive }: { isActive: boolean },
): string =>
  [
    styles.navItem,
    isActive && !disabled ? styles.active : '',
    disabled ? styles.disabled : '',
    collapsed ? styles.collapsed : '',
  ]
    .filter(Boolean)
    .join(' ');

/* ── Component ──────────────────────────────────────────────────────────── */

export const NavItem: React.FC<NavItemProps> = ({
  to,
  label,
  iconName,
  iconCategory = 'navigation',
  end,
  badgeText,
  disabled = false,
  collapsed = false,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={(props) => buildClassName(disabled, collapsed, props)}
      title={collapsed ? label : undefined}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled || undefined}
      aria-current={undefined} /* NavLink sets this automatically when active */
    >
      {iconName != null && (
        <span className={styles.icon}>
          <Icon
            category={iconCategory}
            name={iconName}
            size={20}
            alt={label}
          />
        </span>
      )}

      <span className={styles.label}>{label}</span>

      {badgeText && (
        <span className={styles.badge} aria-label={badgeText}>
          {badgeText}
        </span>
      )}
    </NavLink>
  );
};
