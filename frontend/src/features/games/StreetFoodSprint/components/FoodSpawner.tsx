import React, { useEffect, useRef } from 'react';
import { useSprintStore, getSlideDuration, getSpawnInterval } from '../store/useSprintStore';
import { getRandomFood } from '../data/foods';

let spawnCounter = 0;

export const FoodSpawner: React.FC = () => {
  const gameState = useSprintStore(s => s.gameState);
  const difficulty = useSprintStore(s => s.difficulty);
  const addFood = useSprintStore(s => s.addFood);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const ms = getSpawnInterval(difficulty);

    intervalRef.current = setInterval(() => {
      const state = useSprintStore.getState();
      if (state.gameState !== 'playing') return;

      const food = getRandomFood(state.targetCountryId, state.difficulty);
      if (!food) return;

      const lane = 0;
      const slideDuration = getSlideDuration(state.difficulty, state.elapsedTime, state.isFeverTime);

      state.addFood({
        uid: `sf_${++spawnCounter}_${Date.now()}`,
        food,
        spawnedAt: Date.now(),
        lane,
        slideDuration,
      });
    }, ms);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameState, difficulty, addFood]);

  return null;
};
