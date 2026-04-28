import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAllRead, markOneRead } from '../../../app/api/notifications';
import { useAuth } from '../../../app/store/auth.store';

export function useNotifications() {
    const qc = useQueryClient();
    const { isAuthenticated } = useAuth();

    const query = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        enabled: isAuthenticated,
        refetchInterval: isAuthenticated ? 60_000 : false,
        retry: false,
    });

    const invalidate = () => qc.invalidateQueries({ queryKey: ['notifications'] });

    const readOne = useMutation({
        mutationFn: markOneRead,
        onSuccess: invalidate,
    });

    const readAll = useMutation({
        mutationFn: markAllRead,
        onSuccess: invalidate,
    });

    return {
        notifications: query.data?.notifications ?? [],
        unreadCount: query.data?.unread_count ?? 0,
        isLoading: query.isLoading,
        readOne: readOne.mutate,
        readAll: readAll.mutate,
    };
}
