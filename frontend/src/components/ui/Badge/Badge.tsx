import React from 'react';
import styles from './Badge.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------- Badge ---------- */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Size preset */
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...rest
}) => (
  <span className={cx(styles.badge, styles[variant], styles[size], className)} {...rest}>
    {children}
  </span>
);
