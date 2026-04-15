import React from 'react';
import styles from './AudioSetting.module.css';

/* ==========================================================================
   AudioSetting
   Two toggles: SFX and Autoplay. Minimal custom switch.
   ========================================================================== */

export interface AudioSettingProps {
  sfxEnabled: boolean;
  autoplayAudio: boolean;
  onSfxChange: (enabled: boolean) => void;
  onAutoplayChange: (enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

interface ToggleRowProps {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
  disabled,
}: ToggleRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.labelBlock}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? 'on' : 'off'}`}
        className={styles.toggle}
        data-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </button>
    </div>
  );
}

export const AudioSetting: React.FC<AudioSettingProps> = ({
  sfxEnabled,
  autoplayAudio,
  onSfxChange,
  onAutoplayChange,
  disabled = false,
  className,
}) => {
  const cx = (...classes: (string | undefined | false)[]) =>
    classes.filter(Boolean).join(' ');

  return (
    <div className={cx(styles.container, className)} role="group" aria-label="Audio settings">
      <ToggleRow
        id="settings-sfx"
        label="Sound effects"
        hint="Clicks and feedback sounds"
        checked={sfxEnabled}
        onChange={onSfxChange}
        disabled={disabled}
      />
      <ToggleRow
        id="settings-autoplay"
        label="Autoplay audio"
        hint="Play pronunciation when viewing a country"
        checked={autoplayAudio}
        onChange={onAutoplayChange}
        disabled={disabled}
      />
    </div>
  );
};
