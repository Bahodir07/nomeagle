import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  /** Visible text */
  label: string;
  /** Route path — omit for current (non-clickable) page */
  to?: string;
}

export interface BreadcrumbsProps {
  /** Ordered list of crumbs (last entry = current page) */
  items: BreadcrumbItem[];
}

/* ── Component ──────────────────────────────────────────────────────────── */

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.breadcrumbs}>
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={crumb.to ?? crumb.label} className={styles.item}>
              {/* Separator before every item except the first */}
              {index > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}

              {isLast || !crumb.to ? (
                <span
                  className={styles.current}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className={styles.link}>
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
