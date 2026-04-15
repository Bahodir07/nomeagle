/* ==========================================================================
   Leaderboard Feature — Types
   Data shapes for leaderboard entries and API response.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Leaderboard Entry
   -------------------------------------------------------------------------- */

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  streakDays: number;
  lessonsCompletedPct?: number;
  countryCount?: number;
}

/* --------------------------------------------------------------------------
   Leaderboard API Response
   -------------------------------------------------------------------------- */

export type LeaderboardTimeRange = 'today' | 'week' | 'month' | 'all';

/** Shape returned by the leaderboard endpoint (or mock) */
export interface LeaderboardResponse {
  timeRange: LeaderboardTimeRange;
  entries: LeaderboardEntry[];
  currentUserId: string;
}
