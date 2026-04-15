import React, { useEffect } from 'react';
import { useFestivalStore } from '../store/useFestivalStore';
import styles from '../FestivalTimeline.module.css';

export const HUD: React.FC = () => {
    const {
        targetCountryName,
        targetCountryFlag,
        scoreDetails,
        timeLeft,
        tick,
        gameState
    } = useFestivalStore();

    // Timer loop
    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => tick(), 1000);
        return () => clearInterval(interval);
    }, [gameState, tick]);

    const mins = Math.floor(timeLeft / 60);
    const secs = (timeLeft % 60).toString().padStart(2, '0');

    return (
        <div className={styles.hudContainer}>
            <div className={styles.hudLogo}>
                <span className={styles.phoenixLogo}>🦚</span> {/* Placeholder logo */}
            </div>

            <div className={styles.hudCenter}>
                <h1 className={styles.targetCountryText}>
                    {targetCountryName.toUpperCase()} <span className={styles.targetFlag}>{targetCountryFlag}</span>
                </h1>
            </div>

            <div className={styles.hudStats}>
                <span className={styles.scoreText}>SCORE: {scoreDetails.total}</span>
                <span className={`${styles.timeText} ${timeLeft <= 10 ? styles.timeLow : ''}`}>
                    TIME: {mins}:{secs}
                </span>
            </div>
        </div>
    );
};
