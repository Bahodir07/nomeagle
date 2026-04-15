import React from 'react';
import styles from './RadioGroup.module.css';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  direction = 'vertical',
  className,
}) => (
  <fieldset
    className={[styles.fieldset, className].filter(Boolean).join(' ')}
  >
    {label && <legend className={styles.legend}>{label}</legend>}
    <div
      className={[styles.group, styles[direction]]
        .filter(Boolean)
        .join(' ')}
    >
      {options.map((opt) => (
        <label key={opt.value} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled}
            onChange={() => onChange?.(opt.value)}
            className={styles.input}
          />
          <span className={styles.radio} aria-hidden="true" />
          <span className={styles.label}>{opt.label}</span>
        </label>
      ))}
    </div>
  </fieldset>
);
