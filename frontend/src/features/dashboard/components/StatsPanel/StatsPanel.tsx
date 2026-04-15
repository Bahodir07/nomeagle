import React from 'react';
import type { UserStats } from '../../types';
import { UnifiedStatsCard } from '../UnifiedStatsCard';
import styles from './StatsPanel.module.css';

/* ---------- Props ---------- */

export interface StatsPanelProps {
  stats: UserStats;
  /** 7 booleans (Mon → Sun) for the streak week row */
  weekProgress?: boolean[];
}

/* ---------- Component ---------- */

/**
 * Right-column stats container (Edclub-style).
 * Renders a single unified stats card with all sections.
 */
export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  weekProgress,
}) => (
  <aside className={styles.panel} aria-label="Your statistics">
    <UnifiedStatsCard stats={stats} weekProgress={weekProgress} />
  </aside>
);
