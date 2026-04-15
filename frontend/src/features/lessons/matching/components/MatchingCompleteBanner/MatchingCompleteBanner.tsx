import React from 'react';
import styles from './MatchingCompleteBanner.module.css';
import type { MatchingProgress } from '../../engine/matchingSession.types';

export interface MatchingCompleteBannerProps {
    progress: MatchingProgress;
    xpEarned: number;
    onNext: () => void;
}

export const MatchingCompleteBanner: React.FC<MatchingCompleteBannerProps> = ({
    progress,
    xpEarned,
    onNext,
}) => {
    return (
        <div className={styles.screen} role="status" aria-live="polite">
            <div className={styles.content}>
                <div className={styles.iconWrap}>
                    <div className={styles.circle}>
                        <svg
                            className={styles.checkmark}
                            viewBox="0 0 52 52"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                className={styles.checkPath}
                                d="M14 27l8 8 16-18"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className={styles.heading}>Great match!</h2>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={`${styles.statValue} ${styles.xp}`}>
                            +{xpEarned}
                        </span>
                        <span className={styles.statLabel}>XP</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statValue} ${styles.attempts}`}>
                            {progress.attempts}
                        </span>
                        <span className={styles.statLabel}>Attempts</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statValue} ${styles.mistakes}`}>
                            {progress.mistakes}
                        </span>
                        <span className={styles.statLabel}>Mistakes</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.nextBtn}
                        onClick={onNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
