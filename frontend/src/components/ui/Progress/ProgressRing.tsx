import React from 'react';
import styles from './ProgressRing.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/** Clamp a value between 0 and max, return as a percentage */
const toPct = (value: number, max: number) =>
  Math.min(100, Math.max(0, (value / max) * 100));

/* ---------- Size presets (8px-grid aligned) ---------- */
const RING_SIZES = {
  sm: { diameter: 40, strokeWidth: 3 },  // 5 × 8 = 40
  md: { diameter: 48, strokeWidth: 4 },  // 6 × 8 = 48
  lg: { diameter: 72, strokeWidth: 5 }, // 9 × 8 = 72
} as const;

type RingSize = keyof typeof RING_SIZES;

/* ---------- ProgressRing ---------- */
export interface ProgressRingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (0–100 by default) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Diameter preset */
  size?: RingSize;
  /** Stroke colour */
  color?: 'primary' | 'success' | 'warning' | 'danger';
  /** Show percentage label in the centre */
  showLabel?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = true,
  className,
  ...rest
}) => {
  const { diameter, strokeWidth } = RING_SIZES[size];
  const pct = toPct(value, max);
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cx(styles.wrapper, className)}
      style={{ width: diameter, height: diameter }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...rest}
    >
      <svg width={diameter} height={diameter} className={styles.svg}>
        {/* Background track */}
        <circle
          className={styles.bg}
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Animated fill arc */}
        <circle
          className={cx(styles.fill, styles[`fill-${color}`])}
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {showLabel && (
        <span
          className={styles.label}
          style={{ fontSize: diameter * 0.26 }}
        >
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
};
