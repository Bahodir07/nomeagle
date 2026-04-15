import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSprintStore } from '../store/useSprintStore';
import { COUNTRIES } from '../data/foods';
import type { DifficultyLevel, GameMode } from '../types';
import styles from '../StreetFoodSprint.module.css';

const DIFFICULTIES: { level: DifficultyLevel; label: string; mult: string }[] = [
  { level: 1, label: 'Easy', mult: '1.0x XP' },
  { level: 2, label: 'Medium', mult: '1.5x XP' },
  { level: 3, label: 'Hard', mult: '2.0x XP' },
];

export const SetupMenu: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('focus');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [countryId, setCountryId] = useState('JP');
  const { configure, startCountdown } = useSprintStore();

  const handlePlay = () => {
    configure(mode, difficulty, countryId);
    startCountdown();
  };

  return (
    <div className={styles.setupOverlay}>
      <motion.div
        className={styles.setupCard}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={styles.setupTitle}>Street Food Sprint</h1>
        <p className={styles.setupSubtitle}>How fast can you identify foods from around the world?</p>

        <p className={styles.sectionLabel}>Game Mode</p>
        <div className={styles.modeGrid}>
          <div
            className={`${styles.modeCard} ${mode === 'focus' ? styles.modeCardActive : ''}`}
            onClick={() => setMode('focus')}
          >
            <span className={styles.modeEmoji}>🎯</span>
            <p className={styles.modeTitle}>Country Focus</p>
            <p className={styles.modeDesc}>One country, full focus. Master a single cuisine.</p>
          </div>
          <div
            className={`${styles.modeCard} ${mode === 'mixed' ? styles.modeCardActive : ''}`}
            onClick={() => setMode('mixed')}
          >
            <span className={styles.modeEmoji}>🌍</span>
            <p className={styles.modeTitle}>Mixed World</p>
            <p className={styles.modeDesc}>Countries flip every 15s. +50% XP bonus!</p>
          </div>
        </div>

        <p className={styles.sectionLabel}>Difficulty</p>
        <div className={styles.difficultyGrid}>
          {DIFFICULTIES.map(d => (
            <div
              key={d.level}
              className={`${styles.diffCard} ${difficulty === d.level ? styles.diffCardActive : ''}`}
              onClick={() => setDifficulty(d.level)}
            >
              <p className={styles.diffLevel}>{d.level}</p>
              <p className={styles.diffLabel}>{d.label}</p>
              <p className={styles.diffMultiplier}>{d.mult}</p>
            </div>
          ))}
        </div>

        {mode === 'focus' && (
          <div className={styles.countrySelect}>
            <p className={styles.sectionLabel}>Target Country</p>
            <div className={styles.countryGrid}>
              {COUNTRIES.map(c => (
                <div
                  key={c.id}
                  className={`${styles.countryChip} ${countryId === c.id ? styles.countryChipActive : ''}`}
                  onClick={() => setCountryId(c.id)}
                >
                  <span className={styles.countryChipFlag}>{c.flag}</span>
                  <span className={styles.countryChipName}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className={styles.playBtn} onClick={handlePlay}>
          Start Sprint
        </button>
      </motion.div>
    </div>
  );
};
