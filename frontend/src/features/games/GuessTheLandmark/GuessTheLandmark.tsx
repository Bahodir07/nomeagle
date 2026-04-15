import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameCompletion } from '../../map-roadmap/components/GameLauncher/GameCompletionContext';
import styles from './GuessTheLandmark.module.css';

export interface LandmarkOption {
  id: string;
  name: string;
}

export interface GuessTheLandmarkProps {
  emoji: string;
  options: LandmarkOption[];
  correctAnswerId: string;
  fact: string;
  onAnswer?: (isCorrect: boolean, score: number) => void;
  onNext?: () => void;
}

const MAX_BLUR = 25;
const BLUR_STEP = 5;
const INTERVAL_MS = 1500;
const MAX_SCORE = 1000;

const playCorrectSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); 
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio playback not supported", e);
  }
};

export const GuessTheLandmark: React.FC<GuessTheLandmarkProps> = ({
  emoji,
  options,
  correctAnswerId,
  fact,
  onAnswer,
  onNext,
}) => {
  const [blurValue, setBlurValue] = useState(MAX_BLUR);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState<Set<string>>(new Set());
  const [shakingOptionId, setShakingOptionId] = useState<string | null>(null);

  const [personalBest, setPersonalBest] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const completion = useGameCompletion();

  useEffect(() => {
    try {
      const savedPb = localStorage.getItem('guess_landmark_pb');
      if (savedPb) setPersonalBest(parseInt(savedPb, 10));
      
      const savedStreak = sessionStorage.getItem('guess_landmark_streak');
      if (savedStreak) setComboStreak(parseInt(savedStreak, 10));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    if (blurValue <= 0) {
      setIsGameOver(true);
      setHasWon(false);
      setComboStreak(0);
      sessionStorage.setItem('guess_landmark_streak', '0');
      onAnswer?.(false, 0);
      return;
    }

    const timer = setInterval(() => {
      setBlurValue((prev) => Math.max(0, prev - BLUR_STEP));
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [blurValue, isGameOver, onAnswer]);

  const handleOptionClick = (optionId: string) => {
    if (isGameOver || incorrectGuesses.has(optionId)) return;

    if (optionId === correctAnswerId) {
      setIsGameOver(true);
      setHasWon(true);
      playCorrectSound();
      
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      sessionStorage.setItem('guess_landmark_streak', newStreak.toString());
      
      let calculatedScore = Math.round((blurValue / MAX_BLUR) * MAX_SCORE);
      
      if (newStreak >= 3) {
        calculatedScore *= 2;
      }
      
      setScore(calculatedScore);
      setBlurValue(0); 
      
      if (calculatedScore > personalBest) {
        setPersonalBest(calculatedScore);
        localStorage.setItem('guess_landmark_pb', calculatedScore.toString());
      }

      onAnswer?.(true, calculatedScore);
    } else {
      setComboStreak(0);
      sessionStorage.setItem('guess_landmark_streak', '0');
      
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      const newIncorrect = new Set(incorrectGuesses);
      newIncorrect.add(optionId);
      setIncorrectGuesses(newIncorrect);
      
      setShakingOptionId(optionId);
      setTimeout(() => setShakingOptionId(null), 500); 
    }
  };

  const progressPercentage = (blurValue / MAX_BLUR) * 100;
  const isComboActive = comboStreak >= 3;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.titleText}>
            {!isGameOver ? "Guess the Landmark" : hasWon ? "Correct Answer!" : "Time's Up!"}
          </span>
          {!isGameOver && <span className={styles.percentageBadge}>{Math.round(progressPercentage)}% Obscured</span>}
          {isGameOver && hasWon && (
            <div className={styles.wonStats}>
              {isComboActive && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className={styles.comboBadge}
                >
                  🚀 2x COMBO
                </motion.span>
              )}
              <span className={styles.scoreBadge}>
                Score: {score}
              </span>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div
            className={`${styles.progressFill} ${
              hasWon ? styles.bgEmerald : isGameOver ? styles.bgRed : styles.bgBlue
            }`}
            style={{ width: isGameOver && !hasWon ? '0%' : `${progressPercentage}%` }}
          />
        </div>

        {/* HUD Statistics */}
        <div className={styles.statsRow}>
          <span>Streak: {comboStreak} 🔥</span>
          {personalBest > 0 && <span>P.B. 🏆 {personalBest}</span>}
        </div>
      </div>

      {/* Emoji Picture Layout */}
      <motion.div 
        key={emoji}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={styles.pictureContainer}
      >
        {/* Super scaled Emoji using blur */}
        <div 
          className={styles.emoji}
          style={{ filter: `blur(${blurValue}px)` }}
        >
          {emoji}
        </div>
        <div className={styles.gradientOverlay} />
      </motion.div>

      {/* Input Grid (2x2) */}
      <div className={styles.optionsGrid}>
        <AnimatePresence mode="popLayout">
          {options.map((option, index) => {
            const isCorrectAndOver = isGameOver && option.id === correctAnswerId;
            const isIncorrect = incorrectGuesses.has(option.id);
            const isShaking = shakingOptionId === option.id;

            let btnClassNames = styles.optionBtn;

            if (isCorrectAndOver) {
              btnClassNames += ` ${styles.optionBtnCorrect}`;
            } else if (isIncorrect) {
              btnClassNames += ` ${styles.optionBtnIncorrect}`;
            } else if (isGameOver) {
              btnClassNames += ` ${styles.optionBtnDisabled}`;
            } else {
              btnClassNames += ` ${styles.optionBtnDefault}`;
            }

            if (isShaking) {
              btnClassNames += ` ${styles.animateLocalShake} ${styles.optionBtnShaking}`;
            }

            return (
              <motion.button
                key={`${emoji}-${option.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                whileTap={!isGameOver && !isIncorrect ? { scale: 0.95 } : undefined}
                whileHover={!isGameOver && !isIncorrect && !isCorrectAndOver ? { scale: 1.02 } : undefined}
                onClick={() => handleOptionClick(option.id)}
                disabled={isGameOver || isIncorrect}
                className={btnClassNames}
              >
                {option.name}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Game Over / Insight Fact Card */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={styles.insightCard}
          >
            <div className={styles.insightContent}>
              <h3 className={styles.insightTitle}>
                <span className={styles.insightIcon}>{hasWon ? "🎉" : "💡"}</span>
                Cultural Insight
              </h3>
              <p className={styles.insightText}>
                {fact}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                onClick={() => {
                  setBlurValue(MAX_BLUR);
                  setIsGameOver(false);
                  setHasWon(false);
                  setScore(0);
                  setIncorrectGuesses(new Set());
                  onNext?.();
                }}
                className={styles.nextBtn}
                style={completion ? { flex: 1 } : { width: '100%' }}
              >
                Next Landmark
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.nextBtnIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {completion && (
                <button
                  onClick={() => completion.onComplete()}
                  className={styles.nextBtn}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                    borderColor: '#16a34a',
                  }}
                >
                  Complete ✓
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
