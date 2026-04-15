import React, { useCallback } from 'react';
import styles from './SummaryLessonPlayer.module.css';
import type { SummaryLesson } from '../../types';
import { LessonToolsRail } from '../../../shared/LessonToolsRail';
import { SummaryLessonCard } from '../SummaryLessonCard';

export interface SummaryLessonPlayerProps {
    lesson: SummaryLesson;
    onComplete?: () => void;
    /** When false, hides the right-side tools column. */
    showToolsRail?: boolean;
}

export const SummaryLessonPlayer: React.FC<SummaryLessonPlayerProps> = ({
    lesson,
    onComplete,
    showToolsRail = true,
}) => {
    const handleFinish = useCallback(() => {
        onComplete?.();
    }, [onComplete]);

    return (
        <div className={styles.player}>
            <div className={styles.topBar}>
                <span className={styles.topBarLabel}>Summary</span>
            </div>

            <div className={styles.main}>
                <div
                    className={
                        showToolsRail
                            ? `${styles.mainInner} ${styles.mainInnerWithRail}`
                            : styles.mainInner
                    }
                >
                    <SummaryLessonCard
                        lesson={lesson}
                        onFinish={handleFinish}
                        embedded
                    />
                </div>

                {showToolsRail ? (
                    <div className={styles.toolsRail}>
                        <LessonToolsRail showColorTool showFontTool />
                    </div>
                ) : null}
            </div>
        </div>
    );
};
