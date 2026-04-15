import React, { useCallback, useRef } from 'react';
import styles from './ThemeSetting.module.css';
import type { ThemeMode } from '../../types';

/* ==========================================================================
   ThemeSetting
   Segmented control for theme: Light / Dark / System.
   ========================================================================== */

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export interface ThemeSettingProps {
  value: ThemeMode;
  onChange: (theme: ThemeMode) => void;
  disabled?: boolean;
  className?: string;
}

export const ThemeSetting: React.FC<ThemeSettingProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Escape') {
        e.currentTarget.blur();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const idx = OPTIONS.findIndex((o) => o.value === value);
        if (idx < 0) return;
        const nextIdx =
          e.key === 'ArrowLeft'
            ? Math.max(0, idx - 1)
            : Math.min(OPTIONS.length - 1, idx + 1);
        const next = OPTIONS[nextIdx].value;
        onChange(next);
        const target = containerRef.current?.querySelector(
          `[data-theme="${next}"]`
        ) as HTMLButtonElement | null;
        target?.focus();
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
      aria-label="Theme"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          data-theme={opt.value}
          className={cx(styles.option, value === opt.value && styles.active)}
          onClick={() => onChange(opt.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-pressed={value === opt.value}
          aria-label={`Theme: ${opt.label}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
