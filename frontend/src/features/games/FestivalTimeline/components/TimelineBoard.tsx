import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useFestivalStore } from '../store/useFestivalStore';
import styles from '../FestivalTimeline.module.css';

const SEASON_SLOTS = [
    { id: 'Spring', label: 'SPRING', icon: '🌱', color: '#84cc16' },
    { id: 'Summer', label: 'SUMMER', icon: '☀️', color: '#f59e0b' },
    { id: 'Autumn', label: 'AUTUMN', icon: '🍁', color: '#f43f5e' },
    { id: 'Winter', label: 'WINTER', icon: '❄️', color: '#8b5cf6' },
];

const MONTH_SLOTS = [
    { id: '1', label: 'JAN' }, { id: '2', label: 'FEB' }, { id: '3', label: 'MAR' },
    { id: '4', label: 'APR' }, { id: '5', label: 'MAY' }, { id: '6', label: 'JUN' },
    { id: '7', label: 'JUL' }, { id: '8', label: 'AUG' }, { id: '9', label: 'SEP' },
    { id: '10', label: 'OCT' }, { id: '11', label: 'NOV' }, { id: '12', label: 'DEC' },
];

interface SlotProps {
    id: string;
    label: string;
    icon?: string;
    color?: string;
    isCompact?: boolean;
}

const TimelineSlot: React.FC<SlotProps> = ({ id, label, icon, color, isCompact }) => {
    const { isOver, setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`${styles.timelineSlot} ${isOver ? styles.slotActive : ''} ${isCompact ? styles.slotCompact : ''}`}
            style={{ '--slot-color': color || '#475569' } as React.CSSProperties}
        >
            <div className={styles.slotHeader}>
                {label}
            </div>
            <div className={styles.slotBody}>
                {icon && <span className={styles.slotIcon}>{icon}</span>}
            </div>
        </div>
    );
};

export const TimelineBoard: React.FC = () => {
    const mode = useFestivalStore(s => s.mode);

    return (
        <div className={styles.boardContainer}>
            <h2 className={styles.boardTitle}>TIMELINE BOARD</h2>

            {mode === 'season' && (
                <div className={styles.seasonGrid}>
                    {SEASON_SLOTS.map(s => <TimelineSlot key={s.id} {...s} />)}
                </div>
            )}

            {mode === 'calendar' && (
                <div className={styles.calendarGrid}>
                    {MONTH_SLOTS.map(s => <TimelineSlot key={s.id} {...s} isCompact />)}
                </div>
            )}
        </div>
    );
};
