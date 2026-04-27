import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BADGE_DEFINITIONS } from "../config";
import { evaluateBadges } from "../engine";
import { getAchievements } from "../../../app/api/achievements";
import { useAuth } from "../../../app/store/auth.store";
import type { BadgeWithDefinition } from "./useAchievements";

const STORAGE_KEY = "ne_seen_badge_ids";

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markSeen(id: string) {
  const seen = getSeenIds();
  seen.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
}

export function useBadgeUnlockNotifier() {
  const { isAuthenticated } = useAuth();
  const [queue, setQueue] = useState<BadgeWithDefinition[]>([]);
  const initializedRef = useRef(false);

  const { data: context } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!context) return;

    const statuses = evaluateBadges(BADGE_DEFINITIONS, context);
    const defById = new Map(BADGE_DEFINITIONS.map((d) => [d.id, d]));
    const seen = getSeenIds();
    const newlyUnlocked: BadgeWithDefinition[] = [];

    for (const status of statuses) {
      if (!status.unlocked) continue;

      // First render: silently mark all current badges as seen, no toast
      if (!initializedRef.current) {
        markSeen(status.id);
        continue;
      }

      if (seen.has(status.id)) continue;

      const def = defById.get(status.id);
      if (!def) continue;

      newlyUnlocked.push({
        ...status,
        category: def.category,
        title: def.title,
        description: def.description,
        requirementText: def.requirementText,
        unlockedImage: def.unlockedImage,
        lockedImage: def.lockedImage,
        order: def.order,
      });

      markSeen(status.id);
    }

    initializedRef.current = true;

    if (newlyUnlocked.length > 0) {
      setQueue((q) => [...q, ...newlyUnlocked]);
    }
  }, [context]);

  const dismiss = () => setQueue((q) => q.slice(1));

  return { current: queue[0] ?? null, dismiss };
}
