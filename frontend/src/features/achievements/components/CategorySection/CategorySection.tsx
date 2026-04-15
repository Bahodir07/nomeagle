import React, { useState, useCallback } from "react";
import type { BadgeWithDefinition } from "../../hooks/useAchievements";
import { BadgeCard } from "../BadgeCard/BadgeCard";
import { BadgeModal } from "../BadgeModal/BadgeModal";
import styles from "./CategorySection.module.css";

const CATEGORY_TITLES: Record<string, string> = {
  explorer: "Explorer",
  country: "Country",
  mastery: "Mastery",
  streak: "Streak",
};

export interface CategorySectionProps {
  category: keyof typeof CATEGORY_TITLES;
  badges: BadgeWithDefinition[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  badges,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithDefinition | null>(null);
  const openModal = useCallback((badge: BadgeWithDefinition) => {
    setSelectedBadge(badge);
  }, []);
  const closeModal = useCallback(() => {
    setSelectedBadge(null);
  }, []);

  const title = CATEGORY_TITLES[category] ?? category;
  const sorted = [...badges].sort((a, b) => a.order - b.order);

  const titleId = `achievements-${category}`;
  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <div className={styles.grid}>
        {sorted.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            onClick={() => openModal(badge)}
          />
        ))}
      </div>
      <BadgeModal
        open={selectedBadge !== null}
        onClose={closeModal}
        badge={selectedBadge}
      />
    </section>
  );
};
