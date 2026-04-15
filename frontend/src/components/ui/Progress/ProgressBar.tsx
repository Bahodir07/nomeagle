import React from 'react';
import styles from './ProgressBar.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/** Clamp a value between 0 and max, return as a percentage */
const toPct = (value: number, max: number) =>
  Math.min(100, Math.max(0, (value / max) * 100));

/* ---------- ProgressBar ---------- */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (0–100 by default) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Bar fill colour */
  color?: 'primary' | 'success' | 'warning' | 'danger';
  /** Track height preset */
  size?: 'sm' | 'md' | 'lg';
  /** Show percentage label inside the bar */
  showLabel?: boolean;
  /** Trigger fill animation (useful for view mode transitions) */
  animated?: boolean;
  /** Unique key to re-trigger animation when changed */
  animationKey?: string | number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  animated = false,
  animationKey,
  className,
  ...rest
}) => {
  const pct = toPct(value, max);

  return (
    <div
      className={cx(styles.track, styles[`track-${size}`], className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...rest}
    >
      <div
        key={animationKey}
        className={cx(styles.fill, styles[`fill-${color}`], animated && styles.fillAnimated)}
        style={{ width: `${pct}%` }}
      />
      {showLabel && (
        <span className={styles.label}>{Math.round(pct)}%</span>
      )}
    </div>
  );
};
