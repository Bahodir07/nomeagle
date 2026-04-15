import React from "react";
import styles from "./ModuleSection.module.css";

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ---------- Props ---------- */

export interface ModuleSectionProps {
  title: string;
  rangeLabel: string;
  completedCount?: number;
  totalCount?: number;
  children: React.ReactNode;
  className?: string;
}

/* ---------- Component ---------- */

export const ModuleSection: React.FC<ModuleSectionProps> = ({
  title,
  rangeLabel,
  completedCount,
  totalCount,
  children,
  className,
}) => {
  const showProgress =
    completedCount !== undefined && totalCount !== undefined && totalCount > 0;

  return (
    <section className={cx(styles.section, className)}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.sectionRange}>Lessons {rangeLabel}</span>
        {showProgress && (
          <span className={styles.sectionProgress}>
            {completedCount} / {totalCount}
          </span>
        )}
      </div>
      {children}
    </section>
  );
};
