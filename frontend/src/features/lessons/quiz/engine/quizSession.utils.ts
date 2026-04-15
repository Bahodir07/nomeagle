import type { QuizLesson, QuizQuestion } from '../types';
import type { QuizSessionState } from './quizSession.types';

/**
 * Create a fresh quiz session from a lesson.
 */
export function createSession(lesson: QuizLesson): QuizSessionState {
    return {
        questionIndex: 0,
        selectedOptionId: undefined,
        checked: false,
        answers: [],
        correctCount: 0,
        totalCount: lesson.questions.length,
    };
}

/**
 * Select an option. No-op if the answer has already been checked.
 */
export function selectOption(
    state: QuizSessionState,
    optionId: string,
): QuizSessionState {
    if (state.checked) return state;
    return { ...state, selectedOptionId: optionId };
}

/**
 * Check the selected answer against the correct option.
 * No-op if nothing is selected or already checked.
 */
export function checkAnswer(
    state: QuizSessionState,
    lesson: QuizLesson,
): QuizSessionState {
    if (state.checked || state.selectedOptionId === undefined) return state;

    const question = lesson.questions[state.questionIndex];
    if (!question) return state;

    const correct = state.selectedOptionId === question.correctOptionId;

    return {
        ...state,
        checked: true,
        answers: [
            ...state.answers,
            {
                questionId: question.id,
                selectedOptionId: state.selectedOptionId,
                correct,
            },
        ],
        correctCount: state.correctCount + (correct ? 1 : 0),
    };
}

/**
 * Advance to the next question.
 * No-op if the current question hasn't been checked yet.
 */
export function nextQuestion(state: QuizSessionState): QuizSessionState {
    if (!state.checked) return state;
    return {
        ...state,
        questionIndex: state.questionIndex + 1,
        selectedOptionId: undefined,
        checked: false,
    };
}

/**
 * Get the current question, or undefined when the quiz is finished.
 */
export function getCurrentQuestion(
    lesson: QuizLesson,
    state: QuizSessionState,
): QuizQuestion | undefined {
    return lesson.questions[state.questionIndex];
}

/**
 * True when every question has been answered.
 */
export function isComplete(state: QuizSessionState): boolean {
    return state.questionIndex >= state.totalCount;
}
