import React, { useEffect, useState } from 'react';
import { useSprintStore, getSlideDuration } from '../store/useSprintStore';
import { FoodItem } from './FoodItem';
import { FoodSpawner } from './FoodSpawner';
import styles from '../StreetFoodSprint.module.css';

export const ConveyorBelt: React.FC = () => {
  const activeFoods = useSprintStore(s => s.activeFoods);
  const difficulty = useSprintStore(s => s.difficulty);
  const elapsedTime = useSprintStore(s => s.elapsedTime);
  const isFeverTime = useSprintStore(s => s.isFeverTime);

  const [beltSpeed, setBeltSpeed] = useState(1.5);

  useEffect(() => {
    const handleResize = () => {
      const slideDuration = getSlideDuration(difficulty, elapsedTime, isFeverTime);
      const dist = window.innerWidth + 240; // 100vw + 80px - (-160px)
      // The belt pattern is 64px wide
      const calculatedSpeed = (64 * slideDuration) / dist;
      setBeltSpeed(calculatedSpeed);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [difficulty, elapsedTime, isFeverTime]);

  return (
    <div className={styles.beltArea}>
      <div
        className={`${styles.beltTrack} ${styles.lane0}`}
        style={{ '--belt-speed': `${beltSpeed}s` } as React.CSSProperties}
      />
      <div className={`${styles.beltTrack} ${styles.lane1}`} />
      <div className={`${styles.beltTrack} ${styles.lane2}`} />

      {activeFoods.map(item => (
        <FoodItem key={item.uid} item={item} />
      ))}

      <FoodSpawner />
    </div>
  );
};
