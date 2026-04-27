import React from "react";
import { AnimatePresence } from "framer-motion";
import { useBadgeUnlockNotifier } from "../../hooks/useBadgeUnlockNotifier";
import { BadgeUnlockToast } from "../BadgeUnlockToast/BadgeUnlockToast";

export const BadgeNotifier: React.FC = () => {
  const { current, dismiss } = useBadgeUnlockNotifier();

  return (
    <AnimatePresence>
      {current && (
        <BadgeUnlockToast key={current.id} badge={current} onDismiss={dismiss} />
      )}
    </AnimatePresence>
  );
};
