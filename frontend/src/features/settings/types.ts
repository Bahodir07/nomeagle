/* ==========================================================================
   Settings Feature — Types
   Data shapes for user preferences (theme, language, audio, reminders).
   ========================================================================== */

/* --------------------------------------------------------------------------
   Theme
   -------------------------------------------------------------------------- */

export type ThemeMode = 'light' | 'dark' | 'system';

/* --------------------------------------------------------------------------
   Language
   -------------------------------------------------------------------------- */

export type SettingsLanguage = 'en' | 'ru' | 'kk';

/* --------------------------------------------------------------------------
   User Settings
   -------------------------------------------------------------------------- */

export interface UserSettings {
  theme: ThemeMode;
  language: SettingsLanguage;
  sfxEnabled: boolean;
  autoplayAudio: boolean;
  dailyReminderEnabled: boolean;
}
