import { http } from './http';

export type AppNotification = {
    id: number;
    type: 'lesson_completed' | 'streak_milestone' | 'achievement_unlocked' | 'leaderboard_rank_up';
    title: string;
    body: string;
    data: Record<string, unknown> | null;
    read_at: string | null;
    created_at: string;
};

export type NotificationsResponse = {
    notifications: AppNotification[];
    unread_count: number;
};

export async function getNotifications(): Promise<NotificationsResponse> {
    const { data } = await http.get<NotificationsResponse>('/api/notifications');
    return data;
}

export async function markOneRead(id: number): Promise<void> {
    await http.patch(`/api/notifications/${id}/read`);
}

export async function markAllRead(): Promise<void> {
    await http.post('/api/notifications/read-all');
}

export async function reportAchievement(payload: {
    badge_id: string;
    title: string;
    description: string;
}): Promise<void> {
    await http.post('/api/notifications/achievement', payload);
}
