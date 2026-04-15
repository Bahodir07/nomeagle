import React, { useState, useCallback } from 'react';
import { Button } from '../../../../components/ui/Button';
import type { ProfileDifficulty } from '../../types';
import styles from './LearningPreferencesForm.module.css';

const SAMPLE_COUNTRIES: { code: string; label: string }[] = [
  { code: 'jp', label: 'Japan' },
  { code: 'it', label: 'Italy' },
  { code: 'fr', label: 'France' },
  { code: 'de', label: 'Germany' },
  { code: 'es', label: 'Spain' },
  { code: 'pt', label: 'Portugal' },
];

const INTEREST_OPTIONS = [
  'Traditions',
  'Food',
  'Festivals',
  'History',
  'Language Basics',
];

const DIFFICULTY_OPTIONS: { value: ProfileDifficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

/* ==========================================================================
   LearningPreferencesForm
   Countries (checkboxes), interests (chips), difficulty (radio), Save.
   ========================================================================== */

export interface LearningPreferencesFormProps {
  selectedCountries: string[];
  interests: string[];
  difficulty: ProfileDifficulty;
  onSave?: (payload: {
    selectedCountries: string[];
    interests: string[];
    difficulty: ProfileDifficulty;
  }) => void;
}

export const LearningPreferencesForm: React.FC<LearningPreferencesFormProps> = ({
  selectedCountries: initialCountries,
  interests: initialInterests,
  difficulty: initialDifficulty,
  onSave,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    () => initialCountries
  );
  const [interests, setInterests] = useState<string[]>(() => initialInterests);
  const [difficulty, setDifficulty] = useState<ProfileDifficulty>(initialDifficulty);

  const toggleCountry = useCallback((code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }, []);

  const handleSave = useCallback(() => {
    onSave?.({ selectedCountries, interests, difficulty });
  }, [selectedCountries, interests, difficulty, onSave]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>Learning preferences</div>
      <div className={styles.content}>
        <section className={styles.section} aria-labelledby="pref-countries">
          <h2 id="pref-countries" className={styles.sectionTitle}>
            Selected countries
          </h2>
          <div className={styles.countriesList}>
            {SAMPLE_COUNTRIES.map(({ code, label }) => (
              <label key={code} className={styles.countryItem}>
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(code)}
                  onChange={() => toggleCountry(code)}
                />
                <span className={styles.countryCheck} aria-hidden />
                <span className={styles.countryLabel}>
                  <img
                    src={`/assets/icons/countries/${code}.svg`}
                    alt=""
                    className={styles.flag}
                    width={20}
                    height={14}
                  />
                  {label}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="pref-interests">
          <h2 id="pref-interests" className={styles.sectionTitle}>
            Interests
          </h2>
          <div className={styles.chips}>
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                className={
                  interests.includes(interest)
                    ? `${styles.chip} ${styles.chipSelected}`
                    : styles.chip
                }
                onClick={() => toggleInterest(interest)}
                aria-pressed={interests.includes(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="pref-difficulty">
          <h2 id="pref-difficulty" className={styles.sectionTitle}>
            Difficulty
          </h2>
          <div className={styles.radioGroup}>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="profile-difficulty"
                  value={opt.value}
                  checked={difficulty === opt.value}
                  onChange={() => setDifficulty(opt.value)}
                />
                <span className={styles.radioDot} aria-hidden />
                <span className={styles.radioLabel}>{opt.label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
      <div className={styles.footer}>
        <Button variant="primary" size="md" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
