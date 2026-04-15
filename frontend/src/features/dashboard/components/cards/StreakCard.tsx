import React from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { UserStats } from '../../types';
import styles from './cards.module.css';

/* ---------- Props ---------- */

export interface StreakCardProps {
  stats: Pick<UserStats, 'streakDays'>;
}

/* ---------- Component ---------- */

export const StreakCard: React.FC<StreakCardProps> = ({ stats }) => {
  const { streakDays } = stats;

  return (
    <Card>
      <CardContent className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.icon} aria-hidden="true">🔥</span>
          <h4 className={styles.title}>Streak</h4>
        </div>

        <div className={styles.streakValue}>
          <span className={styles.bigValue}>{streakDays}</span>
          <span className={styles.streakUnit}>days</span>
        </div>

        <p className={styles.help}>Keep your streak alive!</p>
      </CardContent>
    </Card>
  );
};
