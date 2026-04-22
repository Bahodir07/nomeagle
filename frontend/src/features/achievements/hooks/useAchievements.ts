import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { BadgeCategory, BadgeDefinition, BadgeStatus } from "../types";
import { BADGE_DEFINITIONS } from "../config";
import { evaluateBadges } from "../engine";
import { getAchievements } from "../../../app/api/achievements";

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
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
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

function groupByCategory(badges: BadgeWithDefinition[]): GroupedBadges {
  const order = (a: BadgeWithDefinition, b: BadgeWithDefinition) =>
    a.order - b.order;
  return {
    explorer: badges.filter((b) => b.category === "explorer").sort(order),
    country: badges.filter((b) => b.category === "country").sort(order),
    mastery: badges.filter((b) => b.category === "mastery").sort(order),
    streak: badges.filter((b) => b.category === "streak").sort(order),
  };
}

const EMPTY_GROUPED: GroupedBadges = {
  explorer: [],
  country: [],
  mastery: [],
  streak: [],
};

export function useAchievements(): UseAchievementsReturn {
  const { data: context, isLoading, isError, refetch } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });

  return useMemo(() => {
    if (!context) {
      return {
        badges: [],
        groupedByCategory: EMPTY_GROUPED,
        summary: {
          unlockedCount: 0,
          totalCount: BADGE_DEFINITIONS.length,
          currentStreakDays: 0,
          completedCountriesCount: 0,
        },
        isLoading,
        isError,
        refetch,
      };
    }

    const statuses = evaluateBadges(BADGE_DEFINITIONS, context);
    const defById = new Map(BADGE_DEFINITIONS.map((d) => [d.id, d]));
    const badges: BadgeWithDefinition[] = statuses.map((status) => {
      const definition = defById.get(status.id)!;
      return mergeStatusWithDefinition(status, definition);
    });

    return {
      badges,
      groupedByCategory: groupByCategory(badges),
      summary: {
        unlockedCount: badges.filter((b) => b.unlocked).length,
        totalCount: badges.length,
        currentStreakDays: context.currentStreakDays,
        completedCountriesCount: context.completedCountriesCount,
      },
      isLoading,
      isError,
      refetch,
    };
  }, [context, isLoading, isError, refetch]);
}
