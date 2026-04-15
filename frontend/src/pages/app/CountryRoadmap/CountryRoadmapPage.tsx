import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CountryRoadmap } from "../../../features/map-roadmap/components/CountryRoadmap/CountryRoadmap";
import { GameOverlay } from "../../../features/map-roadmap/components/GameLauncher";
import { kazakhstanRoadmapMock } from "../../../features/map-roadmap/mock/kazakhstanRoadmap.mock";
import {
  getUnlockedNodes,
  markNodeCompleted,
} from "../../../features/map-roadmap/utils/progression";
import type { GameNode } from "../../../features/map-roadmap/types";
import styles from "./CountryRoadmapPage.module.css";

/* ==========================================================================
   CountryRoadmapPage
   Renders the visual roadmap. When a node is clicked the corresponding game
   opens in a full-screen overlay managed by local state (`activeGame`).
   Completing a game marks it done and unlocks the next node.
   ========================================================================== */

export const CountryRoadmapPage: React.FC = () => {
  const { countryCode: _countryCode } = useParams<{ countryCode: string }>();

  // In a full application we would fetch the dynamic roadmap data matching the `countryCode`.
  // Here we use the kazakhstan mockup data as requested.
  const baseRoadmap = kazakhstanRoadmapMock;

  /* ── Progression version counter ───────────────────────────────────────
     Bumping this forces `roadmapWithProgression` to recalculate from
     localStorage after a node is marked complete. */
  const [progressionVersion, setProgressionVersion] = useState(0);

  const roadmapWithProgression = useMemo(() => {
    return {
      ...baseRoadmap,
      nodes: getUnlockedNodes(baseRoadmap.nodes),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseRoadmap, progressionVersion]);

  /* ── Active game state ─────────────────────────────────────────────────── */
  const [activeGame, setActiveGame] = useState<GameNode | null>(null);

  /** When a roadmap node is clicked, open its game in the overlay */
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = roadmapWithProgression.nodes.find((n) => n.id === nodeId);
      if (node && !node.isLocked) {
        setActiveGame(node);
      }
    },
    [roadmapWithProgression.nodes],
  );

  /** Close the game overlay without completing (e.g. the "Back" button) */
  const handleCloseGame = useCallback(() => {
    setActiveGame(null);
  }, []);

  /** Called by a game when it is completed.
   *  1. Marks the node as completed in localStorage.
   *  2. Bumps the progression version so the roadmap re-renders.
   *  3. Closes the game overlay. */
  const handleGameComplete = useCallback(() => {
    if (!activeGame) return;

    // Persist completion
    markNodeCompleted(activeGame.id);

    // Close the overlay
    setActiveGame(null);

    // Bump version → recalculate node locked/completed states
    setProgressionVersion((v) => v + 1);
  }, [activeGame]);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <CountryRoadmap
          roadmap={roadmapWithProgression}
          onNodeClick={handleNodeClick}
        />
      </main>

      {/* ── Game overlay (renders on top of the roadmap) ── */}
      <AnimatePresence>
        {activeGame && (
          <GameOverlay
            key={activeGame.id}
            gameType={activeGame.gameType}
            title={activeGame.title}
            onClose={handleCloseGame}
            onComplete={handleGameComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
