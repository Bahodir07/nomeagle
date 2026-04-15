import React, { useState } from 'react';
import { useFestivalStore } from '../store/useFestivalStore';
import { COUNTRIES } from '../data/festivals';
import type { DifficultyLevel, TimelineMode } from '../types';
import styles from '../FestivalTimeline.module.css';

export const SetupMenu: React.FC = () => {
    const { configure, startPlaying } = useFestivalStore();
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0].id);
    const [selectedMode, setSelectedMode] = useState<TimelineMode>('season');
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(1);

    const handleStart = () => {
        configure(selectedMode, selectedDifficulty, selectedCountry);
        startPlaying();
    };

    return (
        <div className={styles.setupOverlay}>
            <div className={styles.setupCard}>
                <h1 className={styles.setupTitle}>Festival Timeline</h1>
                <p className={styles.setupSubtitle}>Drag events to their correct time of year!</p>

                <h3 className={styles.sectionLabel}>Select Country</h3>
                <div className={styles.countryGrid}>
                    {COUNTRIES.map(c => (
                        <div
                            key={c.id}
                            className={`${styles.countryChip} ${selectedCountry === c.id ? styles.countryChipActive : ''}`}
                            onClick={() => setSelectedCountry(c.id)}
                        >
                            <span className={styles.countryChipFlag}>{c.flag}</span>
                            <span className={styles.countryChipName}>{c.name}</span>
                        </div>
                    ))}
                </div>

                <h3 className={styles.sectionLabel}>Timeline Mode</h3>
                <div className={styles.modeGrid}>
                    <div
                        className={`${styles.modeCard} ${selectedMode === 'season' ? styles.modeCardActive : ''}`}
                        onClick={() => setSelectedMode('season')}
                    >
                        <span className={styles.modeEmoji}>🌸</span>
                        <h4 className={styles.modeTitle}>Seasons</h4>
                        <p className={styles.modeDesc}>Sort by Spring, Summer, Autumn, Winter</p>
                    </div>
                    <div
                        className={`${styles.modeCard} ${selectedMode === 'calendar' ? styles.modeCardActive : ''}`}
                        onClick={() => setSelectedMode('calendar')}
                    >
                        <span className={styles.modeEmoji}>📅</span>
                        <h4 className={styles.modeTitle}>Calendar</h4>
                        <p className={styles.modeDesc}>Sort exactly by Month (Jan-Dec)</p>
                    </div>
                </div>

                <h3 className={styles.sectionLabel}>Difficulty</h3>
                <div className={styles.difficultyGrid}>
                    {[1, 2, 3].map((level) => (
                        <div
                            key={level}
                            className={`${styles.diffCard} ${selectedDifficulty === level ? styles.diffCardActive : ''}`}
                            onClick={() => setSelectedDifficulty(level as DifficultyLevel)}
                        >
                            <h4 className={styles.diffLevel}>LVL {level}</h4>
                            <p className={styles.diffLabel}>{level === 1 ? '60s' : level === 2 ? '45s' : '30s'}</p>
                        </div>
                    ))}
                </div>

                <button className={styles.playBtn} onClick={handleStart}>
                    START PUZZLE
                </button>
            </div>
        </div>
    );
};
