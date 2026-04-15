import React from 'react';
import { Stat } from '../../../../components/ui';
import type { LeaderboardEntry } from '../../types';
import styles from './YourRankCard.module.css';

/* ==========================================================================
   YourRankCard
   Shows current user rank, XP, level, streak. Fallback when user not on board.
   ========================================================================== */

const STREAK_ICON_PATH = '/assets/icons/status/streak_day_fire.svg';

export interface YourRankCardProps {
  /** Current user's rank (1-based), or null if not in list */
  rank: number | null;
  /** Current user's entry, or null if not found */
  entry: LeaderboardEntry | null;
  className?: string;
}

function formatXp(xp: number): string {
  return xp.toLocaleString();
}

export const YourRankCard: React.FC<YourRankCardProps> = ({
  rank,
  entry,
  className,
}) => {
  if (entry == null || rank == null) {
    return (
      <div className={[styles.wrapper, styles.fallback, className].filter(Boolean).join(' ')}>
        <p className={styles.fallbackText}>
          Start learning to appear on leaderboard
        </p>
      </div>
    );
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <h3 className={styles.title}>Your rank</h3>
      <div className={styles.grid}>
        <Stat label="Rank" value={`#${rank}`} />
        <Stat label="XP" value={formatXp(entry.xp)} />
        <Stat label="Level" value={entry.level} />
        <Stat
          label="Streak"
          value={
            <span className={styles.streak}>
              <img
                src={STREAK_ICON_PATH}
                alt=""
                width={16}
                height={16}
                className={styles.streakIcon}
              />
              {entry.streakDays} days
            </span>
          }
        />
      </div>
    </div>
  );
};
