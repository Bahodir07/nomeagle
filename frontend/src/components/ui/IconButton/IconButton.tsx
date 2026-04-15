import React from 'react';
import styles from './IconButton.module.css';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** accessible label (required when content is icon-only) */
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'danger';
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'md',
  variant = 'default',
  className,
  children,
  ...rest
}) => {
  const cls = [styles.btn, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
};
