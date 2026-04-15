import { createContext, useContext } from "react";

/* ==========================================================================
   GameCompletionContext
   Provides an `onComplete` callback that any game can call when the player
   finishes. The roadmap page supplies the real implementation which marks
   the node as completed and closes the overlay.
   ========================================================================== */

export interface GameCompletionContextValue {
  /** Call this to signal that the game is finished and the node should be
   *  marked as completed. The overlay will close and the roadmap will
   *  refresh to show the updated progression. */
  onComplete: () => void;
}

export const GameCompletionContext =
  createContext<GameCompletionContextValue | null>(null);

/**
 * Hook for game components to access the completion callback.
 * Returns `null` if the game is rendered outside the roadmap overlay
 * (e.g. on a standalone game page), so games remain backward-compatible.
 */
export const useGameCompletion = (): GameCompletionContextValue | null => {
  return useContext(GameCompletionContext);
};
