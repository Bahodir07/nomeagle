export type {
    WrongPairAttempt,
    MatchingSessionState,
    MatchingProgress,
    SelectionResult,
} from './matchingSession.types';

export {
    createMatchingSession,
    selectItem,
    tryMatch,
    clearWrongAttempt,
    isMatched,
    getProgress,
} from './matchingSession.utils';
