import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { HUD } from './components/HUD';
import { GameBoard } from './components/GameBoard';
import { XPToast } from './components/XPToast';
import { EndScreen } from './components/EndScreen';
import { LearnMoreModal } from './components/LearnMoreModal';
import { japanLevelMock } from './data/jp.mock';
import { motion, AnimatePresence } from 'framer-motion';
import japanBg from '../../../assets/images/japan_background.png';
import styles from './CultureMatchRush.module.css';

export const GameContainer: React.FC = () => {
  const {
    gameState, countdownPhase, learnMoreOpen,
    lastMatchResult, lastPointsEarned,
    initializeGame, startCountdown, tickCountdown, clearMatchFeedback, level,
  } = useGameStore();

  const [isShaking, setIsShaking] = React.useState(false);

  useEffect(() => { 
    // Auto-init and auto-start
    initializeGame(japanLevelMock); 
    useGameStore.getState().startCountdown();
  }, [initializeGame]);

  useEffect(() => {
    if (countdownPhase === null) return;
    const t = countdownPhase === 'go' ? 600 : 1000;
    const id = setTimeout(() => tickCountdown(), t);
    return () => clearTimeout(id);
  }, [countdownPhase, tickCountdown]);

  useEffect(() => {
    if (lastMatchResult === 'incorrect') {
      setIsShaking(true);
      const id = setTimeout(() => { setIsShaking(false); clearMatchFeedback(); }, 500);
      return () => clearTimeout(id);
    }
    if (lastMatchResult === 'correct') {
      const id = setTimeout(() => clearMatchFeedback(), 1200);
      return () => clearTimeout(id);
    }
  }, [lastMatchResult, clearMatchFeedback]);

  const bg = level?.backgroundImage || japanBg;

  /* ──── Countdown Overlay ──── */
  if (gameState === 'idle' && countdownPhase !== null) {
    return (
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className={styles.countdownOverlay}>
          <motion.div
            key={String(countdownPhase)}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={styles.countdownText}
          >
            {countdownPhase === 'go' ? 'GO!' : countdownPhase}
          </motion.div>
        </div>
      </div>
    );
  }

  /* ──── Game screen ──── */
  return (
    <motion.div
      className={styles.container}
      style={{ backgroundImage: `url(${bg})` }}
      animate={{ x: isShaking ? [0, -8, 8, -8, 8, 0] : 0 }}
      transition={{ duration: 0.35 }}
    >
      <HUD />

      <div className={styles.gameArea}>
        <GameBoard />

        <AnimatePresence>
          {lastMatchResult === 'correct' && lastPointsEarned > 0 && (
            <motion.div
              key={`pts-${Date.now()}`}
              initial={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              animate={{ opacity: 0, y: -80, scale: 1.4, x: "-50%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className={styles.floatingPoints}
            >
              +{lastPointsEarned}
            </motion.div>
          )}
        </AnimatePresence>

        <XPToast />
      </div>

      {gameState === 'ended' && <EndScreen />}
      <LearnMoreModal />

      {gameState === 'paused' && !learnMoreOpen && (
        <div className={styles.overlayScreen}>
          <div className={styles.modalBox}>
            <h3 className={styles.modalTitle}>Paused</h3>
            <button
              onClick={() => useGameStore.getState().resumeGame()}
              className={`${styles.btn} ${styles.btnPrimary}`}
              style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }}
            >
              Resume
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
