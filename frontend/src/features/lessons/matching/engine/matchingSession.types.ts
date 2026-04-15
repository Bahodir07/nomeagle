import type { MatchingSide } from '../types';

export interface WrongPairAttempt {
    leftId: string;
    rightId: string;
}

export interface MatchingSessionState {
    selectedLeftId: string | undefined;
    selectedRightId: string | undefined;
    matchedPairIds: string[];
    wrongPairAttempt: WrongPairAttempt | null;
    completed: boolean;
    totalPairs: number;
    attempts: number;
    mistakes: number;
}

export interface MatchingProgress {
    matched: number;
    total: number;
    pct: number;
    attempts: number;
    mistakes: number;
}

export interface SelectionResult {
    state: MatchingSessionState;
    side: MatchingSide;
    shouldTryMatch: boolean;
}
