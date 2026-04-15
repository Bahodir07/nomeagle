import React, { useState } from 'react';
import { GuessTheLandmark } from '../../../features/games/GuessTheLandmark/GuessTheLandmark';
import { landmarkGameMockData } from '../../../features/games/GuessTheLandmark/landmarks.mock';
import styles from './GuessTheLandmarkPage.module.css';

/**
 * Full-screen Guess the Landmark game page.
 * Showcase for the Guess The Landmark game component.
 */
export const GuessTheLandmarkPage: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const landmark = landmarkGameMockData[currentIdx];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % landmarkGameMockData.length);
  };

  const handleAnswer = (isCorrect: boolean, score: number) => {
    console.log(`Answer Correct: ${isCorrect}, Score: ${score}`);
  };

  // Format options for the component
  const options = landmark.choices.map(c => ({ id: c, name: c }));

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>NomEagle Explorer: Guess the Landmark</h1>
        <p className={styles.subtitle}>
          Test your cultural knowledge. The faster you clear the blur, the higher your score!
        </p>
      </div>

      <GuessTheLandmark
        key={landmark.id} // Important for Framer Motion to re-trigger animations
        emoji={landmark.emoji}
        options={options}
        correctAnswerId={landmark.landmarkName}
        fact={landmark.culturalFact}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
      
      <div className={styles.footerInfo}>
        Region: <span className={styles.regionValue}>{landmark.region}</span>
      </div>
    </div>
  );
};
