import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './MatchingLessonPlayer.module.css';
import type { MatchingLesson, MatchingSide } from '../../types';
import type { MatchingSessionState } from '../../engine/matchingSession.types';
import {
    createMatchingSession,
    selectItem,
    tryMatch,
    clearWrongAttempt,
    getProgress,
} from '../../engine/matchingSession.utils';
import { MatchingBoard } from '../MatchingBoard';
import { MatchingProgressBar } from '../MatchingProgressBar';
import { MatchingCompleteBanner } from '../MatchingCompleteBanner';

const WRONG_FLASH_MS = 500;

export interface MatchingLessonResult {
    lessonId: string;
    totalPairs: number;
    attempts: number;
    mistakes: number;
    xpEarned: number;
}

export interface MatchingLessonPlayerProps {
    lesson: MatchingLesson;
    onComplete?: (result: MatchingLessonResult) => void;
}

export const MatchingLessonPlayer: React.FC<MatchingLessonPlayerProps> = ({
    lesson,
    onComplete,
}) => {
    const [session, setSession] = useState<MatchingSessionState>(() =>
        createMatchingSession(lesson),
    );

    const wrongTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const progress = useMemo(
        () => getProgress(session, lesson),
        [session, lesson],
    );

    const xpEarned = lesson.xpReward;

    useEffect(() => {
        return () => {
            if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
        };
    }, []);

    const handleSelectItem = useCallback(
        (itemId: string, side: MatchingSide) => {
            setSession((prev) => {
                if (wrongTimerRef.current) {
                    clearTimeout(wrongTimerRef.current);
                    wrongTimerRef.current = undefined;
                }

                const result = selectItem(prev, itemId, side, lesson);
                let next = result.state;

                if (result.shouldTryMatch) {
                    next = tryMatch(next, lesson);

                    if (next.wrongPairAttempt) {
                        wrongTimerRef.current = setTimeout(() => {
                            setSession((s) => clearWrongAttempt(s));
                            wrongTimerRef.current = undefined;
                        }, WRONG_FLASH_MS);
                    }
                }

                return next;
            });
        },
        [lesson],
    );

    const handleNext = useCallback(() => {
        onComplete?.({
            lessonId: lesson.lessonId,
            totalPairs: lesson.pairs.length,
            attempts: session.attempts,
            mistakes: session.mistakes,
            xpEarned,
        });
    }, [lesson, session.attempts, session.mistakes, xpEarned, onComplete]);

    useEffect(() => {
        if (!session.completed) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [session.completed, handleNext]);

    if (lesson.pairs.length === 0) {
        return <div className={styles.empty}>This lesson has no pairs.</div>;
    }

    if (session.completed) {
        return (
            <div className={styles.player}>
                <MatchingCompleteBanner
                    progress={progress}
                    xpEarned={xpEarned}
                    onNext={handleNext}
                />
            </div>
        );
    }

    return (
        <div className={styles.player}>
            <div className={styles.card}>
                <h1 className={styles.title}>{lesson.title}</h1>
                <MatchingBoard
                    lesson={lesson}
                    session={session}
                    onSelectItem={handleSelectItem}
                />
                <MatchingProgressBar progress={progress} />
            </div>
        </div>
    );
};
