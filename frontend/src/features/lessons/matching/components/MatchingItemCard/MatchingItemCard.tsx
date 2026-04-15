import React from 'react';
import styles from './MatchingItemCard.module.css';

export interface MatchingItemCardProps {
    text: string;
    imageUrl?: string;
    selected: boolean;
    matched: boolean;
    wrong: boolean;
    disabled: boolean;
    onClick: () => void;
}

export const MatchingItemCard: React.FC<MatchingItemCardProps> = ({
    text,
    imageUrl,
    selected,
    matched,
    wrong,
    disabled,
    onClick,
}) => {
    const rootClass = [
        styles.card,
        matched && styles.matched,
        wrong && styles.wrong,
        selected && !matched && !wrong && styles.selected,
    ]
        .filter(Boolean)
        .join(' ');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) onClick();
        }
    };

    return (
        <button
            type="button"
            className={rootClass}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-label={text}
            aria-pressed={selected}
        >
            {imageUrl && (
                <img
                    className={styles.image}
                    src={imageUrl}
                    alt={text}
                    loading="lazy"
                />
            )}
            <span className={styles.label}>{text}</span>
        </button>
    );
};
