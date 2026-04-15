import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useFestivalStore } from '../store/useFestivalStore';
import type { FestivalData } from '../types';
import styles from '../FestivalTimeline.module.css';

export const FestivalCard: React.FC<{ festival: FestivalData, isOverlay?: boolean }> = ({ festival, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: festival.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1, // Hide original when dragging
    };

    if (isOverlay) {
        return (
            <div className={`${styles.festivalCard} ${styles.cardDragging}`}>
                <div className={styles.cardImage}>{festival.image}</div>
                <div className={styles.cardLabel}>{festival.name.toUpperCase()}</div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={styles.festivalCard}
        >
            <div className={styles.cardImage}>{festival.image}</div>
            <div className={styles.cardLabel}>{festival.name.toUpperCase()}</div>
        </div>
    );
};

export const FestivalCardTray: React.FC = () => {
    const unplacedCards = useFestivalStore(s => s.unplacedCards);

    return (
        <div className={styles.trayContainer}>
            <h2 className={styles.boardTitle}>FESTIVAL CARD TRAY</h2>
            <div className={styles.trayGrid}>
                {unplacedCards.map(f => (
                    <FestivalCard key={f.id} festival={f} />
                ))}
            </div>
        </div>
    );
};
