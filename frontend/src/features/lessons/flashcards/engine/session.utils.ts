import type { Flashcard } from '../types';
import type {
    CardRating,
    SessionCard,
    SessionState,
    SessionProgress,
} from './session.types';

/* -----------------------------------------------------------------------
   Seeded PRNG (mulberry32) — deterministic shuffle for testability
   ----------------------------------------------------------------------- */

function mulberry32(seed: number): () => number {
    let s = seed | 0;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Fisher-Yates shuffle using a seeded PRNG.
 * Returns a new array — never mutates the input.
 */
function seededShuffle<T>(items: readonly T[], seed: number): T[] {
    const arr = [...items];
    const rand = mulberry32(seed);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/* -----------------------------------------------------------------------
   Session lifecycle
   ----------------------------------------------------------------------- */

/**
 * Create a new flashcard session from a set of cards.
 * Cards are shuffled deterministically when a `seed` is provided,
 * or randomly if omitted.
 */
export function createSession(
    cards: readonly Flashcard[],
    seed?: number,
): SessionState {
    const effectiveSeed = seed ?? Math.floor(Math.random() * 2147483647);
    const shuffled = seededShuffle(cards, effectiveSeed);

    const queue: SessionCard[] = shuffled.map((card) => ({
        card,
        timesShown: 0,
        mistakes: 0,
        mastered: false,
    }));

    if (queue.length > 0) {
        queue[0] = { ...queue[0], timesShown: 1 };
    }

    return {
        queue,
        completed: [],
        totalCards: cards.length,
        isFlipped: false,
        isComplete: queue.length === 0,
    };
}

/**
 * Flip the current card to reveal its back.
 * No-op if already flipped or session is complete.
 */
export function flipCard(state: SessionState): SessionState {
    if (state.isFlipped || state.isComplete) return state;
    return { ...state, isFlipped: true };
}

/**
 * Rate the current card and advance the session.
 *
 * - again  → card re-enters the queue 2 positions ahead
 * - good   → card leaves the queue (completed)
 * - easy   → card leaves the queue (completed + mastered)
 */
export function rateCard(
    state: SessionState,
    rating: CardRating,
): SessionState {
    if (!state.isFlipped || state.isComplete || state.queue.length === 0) {
        return state;
    }

    const [current, ...rest] = state.queue;
    let newQueue: SessionCard[];
    let newCompleted = state.completed;

    switch (rating) {
        case 'again': {
            const updated: SessionCard = {
                ...current,
                mistakes: current.mistakes + 1,
            };
            newQueue = [...rest];
            const insertAt = Math.min(2, newQueue.length);
            newQueue.splice(insertAt, 0, updated);
            break;
        }
        case 'good': {
            newQueue = [...rest];
            newCompleted = [...state.completed, { ...current, mastered: false }];
            break;
        }
        case 'easy': {
            newQueue = [...rest];
            newCompleted = [...state.completed, { ...current, mastered: true }];
            break;
        }
    }

    if (newQueue.length > 0) {
        newQueue[0] = { ...newQueue[0], timesShown: newQueue[0].timesShown + 1 };
    }

    return {
        queue: newQueue,
        completed: newCompleted,
        totalCards: state.totalCards,
        isFlipped: false,
        isComplete: newQueue.length === 0,
    };
}

/**
 * Derive a progress snapshot from the current session state.
 */
export function getProgress(state: SessionState): SessionProgress {
    const masteredCount = state.completed.filter((c) => c.mastered).length;
    const completedCount = state.completed.length;

    const allMistakes =
        state.completed.reduce((sum, c) => sum + c.mistakes, 0) +
        state.queue.reduce((sum, c) => sum + c.mistakes, 0);

    return {
        index: completedCount + (state.isComplete ? 0 : 1),
        total: state.totalCards,
        masteredPct:
            state.totalCards > 0
                ? Math.round((masteredCount / state.totalCards) * 100)
                : 0,
        remaining: state.queue.length,
        mistakes: allMistakes,
    };
}
