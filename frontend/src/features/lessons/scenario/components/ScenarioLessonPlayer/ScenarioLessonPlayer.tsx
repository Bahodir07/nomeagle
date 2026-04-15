import React, { useState, useCallback, useMemo } from 'react';
import styles from './ScenarioLessonPlayer.module.css';
import type { ScenarioLesson } from '../../types';
import {
    createSession,
    selectChoice,
    evaluateChoice,
    nextStep,
    dismissWrong,
    getCurrentStep,
    getFeedbackMessage,
} from '../../engine/scenarioSession.utils';
import type { ScenarioSessionState } from '../../engine/scenarioSession.types';
import { ScenarioIntro } from '../ScenarioIntro';
import { ScenarioDecision } from '../ScenarioDecision';
import { ScenarioFeedbackModal } from '../ScenarioFeedbackModal';
import { ScenarioComplete } from '../ScenarioComplete';

export interface ScenarioLessonResult {
    lessonId: string;
    correctCount: number;
    totalSteps: number;
    xpEarned: number;
}

export interface ScenarioLessonPlayerProps {
    lesson: ScenarioLesson;
    onComplete?: (result: ScenarioLessonResult) => void;
}

type Phase = 'intro' | 'playing' | 'complete';

export const ScenarioLessonPlayer: React.FC<ScenarioLessonPlayerProps> = ({
    lesson,
    onComplete,
}) => {
    const [phase, setPhase] = useState<Phase>('intro');
    const [session, setSession] = useState<ScenarioSessionState>(() =>
        createSession(lesson),
    );

    const currentStep = useMemo(
        () => getCurrentStep(lesson, session),
        [lesson, session],
    );

    const feedbackMessage = useMemo(
        () => getFeedbackMessage(lesson, session),
        [lesson, session],
    );

    const handleStart = useCallback(() => {
        setPhase('playing');
    }, []);

    const handleChoice = useCallback(
        (choiceId: string) => {
            setSession((prev) => {
                const selected = selectChoice(prev, choiceId);
                return evaluateChoice(selected, lesson);
            });
        },
        [lesson],
    );

    const handleContinue = useCallback(() => {
        if (session.feedbackType === 'correct') {
            setSession((prev) => {
                const next = nextStep(prev);
                if (next.finished) {
                    setPhase('complete');
                }
                return next;
            });
        } else if (session.feedbackType === 'wrong') {
            setSession((prev) => dismissWrong(prev));
        }
    }, [session.feedbackType]);

    const handleComplete = useCallback(() => {
        onComplete?.({
            lessonId: lesson.lessonId,
            correctCount: session.correctCount,
            totalSteps: session.totalSteps,
            xpEarned: lesson.xpReward,
        });
    }, [lesson, session.correctCount, session.totalSteps, onComplete]);

    if (phase === 'intro') {
        return (
            <div className={styles.container}>
                <ScenarioIntro lesson={lesson} onStart={handleStart} />
            </div>
        );
    }

    if (phase === 'complete') {
        return (
            <div className={styles.container}>
                <ScenarioComplete
                    correctCount={session.correctCount}
                    totalSteps={session.totalSteps}
                    onContinue={handleComplete}
                />
            </div>
        );
    }

    if (!currentStep) return null;

    return (
        <div className={styles.container}>
            <ScenarioDecision
                step={currentStep}
                onChoice={handleChoice}
            />

            {session.feedbackType && feedbackMessage && (
                <ScenarioFeedbackModal
                    variant={session.feedbackType}
                    message={feedbackMessage}
                    onContinue={handleContinue}
                />
            )}
        </div>
    );
};
