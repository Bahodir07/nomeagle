import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import styles from '../CultureMatchRush.module.css';

export const HUD: React.FC = () => {
  const { timeLeft, score, comboCount, gameState, pauseGame, resumeGame, tickTimer } = useGameStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => tickTimer(), 1000);
    }
    return () => { if (interval != null) clearInterval(interval); };
  }, [gameState, timeLeft, tickTimer]);

  const isLowTime = timeLeft <= 5;

  let multiplier = 1;
  if (comboCount >= 10) multiplier = 3;
  else if (comboCount >= 5) multiplier = 2;
  else if (comboCount >= 3) multiplier = 1.5;

  const togglePause = () => {
    if (gameState === 'playing') pauseGame();
    else resumeGame();
  };

  return (
    <div className={styles.hud}>
      <div className={styles.hudLeft}>
        <button onClick={togglePause} className={styles.hudButton}>
          <span style={{ fontSize: '1.5rem' }}>⏸</span> PAUSE
        </button>
      </div>

      <div className={styles.hudCenter}>
        <motion.div
          className={`${styles.timer} ${isLowTime ? styles.timerLow : styles.timerNormal}`}
          animate={isLowTime ? { scale: [1, 1.12, 1] } : {}}
          transition={isLowTime ? { repeat: Infinity, duration: 0.8 } : {}}
        >
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </motion.div>
      </div>

      <div className={styles.hudRight}>
        <div className={styles.scoreCombo}>
        <span>SCORE: {score}</span>
        {comboCount >= 2 && (
          <motion.span
            key={comboCount}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            | COMBO: {multiplier}x <span style={{ fontSize: '1.25rem' }}>🔥</span>
          </motion.span>
        )}
        </div>
      </div>
    </div>
  );
};
