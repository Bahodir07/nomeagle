import React, { useCallback, useEffect, useState } from "react";
import { Loading, ErrorState } from "../../../components/feedback";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useAchievements, CategorySection } from "../../../features/achievements";
import styles from "./AchievementsPage.module.css";

type PageStatus = "loading" | "success" | "error";

/* ==========================================================================
   Achievements Page
   Title, subtitle, summary bar (unlocked/total, streak, countries), categories.
   States: loading skeleton, error with retry, success content.
   ========================================================================== */

export const AchievementsPage: React.FC = () => {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { groupedByCategory, summary } = useAchievements();

  const load = useCallback(() => {
    setStatus("loading");
    setErrorMessage("");
    // Simulate fetch; replace with real API when available.
    const t = setTimeout(() => setStatus("success"), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return load();
  }, [load]);

  const handleRetry = useCallback(() => {
    load();
  }, [load]);

  if (status === "loading") {
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

  if (status === "error") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Achievements</h1>
          <p className={styles.subtitle}>
            Unlock badges by exploring cultures and learning consistently.
          </p>
        </div>
        <ErrorState
          message={errorMessage || "Failed to load achievements."}
          onRetry={handleRetry}
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

