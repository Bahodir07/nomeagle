import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../CultureMatchRush.module.css';

export const LearnMoreModal: React.FC = () => {
  const { learnMoreOpen, learnMoreData, closeLearnMore, resumeGame } = useGameStore();

  const handleClose = () => {
    closeLearnMore();
    resumeGame();
  };

  return (
    <AnimatePresence>
      {learnMoreOpen && learnMoreData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.overlayScreen}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={styles.modalBox}
            style={{ textAlign: 'left', padding: '1.5rem' }}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ fontSize: '1.5rem', marginBottom: 0 }}>Learn More</h3>
              <button onClick={handleClose} className={styles.closeBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <p className={styles.modalText}><strong>Fact:</strong> {learnMoreData.fact}</p>
            <p className={styles.modalSubText}><strong>Deep Dive:</strong> {learnMoreData.deepDive}</p>
            <p className={styles.modalFooterNote}>Game is paused. Click outside or close to resume.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
