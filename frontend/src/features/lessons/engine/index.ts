export type {
  UserCourseProgress,
  ResolvedLessonState,
  CourseSummary,
} from "./progress.types";

export {
  getOrderedLessonIds,
  deriveUnlockedIds,
  resolveCurrentLessonId,
  computeLessonStatuses,
  computeCourseSummary,
  lessonStatusMap,
} from "./progress.utils";
