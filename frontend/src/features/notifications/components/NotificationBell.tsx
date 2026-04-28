import React, { useEffect, useRef, useState } from 'react';
import { Bell, BookOpen, Flame, Trophy, TrendingUp } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import type { AppNotification } from '../../../app/api/notifications';
import classes from './NotificationBell.module.css';

function typeIcon(type: AppNotification['type']) {
    switch (type) {
        case 'lesson_completed':    return <BookOpen size={14} />;
        case 'streak_milestone':    return <Flame size={14} />;
        case 'achievement_unlocked': return <Trophy size={14} />;
        case 'leaderboard_rank_up': return <TrendingUp size={14} />;
    }
}

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, readOne, readAll } = useNotifications();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const badge = unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null;

    return (
        <div className={classes.wrapper} ref={ref}>
            <button
                type="button"
                className={classes.bellBtn}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                onClick={() => setOpen((o) => !o)}
            >
                <Bell size={18} />
                {badge && <span className={classes.badge}>{badge}</span>}
            </button>

            {open && (
                <div className={classes.dropdown}>
                    <div className={classes.header}>
                        <span className={classes.headerTitle}>Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className={classes.markAll}
                                onClick={() => readAll()}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <p className={classes.empty}>No notifications yet.</p>
                    ) : (
                        <ul className={classes.list}>
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className={`${classes.item} ${!n.read_at ? classes.unread : ''}`}
                                    onClick={() => { if (!n.read_at) readOne(n.id); }}
                                >
                                    <span className={classes.itemIcon}>{typeIcon(n.type)}</span>
                                    <div className={classes.itemBody}>
                                        <p className={classes.itemTitle}>{n.title}</p>
                                        <p className={classes.itemText}>{n.body}</p>
                                        <p className={classes.itemTime}>{relativeTime(n.created_at)}</p>
                                    </div>
                                    {!n.read_at && <span className={classes.dot} />}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
