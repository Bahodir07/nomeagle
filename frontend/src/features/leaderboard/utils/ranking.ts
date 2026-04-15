import type { LeaderboardEntry } from '../types';

/* ==========================================================================
   Leaderboard Ranking
   Stable sort by xp desc → level desc → streakDays desc.
   Ranks use dense numbering: ties get the same rank; no gaps (1, 2, 2, 3, 4...).
   ========================================================================== */

export interface RankedEntry {
  entry: LeaderboardEntry;
  rank: number;
}

/**
 * Compare two entries for sort order. Returns negative if a should be before b.
 * Order: xp desc, then level desc, then streakDays desc.
 */
function compareEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.xp !== a.xp) return b.xp - a.xp;
  if (b.level !== a.level) return b.level - a.level;
  return b.streakDays - a.streakDays;
}

/**
 * Sort entries by score (xp desc, then level desc, then streakDays desc)
 * and assign dense ranks. Ties get the same rank; next rank has no gap.
 *
 * Example: [100xp, 90xp, 90xp, 80xp] => ranks [1, 2, 2, 3].
 */
export function sortAndRank(entries: LeaderboardEntry[]): RankedEntry[] {
  const sorted = [...entries].sort(compareEntries);
  const result: RankedEntry[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && compareEntries(sorted[i - 1], sorted[i]) !== 0) {
      currentRank++;
    }
    result.push({ entry: sorted[i], rank: currentRank });
  }

  return result;
}
