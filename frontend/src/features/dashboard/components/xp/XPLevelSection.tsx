import React from 'react';
import { RunnerIcon } from '../../../../assets/icons/status/RunnerIcon';
import styles from './XPLevelSection.module.css';

/* ==========================================================================
   XPLevelSection — Gamified XP progress bar with running-man icon

   Design (matches reference):
   - Sharp 90° rectangle bar (no rounded corners)
   - Solid green fill
   - Runner icon at the fill's leading edge
   - Runner's body extends ABOVE the bar
   - Bar height is at the runner's leg level
   ========================================================================== */

/* ---------- Helpers ---------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* ---------- Props ---------- */

export interface XPLevelSectionProps {
  /** Current user level */
  level: number;
  /** XP earned within this level */
  xpCurrent: number;
  /** XP needed to complete this level (total, not remaining) */
  xpGoal: number;
}

/* ---------- Component ---------- */

export const XPLevelSection: React.FC<XPLevelSectionProps> = ({
  level,
  xpCurrent,
  xpGoal,
}) => {
  const pct = clamp((xpCurrent / xpGoal) * 100, 0, 100);
  const xpRemaining = Math.max(0, xpGoal - xpCurrent);

  return (
    <div className={styles.root}>
      {/* ── Header row: level badge + XP count ────────────────── */}
      <div className={styles.header}>
        <div className={styles.levelBadge}>
          <span className={styles.levelIcon} aria-hidden="true">⚡</span>
          <span className={styles.levelText}>Level {level}</span>
        </div>
        <span className={styles.xpCount}>
          {xpCurrent.toLocaleString()}
          <span className={styles.xpSeparator}>/</span>
          {xpGoal.toLocaleString()} XP
        </span>
      </div>

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div className={styles.barWrapper}>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuenow={xpCurrent}
          aria-valuemin={0}
          aria-valuemax={xpGoal}
          aria-label={`Level ${level} progress: ${Math.round(pct)}%`}
        >
          {/* Green fill with runner at its right edge */}
          <div className={styles.fill} style={{ width: `${pct}%` }}>
            {/* Runner — anchored to bottom of fill, extends above the bar */}
            <div className={styles.runner}>
              <RunnerIcon size={28} color="#047857" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Remaining text ────────────────────────────────────── */}
      <span className={styles.remaining}>
        {xpRemaining.toLocaleString()} XP to next level
      </span>
    </div>
  );
};
