/* ==========================================================================
   Leaderboard Feature — Mock Data
   Provides 30 realistic entries for UI development without a backend.
   ========================================================================== */

import type { LeaderboardEntry, LeaderboardResponse } from '../types';

/* --------------------------------------------------------------------------
   Current user (must exist in entries)
   -------------------------------------------------------------------------- */

export const MOCK_CURRENT_USER_ID = 'user-17';

/* --------------------------------------------------------------------------
   Mock: 30 Leaderboard Entries (realistic XP ranges)
   -------------------------------------------------------------------------- */

const MOCK_ENTRIES: LeaderboardEntry[] = [
  {
    userId: 'user-01',
    name: 'Alex Rivera',
    level: 24,
    xp: 48_200,
    streakDays: 89,
    lessonsCompletedPct: 98,
    countryCount: 12,
  },
  {
    userId: 'user-02',
    name: 'Sam Chen',
    avatarUrl: '/assets/avatars/02.svg',
    level: 22,
    xp: 41_500,
    streakDays: 156,
    lessonsCompletedPct: 95,
    countryCount: 10,
  },
  {
    userId: 'user-03',
    name: 'Jordan Lee',
    level: 21,
    xp: 38_900,
    streakDays: 42,
    lessonsCompletedPct: 91,
    countryCount: 9,
  },
  {
    userId: 'user-04',
    name: 'Morgan Taylor',
    avatarUrl: '/assets/avatars/04.svg',
    level: 20,
    xp: 35_100,
    streakDays: 28,
    lessonsCompletedPct: 88,
    countryCount: 8,
  },
  {
    userId: 'user-05',
    name: 'Casey Kim',
    level: 19,
    xp: 31_800,
    streakDays: 67,
    lessonsCompletedPct: 94,
    countryCount: 7,
  },
  {
    userId: 'user-06',
    name: 'Riley Martinez',
    avatarUrl: '/assets/avatars/06.svg',
    level: 18,
    xp: 28_400,
    streakDays: 14,
    lessonsCompletedPct: 82,
    countryCount: 7,
  },
  {
    userId: 'user-07',
    name: 'Quinn Anderson',
    level: 17,
    xp: 25_600,
    streakDays: 33,
    lessonsCompletedPct: 79,
    countryCount: 6,
  },
  {
    userId: 'user-08',
    name: 'Avery Johnson',
    avatarUrl: '/assets/avatars/08.svg',
    level: 16,
    xp: 22_900,
    streakDays: 21,
    lessonsCompletedPct: 85,
    countryCount: 6,
  },
  {
    userId: 'user-09',
    name: 'Blake Wilson',
    level: 15,
    xp: 19_700,
    streakDays: 8,
    lessonsCompletedPct: 72,
    countryCount: 5,
  },
  {
    userId: 'user-10',
    name: 'Drew Thompson',
    avatarUrl: '/assets/avatars/10.svg',
    level: 14,
    xp: 16_200,
    streakDays: 55,
    lessonsCompletedPct: 90,
    countryCount: 5,
  },
  {
    userId: 'user-11',
    name: 'Emery White',
    level: 13,
    xp: 13_800,
    streakDays: 19,
    lessonsCompletedPct: 68,
    countryCount: 4,
  },
  {
    userId: 'user-12',
    name: 'Finley Harris',
    avatarUrl: '/assets/avatars/12.svg',
    level: 12,
    xp: 11_400,
    streakDays: 5,
    lessonsCompletedPct: 75,
    countryCount: 4,
  },
  {
    userId: 'user-13',
    name: 'Hayden Clark',
    level: 11,
    xp: 9_200,
    streakDays: 12,
    lessonsCompletedPct: 61,
    countryCount: 3,
  },
  {
    userId: 'user-14',
    name: 'Jamie Lewis',
    avatarUrl: '/assets/avatars/14.svg',
    level: 10,
    xp: 7_100,
    streakDays: 3,
    lessonsCompletedPct: 58,
    countryCount: 3,
  },
  {
    userId: 'user-15',
    name: 'Kendall Walker',
    level: 9,
    xp: 5_400,
    streakDays: 24,
    lessonsCompletedPct: 70,
    countryCount: 2,
  },
  {
    userId: 'user-16',
    name: 'Logan Hall',
    avatarUrl: '/assets/avatars/16.svg',
    level: 8,
    xp: 4_100,
    streakDays: 7,
    lessonsCompletedPct: 52,
    countryCount: 2,
  },
  {
    userId: MOCK_CURRENT_USER_ID,
    name: 'You',
    level: 7,
    xp: 4_820,
    streakDays: 12,
    lessonsCompletedPct: 92,
    countryCount: 2,
  },
  {
    userId: 'user-18',
    name: 'Parker Young',
    avatarUrl: '/assets/avatars/18.svg',
    level: 7,
    xp: 3_900,
    streakDays: 2,
    lessonsCompletedPct: 48,
    countryCount: 2,
  },
  {
    userId: 'user-19',
    name: 'Reese King',
    level: 6,
    xp: 2_700,
    streakDays: 15,
    lessonsCompletedPct: 65,
    countryCount: 1,
  },
  {
    userId: 'user-20',
    name: 'Sage Wright',
    avatarUrl: '/assets/avatars/20.svg',
    level: 6,
    xp: 2_350,
    streakDays: 1,
    lessonsCompletedPct: 44,
    countryCount: 1,
  },
  {
    userId: 'user-21',
    name: 'Taylor Scott',
    level: 5,
    xp: 1_800,
    streakDays: 9,
    lessonsCompletedPct: 55,
    countryCount: 1,
  },
  {
    userId: 'user-22',
    name: 'Morgan Green',
    avatarUrl: '/assets/avatars/22.svg',
    level: 5,
    xp: 1_420,
    streakDays: 0,
    lessonsCompletedPct: 38,
    countryCount: 1,
  },
  {
    userId: 'user-23',
    name: 'Jordan Adams',
    level: 4,
    xp: 980,
    streakDays: 4,
    lessonsCompletedPct: 42,
    countryCount: 1,
  },
  {
    userId: 'user-24',
    name: 'Casey Nelson',
    avatarUrl: '/assets/avatars/24.svg',
    level: 4,
    xp: 720,
    streakDays: 0,
    lessonsCompletedPct: 31,
    countryCount: 1,
  },
  {
    userId: 'user-25',
    name: 'Riley Baker',
    level: 3,
    xp: 480,
    streakDays: 6,
    lessonsCompletedPct: 28,
    countryCount: 1,
  },
  {
    userId: 'user-26',
    name: 'Quinn Carter',
    avatarUrl: '/assets/avatars/26.svg',
    level: 3,
    xp: 310,
    streakDays: 0,
    lessonsCompletedPct: 22,
    countryCount: 1,
  },
  {
    userId: 'user-27',
    name: 'Avery Mitchell',
    level: 2,
    xp: 180,
    streakDays: 2,
    lessonsCompletedPct: 18,
    countryCount: 1,
  },
  {
    userId: 'user-28',
    name: 'Blake Perez',
    avatarUrl: '/assets/avatars/28.svg',
    level: 2,
    xp: 95,
    streakDays: 0,
    lessonsCompletedPct: 12,
    countryCount: 1,
  },
  {
    userId: 'user-29',
    name: 'Drew Roberts',
    level: 1,
    xp: 45,
    streakDays: 1,
    lessonsCompletedPct: 8,
    countryCount: 1,
  },
  {
    userId: 'user-30',
    name: 'Emery Turner',
    avatarUrl: '/assets/avatars/30.svg',
    level: 1,
    xp: 12,
    streakDays: 0,
    lessonsCompletedPct: 3,
    countryCount: 0,
  },
];

/* --------------------------------------------------------------------------
   Sorted by XP descending (rank order)
   -------------------------------------------------------------------------- */

const ENTRIES_BY_XP = [...MOCK_ENTRIES].sort((a, b) => b.xp - a.xp);

/* --------------------------------------------------------------------------
   Mock: Full Leaderboard Response (by time range)
   -------------------------------------------------------------------------- */

export function getMockLeaderboard(
  timeRange: LeaderboardResponse['timeRange'] = 'week'
): LeaderboardResponse {
  return {
    timeRange,
    entries: ENTRIES_BY_XP,
    currentUserId: MOCK_CURRENT_USER_ID,
  };
}

export const MOCK_LEADERBOARD_WEEK: LeaderboardResponse = getMockLeaderboard('week');
export const MOCK_LEADERBOARD_TODAY: LeaderboardResponse = getMockLeaderboard('today');
export const MOCK_LEADERBOARD_MONTH: LeaderboardResponse = getMockLeaderboard('month');
export const MOCK_LEADERBOARD_ALL: LeaderboardResponse = getMockLeaderboard('all');
