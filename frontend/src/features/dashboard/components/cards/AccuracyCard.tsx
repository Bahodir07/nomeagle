import React from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { UserStats } from '../../types';
import styles from './cards.module.css';

/* ---------- Props ---------- */

export interface AccuracyCardProps {
  stats: Pick<UserStats, 'accuracy'>;
}

/* ---------- Component ---------- */

export const AccuracyCard: React.FC<AccuracyCardProps> = ({ stats }) => {
  const { accuracy } = stats;

  return (
    <Card>
      <CardContent className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.icon} aria-hidden="true">🎯</span>
          <h4 className={styles.title}>Accuracy</h4>
        </div>

        <div className={styles.accuracyRow}>
          <span className={styles.accuracyPct}>{accuracy}</span>
          <span className={styles.accuracySuffix}>%</span>
        </div>

        <p className={styles.help}>Lessons completed</p>
      </CardContent>
    </Card>
  );
};
