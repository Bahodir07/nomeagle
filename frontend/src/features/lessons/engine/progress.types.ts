import type { LessonStatus } from "../types";

/**
 * User's progress within a single country course.
 * Stored / persisted externally (localStorage, API, etc.).
 * The engine never mutates this directly -- it produces new derived state.
 */
export interface UserCourseProgress {
  /** Lesson IDs the user has completed (order does not matter). */
  completedLessonIds: string[];

  /** Stars the user earned per lesson (0-5). Only completed lessons have entries. */
  starsByLessonId: Record<string, number>;

  /** The lesson the user last opened (may still be in-progress). */
  lastOpenedLessonId?: string;
}

/**
 * Fully resolved status map for every lesson in a course.
 * Computed by the engine from CountryCourse + UserCourseProgress.
 */
export interface ResolvedLessonState {
  id: string;
  status: LessonStatus;
  isCurrent: boolean;
  starsEarned: number;
}

/**
 * Aggregate summary of a user's progress through a course.
 */
export interface CourseSummary {
  /** Number of completed lessons. */
  completedCount: number;

  /** Total lessons in the course. */
  totalCount: number;

  /** 0-100 integer percentage. */
  progressPct: number;

  /** Sum of stars earned across all completed lessons. */
  starsTotal: number;

  /** Sum of xpReward for completed lessons. */
  pointsTotal: number;

  /** ID of the lesson the user should focus on next. */
  currentLessonId: string | null;

  /** IDs of all lessons that are currently unlocked (available or completed). */
  unlockedLessonIds: string[];
}
