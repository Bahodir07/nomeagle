import React, { useState, useCallback } from 'react';
import { Button } from '../../../../components/ui/Button';
import styles from './ProfileBasicsForm.module.css';

const BIO_MAX_LENGTH = 120;

/* ==========================================================================
   ProfileBasicsForm
   Display name (editable), email (read-only), bio (optional, max 120), Save.
   ========================================================================== */

export interface ProfileBasicsFormProps {
  displayName: string;
  email: string;
  bio?: string;
  onSave?: (payload: { displayName: string; bio: string }) => void;
}

export const ProfileBasicsForm: React.FC<ProfileBasicsFormProps> = ({
  displayName: initialDisplayName,
  email,
  bio: initialBio = '',
  onSave,
}) => {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [error, setError] = useState<string | null>(null);

  const bioLength = bio.length;
  const bioOver = bioLength > BIO_MAX_LENGTH;

  const handleSave = useCallback(() => {
    setError(null);
    if (bioOver) {
      setError(`Bio must be ${BIO_MAX_LENGTH} characters or less.`);
      return;
    }
    onSave?.({ displayName, bio });
  }, [displayName, bio, bioOver, onSave]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>Profile basics</div>
      <div className={styles.content}>
        <div className={styles.field}>
          <label htmlFor="profile-display-name" className={styles.label}>
            Display name
          </label>
          <input
            id="profile-display-name"
            type="text"
            className={styles.input}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
            maxLength={64}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="profile-email" className={styles.label}>
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            className={`${styles.input} ${styles.inputReadOnly}`}
            value={email}
            readOnly
            tabIndex={-1}
            aria-readonly="true"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="profile-bio" className={styles.label}>
            Bio (optional)
          </label>
          <textarea
            id="profile-bio"
            className={styles.textarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio..."
            maxLength={BIO_MAX_LENGTH + 10}
            rows={3}
          />
          <span
            className={
              bioOver ? `${styles.charCount} ${styles.charCountOver}` : styles.charCount
            }
          >
            {bioLength}/{BIO_MAX_LENGTH}
          </span>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </div>
      <div className={styles.footer}>
        <Button variant="primary" size="md" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
