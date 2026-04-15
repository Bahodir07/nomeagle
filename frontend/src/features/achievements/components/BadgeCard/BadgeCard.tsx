import React from "react";
import { Card } from "../../../../components/ui";
import { ProgressBar } from "../../../../components/ui/Progress";
import type { BadgeWithDefinition } from "../../hooks/useAchievements";
import styles from "./BadgeCard.module.css";

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface BadgeCardProps {
  badge: BadgeWithDefinition;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onClick }) => {
  const { unlocked, title, requirementText, unlockedImage, lockedImage, progress } = badge;
  const imageSrc = unlocked ? unlockedImage : lockedImage;

  return (
    <Card
      hoverable
      className={styles.card}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className={cx(styles.imageWrap, !unlocked && styles.imageWrapLocked)}>
        <img
          src={imageSrc}
          alt=""
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.requirement}>{requirementText}</p>
        {progress != null && progress.target > 0 && (
          <div className={styles.progressWrap}>
            <ProgressBar
              value={progress.current}
              max={progress.target}
              size="sm"
              color={unlocked ? "success" : "primary"}
              showLabel
            />
            <span className={styles.progressText}>
              {Math.min(progress.current, progress.target)}/{progress.target}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
