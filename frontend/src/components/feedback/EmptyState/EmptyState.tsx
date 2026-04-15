import React from 'react';
import { Button } from '../../ui/Button';
import styles from './EmptyState.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------- Props ---------- */

export interface EmptyStateProps {
  /** Large icon or emoji shown above the title */
  icon?: React.ReactNode;
  /** Primary heading */
  title: string;
  /** Secondary description text */
  description?: string;
  /** CTA button label (renders only when both label + onAction are provided) */
  actionLabel?: string;
  /** Called when the user clicks the action button */
  onAction?: () => void;
  /** Extra class on the wrapper */
  className?: string;
}

/* ---------- Component ---------- */

/**
 * Generic empty-state placeholder.
 * Use when a list/grid has zero items, or data hasn't been created yet.
 *
 * Usage:
 *   <EmptyState
 *     icon="🌍"
 *     title="No countries yet"
 *     description="Start exploring to add your first country."
 *     actionLabel="Browse Countries"
 *     onAction={() => navigate('/browse')}
 *   />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => (
  <div className={cx(styles.wrapper, className)}>
    <span className={styles.icon} aria-hidden="true">{icon}</span>
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
    {actionLabel && onAction && (
      <Button variant="primary" size="md" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
