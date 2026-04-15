import React from 'react';
import styles from './Button.module.css';

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------- Button ---------- */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Height preset */
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}) => (
  <button
    type={type}
    className={cx(styles.button, styles[variant], styles[size], className)}
    {...rest}
  >
    {children}
  </button>
);
