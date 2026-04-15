import React from 'react';
import { Skeleton } from '../../ui/Skeleton';
import styles from './Loading.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------- Props ---------- */

export interface LoadingProps {
  /**
   * Number of skeleton rows to render.
   * Each row is a card-sized rectangle.
   * @default 3
   */
  rows?: number;
  /**
   * Number of columns in the skeleton grid.
   * @default 2
   */
  columns?: number;
  /**
   * Height of each skeleton block (px or CSS string).
   * @default 160
   */
  blockHeight?: number | string;
  /**
   * Optional heading skeleton at the top.
   * @default true
   */
  showHeading?: boolean;
  /** Extra class on the wrapper */
  className?: string;
}

/* ---------- Component ---------- */

/**
 * Reusable loading placeholder built from `<Skeleton>` blocks.
 * Renders a heading shimmer + a configurable grid of rectangles.
 *
 * Usage:
 *   <Loading />                         → 3 rows × 2 cols
 *   <Loading rows={4} columns={1} />    → 4 stacked blocks
 */
export const Loading: React.FC<LoadingProps> = ({
  rows = 3,
  columns = 2,
  blockHeight = 160,
  showHeading = true,
  className,
}) => {
  const count = rows * columns;

  return (
    <div className={cx(styles.wrapper, className)} role="status" aria-label="Loading">
      {showHeading && (
        <Skeleton variant="text" width="45%" height="1.25rem" />
      )}

      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="rect" height={blockHeight} />
        ))}
      </div>

      {/* Screen-reader only live text */}
      <span className={styles.srOnly}>Loading content, please wait...</span>
    </div>
  );
};
