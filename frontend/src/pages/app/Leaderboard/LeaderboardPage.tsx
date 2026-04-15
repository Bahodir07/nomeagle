import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '../../../components/ui';
import { Loading, ErrorState } from '../../../components/feedback';
import {
  LeaderboardFilters,
  LeaderboardTable,
  YourRankCard,
} from '../../../features/leaderboard/components';
import type { LeaderboardTimeRange, LeaderboardResponse } from '../../../features/leaderboard/types';
import { getMockLeaderboard } from '../../../features/leaderboard/mock/leaderboard.mock';
import { sortAndRank } from '../../../features/leaderboard/utils/ranking';
import styles from './LeaderboardPage.module.css';

/* --------------------------------------------------------------------------
   Simulate loading/error for UI development. Set to true to test error state.
   -------------------------------------------------------------------------- */
const SIMULATE_ERROR = false;
const LOAD_DELAY_MS = 600;

/* ==========================================================================
   Leaderboard Page
   Layout: Header | Filters row | Grid (Table 2/3 | YourRankCard 1/3).
   States: loading, error, success (with empty when filter returns 0).
   ========================================================================== */

export const LeaderboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeaderboardResponse | null>(null);

  const [timeRange, setTimeRange] = useState<LeaderboardTimeRange>('week');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    setData(null);

    const timer = setTimeout(() => {
      if (SIMULATE_ERROR) {
        setError('Failed to load leaderboard. Please try again.');
        setLoading(false);
        return;
      }
      const response = getMockLeaderboard(timeRange);
      setData(response);
      setLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [timeRange]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredEntries = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.entries;
    return data.entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [data, searchQuery]);

  const { currentUserRank, currentUserEntry } = useMemo(() => {
    if (!data || filteredEntries.length === 0) return { currentUserRank: null, currentUserEntry: null };
    const ranked = sortAndRank(filteredEntries);
    const item = ranked.find((r) => r.entry.userId === data.currentUserId);
    if (!item) return { currentUserRank: null, currentUserEntry: null };
    return { currentUserRank: item.rank, currentUserEntry: item.entry };
  }, [data, filteredEntries]);

  const handleRetry = useCallback(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>Compare progress and stay motivated.</p>
        </header>
        <Card>
          <CardContent>
            <Loading
              rows={4}
              columns={1}
              blockHeight={56}
              showHeading={false}
              className={styles.loading}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>Compare progress and stay motivated.</p>
        </header>
        <Card>
          <CardContent>
            <ErrorState message={error} onRetry={handleRetry} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Leaderboard</h1>
        <p className={styles.subtitle}>Compare progress and stay motivated.</p>
      </header>

      <div className={styles.filtersRow}>
        <LeaderboardFilters
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <p className={styles.helpText}>
          Filter by time range or search by name.
        </p>
      </div>

      <div className={styles.grid}>
        <section className={styles.main} aria-label="Leaderboard table">
          <Card>
            <CardContent className={styles.tableCardContent}>
              <LeaderboardTable
                entries={filteredEntries}
                currentUserId={data!.currentUserId}
                emptyMessage="No one matches your search. Try a different name or time range."
              />
            </CardContent>
          </Card>
        </section>
        <aside className={styles.aside} aria-label="Your rank">
          <YourRankCard
            rank={currentUserRank}
            entry={currentUserEntry}
          />
        </aside>
      </div>
    </div>
  );
};
