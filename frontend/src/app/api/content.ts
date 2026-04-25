import { http } from "./http";

function unwrapResource<T>(payload: unknown): T {
    if (payload !== null && typeof payload === "object" && "data" in payload) {
        return (payload as { data: T }).data;
    }

    return payload as T;
}

export async function getCountries() {
    const { data } = await http.get("/api/countries");
    return unwrapResource(data);
}

export async function getCountry(countrySlug: string) {
    const { data } = await http.get(`/api/countries/${countrySlug}`);
    return unwrapResource(data);
}

export async function getModules(countrySlug: string) {
    const { data } = await http.get(`/api/countries/${countrySlug}/modules`);
    return unwrapResource(data);
}

export async function getModule(countrySlug: string, moduleSlug: string) {
    const { data } = await http.get(`/api/countries/${countrySlug}/modules/${moduleSlug}`);
    return unwrapResource(data);
}

export async function getLessons(countrySlug: string, moduleSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons`
    );
    return unwrapResource(data);
}

export async function getLesson(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}`
    );
    return unwrapResource(data);
}

export async function getScenarios(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/scenarios`
    );
    return unwrapResource(data);
}

export async function getQuizQuestions(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/quiz-questions`
    );
    return unwrapResource(data);
}

export async function getFlashcards(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/flashcards`
    );
    return unwrapResource(data);
}

export async function getMatchingPairs(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/matching-pairs`
    );
    return unwrapResource(data);
}

export interface LearningPathResponse {
    course: import("../../features/lessons/types").CountryCourse;
    progress: {
        completedLessonIds: string[];
        starsByLessonId: Record<string, number>;
        lastOpenedLessonId?: string | null;
    };
}

export async function getLearningPath(countrySlug: string): Promise<LearningPathResponse> {
    const { data } = await http.get<LearningPathResponse>(
        `/api/countries/${countrySlug}/learning-path`
    );
    return data;
}