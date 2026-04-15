import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSprintStore } from './store/useSprintStore';
import { SetupMenu } from './components/SetupMenu';
import { CountdownOverlay } from './components/CountdownOverlay';
import { HUD } from './components/HUD';
import { ConveyorBelt } from './components/ConveyorBelt';
import { PostGameReview } from './components/PostGameReview';
import styles from './StreetFoodSprint.module.css';

export const SprintContainer: React.FC = () => {
  const gameState = useSprintStore(s => s.gameState);
  const targetCountryName = useSprintStore(s => s.targetCountryName);
  const targetCountryFlag = useSprintStore(s => s.targetCountryFlag);

  if (gameState === 'setup') {
    return (
      <div className={styles.container}>
        <SetupMenu />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HUD />
      <ConveyorBelt />

      <AnimatePresence>
        {gameState === 'countdown' && <CountdownOverlay />}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'transition' && (
          <motion.div
            className={styles.transitionOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className={styles.transitionText}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
            >
              🔔 SWITCHING COUNTRY!<br />
              {targetCountryFlag} {targetCountryName.toUpperCase()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {gameState === 'ended' && <PostGameReview />}
    </div>
  );
};
