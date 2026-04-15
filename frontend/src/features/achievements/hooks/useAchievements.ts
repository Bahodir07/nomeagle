import { useMemo } from "react";
import type { BadgeCategory, BadgeDefinition, BadgeStatus } from "../types";
import { BADGE_DEFINITIONS } from "../config";
import { evaluateBadges } from "../engine";
import { MOCK_ACHIEVEMENTS_CONTEXT } from "../mock/achievementsContext.mock";

/**
 * Badge status merged with definition fields for UI (title, images, etc.).
 */
export interface BadgeWithDefinition extends BadgeStatus {
  category: BadgeCategory;
  title: string;
  description: string;
  requirementText: string;
  unlockedImage: string;
  lockedImage: string;
  order: number;
}

export interface GroupedBadges {
  explorer: BadgeWithDefinition[];
  country: BadgeWithDefinition[];
  mastery: BadgeWithDefinition[];
  streak: BadgeWithDefinition[];
}

export interface AchievementsSummary {
  unlockedCount: number;
  totalCount: number;
  currentStreakDays: number;
  completedCountriesCount: number;
}

export interface UseAchievementsReturn {
  badges: BadgeWithDefinition[];
  groupedByCategory: GroupedBadges;
  summary: AchievementsSummary;
}

function mergeStatusWithDefinition(
  status: BadgeStatus,
  definition: BadgeDefinition
): BadgeWithDefinition {
  return {
    ...status,
    category: definition.category,
    title: definition.title,
    description: definition.description,
    requirementText: definition.requirementText,
    unlockedImage: definition.unlockedImage,
    lockedImage: definition.lockedImage,
    order: definition.order,
  };
}

function groupByCategory(
  badges: BadgeWithDefinition[]
): GroupedBadges {
  const order = (a: BadgeWithDefinition, b: BadgeWithDefinition) =>
    a.order - b.order;
  const explorer = badges.filter((b) => b.category === "explorer").sort(order);
  const country = badges.filter((b) => b.category === "country").sort(order);
  const mastery = badges.filter((b) => b.category === "mastery").sort(order);
  const streak = badges.filter((b) => b.category === "streak").sort(order);
  return { explorer, country, mastery, streak };
}

/**
 * Provides badge statuses with definitions merged, and grouped by category.
 * Uses mock context; replace with API/context when available.
 */
export function useAchievements(): UseAchievementsReturn {
  const context = MOCK_ACHIEVEMENTS_CONTEXT;

  return useMemo(() => {
    const statuses = evaluateBadges(BADGE_DEFINITIONS, context);
    const defById = new Map(BADGE_DEFINITIONS.map((d) => [d.id, d]));
    const badges: BadgeWithDefinition[] = statuses.map((status) => {
      const definition = defById.get(status.id);
      if (!definition) {
        throw new Error(`Missing definition for badge: ${status.id}`);
      }
      return mergeStatusWithDefinition(status, definition);
    });
    const groupedByCategory = groupByCategory(badges);
    const summary: AchievementsSummary = {
      unlockedCount: badges.filter((b) => b.unlocked).length,
      totalCount: badges.length,
      currentStreakDays: context.currentStreakDays,
      completedCountriesCount: context.completedCountriesCount,
    };
    return { badges, groupedByCategory, summary };
  }, []);
}
