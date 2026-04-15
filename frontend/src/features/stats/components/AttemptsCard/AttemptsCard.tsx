import React from 'react';
import { Card, CardContent, CardHeader } from '../../../../components/ui';
import type { AttemptsHeatmap } from '../../types';
import styles from './AttemptsCard.module.css';

/* --------------------------------------------------------------------------
   Contribution heatmap coloring (gamification / streak-style)
   0 = default, 1-15 = light gray, 16-45 = light green, 46-85 = medium green, 86+ = dark green
   -------------------------------------------------------------------------- */

function getContributionClass(count: number): string {
  if (count <= 0) return styles.cellTier0;
  if (count <= 15) return styles.cellTier1;
  if (count <= 45) return styles.cellTier2;
  if (count <= 85) return styles.cellTier3;
  return styles.cellTier4;
}

/* --------------------------------------------------------------------------
   Heatmap grid (small squares, color by attempt count)
   -------------------------------------------------------------------------- */

function HeatmapGrid({
  cells,
  columns,
  rows,
  ariaLabel,
}: {
  cells: number[];
  columns: number;
  rows: number;
  ariaLabel: string;
}) {
  const total = columns * rows;
  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${columns}, 10px)` }}
      role="img"
      aria-label={ariaLabel}
    >
      {cells.slice(0, total).map((count, i) => (
        <span
          key={i}
          className={[styles.cell, getContributionClass(count)].filter(Boolean).join(' ')}
          title={count > 0 ? `${count} attempt${count !== 1 ? 's' : ''}` : undefined}
        />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   AttemptsCard props
   -------------------------------------------------------------------------- */

export interface AttemptsCardProps {
  attempts: AttemptsHeatmap;
  className?: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

const TODAY_COLS = 20;
const TODAY_ROWS = 5;
const WEEK_COLS = 20;
const WEEK_ROWS = 10;

export const AttemptsCard: React.FC<AttemptsCardProps> = ({
  attempts,
  className,
}) => {
  const todayTotal = attempts.today.reduce((s, n) => s + n, 0);
  const weekTotal = attempts.week.reduce((s, n) => s + n, 0);

  return (
    <Card className={[styles.card, className].filter(Boolean).join(' ')}>
      <CardHeader className={styles.header}>
        <h3 className={styles.title}>Practice Attempts</h3>
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Today</span>
              <span className={styles.attemptsCount}>
                {todayTotal} Attempt{todayTotal !== 1 ? 's' : ''}
              </span>
            </div>
            <HeatmapGrid
              cells={attempts.today}
              columns={TODAY_COLS}
              rows={TODAY_ROWS}
              ariaLabel={`Today: ${todayTotal} practice attempts`}
            />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>This Week</span>
              <span className={styles.attemptsCount}>
                {weekTotal} Attempt{weekTotal !== 1 ? 's' : ''}
              </span>
            </div>
            <HeatmapGrid
              cells={attempts.week}
              columns={WEEK_COLS}
              rows={WEEK_ROWS}
              ariaLabel={`This week: ${weekTotal} practice attempts`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
