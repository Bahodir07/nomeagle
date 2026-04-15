import { http } from '../../../app/api/http';

export type DashboardStats = {
    level: number;
    xp: number;
    streak: number;
    timeSpentMinutes: number;
    accuracy: number;
};

export type DashboardCountry = {
    countryId: string;
    countryCode: string;
    title: string;
    slug?: string;
    flagEmoji?: string;
    progressPercent: number;
    completedLessons: number;
    totalLessons: number;
};

export type DashboardWeekProgressItem = {
    day: string;
    minutes: number;
};

export type DashboardResponse = {
    user: DashboardStats;
    activeCountries: DashboardCountry[];
    weekProgress?: DashboardWeekProgressItem[];
};

export async function fetchDashboard(): Promise<DashboardResponse> {
    const { data } = await http.get('/api/dashboard');
    return data;
}