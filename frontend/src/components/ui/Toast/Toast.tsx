import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export interface ToastProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  open: boolean;
  onClose: () => void;
  duration?: number; // ms, default 4000
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  open,
  onClose,
  duration = 4000,
  className,
}) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <div
      className={[styles.toast, styles[variant], className]
        .filter(Boolean)
        .join(' ')}
      role="alert"
    >
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Dismiss">
        &#10005;
      </button>
    </div>
  );
};
