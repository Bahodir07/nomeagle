import React from 'react';
import styles from './AccuracySection.module.css';

/* ==========================================================================
   AccuracySection — Quiz accuracy + Lessons completed

   ┌─────────────────────────────────────┐
   │  🎯  ACCURACY & COMPLETION         │
   │                                     │
   │     87%        │       92%          │
   │  Quiz Accuracy │  Lessons Completed │
   └─────────────────────────────────────┘

   Two large percentage values side by side, separated by a vertical
   divider.  Calm, clean, informative design.
   ========================================================================== */

/* ---------- Helpers ---------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Colour bucket for the percentage value */
const colorClass = (pct: number): string => {
  if (pct >= 80) return styles.valueGreen;
  if (pct >= 50) return styles.valueAmber;
  return styles.valueRed;
};

/* ---------- Props ---------- */

export interface AccuracySectionProps {
  /** Quiz answer accuracy 0–100 */
  accuracyPct: number;
  /** Lessons completed 0–100 */
  completionPct: number;
}

/* ---------- Sub-component: single stat column ---------- */

interface StatColumnProps {
  value: number;
  label: string;
}

const StatColumn: React.FC<StatColumnProps> = ({ value, label }) => {
  const clamped = clamp(Math.round(value), 0, 100);

  return (
    <div className={styles.statCol}>
      <div className={styles.valueRow}>
        <span className={`${styles.bigValue} ${colorClass(clamped)}`}>
          {clamped}
        </span>
        <span className={`${styles.suffix} ${colorClass(clamped)}`}>%</span>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

/* ---------- Main component ---------- */

export const AccuracySection: React.FC<AccuracySectionProps> = ({
  accuracyPct,
  completionPct,
}) => (
  <div className={styles.root}>
    {/* Section header */}
    <div className={styles.header}>
      <span className={styles.headerIcon} aria-hidden="true">🎯</span>
      <h4 className={styles.headerLabel}>Accuracy &amp; Completion</h4>
    </div>

    {/* Two stats side by side */}
    <div className={styles.statsRow}>
      <StatColumn value={accuracyPct} label="Quiz Accuracy" />
      <div className={styles.verticalDivider} />
      <StatColumn value={completionPct} label="Lessons Completed" />
    </div>
  </div>
);
