import React from 'react';
import styles from './SearchInput.module.css';

/* ==========================================================================
   SearchInput
   Rounded text input with search icon on the right (end). Edclub-style shadow/border.
   ========================================================================== */

/* ==========================================================================
   Icon Path Map
   Put real filename from /public/assets/icons/actions/ here
   ========================================================================== */
const ICON_PATHS = {
  /** Search icon shown on the right (end) inside the input */
  search: '/assets/icons/actions/search_country.svg',
} as const;

const ICON_SIZE = 24; /* Slightly bigger icon */

/* ---------- Props ---------- */

export interface SearchInputProps {
  /** Controlled value */
  value: string;
  /** Called when the user types (filtered text input) */
  onChange: (value: string) => void;
  /** Placeholder when empty */
  placeholder?: string;
  /** Optional id for the input (for a11y) */
  id?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Extra class on the wrapper */
  className?: string;
}

/* ---------- Component ---------- */

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search a country...',
  id,
  disabled = false,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <input
        type="text"
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.input}
        aria-label={placeholder}
        autoComplete="off"
      />
      <span className={styles.icon} aria-hidden="true">
        <img
          src={ICON_PATHS.search}
          alt=""
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      </span>
    </div>
  );
};
