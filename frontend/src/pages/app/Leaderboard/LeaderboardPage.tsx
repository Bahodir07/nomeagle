import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../../../components/ui';
import { Loading, ErrorState } from '../../../components/feedback';
import {
  LeaderboardFilters,
  LeaderboardTable,
  YourRankCard,
} from '../../../features/leaderboard/components';
import type { LeaderboardTimeRange } from '../../../features/leaderboard/types';
import { sortAndRank } from '../../../features/leaderboard/utils/ranking';
import { getLeaderboard } from '../../../app/api/progress';
import styles from './LeaderboardPage.module.css';

export const LeaderboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<LeaderboardTimeRange>('week');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leaderboard', timeRange],
    queryFn: () => getLeaderboard(timeRange),
  });

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

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Leaderboard</h1>
        <p className={styles.subtitle}>Compare progress and stay motivated.</p>
      </header>

      {isLoading ? (
        <Card>
          <CardContent>
            <Loading rows={4} columns={1} blockHeight={56} showHeading={false} className={styles.loading} />
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent>
            <ErrorState message="Failed to load leaderboard. Please try again." onRetry={() => refetch()} />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className={styles.filtersRow}>
            <LeaderboardFilters
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <p className={styles.helpText}>Filter by time range or search by name.</p>
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
              <YourRankCard rank={currentUserRank} entry={currentUserEntry} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
};
