import React from 'react';
import styles from './AnswerOption.module.css';
import correctIcon from '../../../../../assets/icons/actions/correct.svg';
import wrongIcon from '../../../../../assets/icons/actions/wrong.svg';

export type AnswerOptionState = 'neutral' | 'selected' | 'correct' | 'wrong';

export interface AnswerOptionProps {
    text: string;
    selected: boolean;
    disabled: boolean;
    state: AnswerOptionState;
    onClick: () => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
    text,
    selected,
    disabled,
    state,
    onClick,
}) => {
    const rootClass = [
        styles.option,
        styles[state],
        selected && state === 'neutral' ? styles.selected : '',
    ]
        .filter(Boolean)
        .join(' ');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) onClick();
        }
    };

    const showBadge = state === 'correct' || state === 'wrong';

    return (
        <button
            type="button"
            className={rootClass}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            role="radio"
            aria-checked={selected}
            aria-label={text}
        >
            <span className={styles.radio} aria-hidden="true">
                {selected && state !== 'correct' && state !== 'wrong' && (
                    <span className={styles.radioDot} />
                )}
            </span>

            <span className={styles.label}>{text}</span>

            {showBadge && (
                <span className={styles.badge} aria-hidden="true">
                    <img
                        className={styles.badgeIcon}
                        src={state === 'correct' ? correctIcon : wrongIcon}
                        alt=""
                        width={16}
                        height={16}
                    />
                </span>
            )}
        </button>
    );
};
