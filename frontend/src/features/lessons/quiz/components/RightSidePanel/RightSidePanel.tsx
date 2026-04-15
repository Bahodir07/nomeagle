import React from 'react';
import styles from './RightSidePanel.module.css';

export interface RightSidePanelProps {
    correctCount: number;
    totalCount: number;
}

export const RightSidePanel: React.FC<RightSidePanelProps> = ({
    correctCount,
    totalCount,
}) => {
    return (
        <div className={styles.panel} aria-label="Quiz score">
            <div className={styles.scoreRing}>
                <span className={styles.scoreValue}>{correctCount}</span>
                <span className={styles.scoreSeparator}>/</span>
                <span className={styles.scoreTotal}>{totalCount}</span>
            </div>
            <span className={styles.label}>Correct answers</span>
        </div>
    );
};
