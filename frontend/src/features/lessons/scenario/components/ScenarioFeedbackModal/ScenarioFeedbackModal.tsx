import React, { useEffect, useRef } from 'react';
import styles from './ScenarioFeedbackModal.module.css';

export interface ScenarioFeedbackModalProps {
    variant: 'correct' | 'wrong';
    message: string;
    onContinue: () => void;
}

export const ScenarioFeedbackModal: React.FC<ScenarioFeedbackModalProps> = ({
    message,
    onContinue,
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        btnRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter') onContinue();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onContinue]);

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true">
            <div className={styles.card}>
                <p className={styles.message}>{message}</p>
                <button
                    ref={btnRef}
                    type="button"
                    className={styles.continueBtn}
                    onClick={onContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
