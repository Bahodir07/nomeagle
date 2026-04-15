import React, { useState } from "react";
import type { GameType } from "../../types";

/* ── Game Component Imports ─────────────────────────────────────────────── */
import { GameContainer as CultureMatchRush } from "../../../games/CultureMatchRush/GameContainer";
import { FestivalTimeline } from "../../../games/FestivalTimeline/FestivalTimeline";
import { GuessTheLandmark } from "../../../games/GuessTheLandmark/GuessTheLandmark";
import { SprintContainer as StreetFoodSprint } from "../../../games/StreetFoodSprint/SprintContainer";
import { landmarkGameMockData } from "../../../games/GuessTheLandmark/landmarks.mock";

/* ==========================================================================
   GameLauncher — "Game Factory" component
   Receives a gameType string and renders the correct game component.
   ========================================================================== */

interface GameLauncherProps {
  /** Which game to render */
  gameType: GameType;
  /** Called when the player finishes or exits the game */
  onClose: () => void;
}

/**
 * Internal wrapper for GuessTheLandmark which requires props (unlike the
 * other games which are self-contained containers with internal state).
 */
const GuessTheLandmarkGame: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const landmark = landmarkGameMockData[currentIdx];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % landmarkGameMockData.length);
  };

  const options = landmark.choices.map((c) => ({ id: c, name: c }));

  return (
    <GuessTheLandmark
      key={landmark.id}
      emoji={landmark.emoji}
      options={options}
      correctAnswerId={landmark.landmarkName}
      fact={landmark.culturalFact}
      onAnswer={(isCorrect, score) => {
        console.log(`Landmark answer — correct: ${isCorrect}, score: ${score}`);
      }}
      onNext={handleNext}
    />
  );
};

/**
 * Renders the correct game component based on `gameType`.
 * Acts as a "Game Factory" — one single switch point for all games.
 */
export const GameLauncher: React.FC<GameLauncherProps> = ({
  gameType,
  onClose: _onClose,
}) => {
  switch (gameType) {
    case "CultureMatchRush":
      return <CultureMatchRush />;
    case "FestivalTimeline":
      return <FestivalTimeline />;
    case "GuessTheLandmark":
      return <GuessTheLandmarkGame />;
    case "StreetFoodSprint":
      return <StreetFoodSprint />;
    default: {
      // Safety net — should never happen with TypeScript exhaustive checking
      const _exhaustiveCheck: never = gameType;
      void _exhaustiveCheck;
      return null;
    }
  }
};
