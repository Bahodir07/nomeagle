import React, { useCallback, useEffect, useRef } from 'react';
import styles from './ViewToggle.module.css';

/* ==========================================================================
   ViewToggle
   Edclub-style segmented control for switching between list and grid views.
   ========================================================================== */

/* ---------- Icon paths ---------- */
const ICONS = {
  list: '/assets/icons/actions/menu.svg',
  grid: '/assets/icons/actions/grid.svg',
} as const;

/* ---------- Types ---------- */
export type ViewMode = 'list' | 'grid';

export interface ViewToggleProps {
  /** Current view mode */
  value: ViewMode;
  /** Callback when view mode changes */
  onChange: (mode: ViewMode) => void;
  /** Optional className for custom styling */
  className?: string;
}

/* ---------- Component ---------- */
export const ViewToggle: React.FC<ViewToggleProps> = ({
  value,
  onChange,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---- Keyboard accessibility: Escape closes any focus ---- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Escape') {
        e.currentTarget.blur();
      }
      // Arrow key navigation between toggle buttons
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newMode: ViewMode = value === 'list' ? 'grid' : 'list';
        onChange(newMode);
        // Focus the newly active button
        const container = containerRef.current;
        if (container) {
          const targetButton = container.querySelector(
            `[data-mode="${newMode}"]`
          ) as HTMLButtonElement | null;
          targetButton?.focus();
        }
      }
    },
    [value, onChange]
  );

  /* ---- Handle button click ---- */
  const handleClick = useCallback(
    (mode: ViewMode) => {
      if (mode !== value) {
        onChange(mode);
      }
    },
    [value, onChange]
  );

  const cx = (...classes: (string | undefined | false)[]) =>
    classes.filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={cx(styles.container, className)}
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        data-mode="list"
        className={cx(styles.button, value === 'list' && styles.active)}
        onClick={() => handleClick('list')}
        onKeyDown={handleKeyDown}
        aria-pressed={value === 'list'}
        aria-label="Switch to list view"
        title="List view"
      >
        <img
          src={ICONS.list}
          alt=""
          className={styles.icon}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        data-mode="grid"
        className={cx(styles.button, value === 'grid' && styles.active)}
        onClick={() => handleClick('grid')}
        onKeyDown={handleKeyDown}
        aria-pressed={value === 'grid'}
        aria-label="Switch to grid view"
        title="Grid view"
      >
        <img
          src={ICONS.grid}
          alt=""
          className={styles.icon}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};
