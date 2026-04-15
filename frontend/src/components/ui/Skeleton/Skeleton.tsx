import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  className,
  style,
  ...rest
}) => {
  const cls = [styles.skeleton, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cls}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
};
