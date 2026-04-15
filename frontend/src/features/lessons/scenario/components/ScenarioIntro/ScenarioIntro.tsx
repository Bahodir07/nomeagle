import React from 'react';
import styles from './ScenarioIntro.module.css';
import type { ScenarioLesson } from '../../types';

export interface ScenarioIntroProps {
    lesson: ScenarioLesson;
    onStart: () => void;
}

export const ScenarioIntro: React.FC<ScenarioIntroProps> = ({
    lesson,
    onStart,
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                {lesson.introImage && (
                    <img
                        className={styles.image}
                        src={lesson.introImage}
                        alt={lesson.title}
                    />
                )}

                <p className={styles.text}>{lesson.introText}</p>

                <button
                    type="button"
                    className={styles.startBtn}
                    onClick={onStart}
                >
                    Start!
                </button>
            </div>
        </div>
    );
};
