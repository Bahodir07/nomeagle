/* ==========================================================================
   Settings Feature — Mock Data
   Realistic user settings for UI development without a backend.
   ========================================================================== */

import type { UserSettings } from '../types';

/* --------------------------------------------------------------------------
   Mock: Current user settings (realistic values)
   -------------------------------------------------------------------------- */

export const MOCK_USER_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'en',
  sfxEnabled: true,
  autoplayAudio: false,
  dailyReminderEnabled: true,
};

/** Returns the mock settings. Use when components expect a getter. */
export function getMockSettings(): UserSettings {
  return MOCK_USER_SETTINGS;
}
