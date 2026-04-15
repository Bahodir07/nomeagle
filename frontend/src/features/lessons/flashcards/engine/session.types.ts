import type { Flashcard } from '../types';

export type CardRating = 'again' | 'good' | 'easy';

/**
 * Per-card tracking within a session.
 * Kept separate from the Flashcard domain type so the engine
 * never mutates lesson data.
 */
export interface SessionCard {
    card: Flashcard;
    /** How many times this card has been shown (including repeats). */
    timesShown: number;
    /** How many times the user rated "again" on this card. */
    mistakes: number;
    /** Whether the user rated "easy" (counts toward mastery). */
    mastered: boolean;
}

export interface SessionState {
    /** Cards still in the queue (index 0 = current card). */
    queue: SessionCard[];
    /** Cards that have been completed (rated good or easy). */
    completed: SessionCard[];
    /** Total number of unique cards that entered the session. */
    totalCards: number;
    /** Whether the current card is flipped to show the back. */
    isFlipped: boolean;
    /** True when the queue is empty and the session is finished. */
    isComplete: boolean;
}

export interface SessionProgress {
    /** 1-based index of the current card across all unique cards seen. */
    index: number;
    /** Total unique cards in the session. */
    total: number;
    /** 0-100 integer — percentage of cards rated "easy". */
    masteredPct: number;
    /** Cards still left in the queue. */
    remaining: number;
    /** Total "again" ratings across all cards. */
    mistakes: number;
}
