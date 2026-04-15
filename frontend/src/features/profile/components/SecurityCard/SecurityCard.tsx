import React, { useState, useCallback } from 'react';
import { Button } from '../../../../components/ui/Button';
import styles from './SecurityCard.module.css';

const MIN_PASSWORD_LENGTH = 8;

/* ==========================================================================
   SecurityCard
   Change password: current, new, confirm. Validate match + min length 8.
   ========================================================================== */

export interface SecurityCardProps {
  onUpdatePassword?: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ onUpdatePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  const validate = useCallback((): boolean => {
    const next: typeof errors = {};
    if (!currentPassword.trim()) {
      next.current = 'Current password is required.';
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      next.new =
        newPassword.length > 0
          ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
          : 'New password is required.';
    }
    if (newPassword !== confirmPassword) {
      next.confirm =
        confirmPassword.length > 0 ? 'Passwords do not match.' : 'Please confirm your new password.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onUpdatePassword?.({
      currentPassword,
      newPassword,
    });
  }, [currentPassword, newPassword, confirmPassword, validate, onUpdatePassword]);

  const confirmError = errors.confirm;
  const newError = errors.new;
  const currentError = errors.current;

  return (
    <div className={styles.card}>
      <div className={styles.header}>Security</div>
      <div className={styles.content}>
        <div className={styles.field}>
          <label htmlFor="security-current-password" className={styles.label}>
            Current password
          </label>
          <input
            id="security-current-password"
            type="password"
            autoComplete="current-password"
            className={`${styles.input} ${currentError ? styles.inputError : ''}`}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (errors.current) setErrors((p) => ({ ...p, current: undefined }));
            }}
            placeholder="Enter current password"
          />
          {currentError && <span className={styles.error}>{currentError}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="security-new-password" className={styles.label}>
            New password
          </label>
          <input
            id="security-new-password"
            type="password"
            autoComplete="new-password"
            className={`${styles.input} ${newError ? styles.inputError : ''}`}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.new) setErrors((p) => ({ ...p, new: undefined }));
              if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined }));
            }}
            placeholder="At least 8 characters"
          />
          <span className={styles.helper}>
            Minimum {MIN_PASSWORD_LENGTH} characters.
          </span>
          {newError && <span className={styles.error}>{newError}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="security-confirm-password" className={styles.label}>
            Confirm new password
          </label>
          <input
            id="security-confirm-password"
            type="password"
            autoComplete="new-password"
            className={`${styles.input} ${confirmError ? styles.inputError : ''}`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined }));
            }}
            placeholder="Confirm new password"
          />
          {confirmError && <span className={styles.error}>{confirmError}</span>}
        </div>
      </div>
      <div className={styles.footer}>
        <Button variant="primary" size="md" onClick={handleSubmit}>
          Update password
        </Button>
      </div>
    </div>
  );
};
