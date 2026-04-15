import React from 'react';
import styles from './Divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

export const Divider: React.FC<DividerProps> = ({
  spacing = 'md',
  className,
  ...rest
}) => (
  <hr
    className={[styles.divider, styles[spacing], className]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  />
);
