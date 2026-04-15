import { http } from "./http";

export async function submitScenario(scenarioSlug: string, answer: string, durationSeconds = 0) {
    const { data } = await http.post(`/api/scenarios/${scenarioSlug}/submit`, {
        answer,
        duration_seconds: durationSeconds,
    });

    return data;
}

export async function submitQuizQuestion(
    quizQuestionId: number,
    answer: string,
    durationSeconds = 0
) {
    const { data } = await http.post(`/api/quiz-questions/${quizQuestionId}/submit`, {
        answer,
        duration_seconds: durationSeconds,
    });

    return data;
}

export async function reviewFlashcard(
    flashcardId: number,
    rating: "again" | "good" | "easy",
    durationSeconds = 0,
    shownAt?: string,
    flippedAt?: string
) {
    const { data } = await http.post(`/api/flashcards/${flashcardId}/review`, {
        rating,
        duration_seconds: durationSeconds,
        shown_at: shownAt,
        flipped_at: flippedAt,
    });

    return data;
}