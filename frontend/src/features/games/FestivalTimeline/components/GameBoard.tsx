import React from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor,
} from '@dnd-kit/core';
import { useFestivalStore } from '../store/useFestivalStore';
import { TimelineBoard } from './TimelineBoard';
import { FestivalCardTray, FestivalCard } from './FestivalCardTray';
import { HUD } from './HUD';
import { MicroLessonPopup } from './MicroLessonPopup';
import confetti from 'canvas-confetti';
import styles from '../FestivalTimeline.module.css';

export const GameBoard: React.FC = () => {
    const handleDrop = useFestivalStore(s => s.handleDrop);
    const unplacedCards = useFestivalStore(s => s.unplacedCards);

    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 5 } })
    );

    const onDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && over.id) {
            const isCorrect = handleDrop(active.id as string, over.id as string);
            if (isCorrect) {
                // Fire dopamine hit 🎉
                confetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                });
            }
        }
    };

    const activeFood = React.useMemo(
        () => unplacedCards.find(f => f.id === activeId),
        [activeId, unplacedCards]
    );

    return (
        <div className={styles.gameBoard}>
            <HUD />
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className={styles.boardLayout}>
                    <TimelineBoard />
                    <FestivalCardTray />
                </div>

                <MicroLessonPopup />

                <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                    {activeFood ? <FestivalCard festival={activeFood} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
