import type { MatchingLesson, MatchingSide } from '../types';
import type {
    MatchingSessionState,
    MatchingProgress,
    SelectionResult,
} from './matchingSession.types';

/**
 * Create a fresh matching session from a lesson.
 */
export function createMatchingSession(
    lesson: MatchingLesson,
): MatchingSessionState {
    return {
        selectedLeftId: undefined,
        selectedRightId: undefined,
        matchedPairIds: [],
        wrongPairAttempt: null,
        completed: false,
        totalPairs: lesson.pairs.length,
        attempts: 0,
        mistakes: 0,
    };
}

/**
 * Select an item on a given side.
 *
 * - Selecting an already-matched item is a no-op.
 * - Selecting the same item again deselects it.
 * - When both sides have a selection after this call,
 *   `shouldTryMatch` is true so the caller can invoke `tryMatch`.
 */
export function selectItem(
    state: MatchingSessionState,
    itemId: string,
    side: MatchingSide,
    lesson: MatchingLesson,
): SelectionResult {
    if (state.completed) {
        return { state, side, shouldTryMatch: false };
    }

    const pairForItem = lesson.pairs.find(
        (p) => p[side].id === itemId,
    );
    if (!pairForItem) {
        return { state, side, shouldTryMatch: false };
    }

    if (state.matchedPairIds.includes(pairForItem.pairId)) {
        return { state, side, shouldTryMatch: false };
    }

    const currentId =
        side === 'left' ? state.selectedLeftId : state.selectedRightId;

    if (currentId === itemId) {
        const next: MatchingSessionState =
            side === 'left'
                ? { ...state, selectedLeftId: undefined, wrongPairAttempt: null }
                : { ...state, selectedRightId: undefined, wrongPairAttempt: null };
        return { state: next, side, shouldTryMatch: false };
    }

    const next: MatchingSessionState =
        side === 'left'
            ? { ...state, selectedLeftId: itemId, wrongPairAttempt: null }
            : { ...state, selectedRightId: itemId, wrongPairAttempt: null };

    const shouldTryMatch =
        next.selectedLeftId !== undefined && next.selectedRightId !== undefined;

    return { state: next, side, shouldTryMatch };
}

/**
 * Attempt to match the two currently selected items.
 * No-op when fewer than two items are selected.
 *
 * - Correct: adds pairId to `matchedPairIds`, clears selection.
 * - Wrong: sets `wrongPairAttempt`, clears selection.
 *   The UI should read `wrongPairAttempt`, run its animation,
 *   then call `clearWrongAttempt`.
 */
export function tryMatch(
    state: MatchingSessionState,
    lesson: MatchingLesson,
): MatchingSessionState {
    const { selectedLeftId, selectedRightId } = state;
    if (selectedLeftId === undefined || selectedRightId === undefined) {
        return state;
    }

    const leftPair = lesson.pairs.find(
        (p) => p.left.id === selectedLeftId,
    );
    const rightPair = lesson.pairs.find(
        (p) => p.right.id === selectedRightId,
    );

    if (!leftPair || !rightPair) {
        return {
            ...state,
            selectedLeftId: undefined,
            selectedRightId: undefined,
        };
    }

    const correct = leftPair.pairId === rightPair.pairId;

    if (correct) {
        const matchedPairIds = [...state.matchedPairIds, leftPair.pairId];
        const completed = matchedPairIds.length === state.totalPairs;
        return {
            ...state,
            selectedLeftId: undefined,
            selectedRightId: undefined,
            matchedPairIds,
            wrongPairAttempt: null,
            completed,
            attempts: state.attempts + 1,
        };
    }

    return {
        ...state,
        selectedLeftId: undefined,
        selectedRightId: undefined,
        wrongPairAttempt: { leftId: selectedLeftId, rightId: selectedRightId },
        attempts: state.attempts + 1,
        mistakes: state.mistakes + 1,
    };
}

/**
 * Clear the wrong-attempt marker after the UI animation finishes.
 */
export function clearWrongAttempt(
    state: MatchingSessionState,
): MatchingSessionState {
    if (!state.wrongPairAttempt) return state;
    return { ...state, wrongPairAttempt: null };
}

/**
 * Check whether a given pair has been matched.
 */
export function isMatched(
    pairId: string,
    state: MatchingSessionState,
): boolean {
    return state.matchedPairIds.includes(pairId);
}

/**
 * Derive a progress snapshot from the current session state.
 */
export function getProgress(
    state: MatchingSessionState,
    lesson: MatchingLesson,
): MatchingProgress {
    const total = lesson.pairs.length;
    const matched = state.matchedPairIds.length;
    return {
        matched,
        total,
        pct: total > 0 ? Math.round((matched / total) * 100) : 0,
        attempts: state.attempts,
        mistakes: state.mistakes,
    };
}
