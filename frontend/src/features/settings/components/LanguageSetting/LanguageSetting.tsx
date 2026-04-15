import React from 'react';
import styles from './LanguageSetting.module.css';
import type { SettingsLanguage } from '../../types';

/* ==========================================================================
   LanguageSetting
   Select dropdown for language: EN / RU / KK.
   ========================================================================== */

const OPTIONS: { value: SettingsLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'kk', label: 'Kazakh' },
];

export interface LanguageSettingProps {
  value: SettingsLanguage;
  onChange: (language: SettingsLanguage) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const LanguageSetting: React.FC<LanguageSettingProps> = ({
  value,
  onChange,
  disabled = false,
  id = 'settings-language',
  className,
}) => {
  const cx = (...classes: (string | undefined | false)[]) =>
    classes.filter(Boolean).join(' ');

  return (
    <div className={cx(styles.wrapper, className)}>
      <label htmlFor={id} className={styles.label}>
        Language
      </label>
      <div className={styles.selectWrapper}>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as SettingsLanguage)}
          disabled={disabled}
          className={styles.select}
          aria-label="Language"
          aria-describedby={`${id}-hint`}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          &#9662;
        </span>
      </div>
      <span id={`${id}-hint`} className={styles.hint}>
        App language
      </span>
    </div>
  );
};
