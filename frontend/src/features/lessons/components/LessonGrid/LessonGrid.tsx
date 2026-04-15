import React from "react";
import styles from "./LessonGrid.module.css";

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ---------- Props ---------- */

export interface LessonGridProps {
  children: React.ReactNode;
  className?: string;
}

/* ---------- Component ---------- */

export const LessonGrid: React.FC<LessonGridProps> = ({
  children,
  className,
}) => (
  <div className={cx(styles.grid, className)}>
    {children}
  </div>
);
