export interface ScenarioChoice {
    id: string;
    text: string;
    correct: boolean;
    correctMessage: string;
    wrongMessage: string;
}

export interface ScenarioStep {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    choices: [ScenarioChoice, ScenarioChoice, ScenarioChoice];
}

export interface ScenarioLesson {
    lessonId: string;
    title: string;
    introText: string;
    introImage?: string;
    steps: ScenarioStep[];
    xpReward: number;
}
