import React from 'react';
import type { LeaderboardEntry } from '../../types';
import styles from './YourRankCard.module.css';

const STREAK_ICON_PATH = '/assets/icons/status/streak_day_fire.svg';

export interface YourRankCardProps {
  rank: number | null;
  entry: LeaderboardEntry | null;
  className?: string;
}

function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}

export const YourRankCard: React.FC<YourRankCardProps> = ({ rank, entry, className }) => {
  if (entry == null || rank == null) {
    return (
      <div className={[styles.wrapper, styles.fallback, className].filter(Boolean).join(' ')}>
        <span className={styles.fallbackIcon}>🏆</span>
        <p className={styles.fallbackText}>Start learning to appear on the leaderboard</p>
      </div>
    );
  }

  const isTopThree = rank <= 3;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <div className={styles.hero}>
        <div className={[styles.rankBadge, isTopThree && styles.rankBadgeGold].filter(Boolean).join(' ')}>
          <span className={styles.rankLabel}>Rank</span>
          <span className={[styles.rankNumber, isTopThree && styles.rankNumberGold].filter(Boolean).join(' ')}>
            #{rank}
          </span>
        </div>
        <div className={styles.heroText}>
          <span className={styles.heroTitle}>Your position</span>
          <span className={styles.heroName}>{entry.name}</span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>XP</span>
          <span className={styles.statValue}>{formatXp(entry.xp)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Level</span>
          <span className={styles.statValue}>{entry.level}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Streak</span>
          <span className={styles.statValue}>
            <span className={styles.streak}>
              <img src={STREAK_ICON_PATH} alt="" width={14} height={14} className={styles.streakIcon} />
              {entry.streakDays}d
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
