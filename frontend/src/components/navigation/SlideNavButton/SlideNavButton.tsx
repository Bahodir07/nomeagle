import React from 'react';
import styles from './SlideNavButton.module.css';

import nextIcon from '../../../assets/icons/actions/next.svg';
import prevIcon from '../../../assets/icons/actions/previous.svg';

const ICON_PATHS = {
    next: nextIcon,
    prev: prevIcon
};

export interface SlideNavButtonProps {
    direction: "next" | "prev";
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    /** When true, uses primary blue pill style (e.g. for "Finish" on last page). */
    isFinish?: boolean;
    /** When false, label is hidden until true (e.g. show "next page" / "finish" only after scrolling to end). Default true. */
    showLabel?: boolean;
}

export const SlideNavButton: React.FC<SlideNavButtonProps> = ({
    direction,
    label,
    disabled = false,
    onClick,
    className,
    isFinish = false,
    showLabel = true,
}) => {
    const iconPath = ICON_PATHS[direction];

    return (
        <button
            className={[
                styles.button,
                styles[direction],
                isFinish && styles.finish,
                !showLabel && styles.labelHidden,
                className
            ].filter(Boolean).join(' ')}
            disabled={disabled}
            onClick={onClick}
            type="button"
            aria-label={label}
        >
            {direction === 'prev' && (
                <div className={styles.iconContainer}>
                    <div
                        className={styles.icon}
                        style={{
                            maskImage: `url("${iconPath}")`,
                            WebkitMaskImage: `url("${iconPath}")`
                        }}
                    />
                </div>
            )}

            <div className={styles.labelContainer}>
                <span className={styles.label}>{label}</span>
            </div>

            {direction === 'next' && (
                <div className={styles.iconContainer}>
                    <div
                        className={styles.icon}
                        style={{
                            maskImage: `url("${iconPath}")`,
                            WebkitMaskImage: `url("${iconPath}")`
                        }}
                    />
                </div>
            )}
        </button>
    );
};
