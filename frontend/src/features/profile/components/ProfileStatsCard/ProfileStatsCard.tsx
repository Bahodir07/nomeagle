import React from 'react';
import styles from './ProfileStatsCard.module.css';

/* ==========================================================================
   ProfileStatsCard
   Level, XP, streak days, selected countries count — small and clean.
   ========================================================================== */

export interface ProfileStatsCardProps {
  level: number;
  xp: number;
  streakDays: number;
  selectedCountriesCount: number;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  level,
  xp,
  streakDays,
  selectedCountriesCount,
}) => (
  <div className={styles.card}>
    <div className={styles.grid}>
      <div className={styles.stat}>
        <span className={styles.value}>{level}</span>
        <span className={styles.label}>Level</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{xp.toLocaleString()}</span>
        <span className={styles.label}>XP</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{streakDays}</span>
        <span className={styles.label}>Streak (days)</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{selectedCountriesCount}</span>
        <span className={styles.label}>Countries</span>
      </div>
    </div>
  </div>
);
