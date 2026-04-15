import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSprintStore } from '../store/useSprintStore';
import styles from '../StreetFoodSprint.module.css';

export const CountdownOverlay: React.FC = () => {
  const { countdownPhase, targetCountryFlag, targetCountryName, tickCountdown } = useSprintStore();

  useEffect(() => {
    if (countdownPhase === null) return;
    const delay = countdownPhase === 'go' ? 600 : 1000;
    const id = setTimeout(() => tickCountdown(), delay);
    return () => clearTimeout(id);
  }, [countdownPhase, tickCountdown]);

  if (countdownPhase === null) return null;

  return (
    <div className={styles.countdownOverlay}>
      <motion.div
        key={String(countdownPhase)}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={styles.countdownNumber}
      >
        {countdownPhase === 'go' ? 'GO!' : countdownPhase}
      </motion.div>

      <motion.div
        className={styles.targetBannerPreview}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🎯 TARGET: {targetCountryFlag} {targetCountryName.toUpperCase()}
      </motion.div>
    </div>
  );
};
