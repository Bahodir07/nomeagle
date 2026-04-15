import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string; // fallback initials
  size?: 'sm' | 'md' | 'lg';
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className,
  ...rest
}) => {
  const cls = [styles.avatar, styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      {src ? (
        <img src={src} alt={alt ?? name ?? 'avatar'} className={styles.img} />
      ) : (
        <span className={styles.initials}>
          {name ? getInitials(name) : '?'}
        </span>
      )}
    </div>
  );
};
