import React from 'react';
import { useSprintStore } from '../store/useSprintStore';
import type { ActiveFood } from '../types';
import styles from '../StreetFoodSprint.module.css';

const LANE_POSITIONS = [50];

interface Props {
  item: ActiveFood;
}

export const FoodItem: React.FC<Props> = ({ item }) => {
  const tapFood = useSprintStore(s => s.tapFood);
  const handleMiss = useSprintStore(s => s.handleMiss);
  const removeFood = useSprintStore(s => s.removeFood);
  const targetCountryId = useSprintStore(s => s.targetCountryId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.tapped) return;
    tapFood(item.uid);
  };

  const handleSlideEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return;
    if (item.tapped) return;

    if (item.food.countryId === targetCountryId) {
      handleMiss();
    }
    removeFood(item.uid);
  };

  const laneY = LANE_POSITIONS[item.lane] ?? 50;
  const isPaused = item.tapped === 'correct';

  return (
    <div
      className={`${styles.foodSlider} ${isPaused ? styles.foodSliderPaused : ''} ${item.tapped === 'correct' ? styles.foodCorrect :
          item.tapped === 'incorrect' ? styles.foodIncorrect : ''
        }`}
      style={{
        '--slide-duration': `${item.slideDuration}s`,
        '--lane-y': `${laneY}%`,
      } as React.CSSProperties}
      onAnimationEnd={handleSlideEnd}
    >
      <div className={styles.foodCard} onClick={handleClick}>
        <span className={styles.foodEmoji}>{item.food.emoji}</span>
      </div>

      {item.tapped === 'correct' && item.pointsEarned != null && (
        <div className={styles.floatingPointsContainer}>
          <div className={styles.floatingCombo}>
            COMBO!<br />
            <span className={styles.floatingPts}>+{item.pointsEarned} PTS</span>
            {item.comboAtTap && item.comboAtTap >= 2 ? (
              <span className={styles.floatingComboCount}> 🔥x{Math.min(item.comboAtTap, 4)}</span>
            ) : null}
          </div>
          <div className={styles.glowRing1} />
          <div className={styles.glowRing2} />
          <div className={styles.glowRing3} />
        </div>
      )}
    </div>
  );
};
