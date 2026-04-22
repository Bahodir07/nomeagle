import React, { useRef, useState } from 'react';
import { Avatar } from '../../../../components/ui/Avatar';
import styles from './ProfileHeader.module.css';

export interface ProfileHeaderProps {
  displayName: string;
  subtitle?: string;
  avatarUrl?: string;
  onAvatarUpload?: (file: File) => void;
  className?: string;
}

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  subtitle,
  avatarUrl,
  onAvatarUpload,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onAvatarUpload?.(file);
    e.target.value = '';
  };

  const displaySrc = preview ?? avatarUrl;

  return (
    <header className={cx(styles.wrap, className)}>
      <div className={styles.avatarWrap}>
        <Avatar
          src={displaySrc}
          name={displayName}
          size="xl"
          className={styles.avatar}
        />
        {onAvatarUpload && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={styles.fileInput}
              aria-label="Upload avatar"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => inputRef.current?.click()}
              aria-label="Upload new avatar"
            >
              <svg
                className={styles.editBtnIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span className={styles.editBtnLabel}>Change</span>
            </button>
          </>
        )}
      </div>
      <h1 className={styles.name}>{displayName}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
};
