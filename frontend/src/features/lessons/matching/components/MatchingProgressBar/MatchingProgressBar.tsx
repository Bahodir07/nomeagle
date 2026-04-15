import React from 'react';
import styles from './MatchingProgressBar.module.css';
import type { MatchingProgress } from '../../engine/matchingSession.types';

export interface MatchingProgressBarProps {
    progress: MatchingProgress;
}

export const MatchingProgressBar: React.FC<MatchingProgressBarProps> = ({
    progress,
}) => {
    return (
        <div
            className={styles.bar}
            role="progressbar"
            aria-valuenow={progress.matched}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-label={`${progress.matched} of ${progress.total} matched`}
        >
            <div className={styles.track}>
                <div
                    className={styles.fill}
                    style={{ width: `${progress.pct}%` }}
                />
            </div>
            <span className={styles.counter}>
                {progress.matched} / {progress.total}
            </span>
        </div>
    );
};
