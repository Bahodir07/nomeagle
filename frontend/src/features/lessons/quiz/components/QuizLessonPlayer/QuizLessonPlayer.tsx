import React, { useState, useCallback, useMemo } from 'react';
import styles from './QuizLessonPlayer.module.css';
import type { QuizLesson } from '../../types';
import type { QuizAnswer, QuizSessionState } from '../../engine/quizSession.types';
import {
    createSession,
    selectOption,
    checkAnswer,
    nextQuestion,
    getCurrentQuestion,
    isComplete,
} from '../../engine/quizSession.utils';
import { AnswerOption } from '../AnswerOption';
import type { AnswerOptionState } from '../AnswerOption';
import { RightSidePanel } from '../RightSidePanel';
import { QuizBottomBar } from '../QuizBottomBar';
import { FeedbackBanner } from '../FeedbackBanner';
import type { FeedbackVariant } from '../FeedbackBanner';

export interface QuizLessonResult {
    lessonId: string;
    correctCount: number;
    totalCount: number;
    xpEarned: number;
    answers: QuizAnswer[];
}

export interface QuizLessonPlayerProps {
    lesson: QuizLesson;
    onComplete?: (result: QuizLessonResult) => void;
}

function deriveOptionState(
    optionId: string,
    session: QuizSessionState,
    correctOptionId: string,
): AnswerOptionState {
    if (!session.checked) {
        return session.selectedOptionId === optionId ? 'selected' : 'neutral';
    }
    if (optionId === correctOptionId) return 'correct';
    if (optionId === session.selectedOptionId) return 'wrong';
    return 'neutral';
}

function deriveFeedback(
    session: QuizSessionState,
    correctOptionId: string,
): { variant: FeedbackVariant; text: string } {
    if (!session.checked) return { variant: 'hidden', text: '' };
    const wasCorrect = session.selectedOptionId === correctOptionId;
    return wasCorrect
        ? { variant: 'correct', text: 'Good job!' }
        : { variant: 'wrong', text: "You've missed this one." };
}

export const QuizLessonPlayer: React.FC<QuizLessonPlayerProps> = ({
    lesson,
    onComplete,
}) => {
    const [session, setSession] = useState<QuizSessionState>(() =>
        createSession(lesson),
    );

    const question = useMemo(
        () => getCurrentQuestion(lesson, session),
        [lesson, session],
    );

    const completed = isComplete(session);
    const answeredCount = session.checked ? session.questionIndex + 1 : session.questionIndex;
    const progressPct = (answeredCount / session.totalCount) * 100;

    const handleSelect = useCallback(
        (optionId: string) => {
            setSession((prev) => selectOption(prev, optionId));
        },
        [],
    );

    const handleCheck = useCallback(() => {
        setSession((prev) => checkAnswer(prev, lesson));
    }, [lesson]);

    const handleNext = useCallback(() => {
        setSession((prev) => {
            const next = nextQuestion(prev);
            if (next.questionIndex >= next.totalCount) {
                return next;
            }
            return next;
        });
    }, []);

    const handleComplete = useCallback(() => {
        onComplete?.({
            lessonId: lesson.lessonId,
            correctCount: session.correctCount,
            totalCount: session.totalCount,
            xpEarned: session.correctCount * lesson.xpPerCorrect,
            answers: session.answers,
        });
    }, [lesson, session.correctCount, session.totalCount, session.answers, onComplete]);

    if (lesson.questions.length === 0) {
        return (
            <div className={styles.container}>
                <p className={styles.empty}>This lesson has no questions.</p>
            </div>
        );
    }

    if (completed) {
        return (
            <div className={styles.container}>
                <div className={styles.summaryCard}>
                    <h2 className={styles.summaryTitle}>Quiz Complete</h2>
                    <p className={styles.summaryScore}>
                        {session.correctCount} / {session.totalCount} correct
                    </p>
                    <p className={styles.summaryXp}>
                        +{session.correctCount * lesson.xpPerCorrect} XP earned
                    </p>
                    <button
                        type="button"
                        className={styles.finishBtn}
                        onClick={handleComplete}
                    >
                        Finish
                    </button>
                </div>
            </div>
        );
    }

    if (!question) return null;

    const feedback = deriveFeedback(session, question.correctOptionId);

    return (
        <div className={styles.container}>
            <div className={styles.sidePanel}>
                <RightSidePanel
                    correctCount={session.correctCount}
                    totalCount={session.totalCount}
                />
            </div>

            <div className={styles.main}>
                <div className={styles.questionArea}>
                    <h2 className={styles.prompt}>{question.prompt}</h2>

                    <div
                        className={styles.optionsGrid}
                        role="radiogroup"
                        aria-label="Answer options"
                    >
                        {question.options.map((opt) => {
                            const optState = deriveOptionState(
                                opt.id,
                                session,
                                question.correctOptionId,
                            );
                            return (
                                <AnswerOption
                                    key={opt.id}
                                    text={opt.text}
                                    selected={session.selectedOptionId === opt.id}
                                    disabled={session.checked}
                                    state={optState}
                                    onClick={() => handleSelect(opt.id)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className={styles.feedbackSlot}>
                    <FeedbackBanner variant={feedback.variant} text={feedback.text} />
                </div>
            </div>

            <div className={styles.bottomBar}>
                <QuizBottomBar
                    progressPct={progressPct}
                    mode={session.checked ? 'next' : 'check'}
                    canCheck={session.selectedOptionId !== undefined}
                    onCheck={handleCheck}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
};
