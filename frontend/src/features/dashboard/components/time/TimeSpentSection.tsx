import React from 'react';
import styles from './TimeSpentSection.module.css';

/* ==========================================================================
   TimeSpentSection — Three circular progress rings

   Layout per ring:
           23m          ← time value (above circle)
        ┌───────┐
        │       │
        │ 30m   │       ← SVG progress ring
        │ goal  │       ← goal label (centered inside)
        │       │
        └───────┘
         Today          ← category label (below circle)

   All three rings sit in a horizontal row and wrap on small screens.
   Calm blue stroke.
   ========================================================================== */

/* ---------- Helpers ---------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Format minutes into a readable string: "23m", "2h 28m", "39h" */
const fmtMin = (m: number): string => {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
};

/* ---------- Ring constants ---------- */

const RING_DIAMETER = 80;   // 10 × 8 = 80px — 8px-grid aligned
const STROKE_WIDTH = 6;
const RADIUS = (RING_DIAMETER - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* ---------- Props ---------- */

export interface TimeSpentSectionProps {
  /** Minutes spent today */
  todayMinutes: number;
  /** Minutes spent this week */
  weekMinutes: number;
  /** Total minutes spent */
  totalMinutes: number;
  /** Daily goal in minutes (default 30) */
  todayGoal?: number;
  /** Weekly goal in minutes (default 180 = 3h) */
  weekGoal?: number;
  /** Total goal in minutes (default 6000 = 100h) */
  totalGoal?: number;
}

/* ---------- Sub-component: single ring ---------- */

interface RingItemProps {
  /** Time spent (formatted) — shown above circle */
  timeDisplay: string;
  /** Goal (formatted) — shown inside circle */
  goalDisplay: string;
  /** Category label — shown below circle */
  label: string;
  /** Progress percentage 0-100 */
  pct: number;
  /** Accessible description */
  ariaLabel: string;
}

const RingItem: React.FC<RingItemProps> = ({
  timeDisplay,
  goalDisplay,
  label,
  pct,
  ariaLabel,
}) => {
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  return (
    <div className={styles.ringCol}>
      {/* Time value — above the circle */}
      <span className={styles.timeValue}>{timeDisplay}</span>

      {/* SVG ring */}
      <div
        className={styles.ringWrap}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <svg
          width={RING_DIAMETER}
          height={RING_DIAMETER}
          className={styles.svg}
        >
          {/* Background track */}
          <circle
            className={styles.trackCircle}
            cx={RING_DIAMETER / 2}
            cy={RING_DIAMETER / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress arc */}
          <circle
            className={styles.fillCircle}
            cx={RING_DIAMETER / 2}
            cy={RING_DIAMETER / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Goal text centred inside the ring */}
        <div className={styles.goalInner}>
          <span className={styles.goalValue}>{goalDisplay}</span>
          <span className={styles.goalLabel}>goal</span>
        </div>
      </div>

      {/* Category label — below the circle */}
      <span className={styles.categoryLabel}>{label}</span>
    </div>
  );
};

/* ---------- Main component ---------- */

export const TimeSpentSection: React.FC<TimeSpentSectionProps> = ({
  todayMinutes,
  weekMinutes,
  totalMinutes,
  todayGoal = 30,
  weekGoal = 180,
  totalGoal = 6_000,
}) => {
  const rings: {
    label: string;
    minutes: number;
    goal: number;
  }[] = [
    { label: 'Today',     minutes: todayMinutes, goal: todayGoal },
    { label: 'This Week', minutes: weekMinutes,  goal: weekGoal },
    { label: 'Total',     minutes: totalMinutes,  goal: totalGoal },
  ];

  return (
    <div className={styles.root}>
      {/* Section header */}
      <div className={styles.header}>
        <span className={styles.headerIcon} aria-hidden="true">⏱️</span>
        <h4 className={styles.headerLabel}>Time Spent</h4>
      </div>

      {/* Three rings in a row */}
      <div className={styles.ringsRow}>
        {rings.map((r) => {
          const pct = clamp((r.minutes / r.goal) * 100, 0, 100);
          return (
            <RingItem
              key={r.label}
              timeDisplay={fmtMin(r.minutes)}
              goalDisplay={fmtMin(r.goal)}
              label={r.label}
              pct={pct}
              ariaLabel={`${r.label}: ${fmtMin(r.minutes)} of ${fmtMin(r.goal)} goal (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>
    </div>
  );
};
