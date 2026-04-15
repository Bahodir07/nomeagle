import React, { useState, useCallback } from 'react';
import { Button, Modal } from '../../../../components/ui';
import styles from './AccountActions.module.css';

/* ==========================================================================
   AccountActions
   Logout and Delete account with confirmation modal. Placeholder handlers only.
   ========================================================================== */

const CONFIRM_TEXT = 'DELETE';

export interface AccountActionsProps {
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  className?: string;
}

export const AccountActions: React.FC<AccountActionsProps> = ({
  onLogout,
  onDeleteAccount,
  className,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const openDeleteModal = useCallback(() => setDeleteModalOpen(true), []);
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setConfirmInput('');
  }, []);

  const canConfirmDelete = confirmInput === CONFIRM_TEXT;

  const handleConfirmDelete = useCallback(() => {
    if (!canConfirmDelete) return;
    onDeleteAccount?.();
    closeDeleteModal();
  }, [canConfirmDelete, onDeleteAccount, closeDeleteModal]);

  const cx = (...classes: (string | undefined | false)[]) =>
    classes.filter(Boolean).join(' ');

  return (
    <>
      <div className={cx(styles.container, className)}>
        <Button
          variant="secondary"
          size="md"
          onClick={() => onLogout?.()}
          aria-label="Log out of your account"
        >
          Log out
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={openDeleteModal}
          aria-label="Delete account (opens confirmation)"
        >
          Delete account
        </Button>
      </div>

      <Modal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete account"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            This action cannot be undone. Type <strong>{CONFIRM_TEXT}</strong> to
            confirm.
          </p>
          <label htmlFor="delete-confirm-input" className={styles.inputLabel}>
            Confirmation
          </label>
          <input
            id="delete-confirm-input"
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={CONFIRM_TEXT}
            className={styles.confirmInput}
            autoComplete="off"
            aria-describedby="delete-confirm-hint"
            aria-invalid={confirmInput.length > 0 && !canConfirmDelete}
          />
          <span id="delete-confirm-hint" className={styles.inputHint}>
            Type {CONFIRM_TEXT} exactly to enable the confirm button.
          </span>
          <div className={styles.modalActions}>
            <Button variant="secondary" size="md" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleConfirmDelete}
              disabled={!canConfirmDelete}
              aria-label="Permanently delete account"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
