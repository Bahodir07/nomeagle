/* ==========================================================================
   Profile Feature — Types
   Data shapes for user profile and preferences.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Difficulty
   -------------------------------------------------------------------------- */

export type ProfileDifficulty = 'beginner' | 'intermediate' | 'advanced';

/* --------------------------------------------------------------------------
   User Profile
   -------------------------------------------------------------------------- */

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  level: number;
  xp: number;
  streakDays: number;
  selectedCountries: string[];
  interests: string[];
  difficulty: ProfileDifficulty;
}
