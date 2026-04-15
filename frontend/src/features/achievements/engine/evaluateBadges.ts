import type {
  BadgeDefinition,
  BadgeStatus,
  AchievementsContext,
} from "../types";
import { evaluateRule } from "./rules";

/**
 * Deterministic, pure badge evaluation. No UI, no side effects.
 * Returns one BadgeStatus per definition with unlocked flag and optional progress.
 */
export function evaluateBadges(
  definitions: BadgeDefinition[],
  context: AchievementsContext
): BadgeStatus[] {
  return definitions.map((def) => {
    const result = evaluateRule(context, def.logic);
    const status: BadgeStatus = {
      id: def.id,
      unlocked: result.satisfied,
      progress: result.progress,
    };
    return status;
  });
}
