import React from 'react';
import styles from './LessonToolsRail.module.css';

const ICON_PATHS = {
    color: "/assets/icons/actions/TODO-color.svg",
    font: "/assets/icons/actions/TODO-font.svg"
};

export interface LessonToolsRailProps {
    showColorTool?: boolean;
    showFontTool?: boolean;
    pageIndicator?: string;
}

export const LessonToolsRail: React.FC<LessonToolsRailProps> = ({
    showColorTool = false,
    showFontTool = false,
    pageIndicator,
}) => {
    const indicatorText = pageIndicator?.trim();
    const showIndicator = Boolean(indicatorText);

    if (!showColorTool && !showFontTool && !showIndicator) {
        return null;
    }

    return (
        <div className={styles.rail}>
            {(showColorTool || showFontTool) ? (
                <div className={styles.tools}>
                    {showColorTool ? (
                        <button
                            className={styles.iconButton}
                            type="button"
                            aria-label="Change color"
                        >
                            <div
                                className={styles.icon}
                                style={{
                                    maskImage: `url(${ICON_PATHS.color})`,
                                    WebkitMaskImage: `url(${ICON_PATHS.color})`
                                }}
                            />
                        </button>
                    ) : null}

                    {showFontTool ? (
                        <button
                            className={styles.iconButton}
                            type="button"
                            aria-label="Change font size"
                        >
                            <div
                                className={styles.icon}
                                style={{
                                    maskImage: `url(${ICON_PATHS.font})`,
                                    WebkitMaskImage: `url(${ICON_PATHS.font})`
                                }}
                            />
                        </button>
                    ) : null}
                </div>
            ) : null}

            {showIndicator ? (
                <div className={styles.pageIndicatorWrapper}>
                    <p className={styles.pageIndicator} aria-live="polite">
                        {indicatorText}
                    </p>
                </div>
            ) : null}
        </div>
    );
};
