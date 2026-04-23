import type { AchievementsContext, BadgeRule, BadgeRuleType } from "../types";

/** All supported rule type names for validation/documentation. */
export const RULE_TYPES: readonly BadgeRuleType[] = [
  "countries_completed_at_least",
  "has_completed_country",
  "streak_at_least",
  "perfect_quiz_at_least",
  "last_quiz_score_at_least",
] as const;

export interface RuleResult {
  satisfied: boolean;
  progress?: { current: number; target: number };
}

/**
 * Pure, deterministic rule evaluation. No side effects.
 */
function evaluateCountriesCompletedAtLeast(
  context: AchievementsContext,
  value: number
): RuleResult {
  const current = context.completedCountriesCount;
  const target = value;
  return {
    satisfied: current >= target,
    progress: { current, target },
  };
}

function evaluateHasCompletedCountry(
  context: AchievementsContext,
  value: string
): RuleResult {
  const iso2 = String(value).toLowerCase();
  const completed = context.completedCountryCodes.some(
    (c) => c.toLowerCase() === iso2
  );
  return {
    satisfied: completed,
    progress: { current: completed ? 1 : 0, target: 1 },
  };
}

function evaluateStreakAtLeast(
  context: AchievementsContext,
  value: number
): RuleResult {
  const current = Math.max(
    context.currentStreakDays,
    context.bestStreakDays
  );
  const target = value;
  return {
    satisfied: current >= target,
    progress: { current, target },
  };
}

function evaluatePerfectQuizAtLeast(
  context: AchievementsContext,
  value: number
): RuleResult {
  const current = context.perfectQuizCount;
  const target = value;
  return {
    satisfied: current >= target,
    progress: { current, target },
  };
}

function evaluateLastQuizScoreAtLeast(
  context: AchievementsContext,
  value: number
): RuleResult {
  const score = context.lastQuizScorePct ?? 0;
  const target = value;
  return {
    satisfied: score >= target,
    progress: { current: score, target },
  };
}

/**
 * Evaluate a single rule against context. Deterministic and pure.
 */
export function evaluateRule(
  context: AchievementsContext,
  rule: BadgeRule
): RuleResult {
  switch (rule.type) {
    case "countries_completed_at_least":
      return evaluateCountriesCompletedAtLeast(
        context,
        typeof rule.value === "number" ? rule.value : Number(rule.value)
      );
    case "has_completed_country":
      return evaluateHasCompletedCountry(
        context,
        typeof rule.value === "string" ? rule.value : String(rule.value)
      );
    case "streak_at_least":
      return evaluateStreakAtLeast(
        context,
        typeof rule.value === "number" ? rule.value : Number(rule.value)
      );
    case "perfect_quiz_at_least":
      return evaluatePerfectQuizAtLeast(
        context,
        typeof rule.value === "number" ? rule.value : Number(rule.value)
      );
    case "last_quiz_score_at_least":
      return evaluateLastQuizScoreAtLeast(
        context,
        typeof rule.value === "number" ? rule.value : Number(rule.value)
      );
    default:
      return { satisfied: false };
  }
}
