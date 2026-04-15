import React from 'react';
import { GameContainer } from '../../../features/games/CultureMatchRush/GameContainer';

/**
 * Full-screen Culture Match Rush game page.
 * Route: /app/countries/:countryCode/game
 * Game data is loaded inside GameContainer (mock for now; later from backend by countryCode).
 */
export const CultureMatchRushPage: React.FC = () => {
  return <GameContainer />;
};
