import React from 'react';
import styles from './SettingsSectionCard.module.css';

/* ==========================================================================
   SettingsSectionCard
   Generic card with title, optional description, and content slot.
   ========================================================================== */

export interface SettingsSectionCardProps {
  /** Section title */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Card content */
  children: React.ReactNode;
  /** Optional className for the root */
  className?: string;
}

export const SettingsSectionCard: React.FC<SettingsSectionCardProps> = ({
  title,
  description,
  children,
  className,
}) => {
  const cx = (...classes: (string | undefined | false)[]) =>
    classes.filter(Boolean).join(' ');

  const titleId = title.replace(/\s+/g, '-').toLowerCase();
  const descId = description ? `${titleId}-desc` : undefined;

  return (
    <section
      className={cx(styles.card, className)}
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {description && (
          <p id={descId} className={styles.description}>
            {description}
          </p>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
};
