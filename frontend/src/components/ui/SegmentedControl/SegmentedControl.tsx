import React from 'react';
import styles from './SegmentedControl.module.css';

/* --------------------------------------------------------------------------
   SegmentedControl option
   -------------------------------------------------------------------------- */

export interface SegmentedControlOption {
  value: string;
  label: string;
}

/* --------------------------------------------------------------------------
   SegmentedControl props
   -------------------------------------------------------------------------- */

export interface SegmentedControlProps {
  value: string;
  options: SegmentedControlOption[];
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  options,
  onChange,
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Options',
}) => {
  return (
    <div
      className={[styles.wrapper, styles[size], className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((opt, index) => {
        const isActive = opt.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={[
              styles.segment,
              isFirst && styles.first,
              isLast && styles.last,
              isActive && styles.active,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
