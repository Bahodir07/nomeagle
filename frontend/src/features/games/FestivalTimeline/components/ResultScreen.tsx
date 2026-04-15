import React from 'react';
import { useFestivalStore } from '../store/useFestivalStore';
import { useGameCompletion } from '../../../map-roadmap/components/GameLauncher/GameCompletionContext';
import styles from '../FestivalTimeline.module.css';

export const ResultScreen: React.FC = () => {
    const { scoreDetails, mistakesMade, reset, mode, festivals } = useFestivalStore();
    const completion = useGameCompletion();

    const totalPossible = festivals.length;
    const accuracy = totalPossible > 0 ? ((totalPossible - mistakesMade) / totalPossible) * 100 : 0;

    // Basic Star Logic
    let stars = 1;
    if (mistakesMade === 0 && scoreDetails.timeBonus > 50) stars = 3;
    else if (mistakesMade <= 1) stars = 2;

    return (
        <div className={styles.setupOverlay}>
            <div className={styles.setupCard}>
                <h1 className={styles.setupTitle}>ROUND COMPLETED!</h1>
                <p className={styles.setupSubtitle}>You mastered {mode} mode!</p>

                <div className={styles.starsRow}>
                    {[1, 2, 3].map(s => (
                        <span key={s} className={s <= stars ? styles.starFilled : styles.starEmpty}>
                            ⭐
                        </span>
                    ))}
                </div>

                <h2 className={styles.scoreBig}>
                    {scoreDetails.total} <span className={styles.scorePts}>XP</span>
                </h2>

                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>BASE</p>
                        <p className={styles.statValue}>{scoreDetails.base}</p>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>TIME BONUS</p>
                        <p className={styles.statValue}>+{scoreDetails.timeBonus}</p>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>STREAK</p>
                        <p className={styles.statValue}>+{scoreDetails.streakBonus}</p>
                    </div>
                </div>

                <div className={styles.accuracyBarContainer}>
                    <div className={styles.accuracyLabel}>ACCURACY: {Math.round(accuracy)}%</div>
                    <div className={styles.accuracyBar}>
                        <div className={styles.accuracyFill} style={{ width: `${accuracy}%` }} />
                    </div>
                </div>

                {scoreDetails.perfectBonus > 0 && (
                    <div className={styles.sharpshooter}>
                        🎯 PERFECT ROUND BONUS +{scoreDetails.perfectBonus} XP!
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button className={styles.playBtn} onClick={reset}>
                        PLAY AGAIN
                    </button>
                    {completion && (
                        <button
                            className={styles.playBtn}
                            onClick={() => completion.onComplete()}
                            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}
                        >
                            COMPLETE ✓
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
