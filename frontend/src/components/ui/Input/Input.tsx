import React from 'react';
import styles from './Input.module.css';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[styles.input, error && styles.error, className]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={!!error}
          {...rest}
        />
        {error && <span className={styles.errorText}>{error}</span>}
        {!error && helperText && (
          <span className={styles.helper}>{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
