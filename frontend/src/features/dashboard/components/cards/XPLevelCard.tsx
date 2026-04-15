import React from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { ProgressBar } from '../../../../components/ui/Progress';
import type { UserStats } from '../../types';
import styles from './cards.module.css';

/* ---------- Props ---------- */

export interface XPLevelCardProps {
  stats: Pick<UserStats, 'xp' | 'level' | 'xpToNextLevel'>;
}

/* ---------- Component ---------- */

export const XPLevelCard: React.FC<XPLevelCardProps> = ({ stats }) => {
  const { xp, level, xpToNextLevel } = stats;
  const xpInLevel = xp % (xp + xpToNextLevel) || xp; // current progress within the level
  const xpMax = xpInLevel + xpToNextLevel;

  return (
    <Card>
      <CardContent className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.icon} aria-hidden="true">⚡</span>
          <h4 className={styles.title}>Level &amp; XP</h4>
        </div>

        <span className={styles.bigValue}>Level {level}</span>

        <div className={styles.xpRow}>
          <ProgressBar value={xpInLevel} max={xpMax} color="primary" size="md" />
          <span className={styles.xpLabel}>
            {xpToNextLevel.toLocaleString()} XP to next level
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
