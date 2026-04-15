/**
 * Summary lesson — completion screen payload.
 * Use with static mocks today; the same shape maps cleanly to a future API (e.g. GET /lessons/:id/summary).
 */
export interface SummaryLesson {
  lessonId: string;
  title: string;
  summaryText: string;
  imageUrl?: string;
  /** Primary CTA label (e.g. "Finish", "Continue"). Defaults in UI if omitted. */
  buttonLabel?: string;
  xpReward?: number;
}
