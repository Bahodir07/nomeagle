import React from 'react';
import styles from './NotificationSetting.module.css';

/* ==========================================================================
   NotificationSetting
   Single toggle: Daily reminder. Reuses minimal switch style.
   ========================================================================== */

export interface NotificationSettingProps {
  dailyReminderEnabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const NotificationSetting: React.FC<NotificationSettingProps> = ({
  dailyReminderEnabled,
  onChange,
  disabled = false,
  className,
}) => {
  const cx = (...classes: (string | undefined | false)[]) =>
    classes.filter(Boolean).join(' ');

  return (
    <div
      className={cx(styles.container, className)}
      role="group"
      aria-label="Daily reminder"
    >
      <div className={styles.row}>
        <div className={styles.labelBlock}>
          <label htmlFor="settings-daily-reminder" className={styles.label}>
            Daily reminder
          </label>
          <span className={styles.hint}>Get a reminder to practice each day</span>
        </div>
        <button
          type="button"
          id="settings-daily-reminder"
          role="switch"
          aria-checked={dailyReminderEnabled}
          aria-label={`Daily reminder: ${dailyReminderEnabled ? 'on' : 'off'}`}
          className={styles.toggle}
          data-checked={dailyReminderEnabled}
          onClick={() => !disabled && onChange(!dailyReminderEnabled)}
          disabled={disabled}
        >
          <span className={styles.track}>
            <span className={styles.thumb} />
          </span>
        </button>
      </div>
    </div>
  );
};
