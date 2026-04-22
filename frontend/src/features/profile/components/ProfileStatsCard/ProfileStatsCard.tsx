import React from 'react';
import styles from './ProfileStatsCard.module.css';

export interface ProfileStatsCardProps {
  level: number;
  xp: number;
  streakDays: number;
  selectedCountriesCount: number;
}

const stats = (level: number, xp: number, streakDays: number, countries: number) => [
  {
    key: 'level',
    value: level,
    label: 'Level',
    colorClass: styles.accentBlue,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    key: 'xp',
    value: xp.toLocaleString(),
    label: 'XP',
    colorClass: styles.accentAmber,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    key: 'streak',
    value: streakDays,
    label: 'Streak',
    colorClass: styles.accentOrange,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2c0 6-6 8-6 13a6 6 0 0 0 12 0c0-5-6-7-6-13Z" />
        <path d="M12 12c0 3-2 4-2 6a2 2 0 0 0 4 0c0-2-2-3-2-6Z" />
      </svg>
    ),
  },
  {
    key: 'countries',
    value: countries,
    label: 'Countries',
    colorClass: styles.accentGreen,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  level,
  xp,
  streakDays,
  selectedCountriesCount,
}) => (
  <div className={styles.grid}>
    {stats(level, xp, streakDays, selectedCountriesCount).map((s) => (
      <div key={s.key} className={`${styles.tile} ${s.colorClass}`}>
        <div className={styles.iconWrap}>
          {s.icon}
        </div>
        <div className={styles.textWrap}>
          <span className={styles.value}>{s.value}</span>
          <span className={styles.label}>{s.label}</span>
        </div>
      </div>
    ))}
  </div>
);
