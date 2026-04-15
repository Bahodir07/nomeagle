import React, { useMemo } from 'react';
import styles from './MatchingBoard.module.css';
import type { MatchingLesson, MatchingSide, MatchingPair } from '../../types';
import type { MatchingSessionState } from '../../engine/matchingSession.types';
import { MatchingItemCard } from '../MatchingItemCard';

export interface MatchingBoardProps {
    lesson: MatchingLesson;
    session: MatchingSessionState;
    onSelectItem: (itemId: string, side: MatchingSide) => void;
}

/**
 * Simple string-to-number hash for deterministic shuffling.
 */
function hashSeed(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return h >>> 0;
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
    const arr = [...items];
    let s = seed | 0;
    const rand = (): number => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const MatchingBoard: React.FC<MatchingBoardProps> = ({
    lesson,
    session,
    onSelectItem,
}) => {
    const leftItems = lesson.pairs;

    const shuffledRight = useMemo(
        () => seededShuffle(lesson.pairs, hashSeed(lesson.lessonId)),
        [lesson.pairs, lesson.lessonId],
    );

    const pairIdForLeft = (pair: MatchingPair) => pair.pairId;
    const pairIdForRight = (pair: MatchingPair) => pair.pairId;

    const isItemMatched = (pairId: string) =>
        session.matchedPairIds.includes(pairId);

    const isItemWrong = (itemId: string) =>
        session.wrongPairAttempt?.leftId === itemId ||
        session.wrongPairAttempt?.rightId === itemId;

    return (
        <div className={styles.board}>
            <p className={styles.instruction}>{lesson.instruction}</p>

            <div className={styles.columns}>
                <div className={styles.column}>
                    <p className={styles.columnLabel}>Action</p>
                    {leftItems.map((pair) => {
                        const matched = isItemMatched(pairIdForLeft(pair));
                        return (
                            <MatchingItemCard
                                key={pair.left.id}
                                text={pair.left.text}
                                imageUrl={pair.left.imageUrl}
                                selected={session.selectedLeftId === pair.left.id}
                                matched={matched}
                                wrong={isItemWrong(pair.left.id)}
                                disabled={matched}
                                onClick={() => onSelectItem(pair.left.id, 'left')}
                            />
                        );
                    })}
                </div>

                <div className={styles.column}>
                    <p className={styles.columnLabel}>Meaning</p>
                    {shuffledRight.map((pair) => {
                        const matched = isItemMatched(pairIdForRight(pair));
                        return (
                            <MatchingItemCard
                                key={pair.right.id}
                                text={pair.right.text}
                                imageUrl={pair.right.imageUrl}
                                selected={session.selectedRightId === pair.right.id}
                                matched={matched}
                                wrong={isItemWrong(pair.right.id)}
                                disabled={matched}
                                onClick={() => onSelectItem(pair.right.id, 'right')}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
