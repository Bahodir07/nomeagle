import React from "react";
import { Modal } from "../../../../components/ui";
import type { BadgeWithDefinition } from "../../hooks/useAchievements";
import { ProgressBar } from "../../../../components/ui/Progress";
import styles from "./BadgeModal.module.css";

export interface BadgeModalProps {
  open: boolean;
  onClose: () => void;
  badge: BadgeWithDefinition | null;
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  open,
  onClose,
  badge,
}) => {
  if (!badge) return null;

  const {
    unlocked,
    unlockedAt,
    title,
    description,
    requirementText,
    unlockedImage,
    lockedImage,
    progress,
  } = badge;
  const imageSrc = unlocked ? unlockedImage : lockedImage;

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className={styles.body}>
        <div
          className={`${styles.imageWrap} ${!unlocked ? styles.imageWrapLocked : ""}`}
        >
          <img src={imageSrc} alt="" className={styles.image} />
        </div>
        <p className={styles.description}>{description}</p>

        {unlocked ? (
          <div className={styles.statusUnlocked}>
            <span className={styles.statusLabel}>Unlocked</span>
            {unlockedAt && (
              <span className={styles.date}>{formatDate(unlockedAt)}</span>
            )}
          </div>
        ) : (
          <div className={styles.statusLocked}>
            <p className={styles.howToUnlock}>{requirementText}</p>
            {progress != null && progress.target > 0 && (
              <div className={styles.progressBlock}>
                <ProgressBar
                  value={progress.current}
                  max={progress.target}
                  size="md"
                  color="primary"
                  showLabel
                />
                <span className={styles.progressDetail}>
                  {Math.min(progress.current, progress.target)} of {progress.target}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
