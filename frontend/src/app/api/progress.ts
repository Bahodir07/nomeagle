import { http } from "./http";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface ProgressSnapshot {
    status: ProgressStatus;
    progress_pct: number;
    total_items: number;
    completed_items: number;
    correct_answers: number;
    total_attempts: number;
    xp_earned: number;
}

export interface ScenarioSubmitResponse {
    correct: boolean;
    explanation?: string | null;
    xp_earned: number;
    progress: ProgressSnapshot;
}

export interface QuizSubmitResponse {
    correct: boolean;
    explanation?: string | null;
    xp_earned: number;
    progress: ProgressSnapshot;
}

export async function getDashboard() {
    const { data } = await http.get("/api/dashboard");
    return data;
}

export async function getLessonProgress(
    countrySlug: string,
    moduleSlug: string,
    lessonSlug: string
) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/progress`
    );
    return data;
}

export async function completeLesson(
    countrySlug: string,
    moduleSlug: string,
    lessonSlug: string,
    durationSeconds = 0
) {
    const { data } = await http.post(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/complete`,
        {
            duration_seconds: durationSeconds,
        }
    );

    return data;
}

export async function submitScenario(
    scenarioSlug: string,
    answer: string,
    durationSeconds = 0
): Promise<ScenarioSubmitResponse> {
    const { data } = await http.post<ScenarioSubmitResponse>(
        `/api/scenarios/${scenarioSlug}/submit`,
        {
            answer,
            duration_seconds: durationSeconds,
        }
    );

    return data;
}

export async function submitQuizQuestion(
    quizQuestionId: string | number,
    answer: string,
    durationSeconds = 0
): Promise<QuizSubmitResponse> {
    const { data } = await http.post<QuizSubmitResponse>(
        `/api/quiz-questions/${quizQuestionId}/submit`,
        {
            answer,
            duration_seconds: durationSeconds,
        }
    );

    return data;
}