import type { AchievementsContext } from "../types";

/**
 * Mock achievement context for UI development.
 * Unlocks: first-step (1 country), streak-3 (3-day streak).
 * Keeps locked: cultural-traveler (need 3), kz-scholar (KZ not completed), perfect-quiz (0 perfect).
 */
export const MOCK_ACHIEVEMENTS_CONTEXT: AchievementsContext = {
  completedCountriesCount: 1,
  completedCountryCodes: ["jp"],
  currentStreakDays: 3,
  bestStreakDays: 3,
  perfectQuizCount: 0,
  lastQuizScorePct: 72,
  completedLessonsByCountry: {
    jp: 8,
  },
  totalLessonsByCountry: {
    jp: 12,
  },
};
