import { http } from './http';
import type { DashboardResponse } from '../../features/dashboard/types';

export async function getDashboard(): Promise<DashboardResponse> {
    const { data } = await http.get<DashboardResponse>('/api/dashboard');
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