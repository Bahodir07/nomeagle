import React from 'react';
import { Button } from '../../ui/Button';
import styles from './ErrorState.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------- Props ---------- */

export interface ErrorStateProps {
  /** Error message displayed to the user */
  message?: string;
  /** Called when the user clicks "Retry" */
  onRetry?: () => void;
  /** Override the retry button label */
  retryLabel?: string;
  /** Extra class on the wrapper */
  className?: string;
}

/* ---------- Component ---------- */

/**
 * Generic error placeholder with an optional retry button.
 *
 * Usage:
 *   <ErrorState
 *     message="Failed to load dashboard data."
 *     onRetry={() => refetch()}
 *   />
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
  retryLabel = 'Retry',
  className,
}) => (
  <div className={cx(styles.wrapper, className)} role="alert">
    <span className={styles.icon} aria-hidden="true">⚠️</span>
    <p className={styles.message}>{message}</p>
    {onRetry && (
      <Button variant="secondary" size="md" onClick={onRetry}>
        {retryLabel}
      </Button>
    )}
  </div>
);
