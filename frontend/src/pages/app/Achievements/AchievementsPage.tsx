import React from "react";
import { Loading, ErrorState } from "../../../components/feedback";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useAchievements, CategorySection } from "../../../features/achievements";
import styles from "./AchievementsPage.module.css";

export const AchievementsPage: React.FC = () => {
  const { groupedByCategory, summary, isLoading, isError, refetch } =
    useAchievements();

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Skeleton variant="text" width="40%" height={28} className={styles.titleSkeleton} />
          <Skeleton variant="text" width="70%" height={20} className={styles.subtitleSkeleton} />
        </div>
        <div className={styles.summarySkeleton}>
          <Skeleton variant="rect" height={56} className={styles.summaryBarSkeleton} />
        </div>
        <Loading
          rows={2}
          columns={4}
          blockHeight={200}
          showHeading={false}
          className={styles.loadingGrid}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Achievements</h1>
          <p className={styles.subtitle}>
            Unlock badges by exploring cultures and learning consistently.
          </p>
        </div>
        <ErrorState
          message="Failed to load achievements."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Achievements</h1>
        <p className={styles.subtitle}>
          Unlock badges by exploring cultures and learning consistently.
        </p>
      </div>

      <div className={styles.summaryBar} role="status" aria-label="Achievement summary">
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>
            {summary.unlockedCount}/{summary.totalCount}
          </span>
          <span className={styles.summaryLabel}>Badges unlocked</span>
        </div>
        <div className={styles.summaryDivider} aria-hidden="true" />
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{summary.currentStreakDays}</span>
          <span className={styles.summaryLabel}>Current streak (days)</span>
        </div>
        <div className={styles.summaryDivider} aria-hidden="true" />
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{summary.completedCountriesCount}</span>
          <span className={styles.summaryLabel}>Countries completed</span>
        </div>
      </div>

      <div className={styles.categories}>
        <CategorySection category="explorer" badges={groupedByCategory.explorer} />
        <CategorySection category="streak" badges={groupedByCategory.streak} />
        <CategorySection category="country" badges={groupedByCategory.country} />
        <CategorySection category="mastery" badges={groupedByCategory.mastery} />
      </div>
    </div>
  );
};
