import type { ScenarioLesson, ScenarioStep } from '../types';
import type { ScenarioSessionState } from './scenarioSession.types';

/**
 * Create a fresh scenario session from a lesson.
 */
export function createSession(lesson: ScenarioLesson): ScenarioSessionState {
    return {
        stepIndex: 0,
        completedSteps: [],
        correctCount: 0,
        finished: false,
        selectedChoiceId: undefined,
        feedbackType: null,
        totalSteps: lesson.steps.length,
    };
}

/**
 * Select a choice. No-op if feedback is already showing.
 */
export function selectChoice(
    state: ScenarioSessionState,
    choiceId: string,
): ScenarioSessionState {
    if (state.feedbackType !== null || state.finished) return state;
    return { ...state, selectedChoiceId: choiceId };
}

/**
 * Evaluate the selected choice against the current step.
 * No-op if nothing is selected or feedback is already showing.
 */
export function evaluateChoice(
    state: ScenarioSessionState,
    lesson: ScenarioLesson,
): ScenarioSessionState {
    if (state.selectedChoiceId === undefined || state.feedbackType !== null) {
        return state;
    }

    const step = lesson.steps[state.stepIndex];
    if (!step) return state;

    const choice = step.choices.find((c) => c.id === state.selectedChoiceId);
    if (!choice) return state;

    if (choice.correct) {
        return {
            ...state,
            feedbackType: 'correct',
            correctCount: state.correctCount + 1,
            completedSteps: [...state.completedSteps, step.id],
        };
    }

    return { ...state, feedbackType: 'wrong' };
}

/**
 * Advance to the next step after a correct answer.
 * If it was the last step, mark the lesson as finished.
 */
export function nextStep(state: ScenarioSessionState): ScenarioSessionState {
    if (state.feedbackType !== 'correct') return state;

    const next = state.stepIndex + 1;
    const finished = next >= state.totalSteps;

    return {
        ...state,
        stepIndex: finished ? state.stepIndex : next,
        selectedChoiceId: undefined,
        feedbackType: null,
        finished,
    };
}

/**
 * Dismiss a wrong-answer popup and let the user retry.
 * Clears the selection so they can pick a different choice.
 */
export function dismissWrong(
    state: ScenarioSessionState,
): ScenarioSessionState {
    if (state.feedbackType !== 'wrong') return state;
    return { ...state, selectedChoiceId: undefined, feedbackType: null };
}

/**
 * Get the current step, or undefined when the lesson is finished.
 */
export function getCurrentStep(
    lesson: ScenarioLesson,
    state: ScenarioSessionState,
): ScenarioStep | undefined {
    if (state.finished) return undefined;
    return lesson.steps[state.stepIndex];
}

/**
 * Get the feedback message for the currently selected choice.
 */
export function getFeedbackMessage(
    lesson: ScenarioLesson,
    state: ScenarioSessionState,
): string | undefined {
    if (state.feedbackType === null || state.selectedChoiceId === undefined) {
        return undefined;
    }

    const step = lesson.steps[state.stepIndex];
    if (!step) return undefined;

    const choice = step.choices.find((c) => c.id === state.selectedChoiceId);
    if (!choice) return undefined;

    return state.feedbackType === 'correct'
        ? choice.correctMessage
        : choice.wrongMessage;
}
