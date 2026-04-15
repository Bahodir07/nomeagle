import React from 'react';
import { SpeedCard, PracticeTimeCard, AttemptsCard } from '../../../features/stats/components';
import { CulturalMasteryCard } from '../../../features/statistics/components/CulturalMasteryCard/CulturalMasteryCard';
import { getMockStats } from '../../../features/stats/mock/stats.mock';
import styles from './StatisticsPage.module.css';

const mockMasteryData = [
  { countryCode: 'US', score: 85, recallScore: 8, breakdown: { landmarks: 90, traditions: 80, language: 85 } },
  { countryCode: 'JP', score: 100, recallScore: 10, breakdown: { landmarks: 100, traditions: 100, language: 100 } },
  { countryCode: 'BR', score: 40, recallScore: 4, breakdown: { landmarks: 55, traditions: 30, language: 35 } },
  { countryCode: 'FR', score: 65, recallScore: 6, breakdown: { landmarks: 80, traditions: 50, language: 65 } },
  { countryCode: 'GB', score: 30, recallScore: 3, breakdown: { landmarks: 40, traditions: 20, language: 30 } },
  { countryCode: 'IN', score: 10, recallScore: 2, breakdown: { landmarks: 15, traditions: 5, language: 10 } },
  { countryCode: 'AU', score: 90, recallScore: 9, breakdown: { landmarks: 95, traditions: 85, language: 90 } },
  { countryCode: 'ZA', score: 55, recallScore: 5, breakdown: { landmarks: 60, traditions: 45, language: 60 } },
  { countryCode: 'CN', score: 0, recallScore: 0, breakdown: { landmarks: 0, traditions: 0, language: 0 } },
  { countryCode: 'RU', score: 0, recallScore: 0, breakdown: { landmarks: 0, traditions: 0, language: 0 } },
];


/* ==========================================================================
   Statistics Page
   Top row: Speed + Accuracy/Coverage, Practice Time donut, Practice Attempts.
   ========================================================================== */

export const StatisticsPage: React.FC = () => {
  const stats = getMockStats();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Statistics</h2>
        <p className={styles.subtitle}>Your progress and stats.</p>
      </div>
      <div className={styles.cardsRow}>
        <SpeedCard
          xpLevel={stats.xpLevel}
          accuracyCoverage={stats.accuracyCoverage}
        />
        <PracticeTimeCard practiceTime={stats.practiceTime} />
        <AttemptsCard attempts={stats.attempts} />
      </div>

      <div className={styles.mapSection} style={{ marginTop: 'var(--ne-6)' }}>
        <CulturalMasteryCard data={mockMasteryData} />
      </div>
    </div>
  );
};
