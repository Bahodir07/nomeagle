import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { XPLevelSection } from '../xp';
import { StreakSection } from '../streak';
import { TimeSpentSection } from '../time';
import { AccuracySection } from '../accuracy';
import type { UserStats } from '../../types';
import styles from './UnifiedStatsCard.module.css';

/* ==========================================================================
   UnifiedStatsCard

   ┌──────────────────────────┐
   │ ⚡ Level & XP            │
   │ Level 7                  │
   │ ████████░░░  1,180 to go │
   ├──────────────────────────┤
   │ 🔥 Streak                │
   │ 12 days                  │
   │ Keep your streak alive!  │
   ├──────────────────────────┤
   │ ⏱️ Time Spent            │
   │ (●) Today (●) Week (●)  │
   │  23m      2h 28m   39h  │
   ├──────────────────────────┤
   │ 🎯 Accuracy              │
   │ 87%                      │
   │ Lessons completed        │
   └──────────────────────────┘
   ========================================================================== */

/* ---------- Shared sub-components ---------- */

/** Horizontal 1px rule between sections */
const SectionDivider: React.FC = () => (
  <hr className={styles.divider} />
);

/* Section 1 — XP & Level (delegated to standalone XPLevelSection component) */

/* Section 2 — Streak (delegated to standalone StreakSection component) */

/* Section 3 — Time Spent (delegated to standalone TimeSpentSection component) */

/* Section 4 — Accuracy (delegated to standalone AccuracySection component) */

/* ==========================================================================
   Main Component
   ========================================================================== */

export interface UnifiedStatsCardProps {
  stats: UserStats;
  /** 7 booleans (Mon → Sun) for the streak week row */
  weekProgress?: boolean[];
}

export const UnifiedStatsCard: React.FC<UnifiedStatsCardProps> = ({
  stats,
  weekProgress = [false, false, false, false, false, false, false],
}) => (
  <Card className={styles.card}>
    <div className={styles.section}>
      <XPLevelSection
        level={stats.level}
        xpCurrent={stats.xp % (stats.xp + stats.xpToNextLevel) || stats.xp}
        xpGoal={(stats.xp % (stats.xp + stats.xpToNextLevel) || stats.xp) + stats.xpToNextLevel}
      />
    </div>
    <SectionDivider />
    <div className={styles.section}>
      <StreakSection
        streakDays={stats.streakDays}
        weekProgress={weekProgress}
      />
    </div>
    <SectionDivider />
    <div className={styles.section}>
      <TimeSpentSection
        todayMinutes={stats.timeTodayMinutes}
        weekMinutes={stats.timeWeekMinutes}
        totalMinutes={stats.timeTotalMinutes}
      />
    </div>
    <SectionDivider />
    <div className={styles.section}>
      <AccuracySection
        accuracyPct={stats.accuracy}
        completionPct={stats.lessonsCompletedPct}
      />
    </div>
  </Card>
);
