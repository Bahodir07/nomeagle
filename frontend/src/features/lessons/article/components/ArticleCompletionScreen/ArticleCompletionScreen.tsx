import React from 'react';
import styles from './ArticleCompletionScreen.module.css';

export interface ArticleCompletionScreenProps {
    onContinue: () => void;
}

export const ArticleCompletionScreen: React.FC<ArticleCompletionScreenProps> = ({
    onContinue,
}) => {
    return (
        <div className={styles.screen} role="status" aria-live="polite">
            <div className={styles.content}>
                <div className={styles.iconWrap}>
                    <div className={styles.circleOuter}>
                        <div className={styles.circleInner}>
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
                </div>
                <h2 className={styles.title}>Good Job!</h2>
                <div className={styles.line} aria-hidden="true" />
                <button
                    type="button"
                    className={styles.continueButton}
                    onClick={onContinue}
                >
                    <span className={styles.continueLabel}>Continue</span>
                    <span className={styles.continueIcon} aria-hidden="true">
                        →
                    </span>
                </button>
            </div>
        </div>
    );
};
