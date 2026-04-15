import React from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { ProgressRing } from '../../../../components/ui/Progress';
import type { UserStats } from '../../types';
import styles from './cards.module.css';

/* ---------- Helpers ---------- */

/** Format minutes as "Xh Ym" or just "Xm" */
const fmtMin = (m: number): string => {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
};

/**
 * Ring caps — the "max" each ring represents.
 * These are UX-level goals, not hard limits.
 */
const DAILY_GOAL_MIN = 30;
const WEEKLY_GOAL_MIN = 180; // ~3 h
const TOTAL_CAP_MIN = 6_000; // 100 h — for visual scale only

/* ---------- Props ---------- */

export interface TimeSpentCardProps {
  stats: Pick<UserStats, 'timeTodayMinutes' | 'timeWeekMinutes' | 'timeTotalMinutes'>;
}

/* ---------- Component ---------- */

export const TimeSpentCard: React.FC<TimeSpentCardProps> = ({ stats }) => {
  const { timeTodayMinutes, timeWeekMinutes, timeTotalMinutes } = stats;

  const rings: { label: string; value: number; max: number; color: 'primary' | 'success' | 'warning' }[] = [
    { label: 'Today',  value: timeTodayMinutes,  max: DAILY_GOAL_MIN,  color: 'primary' },
    { label: 'Week',   value: timeWeekMinutes,   max: WEEKLY_GOAL_MIN, color: 'success' },
    { label: 'Total',  value: timeTotalMinutes,   max: TOTAL_CAP_MIN,  color: 'warning' },
  ];

  return (
    <Card>
      <CardContent className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.icon} aria-hidden="true">⏱️</span>
          <h4 className={styles.title}>Time Spent</h4>
        </div>

        <div className={styles.ringsRow}>
          {rings.map((r) => (
            <div key={r.label} className={styles.ringItem}>
              <ProgressRing
                value={Math.min(r.value, r.max)}
                max={r.max}
                size="md"
                color={r.color}
                showLabel={false}
              />
              <span className={styles.ringLabel}>{r.label}</span>
              <span className={styles.help}>{fmtMin(r.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
