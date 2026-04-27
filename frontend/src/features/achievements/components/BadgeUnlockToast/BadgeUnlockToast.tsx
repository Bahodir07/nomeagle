import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { BadgeWithDefinition } from "../../hooks/useAchievements";
import styles from "./BadgeUnlockToast.module.css";

interface Props {
  badge: BadgeWithDefinition;
  onDismiss: () => void;
}

export const BadgeUnlockToast: React.FC<Props> = ({ badge, onDismiss }) => {
  useEffect(() => {
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.55 },
        disableForReducedMotion: true,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#f59e0b", "#fbbf24"] });
    fire(0.2,  { spread: 60, colors: ["#ef4444", "#f97316"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#fff", "#fde68a"] });
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1,  { spread: 120, startVelocity: 45 });

    const timer = setTimeout(onDismiss, 6000);
    return () => {
      clearTimeout(timer);
      confetti.reset();
    };
  }, [onDismiss]);

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onDismiss}
    >
      <motion.div
        className={styles.card}
        initial={{ scale: 0.6, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>

        <div className={styles.banner}>
          <span className={styles.bannerText}>Achievement Unlocked</span>
        </div>

        <motion.div
          className={styles.imageWrap}
          initial={{ scale: 0.5, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        >
          <img src={badge.unlockedImage} alt={badge.title} className={styles.image} />
        </motion.div>

        <div className={styles.body}>
          <h2 className={styles.title}>{badge.title}</h2>
          <p className={styles.description}>{badge.description}</p>
          <button className={styles.dismiss} onClick={onDismiss}>
            Awesome!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
