import React from 'react';
import { SearchInput } from '../../../../components/ui';
import type { LeaderboardTimeRange } from '../../types';
import styles from './LeaderboardFilters.module.css';

/* ==========================================================================
   LeaderboardFilters
   Time range segmented control + search by name. Reusable LEGO block.
   ========================================================================== */

const TIME_RANGE_OPTIONS: { value: LeaderboardTimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All time' },
];

export interface LeaderboardFiltersProps {
  timeRange: LeaderboardTimeRange;
  onTimeRangeChange: (timeRange: LeaderboardTimeRange) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  /** Optional: disable filters (e.g. while loading) */
  disabled?: boolean;
  /** Optional: hide search (e.g. on very small screens) */
  showSearch?: boolean;
  className?: string;
}

export const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  timeRange,
  onTimeRangeChange,
  searchQuery,
  onSearchChange,
  disabled = false,
  showSearch = true,
  className,
}) => {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <div
        className={styles.segmented}
        role="group"
        aria-label="Time range"
      >
        {TIME_RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={[styles.segment, timeRange === opt.value && styles.segmentActive].filter(Boolean).join(' ')}
            onClick={() => onTimeRangeChange(opt.value)}
            disabled={disabled}
            aria-pressed={timeRange === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {showSearch && (
        <div className={styles.search}>
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by name..."
            disabled={disabled}
            id="leaderboard-search"
          />
        </div>
      )}
    </div>
  );
};
