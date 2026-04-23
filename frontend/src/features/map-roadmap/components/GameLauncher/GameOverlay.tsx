import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { GameType } from "../../types";
import { GameLauncher } from "./GameLauncher";
import { GameCompletionContext } from "./GameCompletionContext";
import styles from "./GameOverlay.module.css";

/* ==========================================================================
   GameOverlay — Full-screen overlay that hosts the active game.
   Slides in over the roadmap and can be dismissed via the back button.
   Provides GameCompletionContext so games can signal completion.
   ========================================================================== */

interface GameOverlayProps {
  /** The game type to render */
  gameType: GameType;
  /** Title shown in the overlay header */
  title: string;
  /** Called when the overlay is closed / game is exited (without completing) */
  onClose: () => void;
  /** Called when the game is completed — marks the node done and closes */
  onComplete: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  gameType,
  title: _title,
  onClose,
  onComplete,
}) => {
  /* Memoize the context value so we don't re-render the entire game tree
     every time the overlay re-renders */
  const completionCtx = useMemo(
    () => ({ onComplete }),
    [onComplete],
  );

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
    >
      {/* ─── Game content wrapped in completion context (full-screen) ─── */}
      <div className={styles.gameContent}>
        <GameCompletionContext.Provider value={completionCtx}>
          <GameLauncher gameType={gameType} onClose={onClose} />
        </GameCompletionContext.Provider>
      </div>
    </motion.div>
  );
};
