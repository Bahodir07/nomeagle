export interface QuizOption {
    id: string;
    text: string;
}

export interface QuizQuestion {
    id: string;
    prompt: string;
    imageUrl?: string;
    imageAlt?: string;
    options: [QuizOption, QuizOption, QuizOption, QuizOption];
    correctOptionId: string;
    explanation?: string;
}

export interface QuizLesson {
    lessonId: string;
    title: string;
    questions: QuizQuestion[];
    xpPerCorrect: number;
}
