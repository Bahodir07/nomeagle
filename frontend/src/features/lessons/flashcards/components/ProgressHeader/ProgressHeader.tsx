import React from 'react';
import styles from './ProgressHeader.module.css';
import type { SessionProgress } from '../../engine/session.types';

export interface ProgressHeaderProps {
    title: string;
    progress: SessionProgress;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
    title,
    progress,
}) => {
    const pct = progress.total > 0
        ? Math.round(((progress.total - progress.remaining) / progress.total) * 100)
        : 0;

    return (
        <div className={styles.header} role="banner">
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.progressRow}>
                <div
                    className={styles.progressTrack}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${pct}% complete`}
                >
                    <div
                        className={styles.progressFill}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <span className={styles.counter}>
                    {progress.index} / {progress.total}
                </span>
                {progress.masteredPct > 0 && (
                    <span className={styles.masteryBadge}>
                        {progress.masteredPct}% mastered
                    </span>
                )}
            </div>
        </div>
    );
};
