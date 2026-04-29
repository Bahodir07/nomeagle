import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
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

const optionContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const optionItemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

export const QuizLessonPlayer: React.FC<QuizLessonPlayerProps> = ({
    lesson,
    onComplete,
}) => {
    const [session, setSession] = useState<QuizSessionState>(() =>
        createSession(lesson),
    );
    const [displayedXp, setDisplayedXp] = useState(0);
    const xpAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const question = useMemo(
        () => getCurrentQuestion(lesson, session),
        [lesson, session],
    );

    const completed = isComplete(session);
    const answeredCount = session.checked ? session.questionIndex + 1 : session.questionIndex;
    const progressPct = (answeredCount / session.totalCount) * 100;
    const finalXp = session.correctCount * lesson.xpPerCorrect;

    // Animate XP counter on completion
    useEffect(() => {
        if (!completed || finalXp === 0) return;
        const ratio = session.correctCount / session.totalCount;
        if (ratio >= 0.6) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.55 } });
        }
        let current = 0;
        const step = Math.max(1, Math.ceil(finalXp / 40));
        xpAnimRef.current = setInterval(() => {
            current = Math.min(current + step, finalXp);
            setDisplayedXp(current);
            if (current >= finalXp && xpAnimRef.current) {
                clearInterval(xpAnimRef.current);
            }
        }, 20);
        return () => { if (xpAnimRef.current) clearInterval(xpAnimRef.current); };
    }, [completed]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setSession((prev) => nextQuestion(prev));
    }, []);

    const handleComplete = useCallback(() => {
        onComplete?.({
            lessonId: lesson.lessonId,
            correctCount: session.correctCount,
            totalCount: session.totalCount,
            xpEarned: finalXp,
            answers: session.answers,
        });
    }, [lesson, session.correctCount, session.totalCount, session.answers, finalXp, onComplete]);

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
                <motion.div
                    className={styles.summaryCard}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                >
                    <h2 className={styles.summaryTitle}>Quiz Complete</h2>
                    <p className={styles.summaryScore}>
                        {session.correctCount} / {session.totalCount} correct
                    </p>
                    <p className={styles.summaryXp}>
                        +{displayedXp} XP earned
                    </p>
                    <button
                        type="button"
                        className={styles.finishBtn}
                        onClick={handleComplete}
                    >
                        Finish
                    </button>
                </motion.div>
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
                <AnimatePresence mode="wait">
                    <motion.div
                        key={session.questionIndex}
                        className={styles.questionArea}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                    >
                        <p className={styles.questionCounter}>
                            Question {session.questionIndex + 1} / {session.totalCount}
                        </p>

                        <h2 className={styles.prompt}>{question.prompt}</h2>

                        {question.imageUrl && (
                            <img
                                className={styles.questionImage}
                                src={question.imageUrl}
                                alt={question.imageAlt ?? ""}
                            />
                        )}

                        <motion.div
                            className={styles.optionsGrid}
                            role="radiogroup"
                            aria-label="Answer options"
                            variants={optionContainerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {question.options.map((opt) => {
                                const optState = deriveOptionState(
                                    opt.id,
                                    session,
                                    question.correctOptionId,
                                );
                                return (
                                    <motion.div key={opt.id} variants={optionItemVariants}>
                                        <AnswerOption
                                            text={opt.text}
                                            selected={session.selectedOptionId === opt.id}
                                            disabled={session.checked}
                                            state={optState}
                                            onClick={() => handleSelect(opt.id)}
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

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
