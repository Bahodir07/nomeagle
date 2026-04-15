import React from 'react';
import styles from './Stat.module.css';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  helpText?: string;
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  helpText,
  className,
  ...rest
}) => (
  <div
    className={[styles.stat, className].filter(Boolean).join(' ')}
    {...rest}
  >
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
    {helpText && <span className={styles.help}>{helpText}</span>}
  </div>
);
