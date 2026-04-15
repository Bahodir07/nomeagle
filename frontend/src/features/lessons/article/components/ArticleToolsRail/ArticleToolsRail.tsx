import React from 'react';
import styles from './ArticleToolsRail.module.css';

const ICON_PATHS = {
    theme: "/assets/icons/actions/TODO-theme.svg",
    font: "/assets/icons/actions/TODO-font.svg"
};

export interface ArticleToolsRailProps {
    pageIndex: number;
    totalPages: number;
}

export const ArticleToolsRail: React.FC<ArticleToolsRailProps> = ({
    pageIndex,
    totalPages,
}) => {
    return (
        <div className={styles.rail}>
            <div className={styles.tools}>
                <button
                    className={styles.iconButton}
                    type="button"
                    aria-label="Change theme color"
                >
                    <div
                        className={styles.icon}
                        style={{
                            maskImage: `url(${ICON_PATHS.theme})`,
                            WebkitMaskImage: `url(${ICON_PATHS.theme})`
                        }}
                    />
                </button>

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
            </div>

            <div className={styles.pageIndicatorWrapper}>
                <div className={styles.pageIndicator}>
                    <span className={styles.current}>{pageIndex + 1}</span>
                    <span className={styles.divider} aria-hidden="true" />
                    <span className={styles.total}>{totalPages}</span>
                </div>
            </div>
        </div>
    );
};
