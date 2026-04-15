import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSprintStore } from '../store/useSprintStore';
import { useGameCompletion } from '../../../map-roadmap/components/GameLauncher/GameCompletionContext';
import type { TappedFood } from '../types';
import styles from '../StreetFoodSprint.module.css';

function pickLearningCards(tapped: TappedFood[]): { correct: TappedFood | null; missed: TappedFood | null } {
  const correct = tapped.filter(t => t.wasCorrect);
  const incorrect = tapped.filter(t => !t.wasCorrect);

  const uniqueCorrect = correct.length > 0
    ? correct[Math.floor(Math.random() * correct.length)]
    : null;

  const uniqueMissed = incorrect.length > 0
    ? incorrect[Math.floor(Math.random() * incorrect.length)]
    : null;

  return { correct: uniqueCorrect, missed: uniqueMissed };
}

export const PostGameReview: React.FC = () => {
  const {
    score, correctCount, incorrectCount, missedCount, maxCombo,
    xpGained, tappedFoods, difficulty, mode,
    configure, startCountdown, reset,
    targetCountryId,
  } = useSprintStore();
  const completion = useGameCompletion();

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [cards] = useState(() => pickLearningCards(tappedFoods));

  const totalTaps = correctCount + incorrectCount;
  const accuracy = totalTaps > 0 ? Math.round((correctCount / totalTaps) * 100) : 0;
  const stars = score >= 2000 ? 3 : score >= 800 ? 2 : score > 0 ? 1 : 0;
  const isSharpshooter = incorrectCount === 0 && correctCount > 0;

  const handleRetry = () => {
    configure(mode, difficulty, targetCountryId);
    startCountdown();
  };

  const handleDone = () => {
    reset();
    if (completion) {
      completion.onComplete();
    } else {
      window.history.back();
    }
  };

  return (
    <motion.div
      className={styles.reviewOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={styles.reviewCard}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className={styles.reviewTitle}>Time's Up!</h2>
        <p className={styles.reviewSubtitle}>
          {mode === 'mixed' ? '🌍 Mixed World Mode' : '🎯 Focus Mode'} · Lvl {difficulty}
        </p>

        <p className={styles.scoreBig}>
          {score} <span className={styles.scorePts}>pts</span>
        </p>

        <div className={styles.starsRow}>
          {[1, 2, 3].map(i => (
            <svg
              key={i} width="28" height="28" viewBox="0 0 24 24"
              fill="currentColor" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className={i <= stars ? styles.starFilled : styles.starEmpty}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>

        <div className={styles.statsGrid}>
          <Stat label="Correct" value={String(correctCount)} color="#16a34a" />
          <Stat label="Errors" value={String(incorrectCount)} color="#ef4444" />
          <Stat label="Missed" value={String(missedCount)} color="#f97316" />
          <Stat label="Accuracy" value={`${accuracy}%`} color="#334155" />
          <Stat label="Max Combo" value={`${maxCombo}x`} color="#f97316" />
          <Stat label="Difficulty" value={['Easy', 'Medium', 'Hard'][difficulty - 1]} color="#6366f1" />
          {isSharpshooter && (
            <div className={styles.sharpshooter}>🎯 Sharpshooter! +100 XP Bonus</div>
          )}
        </div>

        <div className={styles.xpSection}>
          <span className={styles.xpAmount}>+{xpGained} XP</span>
          <div className={styles.xpBar}>
            <motion.div
              className={styles.xpBarFill}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, xpGained)}%` }}
              transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <span className={styles.xpLabel}>EARNED</span>
        </div>

        {(cards.correct || cards.missed) && (
          <div className={styles.microSection}>
            <p className={styles.microTitle}>Did You Know?</p>

            {cards.correct && (
              <FactCard
                food={cards.correct}
                type="correct"
                expanded={expandedCard === cards.correct.food.id}
                onToggle={() => setExpandedCard(
                  expandedCard === cards.correct!.food.id ? null : cards.correct!.food.id
                )}
              />
            )}

            {cards.missed && (
              <FactCard
                food={cards.missed}
                type="missed"
                expanded={expandedCard === cards.missed.food.id}
                onToggle={() => setExpandedCard(
                  expandedCard === cards.missed!.food.id ? null : cards.missed!.food.id
                )}
              />
            )}
          </div>
        )}

        <div className={styles.reviewButtons}>
          <button onClick={handleRetry} className={`${styles.btn} ${styles.btnSecondary}`}>
            ↻ Retry
          </button>
          <button onClick={handleDone} className={`${styles.btn} ${styles.btnPrimary}`}>
            Done →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Stat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className={styles.statItem}>
    <p className={styles.statLabel}>{label}</p>
    <p className={styles.statValue} style={{ color }}>{value}</p>
  </div>
);

const FactCard: React.FC<{
  food: TappedFood;
  type: 'correct' | 'missed';
  expanded: boolean;
  onToggle: () => void;
}> = ({ food, type, expanded, onToggle }) => (
  <div className={`${styles.factCard} ${type === 'missed' ? styles.factCardMissed : ''}`}>
    <div className={styles.factHeader}>
      <span className={styles.factEmoji}>{food.food.emoji}</span>
      <span className={styles.factName}>{food.food.name}</span>
      <span className={`${styles.factBadge} ${type === 'correct' ? styles.factBadgeCorrect : styles.factBadgeMissed}`}>
        {type === 'correct' ? '✓ Correct' : '✗ Missed'}
      </span>
    </div>
    <p className={styles.factText}>{food.food.microFact}</p>
    <button className={styles.learnMoreBtn} onClick={onToggle}>
      {expanded ? '▾ Less' : '▸ Learn More'}
    </button>
    {expanded && (
      <motion.p
        className={styles.deepDiveText}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
      >
        {food.food.deepDive}
      </motion.p>
    )}
  </div>
);
