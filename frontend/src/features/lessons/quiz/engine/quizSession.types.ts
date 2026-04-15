export interface QuizAnswer {
    questionId: string;
    selectedOptionId: string;
    correct: boolean;
}

export interface QuizSessionState {
    questionIndex: number;
    selectedOptionId: string | undefined;
    checked: boolean;
    answers: QuizAnswer[];
    correctCount: number;
    totalCount: number;
}
