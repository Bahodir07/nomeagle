export interface ScenarioChoice {
    id: string;
    text: string;
    correct: boolean;
    correctMessage?: string;
    wrongMessage?: string;
}

export interface ScenarioStep {
    id: string;
    slug?: string;
    title: string;
    description: string;
    imageUrl?: string;
    choices: ScenarioChoice[];
}

export interface ScenarioLesson {
    lessonId: string;
    title: string;
    introText: string;
    introImage?: string;
    xpReward: number;
    steps: ScenarioStep[];
}

export interface ScenarioLessonAnswer {
    scenarioId: string;
    scenarioSlug?: string;
    answerId: string;
    isCorrect: boolean;
}

export interface ScenarioLessonResult {
    totalSteps: number;
    correctSteps: number;
    answers: ScenarioLessonAnswer[];
}