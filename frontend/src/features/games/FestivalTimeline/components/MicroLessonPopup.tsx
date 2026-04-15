import React, { useEffect, useState } from 'react';
import { useFestivalStore } from '../store/useFestivalStore';
import styles from '../FestivalTimeline.module.css';

export const MicroLessonPopup: React.FC = () => {
    const lastMicroLesson = useFestivalStore(s => s.lastMicroLesson);
    const showLessonUntil = useFestivalStore(s => s.showLessonUntil);
    const clearLesson = useFestivalStore(s => s.clearLesson);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!lastMicroLesson) {
            setIsVisible(false);
            return;
        }

        const now = Date.now();
        if (showLessonUntil > now) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(clearLesson, 300); // Wait for fade out
            }, showLessonUntil - now);

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            clearLesson();
        }
    }, [lastMicroLesson, showLessonUntil, clearLesson]);

    if (!lastMicroLesson || !isVisible) return null;

    return (
        <div className={styles.microLessonPopup}>
            <h4 className={styles.microLessonTitle}>Micro Lesson</h4>
            <p className={styles.microLessonText}>
                <strong>{lastMicroLesson.name}:</strong> {lastMicroLesson.shortFact}
            </p>
        </div>
    );
};
