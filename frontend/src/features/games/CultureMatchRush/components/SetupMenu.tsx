import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { japanLevelMock } from '../data/jp.mock';
import { kazakhstanLevelMock } from '../data/kz.mock';
import type { GameLevel } from '../types';
import styles from './SetupMenu.module.css';

const COUNTRIES: { id: string; flag: string; name: string; level: GameLevel }[] = [
  { id: 'JP', flag: '🇯🇵', name: 'Japan', level: japanLevelMock },
  { id: 'KZ', flag: '🇰🇿', name: 'Kazakhstan', level: kazakhstanLevelMock },
];

export const SetupMenu: React.FC = () => {
  const { initializeGame, startCountdown } = useGameStore();
  const [selectedCountryId, setSelectedCountryId] = useState(COUNTRIES[0].id);

  const handleStart = () => {
    const country = COUNTRIES.find((c) => c.id === selectedCountryId) ?? COUNTRIES[0];
    initializeGame(country.level);
    startCountdown();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h1 className={styles.title}>Culture Match Rush</h1>
        <p className={styles.subtitle}>Drag cultural traditions to the correct categories before time runs out!</p>

        <h3 className={styles.sectionLabel}>Select Country</h3>
        <div className={styles.countryGrid}>
          {COUNTRIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.countryChip} ${selectedCountryId === c.id ? styles.countryChipActive : ''}`}
              onClick={() => setSelectedCountryId(c.id)}
            >
              <span className={styles.flag}>{c.flag}</span>
              <span className={styles.countryName}>{c.name}</span>
            </button>
          ))}
        </div>

        <button type="button" className={styles.startBtn} onClick={handleStart}>
          START GAME
        </button>
      </div>
    </div>
  );
};
