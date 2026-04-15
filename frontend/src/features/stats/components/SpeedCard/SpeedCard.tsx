import React from 'react';
import { Card, CardContent, CardHeader } from '../../../../components/ui';
import { ProgressRing } from '../../../../components/ui/Progress';
import { XPLevelSection } from '../../../dashboard/components/xp/XPLevelSection';
import type { XpLevel, AccuracyCoverage } from '../../types';
import styles from './SpeedCard.module.css';

/* --------------------------------------------------------------------------
   SpeedCard props (first card: XP + Level + Accuracy & Completion)
   -------------------------------------------------------------------------- */

export interface SpeedCardProps {
  xpLevel: XpLevel;
  accuracyCoverage: AccuracyCoverage;
  className?: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export const SpeedCard: React.FC<SpeedCardProps> = ({
  xpLevel,
  accuracyCoverage,
  className,
}) => {
  return (
    <Card className={[styles.card, className].filter(Boolean).join(' ')}>
      <CardHeader className={styles.header}>
        <h3 className={styles.title}>Progress</h3>
      </CardHeader>
      <CardContent className={styles.content}>
        <XPLevelSection
          level={xpLevel.level}
          xpCurrent={xpLevel.xpCurrent}
          xpGoal={xpLevel.xpGoal}
        />

        <div className={styles.divider} aria-hidden />

        <div className={styles.ringsSection}>
          <h4 className={styles.subtitle}>Accuracy & Completion</h4>
          <div className={styles.rings}>
            <div className={styles.ringWrap}>
              <ProgressRing
                value={accuracyCoverage.accuracyPct}
                max={100}
                size="lg"
                color="primary"
                showLabel
                className={styles.ring}
              />
              <span className={styles.ringLabel}>Accuracy</span>
            </div>
            <div className={styles.ringWrap}>
              <ProgressRing
                value={accuracyCoverage.coveragePct}
                max={100}
                size="lg"
                color="primary"
                showLabel
                className={styles.ring}
              />
              <span className={styles.ringLabel}>Completion</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
