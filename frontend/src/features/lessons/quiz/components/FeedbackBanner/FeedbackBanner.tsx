import React from 'react';
import styles from './FeedbackBanner.module.css';
import correctIcon from '../../../../../assets/icons/actions/correct.svg';
import wrongIcon from '../../../../../assets/icons/actions/wrong.svg';

export type FeedbackVariant = 'correct' | 'wrong' | 'hidden';

export interface FeedbackBannerProps {
    variant: FeedbackVariant;
    text: string;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
    variant,
    text,
}) => {
    if (variant === 'hidden') return null;

    const rootClass = [
        styles.banner,
        variant === 'correct' ? styles.correct : styles.wrong,
    ].join(' ');

    const iconSrc = variant === 'correct' ? correctIcon : wrongIcon;

    return (
        <div className={rootClass} role="status" aria-live="polite">
            <img
                className={styles.icon}
                src={iconSrc}
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
            />
            <span className={styles.text}>{text}</span>
        </div>
    );
};
