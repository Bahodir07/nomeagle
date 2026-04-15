import React from 'react';
import { FlameIcon } from '../../../../assets/icons/status/FlameIcon';
import styles from './StreakSection.module.css';

/* ==========================================================================
   StreakSection — Duolingo-inspired streak widget

   ┌──────────────────────────────────────┐
   │  [🔥]  STREAK                        │
   │         12  DAYS                     │
   │                                      │
   │  (✓) (✓) (✓) (○)  ●   ●   ●        │
   │  Mon Tue Wed Thu  Fri Sat Sun        │
   └──────────────────────────────────────┘

   Circle states:
     completed = green fill + white checkmark (animated pop-in)
     today     = green outlined ring, hollow (subtle pulse)
     future    = gray fill, no icon
   ========================================================================== */

/* ---------- Constants ---------- */

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/* ---------- Helpers ---------- */

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/** Monday-based index: Mon=0 … Sun=6 */
const getMondayIndex = (): number => {
  const jsDay = new Date().getDay(); // Sun=0 … Sat=6
  return jsDay === 0 ? 6 : jsDay - 1;
};

/* ---------- Sub-components ---------- */

/** SVG checkmark for completed circles */
const CheckSvg: React.FC = () => (
  <svg
    className={styles.checkSvg}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 8.5L6.5 11L12 5"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type DayState = 'completed' | 'today' | 'future';

interface DayCircleProps {
  state: DayState;
  label: string;
  /** Stagger index for the pop-in animation (0-6) */
  index: number;
}

const DayCircle: React.FC<DayCircleProps> = ({ state, label, index }) => (
  <div className={styles.dayCol}>
    <div
      className={cx(
        styles.circle,
        state === 'completed' && styles.completed,
        state === 'today' && styles.today,
        state === 'future' && styles.future,
      )}
      style={
        state === 'completed'
          ? { animationDelay: `${index * 0.07}s` }
          : undefined
      }
      aria-label={`${label}: ${state === 'completed' ? 'completed' : state === 'today' ? 'today' : 'upcoming'}`}
    >
      {state === 'completed' && <CheckSvg />}
    </div>
    <span className={cx(styles.dayLabel, state === 'today' && styles.dayLabelToday)}>
      {label}
    </span>
  </div>
);

/* ---------- Props ---------- */

export interface StreakSectionProps {
  /** Total consecutive streak days */
  streakDays: number;
  /** 7 booleans (Mon → Sun): true = practised that day */
  weekProgress: boolean[];
  /** Override today's index for testing (0=Mon … 6=Sun). Defaults to real day. */
  todayIndex?: number;
}

/* ---------- Component ---------- */

export const StreakSection: React.FC<StreakSectionProps> = ({
  streakDays,
  weekProgress,
  todayIndex,
}) => {
  const today = todayIndex ?? getMondayIndex();

  /** Determine the visual state of each day circle */
  const getDayState = (i: number): DayState => {
    if (weekProgress[i]) return 'completed';
    if (i === today) return 'today';
    return 'future';
  };

  return (
    <div className={styles.root}>
      {/* ── Header: flame + streak number ────────────────────── */}
      <div className={styles.header}>
        <div className={styles.flameWrap}>
          <FlameIcon size={40} className={styles.flame} />
        </div>

        <div className={styles.headerText}>
          <span className={styles.streakLabel}>Streak</span>
          <div className={styles.streakValueRow}>
            <span className={styles.streakNumber}>{streakDays}</span>
            <span className={styles.streakUnit}>days</span>
          </div>
        </div>
      </div>

      {/* ── Week progress circles ────────────────────────────── */}
      <div className={styles.weekRow} role="list" aria-label="Weekly progress">
        {DAY_LABELS.map((label, i) => (
          <DayCircle
            key={label}
            label={label}
            state={getDayState(i)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};
