/* ==========================================================================
   Navigation Icon Paths
   Typed helper so components never hardcode icon file paths.

   Icons live in: public/assets/icons/navigation/
   Naming convention: <key>_sidebar.svg
   ========================================================================== */

/**
 * Known navigation icon names.
 * Each key maps to a filename in /assets/icons/navigation/.
 */
export const NAVIGATION_ICONS = {
  dashboard:    '/assets/icons/navigation/dashboard_sidebar.svg',
  map:          '/assets/icons/navigation/map_sidebar.svg',
  search:       '/assets/icons/navigation/search_sidebar.svg',
  statistics:   '/assets/icons/navigation/statistics_sidebar.svg',
  achievements: '/assets/icons/navigation/achievements_sidebar.svg',
  leaderboard:  '/assets/icons/navigation/leaderboard_sidebar.svg',
  profile:      '/assets/icons/navigation/profile_sidebar.svg',
  settings:     '/assets/icons/navigation/settings_sidebar.svg',
} as const;

export type NavigationIconName = keyof typeof NAVIGATION_ICONS;

/**
 * Get the path for a navigation icon by name.
 * Returns `undefined` when the name is not in the registry.
 */
export function getNavigationIconPath(
  name: string,
): string | undefined {
  return (NAVIGATION_ICONS as Record<string, string>)[name];
}
