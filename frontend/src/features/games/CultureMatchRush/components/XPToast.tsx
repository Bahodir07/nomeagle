import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../CultureMatchRush.module.css';

export const XPToast: React.FC = () => {
  const { activeToast, clearToast, openLearnMore } = useGameStore();

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => clearToast(), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, clearToast]);

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className={styles.toast}
        >
          <p className={styles.toastTitle}>+10 XP!</p>
          <p className={styles.toastContent}>
            <button
              onClick={() => { if (activeToast) openLearnMore(activeToast); }}
              className={styles.bookmarkBtn}
              title="Learn More"
            >
              🔖
            </button>
            {activeToast.fact}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
