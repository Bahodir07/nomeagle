import type { CountryCourse, LessonStatus } from "../types";
import type {
  UserCourseProgress,
  ResolvedLessonState,
  CourseSummary,
} from "./progress.types";

/**
 * Build a flat ordered array of lesson IDs from a course's module definitions.
 * Order: modules in array order, lessons within each module in array order.
 */
export function getOrderedLessonIds(course: CountryCourse): string[] {
  return course.modules.flatMap((m) => m.lessonIds);
}

/**
 * Determine which lesson IDs are unlocked given the user's completed set.
 *
 * Rules:
 *  - Lesson #1 (first in sequence) is always unlocked.
 *  - A lesson is unlocked if the lesson immediately before it (in global
 *    sequence across all modules) has been completed.
 *  - Completed lessons are implicitly unlocked.
 */
export function deriveUnlockedIds(
  orderedIds: string[],
  completedSet: ReadonlySet<string>
): string[] {
  const unlocked: string[] = [];

  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    const isFirst = i === 0;
    const prevCompleted = i > 0 && completedSet.has(orderedIds[i - 1]);

    if (isFirst || prevCompleted || completedSet.has(id)) {
      unlocked.push(id);
    }
  }

  return unlocked;
}

/**
 * Resolve the current lesson: the first unlocked-but-not-completed lesson,
 * or `lastOpenedLessonId` if it is still available.
 */
export function resolveCurrentLessonId(
  orderedIds: string[],
  completedSet: ReadonlySet<string>,
  unlockedSet: ReadonlySet<string>,
  lastOpenedLessonId?: string
): string | null {
  if (
    lastOpenedLessonId &&
    unlockedSet.has(lastOpenedLessonId) &&
    !completedSet.has(lastOpenedLessonId)
  ) {
    return lastOpenedLessonId;
  }

  for (const id of orderedIds) {
    if (unlockedSet.has(id) && !completedSet.has(id)) {
      return id;
    }
  }

  return null;
}

/**
 * Compute the resolved status for every lesson in a course.
 *
 * Pure function -- no side effects.
 */
export function computeLessonStatuses(
  course: CountryCourse,
  progress: UserCourseProgress
): ResolvedLessonState[] {
  const orderedIds = getOrderedLessonIds(course);
  const completedSet = new Set(progress.completedLessonIds);
  const unlockedIds = deriveUnlockedIds(orderedIds, completedSet);
  const unlockedSet = new Set(unlockedIds);

  const currentId = resolveCurrentLessonId(
    orderedIds,
    completedSet,
    unlockedSet,
    progress.lastOpenedLessonId
  );

  return orderedIds.map((id) => {
    let status: LessonStatus;
    if (completedSet.has(id)) {
      status = "completed";
    } else if (unlockedSet.has(id)) {
      status = "available";
    } else {
      status = "locked";
    }

    return {
      id,
      status,
      isCurrent: id === currentId,
      starsEarned: progress.starsByLessonId[id] ?? 0,
    };
  });
}

/**
 * Compute aggregate course summary from course definition + user progress.
 *
 * Pure function -- no side effects.
 */
export function computeCourseSummary(
  course: CountryCourse,
  progress: UserCourseProgress
): CourseSummary {
  const orderedIds = getOrderedLessonIds(course);
  const completedSet = new Set(progress.completedLessonIds);
  const unlockedIds = deriveUnlockedIds(orderedIds, completedSet);
  const unlockedSet = new Set(unlockedIds);

  const totalCount = orderedIds.length;
  const completedCount = progress.completedLessonIds.filter((id) =>
    orderedIds.includes(id)
  ).length;

  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let starsTotal = 0;
  let pointsTotal = 0;

  for (const id of progress.completedLessonIds) {
    const lesson = course.lessons[id];
    if (!lesson) continue;
    starsTotal += progress.starsByLessonId[id] ?? 0;
    pointsTotal += lesson.xpReward;
  }

  const currentLessonId = resolveCurrentLessonId(
    orderedIds,
    completedSet,
    unlockedSet,
    progress.lastOpenedLessonId
  );

  return {
    completedCount,
    totalCount,
    progressPct,
    starsTotal,
    pointsTotal,
    currentLessonId,
    unlockedLessonIds: unlockedIds,
  };
}

/**
 * Build a Record<string, ResolvedLessonState> from the array for O(1) lookups.
 */
export function lessonStatusMap(
  states: ResolvedLessonState[]
): Record<string, ResolvedLessonState> {
  const map: Record<string, ResolvedLessonState> = {};
  for (const s of states) {
    map[s.id] = s;
  }
  return map;
}
