import React, { useEffect, useCallback } from 'react';
import styles from './RatingBar.module.css';
import type { CardRating } from '../../engine/session.types';

export interface RatingBarProps {
    disabled: boolean;
    onRate: (rating: CardRating) => void;
}

const RATINGS: { rating: CardRating; label: string; key: string; className: string }[] = [
    { rating: 'again', label: 'Again', key: '1', className: styles.again },
    { rating: 'good', label: 'Good', key: '2', className: styles.good },
    { rating: 'easy', label: 'Easy', key: '3', className: styles.easy },
];

export const RatingBar: React.FC<RatingBarProps> = ({ disabled, onRate }) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (disabled) return;

            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            const match = RATINGS.find((r) => r.key === e.key);
            if (match) {
                e.preventDefault();
                onRate(match.rating);
            }
        },
        [disabled, onRate],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className={styles.bar} role="group" aria-label="Rate this card">
            {RATINGS.map(({ rating, label, key, className }) => (
                <button
                    key={rating}
                    type="button"
                    className={`${styles.btn} ${className}`}
                    disabled={disabled}
                    onClick={() => onRate(rating)}
                    aria-label={`${label} (press ${key})`}
                >
                    <span className={styles.label}>{label}</span>
                    <kbd className={styles.shortcut}>{key}</kbd>
                </button>
            ))}
        </div>
    );
};
