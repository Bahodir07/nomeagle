/**
 * Badge category for grouping achievements.
 */
export type BadgeCategory = "explorer" | "country" | "mastery" | "streak";

/**
 * Rule type names for the evaluation engine.
 */
export type BadgeRuleType =
  | "countries_completed_at_least"
  | "has_completed_country"
  | "streak_at_least"
  | "perfect_quiz_at_least"
  | "last_quiz_score_at_least";

/**
 * Data-driven rule: type + value. Evaluated by the engine against AchievementsContext.
 */
export interface BadgeRule {
  type: BadgeRuleType;
  value: number | string;
}

/**
 * Badge definition: static config for a single achievement.
 */
export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  title: string;
  description: string;
  requirementText: string;
  unlockedImage: string;
  lockedImage: string;
  logic: BadgeRule;
  order: number;
  hiddenUntilNear?: boolean;
}

/**
 * Input data for the badge evaluation engine. Only what the engine needs.
 */
export interface AchievementsContext {
  completedCountriesCount: number;
  completedCountryCodes: string[];
  currentStreakDays: number;
  bestStreakDays: number;
  perfectQuizCount: number;
  lastQuizScorePct?: number;
  completedLessonsByCountry?: Record<string, number>;
  totalLessonsByCountry?: Record<string, number>;
}

/**
 * Result for a single badge from evaluateBadges().
 */
export interface BadgeStatus {
  id: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; target: number };
}

/**
 * User-facing badge state (unlocked or locked).
 */
export interface BadgeState {
  definition: BadgeDefinition;
  unlocked: boolean;
  unlockedAt?: string; // ISO date string
}
