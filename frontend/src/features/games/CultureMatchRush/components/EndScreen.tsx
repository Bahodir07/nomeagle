import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { useGameCompletion } from '../../../map-roadmap/components/GameLauncher/GameCompletionContext';
import { submitGameCompletion } from '../../../../app/api/progress';
import styles from '../CultureMatchRush.module.css';

export const EndScreen: React.FC = () => {
  const { score, correctCount, incorrectCount, maxCombo, xpGained, level, initializeGame } = useGameStore();
  const completion = useGameCompletion();

  const totalAttempts = correctCount + incorrectCount;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
  const stars = score >= 2000 ? 3 : score >= 1000 ? 2 : score > 0 ? 1 : 0;
  const perfectRound = incorrectCount === 0 && correctCount > 0;

  const handleRetry = () => {
    if (level) {
      initializeGame(level);
      useGameStore.getState().startCountdown();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.overlayScreen}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={styles.modalBox}
      >
        <div className={styles.iconTrophy}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
          </svg>
        </div>
        <h2 className={styles.modalTitle}>Time's Up!</h2>

        <div className={styles.starsRow}>
          {[1, 2, 3].map((i) => (
            <svg key={i} width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i <= stars ? styles.starFilled : styles.starEmpty}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ))}
        </div>

        <div className={styles.finalScore}>
          {score} <span className={styles.finalScorePts}>pts</span>
        </div>

        <div className={styles.statsGrid}>
          <Stat label="Correct" value={String(correctCount)} color="#16a34a" />
          <Stat label="Errors" value={String(incorrectCount)} color="#ef4444" />
          <Stat label="Accuracy" value={`${accuracy}%`} color="#334155" />
          <Stat label="Max Combo" value={`${maxCombo}x`} color="#f97316" />
          <Stat label="XP Gained" value={`+${xpGained}`} color="#9333ea" />
          {perfectRound && (
            <div className={styles.perfectRound}>
              Perfect Round! +50 XP Bonus
            </div>
          )}
        </div>

        <div className={styles.modalButtons}>
          <button onClick={handleRetry} className={`${styles.btn} ${styles.btnSecondary}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            Retry
          </button>
          <button
            onClick={() => {
              submitGameCompletion('culture_match', xpGained, score).catch(console.error);
              if (completion) {
                completion.onComplete();
              } else {
                window.history.back();
              }
            }}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {completion ? 'Complete ✓' : 'Next'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Stat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className={styles.statItem}>
    <p className={styles.statLabel}>{label}</p>
    <p className={styles.statValue} style={{ color }}>{value}</p>
  </div>
);
