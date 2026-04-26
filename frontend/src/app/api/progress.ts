import { http } from "./http";
import type { XpLevel, AccuracyCoverage, PracticeTimeBreakdown, AttemptsHeatmap, TimeRangeShort } from "../../features/stats/types";
import type { MasteryData } from "../../features/statistics/components/CulturalMasteryCard/CulturalMasteryCard";
import type { LeaderboardResponse, LeaderboardTimeRange } from "../../features/leaderboard/types";

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

export interface StatisticsApiResponse {
    xpLevel: XpLevel;
    accuracyCoverage: AccuracyCoverage;
    practiceTime: Record<TimeRangeShort, PracticeTimeBreakdown>;
    attempts: AttemptsHeatmap;
    countryMastery: MasteryData[];
}

export async function getStatistics(): Promise<StatisticsApiResponse> {
    const { data } = await http.get<StatisticsApiResponse>("/api/statistics");
    return data;
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
    durationSeconds = 0,
    correctAnswers?: number,
    totalAttempts?: number
) {
    const body: Record<string, number> = { duration_seconds: durationSeconds };
    if (correctAnswers !== undefined) body.correct_answers = correctAnswers;
    if (totalAttempts  !== undefined) body.total_attempts  = totalAttempts;

    const { data } = await http.post(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/complete`,
        body
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

export interface FlashcardReviewResponse {
    rating: string;
    xp_earned: number;
    progress: ProgressSnapshot;
}

export async function reviewFlashcard(
    flashcardId: number,
    rating: 'again' | 'good' | 'easy',
    durationSeconds = 0,
    shownAt?: string,
    flippedAt?: string
): Promise<FlashcardReviewResponse> {
    const { data } = await http.post<FlashcardReviewResponse>(
        `/api/flashcards/${flashcardId}/review`,
        {
            rating,
            duration_seconds: durationSeconds,
            shown_at: shownAt,
            flipped_at: flippedAt,
        }
    );
    return data;
}

export async function getLeaderboard(timeRange: LeaderboardTimeRange = 'week'): Promise<LeaderboardResponse> {
    const { data } = await http.get<LeaderboardResponse>('/api/leaderboard', {
        params: { time_range: timeRange },
    });
    return data;
}