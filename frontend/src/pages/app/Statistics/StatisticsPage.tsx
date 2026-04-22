import React, { useCallback, useEffect, useState } from 'react';
import { SpeedCard, PracticeTimeCard, AttemptsCard } from '../../../features/stats/components';
import { CulturalMasteryCard } from '../../../features/statistics/components/CulturalMasteryCard/CulturalMasteryCard';
import { Loading, ErrorState } from '../../../components/feedback';
import { getStatistics, type StatisticsApiResponse } from '../../../app/api/progress';
import styles from './StatisticsPage.module.css';

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T };

export const StatisticsPage: React.FC = () => {
  const [state, setState] = useState<AsyncState<StatisticsApiResponse>>({ status: 'loading' });

  const loadStats = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await getStatistics();
      setState({ status: 'success', data });
    } catch (err) {
      setState({ status: 'error', error: String(err) });
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Statistics</h2>
        <p className={styles.subtitle}>Your progress and stats.</p>
      </div>

      {state.status === 'loading' && <Loading />}

      {state.status === 'error' && (
        <ErrorState message={state.error} onRetry={loadStats} />
      )}

      {state.status === 'success' && (
        <>
          <div className={styles.cardsRow}>
            <SpeedCard
              xpLevel={state.data.xpLevel}
              accuracyCoverage={state.data.accuracyCoverage}
            />
            <PracticeTimeCard practiceTime={state.data.practiceTime} />
            <AttemptsCard attempts={state.data.attempts} />
          </div>

          <div className={styles.mapSection} style={{ marginTop: 'var(--ne-6)' }}>
            <CulturalMasteryCard data={state.data.countryMastery} />
          </div>
        </>
      )}
    </div>
  );
};
