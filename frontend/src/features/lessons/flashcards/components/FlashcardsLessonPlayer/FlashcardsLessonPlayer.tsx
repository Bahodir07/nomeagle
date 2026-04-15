import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styles from './FlashcardsLessonPlayer.module.css';
import type { FlashcardsLesson } from '../../types';
import type { CardRating, SessionState } from '../../engine/session.types';
import { createSession, flipCard, rateCard, getProgress } from '../../engine/session.utils';
import { FlashcardView } from '../FlashcardView/FlashcardView';
import { ProgressHeader } from '../ProgressHeader/ProgressHeader';
import { RatingBar } from '../RatingBar/RatingBar';
import { SessionSummary } from '../SessionSummary/SessionSummary';

export interface FlashcardsLessonResult {
    lessonId: string;
    masteredPct: number;
    masteredCount: number;
    totalCards: number;
    mistakes: number;
    xpEarned: number;
}

export interface FlashcardsLessonPlayerProps {
    lesson: FlashcardsLesson;
    onComplete?: (result: FlashcardsLessonResult) => void;
}

export const FlashcardsLessonPlayer: React.FC<FlashcardsLessonPlayerProps> = ({
    lesson,
    onComplete,
}) => {
    const [session, setSession] = useState<SessionState>(() =>
        createSession(lesson.cards),
    );

    const progress = useMemo(() => getProgress(session), [session]);

    const mistakeCards = useMemo(
        () => session.completed.filter((sc) => sc.mistakes > 0).map((sc) => sc.card),
        [session.completed],
    );

    const masteredCount = useMemo(
        () => session.completed.filter((sc) => sc.mastered).length,
        [session.completed],
    );

    const xpEarned = masteredCount * lesson.xpPerCard;

    const handleFlip = useCallback(() => {
        setSession((prev) => flipCard(prev));
    }, []);

    const handleRate = useCallback((rating: CardRating) => {
        setSession((prev) => rateCard(prev, rating));
    }, []);

    const handleRetryMistakes = useCallback(() => {
        if (mistakeCards.length > 0) {
            setSession(createSession(mistakeCards));
        }
    }, [mistakeCards]);

    const handleFinish = useCallback(() => {
        onComplete?.({
            lessonId: lesson.lessonId,
            masteredPct: progress.masteredPct,
            masteredCount,
            totalCards: progress.total,
            mistakes: progress.mistakes,
            xpEarned,
        });
    }, [lesson.lessonId, progress, masteredCount, xpEarned, onComplete]);

    useEffect(() => {
        if (!session.isComplete) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFinish();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [session.isComplete, handleFinish]);

    useEffect(() => {
        if (session.isComplete || session.isFlipped) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }
            if (e.key === ' ') {
                e.preventDefault();
                setSession((prev) => flipCard(prev));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [session.isComplete, session.isFlipped]);

    if (lesson.cards.length === 0) {
        return <div className={styles.empty}>This lesson has no flashcards.</div>;
    }

    if (session.isComplete) {
        return (
            <div className={styles.playerContainer}>
                <SessionSummary
                    masteredPct={progress.masteredPct}
                    masteredCount={masteredCount}
                    totalCards={progress.total}
                    mistakes={progress.mistakes}
                    xpEarned={xpEarned}
                    hasMistakes={mistakeCards.length > 0}
                    onRetryMistakes={handleRetryMistakes}
                    onFinish={handleFinish}
                />
            </div>
        );
    }

    const currentCard = session.queue[0].card;

    return (
        <div className={styles.playerContainer}>
            <ProgressHeader title={lesson.title} progress={progress} />
            <div className={styles.cardArea}>
                <FlashcardView
                    card={currentCard}
                    isFlipped={session.isFlipped}
                    onFlip={handleFlip}
                />
                <RatingBar
                    disabled={!session.isFlipped}
                    onRate={handleRate}
                />
            </div>
        </div>
    );
};
