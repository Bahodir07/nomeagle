import React from 'react';
import styles from './SessionSummary.module.css';

export interface SessionSummaryProps {
    masteredPct: number;
    masteredCount: number;
    totalCards: number;
    mistakes: number;
    xpEarned: number;
    hasMistakes: boolean;
    onRetryMistakes: () => void;
    onFinish: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
    masteredPct,
    masteredCount,
    totalCards,
    mistakes,
    xpEarned,
    hasMistakes,
    onRetryMistakes,
    onFinish,
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

                <h2 className={styles.heading}>Session Complete</h2>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={`${styles.statValue} ${styles.mastery}`}>
                            {masteredPct}%
                        </span>
                        <span className={styles.statLabel}>Mastery</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statValue} ${styles.mastered}`}>
                            {masteredCount}/{totalCards}
                        </span>
                        <span className={styles.statLabel}>Mastered</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statValue} ${styles.mistakes}`}>
                            {mistakes}
                        </span>
                        <span className={styles.statLabel}>Mistakes</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statValue} ${styles.xp}`}>
                            +{xpEarned}
                        </span>
                        <span className={styles.statLabel}>XP Earned</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    {hasMistakes && (
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.retryBtn}`}
                            onClick={onRetryMistakes}
                        >
                            Retry mistakes
                        </button>
                    )}
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.finishBtn}`}
                        onClick={onFinish}
                    >
                        Finish lesson
                    </button>
                </div>
            </div>
        </div>
    );
};
