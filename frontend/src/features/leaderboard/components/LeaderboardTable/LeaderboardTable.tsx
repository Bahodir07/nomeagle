import React from 'react';
import { Avatar } from '../../../../components/ui';
import type { LeaderboardEntry } from '../../types';
import { sortAndRank } from '../../utils/ranking';
import styles from './LeaderboardTable.module.css';

/* ==========================================================================
   LeaderboardTable
   Table: Rank | User | Level | XP | Streak | Lessons %
   Uses sortAndRank (xp desc → level → streakDays; dense ranks).
   Highlights current user row; top 3 get subtle badge styling.
   ========================================================================== */

export interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  /** Optional: empty state message when entries.length === 0 */
  emptyMessage?: string;
  className?: string;
}

function formatXp(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return String(xp);
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  currentUserId,
  emptyMessage = 'No entries yet.',
  className,
}) => {
  if (entries.length === 0) {
    return (
      <div className={[styles.empty, className].filter(Boolean).join(' ')}>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  const ranked = sortAndRank(entries);

  return (
    <div className={[styles.scrollWrap, className].filter(Boolean).join(' ')}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thRank}>Rank</th>
            <th className={styles.thUser}>User</th>
            <th className={styles.thNum}>Level</th>
            <th className={styles.thNum}>XP</th>
            <th className={styles.thNum}>Streak</th>
            <th className={styles.thPct}>Lessons %</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map(({ entry, rank }) => {
            const isCurrentUser = entry.userId === currentUserId;
            const isTopThree = rank <= 3;

            return (
              <tr
                key={entry.userId}
                className={[
                  styles.row,
                  isCurrentUser && styles.rowCurrent,
                  isTopThree && styles.rowTopThree,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <td className={styles.tdRank}>
                  <span
                    className={[
                      styles.rankBadge,
                      rank === 1 && styles.rankBadge1,
                      rank === 2 && styles.rankBadge2,
                      rank === 3 && styles.rankBadge3,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {rank}
                  </span>
                </td>
                <td className={styles.tdUser}>
                  <Avatar
                    src={entry.avatarUrl}
                    name={entry.name}
                    size="sm"
                    className={styles.avatar}
                  />
                  <span className={styles.userName}>{entry.name}</span>
                </td>
                <td className={styles.tdNum}>{entry.level}</td>
                <td className={styles.tdNum}>{formatXp(entry.xp)}</td>
                <td className={styles.tdNum}>{entry.streakDays}</td>
                <td className={styles.tdPct}>
                  {entry.lessonsCompletedPct != null
                    ? `${entry.lessonsCompletedPct}%`
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
