/* ==========================================================================
   Profile Feature — Mock Data
   Realistic user profile for UI development without a backend.
   ========================================================================== */

import type { UserProfile } from '../types';

/* --------------------------------------------------------------------------
   Mock: Current user profile (realistic values)
   -------------------------------------------------------------------------- */

export const MOCK_USER_PROFILE: UserProfile = {
  userId: 'user-17',
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatarUrl: '/assets/avatars/17.svg',
  bio: 'Learning Japanese and Italian. Love exploring traditions and local food.',
  level: 7,
  xp: 4820,
  streakDays: 12,
  selectedCountries: ['jp', 'it'],
  interests: ['Traditions', 'Food', 'Festivals', 'History', 'Language Basics'],
  difficulty: 'intermediate',
};

/** Alias for components that expect a getter; returns the same mock. */
export function getMockProfile(): UserProfile {
  return MOCK_USER_PROFILE;
}
