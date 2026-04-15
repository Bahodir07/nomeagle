import { http } from "./http";

export async function getCountries() {
    const { data } = await http.get("/api/countries");
    return data;
}

export async function getCountry(countrySlug: string) {
    const { data } = await http.get(`/api/countries/${countrySlug}`);
    return data;
}

export async function getModules(countrySlug: string) {
    const { data } = await http.get(`/api/countries/${countrySlug}/modules`);
    return data;
}

export async function getModule(countrySlug: string, moduleSlug: string) {
    const { data } = await http.get(`/api/countries/${countrySlug}/modules/${moduleSlug}`);
    return data;
}

export async function getLessons(countrySlug: string, moduleSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons`
    );
    return data;
}

export async function getLesson(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}`
    );
    return data;
}

export async function getScenarios(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/scenarios`
    );
    return data;
}

export async function getQuizQuestions(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/quiz-questions`
    );
    return data;
}

export async function getFlashcards(countrySlug: string, moduleSlug: string, lessonSlug: string) {
    const { data } = await http.get(
        `/api/countries/${countrySlug}/modules/${moduleSlug}/lessons/${lessonSlug}/flashcards`
    );
    return data;
}

/* -------------------------------------------------------------------------- */
/* Learning Path                                                              */
/* -------------------------------------------------------------------------- */

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