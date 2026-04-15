export type FeedbackType = 'correct' | 'wrong' | null;

export interface ScenarioSessionState {
    stepIndex: number;
    completedSteps: string[];
    correctCount: number;
    finished: boolean;
    selectedChoiceId: string | undefined;
    feedbackType: FeedbackType;
    totalSteps: number;
}
