/**
 * NomEagle Lesson Roadmap (Country Course) — Data model
 * Country -> Modules (sections) -> Lessons (cards)
 */

export type LessonType =
    | "video"
    | "article"
    | "scenario"
    | "flashcards"
    | "quiz"
    | "summary"
    | "matching"
    | "open_response";

export type LessonStatus = "locked" | "available" | "completed";

export interface Lesson {
    id: string;
    index: number;
    moduleId: string;
    type: LessonType;
    title: string;
    shortLabel: string;
    status: LessonStatus;
    starsEarned?: 0 | 1 | 2 | 3 | 4 | 5;
    xpReward: number;
    estimatedMinutes?: number | null;

    /** backend ids/slugs for future real lesson routing */
    db_id?: number;
    slug?: string;
    moduleSlug?: string;
}

export interface Module {
    id: string;
    title: string;
    rangeLabel: string;
    lessonIds: string[];

    /** backend ids/slugs for future routing */
    db_id?: number;
    slug?: string;
}

export interface CountryCourse {
    countryCode: string;
    countrySlug?: string;
    countryName: string;

    /** Optional flag data if you later want to use it in the header */
    flagPath?: string | null;
    flagUrl?: string | null;
    flagEmoji?: string | null;

    totalLessons: number;
    progressPct: number;
    starsTotal: number;
    pointsTotal: number;
    modules: Module[];
    lessons: Record<string, Lesson>;
}