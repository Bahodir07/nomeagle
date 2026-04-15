import React from 'react';

import type { SummaryLesson } from '../../types';
import styles from './SummaryLessonCard.module.css';

export interface SummaryLessonCardProps {
    lesson: SummaryLesson;
    onFinish?: () => void;
    /** When true, skips the full-page gray shell (use inside SummaryLessonPlayer). */
    embedded?: boolean;
}

const DEFAULT_BUTTON_LABEL = 'Finish';

export const SummaryLessonCard: React.FC<SummaryLessonCardProps> = ({
    lesson,
    onFinish,
    embedded = false,
}) => {
    const buttonLabel = lesson.buttonLabel ?? DEFAULT_BUTTON_LABEL;

    return (
        <div
            className={embedded ? styles.embedded : styles.page}
            role="region"
            aria-labelledby="summary-lesson-title"
        >
            <div className={styles.card}>
                <div className={styles.inner}>
                    <h2 id="summary-lesson-title" className={styles.title}>
                        {lesson.title}
                    </h2>

                    {lesson.imageUrl ? (
                        <div className={styles.imageWrap}>
                            <img
                                className={styles.image}
                                src={lesson.imageUrl}
                                alt=""
                                loading="lazy"
                            />
                        </div>
                    ) : null}

                    <p className={styles.summary}>{lesson.summaryText}</p>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.finishButton}
                            onClick={() => onFinish?.()}
                        >
                            {buttonLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
