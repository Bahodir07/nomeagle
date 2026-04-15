/* ==========================================================================
   Dashboard Feature — Mock Data
   Provides realistic sample data so we can build & test UI without a backend.
   "My Learning Countries" is built from localStorage (Learn button on Search).
   ========================================================================== */

import type { DashboardResponse } from '../types';
import type { UserStats, CountryProgress } from '../../../types/models';
import {
  getLearningCountryCodes,
  getCountryByCode,
} from '../../countries/data';

/* --------------------------------------------------------------------------
   Mock: User Stats
   -------------------------------------------------------------------------- */

export const MOCK_USER_STATS: UserStats = {
  xp: 4_820,
  level: 7,
  xpToNextLevel: 1_180, // 6 000 − 4 820
  streakDays: 12,
  accuracy: 87,
  lessonsCompletedPct: 92,
  timeTodayMinutes: 23,
  timeWeekMinutes: 148,
  timeTotalMinutes: 2_340,
};

/**
 * Mock week progress (Mon → Sun).
 * true = practised that day, false = not yet.
 * Simulates: Mon–Wed done, Thu is today (not done yet), Fri–Sun upcoming.
 */
export const MOCK_WEEK_PROGRESS: boolean[] = [
  true, true, true, false, false, false, false,
];

/* --------------------------------------------------------------------------
   Mock: Country Progress
   -------------------------------------------------------------------------- */

export const MOCK_COUNTRIES: CountryProgress[] = [
  {
    countryId: 'jp',
    countryName: 'Japan',
    region: 'Asia',
    status: 'in_progress',
    progressPct: 64,
    teaser: 'Discover sushi origins, bullet trains, and ancient temples.',
    lastLessonTitle: 'Geography: Islands & Mountains',
  },
  {
    countryId: 'it',
    countryName: 'Italy',
    region: 'Europe',
    status: 'completed',
    progressPct: 100,
    teaser: 'From the Colosseum to Tuscan vineyards — bellissimo!',
    lastLessonTitle: 'Culture: Art & Architecture',
  },
  {
    countryId: 'br',
    countryName: 'Brazil',
    region: 'South America',
    status: 'not_started',
    progressPct: 0,
    teaser: 'Explore the Amazon, Carnival, and football culture.',
  },
];

/* --------------------------------------------------------------------------
   Mock: Full Dashboard Response
   -------------------------------------------------------------------------- */

export const MOCK_DASHBOARD: DashboardResponse = {
  user: MOCK_USER_STATS,
  activeCountries: MOCK_COUNTRIES,
};

/* --------------------------------------------------------------------------
   Simulated Async Fetcher
   Builds activeCountries from localStorage (Learn button) + catalog.
   If no learning countries yet, returns default mock (jp, it, br).
   -------------------------------------------------------------------------- */

const SIMULATED_DELAY_MS = 600;
const DEFAULT_LEARNING_CODES = ['jp', 'it', 'br'];

function buildActiveCountries(): CountryProgress[] {
  const learned = getLearningCountryCodes();
  const allCodes =
    learned.length > 0
      ? [...new Set([...DEFAULT_LEARNING_CODES, ...learned])]
      : DEFAULT_LEARNING_CODES;

  return allCodes.map((code): CountryProgress => {
    const existing = MOCK_COUNTRIES.find((c) => c.countryId === code);
    if (existing) return structuredClone(existing);

    const catalogEntry = getCountryByCode(code);
    if (catalogEntry) {
      return {
        countryId: catalogEntry.code,
        countryName: catalogEntry.name,
        region: catalogEntry.region,
        status: 'not_started',
        progressPct: 0,
        teaser: catalogEntry.description,
      };
    }

    return {
      countryId: code,
      countryName: code.toUpperCase(),
      region: 'Asia',
      status: 'not_started',
      progressPct: 0,
      teaser: '',
    };
  });
}

export function fetchMockDashboard(): Promise<DashboardResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeCountries = buildActiveCountries();
      resolve({
        user: structuredClone(MOCK_USER_STATS),
        activeCountries,
      });
    }, SIMULATED_DELAY_MS);
  });
}
