import React from 'react';
import styles from './ScenarioComplete.module.css';

export interface ScenarioCompleteProps {
    correctCount: number;
    totalSteps: number;
    onContinue: () => void;
}

export const ScenarioComplete: React.FC<ScenarioCompleteProps> = ({
    correctCount,
    totalSteps,
    onContinue,
}) => {
    return (
        <div className={styles.wrapper} role="status" aria-live="polite">
            <div className={styles.card}>
                <div className={styles.body}>
                    <p className={styles.message}>
                        Congratulations! You completed all {totalSteps} scenarios
                        and answered {correctCount} out of {totalSteps} correctly
                        on the first try. Great cultural awareness — keep learning
                        and exploring!
                    </p>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.continueBtn}
                            onClick={onContinue}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
