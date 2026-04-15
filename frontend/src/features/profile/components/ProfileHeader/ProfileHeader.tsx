import React from 'react';
import { Avatar } from '../../../../components/ui/Avatar';
import styles from './ProfileHeader.module.css';

/* ==========================================================================
   ProfileHeader
   Avatar, display name, small subtitle, edit avatar button.
   ========================================================================== */

export interface ProfileHeaderProps {
  displayName: string;
  subtitle?: string;
  avatarUrl?: string;
  onEditAvatar?: () => void;
  className?: string;
}

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  subtitle,
  avatarUrl,
  onEditAvatar,
  className,
}) => (
  <header className={cx(styles.wrap, className)}>
    <div className={styles.avatarWrap}>
      <Avatar
        src={avatarUrl}
        name={displayName}
        size="lg"
        className={styles.avatar}
      />
      {onEditAvatar && (
        <button
          type="button"
          className={styles.editBtn}
          onClick={onEditAvatar}
          aria-label="Edit avatar"
        >
          <img
            src="/assets/icons/actions/settings.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>
      )}
    </div>
    <h1 className={styles.name}>{displayName}</h1>
    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
  </header>
);
