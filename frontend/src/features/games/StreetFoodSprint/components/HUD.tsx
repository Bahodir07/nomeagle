import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSprintStore } from '../store/useSprintStore';
import styles from '../StreetFoodSprint.module.css';

export const HUD: React.FC = () => {
  const {
    score, timeLeft, gameState,
    targetCountryId, targetCountryName, targetCountryFlag,
    isFeverTime, feverTimeLeft, consecutiveCorrect,
    tick,
  } = useSprintStore();

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [gameState, tick]);

  const isLow = timeLeft <= 10;

  const feverProgress = isFeverTime
    ? (feverTimeLeft / 5) * 100
    : (consecutiveCorrect / 10) * 100;

  const handleExit = () => {
    if (window.confirm('Exit the game?')) {
      window.history.back();
    }
  };

  return (
    <>
      <div className={styles.hud}>
        <div className={styles.hudLeft}>
          <span className={styles.scoreText}>SCORE: {score}</span>
        </div>

        <div className={styles.hudCenter}>
          <AnimatePresence mode="wait">
            <motion.div
              key={targetCountryId}
              className={styles.targetBanner}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className={styles.targetLabel}>TARGET COUNTRY:</span>
              <div className={styles.targetContent}>
                <span className={styles.targetFlag}>{targetCountryFlag}</span>
                {targetCountryName.toUpperCase()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.hudRight}>
          <motion.span
            className={`${styles.timerText} ${isLow ? styles.timerLow : ''}`}
            animate={isLow ? { scale: [1, 1.1, 1] } : {}}
            transition={isLow ? { repeat: Infinity, duration: 0.8 } : {}}
          >
            TIME: {timeLeft}s
          </motion.span>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button className={styles.exitBtn} onClick={handleExit}>EXIT</button>
        <div className={`${styles.feverBarWrap} ${isFeverTime ? styles.feverBarGlow : ''}`}>
          <div
            className={`${styles.feverBarFill} ${isFeverTime ? styles.feverBarActive : ''}`}
            style={{ width: `${Math.min(100, feverProgress)}%` }}
          />
          {isFeverTime && (
            <span className={styles.feverLabel}>🔥 FEVER TIME! 🔥</span>
          )}
        </div>
      </div>
    </>
  );
};
