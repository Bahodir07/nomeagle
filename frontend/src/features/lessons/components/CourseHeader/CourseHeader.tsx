import React from "react";
import styles from "./CourseHeader.module.css";

export interface CourseHeaderProps {
    countryCode: string;
    countryName: string;
    completedCount: number;
    totalCount: number;
    progressPct: number;
    starsTotal: number;
    pointsTotal: number;

    flagUrl?: string | null;
    flagEmoji?: string | null;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
                                                              countryCode,
                                                              countryName,
                                                              completedCount,
                                                              totalCount,
                                                              progressPct,
                                                              starsTotal,
                                                              pointsTotal,
                                                              flagUrl,
                                                              flagEmoji,
                                                          }) => {
    const initial = countryName.charAt(0).toUpperCase();
    const localFlagPath = `/assets/icons/countries/${countryCode}.svg`;

    return (
        <section className={styles.header}>
            <div className={styles.identity}>
                <div className={styles.flagWrap}>
                    {flagUrl ? (
                        <img
                            src={flagUrl}
                            alt={`${countryName} flag`}
                            className={styles.flag}
                        />
                    ) : flagEmoji ? (
                        <span className={styles.flagEmoji} aria-label={`${countryName} flag`}>
              {flagEmoji}
            </span>
                    ) : (
                        <img
                            src={localFlagPath}
                            alt={`${countryName} flag`}
                            className={styles.flag}
                            onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                const fallback = target.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = "flex";
                            }}
                        />
                    )}

                    <span className={styles.flagFallback} style={{ display: "none" }}>
            {initial}
          </span>
                </div>

                <div className={styles.countryInfo}>
                    <h1 className={styles.countryName}>{countryName}</h1>
                    <p className={styles.subtitle}>Country Course</p>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.progressBlock}>
                    <div className={styles.progressMeta}>
                        <span className={styles.progressPct}>{progressPct}%</span>
                        <span className={styles.progressCount}>
              {completedCount} / {totalCount} lessons
            </span>
                    </div>

                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

                <div className={styles.badges}>
                    <div className={styles.badge}>
                        <span className={styles.badgeIcon}>⭐</span>
                        <span className={styles.badgeValue}>{starsTotal}</span>
                        <span className={styles.badgeLabel}>Stars</span>
                    </div>

                    <div className={styles.badge}>
                        <span className={styles.badgeIcon}>⚡</span>
                        <span className={styles.badgeValue}>{pointsTotal}</span>
                        <span className={styles.badgeLabel}>XP</span>
                    </div>
                </div>
            </div>
        </section>
    );
};