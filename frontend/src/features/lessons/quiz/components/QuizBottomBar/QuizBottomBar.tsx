import React from 'react';
import styles from './QuizBottomBar.module.css';

export interface QuizBottomBarProps {
    progressPct: number;
    mode: 'check' | 'next';
    canCheck: boolean;
    onCheck: () => void;
    onNext: () => void;
}

export const QuizBottomBar: React.FC<QuizBottomBarProps> = ({
    progressPct,
    mode,
    canCheck,
    onCheck,
    onNext,
}) => {
    const isCheck = mode === 'check';
    const disabled = isCheck && !canCheck;

    const handleClick = () => {
        if (disabled) return;
        if (isCheck) onCheck();
        else onNext();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !disabled) handleClick();
    };

    const buttonClass = [
        styles.actionBtn,
        disabled ? styles.actionBtnDisabled : styles.actionBtnEnabled,
    ].join(' ');

    return (
        <div className={styles.bar}>
            <div className={styles.progressTrack}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Quiz progress"
                />
            </div>

            <button
                type="button"
                className={buttonClass}
                disabled={disabled}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
            >
                {isCheck ? 'Check' : 'Next'}
            </button>
        </div>
    );
};
