/* ==========================================================================
   NomEagle — Core Domain Models
   Single source of truth for shared data types across the app.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Enums & Unions
   -------------------------------------------------------------------------- */

/** Geographic region of a country */
export type Region =
    | 'Asia'
    | 'Europe'
    | 'Africa'
    | 'North America'
    | 'South America'
    | 'Oceania'
    | string;

/** Learning status for a country card */
export type CountryStatus = 'not_started' | 'in_progress' | 'completed';

/* --------------------------------------------------------------------------
   User Stats
   -------------------------------------------------------------------------- */

/** Aggregate statistics shown on the dashboard right-hand column */
export interface UserStats {
    /** Total experience points earned */
    xp: number;
    /** Current level (derived from xp) */
    level: number;
    /** XP required to reach the next level */
    xpToNextLevel: number;
    /** Consecutive days the user has practised */
    streakDays: number;
    /** Overall answer accuracy (0–100) */
    accuracy: number;
    /** Lesson completion percentage (0–100) */
    lessonsCompletedPct: number;
    /** Minutes practised today */
    timeTodayMinutes: number;
    /** Minutes practised this week */
    timeWeekMinutes: number;
    /** Total minutes practised all-time */
    timeTotalMinutes: number;
    /** True for each Mon–Sun day this week where the user completed at least one lesson */
    weekProgress?: boolean[];
}

/* --------------------------------------------------------------------------
   Country Progress
   -------------------------------------------------------------------------- */

/** A single country shown on the dashboard */
export interface CountryProgress {
    /** Unique identifier, backend currently sends country slug here */
    countryId: string;
    /** Display name */
    countryName: string;
    /** Geographic region */
    region: Region;
    /** Current learning status */
    status: CountryStatus;
    /** Completion percentage (0–100) */
    progressPct: number;
    /** Short teaser sentence shown on the card */
    teaser: string;
    /** Title of the last completed / current lesson */
    lastLessonTitle?: string | null;

    /** Relative storage path from backend, if present */
    flagPath?: string | null;
    /** Full image URL for the flag */
    flagUrl?: string | null;
    /** Emoji fallback if image is missing */
    flagEmoji?: string | null;
}

/* --------------------------------------------------------------------------
   Country Data Model
   -------------------------------------------------------------------------- */

/** Fully detailed country record mapped from Laravel API */
export interface Country {
    id: number;
    slug: string;
    name: string;
    region: Region;
    description: string | null;
    flagPath: string | null;
    flagUrl: string | null;
    isActive: boolean;
    ethnicGroups?: string[];
    createdAt: string;
    updatedAt: string;
}